/*
* Reducers specify how the app state changes in response to actions sent to the store.
* Actions describe something happened, not how to change the app state.
* Pure functions. Don't do shit here that mutates arguments, or performs side effects
*/
import {combineReducers} from 'redux'

import { NavigationActions } from 'react-navigation';
import { AppNavigator } from '../navigators/AppNavigator';

import {
  REQUEST_EVENTS,
  RECEIVE_EVENTS,
} from '../actions/index'

/*
* Navigation routes
* These reducers are called through dispatches throughout the app, and handle the state changes for navigation.
*/

// Our initial states, basically where the app states, in this case the home screen (which is the tabs for some reason)
const firstAction = AppNavigator.router.getActionForPathAndParams('Home');
const initialNavState = AppNavigator.router.getStateForAction(firstAction);

function nav(state = initialNavState, action) {
  let nextState;
  switch (action.type) {
    case 'EventDetails':
      nextState = AppNavigator.router.getStateForAction(
        NavigationActions.navigate({ routeName: 'EventDetails' , params: {headline: action.headline, id: action.id}}),
        state
      );
      break;
    default:
      nextState = AppNavigator.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
}

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
  nav,
  eventsReducer
});

export default rootReducer
