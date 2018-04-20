import React, {Component} from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import HeaderButtons from 'react-navigation-header-buttons'
import { NavigationActions } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

import {connect} from 'react-redux'

class LocationSearchScreen extends Component {

  /* Header bar */
  static navigationOptions = ({ navigation }) => {
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

  render() {
    return (
      <View style={styles.content}>
        <GooglePlacesInput navigation={this.props.navigation} onLocationSelect={this.props.onLocationSelect}/>
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
        listViewDisplayed='auto'    // true/false/undefined
        fetchDetails={true}
        renderDescription={row => row.description} // custom description render
        onPress={(data, details) => { // 'details' is provided when fetchDetails = true
          // add this location to our list of locations and make it the currently selected location on the main events screen
          this.props.onLocationSelect(data.description, details.geometry.location);
          // Navigate to main screen with new location. reset stops the screens from stacking.
          const resetAction = NavigationActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'EventsList' })],
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
          textInputContainer: {
            width: '100%'
          },
          description: {
            fontWeight: 'bold'
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

function mapDispatchToProps(dispatch) {
  return {
    // When location is selected from the search location list, invalidate current list of events,
    // add selected location to our list and set it as current location
    onLocationSelect: (placeName, geoLocation) => {
      dispatch({type: 'INVALIDATE_EVENTS'});
      dispatch({type: 'ADD_LOCATION', placeName: placeName, geoLocation: geoLocation});
      dispatch({type: 'SELECT_LOCATION', placeName: placeName, geoLocation: geoLocation});
    }
  }
}

export default connect(null, mapDispatchToProps)(LocationSearchScreen);

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#ebeef0',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});