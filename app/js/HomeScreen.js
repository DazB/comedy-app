import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import EventsList from './EventsList';
import {Provider} from 'react-redux'
import configureStore from '../store/configureStore'; // Import the store

// Need to set an initial state of events so app doesn't shit itself
const initialState = {
  eventsReducer: {events: []}
};

const store = configureStore(initialState);

export default class HomeScreen extends Component {

  /* Title shown on header bar */
  static navigationOptions = {
    title: 'Heckler',
  };

  render() {
    return (
      // This passes the application state down to all components
      <Provider store={store}>

        <View style={styles.mainContainer}>
          <View style={styles.content}>
            <EventsList/>
          </View>
        </View>

      </Provider>

    );
  }
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1
  },
  content: {
    backgroundColor: '#ebeef0',
    flex: 1
  }
});