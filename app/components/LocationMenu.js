import React, {Component} from 'react';
import {
  StyleSheet,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Modal,
  View,
  FlatList,
  Text,
} from 'react-native';

import Ionicons from 'react-native-vector-icons/Ionicons';
import {connect} from "react-redux";
import {fetchEventsIfNeeded} from "../actions";

class LocationMenu extends Component {
  constructor(props) {
    super(props);
    this.state = {listVisible: false};
    // This binding is necessary to make `this` work in the onPressButton callback
    this._onPressButton = this._onPressButton.bind(this);
  }

  // On button push, change state to show the menu
  _onPressButton() {
    this.setState(previousState => {
      return {listVisible: !previousState.listVisible};
    });
  }

  // Line that separates items in list
  _renderSeparator = () => {
    return (
      <View
        style={{
          height: 1,
          width: '100%',
          backgroundColor: "#CED0CE",
        }}
      />
    );
  };

  render() {
    // Only show the location list if user toggled button
    const ShowLocationList = () => {
      if (this.state.listVisible) {
        // Go through list of saved locations and display names in list
        let listData = [];

        // Pushes every saved location object {placeName: "...", geoLocation: "..."} into list data.
        this.props.locations.forEach((location) => {
          listData.push(location);
        });

        // So we have a Add/Remove Location button on the bottom of the list
        listData.push({placeName: 'Add/Remove Locations'});
        return (
            <Modal
              animationType="fade"
              transparent={true}
              visible={this.state.listVisible}
              onRequestClose={() => {
                this.setState({listVisible: false});
              }}>
              <TouchableWithoutFeedback onPress={() => this.setState({ listVisible: false })}>
                <View style={styles.modalStyle}>
                  <View style={styles.locationListStyle}>
                    <FlatList
                      data={listData}
                      renderItem={({item}) =>
                        <Text style={styles.listItem} onPress={() => {
                          // Add/Remove Locations sends user to LocationSearchScreen
                          if (item.placeName === 'Add/Remove Locations') {
                            this.setState({listVisible: false});
                            this.props.navigation.navigate('LocationSearch');
                          }
                          else {
                            this.setState({listVisible: false});
                            // Only dispatch if selected place name is different to the one currently showing
                            if (this.props.currentPlaceName !== item.placeName) {
                              this.props.dispatch({
                                type: 'SELECT_LOCATION',
                                placeName: item.placeName,
                                geoLocation: item.geoLocation
                              });
                              this.props.dispatch({type: 'INVALIDATE_EVENTS'});
                              this.props.dispatch(fetchEventsIfNeeded(item.geoLocation));
                            }
                          }
                        }
                        }>
                          {item.placeName}
                        </Text>
                      }
                      // Key is place name (should be unique, right?)
                      keyExtractor={item => item.placeName}
                      ItemSeparatorComponent={this._renderSeparator}
                    />
                  </View>
                </View>
              </TouchableWithoutFeedback>
            </Modal>
        );
      }
      return null;
    };

    return (
        <View style={styles.menuContainer}>
          <ShowLocationList/>
          <TouchableOpacity style={styles.buttonStyle} onPress={this._onPressButton}>
            <Ionicons name={"md-pin"} size={30} color="#01a699"/>
          </TouchableOpacity>
        </View>
    );
  }
}


// Take data from the app current state and insert/link it into the props
function mapStateToProps(state) {
  return {
    locations: state.locationReducer.locations,
    currentPlaceName: state.locationReducer.currentPlaceName,
  }
}

//Connect state to props (basically gets us the state)
export default connect(mapStateToProps)(LocationMenu);

const styles = StyleSheet.create({

  menuContainer: {
    flex: 1,
  },

  modalStyle: {
    flex: 1,
    backgroundColor:'rgba(0,0,0,0.5)',
  },

  buttonStyle: {
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    width: 70,
    height: 70,
    backgroundColor: '#fff',
    borderRadius: 100,
  },

  locationListStyle: {
    position: 'absolute',
    width: 140,
    right: 40,
    bottom: 110,
    backgroundColor: '#fff',
  },

  listItem: {
    padding: 10,
    fontSize: 16,
  },

});
