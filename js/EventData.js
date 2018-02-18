import React, { Component } from 'react';
import { ActivityIndicator, View, List, FlatList, Text, RefreshControl } from 'react-native';

var TIMEOUT = 10000; // timeout in ms

/*
Timeout function used for fetching of data
Taken from https://github.com/github/fetch/issues/175#issuecomment-125779262
Tried to use https://github.com/facebook/react-native/issues/2556 but normal
fetch kept over riding it, so timout didn't work, so fuck it, this'll do
*/
function timeout(ms, promise) {
  return new Promise(function(resolve, reject) {
    setTimeout(function() {
      reject(new Error("timeout"))
    }, ms)
    promise.then(resolve, reject)
  })
}

export class EventData extends Component {
  constructor(props) {
    super(props);
    this.state = {
      events: '',
      isLoading: true,
      error: false,
      refreshing: false
    }
  }


  /* Using the fetch api, we attempt to make a GET requet for event data from
  our server. Use a timeout if shit takes too long */
  fetchData() {
    return timeout(TIMEOUT, fetch('http://10.0.1.17:5000/'))
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          events: responseJson,
          isLoading: false,
          error: false,
        });
      })
      .catch((error) => {
        this.setState({
          events: '',
          isLoading: false,
          error: true,
        });
      });
    }

  // invoked immediately after a component is mounted
  componentDidMount() {
    return this.fetchData();
  }


  _onRefresh() {
    this.setState({refreshing: true});
    this.fetchData().then(() => {
      this.setState({refreshing: false});
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
    // If fetch command still getting data, show loading shit
    if (this.state.isLoading) {
      return (
        <View style={{paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    // fetch has had an error of somekind
    if (this.state.error) {
      return (
        <View>
            <Text>
              Whoopsie doopsie. Seems something's wrong with the connection.
            </Text>
        </View>
      );
    }

    return (
      /* render the events stored in the state in a FlatList. Also has pull down
      for refresh shit */
      <FlatList
        data={this.state.events}
        renderItem={({item}) => this.renderFlatListItem(item)}
        refreshControl={
          <RefreshControl
            refreshing={this.state.refreshing}
            onRefresh={this._onRefresh.bind(this)}
          />
        }
      />
    );
  }
}
