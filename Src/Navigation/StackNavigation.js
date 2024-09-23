import {StyleSheet, Text} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';

import Splash from '../Screens/Splash/Splash';
import Login from '../Screens/Login/Login';
import Signup from '../Screens/SignUp/Signup';
import Home from '../Screens/Home/Home';
import Team from '../Screens/Team/Team';
import BreakRecords from '../Screens/BreakRecords/BreakRecords';
import Notification from '../Screens/Notification/Notification';
import Profile from '../Screens/Profile/Profile';
import {useAppSelector} from '../services/redux/hooks';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTab = () => {
  return (
    <Tab.Navigator
      initialRouteName="Home"
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarShowLabel: true,
        tabBarStyle: {
          backgroundColor: '#116363',
        },
        tabBarLabel: ({focused}) => (
          <Text
            style={{
              color: focused ? '#FD932F' : 'white',
              textAlign: 'center',
              fontSize: 16,
              flex: 1,
              marginBottom: 10,
            }}>
            {route.name}
          </Text>
        ),
        tabBarIcon: () => null, // Hide the icons
        headerShown: false,
      })}>
      {/* <Tab.Screen name="Team" component={Team} options={{headerShown: false}} /> */}
      <Tab.Screen
        name="BreakRecords"
        component={BreakRecords}
        options={{headerShown: false}}
      />
      <Tab.Screen name="Home" component={Home} options={{headerShown: false}} />
      <Tab.Screen
        name="Notification"
        component={Notification}
        options={{headerShown: false}}
      />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  const user = useAppSelector(state => state.user.user);
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{headerShown: false}}
      />
      {user ? (
        <Stack.Screen
          name="Root"
          component={HomeTab}
          options={{headerShown: false}}
        />
      ) : (
        <>
          <Stack.Screen
            name="Login"
            component={Login}
            options={{headerShown: false}}
          />
          <Stack.Screen
            name="Signup"
            component={Signup}
            options={{headerShown: false}}
          />
        </>
      )}
    </Stack.Navigator>
  );
};

export default RootNavigator;

const styles = StyleSheet.create({});
