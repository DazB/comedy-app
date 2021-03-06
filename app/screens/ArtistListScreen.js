import React, { Component } from 'react';
import {View, Text, StyleSheet} from 'react-native';

export default class ArtistListScreen extends Component {
  /* Title shown on header bar */
  static navigationOptions = {
    title: 'Comedians',
  };
  render() {
    return (
      <View style={styles.mainContainer}>
        <View style={styles.content}>
          <Text>Comedians!</Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },
  content:{
    backgroundColor:'#ebeef0',
    flex:1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});