/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Prelogin from './Screens/Prelogin';
import Login from './Screens/Login';
import SignUp from './Screens/SignUp';
import Questions from './Screens/Questions';
import Topbar from './components/Topbar';
import InformationSaved from './Screens/InformationSaved';
import ScanNow from './Screens/ScanNow';
import DetailInformation from './Screens/DetailInformation';
const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Prelogin"
          component={Prelogin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Scan"
          component={ScanNow}
          options={{
            headerTitle: props => <Topbar {...props} />,
            headerStyle: {
              backgroundColor: '#686f89',
              color: 'white', // Set your desired background color
            },
          }}
        />
        <Stack.Screen
          name="InformationSaved"
          component={InformationSaved}
          options={{
            headerTitle: props => <Topbar {...props} />,
            headerStyle: {
              backgroundColor: '#686f89',
              color: 'white', // Set your desired background color
            },
          }}
        />
        <Stack.Screen
          name="Questions"
          component={Questions}
          options={{
            headerTitle: props => <Topbar {...props} />,
            headerStyle: {
              backgroundColor: '#686f89',
              color: 'white', // Set your desired background color
            },
          }}
        />
        <Stack.Screen
          name="Signup"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="login"
          component={Login}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
