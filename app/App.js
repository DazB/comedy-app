/*
 * The main of our App. What's exported here is what is shown, and everything else is cascaded into that.
 */
import React from 'react';
import { Provider } from 'react-redux';
import { AppNavigator }from './navigators/AppNavigator';
import configureStore from './store/configureStore';
import {YellowBox} from 'react-native';
import {ADD_LOCATION} from "./actions";

// Need to set an initial state of events so app doesn't shit itself
const initialState = {
  eventsReducer: {eventsList: [], isFetching: false, error: true},
  locationReducer: {locations: [{placeName: "York Bitch", geoLocation: {lat:"53.9576300", lng:"-1.0827100"}}]}
};

const store = configureStore(initialState);

// // Gets rid of those bloody useless warnings
YellowBox.ignoreWarnings(['Warning: isMounted']);
YellowBox.ignoreWarnings(['Remote debugger']);

/*
* The main of the app. This is what is shown.
* Redux controls app data.
*/
export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <AppNavigator />
      </Provider>
    );
  }
}