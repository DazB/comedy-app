import React, {Component} from 'react';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';

import EventsList from './EventsList'
import LocationMenu from './LocationMenu';
import {connect} from 'react-redux'

/**
 * EventsListScreen displays the EventsList component
 */
class EventsListScreen extends Component {
  constructor(props) {
    super(props);
  }

  /* Title shown on header bar */
  static navigationOptions = {
    title: 'Heckler',
  };

  render() {
    // Only show the location menu button if we're not fetching data or if there's not been an error fetching data
    const ShowLocationMenu = () => {
      if (!this.props.isFetching && !this.props.error) {
        return (
          <LocationMenu navigation={this.props.navigation}/>
        );
      }
      return null;
    };

    // If no place has been selected, tell the user to go do that
    if (this.props.currentLocation === "") {
      return (
        <View style={styles.mainContainer}>
          <Text style={styles.errorMessageStyle}>
            See that wee button down there? {"\n\n\n"}
            Go ahead and push it {"\n"}
            Find yourself a nice place you want to see some comedy in
          </Text>
          <View style={styles.locationMenuStyle}>
            <LocationMenu navigation={this.props.navigation}/>
          </View>
        </View>
      );
    }

    // Show EventsList component, and the LocationMenu if data has been received
    return (
      <View style={styles.mainContainer}>
        <EventsList navigation={this.props.navigation} placeName={this.props.currentLocation[0]} location={this.props.currentLocation[1]}/>
        <View style={styles.locationMenuStyle}>
          <ShowLocationMenu/>
        </View>
      </View>

    );
  }
}

/*
  Take data from the app current state and insert/link it into the props
 */
function mapStateToProps(state) {
  return {
    isFetching: state.eventsReducer.isFetching,
    error: state.eventsReducer.error,
    currentLocation: state.locationReducer.currentLocation,
    locations: state.locationReducer.locations,
  }
}

//Connect state to props (basically gets us the state)
export default connect(mapStateToProps)(EventsListScreen);

const styles = StyleSheet.create({
  mainContainer:{
    flex:1,
  },

  locationMenuStyle: {
    flex:1,
    position: 'absolute',
    right: 10,
    bottom: 10,
  },

  errorMessageStyle: {
    fontFamily: 'helvetica',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20
  },

});