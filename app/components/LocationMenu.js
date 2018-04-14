import React, { Component } from 'react';
import {StyleSheet, TouchableOpacity} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class LocationMenu extends Component {

  render() {
    return (
      <TouchableOpacity
        style={{
          borderWidth:1,
          borderColor:'rgba(0,0,0,0.2)',
          alignItems:'center',
          justifyContent:'center',
          width:60,
          height:60,
          backgroundColor:'#fff',
          borderRadius:100,
        }}
      >
        <Ionicons name={"md-pin"}  size={30} color="#01a699" />
      </TouchableOpacity>
    );
  }
}
