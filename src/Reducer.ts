import { Reducer as ReduxReducer, AnyAction } from "redux";

let INITIAL_STATE = {};

export interface State {
    [props:string]: any
}

export interface Action<T = string, P = any> extends AnyAction {
    payload: P;
}

/**
 * A base class for create class based reducers where methods are the action.type
 * to avoid the ugly looking switch block. Any reducer class must extemd tha class
 *
 * @export
 * @class ReducerProvider
 */
export default class ReducerFactory {
    private constructor(private state: State) {
    }

    /**
     * Returns a Redux reducer compatible function to be attached at a Redux store
     *
     * @returns function
     * @memberof ReducerBase
     */
    static Create(initialState:State = INITIAL_STATE): ReduxReducer<object, Action> {
        const reducer: ReducerFactory = new this(initialState);
        
        return function(this:ReducerFactory, state: State = initialState, action: Action) {
            const { type, payload, ...extraParams } = action;
            // update the inner state with the given state
            this.state = state;

            // Check if the object a method that matched the 'type' arguments
            if (hasProto(this, type)) {
                return this.updateState(this[type].call(this, payload, extraParams));
            }

            // Check if there is a mapped type with a method
            if (type in this.mapActionToMethod()) {
                const method = this.mapActionToMethod()[type];
                return this.updateState(method.call(this, payload, extraParams));
            }

            // Check if there is a default method
            if (hasProto(this, 'default')) {
                // @ts-ignore: Issue has handled by the check above 
                return this.updateState(this.default.call(this, payload, extraParams));
            }

            // All checks failed, just return the state as is.
            return state;
        }.bind(reducer);
    }

    /**
     * Returns an object that propnaierties are action names/types, while the value is a callable.
     * Override to map actions with reducer methods.
     *
     * @returns object {ACTION_NAME: callable(state = [], payload, extra_params)}
     * @memberof ReducerBase
     */
    mapActionToMethod() {
        return {};
    }

    /**
     * A helper method that returns a new state
     *
     * @param object The current state
     * @param string The property name to add/update
     * @param {any} The new value
     * @returns object A new state object
     * @memberof ReducerBase
     */
    updateStateProp(attribute, value) {
        return this.updateState({ [attribute]: value });
    }

    /**
     * Merges the current state with the given props and returns a fresh state object
     *
     * @param object newProps
     * @returns object The new state
     * @memberof ReducerBase
     */
    updateState(newProps) {
        this.state = { ...this.state, ...newProps };
        return this.state;
    }

    /**
     * Returns a copy of the current state
     *
     * @returns object
     * @memberof ReducerBase
     */
    currentStateCopy() {
        return { ...this.state };
    }

    /**
     * Removes a property from the current state and return a new state.
     *
     * @param object The current state
     * @param string The property name
     * @returns object A new state object
     * @memberof ReducerBase
     */
    removeStateProp(property) {
        delete this.state[property];
        return { ...this.state, ...INITIAL_STATE };
    }
}

/* HELPERS */

const methodExists = (object, name) => {
    return object.hasOwnProperty(name)
        && typeof object[name] === 'function';
};

const hasProto = (object, name) => {
    if (typeof name !== 'string' || (name.length === 0)) {
        throw new TypeError('Should `name` to be of type `string` and not empty `value`');
    }

    if (typeof object === 'object') {
        return methodExists(object.constructor.prototype, name);
    }
};