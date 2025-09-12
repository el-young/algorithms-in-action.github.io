
export function createUrl(baseUrl, category, context) {
   const { 
     nodes, 
     searchValue, 
     graphSize, 
     graphStart, 
     graphEnd, 
     heuristic, 
     graphMin, 
     graphMax,
     edgeWeights,
     edgeCostType 
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
       url += `&size=${graphSize}&start=${graphStart}&end=${graphEnd}&xyCoords=${nodes}`;
        if (edgeWeights && edgeWeights.length > 0) {
          url += `&edgeWeights=${edgeWeights}`;
        }
        if (heuristic) {
          url += `&heuristic=${heuristic}`;
        }
        if (edgeCostType) {
          url += `&edgeCost=${edgeCostType}`;
        }
        url += `&min=${graphMin}&max=${graphMax}`;
       break;
 
     default:
       break;
   }
 
   return url;
 }
 