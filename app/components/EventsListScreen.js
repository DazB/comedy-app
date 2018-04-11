import React, {Component} from 'react';
import {
  View
} from 'react-native';

import EventsList from './EventsList'

/**
 * EventsListScreen displays the EventsList component
 */
export default class EventsListScreen extends Component {
  constructor(props) {
    super(props);
  }

  /* Title shown on header bar */
  static navigationOptions = {
    title: 'Heckler',
  };

  render() {
    /* Simply display the events list */
    return (
      <EventsList navigation={this.props.navigation}/>
    );
  }
}

