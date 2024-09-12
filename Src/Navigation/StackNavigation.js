import { StyleSheet, Text, View } from 'react-native';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import Splash from '../Screens/Splash/Splash';
import Login from '../Screens/Login/Login';
import Signup from '../Screens/SignUp/Signup';
import Home from '../Screens/Home/Home';
import Team from '../Screens/Team/Team';
import BreakRecords from '../Screens/BreakRecords/BreakRecords';
import Notification from '../Screens/Notification/Notification';
import Profile from '../Screens/Profile/Profile';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

const HomeTab = () => {
  return (
<Tab.Navigator
    initialRouteName="Home"
    screenOptions={({ route }) => ({
      tabBarHideOnKeyboard:true,
        tabBarShowLabel: true,
        tabBarStyle: {
            backgroundColor: '#116363',
        },
        tabBarLabel: ({ focused }) => (
            <Text style={{
                color: focused ? '#FD932F' : 'white',
                textAlign: 'center',
                fontSize: 16, // Increase font size as needed
                flex: 1,
                marginBottom: 10, // Adjust as needed for vertical centering
            }}>
                {route.name}
            </Text>
        ),
        tabBarIcon: () => null, // Hide the icons
        headerShown: false,
    })}
>
      
      <Tab.Screen
        name="Team"
        component={Team}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="BreakRecords"
        component={BreakRecords}
        options={{
          headerShown: false,
        }}
      />
      <Tab.Screen
        name="Home"
        component={Home}
        options={{
          headerShown: false,
        }}
      />
       <Tab.Screen
        name="Notification"
        component={Notification}
        options={{
          headerShown: false,
        }}
      />
       <Tab.Screen
        name="Profile"
        component={Profile}
        options={{
          headerShown: false,
        }}
      />
      
      
    </Tab.Navigator>
  );
};

const RootNavigator = () => {
  return (
    <Stack.Navigator initialRouteName="Splash">
      <Stack.Screen
        name="Splash"
        component={Splash}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Root"
        component={HomeTab}
        options={{
          headerShown: false,
          title: 'breakbuddy',
          headerTintColor: 'white',
          headerTitleAlign: 'center',
          headerTitleStyle: {
            fontSize: 25,
          },
        }}
      />
      <Stack.Screen
        name="Login"
        component={Login}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Signup"
        component={Signup}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="Home"
        component={HomeTab}
        options={{
          headerShown: false,
        }}
      />
    </Stack.Navigator>
  );
};
export default RootNavigator;


const styles = StyleSheet.create({});
