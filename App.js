/*
The main of our App. What's exported here is what is shown, and everything else is cascaded into that.
 */

import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import HomeScreen from './js/HomeScreen';
import SettingsScreen from './js/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarBottom, StackNavigator } from 'react-navigation';
import TitleBar from "./js/TitleBar";

class Home extends Component {
    /* Parameters passed into render is what is displayed */
    render() {
        return (
            <HomeScreen/>
        );
    }
}

class Settings extends Component {
    render() {
        return (
            <SettingsScreen/>
        );
    }
}

/* The nice bottom tabs used to navigate between screens */
const BottomTabs = TabNavigator(
    {
        Home: { screen: HomeScreen },
        Settings: { screen: SettingsScreen },
    },
    {
        navigationOptions: ({ navigation }) => ({
            tabBarIcon: ({ focused, tintColor }) => {
                const { routeName } = navigation.state;
                let iconName;
                if (routeName === 'Home') {
                    iconName = `md-microphone`;
                    //iconName = `ios-microphone${focused ? '' : '-outline'}`;
                } else if (routeName === 'Settings') {
                    iconName = `md-people`;
                    //iconName = `ios-people${focused ? '' : '-outline'}`;
                }

                return <Ionicons name={iconName} size={25} color={tintColor} />;
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

/* So some funky shit going on here. Basically, we need to embed Tab Navigation (BottomTabs) in a StackNavigator to
* get the static header on top. Also since this is the root of the App and is exported, this is the thing that gets
* rendered and shown on screen */
export default StackNavigator({
    MyTab: {
        screen: BottomTabs,
        navigationOptions: { title: 'Header title' }
    }
})