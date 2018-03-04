import React, { Component } from 'react';
import { View, StyleSheet } from 'react-native';
import TitleBar from './TitleBar';
import EventData from './EventData';

/* Home page. This is where the magic happens */
export default class HomeScreen extends Component {
    /* render() method is what displays the app */
    render() {
        return (
            <View style={styles.mainContainer}>
                <TitleBar />
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