/*
* Reducers specify how the app state changes in response to actions sent to the store.
* Actions describe something happened, not how to change the app state.
* Pure functions. Don't do shit here that mutates arguments, or performs side effects
*/

import {combineReducers} from 'redux'
import {
  REQUEST_EVENTS,
  RECEIVE_EVENTS,
  SELECT_EVENT
} from '../actions/index'

function eventsReducer(state = { isFetching: false, events: [] }, action) {
  switch (action.type) {
    case REQUEST_EVENTS:
      return Object.assign({}, state, {
        isFetching: true,
      });
    case RECEIVE_EVENTS:
      return Object.assign({}, state, {
        isFetching: false,
        lastUpdated: action.receivedAt,
        events: action.events,
        error: action.error
      });
    default:
      return state
  }
}

const rootReducer = combineReducers({
  eventsReducer
});

export default rootReducer
