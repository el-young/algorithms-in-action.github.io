# Update to Parameter Components

### TL;DR

* Keep helper parameter components stateless: they only take props. (can be exceptions but try to keep helpers
as stateless as possible)
* Only the **root parameter component** should call `dispatch(LOAD_ALGORITHM)`, via a single `useEffect`.
* Transform parameter state into the types the controller expects **inside that `useEffect`**.
* This makes dispatch logic centralized, debugging easier, and onboarding new developers simpler.

---

### Background

The loading flow of the codebase is fairly complex. When the algorithm page loads, 
it conditionally renders components based on what is inside global state. What kicks
it all off is an initial entry into global state, which is the parameter component.

On mount, parameter components must then immediately dispatch data to be used by the controller to global state 
so the animation pane knows what parameters exist and thus what animation to draw. Without this, 
the user would need to enter values and click *Run* before the animation pane is filled (for example
the user would not see an array for insertion sort with some default values they would need to make
defaults themselves and press a button to load the animation).

Previously, simulated click events were used to trigger these initial dispatches. 
This made the code hard to follow, and in some cases duplicate dispatches occured 
likely because devs were confused about how the initial dispatch was actually happening.

---

### New Structure

1. **Helper parameter components** should be as pure as possible:
   * Minimal or no state.
   * No direct dispatch calls.
   * They just render inputs and forward values via callbacks.

2. **Root parameter components** handle everything else:
   * Own state for what’s typed in the form (`"1,2,3,4"`, `"1-2,3-4"`, booleans for button state, etc).
   * Do **not** store parameter form values in the transformed format controllers need (e.g. arrays).
   * Transform only at the point of dispatch inside `useEffect`.

3. **Dispatching**:
   * A single `useEffect` runs on mount (See documentation on useEffect) and whenever dependencies change.
   * It transforms local state into what the controller expects, then calls `dispatch`.
   * Example (Astar param):

    ```js
    // Default values if url query parameters are missing
    // for these.
    const defaultProps = {
      mode: "find",
      size: "14",
      start: "1",
      end: "14",
      coords: "4-3,2-7,7-11,9-3,12-6,13-2,12-16,17-2,20-4,34-4,26-9,30-6,34-10,38-5",
      edges: "1-2-3,1-4-6,2-3-4,3-4-2,3-5-4,4-5-3,5-6-2,5-7-10,6-8-5,7-11-10,8-9-6,9-10-3,10-12-8,11-12-5,12-13-3,13-14-4",
      heuristic: "Manhattan",
      weight: "Euclidean",
    };

    // ...

    function ASTParam({
      alg,
      mode,
      start: urlStart,
      end: urlEnd,
      coords: urlCoords,
      edges: urlEdges,
      heuristic: urlHeuristic,
      weight: urlWeight,
    }) {
      // ... 
      useEffect(() => {
        const { valid, errors } = validateAll();

        if (valid) {
          dispatch(GlobalActions.LOAD_ALGORITHM, {
            // For legacy reasons the dispatcher and a bunch of other code expects
            // the name key to hold the algorithm key e.g. "astar"
            // do not confuse name here with "name" key in master list e.g. 
            // "A* (heuristic search)" which is what is shown on menus.

            // Rest assured that the alg parameter key passed in as a prop has been
            // verified elsewhere, this is so parameter components do not need to couple
            // to the key specified in master list.
            name: alg,
            // Only one mode for Astar, unfortunately coupling to mode names in
            // master list is unavoidable, see hard coded mode name in default props.
            mode: defaultProps.mode,

            // Add everything here required for URL to rebuild
            // this component. Make sure keys are the same
            // as the property names of this component. When the app loads
            // from a URL it will inject these into this component as props.
            url : {
              alg,
              mode: defaultProps.mode,
              start,
              end,
              coords,
              edges,
              weight,
              heuristic
            },

            // Add everything your controller code needs here, make sure
            // the data types have been converted to what your controller code
            // expects and the key names here are the same names that your
            // controller destructures with otherwise your controller code
            // will ignore these keys.
            startNode       : Number(start),
            endNodes        : end.split(",").map((num) => Number(num)),
            coordsMatrix    : parseCoords(coords),
            edgeValueMatrix : parseEdges(weightFnMap[weight](coords, edges), coords.split(",").length),
            heuristicFn     : heuristicFnMap[heuristic],
            moveNode,
          });

          // Make sure you clear any errors
          setMessage(null);
        } else {
          // Show all errors to user
          setMessage(errorParamMsg(errors.join("\n")));
        }
      }, [start, end, coords, edges, weight, heuristic]);

      // ...
    }
    ```
---

### Benefits

* **Clarity**: Only one place (`useEffect`) ever calls dispatch.
* **Consistency**: All parameters are stored as raw strings in state, not half-transformed values, this was inconsistently applied before,
some would hold the transformed state required by controller for dispatch the entire time some would not and would transform right before dispatch.
* **Debuggability**: Easier to trace when and why dispatch happens.
* **Onboarding**: Developers no longer need to hunt for hidden simulated clicks/default dispatches inside helpers.
* **URL simplification**: Previously had to touch multiple files to make sure new url query params were supported, now all you need to do
is add into the `url` key at dispatch and make sure the parameter component has that key as a property.
