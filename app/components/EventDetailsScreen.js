import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Button
} from 'react-native';

import {connect} from 'react-redux'

/**
 * EventDetailsScreen displays a single event that was selected in EventsListScreen.
 */
class EventsDetailsScreen extends Component {
  constructor(props) {
    super(props);
  }

  render(){
    const { params } = this.props.navigation.state;  // Access the params passed from navigation
    let events = this.props.events["events"]; // Get all the events
    let event = events[params.id];  // Find all the details for the event clicked on

    return (
      <View>
        <Text style={styles.textStyle}>
          Headline: {event["headline"]}
          {"\n\n\n"}
          Venue: {event["venue"]["name"]}

        </Text>
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>

      )
  }
}

function mapStateToProps(state) {
  return {
    events: state.eventsReducer.events,
  }
}

//Connect everything
export default connect(mapStateToProps)(EventsDetailsScreen);

const styles = StyleSheet.create({

  textStyle: {
    fontFamily: 'helvetica',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20
  }
});