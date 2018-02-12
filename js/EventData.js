import React, { Component } from 'react';
import { List, FlatList, Text } from 'react-native';

export class EventData extends Component {
  // constructor(props) {
  //   super(props);
  //   this.state = {
  //     events: 'nuffin'
  //   }
  // }
  // componentDidMount() {
  //   var ws = new WebSocket('localhost');
  //
  //   /* listen to onmessage event */
  //   ws.connection.onmessage = (e) => {
  //     /* we've receieved a message. Add the new message to state */
  //     this.setState({
  //         events : e.data
  //     })
  //   }
  // }

  render() {
    return(
      /* render the messages from state */
      <FlatList
        data={[{key: 'a'}, {key: 'b'}]}
        renderItem={({item}) => <Text>{item.key}</Text>}
      />
    );
  }
}
