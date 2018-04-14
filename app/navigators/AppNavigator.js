import React from 'react';
import { connect } from 'react-redux';
import {TabNavigator, TabBarBottom, StackNavigator, addNavigationHelpers} from 'react-navigation';
import HeaderButtons from 'react-navigation-header-buttons'
import Ionicons from 'react-native-vector-icons/Ionicons';

import EventsListScreen from '../components/EventsListScreen';
import LocationSearchScreen from '../components/LocationSearchScreen';
import EventDetailsScreen from '../components/EventDetailsScreen'
import { addListener } from '../utils/redux';
import LocationEventsScreen from "../components/LocationEventsScreen";
import ArtistListScreen from "../components/ArtistListScreen";


/* Navigation stack for Event Details. Clicking on an event to get more info about it */
const EventsStack = StackNavigator(
  {
    EventsList: {screen: EventsListScreen},
    EventDetails: {screen: EventDetailsScreen},
  },
  {
    headerMode: 'none'
  }
);

/* Navigation stack for choosing location and seeing events there */
const LocationStack = StackNavigator(
  {
    LocationSearch: {screen: LocationSearchScreen},
    LocationEvents: {screen: LocationEventsScreen},
    EventDetails: {screen: EventDetailsScreen},
  },
  {
    headerMode: 'none'
  }
);

/* Navigation stack for choosing artists and seeing where they're playing */
const ArtistStack = StackNavigator(
  {
    ArtistList: {screen: ArtistListScreen},
  },
  {
    headerMode: 'none'
  }
);

/* The nice bottom tabs used to navigate between screens */
const BottomTabs = TabNavigator(
  {
    Events: {screen: EventsStack, navigationOptions: { tabBarLabel: 'Events' }},
    Artists: {screen: ArtistStack }, // not having tabBarLabel means that current location will be tab text
  },
  {
    navigationOptions: ({navigation}) => ({
      tabBarIcon: ({focused, tintColor}) => {
        const {routeName} = navigation.state;
        let iconName;
        if (routeName === 'Events') {
          iconName = `md-microphone`;
          //iconName = `ios-microphone${focused ? '' : '-outline'}`;
        } else if (routeName === 'Artists') {
          iconName = `md-people`;
          //iconName = `ios-people${focused ? '' : '-outline'}`;
        }

        return <Ionicons name={iconName} size={25} color={tintColor}/>;
      },
    }),
    tabBarOptions: {
      activeTintColor: 'tomato',
      inactiveTintColor: 'gray',
    },
    tabBarComponent: TabBarBottom,
    tabBarPosition: 'bottom',
    animationEnabled: true,
    swipeEnabled: false,
  }
);

/* Tab Navigation (BottomTabs) is embedded in this root stack navigator to get the static header on top.
* StackNavigator is a function that returns a React component*/
export const AppNavigator = StackNavigator(
  {
    Home : {screen: BottomTabs},
  },
  {
    initialRouteName: 'Home',
    /* Header config */
    navigationOptions: {
      headerStyle: {
        backgroundColor: '#4f9eea',
      },
      headerTintColor: '#fff',
      headerTitleStyle: {
        fontWeight: 'bold',
      },

      // Search icon on right
      headerRight: (
        <HeaderButtons IconComponent={Ionicons} iconSize={23} color="white">
          <HeaderButtons.Item title="add" iconName="ios-search" onPress={() => console.warn('add')}/>
        </HeaderButtons>
      ),
    },
  },
);

/*
* This is our full app integrated with a navigation prop. Navigation is sent to all components though props and Redux,
* so we don't have to explicitly pass it down to every component (in hindsight that might have been easier but fuck it
* this works
*/
class AppWithNavigationState extends React.Component {
  render() {
    const { dispatch, nav } = this.props;
    return (
      <AppNavigator
        navigation={addNavigationHelpers({
          dispatch,
          state: nav,
          addListener,
        })}
      />
    );
  }
}

const mapStateToProps = state => ({
  nav: state.nav,
});

export default connect(mapStateToProps)(AppWithNavigationState);