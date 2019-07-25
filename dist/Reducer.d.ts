import { AnyAction, Reducer as ReduxReducer } from "redux";
export declare type State = {
    [props: string]: any;
};
export interface PayloadAction<T extends string | number | symbol = string, P = any> extends AnyAction {
    type: T;
    payload: P;
}
export declare type Action = PayloadAction;
/**
 * A base class for create class based reducers where methods are the action.type
 * to avoid the ugly looking switch block. Any reducer class must extend tha class
 *
 * @export
 * @class ReducerProvider
 */
export declare class ReducerFactory<SS extends State, AA extends Action = Action> {
    private readonly _initialState;
    private _state;
    [prop: string]: any;
    protected constructor(_initialState: SS);
    /**
     * Returns a Redux reducer compatible function to be attached at a Redux store
     *
     * @returns function
     * @memberof ReducerFactory
     */
    static Create<S = State, A extends Action = Action>(initialState: S): ReduxReducer<S, A>;
    readonly state: SS;
    /**
     * The redux initialise hook. This should return the initial state unmodified
     */
    ["@@INIT"](): SS;
    /**
     * Returns an object that propnaierties are action names/types, while the value is a callable.
     * Override to map actions with reducer methods.
     *
     * @returns object {ACTION_NAME: callable(state = [], payload, extra_params)}
     * @memberof ReducerFactory
     */
    mapActionToMethod(): Record<Extract<"type", AA>, (p: Pick<AA, "payload">, ...e: any[]) => Partial<SS>> | {};
    /**
     * A helper method that returns a new state
     *
     * @param object The current state
     * @param string The property name to add/update
     * @param {any} The new value
     * @returns object A new state object
     * @memberof ReducerFactory
     */
    updateStateProp(attribute: keyof SS, value: any): SS;
    /**
     * Merges the current state with the given props and returns a fresh state object
     *
     * @param object newProps
     * @returns object The new state
     * @memberof ReducerFactory
     */
    updateState(newProps: Partial<SS>): SS;
    /**
     * Returns a copy of the current state
     *å
        * @returns object
        * @memberof ReducerFactory
        */
    currentStateCopy(): SS;
    /**
     * Removes a property from the current state and return a new state.
     *
     * @param object The current state
     * @param string The property name
     * @returns object A new state object
     * @memberof ReducerFactory
     */
    removeStateProp(property: keyof SS): SS;
}
/**
 * A Method decorator the to map action types with reducer methods.
 *
 * @param string[] types The action types that the decorated method should handle
 * @returns MethodDecorator
 */
export declare function actionType<S extends State, A extends Action = Action>(...types: string[]): MethodDecorator;
