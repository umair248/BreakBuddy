import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useAppDispatch, useAppSelector} from '../../services/redux/hooks';
import {useHandleInputs} from '../../hooks/use-handle-input';
import InputField from '../../components/common/input-field';

const Home = () => {
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [inputs, handleInputs, setInputs, errors, handleError] =
    useHandleInputs({
      break_duration: '',
      break_area: '',
      notes: '',
    });

  const validate = () => {
    setLoading(true);
    let isValid = true;

    if (!inputs.break_duration) {
      handleError('Break Duration field required!', 'break_duration');
      isValid = false;
    } else if (isNaN(Number(inputs.break_duration))) {
      handleError('Break Duration must be a numeric value!', 'break_duration');
      isValid = false;
    }

    if (!inputs.break_area) {
      handleError('Break area field required!', 'break_area');
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
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.profileviewStyleview}>
        <View>
          {/* <Image
            style={{width: wp('20%'), height: hp('10%')}}
            source={require('./assets/userprofile.png')}></Image> */}
        </View>
        <View>
          <Text style={[styles.SigninText, {paddingLeft: 10}]}>
            {user?.fullname}
          </Text>
        </View>
      </View>
      <View style={styles.MainView}>
        <Text style={styles.SigninText}>Wanna Send Request?</Text>

        <View style={styles.ViewTextinp1}>
          <InputField
            placeholder="Enter your break-time duration in mins"
            onChange={e => {
              setInputs({break_duration: e});
            }}
            onFocus={() => handleError(null, 'break_duration')}
            error={errors.break_duration}
          />
        </View>

        <View style={styles.ViewTextinp1}>
          <InputField
            placeholder="Enter break area"
            onChange={e => {
              setInputs({break_area: e});
            }}
            onFocus={() => handleError(null, 'break_area')}
            error={errors.break_area}
          />
        </View>

        <View style={styles.ViewTextinp1}>
          <InputField
            placeholder="Add notes"
            onChange={e => {
              setInputs({notes: e});
            }}
            onFocus={() => handleError(null, 'notes')}
            error={errors.notes}
          />
        </View>

        <View style={styles.Viewbtn}>
          <TouchableOpacity
            disabled={loading}
            onPress={validate}
            style={styles.btnsignup}>
            <Text style={{color: 'white', fontWeight: '800', fontSize: 20}}>
              {loading ? 'Loading...' : 'Send Request'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Home;

const styles = StyleSheet.create({
  profileviewStyleview: {
    // width:wp('50%'),
    // backgroundColor:'grey',
    // justifyContent:'center',
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
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
  Textinp3: {
    borderColor: 'black',
    borderWidth: 1,
    height: hp('10%'),
  },
  Viewbtn: {
    width: wp('40%'),
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
