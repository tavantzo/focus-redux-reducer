(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["boilerplate"] = factory();
	else
		root["boilerplate"] = factory();
})(window, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "ReducerFactory", function() { return ReducerFactory; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "actionType", function() { return actionType; });
var __assign = (undefined && undefined.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
var __rest = (undefined && undefined.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
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
            // Check if there are decorated types
            if (type in this.decMapToMethods) {
                var method = this.decMapToMethods[type];
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
     *å
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

var decMapToMethods = {};
ReducerFactory.prototype.decMapToMethods = decMapToMethods;
/* DECORATORS */
/**
 * A Method decorator the to map action types with reducer methods.
 *
 * @param string[] types The action types that the decorated method should handle
 * @returns MethodDecorator
 */
function actionType() {
    var types = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        types[_i] = arguments[_i];
    }
    return function (target, method, descriptor) {
        types.forEach(function (type) {
            target.decMapToMethods[type] = target[method].bind(target);
        });
        return descriptor;
    };
}
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


/***/ })
/******/ ]);
});
//# sourceMappingURL=index.umd.js.map