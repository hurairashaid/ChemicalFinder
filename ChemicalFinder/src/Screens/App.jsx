/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import Login from './Login';
import SignUp from './SignUp';
import Questions from './Questions';
import Topbar from '../components/Topbar';
import InformationSaved from './InformationSaved';
import ScanNow from './ScanNow';
import DetailInformation from './DetailInformation';
import MakingReady from './MakingReady';
import Profile from './Profile';
import Support from './Support';
import Prelogin from './Prelogin';

const Stack = createNativeStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="login"
          component={Login}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Prelogin"
          component={Prelogin}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Profile"
          component={Profile}
          options={{headerShown: false}}
        />

        <Stack.Screen
          name="MakingReady"
          component={MakingReady}
          options={{headerShown: false}}
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
          name="Signup"
          component={SignUp}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name="Support"
          component={Support}
          options={{headerShown: false}}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
