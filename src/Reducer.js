let INITIAL_STATE = {};
/**
 * A base class for create class based reducers where methods are the action.type
 * to avoid the ugly looking switch block. Any reducer class must extemd tha class
 *
 * @export
 * @class ReducerBase
 */
export default class Reducer {
    state = null;
    /**
     * Returns a Redux reducer compatible function to be attached at a Redux store
     *
     * @returns function
     * @memberof ReducerBase
     */
    constructor(initialState = INITIAL_STATE) {
        this.state = INITIAL_STATE = initialState;
        const that = this;

        return (state = initialState, { type, payload, ...action }) => {
            // update the inner state with the given state
            that.state = state;

            // Check if the object a method that matched the 'type' arguments
            if (hasProto(that, type)) {
                return that.updateState(that[type].call(that, payload, action));
            }

            // Check if there is a mapped type with a method
            if (type in that.mapActionToMethod()) {
                const method = that.mapActionToMethod()[type];
                return that.updateState(method.call(that, payload, action));
            }

            // Check if there is a default method
            if (hasProto(that, 'default')) {
                return that.updateState(that.default.call(that, payload, action));
            }

            // All checks failed, just return the state as is.
            return state;
        };
    }

    /**
     * Returns an object that properties are action names/types, while the value is a callable.
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
