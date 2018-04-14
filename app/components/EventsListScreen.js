import React, {Component} from 'react';
import {
  StyleSheet,
  View
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
      if (!this.props.isFetching || !this.props.error)
        return (
          <LocationMenu/>
        );
      return null;
    };

    // Show EventsList component, and the LocationMenu if data has been received
    return (
      <View style={styles.mainContainer}>
        <EventsList navigation={this.props.navigation} location={{"lat": 53.95996510000001,"lng": -1.0872979}}/>
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
    error: state.eventsReducer.error
  }
}

//Connect state to props (basically gets us the state)
export default connect(mapStateToProps)(EventsListScreen);

const styles = StyleSheet.create({
  mainContainer:{
    flex:1
  },

  locationMenuStyle: {
    position: 'absolute',
    right: 5,
    bottom: 5,
  },

});