import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import HomeScreen from './js/HomeScreen';
import SettingsScreen from './js/SettingsScreen';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { TabNavigator, TabBarBottom } from 'react-navigation';

class Home extends Component {
    /* render() method is what displays the app */
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

export default TabNavigator(
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
                    iconName = `ios-microphone${focused ? '' : '-outline'}`;
                } else if (routeName === 'Settings') {
                    iconName = `ios-people${focused ? '' : '-outline'}`;
                }

                // You can return any component that you like here! We usually use an
                // icon component from react-native-vector-icons
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
