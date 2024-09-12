import {StyleSheet, Text, View, ImageBackground} from 'react-native';
import React, {useEffect} from 'react';

const Splash = props => {
  useEffect(() => {
    setTimeout(() => {
      props.navigation.navigate('Login');
    }, 2000);
  }, []);
  // useEffect(() => {
  //   setTimeout(() => {

  //   },2000);
  //   return () => {

  //   };
  // }, [props.navigation]);
  return (
    <ImageBackground
      style={{
        flex: 1,
      }}
      source={require('./assets/Splashbg.png')} // resizeMode={FastImage.resizeMode.cen}
    />
  );
};
export default Splash;

const styles = StyleSheet.create({});
