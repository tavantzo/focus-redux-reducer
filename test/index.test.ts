import { State, Action, ReducerFactory, actionType } from '../src/';
import { Reducer, Store, createStore, combineReducers } from 'redux';

import { expect } from 'chai';

const SOME_TYPE = "SOME_TYPE";
const SOME_OTHER_TYPE = "SOME_OTHER_TYPE";

const INITIAL_STATE: State = {
    fooAction: null,
    decorated: null
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

    @actionType(SOME_TYPE, SOME_OTHER_TYPE)
    decoratedAction(text) {
        return this.updateStateProp('decorated', text);
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

    reset(initState) {
        return this.updateState(initState);
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
        store.dispatch({type: 'reset', payload: INITIAL_STATE});

        it('should be able to create a store', function() {
            expect(reducer).to.satisfy(createStore);
        });

        it('should be a valid store object', function() {
            expect(store).not.be.instanceof(Function);
            expect(store).to.be.instanceof(Object);
        });
        it('should return the current state', () => {
            store.dispatch({type: '@@INIT'});
            expect(store.getState()).to.be.deep.equal(INITIAL_STATE);
        });
        it("should call decorated methods", () => {
            const payload = "Hello decoratrors"
            const payload2 = "Other decorator";
            const action: Action  = { type: SOME_TYPE, payload };
            const action2: Action = { type: SOME_OTHER_TYPE, payload: payload2 };

            store.dispatch(action);
            expect(store.getState()).not.to.deep.equal(INITIAL_STATE);
            expect(store.getState()["decorated"]).to.be.equal(payload);
            store.dispatch(action2);
            expect(store.getState()["decorated"]).to.be.equal(payload2);
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
            const action: Action = { type: 'UNSUPPORTED', payload: false };
            const currentState = store2.getState();
            store2.dispatch(action);
            expect(store2.getState()).to.deep.equal(currentState);
        });
    });
});
