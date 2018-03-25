import React, { Component } from 'react';
import {
    ActivityIndicator,
    View,
    SectionList,
    ScrollView,
    Text,
    RefreshControl,
    StyleSheet
} from 'react-native';

const TIMEOUT = 5000; // timeout to fetch data in ms

/**
 * EventsList component grabs events data from server and displays in a SectionList.
 * TODO comoponents should do one thing. need to make a data grabber component higher in the hierachey
 */
export default class EventsList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      events: {},
      error: false,
      refreshing: true
    }
  }

  // TODO: timeout stops data getting to us if it takes a little while, i.e. if it does get sent but just a little late won't refresh

  /**
  * Using the fetch api, we attempt to make a GET request for event data from
  * our server. Use a timeout if shit takes too long
  * @returns {Promise<T>}
  */
  fetchData() {
     //return timeout(TIMEOUT, fetch('http://10.0.1.17:5000/')) // server address
      return timeout(TIMEOUT, fetch('http://10.0.2.2:8080/')) // localhost for android emulator
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          events: responseJson,
          refreshing: false,
          error: false,
        });
      })
      .catch((error) => {
        this.setState({
          events: '',
          refreshing: false,
          error: true,
        });
      });
    }

  // invoked immediately after a component is mounted
  componentDidMount() {
    return this.fetchData();
  }


  // Called when user pulls down on connection error message. Will cause little spinny refresh circle thing to appear
  _onRefresh() {
    this.setState({
        refreshing: true});
    this.fetchData().then(() => {
      this.setState({
          refreshing: false});
    });
  }

  render() {
    // If fetch command still getting data, show loading shit (little spinny refresh circle
    if (this.state.refreshing) {
      return (
        <View style={{paddingTop: 20}}>
          <ActivityIndicator />
        </View>
      );
    }

    /* fetch has had an error of some kind :)
    Use ScrollView with refresh shit to show error message */
    if (this.state.error) {
      return (
          <ScrollView
              refreshControl={
                  <RefreshControl
                      refreshing={this.state.refreshing}
                      onRefresh={this._onRefresh.bind(this)}
                  />
              }
              >
              <Text style={styles.ErrorMessageStyle}>
                  S'mofo butter layin' me to da' BONE! Jackin' me up... tight me {"\n\n\n"}
                  Connection error {"\n"}
                  Wait a mo and pull down to refresh
              </Text>
          </ScrollView >
      );
    }

    /* We have no error from the fetch, so should have data :D
    Go through events JSON we got, and turn that into an array that SectionList can read */
    let sectionListEvents = parseJSON(this.state.events);

    return (
        // Main events list
        <SectionList
            sections={sectionListEvents}
            renderSectionHeader={ ({section}) => <Text style={styles.SectionHeaderStyle}> { section.title } </Text> }
            renderItem={ ({item}) => <Text style={styles.SectionListItemStyle} > { item } </Text> }
            keyExtractor={ (item, index) => index }
        />
    );
  }
}

/**
 * Timeout function used for fetching of data
 * Taken from https://github.com/github/fetch/issues/175#issuecomment-125779262
 * Tried to use https://github.com/facebook/react-native/issues/2556 but normal
 * fetch kept over riding it, so timout didn't work, so fuck it, this'll do
 * @param ms timeout in milliseconds
 * @param promise
 * @returns {Promise<any>}
 */
function timeout(ms, promise) {
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            reject(new Error("timeout"))
        }, ms);
        promise.then(resolve, reject)
    })
}


/**
 * Goes through json of events data, removing dates and headlines and put them in an array to show on screen
 * @param json events data
 * @returns {Array} date as key and array of headlines performing that date as value
 */
function parseJSON(json) {
    let eventsSection = []; // This will be shown on screen
    let events = json["events"]; // Grab array of every event
    // Go through every event
    for (let i = 0; i < events.length; i++) {
        // If nothings been added, add first event
        if (eventsSection.length === 0) {
            eventsSection.push({title: events[i]["date"], data: [events[i]["headline"]]})
        }
        else {
            // Events added chronologically. If this date equals the last one added, add event to that date
            if (events[i]["date"] === eventsSection[eventsSection.length - 1]["title"]) {
                eventsSection[eventsSection.length - 1]["data"].push(events[i]["headline"])
            }
            // New date. Add it with an array containing the headline
            else {
                eventsSection.push({title: events[i]["date"], data: [events[i]["headline"]]})
            }
        }
    }
    return eventsSection;
}

const styles = StyleSheet.create({

    SectionHeaderStyle:{
        backgroundColor : '#00648d',
        fontSize : 20,
        padding: 5,
        color: '#fff',
    },

    SectionListItemStyle:{
        fontSize : 15,
        padding: 5,
        color: '#000',
        backgroundColor : '#F5F5F5'
    },

    ErrorMessageStyle:{
        fontFamily: 'helvetica',
        fontSize:20,
        color: '#000',
        textAlign: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingLeft: 20,
        paddingRight: 20

    }
});
