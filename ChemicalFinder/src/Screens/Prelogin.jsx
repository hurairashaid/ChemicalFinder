import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import Logo from '../assets/preloginLogo.png';

const Prelogin = ({navigation}) => {
  function switchScreen(location) {
    navigation.navigate(location);
  }
  return (
    <>
      <View style={{height: '100%', backgroundColor: 'black'}}>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            height: '90%',
          }}>
          <Image source={Logo} style={{width: '55%', height: '40%'}}></Image>
          <Text
            style={{
              color: '#FFA500',
              fontSize: 30,
              fontWeight: 800,
              fontFamily: 'sans-serif',
            }}>
            Chemical Finder
          </Text>
        </View>
        <TouchableOpacity
          style={{
            width: '90%',
            justifyContent: 'center',
            alignItems: 'centers',
            marginHorizontal: 'auto',
          }}>
          <Text
            style={{
              color: 'white',
              backgroundColor: '#FFA500',
              textAlign: 'center',
              padding: 15,
            }}
            onPress={() => {
              switchScreen('login');
            }}>
            LETS START
          </Text>
        </TouchableOpacity>
      </View>
    </>
  );
};

export default Prelogin;

const styles = StyleSheet.create({});
