import React, { Component } from 'react';
import {
    StyleSheet,
    Text,
    View
} from 'react-native';

export default class TitleBar extends Component {
  render() {
    return (
      <View style={styles.toolbar}>
          <Text style={styles.toolbarTitle}>Heckler</Text>
          <Text style={styles.toolbarButton}>Share</Text>
      </View>
    );
  }
}

const styles = StyleSheet.create({
    toolbar:{
        backgroundColor:'cadetblue',
        paddingTop:30,
        paddingBottom:10,
        flexDirection:'row',
        justifyContent: 'space-between'
    },
    toolbarButton:{
        width: 50,
        color:'ghostwhite',
        textAlign:'center'
    },
    toolbarTitle:{
        width: 60,
        color:'ghostwhite',
        textAlign:'center',
        fontWeight:'bold',
        paddingLeft: 10
    }
});
