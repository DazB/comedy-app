import React, { Component } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export class TitleBar extends Component {
  render() {
    return(
      <View style={{flex: 1, flexDirection: 'row'}} >
        <View style={{flex: 1, height: 70, backgroundColor: 'powderblue', justifyContent: 'flex-end'}} >
            <Text style={styles.bigblue}> teehee </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  bigblue: {
    color: 'blue',
    fontWeight: 'bold',
    fontSize: 20,
  },
});
