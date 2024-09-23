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
import InputField from '../../components/common/input-field';
import auth from '@react-native-firebase/auth'; // Import Firebase Auth
import {showAlert} from '../../lib/helpers'; // Ensure you have this helper for alerts
import {firebase} from '@react-native-firebase/database';
import {userLoggedIn} from '../../services/redux/slices/user-slice';
import {database_path} from '../../services/apiPath';

const Signup = props => {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [inputs, handleInputs, setInputs, errors, handleError] =
    useHandleInputs({
      fullname: '',
      email: '',
      password: '',
      department: '',
    });

  const validate = () => {
    setLoading(true);
    let isValid = true;

    if (!inputs.fullname) {
      handleError('Fullname field required!', 'fullname');
      isValid = false;
    }

    if (!inputs.email) {
      handleError('Email field required!', 'email');
      isValid = false;
    }

    if (!inputs.department) {
      handleError('Department field required!', 'department');
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
      // Create a new user with Firebase Auth
      const userCredential = await auth().createUserWithEmailAndPassword(
        inputs.email,
        inputs.password,
      );
      const user = userCredential.user;
      console.log('USER');
      console.log(user);
      // Save the user's fullname in the Realtime Database
      await firebase
        .app()
        .database(database_path)
        .ref(`users/${user.uid}`)
        .set({
          fullname: inputs.fullname,
          email: inputs.email,
          department: inputs.department,
          createdAt: new Date().toISOString(),
        });
      showAlert('Registration Completed!');

      // Dispatch user data if needed
      dispatch(
        userLoggedIn({
          uid: user.uid,
          email: user.email,
          fullname: inputs.fullname,
          department: inputs.department,
        }),
      );
      props.navigation.navigate('Root');
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        showAlert('This email address already in use!', 'danger'); // Show error message
      }
      if (error.code === 'auth/invalid-email') {
        showAlert('That email address is invalid!', 'danger'); // Show error message
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.BgView}>
      <View style={styles.MainView}>
        <Text style={styles.SigninText}>Create Account Now</Text>

        <View style={styles.ViewTextinp1}>
          <InputField
            placeholder="Enter your fullname"
            onChange={e => {
              setInputs({fullname: e});
            }}
            onFocus={() => handleError(null, 'fullname')}
            error={errors.fullname}
          />
        </View>
        <View style={styles.ViewTextinp2}>
          <InputField
            placeholder="Enter your email"
            onChange={e => {
              setInputs({email: e});
            }}
            onFocus={() => handleError(null, 'email')}
            error={errors.email}
          />
        </View>
        <View style={styles.ViewTextinp2}>
          <InputField
            placeholder="Enter your department"
            onChange={e => {
              setInputs({department: e});
            }}
            onFocus={() => handleError(null, 'department')}
            error={errors.department}
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
        <View style={styles.Viewbtn}>
          <TouchableOpacity
            disabled={loading}
            onPress={validate}
            style={styles.btnsignup}>
            <Text style={{color: 'white', fontWeight: '800', fontSize: 20}}>
              {loading ? 'Registering...' : 'Register'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Signup;

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
  ViewTextinp2: {
    width: wp('80%'),
    paddingVertical: hp('2%'),
  },
  Viewbtn: {
    width: wp('80%'),
    paddingVertical: hp('2%'),
  },
  btnsignup: {
    height: '25%',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FD932F',
  },
});
