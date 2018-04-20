import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  View,
  FlatList,
  Text,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from "react-redux";
import {fetchEventsIfNeeded} from "../actions";

class LocationMenu extends Component {
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
        // Go through list of saved locations and display names in list
        let listData = [];
        for (let index in this.props.locations) {
          if (this.props.locations.hasOwnProperty(index)) {
              listData.push(this.props.locations[index]);
          }
        }
        listData.push({placeName: 'Add/Remove Locations'});
        return (
          <View style={styles.locationListStyle}>
            <FlatList
              data={listData}
              renderItem={({item}) =>
                <Text style={styles.listItem} onPress={() => {
                  if (item.placeName === 'Add/Remove Locations') {
                    this.setState({showList: false});
                    this.props.navigation.navigate('LocationSearch');
                  }
                  else {
                    this.setState({showList: false});
                    // Only dispatch if selected place name is different to the one currently showing
                    if (this.props.currentPlaceName !== item.placeName) {
                      this.props.dispatch({
                        type: 'SELECT_LOCATION',
                        placeName: item.placeName,
                        geoLocation: item.geoLocation
                      });
                      this.props.dispatch({type: 'INVALIDATE_EVENTS'});
                      this.props.dispatch(fetchEventsIfNeeded(item.geoLocation));
                    }
                  }
                }
                }>
                  {item.placeName}
                </Text>
              }
              // Key is place name (should be unique, right?)
              keyExtractor={item => item.placeName}
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
          <Ionicons name={"md-pin"} size={30} color="#01a699"/>
        </TouchableOpacity>
      </View>
    );
  }
}


// Take data from the app current state and insert/link it into the props
function mapStateToProps(state) {
  return {
    locations: state.locationReducer.locations,
    currentPlaceName: state.locationReducer.currentPlaceName,
  }
}

//Connect state to props (basically gets us the state)
export default connect(mapStateToProps)(LocationMenu);

const styles = StyleSheet.create({

  menuContainer: {
    flex: 1,
  },

  buttonStyle: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 100,
  },

  locationListStyle: {
    position: 'absolute',
    width: 140,
    right: 40,
    bottom: 60,
    backgroundColor: '#fff',
  },

  listItem: {
    padding: 10,
    fontSize: 16,
  },

});
