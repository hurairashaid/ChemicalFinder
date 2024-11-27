import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  Button,
  TouchableOpacity,
} from 'react-native';
import React from 'react';
import {Formik} from 'formik';

const SignUp = ({navigation}) => {
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
          email: '',
          password: '',
          repassword: '',
        }}
        onSubmit={values => {
          navigation.navigate('Questions');
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
                style={{marginTop: 0, borderBottomWidth: 1}} // Apply shared styles
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                placeholder="Password*"
                secureTextEntry
              />
            </View>
            <View>
              <TextInput
                style={{marginTop: 0, marginBottom: 25, borderBottomWidth: 1}} // Apply shared styles
                onChangeText={handleChange('repassword')}
                onBlur={handleBlur('repassword')}
                value={values.repassword}
                placeholder="Repeat Password*"
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
    </ScrollView>
  );
};

export default SignUp;

const styles = StyleSheet.create({});
