import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
  Image,
} from 'react-native';
import React from 'react';
import {Formik} from 'formik';
import Facebook from '../assets/facebook.png';
import Google from '../assets/google.png';

const Login = ({navigation}) => {
  function switchScreen(location) {
    navigation.navigate(location);
  }
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
          navigation.navigate('Scan');
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
              }}>
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
});

export default Login;
