import React, {Component} from 'react';
import {View, StyleSheet, FlatList, Text, TouchableOpacity} from 'react-native';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import HeaderButtons from 'react-navigation-header-buttons'
import {NavigationActions} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {connect} from 'react-redux'
import {fetchEventsIfNeeded} from "../actions";

class LocationSearchScreen extends Component {

  /* Header bar */
  static navigationOptions = ({navigation}) => {
    return {
      title: 'Locations',
      // Search icon on right
      headerLeft: (
        <HeaderButtons IconComponent={Ionicons} iconSize={23} color="white">
          <HeaderButtons.Item title="back" iconName="md-arrow-back" onPress={() => navigation.goBack()}/>
        </HeaderButtons>
      ),
    }
  };

  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  render() {
    // Go through list of saved locations and display names in list
    let listData = [];
    // Pushes every saved location object {placeName: "...", geoLocation: "..."} into listData.
    this.props.locations.forEach((location) => {
      listData.push(location);
    });
    return (
      <View style={styles.content}>
        <GooglePlacesInput navigation={this.props.navigation} dispatch={this.props.dispatch}
                           locations={this.props.locations}/>
        <FlatList
          data={listData}
          renderItem={({item}) =>
            <View style={{flex: 1, flexDirection: 'row'}}>
              <Text style={styles.locationTextStyle} onPress={() => {
                this.props.dispatch({
                  type: 'SELECT_LOCATION',
                  placeName: item.placeName,
                  geoLocation: item.geoLocation
                });
                this.props.dispatch({type: 'INVALIDATE_EVENTS'});
                this.props.dispatch(fetchEventsIfNeeded(item.geoLocation));
                this.props.navigation.navigate('EventsList');
              }}>
                {item.placeName}
              </Text>
              <TouchableOpacity onPress={() => {
                this.props.dispatch({
                  type: 'REMOVE_LOCATION',
                  placeName: item.placeName,
                });
              }}>
                <View style={styles.removeButtonStyle}>
                    <Ionicons name={'md-close'} size={30} color={'red'}/>
                </View>
              </TouchableOpacity>
            </View>
            }
          // Key is place name (should be unique, right?)
          keyExtractor={item => item.placeName}
          ItemSeparatorComponent={this._renderSeparator}
        />
      </View>
    )
  }
}

class GooglePlacesInput extends Component {
  render() {
    return (
      <GooglePlacesAutocomplete
        placeholder='Search for funny places'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        returnKeyType={'search'} // Search icon, https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        listViewDisplayed='auto'   // true/false/undefined
        fetchDetails={true}
        renderDescription={row => row.description} // custom description render
        onPress={(data, details) => { // 'details' is provided when fetchDetails = true
          // Check to see if the selected location exists in our list of locations
          let locationAlreadySaved = false;
          // If our locations list is empty, well this is a new locations innit?
          if (!this.props.locations || (this.props.locations.length === 0)) {
            locationAlreadySaved = false;
          }
          // Go through every saved location compare to one selected
          this.props.locations.forEach((location) => {
            if (location.placeName === data.description) {
              locationAlreadySaved = true;
            }
          });
          // Only add location if it isn't already saved to our list of locations
          if (!locationAlreadySaved) {
            // add this location to our list of locations and make it the currently selected location on the main events screen
            this.props.dispatch({
              type: 'ADD_LOCATION',
              placeName: data.description,
              geoLocation: details.geometry.location
            });
          }
          this.props.dispatch({
            type: 'SELECT_LOCATION',
            placeName: data.description,
            geoLocation: details.geometry.location
          });
          this.props.dispatch({type: 'INVALIDATE_EVENTS'});

          // Navigate to main screen with new location. reset stops the screens from stacking.
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'EventsList'})],
          });
          this.props.navigation.dispatch(resetAction);
        }}

        getDefaultValue={() => ''}

        query={{
          // available options: https://developers.google.com/places/web-service/autocomplete
          key: 'AIzaSyAlw2gnq5IWHlSnEGW5q0mjZ2xSDVqEWIk',
          language: 'en', // language of the results
          types: '(cities)' // default: 'geocode'
        }}

        styles={{
          container: {
            flex: 0,
          },
          textInputContainer: {
            width: '100%',
          },
          description: {
            fontSize: 15,
            color: '#000',
            // fontWeight: 'bold'
          },
          predefinedPlacesDescription: {
            color: '#1faadb'
          }
        }}
        debounce={200} // debounce the requests in ms. Set to 0 to remove debounce. By default 0ms.
      />
    );
  }
}

// Take data from the app current state and insert/link it into the props. Also maps dispatch.
function mapStateToProps(state) {
  return {
    locations: state.locationReducer.locations,
    currentPlaceName: state.locationReducer.currentPlaceName,
  }
}

export default connect(mapStateToProps)(LocationSearchScreen);

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#ebeef0',
    flex: 1,
  },

  locationTextStyle: {
    flex: 1,
    fontSize: 15,
    padding: 13,
    height: 44,
    color: '#000',
  },

  removeButtonStyle: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width: 44,
    height: 44,
  }

});