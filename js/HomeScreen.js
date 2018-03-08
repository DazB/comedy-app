import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import EventData from './EventData';

export default class HomeScreen extends Component {
    /* Title shown on header bar */
    static navigationOptions = {
        title: 'Heckler',
    };

    render() {
        return (
            <View style={styles.mainContainer}>
                <View style={styles.content}>
                    <EventData />
                </View>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    mainContainer:{
        flex:1
    },
    content:{
        backgroundColor:'#ebeef0',
        flex:1
    }
});