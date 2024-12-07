import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import React, {useEffect} from 'react';
import snack from '../assets/snack.png';
import photo from '../assets/photo.png';
import camera from '../assets/camera.png';
import BottomBar from '../components/BottomBar';

const ScanNow = ({navigation}) => {
  function switchScreen(location) {
    navigation.navigate(location);
  }
  useEffect(() => {
    // Listener for preventing back navigation on this screen
    const unsubscribe = navigation.addListener('beforeRemove', e => {
      // Prevent the back navigation (either swipe or hardware button press)
      e.preventDefault();
    });

    return unsubscribe; // Cleanup listener on unmount
  }, [navigation]);
  return (
    <>
      <ScrollView>
        <View>
          <View style={{justifyContent: 'center', alignItems: 'center'}}>
            <Image
              style={{width: 180, height: 180, marginTop: 80}}
              source={snack}></Image>
            <Text
              style={{
                textAlign: 'center',
                fontSize: 16,
                paddingHorizontal: 15,
                marginTop: 20,
              }}>
              Scan your product to view detailed information, allowing you to
              easily review and verify its specifics. You can capture a new
              image or upload an existing one, giving you full flexibility to
              edit and update the details as needed.
            </Text>
          </View>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-around',
              marginTop: 40,
            }}>
            <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={camera} style={{width: 100, height: 100}}></Image>
              <Text>Capture Now</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{justifyContent: 'center', alignItems: 'center'}}>
              <Image source={photo} style={{width: 100, height: 100}}></Image>
              <Text>Upload Now</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
      <BottomBar navigation={navigation} />
    </>
  );
};

export default ScanNow;

const styles = StyleSheet.create({});
