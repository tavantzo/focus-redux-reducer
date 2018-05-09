import React, { Component } from 'react';
import { createStore, Reducer as ReduxReducer } from 'redux';
import { connect } from 'react-redux';
import ReactTestUtils from 'react-dom/test-utils';
import { expect } from 'chai';
import Reducer from '../src/';

const INITIAL_STATE = {
    fooAction: null,
};

class TestReducer extends Reducer {

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
        const reducer = TestReducer.Create(INITIAL_STATE);

        it('constructor should return a valid redux reducer.', () => {
            expect(reducer).not.to.be.instanceof(Reducer);
            expect(reducer).not.to.be.instanceof(TestReducer);
            expect(reducer).to.be.instanceof(Function);
        });
        it('execptions', () => {
            const errMsg = 'Should `name` to be of type `string` and not empty `value`';
            const testFunc = () => {
                reducer(INITIAL_STATE, { type: [ 'test' ]});
            };
            expect(testFunc.bind(reducer)).to.throw(TypeError);
        });
    });

    describe('action dispatching', function() {
        const reducer = TestReducer.Create(INITIAL_STATE);
        const store = createStore(reducer);

        it('should be able to create a store', function() {
            expect(reducer).to.satisfy(createStore);
        });
        
        it('should be a valid store object', function() {
            expect(store).not.be.instanceof(Function);
            expect(store).to.be.instanceof(Object);
        });
        it('should return the same state as the INITIAL_STATE', () => {
            expect(store.getState()).to.be.deep.equal(INITIAL_STATE);
        });
        it('if not action match the default method should be triggered', () => {
            const action = { type: 'UNSUPPORTED', payload: true };
            store.dispatch(action);
            expect(store.getState()).not.to.deep.equal(INITIAL_STATE);
            expect(store.getState()['default-has-been-trigered']).to.be.equal(action.payload);
        });
        it('remove a state prop', () => {
            const action = { type: 'REMOVE_STATE_PROP', payload: 'default-has-been-trigered' };
            store.dispatch(action);
            expect(store.getState()).to.deep.equal(INITIAL_STATE);
            expect(store.getState()['default-has-been-trigered']).to.be.undefined;
        });
        it('action dispacthing updates state', () => {
            const action = { type: 'fooAction', payload: 'whatever' };
            store.dispatch(action);
            expect(store.getState()).not.to.deep.equal(INITIAL_STATE);
            expect(store.getState()[action.type]).to.be.equal(action.payload);
        });
        it('dispatching action with object payload', () => {
            const action = { type: 'justReturnPayload', payload: { a:0, b:1, c: 2 } };
            const copy = { ...store.getState() };
            store.dispatch(action);
            expect(store.getState()).not.to.deep.equal(INITIAL_STATE);
            expect(store.getState()).to.be.deep.equal( { ...action.payload, ...copy });
        });
        it('test the copy action state', () => {
            const action = { type: 'copyAction', payload: null };
            store.dispatch(action);
            expect(store.getState()).not.to.equal(INITIAL_STATE);
        });
        it('when no action type matched it just returns the current state', () => {
            const reducer2 = Reducer.Create(INITIAL_STATE);
            const store2 = createStore(reducer2);
            const action = { type: 'UNSUPPORTED', payload: true };
            store2.dispatch(action);
            expect(store2.getState()).to.deep.equal(INITIAL_STATE);
        });
    });
});
