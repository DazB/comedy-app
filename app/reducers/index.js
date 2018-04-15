/*
* Reducers specify how the app state changes in response to actions sent to the store.
* Actions describe something happened, not how to change the app state.
* Pure functions. Don't do shit here that mutates arguments, or performs side effects
*/
import {combineReducers} from 'redux'

import {
  REQUEST_EVENTS,
  RECEIVE_EVENTS,
} from '../actions/index'

/*
* Events reducers
* These are used to change the state of the app based on calls to the API to request data.
* The actions make the actual calls
*/
function eventsReducer(state = { isFetching: false, events: [], eventsList: [] }, action) {
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
        eventsList: action.eventsList,
        error: action.error
      });
    default:
      return state
  }
}

// Combine both reducers to pass to the store config
const rootReducer = combineReducers({
  // nav,
  eventsReducer
});

export default rootReducer
