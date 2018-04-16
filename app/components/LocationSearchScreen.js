import React, {Component} from 'react';
import {View, StyleSheet, TouchableHighlight} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import HeaderButtons from 'react-navigation-header-buttons'

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
          // navigate to main screen with new location
          this.props.navigation.navigate('EventsList')
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
    // When location is selected from the search location list, add it to our list and select it as current location
    onLocationSelect: (placeName, geoLocation) => {
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