import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useAppDispatch} from '../../services/redux/hooks';
import {useHandleInputs} from '../../hooks/use-handle-input';
import {showAlert} from '../../lib/helpers';
import InputField from '../../components/common/input-field';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth
import {userLoggedIn} from '../../services/redux/slices/user-slice';
import database from '@react-native-firebase/database';

const Login = props => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [inputs, handleInputs, setInputs, errors, handleError] =
    useHandleInputs({
      email: '',
      password: '',
    });
  const validate = () => {
    setLoading(true);
    let isValid = true;

    if (!inputs.email) {
      handleError('Email field required!', 'email');
      isValid = false;
    }

    if (!inputs.password) {
      handleError('Password field required!', 'password');
      isValid = false;
    }

    if (isValid) {
      handleSubmit();
    } else {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Sign in with Firebase Auth
      const userCredential = await auth().signInWithEmailAndPassword(
        inputs.email,
        inputs.password,
      );
      const user = userCredential.user;

      // Fetch the user data from the Realtime Database
      const userSnapshot = await database()
        .ref(`users/${user.uid}`)
        .once('value');

      // Extract the actual data from the snapshot
      const userData = userSnapshot.val();

      // console.log('RESPONSE USER');
      // console.log(user);

      // Dispatch user data if needed
      dispatch(
        userLoggedIn({
          uid: user.uid,
          email: userData.email,
          fullname: userData.fullname,
          department: userData.department,
        }),
      );

      // Navigate to Home
      props.navigation.navigate('Root'); // Assuming 'Root' is your HomeTab
    } catch (error) {
      console.log('ERROR');
      console.log(error);

      // Handle errors
      showAlert('Invalid Credentials', 'danger'); // Show error message
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.BgView}>
      <View style={styles.MainView}>
        <Text style={styles.SigninText}>Login Now</Text>

        <View style={styles.ViewTextinp1}>
          <InputField
            placeholder="Enter your Email"
            onChange={e => {
              setInputs({email: e});
            }}
            onFocus={() => handleError(null, 'email')}
            error={errors.email}
          />
        </View>
        <View style={styles.ViewTextinp2}>
          <InputField
            placeholder="Enter your password"
            onChange={e => {
              setInputs({password: e});
            }}
            password={true}
            onFocus={() => handleError(null, 'password')}
            error={errors.password}
          />
        </View>
        <View style={{paddingTop: 10}}>
          <TouchableOpacity
            onPress={() => {
              props.navigation.navigate('Signup');
            }}>
            <Text style={{color: 'blue'}}>Don't have account?</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.Viewbtn}>
          <TouchableOpacity
            onPress={() => {
              validate();
            }}
            disabled={loading}
            style={styles.btnsignup}>
            <Text style={{color: 'white', fontWeight: '800', fontSize: 20}}>
              {loading ? 'Loading...' : 'Submit'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Login;

const styles = StyleSheet.create({
  BgView: {
    flex: 1,
    backgroundColor: 'white',
  },
  MainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SigninText: {
    fontSize: hp('3%'),
    color: '#116363',
    fontStyle: 'italic',
    fontWeight: '800',
  },
  ViewTextinp1: {
    width: wp('80%'),
    paddingVertical: hp('2%'),
  },
  Textinp1: {
    borderColor: 'black',
    borderWidth: 1,
  },
  Textinp2: {
    borderColor: 'black',
    borderWidth: 1,
  },
  ViewTextinp2: {
    width: wp('80%'),
  },
  Viewbtn: {
    width: wp('80%'),
    paddingVertical: hp('2%'),
  },
  btnsignup: {
    // width:wp('100%'),
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FD932F',
  },
});
