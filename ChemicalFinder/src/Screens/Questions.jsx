import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Button,
  ScrollView,
  Modal,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Field, Formik} from 'formik';
import {Picker} from '@react-native-picker/picker';
import axios from 'axios';
import {BASE_URL} from '../API/API';
import Loading from '../components/Loading';



const Questions = ({navigation, route}) => {
  const [suger, setsuger] = useState(true);
  const [bloodPressure, setbloodPressure] = useState(true);
  const [overWeight, setOverWeight] = useState(true);
  const [lactose, setlactose] = useState(true);
  const [loading, setLoading] = useState(false);

  function switchScreen(location) {
    navigation.navigate(location);
  }

  const SavedQuestion = async () => {
    setLoading(true);
    const token = route.params.token;

    if (!token) return;
    console.log(token);

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/handleAddQuestion`, // URL
        {
          sugar: suger,
          bloodPressure: bloodPressure,
          overWeight: overWeight,
          lactoseIntolerant: lactose,
        }, // Body (empty object for this request)
        {
          // Configuration object for headers
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (response.status == 200) {
        switchScreen('InformationSaved');
        setLoading(false);
      } else {
        console.log(response);
        setLoading(false);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
      setLoading(false);
    }
  };
  useEffect(() => {
    // Listener for preventing back navigation on this screen
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      // Prevent the back navigation (either swipe or hardware button press)
      e.preventDefault();
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation]);
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
          SavedQuestion();
        }}>
        {({handleChange, handleBlur, handleSubmit, values}) => (
          <View style={styles.formContainer}>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>Do you have Diabetes?</Text>
              </View>
              <Field name="booleanValue">
                {({field}) => (
                  <Picker
                    selectedValue={suger}
                    onValueChange={itemValue => setsuger(itemValue)}
                    style={styles.picker}>
                    <Picker.Item
                      style={{fontSize: 14}}
                      label="True"
                      value="true"
                    />
                    <Picker.Item
                      style={{fontSize: 14}}
                      label="False"
                      value="false"
                    />
                  </Picker>
                )}
              </Field>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Do you have high Blood Pressure?
                </Text>
              </View>
              <Field style={styles.picker} name="booleanValue">
                {({field}) => (
                  <Picker
                    selectedValue={bloodPressure}
                    onValueChange={itemValue => setbloodPressure(itemValue)}
                    style={styles.picker}>
                    <Picker.Item
                      style={{fontSize: 14}}
                      label="True"
                      value="true"
                    />
                    <Picker.Item
                      style={{fontSize: 14}}
                      label="False"
                      value="false"
                    />
                  </Picker>
                )}
              </Field>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Do you consider yourself Over Weight?
                </Text>
              </View>
              <Field style={styles.picker} name="booleanValue">
                {({field}) => (
                  <Picker
                    selectedValue={overWeight}
                    onValueChange={itemValue => setOverWeight(itemValue)}
                    style={styles.picker}>
                    <Picker.Item
                      style={{fontSize: 14}}
                      label="True"
                      value="true"
                    />
                    <Picker.Item
                      style={{fontSize: 14}}
                      label="False"
                      value="false"
                    />
                  </Picker>
                )}
              </Field>
            </View>
            <View style={styles.inputContainer}>
              <View style={styles.textheaderContainer}>
                <Text style={styles.textQuestion}>
                  Are you Lactose Intolerant?
                </Text>
              </View>
              <Field style={styles.picker} name="booleanValue">
                {({field}) => (
                  <Picker
                    selectedValue={lactose}
                    onValueChange={itemValue => setlactose(itemValue)}
                    style={styles.picker}>
                    <Picker.Item
                      style={{fontSize: 14}}
                      label="True"
                      value="true"
                    />
                    <Picker.Item
                      style={{fontSize: 14}}
                      label="False"
                      value="false"
                    />
                  </Picker>
                )}
              </Field>
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
      <Modal transparent={true} visible={loading} animationType="fade">
        <View style={styles.overlay}>
          <Loading />
        </View>
      </Modal>
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
  picker: {
    backgroundColor: 'white',
    borderRadius: 10,
    fontSize: 10,
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
