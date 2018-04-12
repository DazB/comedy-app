/*
* Actions are payloads of information that send data to the store. They are the only source of info for the store.
* Send actions to the store using store.dispatch()
* They are Objects, and must have a 'type' property.
* They are the things returned in the action creators.
*
* Action creator are functions that create and return actions.
*/

const TIMEOUT = 5000; // timeout to fetch data in ms

export const REQUEST_EVENTS = 'REQUEST_EVENTS';
/* Request Events action creator */
function requestEvents() {
  return {
    type: REQUEST_EVENTS
  }
}

export const RECEIVE_EVENTS = 'RECEIVE_EVENTS';
/* Receive Events action creator */
function receiveEvents(json, error) {
  // If there's been an error, return empty object, else return parsed list of events
  let eventsList = error ? [] : (parseJSON(json));
  return {
    type: RECEIVE_EVENTS,
    receivedAt: Date.now(),
    events: json,
    eventsList: eventsList,
    error: error
  }
}

/*
* Here an action creator can return a function instead of an action object. This way, the action creator becomes a thunk.
* When an action returns a thunk, it's executed by Redux middleware (redux-thunk). Doesn't need to be pure, so can have
* side effects, e.g. API calls.
*/
function fetchEvents(geoLocation) {
  // localhost for android emulator
  let ipAddress = 'http://10.0.2.2:8080/'; // Server ip address. Other ip => 'http://10.0.1.17:5000/'

  if (typeof geoLocation !== 'undefined') { // Check if we've been passed a geo coordinate location
    ipAddress += 'events?location=' + geoLocation.lat +',' + geoLocation.lng; // Append it to the end of our API call
  }

  // Thunk middleware passes the dispatch method as an argument to the function,
  // thus making it able to dispatch actions itself.
  return function (dispatch) {
    // First dispatch: the app state is updated to inform that the API call is starting.
    dispatch(requestEvents());

    // The function called by the thunk middleware can return a value,
    // that is passed on as the return value of the dispatch method.

    return timeout(TIMEOUT, fetch(ipAddress))
      .then(response => response.json())
      /* On success the update the app state with the results of the API call and say no errors */
      .then(json => dispatch(receiveEvents(json, false)))
      // On a timeout return an undefined list of events and say there's been an error
      .catch(error => dispatch(receiveEvents({}, true)))
  }
}

// Returns true if events in application state is empty
function shouldFetchEvents(state) {
  const events = state.events;
  if (!events) {
    return true
  } else if (state.isFetching) {
    return false
  }
}

export function fetchEventsIfNeeded(geoLocation) {
  // Note that the function also receives getState()
  // which lets you choose what to dispatch next.

  // This is useful for avoiding a network request if
  // a cached value is already available.

  return (dispatch, getState) => {
    if (shouldFetchEvents(getState())) {
      // Dispatch a thunk from thunk!
      return dispatch(fetchEvents(geoLocation))
    } else {
      // Let the calling code know there's nothing to wait for.
      return Promise.resolve()
    }
  }
}

/**
 * Timeout function used for fetching of data
 * Taken from https://github.com/github/fetch/issues/175#issuecomment-125779262
 * Tried to use https://github.com/facebook/react-native/issues/2556 but normal
 * fetch kept over riding it, so timeout didn't work, so fuck it, this'll do.
 * Will ignore if data is received after timeout.
 * @param ms timeout in milliseconds
 * @param promise
 * @returns {Promise<any>}
 */
function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"))
    }, ms);
    promise.then(resolve, reject)
  })
}

/**
 * Goes through json of events data, extracting dates and headlines and put them in an array to show on screen. We also
 * put the event id in the array know which event to show details for
 * @param json events data
 * @returns {Array} date as key and array of headlines performing that date as value
 */
function parseJSON(json) {
  if (json.length === 0) return []; // If we didn't get any data return an empty list
  let eventsList = []; // This will be returned and shown on screen
  let events = json["events"]; // Grab array of every event
  // Go through every event
  for (let event in events) {
    // Check to make sure we're iterating over right data
    if (events.hasOwnProperty(event)) {
      // If nothings been added, add first event
      if (eventsList.length === 0) {
        eventsList.push({title: events[event]["date"], data: [{id: events[event]["id"], headline: events[event]["headline"]}]})
      }
      else {
        // Events added chronologically. If this date equals the last one added, add event to that date
        if (events[event]["date"] === eventsList[eventsList.length - 1]["title"]) {
          eventsList[eventsList.length - 1]["data"].push({id: events[event]["id"], headline: events[event]["headline"]})
        }
        // New date. Add it with an array containing the headline
        else
          eventsList.push({title: events[event]["date"], data: [{id: events[event]["id"], headline: events[event]["headline"]}]})
      }
    }
  }

  return eventsList;
}