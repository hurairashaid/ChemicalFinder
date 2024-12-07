import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  Modal,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {Formik} from 'formik';
import Facebook from '../assets/facebook.png';
import Google from '../assets/google.png';
import AlertBox from '../components/AlertBox';
import axios from 'axios';
import {BASE_URL} from '../API/API';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  GoogleSignin,
  statusCodes,
} from '@react-native-google-signin/google-signin';
import Loading from '../components/Loading';
GoogleSignin.configure({
  offlineAccess: true,

  webClientId:
    '662664462722-n1tf80ft0tbe9iet6td91o4h659v6sfe.apps.googleusercontent.com',
});

const GoogleLogin = async () => {
  await GoogleSignin.hasPlayServices();
  const userInfo = await GoogleSignin.signIn();
  return userInfo;
};

const Login = ({navigation}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const toggleShowAlert = alertstate => {
    setShowAlert(alertstate);
  };
  function switchScreen(location) {
    navigation.navigate(location);
  }

  // Somewhere in your code
  const handleGoogleLogin = async () => {
    console.log('Starting Google login process...');
    try {
      const response = await GoogleLogin();
      console.log('Google Login response:', response);

      const {idToken, user} = response;
      console.log('User info:', user);
      console.log('ID Token:', idToken);

      // Uncomment and replace with your logic for further processing
      // if (idToken) {
      //   console.log('Validating token...');
      //   const resp = await authAPI.validateToken({
      //     token: idToken,
      //     email: user.email,
      //   });
      //   console.log('Token validated, server response:', resp);
      //   await handlePostLoginData(resp.data);
      // }
    } catch (apiError) {
      console.error('Error during Google Login:', apiError);

      // Detailed error logging
      if (apiError.response) {
        console.error('API error response:', apiError.response);
        console.error('API error data:', apiError.response.data);
        console.error('API error status:', apiError.response.status);
        setError(apiError.response.data.error?.message || 'API error occurred');
      } else if (apiError.request) {
        console.error('No response received from API:', apiError.request);
        setError('No response received. Please check your network.');
      } else {
        console.error('Error setting up request:', apiError.message);
        setError(apiError.message || 'Something went wrong during login.');
      }
    } finally {
      console.log('Google login process completed.');
    }
  };

  const signin = async data => {
    console.log(data);
    console.log(BASE_URL);
    setLoading(true)

    try {
      const dataResponse = await axios.post(`${BASE_URL}/login`, {
        email: data.email,
        password: data.password,
      });
      console.log(dataResponse);
      if (dataResponse.data !== null) {
        await AsyncStorage.setItem('token', dataResponse.data.token);
        switchScreen('MakingReady');
        setLoading(false)
      } else {
        console.log('a');
        setLoading(false)
      }
    } catch (error) {
      setError(error.response.data.msg); // Set error to true if an exception occurs
      setShowAlert(true);
      setLoading(false)
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
        Sign in
      </Text>
      <Text
        style={{
          width: '70%',
          fontSize: 36,
          marginTop: 80,
          fontWeight: 600,
          color: 'black',
        }}>
        Sign in to your account
      </Text>
      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={values => {
          setError(false); // Reset error before submitting
          signin(values);
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View
            style={{marginHorizontal: 'auto', width: '100%', marginTop: 15}}>
            <View>
              <TextInput
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder="Email*"
                type="email"
                style={{borderBottomWidth: 1}}
              />
            </View>
            <View>
              <TextInput
                style={{marginTop: 0, marginBottom: 35, borderBottomWidth: 1}} // Apply shared styles
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="Password*"
                secureTextEntry
              />
            </View>
            <Button
              style={{backgroundColor: '#6F70FF', padding: 80}}
              onPress={handleSubmit}
              title="Sign In"
            />
            <View style={{flexDirection: 'row', marginTop: 15}}>
              <Text>Don't have an account yet? </Text>
              <TouchableOpacity
                style={{padding: 'none', margin: 'none'}}
                onPress={() => {
                  switchScreen('Signup');
                }}>
                <Text style={{fontWeight: '600', color: '#6F70FF'}}>
                  Sign up
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={{
                margin: 'none',
                backgroundColor: '#687089',
                borderRadius: 50,
                marginTop: 50,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}
              onPress={handleGoogleLogin}>
              <Image source={Google} style={{width: 20, height: 20}}></Image>
              <Text
                style={{
                  fontWeight: '600',
                  color: 'white',
                  margin: 13,
                  textAlign: 'center',
                }}>
                Sign up with Google
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{
                margin: 'none',
                backgroundColor: '#687089',
                borderRadius: 50,
                marginTop: 15,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Image source={Facebook} style={{width: 25, height: 25}}></Image>
              <Text
                style={{
                  fontWeight: '600',
                  color: 'white',
                  margin: 13,
                  textAlign: 'center',
                }}>
                Sign up with Facebook
              </Text>
            </TouchableOpacity>
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
            title="OOPS! SIGN IN FAILED"
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

const styles = StyleSheet.create({
  shahdowBox: {
    borderRadius: 6,
    paddingLeft: 10,
    borderColor: 'grey',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 1,
    shadowRadius: 5,
    elevation: 4,
  },
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

export default Login;
