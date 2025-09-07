import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { getCategory } from '../algorithms/masterList';

/*
  Centralized module for all URL-related logic in the app.
  Previously, URL handling was scattered across different files,
  now everything is consolidated here for clarity and maintainability.
*/

// List of extra valid parameter names (excluding alg and mode)
const VALID_PARAM_NAMES = [
    'list', 'value', 'xyCoords', 'edgeWeights',
    'size', 'start', 'end', 'string', 'pattern', 'union',
    'heuristic', 'min', 'max', 'step', 'expand', 'compress'
];

/**
 * Parse and validate query parameters from the current URL.
 *
 * This function:
 *  - Collects all query parameters from `window.location.search`.
 *  - Filters against `VALID_PARAM_NAMES` to allow only supported parameters.
 *  - Performs validation logic on each recognized parameter so that only
 *    well-formed values are passed into parameter components.
 *  - Logs a warning for any parameters not in `VALID_PARAM_NAMES`.
 *
 * Rationale:
 *  Validation used to happen inside form callbacks (triggered by simulated clicks).
 *  That worked for parameters backed by forms, since the form handlers already
 *  enforced constraints. However, not all parameters are tied to forms
 *  (e.g., toggle buttons like path compression in Union-Find). Without
 *  central validation, some parameters were validated while others weren’t,
 *  creating confusion for new developers.
 *
 *  By moving validation here, every parameter, whether it is intended for a form
 *  or not, is checked consistently before being injected into components.
 * 
 *
 * @returns {Object} An object mapping each valid parameter name to its validated value,
 *                   or an empty string if missing or invalid.
 */

// TODO: Parameter components should still convert to appropriate type? Nah.
export function getUrlParams() {
  const search = window.location.search;
  const urlParams = new URLSearchParams(search);
  const params = {};

  VALID_PARAM_NAMES.forEach((name) => {
    const value = urlParams.get(name);

    // TODO: add specific validation per parameter type here
    // e.g., number ranges, boolean coercion, list formatting, etc.
    params[name] = value ? value : '';
  });

  // Warn about unexpected query parameters
  urlParams.forEach((_, key) => {
    if (!VALID_PARAM_NAMES.includes(key)) {
      console.warn(`Invalid URL parameter ignored: ${key}`);
    }
  });

  return params;
}

// Builds the URL string when the share button is clicked.
// This is what will be copied into the users clipboard.
export function createUrl(globalContext) {
  let baseUrl = `${window.location.origin}/animation/`;

  // Can get everything from global context,
  // parameter specific is in globalContext.id
  // stuff like step and collapse controller can be retrieved also
  console.log(globalContext);
  const {
    name,  // Name is alg key in global context for some reason
    mode,
    nodes,
    target
  } = globalContext.id;

  baseUrl += `?alg=${name}`;
  baseUrl += `&mode=${mode}`;

  let steps = globalContext?.chunker?.currentChunk || 0;
  baseUrl += `&step=${steps}`;

  // For some reason collapseController contains all algorithm
  // data, just grab relevant controller to avoid bloating URL.
  // When going from URL to animation the code needs to remember this.
  let collapseController = globalContext?.collapse?.[name] || {};
  collapseController = JSON.stringify(collapseController);
  baseUrl += `&expand=${collapseController}`;

  switch (getCategory(name)) {
    case 'Sort':
      baseUrl += `&list=${nodes}`;
      break;

    case 'Insert/Search':
      // url += `&list=${nodes}&value=${searchValue}`;
      // TODO: need to have better consistency with whats names are
      // used to represent what. `searchValue` is called `target`
      // when being dispatched with the global actions.
      baseUrl += `&list=${nodes}&value=${target}`;
      break;

    case 'String Search':
      baseUrl += `&string=${nodes}&pattern=${target}`;
      break;

    case 'Set':
      baseUrl += `&union=${nodes}&value=${target}`;
      break;

    // TODO:
    // case 'Graph':
    //   url += `&size=${graphSize}&start=${graphStart}&end=${graphEnd}&xyCoords=${nodes}&edgeWeights=${searchValue}&heuristic=${heuristic}
    //     &min=${graphMin}&${graphMax}`;
    //   break;

    default:
      break;
  }
 
   return baseUrl;
 }
 

// Some examples of URLs that are supported.
// https://dev-aia.vercel.app/?alg=heapSort&mode=sort&list=1,3,5,2,8
// http://localhost:3000/?alg=heapSort&mode=sort&list=1,3,5,2,8
// http://localhost:3000/?alg=aStar&mode=find&size=4&start=1&end=4&min=1&max=30&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-3-2,1-4-3,2-3-1,2-4-2&heuristic=Euclidean
// http://localhost:3000/?alg=aStar&mode=find&size=4&start=1&end=4&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean
// http://localhost:3000/?alg=BFS&mode=find&size=4&start=1&end=4&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean
// http://localhost:3000/?alg=bruteForceStringSearch&mode=search&string=abcdef&pattern=def
// http://localhost:3000/?alg=binarySearchTree&mode=search&list=1,5,2,6,6&value=5
// http://localhost:3000/?alg=DFS&mode=find&size=4&start=1&end=4&xyCoords=1-10,2-2,3-1,8-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=0&max=10 // why min, max not working?
// http://localhost:3000/?alg=DFSrec&mode=find&size=4&start=1&end=4&xyCoords=1-10,2-2,3-1,8-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=0&max=10
// http://localhost:3000/?alg=dijkstra&mode=find&size=4&start=1&end=4&xyCoords=1-10,2-2,3-1,8-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=0&max=10
// http://localhost:3000/?alg=horspoolStringSearch&mode=search&string=abcdef&pattern=def
// http://localhost:3000/?alg=kruskal&mode=find&size=4&start=1&end=4&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=1&max=30
// http://localhost:3000/?alg=prim_old&mode=find&size=4&start=1&end=4&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=1&max=30
// http://localhost:3000/?alg=prim&mode=find&size=4&start=1&end=4&xyCoords=1-1,2-2,3-1,4-2&edgeWeights=1-2-1,1-4-3,2-3-1,2-4-2&heuristic=Euclidean&min=1&max=30
// http://localhost:3000/?alg=transitiveClosure&mode=tc&size=5&min=0&max=1
// http://localhost:3000/?alg=TTFTree&mode=search&list=1,5,2,6&value=5 //cannot accept duplicate values in the list
// http://localhost:3000/?alg=unionFind&mode=find&union=1-1,5-10,2-3,6-6&value=5