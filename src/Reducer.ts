import { AnyAction, Reducer as ReduxReducer } from "redux";

let INITIAL_STATE = {};

export interface State {
    [props:string]: any;
}

export interface Action<T = string, P = any> extends AnyAction {
    type: T;
    payload: P;
    [extraParams:string]: any;
}

/**
 * A base class for create class based reducers where methods are the action.type
 * to avoid the ugly looking switch block. Any reducer class must extend tha class
 *
 * @export
 * @class ReducerProvider
 */
export class ReducerFactory<S = State, A = Action>{
    [prop: string]: any;

    protected constructor(private state: State) {}

    /**
     * Returns a Redux reducer compatible function to be attached at a Redux store
     *
     * @returns function
     * @memberof ReducerFactory
     */
    static Create(initialState: State): ReduxReducer<State, Action<string, any>> {
        const reducer: ReducerFactory = new this(initialState);

        return function(this: ReducerFactory, state: State = {}, action: Action): State {
            const { type, payload, ...extraParams } = action;
            this.state = state;

            if (type === undefined) {
                return this.state;
            }

            // Check if the object a method that matched the 'type' arguments
            if (hasProto(this, type)) {
                return this.updateState(this[type].call(this, payload, extraParams));
            }

            // Check if there is a mapped type with a method
            if (type in this.mapActionToMethod()) {
                const method = this.mapActionToMethod()[type];
                return this.updateState(method.call(this, payload, extraParams));
            }

            // Check if there are decorated types
            if (type in this.decMapToMethods) {
                const method = this.decMapToMethods[type];
                return this.updateState(method.call(this, payload, extraParams));
            }

            // Check if there is a default method
            if (hasProto(this, 'default')) {
                // @ts-ignore: Issue has handled by the check above
                return this.updateState(this.default.call(this, payload, extraParams));
            }

            // All checks failed, just return the state as is.
            return this.state;
        }.bind(reducer);
    }

    /**
     * The redux initialise hook. This should return the initial state unmodified
     */
    ["@@INIT"] () {
        return this.state;
    }

    /**
     * Returns an object that propnaierties are action names/types, while the value is a callable.
     * Override to map actions with reducer methods.
     *
     * @returns object {ACTION_NAME: callable(state = [], payload, extra_params)}
     * @memberof ReducerFactory
     */
    mapActionToMethod(): State {
        return {};
    }

    /**
     * A helper method that returns a new state
     *
     * @param object The current state
     * @param string The property name to add/update
     * @param {any} The new value
     * @returns object A new state object
     * @memberof ReducerFactory
     */
    updateStateProp(attribute: string, value: any): State {
        return this.updateState({ [attribute]: value });
    }

    /**
     * Merges the current state with the given props and returns a fresh state object
     *
     * @param object newProps
     * @returns object The new state
     * @memberof ReducerFactory
     */
    updateState(newProps: State): State {
        this.state = { ...this.state, ...newProps };
        return this.state;
    }

    /**
     * Returns a copy of the current state
     *å
        * @returns object
        * @memberof ReducerFactory
        */
    currentStateCopy(): State {
        return { ...this.state };
    }

    /**
     * Removes a property from the current state and return a new state.
     *
     * @param object The current state
     * @param string The property name
     * @returns object A new state object
     * @memberof ReducerFactory
     */
    removeStateProp(property: string): State {
        delete this.state[property];
        return { ...this.state, ...INITIAL_STATE };
    }
}

const decMapToMethods: {[prop: string]: Function} = {};
ReducerFactory.prototype.decMapToMethods = decMapToMethods;

/* DECORATORS */

/**
 * A Method decorator the to map action types with reducer methods.
 *
 * @param string[] types The action types that the decorated method should handle
 * @returns MethodDecorator
 */
export function actionType(...types: string[]): MethodDecorator {
    return <T = ReducerFactory>(target, method: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {
        types.forEach(type => {
            target.decMapToMethods[type] = target[method].bind(target);
        });

        return descriptor;
    }
}

/* HELPERS */
const methodExists = (object: ReducerFactory, name: string): boolean => {
    return object.hasOwnProperty(name)
        && typeof object[name] === 'function';
};

const hasProto = (object: ReducerFactory, name: string): boolean => {
    if (typeof name !== 'string' || (name.length === 0)) {
        throw new TypeError('Should `name` to be of type `string` and not empty `value`');
    }

    return methodExists(object.constructor.prototype, name);
};