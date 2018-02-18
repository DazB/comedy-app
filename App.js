import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import { TitleBar } from './js/TitleBar';
import { EventData } from './js/EventData';

/* Main of the app. This is where the magic happens */
export default class App extends Component {
  /* render() method is what displays the app */
  render() {
    return (
      <View style={styles.mainContainer}>
        <TitleBar />
        <View style={styles.content}>
          <EventData />
        </View>
      </View>
    );
  }
}

var styles = StyleSheet.create({
    mainContainer:{
        flex:1
    },
    content:{
        backgroundColor:'#ebeef0',
        flex:1
    }
});
