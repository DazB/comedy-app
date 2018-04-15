import React, { Component } from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Text,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';

export default class LocationMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {showList: false};
    // This binding is necessary to make `this` work in the onPressButton callback
    this.onPressButton = this.onPressButton.bind(this);
  }

  // On button push, change state to show the menu
  onPressButton() {
    this.setState(previousState => {
      return {showList: !previousState.showList};
    });
  }

  render() {
    // Only show the location list if user toggled button
    const ShowLocationList = () => {
      if (this.state.showList) {
        return (
          <View style={styles.locationListStyle}>
            <FlatList
              data={[
                {key: 'Add/Remove Locations'},
              ]}
              renderItem={({item}) =>
                  <Text style={styles.listItem} onPress={() => this.props.navigation.navigate('LocationSearch')}>
                    {item.key}
                  </Text>
                }
            />
          </View>
        );
      }
      return null;
    };

    return (
      <View style={styles.menuContainer}>
        <ShowLocationList/>
        <TouchableOpacity style={styles.buttonStyle} onPress={this.onPressButton}>
          <Ionicons name={"md-pin"}  size={30} color="#01a699" />
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({

  menuContainer:{
    flex: 1,
  },

  buttonStyle: {
    borderWidth:1,
    borderColor:'rgba(0,0,0,0.2)',
    alignItems:'center',
    justifyContent:'center',
    width:70,
    height:70,
    backgroundColor:'#fff',
    borderRadius:100,
  },

  locationListStyle: {
    position: 'absolute',
    width: 140,
    right: 40,
    bottom: 60,
    backgroundColor:'#fff',
  },

  listItem: {
    padding: 10,
    fontSize: 16,
  },

});
