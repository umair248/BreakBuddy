import {ImageBackground} from 'react-native';
import React, {useEffect} from 'react';
import {useAppSelector} from '../../services/redux/hooks';

const Splash = props => {
  const user = useAppSelector(state => state.user.user);

  const handleAuthentication = () => {
    if (!user) {
      props.navigation.replace('Login'); // Use `replace` to prevent going back to splash
    } else {
      props.navigation.replace('Root');
    }
  };

  useEffect(() => {
    handleAuthentication(); // Trigger the check once the component is mounted
  }, [user]); // Only track `user`

  return (
    <ImageBackground
      style={{
        flex: 1,
      }}
      source={require('./assets/Splashbg.png')} // Adjust path if needed
    />
  );
};

export default Splash;
