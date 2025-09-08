// Builds the URL string when the share button is clicked.
// This is what will be copied into the users clipboard.
export function createUrl(globalContext) {
  let baseUrl = `${window.location.origin}${window.location.pathname}`;
  // params.id contains everything from the param component dispatch
  // we only want the url sub-object which parameters should have filled
  // out with there props if they want to be capable of being generated from URL.
  const urlParams = globalContext.id?.url || {};
  const search = new URLSearchParams(urlParams).toString();
  let steps = globalContext?.chunker?.currentChunk || 0;
  const collapseController = JSON.stringify(globalContext?.collapse?.[urlParams.alg] || {});
  return `${baseUrl}?${search}&step=${steps}&expand=${collapseController}`;
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