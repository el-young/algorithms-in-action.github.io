import React, { createContext, useState } from 'react';
import PropTypes from 'prop-types';
import { errorParamMsg } from '../algorithms/parameters/helpers/ParamHelper';
import algorithmMetadata, { getDefaultMode } from '../algorithms/masterList';

/*
  Centralized module for all URL-related logic in the app.
  Previously, URL handling was scattered across different files,
  now everything is consolidated here for clarity and maintainability.
*/

// List of valid parameter names
const VALID_PARAM_NAMES = [
    'alg', 'mode', 'list', 'value', 'xyCoords', 'edgeWeights',
    'size', 'start', 'end', 'string', 'pattern', 'union',
    'heuristic', 'min', 'max', 'step', 'expand'
];

// Helper to get all query parametes (that are valid)
export function useUrlParams() {
    // just grab search params directly once
    const search = window.location.search;
    const urlParams = new URLSearchParams(search);
    const params = {};

    // Filter and parse valid URL parameters
    VALID_PARAM_NAMES.forEach((name) => {
        const value = urlParams.get(name);
        params[name] = value ? value : '';
    });

    // Log a warning if there are any invalid parameters in the URL
    urlParams.forEach((_, key) => {
        if (!VALID_PARAM_NAMES.includes(key)) {
            console.warn(`Invalid URL parameter ignored: ${key}`);
        }
    });

    return params;
}

/*
  Higher-order component (HOC) that wraps a given component
  and injects URL query parameters as props.

  The wrapped component can then selectively use the parameters
  it cares about by destructuring them from its props.

   Example:
    // URL: http://localhost:3000/?alg=heapSort&mode=sort&list=1,2,3

    const MyComponent = ({ alg, mode, list }) => (
      <div>
        <p>Algorithm: {alg}</p>
        <p>Mode: {mode}</p>
        <p>List: {list}</p>
      </div>
    );

    // Injects those query params as props here.
    export default withAlgorithmParams(MyComponent);

    // Renders:
    // Algorithm: heapSort
    // Mode: sort
    // List: 1,2,3

    Reduced the need for boiler plate code in components that need 
    access to URL query parameters. Very clever.
*/
export const withAlgorithmParams = (WrappedComponent) => {
    const WithAlgorithmParams = (props) => {
        // Object containing all the query params
        const params = useUrlParams();
        let { alg, mode } = params;

        if (!alg || !(alg in algorithmMetadata)) {
            return errorParamMsg(null, "Invalid alg parameter specified");
        }

        // Fine to not have mode just use default.
        if (!mode) mode = getDefaultMode(alg);

        // Not fine for it to have been specified and not actually be a valid
        // mode for the algorithm.
        if (!(mode in algorithmMetadata[alg].pseudocode)) {
            return errorParamMsg(null, "Invalid mode parameter specified");
        }

        return <WrappedComponent {...params} alg={alg} mode={mode} {...props} />;

    };

    return WithAlgorithmParams;
};

// TODO: Understand and fix this.
// prepend graph from URL if defined
export function addURLGraph(GRAPH_EGS, xyCoords, edgeWeights, start, DEFAULT_START) {
  let graph_egs = [...GRAPH_EGS];
  // XXX using size causes weirdness - BFSParam() somehow gets
  // re-evaluated when we cycle around to the URL graph and size and/or
  // other things get out of whack - maybe something gets triggered,
  // maybe because the identifier size is overloaded in different ways -
  // someone who know JS better than me might be able to figure it out.
  // So, we avoid using the size parameter and use number of xyCoords
  // (if defined) or GRAPH_EGS[0].size otherwise.
  let size1 = GRAPH_EGS[0].size;
  // if coords+weights non-empty we must have info from the URL so we add an
  // extra graph to the start of the list
  if (xyCoords && edgeWeights) {
    size1 = xyCoords.split(",").length;
    const urlGraph =  {
      name: 'URL Graph',
          size: size1,
          coords: xyCoords,
          edges: edgeWeights
    };
    graph_egs.unshift({...urlGraph});
  } else {
    start = DEFAULT_START
  }
  if (start > size1)
    start = size1;
  // XXX should pass in end node(s) and check they are in range???
  return [start, size1, graph_egs];
}

/*
  Context container used throughout the app.
  Provides a central place to store and access
  values that need to be reflected in the URL
  (e.g., when generating a share link).

  Example: if the parameter pane is filled with [1,2,3,4,5],
  we would call setNodes([1,2,3,4,5]). When the share button
  is clicked, this would ideally become &nodes=1,2,3,4,5.

  However, it doesn’t map directly like that, see urlCreator below. 
  The actual query parameter depends on the
  algorithm’s category. For example, if the algorithm is in
  the "sort" category, it will become &list=1,2,3,4,5.

  TODO: There is coupling here — parameter component names
  must align with the expected query param keys.
*/

// Create a new context specifically for values needed for the url
export const URLContext = createContext();

// Provider component for values needed
export const URLProvider = ({ children }) => {
  const [nodes, setNodes] = useState([]);
  const [searchValue, setSearchValue] = useState([]);
  const [graphSize, setGraphSize] = useState([]);
  const [graphStart, setGraphStart] = useState([]);
  const [graphEnd, setGraphEnd] = useState([]);
  const [heuristic, setHeuristic] = useState([]);
  const [graphMin, setGraphMin] = useState([]);
  const [graphMax, setGraphMax] = useState([]);
  const value = {
    nodes, setNodes,
    searchValue, setSearchValue,
    graphSize, setGraphSize,
    graphStart, setGraphStart,
    graphEnd, setGraphEnd,
    heuristic, setHeuristic,
    graphMin, setGraphMin,
    graphMax, setGraphMax,
  };

  return (
    <URLContext.Provider value={value}>
      {children}
    </URLContext.Provider>
  );
};

// Add prop-types to validate children
URLProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// Builds the URL string when the share button is clicked.
// This is what will be copied into the users clipboard.
export function createUrl(baseUrl, category, context) {
   const { 
     nodes, 
     searchValue, 
     graphSize, 
     graphStart, 
     graphEnd, 
     heuristic, 
     graphMin, 
     graphMax 
   } = context;

   let url = baseUrl;
 
   switch (category) {
     case 'Sort':
       url += `&list=${nodes}`;
       break;
 
     case 'Insert/Search':
       url += `&list=${nodes}&value=${searchValue}`;
       break;
 
     case 'String Search':
       url += `&string=${nodes}&pattern=${searchValue}`;
       break;
 
     case 'Set':
       url += `&union=${nodes}&value=${searchValue}`;
       break;
 
     case 'Graph':
       url += `&size=${graphSize}&start=${graphStart}&end=${graphEnd}&xyCoords=${nodes}&edgeWeights=${searchValue}&heuristic=${heuristic}
         &min=${graphMin}&${graphMax}`;
       break;
 
     default:
       break;
   }
 
   return url;
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