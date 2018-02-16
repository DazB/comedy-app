import React, { Component } from 'react';
import { View, List, FlatList, Text } from 'react-native';

export class EventData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: ''
    }

  }


  // invoked immediately after a component is mounted
  componentDidMount() {
    return fetch('http://10.0.1.17:5000/')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          events: responseJson,
        });
      })
      .catch((error) => {
        console.error(error);
      });
  }


  renderFlatListItem(item) {
      return (
  	    <View>
  		      <Text>{item.headline}</Text>
            <Text>{item.date}</Text>
  	    </View>
      );
  }

  render() {
    return(
      /* render the messages from state */
      <FlatList
        data={this.state.events}
        renderItem={({item}) => this.renderFlatListItem(item)}
      />
    );
  }
}
