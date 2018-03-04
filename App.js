import React, { Component } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import HomeScreen from './js/HomeScreen';
import SettingsScreen from './js/SettingsScreen';
import { TabNavigator } from 'react-navigation';


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

export default TabNavigator({
    Home: { screen: HomeScreen },
    Settings: { screen: SettingsScreen },
});

