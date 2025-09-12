/* eslint-disable no-nested-ternary */
/* eslint-disable dot-notation */
/* eslint-disable max-len */
import algorithms from '../algorithms';
import Chunker from './chunker';
import React, { useState } from 'react';
import { getDefaultMode } from '../algorithms/masterList';

// Return block name for bookmark
function bookmarkBlock(bookmark, pseudocode) {
  // Need to search through the blocks to find the bookmark:( - would be
  // nice if there were more data structures built when pseudocode was read
  // to assist in operations such as this, and navigating the tree
  // structure of blocks XXX
  for (const blockName of Object.keys(pseudocode)) {
    for (let i = 0; i < pseudocode[blockName].length; i += 1) {
      // looking at all the pseudocode elements
      if (pseudocode[blockName][i].bookmark === bookmark) {
        return blockName;
      }
    }
  }
  throw new Error(`Cannot find bookmark ${bookmark}`);
}

// Returns list of ancestors blocks, from Main (first) down to blockName
function ancestorBlocks(blockName, pseudocode) {
  if (blockName === 'Main') {
    return ['Main'];
  }
  for (const name of Object.keys(pseudocode)) {
    for (let i = 0; i < pseudocode[name].length; i += 1) {
      if (
        // is such a complex mess required? If so, it reeks of poor design:(
        Object.prototype.hasOwnProperty.call(pseudocode[name][i], 'ref') !==
        undefined &&
        pseudocode[name][i].ref === blockName
      ) {
        return ancestorBlocks(name, pseudocode).concat([blockName]);
      }
    }
  }
  // couldn't find ref to block - should be Main but maybe top level is
  // called something else (or it's an error)
  return [blockName];
}

// Find the chunk number to step to next, dependent on what is collapsed etc
// Coded added for recursive algorithms not tested - need to re-code
// quicksort
function findNext(chunks, chunkNum, pseudocode, collapse) {
  if (chunkNum >= chunks.length - 1) { // if at end, don't move
    return chunkNum;
  }
  chunkNum += 1; // go to next chunk
  let bookmark = chunks[chunkNum].bookmark;
  let block = bookmarkBlock(bookmark, pseudocode);
  if (collapse[block]) { // code line is fully expanded -> stop at this chunk
    return chunkNum;
  }
  // If we want to skip over recursive calls, we should have a chunk
  // before the recursion, even if no state is changed, eg have
  // pseudocode "recursively solve sub-problem" which has a chunk, and
  // the expanded code "foo(args)". If we are at an expanded line before the
  // recursive call then skip forward one block, we will be at the same
  // recursion level (callRecLevel).  If the previous chunk is at the
  // end of a recursive computation and but the code is collapsed, the
  // recursionLevel of that chunk will be greater, thats why we need to
  // get recursionLevel after chunkNum += 1 and make sure there is a
  // chunk before we get into the next recursive cal
  let callRecLevel = chunks[chunkNum].recursionLevel;
  // console.log(['findNext', chunkNum, bookmark, block, callRecLevel]);
  // find the outermost ancestor of 'block' where collapse===false
  // - this will block of the pseudocode line that is displayed
  // Eg, for a fully collapsed Heapsort we will find BuildHeap, and the code
  // of Main has a call to BuildHeap
  let ancestors = ancestorBlocks(block, pseudocode);
  let index = ancestors.findIndex(
    (currentValue, index, arr) => !collapse[currentValue]);
  // This is the block we need to skip to the end of
  let blockToSkip = ancestors[index];
  // console.log(ancestors.concat([blockToSkip]));
  // console.log(ancestors.map(i => collapse[i]));
  // We skip forward until we find a chunk that is not in this ancestor
  // block, then go back one step (we want the last chunk in this block)
  // eg, we search until we find a point which doesn't have BuildHeap as an
  // ancestor and return the block immediately before that - the last step
  // of BuildHeap.  We also keep going if the recursion level is
  // greater than callRecLevel
  do {
    if (chunkNum >= chunks.length - 1) { // check we don't run off the end
      return chunks.length - 1;
    }
    chunkNum += 1;
    bookmark = chunks[chunkNum].bookmark;
    block = bookmarkBlock(bookmark, pseudocode);
    ancestors = ancestorBlocks(block, pseudocode);
    // console.log(ancestors.concat([chunkNum, bookmark, block, callRecLevel, chunks[chunkNum].recursionLevel]));
  } while (chunks[chunkNum].recursionLevel > callRecLevel
    || ancestors.includes(blockToSkip));
  return chunkNum - 1;
}

// Find the chunk number to step back to, dependent on what is collapsed etc
// Coded added for recursive algorithms not tested - need to re-code
// quicksort
function findPrev(chunks, chunkNum, pseudocode, collapse) {
  if (chunkNum <= 0) { // if at start, don't move
    return 0;
  }
  // chunkNum gets out of range at the end - have to check for that
  if (chunkNum >= chunks.length) {
    chunkNum = chunks.length - 1;
  }
  // We need to add a chunk at the end of tail-recursive functions, eg
  // "// Done" in order to keep track of recursion level in the chunks,
  // otherwise the last chunk in a recursive computation could be at
  // some deep recursion level and there is no way of knowing what level
  // we came from (multiple levels end with the same chunk with tail
  // recursion). callRecLevel will be the level of this last chunk.
  let callRecLevel = chunks[chunkNum].recursionLevel;
  let bookmark = chunks[chunkNum].bookmark;
  let block = bookmarkBlock(bookmark, pseudocode);
  // console.log(["findPrev", chunkNum, bookmark, block]);
  if (collapse[block]) { // code line is fully expanded -> back 1 step
    return chunkNum - 1;
  }
  // find the outermost ancestor of 'block' where collapse===false
  // - this will block of the pseudocode line that is displayed
  // Eg, for a fully collapsed Heapsort we will find SortHeap, and the code of
  // Main has a call to SortHeap
  let ancestors = ancestorBlocks(block, pseudocode);
  let index = ancestors.findIndex(
    (currentValue, index, arr) => !collapse[currentValue]);
  // This is the block we need skip over (SortHeap in the example above)
  let blockToSkip = ancestors[index];
  // console.log(ancestors.concat([blockToSkip]));
  // We skip back until we find a chunk that is not in this ancestor
  // block
  // eg, we search until we find a point which doesn't have SortHeap as an
  // ancestor - the last step of BuildHeap
  // We check recursion depth also - keep going if recursion
  // depth is greater than saved depth
  do {
    if (chunkNum <= 0) { // check we don't run off the end
      return 0;
    }
    chunkNum -= 1;
    bookmark = chunks[chunkNum].bookmark;
    block = bookmarkBlock(bookmark, pseudocode);
    ancestors = ancestorBlocks(block, pseudocode);
    // console.log(ancestors.concat([chunkNum, bookmark, block]));
  } while (chunks[chunkNum].recursionLevel > callRecLevel
    || ancestors.includes(blockToSkip));
  return chunkNum;
}


/**
 * Setup initial collapse state for each pseudocode
 * @param {object} procedurePseudocode
 */
function getCollapseControllerForSinglePseudocode(procedurePseudocode) {
  const collapseController = {};
  for (const codeBlockName of Object.keys(procedurePseudocode)) {
    if (codeBlockName === 'Main') {
      collapseController[codeBlockName] = true;
    } else {
      collapseController[codeBlockName] = false;
    }
  }
  return collapseController;
}

// get the collapse controller for all the algorithms and all the modes
function getCollapseController(procedureAlgorithms) {
  const collapseController = {};
  for (const algorithmName of Object.keys(procedureAlgorithms)) {
    const algorithmCollapseController = {};
    for (const modeName of Object.keys(
      procedureAlgorithms[algorithmName].pseudocode
    )) {
      algorithmCollapseController[modeName] =
        getCollapseControllerForSinglePseudocode(
          procedureAlgorithms[algorithmName].pseudocode[modeName]
        );
    }
    collapseController[algorithmName] = algorithmCollapseController;
  }
  return collapseController;
}

function addLineExplanation(procedurePseudocode) {
  let index = 0;
  for (const codeBlockName of Object.keys(procedurePseudocode)) {
    for (const line of procedurePseudocode[codeBlockName]) {
      if (line.explanation.length > 0) {
        line['lineExplanButton'] = { id: index, state: false };
        index += 1;
      }
    }
  }
}

/**
 * Get the array of viewable state of chunks
 * @param {object} chunker: current chunker instance
 * @param {object} pseudocode: pseudocode of current algorithm
 * @param {object} collapse: collapse state of pseudocode
 */
function viewableChunks(chunker, pseudocode, collapse) {
  let currChunkNum = 0;
  let viewable = Array(chunker.chunks.length).fill(false);
  viewable[0] = true;

  while (currChunkNum < chunker.chunks.length - 1) {
    currChunkNum = findNext(chunker.chunks, currChunkNum, pseudocode, collapse);
    viewable[currChunkNum] = true;
  }

  chunker.viewable = viewable;
}

// At any time the app may call dispatch(action, params), which will trigger one of
// the following functions. Each comment shows the expected properties in the
// params argument.
export const GlobalActions = {

  INDIRECTION_INTO_PARAM: (state, params) => {
    // Params here will either be empty (Parameter component will use its defaults) (left menu clicks do this)
    // or URL query parameters that Parameter component will use (this happens when parameter component
    // is pushed into state by the initialState function (first load of algorithm page))
    return {
      // key=Date.now()
      // Need to give React a reason to remount when props/state of a component has not changed, 
      // this is exactly what the `key` prop in React is for. Without this two clicks
      // on the left menu, will cause conditional renders to disappear. This function
      // will run but the first mount logic in parameter components that calls LOAD_ALGORITHM 
      // will not run because React did not re-mount. 
      
      // Why cant those buttons just call RUN_ALGORITHM directly? We need to indirect into param 
      // to get the default values for the visualiser, we go in, retrieve them and then pass back out into
      // global state. Seems unorthodox? It is, but if we did not do this the user would
      // have to click the start button themselves for the visualiser to appear.
      param : React.createElement(algorithms[params.name].param, {
        key: `${Date.now()}`,
        ...params,
        alg : params.name,
      }),
      name: params.name,
      mode: params.mode
    }
  },

  // Parameter components will have buttons that when clicked
  // need to change the psuedocode (right panel) with that also
  // comes things like collapse controller, line explanations, visualiser etc. Parameter component
  // is expected to be in state when this is called since that is the only thing
  // that should call LOAD_ALGORITHM. Other components that want to call LOAD_ALGORITHM
  // should go through INDIRECTION_INTO_PARAM.
  LOAD_ALGORITHM: (state, params) => {
    const {
      controller,
      name,
      explanation,
      extraInfo,
      pseudocode,
      instructions,
    } = algorithms[params.name];

    // initialise / reuse visualisers (visualisers are reused
    // if `visualiser` is in `params` here)
    const chunker = new Chunker(() =>
      controller[params.mode].initVisualisers(params)
    );
    controller[params.mode].run(chunker, params);
    const bookmarkInfo = chunker.next();

    const procedurePseudocode = pseudocode[params.mode];
    addLineExplanation(procedurePseudocode);

    // TODO: Why is collapse controller inclusive of every algorithm? Only one
    // shown at a time?
    const collapse = state?.collapse || getCollapseController(algorithms);

    viewableChunks(chunker, procedurePseudocode, collapse[params.name][params.mode]);

    return {
      ...state,
      // Footprint, if your parameter component puts custom properties
      // into global state they will be under this id key.
      id: params,
      name,
      explanation,
      extraInfo,
      instructions,
      pseudocode: procedurePseudocode,
      ...bookmarkInfo,
      chunker,
      visualisers: chunker.visualisers,
      collapse,
      playing: false,
      lineExplanation: null, // TODO: Why?
    };
  },

  // run next line of code
  // We want to step forward one line if next
  // line of code is expanded.  If it is not, we want to step until the
  // *last* line of execution of that collapsed block (old code did
  // *first* line). If next chunk's block is collapsed, we want to find
  // the outermost collapsed block B containing it and pick the last
  // chunk in that block or a block contained (transitively) in that block.
  // Not sure about the triggerPauseInCollapse stuff (was added for
  // transitiveClosure code which has bugs anyway, though not as many as
  // previously)
  // Not sure about playing either - just pass it through as before
  NEXT_LINE: (state, playing) => {
    let result;

    let triggerPauseInCollapse = false;
    let stopAt = undefined;
    if (typeof playing === 'object') {
      triggerPauseInCollapse = playing.triggerPauseInCollapse;
      stopAt = playing.stopAt;
      playing = playing.playing;
    }

    // console.log(['NEXT_LINE', playing, triggerPauseInCollapse]);
    // figure out what chunk we need to stop at
    if (stopAt === undefined) {
      stopAt = state.chunker.currentChunk;
      if (stopAt < state.chunker.chunks.length - 1) {
        do {
          stopAt++;
        } while (!state.chunker.viewable[stopAt])
      }
    }
    // step forward until we are at stopAt, or last chunk, or some weird
    // pauseInCollapse stuff (for Warshall's?) I don't really understand:( XXX
    do {
      result = state.chunker.next(triggerPauseInCollapse);
      if (!triggerPauseInCollapse) {
        result.pauseInCollapse = false;
      }
      // console.log(['chunker.next', state.chunker.currentChunk, result.pauseInCollapse, result.finished, state.id.name, state.id.mode, result.bookmark]);
    } while (
      !result.pauseInCollapse &&
      !result.finished &&
      state.chunker.currentChunk < stopAt
    );
    // const lineExplan = findBookmark(state.pseudocode, result.bookmark).explanation;

    // if playing, currentChunk gets out of range at the end. For single
    // step, if we are at the end, we fake an extra "next" so hopefully
    // we are in the same state as if we had done "play" to the end, and
    // we haven't missed doing anything.  Not sure how everything worked
    // in the past... XXX
    if (state.chunker.currentChunk === state.chunker.chunks.length - 1) {
      state.chunker.currentChunk += 1;
      result.finished = true;
      // console.log('fake next');
    }
    // console.log('NEXT_LINE DONE');
    return {
      ...state,
      ...result,
      playing,
      // lineExplanation: lineExplan,
    };
  },

  // run previous line of code
  // BUG with collapsed code.  We want to step back one line if current
  // line of code is expanded.  If it is not, we want to step until the
  // first line of execution before that collapsed block; ie, the first
  // line not (transitively) in that block.
  // Not sure about the triggerPauseInCollapse stuff (was added for
  // transitiveClosure code which has bugs anyway)
  PREV_LINE: (state, playing) => {
    // "finished" is triggered when state.chunker.currentChunk gets out
    // of range (perhaps should change this XXX); we need check for
    // that here
    // console.log(['PREV_LINE', state.chunker.currentChunk, state.chunker.chunks.length]);
    if (state.chunker.currentChunk >= state.chunker.chunks.length) {
      state.chunker.currentChunk = state.chunker.chunks.length - 1;
    }

    let stopAt = undefined;
    if (typeof playing === 'object') {
      stopAt = playing.stopAt;
      playing = playing.playing;
    }
    if (stopAt === undefined) {
      stopAt = state.chunker.currentChunk;
      if (stopAt > 0) {
        do {
          stopAt--;
        } while (!state.chunker.viewable[stopAt])
      }
    }
    // let result1 = { bookmark: "", chunk: state.chunker.currentChunk };
    const result = state.chunker.goBackTo(stopAt); // changes state

    // const lineExplan = findBookmark(state.pseudocode, result.bookmark).explanation;

    return {
      ...state,
      ...result,
      playing,
      // lineExplanation: lineExplan,
    };
  },

  // added to avoid O(N^2) behaviour for progress bar
  // Goes back to a line in one step
  BACK_TO_LINE: (state, playing) => {
    let stopAt;
    if (typeof playing === 'object') {
      stopAt = playing.stopAt;
      playing = playing.playing;
    } // XXX else error
console.log(stopAt, playing, state);
    const result = state.chunker.goBackTo(stopAt); // changes state
    return {
      ...state,
      ...result,
      playing,
    };
  },

  TOGGLE_PLAY: (state, playing) => ({
    ...state,
    playing,
  }),

  COLLAPSE: (state, { codeblockname, expandOrCollapase }) => {
    // for (const k of Object.keys(state.pseudocode)) {
    // console.log(["COLLAPSE", k, state.collapse[state.id.name][state.id.mode][k]]);
    // }
    const result = state.collapse;

    if (expandOrCollapase === undefined) {
      result[state.id.name][state.id.mode][codeblockname] =
        !result[state.id.name][state.id.mode][codeblockname];
    } else if (expandOrCollapase) {
      result[state.id.name][state.id.mode][codeblockname] = true; // expand
    } else {
      result[state.id.name][state.id.mode][codeblockname] = false; // collapse
    }

    // update viewable chunks
    viewableChunks(
      state.chunker,
      state.pseudocode,
      state.collapse[state.id.name][state.id.mode]
    );

    return {
      ...state,
      collapse: result,
    };
  },

  LineExplan: (state, updateLineExplan) => ({
    ...state,
    lineExplanation: updateLineExplan,
  }),
};

export function dispatcher(state, setState) {
  return (action, params) => {
    setState(action(state, params));
  };
}

const DEFAULT_ALGORITHM_KEY = "AVLTree";
export function initialState() {
  const searchParams = new URLSearchParams(window.location.search);

  let alg = searchParams.get("alg");
  let mode = searchParams.get("mode");

  // These two must be verified
  if (!alg || !(alg in algorithms)) alg = DEFAULT_ALGORITHM_KEY;
  if (!mode || !(mode in algorithms[alg].pseudocode)) mode = getDefaultMode(alg);

  // Make codebase aware of the query params set, this only happens
  // in this function, ensuring that other algorithms are not indirectly
  // effected by the URL, this is important since we only load the algorithm
  // page once now.
  return GlobalActions.INDIRECTION_INTO_PARAM(undefined, {
    name: alg,
    mode,
    ...Object.fromEntries(searchParams.entries()), // Other params
  });
}