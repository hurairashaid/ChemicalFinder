import {
  ScrollView,
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  TextInput,
  Modal,
} from 'react-native';
import React, {useState, useEffect, useCallback} from 'react';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AntIcons from 'react-native-vector-icons/EvilIcons';
import defaultPic from '../assets/default.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {BASE_URL} from '../API/API';

// import Loading from '../components/Loading';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import AlertBox from '../components/AlertBox';
import axios from 'axios';
import BottomBar from '../components/BottomBar';
import Loading from '../components/Loading';
const Profile = ({navigation}) => {
  const [showAlert, setShowAlert] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescriptiion] = useState('');
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(null);
  const [data, setData] = useState([]);
  const [forcedReload, setForceReload] = useState(false);
  const [oldPassword, setOldPassword] = useState();
  const [newPassword, setNewPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const toggleShowAlert = stateChange => {
    setShowAlert(stateChange);
  };

  useEffect(() => {
    const fetchToken = async () => {
      try {
        const storedToken = await AsyncStorage.getItem('token');
        setToken(storedToken);
      } catch (error) {
        console.error('Failed to retrieve token:', error);
      }
    };

    fetchToken();
  }, []);

  const fetchProfileData = useCallback(async () => {
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

      console.log('this is response ', response.data.user.name);

      if (response.status == 200) {
        date = response.data;
        setData(date);
        setLoading(false);
      } else {
        console.error('Failed to fetch profile data:', response.status);
      }
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  }, [token]);

  // const changeImage = async () => {
  //   try {
  //     const result = await launchImageLibrary({
  //       mediaType: 'photo', // To restrict to images only
  //       selectionLimit: 1, // Only one image can be selected
  //     });
  //     setLoading(true);

  //     if (result.didCancel) {
  //       console.log('User cancelled image picker');
  //       setLoading(false);
  //     } else if (result.errorCode) {
  //       console.log('ImagePicker Error: ', result.errorMessage);
  //       setLoading(false);
  //     } else {
  //       const imageUri = result.assets[0].uri;
  //       const imageType = result.assets[0].type;
  //       const imageName = result.assets[0].fileName;

  //       console.log('Selected image URI:', imageUri);

  //       // Prepare FormData to send image
  //       const formData = new FormData();
  //       formData.append('profilePic', {
  //         uri: imageUri,
  //         name: imageName, // You can customize the file name
  //         type: imageType, // Adjust based on image type (e.g., 'image/png' for PNG images)
  //       });
  //       // Send image to backend using fetch API
  //       const response = await fetch(`${BASE_URL}/api/v1/editProfile`, {
  //         method: 'POST',
  //         body: formData,
  //         headers: {
  //           'Content-Type': 'multipart/form-data',
  //           Authorization: `Bearer ${token}`,
  //         },
  //       });

  //       const responseData = await response.json();
  //       console.log('Response from server:', responseData);
  //       ForceReloadFunction(); // Trigger re-fetch after image change
  //     }
  //   } catch (error) {
  //     console.error('Error opening image picker:', error);
  //     setLoading(false);
  //   }
  // };

  const changePassword = async () => {
    setLoading(true);
    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/changePassword`,
        {
          oldPassword: oldPassword, // Adjust the key according to your API
          newPassword: newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the JWT in the headers
          },
        },
      );

      console.log(response.data.message);
      setTitle('Successfully Completed The Action.');
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setDescriptiion(response.data.message);

      setLoading(false);
      setShowAlert(true);
    } catch (error) {
      console.log(error.response.data.message);
      console.log(error.response.data);
      setTitle('There is an error while performing the action.');
      setDescriptiion(error.response.data.message);
      setLoading(false);

      setShowAlert(true);
    }
  };
  useEffect(() => {
    fetchProfileData();
  }, [token, forcedReload]);

  const logout = async () => {
    try {
      // Remove token from AsyncStorage
      await AsyncStorage.removeItem('token');
      setToken(null); // Set token state to null
      // Navigate to the Login screen
      navigation.replace('login'); // Replace the current screen with the login screen
    } catch (error) {
      console.error('Logout error: ', error);
    }
  };

  const profileImage = defaultPic;
  console.log('this is profile image', profileImage);
  return (
    <>
      <ScrollView style={{paddingHorizontal: 10, marginTop: 10}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <View>
              <Ionicons
                size={20}
                name="arrow-back"
                style={{color: '#687089'}}></Ionicons>
            </View>
          </View>
          <TouchableOpacity
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: 'white',
              padding: 5,
              borderRadius: 20,
            }}>
            <Ionicons
              size={30}
              name="power"
              style={{color: '#687089'}}
              onPress={logout} // Call logout function when power icon is pressed
            ></Ionicons>
          </TouchableOpacity>
        </View>
        <View>
          <Image
            source={profileImage}
            style={{
              width: 100,
              height: 100,
              borderRadius: 100,
              marginHorizontal: 'auto',
            }}></Image>

          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              marginHorizontal: 'auto',
              marginTop: 10,
              color: 'black',
            }}>
            {data?.user?.name ? data.user.name : 'Default Name'}
          </Text>
          <Text
            style={{
              fontFamily: 'Poppins-Medium',
              fontSize: 15,
              marginHorizontal: 'auto',
              color: '#6D6D6D',
            }}>
            {data?.user?.email ? data.user.email : 'Default Email'}
          </Text>
        </View>
        {/* <Text
          style={{
            fontSize: 14,
            fontFamily: 'Poppins',
            color: '#222222',
            marginBottom: 5,
            marginTop: 30,
          }}>
          Birthdate{' '}
        </Text>
        <TouchableOpacity
          style={{
            flexDirection: 'row',

            padding: 10,
            backgroundColor: 'white',
            borderRadius: 10,
            borderWidth: 1,
            borderColor: '#e3e3d7',
          }}
          onPress={() => setOpen(true)}>
          <AntIcons
            style={styles.icon}
            color={'#e3e3d7'}
            name="calendar"
            size={20}
          />
          <Text style={{fontSize: 14, marginLeft: 5}}>August 27, 1990</Text>
        </TouchableOpacity>
        <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>Email</Text>
          <TextInput
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F2F2F2',
              marginTop: 5,
            }}
            placeholder="example@gmail.com"></TextInput>
        </View>

        <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>
            Phone Number
          </Text>
          <TextInput
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F2F2F2',
              marginTop: 5,
            }}
            placeholder="+1 (222) 555-4543"></TextInput>
        </View> */}
        <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>
            Old Password
          </Text>
          <TextInput
            value={oldPassword} // Set the value of TextInput to the state variable
            onChangeText={newText => setOldPassword(newText)} // Update the state when text changes
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F2F2F2',
              marginTop: 5,
            }}></TextInput>
        </View>
        <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>
            New Password
          </Text>
          <TextInput
            value={newPassword} // Set the value of TextInput to the state variable
            onChangeText={newText => setNewPassword(newText)} // Update the state when text changes
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F2F2F2',
              marginTop: 5,
            }}></TextInput>
        </View>
        <View style={{flexDirection: 'column', width: '100%', marginTop: 20}}>
          <Text style={{fontFamily: 'Poppins', color: 'black'}}>
            Confirm Password
          </Text>
          <TextInput
            value={confirmPassword} // Set the value of TextInput to the state variable
            onChangeText={newText => setConfirmPassword(newText)} // Update the state when text changes
            style={{
              padding: 5,
              backgroundColor: 'white',
              borderRadius: 10,
              borderWidth: 1,
              borderColor: '#F2F2F2',
              marginTop: 5,
            }}></TextInput>
        </View>
        <TouchableOpacity
          onPress={() => {
            changePassword();
          }}
          style={{
            flexDirection: 'column',
            width: '100%',
            marginTop: 20,
            marginHorizontal: 'auto',
          }}>
          <Text
            style={{
              marginHorizontal: 'auto',
              backgroundColor: '#687089',
              padding: 10,
              color: 'white',
              borderRadius: 5,
              width: '100%',
              textAlign: 'center',
              fontSize: 15,
              marginBottom: 10,
            }}>
            Save Changes
          </Text>
        </TouchableOpacity>
        <Modal
          transparent={true}
          visible={showAlert}
          animationType="fade"
          onRequestClose={() => setIsPopupVisible(false)}>
          <AlertBox
            callFunction={toggleShowAlert}
            title={title}
            description={description}
          />
        </Modal>
        <Modal transparent={true} visible={loading} animationType="fade">
          <View style={styles.overlay}>
            <Loading />
          </View>
        </Modal>
      </ScrollView>
      <BottomBar navigation={navigation} />
    </>
  );
};

export default Profile;

const styles = StyleSheet.create({
  icon: {
    marginRight: 5,
    fontSize: 18,
    color: '#687089',
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
