import React from 'react';
import {TabNavigator, TabBarBottom, StackNavigator} from 'react-navigation';
import HeaderButtons from 'react-navigation-header-buttons'
import Ionicons from 'react-native-vector-icons/Ionicons';

import TabBarComponent from '../components/TabBarComponent.js'
import EventsListScreen from '../screens/EventsListScreen';
import LocationSearchScreen from '../screens/LocationSearchScreen';
import EventDetailsScreen from '../screens/EventDetailsScreen'
import LocationEventsScreen from "../screens/LocationEventsScreen";
import ArtistListScreen from "../screens/ArtistListScreen";


/* Navigation stack for Event Details. Clicking on an event to get more info about it */
const EventsStack = StackNavigator(
  {
    EventsList: {screen: EventsListScreen},
    EventDetails: {screen: EventDetailsScreen},
    LocationSearch: {screen: LocationSearchScreen},
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
    tabBarComponent: TabBarComponent,
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
