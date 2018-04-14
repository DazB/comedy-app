import React, {Component} from 'react';
import {
  ActivityIndicator,
  View,
  SectionList,
  ScrollView,
  Text,
  RefreshControl,
  StyleSheet
} from 'react-native';

import {connect} from 'react-redux'
import {fetchEventsIfNeeded} from '../actions/index'

/**
 * EventsList displays events grabbed from server in a SectionList.
 */
class EventsList extends Component {
  constructor(props) {
    super(props);
  }

  // invoked immediately after a component is mounted. Fetch events from specific location (if defined)
  componentDidMount() {
    this.props.dispatch(fetchEventsIfNeeded(this.props.location));
  }

  // Called when user pulls down on connection error message. Will cause little spinny refresh circle thing to appear
  _onRefresh() {
    this.props.dispatch(fetchEventsIfNeeded(this.props.location));
  }

  render() {
    console.log(this.props.location);
    // If fetch command still getting data, show loading shit (little spinny refresh circle)
    if (this.props.isFetching) {
      return (
        <View style={{paddingTop: 20}}>
          <ActivityIndicator/>
        </View>
      );
    }

    /* fetch has timed out
    Use ScrollView with refresh shit to show error message */
    if (!this.props.isFetching && this.props.error) {
      return (
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing= {false}
              onRefresh={this._onRefresh.bind(this)}
            />
          }
        >
          <Text style={styles.ErrorMessageStyle}>
            S'mofo butter layin' me to da' BONE! Jackin' me up... tight me {"\n\n\n"}
            Connection error {"\n"}
            Wait a mo and pull down to refresh
          </Text>
        </ScrollView>
      );
    }

    /* fetch has returned an empty events list */
    if (!this.props.isFetching && !this.props.error && this.props.eventsList.length === 0) {
      return (
          <ScrollView
            refreshControl={
              <RefreshControl
                refreshing= {false}
                onRefresh={this._onRefresh.bind(this)}
              />
            }
          >
            <Text style={styles.ErrorMessageStyle}>
              Nuffin 'ere m8 {"\n\n\n"}
              No gigs to list {"\n"}
              You can pull down to refresh (if you want I dunno I'm not your mum)
            </Text>
          </ScrollView>
          );
    }

    /* We have no error from the fetch, and we have data :D
    The list of events has already been parsed and formatted in the actions */
    return (
      <SectionList
        sections={this.props.eventsList}
        renderSectionHeader={({section}) => {
          return (<SectionListHeader section={section}/>)
        }}
        renderItem={({item, index}) => {
          return (<SectionListItem item={item} index={index} navigation={this.props.navigation}/>)
        }}
        keyExtractor={(item, index) => index}
      />
    );
  }
}

/* The title on the list, in this case the date */
class SectionListHeader extends Component {
  render() {
    return (
      <Text style={styles.SectionHeaderStyle}>
        {this.props.section.title}
      </Text>
    );
  }
}

/* The data in the list, in this case all the events on a certain date */
class SectionListItem extends Component {
  render() {
    return (
      <View>
        <Text style={styles.SectionListItemStyle}
              onPress={() => this.props.navigation.dispatch({
                type: 'EventDetails', id: this.props.item.id})
              }>
          {this.props.item.headline}
        </Text>
      </View>
    );
  }
}

/*
  The function takes data from the app current state,
  and insert/links it into the props of our component.
  This function makes Redux know that this component needs to be passed a piece of the state
 */
function mapStateToProps(state) {
  return {
    eventsList: state.eventsReducer.eventsList,
    isFetching: state.eventsReducer.isFetching,
    lastUpdated: state.eventsReducer.lastUpdated,
    error: state.eventsReducer.error
  }
}

//Connect everything
export default connect(mapStateToProps)(EventsList);

const styles = StyleSheet.create({

  SectionHeaderStyle: {
    backgroundColor: '#00648d',
    fontSize: 20,
    padding: 5,
    color: '#fff',
  },

  SectionListItemStyle: {
    fontSize: 15,
    padding: 5,
    color: '#000',
    backgroundColor: '#F5F5F5'
  },

  ErrorMessageStyle: {
    fontFamily: 'helvetica',
    fontSize: 20,
    color: '#000',
    textAlign: 'center',
    justifyContent: 'center',
    paddingTop: 10,
    paddingLeft: 20,
    paddingRight: 20
  },
});
