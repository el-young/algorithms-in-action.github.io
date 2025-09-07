# Update to Parameter Components

### TL;DR

* Keep helper parameter components stateless: they only take props. 
(some exceptions, for example parameter form components need state for user typing
 but general rule is to keep as stateless as possible)
* Only the **root parameter component** should call `dispatch(LOAD_ALGORITHM)`, via a single `useEffect`.
* Transform parameter state into the types the controller expects **inside that `useEffect`**, never earlier.
* This makes dispatch logic centralized, debugging easier, and onboarding new developers simpler.

---

### Background

The loading flow of the codebase is fairly complex. When the algorithm page loads, 
it conditionally renders components based on what is inside global state. What kicks
it all off is an initial entry into global state, which is the parameter component.

On mount, parameter components must then immediately dispatch defaults to global state 
so the rest of the app knows what parameters exist. Without this, 
the user would need to enter values and click *Run* before other panels render.

Previously, simulated click events were used to trigger these initial dispatches. This made the code hard to follow, and in some cases caused duplicate dispatches occured likely because devs were confused about how the initial dispatch was actually happening.

---

### New Structure

1. **Helper parameter components** should be as pure as possible:
   * Minimal or no state.
   * No direct dispatch calls.
   * They just render inputs and forward values via callbacks.

2. **Root parameter components** handle everything else:
   * Own state for what’s typed in the form (`"1,2,3,4"`, `"1-2,3-4"`, booleans for button state, etc).
   * Do **not** store parameter form values in the transformed format controllers need (e.g. arrays).
   * Instead, transform only at the point of dispatch inside `useEffect`.

3. **Dispatching**:
   * A single `useEffect` runs on mount and whenever dependencies change.
   * It transforms local state into what the controller expects, then calls `dispatch`.
   * Example (AVL tree params):

     ```js
     useEffect(() => {
       // Convert CSV string into an array of numbers
       const nodesArray = list
         .split(',')
         .map(Number)
         .filter((n) => !isNaN(n));

       if (modeState === INSERTION) {
         dispatch(GlobalActions.LOAD_ALGORITHM, {
           name: alg,
           mode: INSERTION,
           nodes: nodesArray,
           target: value,
         });
       } else if (modeState === SEARCH) {
         dispatch(GlobalActions.LOAD_ALGORITHM, {
           name: alg,
           mode: SEARCH,
           nodes: nodesArray,
           target: value,
           visualiser: algorithm?.chunker?.visualisers,
         });
       }
     }, [modeState, list, value]);
     ```

   * Even if some fields aren’t strictly required in a mode (e.g. nodes in *search*), we still include them to keep the global `id` footprint complete for URL generation. See URL Parameters below.

---

### Benefits

* **Clarity**: Only one place (`useEffect`) ever calls dispatch.
* **Consistency**: All parameters are stored as raw strings/booleans in state, not half-transformed values, this was inconsistently applied before.
* **Debuggability**: Easier to trace when and why dispatch happens.
* **Onboarding**: Developers no longer need to hunt for hidden simulated clicks/default dispatches inside helpers.

---

### URL Parameters

Previously, URL query params were managed via a separate `URLContext`. This created duplication, since `GlobalContext` already stores an `id` footprint of all parameter state.

Changes:

* Drop `URLContext`.
* Use the existing `id` in `GlobalContext` for URL generation (now extended to also include `step`, pseudocode expansions which
  are not specific to a Parameter component but are stored in global state thus making even more sence to use the 
  global context for URL generation, etc).
* This reduces namespace collisions and keeps all parameter state in one place.
* Quality of life change, If query param names would otherwise collide with reserved names (`mode`, `value`, etc), use **JavaScript destructuring aliases**
  do not use hacky aliases for state like localUnion, localValue, modeState inside the parameter component, alias the props, for example:

  ```js
  function UFParam({ 
    alg, 
    mode: urlMode, 
    union: urlUnion, 
    value: urlValue, 
    compress // In this case we use name isCompressed in component, so no alias needed
  }) { … }
  ```

---

### Tradeoffs & Validation

This new approach comes with a tradeoff:

- Root parameter components become more verbose, since helpers can no longer provide default callbacks.
- All URL params injected as props must be validated in the root component before being used.
- In the old design, this was avoided because URL params were written into form fields, and the form callbacks already contained validation logic. That worked elegantly for parameters that only supported URL query params that corresponded to forms, but not all URL query params have corresponding forms.
- For example, in Union-Find, the path compression value comes from a URL param (true/false) but it is a button, not a form.

So under the old system this URL query param would need to be validated in the root parameter component code creating inconsistency:
- Some URL params would be seemingly ignored (indirectly validated through form callback).
- Others would be explicitly validated.

This would create confusion for new developers.