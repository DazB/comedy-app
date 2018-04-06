import React, {Component} from 'react';
import {
  Text,
  StyleSheet,
  View,
  Button
} from 'react-native';

/**
 * EventDetailsScreen displays a single event that was selected in EventsListScreen.
 */
export default class EventsDetailsScreen extends Component {
  constructor(props) {
    super(props);
  }
  render(){
    // Access the params passed in from EventsDetailsScreen
    const { params } = this.props.navigation.state;
    return (
      <View>
        <Text style={styles.TextStyle}>
          {params.event}
        </Text>
        <Button
          title="Go back"
          onPress={() => this.props.navigation.goBack()}
        />
      </View>

      )
  }
}

const styles = StyleSheet.create({

  TextStyle: {
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