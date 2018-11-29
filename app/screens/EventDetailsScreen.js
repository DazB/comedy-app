import React, {Component} from 'react';
import {
  Image
} from 'react-native';

import { Container, Header, Content, Card, CardItem, Thumbnail, Text, Button, Icon, Left, Body } from 'native-base';


import {connect} from 'react-redux'

/**
 * EventDetailsScreen displays a single event that wsas selected in EventsListScreen.
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
      <Container>
        <Content>
          <Card style={{flex: 0}}>
            <CardItem>
              <Left>
                <Body>
                <Text>{event.headline}</Text>
                <Text note>{event.date}</Text>
                </Body>
              </Left>
            </CardItem>
            <CardItem>
              <Body>
              <Image source={{uri: event.imageUrl}} style={{height: 200, width: 200, flex: 1}}/>
              <Text>
                Bum bum bum bum
              </Text>
              </Body>
            </CardItem>
          </Card>
        </Content>
      </Container>
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
