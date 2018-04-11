import React, {Component} from 'react';
import {View, Text, StyleSheet, Image} from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import HeaderButtons from 'react-navigation-header-buttons'
import Ionicons from 'react-native-vector-icons/Ionicons';

export default class LocationsScreen extends Component {

  /* Title shown on header bar */
  static navigationOptions = {
    title: 'Locations',
  };

  render() {
    return (
      <View style={styles.content}>
        <GooglePlacesInput navigation={this.props.navigation}/>
      </View>
    )
  }
}

class GooglePlacesInput extends Component {
  render() {
    return (
      <GooglePlacesAutocomplete
        placeholder='Search'
        minLength={2} // minimum length of text to search
        autoFocus={false}
        returnKeyType={'search'} // Search icon, https://facebook.github.io/react-native/docs/textinput.html#returnkeytype
        listViewDisplayed='auto'    // true/false/undefined
        renderDescription={row => row.description} // custom description render
        onPress={(data = null) => { // 'details' is provided when fetchDetails = true
          this.props.navigation.dispatch({
            type: 'EventsList', location: data.description
          })
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

const styles = StyleSheet.create({
  content: {
    backgroundColor: '#ebeef0',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});