import { AnyAction, Reducer as ReduxReducer } from "redux";
import { PickByValue } from "utility-types";

export type State = {[props:string]: any};

export interface PayloadAction<T extends string | number | symbol = string, P = any > extends AnyAction {
    type: T;
    payload: P;
}

export type Action = PayloadAction;

/**
 * A base class for create class based reducers where methods are the action.type
 * to avoid the ugly looking switch block. Any reducer class must extend tha class
 *
 * @export
 * @class ReducerProvider
 */
export class ReducerFactory<SS extends State, AA extends Action = Action>{
    private _state: SS = {} as SS;
    [prop: string]: any;

    protected constructor(private readonly _initialState: SS) {}

    /**
     * Returns a Redux reducer compatible function to be attached at a Redux store
     *
     * @returns function
     * @memberof ReducerFactory
     */
    static Create<S = State, A extends Action = Action>(initialState: S): ReduxReducer<S, A> {
        const reducer: ReducerFactory<S, A> = new this(initialState);

        return function(this: ReducerFactory<S, A>, currentState: S | undefined, action): S {
            const { type, payload, ...extraParams } = action;
            if (currentState === undefined) {
                this._state = this._initialState
            } else {
                this._state = currentState;
            }

            if (type === undefined) {
                return this._initialState;
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
                return this.updateState(this.default.call(this, payload, extraParams));
            }

            // All checks failed, just return the state as is.
            return this.state;
        }.bind(reducer);
    }

    get state(): SS { return this._state; }

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
    mapActionToMethod(): Record<Extract<"type", AA>, (p: Pick<AA, "payload">, ...e: any[]) => Partial<SS>> | {}  {
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
    updateStateProp(attribute: keyof SS, value: any): SS {
        return this.updateState({ [attribute]: value } as Partial<SS>);
    }

    /**
     * Merges the current state with the given props and returns a fresh state object
     *
     * @param object newProps
     * @returns object The new state
     * @memberof ReducerFactory
     */
    updateState(newProps: Partial<SS>): SS {
        this._state = Object.assign({}, this.state, newProps);
        return this.state;
    }

    /**
     * Returns a copy of the current state
     *å
        * @returns object
        * @memberof ReducerFactory
        */
    currentStateCopy(): SS {
        return Object.assign({}, this._state);
    }

    /**
     * Removes a property from the current state and return a new state.
     *
     * @param object The current state
     * @param string The property name
     * @returns object A new state object
     * @memberof ReducerFactory
     */
    removeStateProp(property: keyof SS): SS {
        delete this.state[property];
        return Object.assign({}, this._state, this._initialState);
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
export function actionType<S extends State, A extends Action = Action>(...types: string[]): MethodDecorator {
    return <T = ReducerFactory<S, A>>(target, method: string | symbol, descriptor: TypedPropertyDescriptor<T>): TypedPropertyDescriptor<T> => {
        types.forEach(type => {
            target.decMapToMethods[type] = target[method].bind(target);
        });

        return descriptor;
    }
}

/* HELPERS */
const methodExists = (object: object, name: string): boolean => {
    return object.hasOwnProperty(name)
        && typeof object[name] === 'function';
};

const hasProto = (object: object, name: string): boolean => {
    if (typeof name !== 'string' || (name.length === 0)) {
        throw new TypeError('Should `name` to be of type `string` and not empty `value`');
    }

    return methodExists(object.constructor.prototype, name);
};
