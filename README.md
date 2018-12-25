# focus-redux-reducer

[![Travis](https://img.shields.io/travis/tavantzo/focus-redux-reducer.svg)](https://travis-ci.org/tavantzo/focus-redux-reducer)
[![codecov](https://codecov.io/gh/tavantzo/focus-redux-reducer/branch/master/graph/badge.svg)](https://codecov.io/gh/tavantzo/focus-redux-reducer)
[![version](https://img.shields.io/npm/v/focus-redux-reducer.svg)](https://www.npmjs.com/package/focus-redux-reducer
)
[![downloads](https://img.shields.io/npm/dm/focus-redux-reducer.svg)](https://www.npmjs.com/package/focus-redux-reducer)
[![MIT License](https://img.shields.io/npm/l/focus-redux-reducer.svg)](https://opensource.org/licenses/MIT)

## Redux reducer focused on productivity

### Description

A Redux reducer usually is a function (`function(Object state, Object action)`) that updates the state and returns it. Usually the main body of that function is an ugly `switch` statement or even worse a series of an un-maintainable `if...else` statements.

```javascript
const reducer = (state = {}, { type, payload, ...other }) => {
    // An ugly switch
    switch(type) {
        case 'some_type':
            return { ...state, myProperty: payload.someProperty };
        case 'some_other_type':
            return { ...state, myProperty: payload.someProperty };
        .....
        case 'some_other_type^N':
            return { ...state, myProperty: payload.someProperty };
    }

    return state;
};
```
So when reducers have many actions can easily become un-maintainalbe and confusing, this can be error prone, since developers must rely on eslinter to detect the mess.

Instead of a `switch`, the `Reducer` class, maps the `action.type` with a class method, while it handles the state mutation using the returned object by the method. Also reducers can be re-usable classes.

### Installation
<p>Installation is no different than any other `npm` package. Just execute the command bellow in a terminal, under the root directory of your project</p>

```bash
npm install --save focus-redux-reducer
```

### Basic Usage
Create a new class that extends the `Reducer` class and add your methods.

Methods can be mapped with a specific `action.type` by overridding the `Reducer.mapActionToMethod` method or the method name could exact match an `action.type`. That method should return an object, containing all the properties that should be updated. Return empty object if none should be updated.

Also a special `default` method can be defined and will be called when the `action.type` matches none of the methods or the mapped methods of the class.

#### Example

**MyReducer.js**
```javascript
import ReducerFactory,{ State, Action } from 'focus-redux-reducer';

class MyReducer extends ReducerFactory {
    // Mapping action types with instance methods
    mapActionToMethod() {
        return {
            SOME_ACTION_NAME: this.mappedMethod
        };
    }

    // Enter tour methods here
    mappedMethod(payload) {
        return this.updateStateProp('whatever', true);
    }

    fooMethod(payload, stuff) {
        // It's not necessary to manualy update the state or make a copy of it.
        // Whaterver the method return it will update the state.
        return { foo: payload, ...stuff };
    }

    // The default function acts excactly as the `default` case of a `switch` block.
    default(payload, { error }) {
        // if no  type matched and there is an error add return the error/
        if (error !== undefined) {
            return { error };
        }

        // Otherwise mutate nothing
        return {};
    }
}

const initialState = {
    foo: null;
    whatever: false
};

export default MyReducer.Create(initialState);
```

**App,js**

```jsx
import { createStore } from 'react-redux';
import MyReducer from './path-to/MyReducer';

const store = createStore(MyReducer);

store.dispatch({
    type: 'SOME_ACTION_NAME',
    payload: true
});

store.dispatch({
    type: 'fooMethod',
    payload: 'Hello World!'
    stuff: {...}
});

```

### Method reference

**ReducerFactory.Create**
<p>Creates a redux reducer.</p>

| argument     | type   | default | description |
|:--------------|:------|:-------|:-----------|
| initialState | object |   {}    | The initial state object |

| returns                 |                          |
|-------------------------|--------------------------|
| Reducer<S = object, A = Action> | A redux reducer function |

**ReducerFactory.mapActionToMethod**
<p>Returns an object that properties are action names/types, while the value is a callable. **Override** to map actions with reducer methods.</p>

| returns        |                                   |
|----------------|-----------------------------------|
| object<*Action*:*callable(payload, ...args)>*        | An object with the mapped actions |

**ReducerFactory.updateStateProp**
<p>A helper method that returns a new state</p>

| argument      | type   | default | description                |
|:--------------|:-------|:--------|:---------------------------|
| property      | string |         | A property name            |
| value         | mixed  |         | The value of that property |

| returns        |               |
|----------------|---------------|
| object         | The new state |


**ReducerFactory.updateState**
<p>Merges the current state with the given props and returns a fresh state object</p>

| argument     | type   | default | description |
|:--------------|:------|:-------|:-----------|
| newProps | object |    | An object with new properties name    |

| returns        |               |
|----------------|---------------|
| object         | The new state |

**ReducerFactory.currentStateCopy**
<p>Returns a copy of the current state</p>

| returns        |                     |
|----------------|---------------------|
| object         | A copy of the state |

**ReducerFactory.removeStateProp**
<p>Removes a property from the current state and return a new state.</p>

| argument      | type   | default | description                    |
|:--------------|:-------|:--------|:-------------------------------|
| property      | string |         | A property name to be removed  |

| returns        |               |
|----------------|---------------|
| object         | The new state |

