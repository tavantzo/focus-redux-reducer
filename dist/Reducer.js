"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var INITIAL_STATE = {};
/**
 * A base class for create class based reducers where methods are the action.type
 * to avoid the ugly looking switch block. Any reducer class must extemd tha class
 *
 * @export
 * @class ReducerProvider
 */
var ReducerFactory = /** @class */ (function () {
    function ReducerFactory(state) {
        this.state = state;
    }
    /**
     * Returns a Redux reducer compatible function to be attached at a Redux store
     *
     * @returns function
     * @memberof ReducerFactory
     */
    ReducerFactory.Create = function (initialState) {
        var reducer = new this(initialState);
        return function (state, action) {
            if (state === void 0) { state = {}; }
            var type = action.type, payload = action.payload, extraParams = __rest(action, ["type", "payload"]);
            if (type === undefined) {
                return this.state;
            }
            // Check if the object a method that matched the 'type' arguments
            if (hasProto(this, type)) {
                return this.updateState(this[type].call(this, payload, extraParams));
            }
            // Check if there is a mapped type with a method
            if (type in this.mapActionToMethod()) {
                var method = this.mapActionToMethod()[type];
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
    };
    /**
     * The redux initialise hook. This should return the initial state unmodified
     */
    ReducerFactory.prototype["@@INIT"] = function () {
        return this.state;
    };
    /**
     * Returns an object that propnaierties are action names/types, while the value is a callable.
     * Override to map actions with reducer methods.
     *
     * @returns object {ACTION_NAME: callable(state = [], payload, extra_params)}
     * @memberof ReducerFactory
     */
    ReducerFactory.prototype.mapActionToMethod = function () {
        return {};
    };
    /**
     * A helper method that returns a new state
     *
     * @param object The current state
     * @param string The property name to add/update
     * @param {any} The new value
     * @returns object A new state object
     * @memberof ReducerFactory
     */
    ReducerFactory.prototype.updateStateProp = function (attribute, value) {
        return this.updateState((_a = {}, _a[attribute] = value, _a));
        var _a;
    };
    /**
     * Merges the current state with the given props and returns a fresh state object
     *
     * @param object newProps
     * @returns object The new state
     * @memberof ReducerFactory
     */
    ReducerFactory.prototype.updateState = function (newProps) {
        this.state = __assign({}, this.state, newProps);
        return this.state;
    };
    /**
     * Returns a copy of the current state
     *
     * @returns object
     * @memberof ReducerFactory
     */
    ReducerFactory.prototype.currentStateCopy = function () {
        return __assign({}, this.state);
    };
    /**
     * Removes a property from the current state and return a new state.
     *
     * @param object The current state
     * @param string The property name
     * @returns object A new state object
     * @memberof ReducerFactory
     */
    ReducerFactory.prototype.removeStateProp = function (property) {
        delete this.state[property];
        return __assign({}, this.state, INITIAL_STATE);
    };
    return ReducerFactory;
}());
exports.ReducerFactory = ReducerFactory;
/* HELPERS */
var methodExists = function (object, name) {
    return object.hasOwnProperty(name)
        && typeof object[name] === 'function';
};
var hasProto = function (object, name) {
    if (typeof name !== 'string' || (name.length === 0)) {
        throw new TypeError('Should `name` to be of type `string` and not empty `value`');
    }
    return methodExists(object.constructor.prototype, name);
};
//# sourceMappingURL=Reducer.js.map