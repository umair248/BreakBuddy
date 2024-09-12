/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */
import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import RootNavigator from './src/Navigation/StackNavigation';
import {enableScreens} from 'react-native-screens';
import FlashMessage from 'react-native-flash-message';

enableScreens();

function App() {
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
