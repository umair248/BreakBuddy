/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React, {useEffect} from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/Navigation/StackNavigation';
import {enableScreens} from 'react-native-screens';
import FlashMessage from 'react-native-flash-message';
import {useAppDispatch} from './src/services/redux/hooks';
import {
  clearUserData,
  userLoggedIn,
} from './src/services/redux/slices/user-slice';
import auth from '@react-native-firebase/auth';
import {firebase} from '@react-native-firebase/database';
import {database_path} from './src/services/apiPath';

enableScreens();

function App() {
  const dispatch = useAppDispatch();

  async function onUserData(data) {
    try {
      // Fetch the user data from the Realtime Database
      const userSnapshot = await firebase
        .app()
        .database(database_path)
        .ref(`users/${data.uid}`)
        .once('value');

      // Extract the actual data from the snapshot
      const userData = userSnapshot.val();

      if (userData) {
        // Dispatch the data to the Redux store
        dispatch(
          userLoggedIn({
            uid: data.uid,
            email: data.email,
            fullname: userData.fullname,
            department: userData.department,
          }),
        );
      }
    } catch (error) {
      console.error('Error fetching user data: ', error);
    }
  }

  // Handle user state changes
  async function onAuthStateChanged(firebaseUser) {
    if (firebaseUser) {
      await onUserData(firebaseUser);
    } else {
      dispatch(clearUserData()); // Clear user data if not logged in
    }
  }

  async function getUserData() {
    const currentUser = auth().currentUser;
    await onUserData(currentUser);
  }

  useEffect(() => {
    getUserData();
  }, []);

  useEffect(() => {
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // Unsubscribe on unmount
  }, []);

  return (
    <NavigationContainer>
      <RootNavigator />
      <FlashMessage
        // statusBarHeight={StatusBar.currentHeight}

        hideStatusBar={false}
        position="top"
      />
    </NavigationContainer>
  );
}
export default App;
