import { AnyAction, Reducer as ReduxReducer } from "redux";
export interface State {
    [props: string]: any;
}
export interface Action<T = string, P = any> extends AnyAction {
    type: T;
    payload: P;
    [extraParams: string]: any;
}
/**
 * A base class for create class based reducers where methods are the action.type
 * to avoid the ugly looking switch block. Any reducer class must extemd tha class
 *
 * @export
 * @class ReducerProvider
 */
export declare class ReducerFactory<S = State, A = Action> {
    private state;
    [prop: string]: any;
    protected constructor(state: State);
    /**
     * Returns a Redux reducer compatible function to be attached at a Redux store
     *
     * @returns function
     * @memberof ReducerFactory
     */
    static Create(initialState: State): ReduxReducer<State, Action<string, any>>;
    /**
     * Returns an object that propnaierties are action names/types, while the value is a callable.
     * Override to map actions with reducer methods.
     *
     * @returns object {ACTION_NAME: callable(state = [], payload, extra_params)}
     * @memberof ReducerFactory
     */
    mapActionToMethod(): State;
    /**
     * A helper method that returns a new state
     *
     * @param object The current state
     * @param string The property name to add/update
     * @param {any} The new value
     * @returns object A new state object
     * @memberof ReducerFactory
     */
    updateStateProp(attribute: string, value: any): State;
    /**
     * Merges the current state with the given props and returns a fresh state object
     *
     * @param object newProps
     * @returns object The new state
     * @memberof ReducerFactory
     */
    updateState(newProps: State): State;
    /**
     * Returns a copy of the current state
     *
     * @returns object
     * @memberof ReducerFactory
     */
    currentStateCopy(): State;
    /**
     * Removes a property from the current state and return a new state.
     *
     * @param object The current state
     * @param string The property name
     * @returns object A new state object
     * @memberof ReducerFactory
     */
    removeStateProp(property: string): State;
}
