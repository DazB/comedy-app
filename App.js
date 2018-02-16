import React, { Component } from 'react';
import { View } from 'react-native';
import { TitleBar } from './js/TitleBar';
import { EventData } from './js/EventData';

/* Main of the app. This is where the magic happens */
export default class App extends Component {
  /* render() method is what displays the app */
  render() {
    return(
      <View>
        <TitleBar />
        <EventData />
      </View>
    );
  }
}
