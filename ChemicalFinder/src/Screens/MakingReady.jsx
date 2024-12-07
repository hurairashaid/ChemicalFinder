import {Image, ScrollView, StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import makingReady from '../assets/makingReady.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../API/API';

import axios from 'axios';
const MakingReady = ({navigation}) => {
  function switchScreen(location) {
    navigation.navigate(location);
  }
  const [token, settoken] = useState();
  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        settoken(storedToken);
      } catch (error) {
        console.error('Failed to retrieve token:', error);
      }
    };

    fetchToken();
  }, []);
  const fetchData = async () => {
    if (!token) return;
    console.log(token);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/viewProfile`, // URL
        {}, // Body (empty object for this request)
        {
          // Configuration object for headers
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      console.log('this is response ', response.data.user.questionAnswered);

      if (response.data.user.questionAnswered) {
        switchScreen('Scan');
      } else {
        navigation.navigate('Questions', {token: token});
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };
  useEffect(() => {
    fetchData();
  }, [token]);

  return (
    <ScrollView>
      <View
        style={{
          justifyContent: 'center',
          alignItems: 'center',
          marginTop: 100,
        }}>
        <Image source={makingReady} style={{width: 200, height: 200}}></Image>
        <View
          style={{
            justifyContent: 'center',
            alignItems: 'center',
            paddingHorizontal: 20,
          }}>
          <Text style={{fontSize: 20, marginBottom: 10, color: '#687089'}}>
            Successfully Signed In
          </Text>
          <Text style={{textAlign: 'center', fontSize: 14}}>
            We are making sure you will be redirected to the right screen.Please
            wait while we are making thing right for you
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default MakingReady;

const styles = StyleSheet.create({});
