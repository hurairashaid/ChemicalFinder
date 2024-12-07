import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import {BASE_URL} from '../API/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AlertBox from '../components/AlertBox';

import axios from 'axios';
import Loading from '../components/Loading';
const SignUp = ({navigation}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const toggleShowAlert = alertstate => {
    setShowAlert(alertstate);
  };
  function switchScreen(location) {
    navigation.navigate(location);
  }

  const signUp = async data => {
    setLoading(true);
    console.log(data);
    console.log(BASE_URL);

    try {
      const dataResponse = await axios.post(`${BASE_URL}/signUp`, {
        name: data.name,
        email: data.email,
        password: data.password,
      });
      console.log(dataResponse);
      if (dataResponse.data !== null) {
        await AsyncStorage.setItem('token', dataResponse.data.token);
        switchScreen('MakingReady');
      } else {
        console.log('a');
        setLoading(false);
      }
    } catch (error) {
      setError(error.response.data.msg); // Set error to true if an exception occurs
      setShowAlert(true);
      setLoading(false);
    }
  };
  return (
    <ScrollView style={{marginHorizontal: 20}}>
      <Text
        style={{
          textAlign: 'center',
          fontWeight: 600,
          marginTop: 10,
          color: 'black',
        }}>
        Sign up
      </Text>
      <Text
        style={{
          width: '70%',
          fontSize: 36,
          marginTop: 80,
          fontWeight: 600,
          color: 'black',
        }}>
        Create an account
      </Text>
      <Formik
        initialValues={{
          name: '',
          email: '',
          password: '',
        }}
        onSubmit={values => {
          setError(''); // Reset error before submitting
          signUp(values);
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View
            style={{marginHorizontal: 'auto', width: '100%', marginTop: 15}}>
            <View>
              <TextInput
                onChangeText={handleChange('name')}
                onBlur={handleBlur('name')}
                value={values.name}
                placeholder="Name *"
                type="text"
                style={{borderBottomWidth: 1}}
              />
            </View>
            <View>
              <TextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="Email *"
                type="email"
                style={{borderBottomWidth: 1}}
              />
            </View>

            <View>
              <TextInput
                style={{marginTop: 0, borderBottomWidth: 1}} // Apply shared styles
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="Password *"
                secureTextEntry
              />
            </View>
            <View>
              <TextInput
                style={{marginTop: 0, marginBottom: 25, borderBottomWidth: 1}} // Apply shared styles
                onChangeText={handleChange('repassword')}
                onBlur={handleBlur('repassword')}
                value={values.repassword}
                placeholder="Repeat Password *"
                secureTextEntry
              />
            </View>
            <Text style={{marginBottom: 25}}>
              By Signing up on this app , you're also agreeing to our Terms of
              Service and Privacy Policy
            </Text>

            <Button
              style={{backgroundColor: '#6F70FF', padding: 80}}
              onPress={handleSubmit}
              title="Sign up"
            />
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Text>Already have an account? </Text>
              <TouchableOpacity
                style={{padding: 'none', margin: 'none'}}
                onPress={() => {
                  switchScreen('login');
                }}>
                <Text style={{fontWeight: '600', color: '#6F70FF'}}>
                  Sign in
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Formik>
      <Modal
        transparent={true}
        visible={showAlert}
        animationType="fade"
        onRequestClose={() => setIsPopupVisible(false)}>
        <View style={styles.overlay}>
          <AlertBox
            title="OOPS! SIGN UP FAILED"
            description={error}
            callFunction={toggleShowAlert}
            style={styles.popup}
          />
        </View>
      </Modal>
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay
  },
  popup: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
  },
});
