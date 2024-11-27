import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
} from 'react-native';
import React from 'react';
import {Formik} from 'formik';

const Questions = ({navigation}) => {
  function switchScreen(location) {
    navigation.navigate(location);
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerText}>Fill The Health Form</Text>
      <Text style={styles.subheaderText}>
        Fill this form soo that we can judge the item as per your health
      </Text>

      <Formik
        initialValues={{
          email: '',
          password: '',
        }}
        onSubmit={values => {
          // Handle form submission (e.g., call CreateAccount)
          navigation.navigate('InformationSaved');

          console.log(values);
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Do you have any food allergies? if yes please specify.
                </Text>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={handleChange('email')}
                  onBlur={handleBlur('email')}
                  value={values.email}
                  keyboardType="email-address"
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Do you have any food allergies? if yes please specify.
                </Text>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Do you have any food allergies? if yes please specify.
                </Text>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Do you have any food allergies? if yes please specify.
                </Text>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Do you have any food allergies? if yes please specify.
                </Text>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Do you have any food allergies? if yes please specify.
                </Text>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Do you have any food allergies? if yes please specify.
                </Text>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Do you have any food allergies? if yes please specify.
                </Text>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Do you have any food allergies? if yes please specify.
                </Text>
              </View>
              <View style={styles.textInputContainer}>
                <TextInput
                  onChangeText={handleChange('password')}
                  onBlur={handleBlur('password')}
                  value={values.password}
                  secureTextEntry
                  style={styles.input}
                />
              </View>
            </View>
            <Button
              style={styles.submitButton}
              color="#6F70FF"
              onPress={handleSubmit}
              title="Submit Health Information"
            />
          </View>
        )}
      </Formik>
    </ScrollView>
  );
};

export default Questions;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#edf1f5', // Background color of the screen
    paddingBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'light',
    marginBottom: 3,
    marginTop: 20,
    textAlign: 'center',
    color: '#000000',
  },
  subheaderText: {
    color: '#000000',
  },
  textQuestion: {
    color: '#000000',
    textAlign: 'center',
  },
  formContainer: {
    marginTop: 15,
  },
  inputContainer: {
    marginBottom: 20,
  },
  textheaderContainer: {
    backgroundColor: 'white',
    paddingVertical: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  textInputContainer: {
    borderRadius: 5, // Use borderRadius instead of borderCurve
    backgroundColor: '#c6c6c6',
  },
  input: {
    padding: 10,
    fontSize: 16,
    borderRadius: 2,
    paddingVertical: 30,
  },
});
