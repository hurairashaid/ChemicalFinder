import {StyleSheet, Text, View, TouchableOpacity} from 'react-native';
import React from 'react';
import Icon from 'react-native-vector-icons/FontAwesome5';
import AntIcons from 'react-native-vector-icons/AntDesign';
import {useIsFocused} from '@react-navigation/native';

const BottomBar = ({navigation, callFunction, onContactRedirect}) => {
  const switchScreen = location => {
    navigation.navigate(location);
  };
  const {routes, index} = navigation.getState();
  const currentRoute = routes[index].name;

  function handleClick() {
    console.log(currentRoute);
    if (currentRoute == 'Contact') {
      callFunction(true);
    } else {
      onContactRedirect(true); // Call the function passed from the Main component
    }
  }

  return (
    <View
      style={{
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#ffffff',
        paddingVertical: 10,
        borderTopWidth: 1,
        paddingHorizontal: 20,
        borderTopColor: '#d9d9d9',
      }}>
      <TouchableOpacity onPress={() => switchScreen('Scan')}>
        <Icon style={[styles.BottomIcon]} name="home"></Icon>
        <Text style={[styles.BottomText]}>Home</Text>
      </TouchableOpacity>
      <TouchableOpacity onPress={() => switchScreen('Contact')}>
        <AntIcons style={[styles.BottomIcon]} name="contacts"></AntIcons>
        <Text style={[styles.BottomText]}>History</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          switchScreen('Support');
        }}>
        <AntIcons style={[styles.BottomIcon]} name="questioncircleo"></AntIcons>
        <Text style={[styles.BottomText]}>Support</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          switchScreen('Profile');
        }}>
        <AntIcons style={[styles.BottomIcon]} name="user"></AntIcons>
        <Text style={[styles.BottomText]}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default BottomBar;

const styles = StyleSheet.create({
  BottomIcon: {
    fontSize: 25,
    marginHorizontal: 'auto',
    color: 'black',
  },
  BottomText: {
    fontSize: 10,
  },
});
