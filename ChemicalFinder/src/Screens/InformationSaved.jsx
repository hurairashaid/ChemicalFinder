import {StyleSheet, Text, View, Image, TouchableOpacity} from 'react-native';
import React from 'react';
import check from '../assets/check.png';

const InformationSaved = ({navigation}) => {
  function switchScreen(location) {
    navigation.navigate(location);
  }
  return (
    <View
      style={{
        height: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 150,
      }}>
      <View
        style={{
          backgroundColor: '#686f89',
          borderRadius: 500,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <Image
          source={check}
          style={{width: 100, height: 100, margin: 30}}></Image>
      </View>
      <View style={{marginTop: 20, marginBottom: 70}}>
        <Text style={styles.textHeader}>Information Saved Successfully</Text>
        <Text style={styles.textDescriptiion}>
          You can start using the application now.
        </Text>
      </View>
      <View style={{borderRadius: 20}}>
        <TouchableOpacity
          style={{borderRadius: 5, backgroundColor: '#686f89'}}
          onPress={() => {
            navigation.navigate('Scan');
          }}>
          <Text
            style={{
              fontSize: 15,
              color: 'white',
              paddingHorizontal: 40,
              paddingVertical: 15,
              fontWeight: 'light',
              letterSpacing: 2,
            }}>
            SCAN NOW
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InformationSaved;

const styles = StyleSheet.create({
  textHeader: {
    fontSize: 20,
    textAlign: 'center',
    color: 'Black',
  },
  textDescriptiion: {
    textAlign: 'center',
    marginHorizontal: 60,
    fontSize: 16,
    color: 'grey',
  },
});
