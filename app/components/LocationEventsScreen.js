import React, {Component} from 'react';
import {
  View
} from 'react-native';

import EventsList from './EventsList';
import Ionicons from "react-native-vector-icons/Ionicons";
import HeaderButtons from 'react-navigation-header-buttons';

/**
 * LocationEventsScreen displays the EventsList component
 */
export default class LocationEventsScreen extends Component {
  constructor(props) {
    super(props);
  }

  // Display location selected in title
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return {
      title: params ? params.placeName : 'Location',
      // Search icon on right
      headerLeft: (
        <HeaderButtons IconComponent={Ionicons} iconSize={23} color="white">
          <HeaderButtons.Item title="back" iconName="md-arrow-back" onPress={() => navigation.goBack()}/>
        </HeaderButtons>
      ),
    }
  };

  render() {
    const { params } = this.props.navigation.state;  // Access the params passed from navigation

    /* Display list of events */
    return (
      <EventsList navigation={this.props.navigation} location={params.location} />
    );
  }
}

