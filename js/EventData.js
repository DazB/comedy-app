import React, { Component } from 'react';
import { List, FlatList, Text } from 'react-native';
import { SocketIOClient } from 'socket.io-client';

export class EventData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: ''
    }

  }

  componentDidMount() {
    // Creating the socket-client instance will automatically connect to the server.
    const socket = SocketIOClient('http://localhost:8000');

    socket.on('message', (message) => {
      // React will automatically rerender the component when a new message is added.
      this.setState({
        events: message
      });
    });


    // /* listen to onmessage event */
    // ws.connection.onmessage = (e) => {
    //   /* we've receieved a message. Add the new message to state */
    //   this.setState({
    //       events : e.data
    //   });
    // };

    // var json = fetch('http://localhost');
    // this.setState({
    //   events : json
    // });
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
