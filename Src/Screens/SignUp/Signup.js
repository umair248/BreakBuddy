import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
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
      handleError('Last name field required!', 'department');
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
    setLoading(false);
    props.navigation.navigate('Home');
    // const payload = inputs;
    // authService
    //   .login(payload)
    //   .then(async res => {
    //     const data = res?.data;
    //     showAlert(data?.message);
    //     await authService.setToken(data?.token);
    //     dispatch(userLoggedIn(data.user));
    //     navigation.navigate('Home');
    //   })
    //   .catch(err => {
    //     getErrorMessageFromResponse(err);
    //     setLoading(false);
    //   });
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
            onPress={() => {
              validate();
            }}
            style={styles.btnsignup}>
            <Text style={{color: 'white', fontWeight: '800', fontSize: 20}}>
              Register
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
    paddingVertical: hp('2%'),
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
