import {StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
import React from 'react';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
const AlertBox = ({callFunction, title, description}) => {
  function handleClick() {
    console.log('me this time');
    callFunction(false);
  }

  console.log(title);
  console.log(description);

  return (
    <View
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      }}>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: 'white',
          position: 'absolute',
          top: '40%',
          marginHorizontal: 10,
          padding: 20,
          flex: 1,
          backgroundColor: '#F2F2F2',
          borderRadius: 10,
          width: '90%',
          backgroundColor: 'white',
          borderRadius: 10,
        }}>
        <FontAwesome
          style={{color: '#687089'}}
          name="exclamation-triangle"
          size={40}></FontAwesome>
        <Entypo
          onPress={() => {
            handleClick();
          }}
          style={{position: 'relation', left: 140, fontSize: 30, bottom: 50}}
          name="cross"></Entypo>
        <Text
          style={{
            fontFamily: 'Poppins-Bold',
            fontSize: 16,
            color: 'black',
            marginBottom: 10,
            marginTop: -25,
          }}>
          {title}
        </Text>
        <Text
          style={{
            textAlign: 'center',
            fontFamily: 'Poppins-light',
            fontSize: 13,
            textAlign: 'left',
          }}>
          {description}
        </Text>
        <TouchableOpacity
          style={{
            backgroundColor: '#687089',
            width: '100%',
            paddingVertical: 10,
            borderRadius: 10,
            marginTop: 10,
          }}
          onPress={() => {
            handleClick();
          }}>
          <Text
            style={{
              textAlign: 'center',
              fontFamily: 'Poppins-light',
              color: 'white',
              fontSize: 14,
            }}>
            Okay
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AlertBox;

const styles = StyleSheet.create({});
