/*
* Reducers specify how the app state changes in response to actions sent to the store.
* Actions describe something happened, not how to change the app state.
* We use the spread operator (...state) to make a copy of the old state. We don't mutate the state.
* Pure functions. Don't do shit here that mutates arguments, or performs side effects
*/
import {combineReducers} from 'redux'

import {
  ADD_LOCATION,
  SELECT_LOCATION,
  REMOVE_LOCATION,
  REQUEST_EVENTS,
  RECEIVE_EVENTS,
} from '../actions/index'
import {INVALIDATE_EVENTS} from "../actions";

/*
* Location reducer
* Change state of app based on user adding or removing locations
*/
function locationReducer(state = {locations: [], currentPlaceName: ""}, action) {
  switch (action.type) {
    // Add new location to list of location
    case ADD_LOCATION:
      return {
        ...state,
        locations: [...state.locations, {placeName: action.placeName, geoLocation: action.geoLocation}]
      };
    // Save currently selected location
    case SELECT_LOCATION:
      return {
        ...state,
        currentPlaceName: action.placeName,
        currentGeoLocation: action.geoLocation,
      };

    // Removes selected location
    case REMOVE_LOCATION:
      const removedPlaceName = action.placeName;
      return {
        ...state,
        locations: state.locations.filter(location => location.placeName !== removedPlaceName)
      };
    default:
      return state
  }
}

/*
* Events reducer
* Used to change the state of the app based on calls to the API to request data.
* The actions make the actual calls
*/
function eventsReducer(state = { isFetching: false, events: [], eventsList: [] }, action) {
  switch (action.type) {
    // We've requested some events. Set isFetching to true
    case REQUEST_EVENTS:
      return {
        ...state,
        isFetching: true,
      };
    // We've received events
    case RECEIVE_EVENTS:
      return {
        ...state,
        isFetching: false,
        lastUpdated: action.receivedAt,
        events: action.events,
        eventsList: action.eventsList,
        error: action.error
      };
    // Make current list of events invalid
    case INVALIDATE_EVENTS:
      return {
        ...state,
        events: [],
      };
    default:
      return state
  }
}

// Combine reducers to pass to the store config
const rootReducer = combineReducers({
  locationReducer,
  eventsReducer
});

export default rootReducer
