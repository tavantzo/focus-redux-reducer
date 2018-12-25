import { Action, ReducerFactory, State } from '../src/';
import { Reducer, Store, createStore, combineReducers } from 'redux';

import { expect } from 'chai';

const INITIAL_STATE: State = {
    fooAction: null,
};

class TestReducer extends ReducerFactory {

    mapActionToMethod() {
        return {
            REMOVE_STATE_PROP: this.removeStateProp
        };
    }

    default(payload) {
        const state = this.currentStateCopy();
        if (payload) {
            return this.updateStateProp('default-has-been-trigered', payload);
        }

        return state;
    }

    fooAction(text) {
        return this.updateStateProp('fooAction', text);
    }

    justReturnPayload(payload) {
        return payload;
    }

    copyAction(text) {
        return this.currentStateCopy();
    }
}

describe('ReducerBase class tests', function() {
    describe('all', function() {
        const reducer: Reducer<State, Action> = TestReducer.Create(INITIAL_STATE);

        it('constructor should return a valid redux reducer.', () => {
            expect(reducer).not.to.be.instanceof(ReducerFactory);
            expect(reducer).not.to.be.instanceof(TestReducer);
        });
        it('execptions', () => {
            const errMsg = 'Should `name` to be of type `string` and not empty `value`';
            const testFunc = () => {
                // @ts-ignore
                reducer(INITIAL_STATE, { type: [ 'test' ], payload: null});
            };
            expect(testFunc.bind(reducer)).to.throw(TypeError);
        });
    });

    describe('action dispatching', function() {
        const reducer: Reducer<State, Action> = TestReducer.Create(INITIAL_STATE);
        const store: Store = createStore(reducer);

        it('should be able to create a store', function() {
            expect(reducer).to.satisfy(createStore);
        });

        it('should be a valid store object', function() {
            expect(store).not.be.instanceof(Function);
            expect(store).to.be.instanceof(Object);
        });
        it('should return the same state as the INITIAL_STATE', () => {
            store.dispatch({type: '@@INIT'});
            expect(store.getState()).to.be.deep.equal(INITIAL_STATE);
        });
        it('if not action match the default method should be triggered', () => {
            const action: Action = { type: 'UNSUPPORTED', payload: true };
            store.dispatch(action);
            expect(store.getState()).not.to.deep.equal(INITIAL_STATE);
            expect(store.getState()['default-has-been-trigered']).to.be.equal(action.payload);
        });
        it('remove a state prop', () => {
            const action: Action = { type: 'REMOVE_STATE_PROP', payload: 'default-has-been-trigered' };
            store.dispatch(action);
            expect(store.getState()).to.deep.equal(INITIAL_STATE);
            expect(store.getState()['default-has-been-trigered']).to.be.undefined;
        });
        it('action dispacthing updates state', () => {
            const action: Action = { type: 'fooAction', payload: 'whatever' };
            store.dispatch(action);
            expect(store.getState()).not.to.deep.equal(INITIAL_STATE);
            expect(store.getState()[action.type]).to.be.equal(action.payload);
        });
        it('dispatching action with object payload', () => {
            const action: Action = { type: 'justReturnPayload', payload: { a:0, b:1, c: 2 } };
            const copy: State = { ...store.getState() };
            store.dispatch(action);
            expect(store.getState()).not.to.deep.equal(INITIAL_STATE);
            expect(store.getState()).to.be.deep.equal( { ...action.payload, ...copy });
        });
        it('test the copy action state', () => {
            const action: Action = { type: 'copyAction', payload: null };
            store.dispatch(action);
            expect(store.getState()).not.to.equal(INITIAL_STATE);
        });
        it('when no action type matched it just returns the current state', () => {
            const reducer2: Reducer<State, Action> = ReducerFactory.Create(INITIAL_STATE);
            const store2: Store = createStore(reducer2);
            const action: Action = { type: 'UNSUPPORTED', payload: true };
            store2.dispatch(action);
            expect(store2.getState()).to.deep.equal(INITIAL_STATE);
        });
        it('when store initialize the reducer with empty state', () => {
            const state = { test: true };
            const reducer2: Reducer<State, Action> = ReducerFactory.Create(state);
            const store2: Store = createStore(combineReducers({reducer2}));
            // @ts-ignore
            const action: Action = { type: 'whatever', payload: { test: true }};
            const newState = reducer2(undefined, action);
            store2.dispatch(action);
            expect(newState).to.deep.equal(state);
            expect(store2.getState().reducer2).to.deep.equal(state);
        });
    });
});
