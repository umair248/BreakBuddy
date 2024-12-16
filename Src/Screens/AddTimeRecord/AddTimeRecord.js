import {
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  FlatList,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useAppSelector} from '../../services/redux/hooks';
import {useHandleInputs} from '../../hooks/use-handle-input';
import InputField from '../../components/common/input-field';
import {firebase} from '@react-native-firebase/database';
import {database_path} from '../../services/apiPath';
import auth from '@react-native-firebase/auth';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';
import {showAlert} from '../../lib/helpers';
import moment from 'moment';

const AddTimeRecord = ({navigation}) => {
  const user = useAppSelector(state => state.user.user);
  const [loading, setLoading] = useState(false);
  const [isRequestSubmit, setIsRequestSubmit] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [inputs, handleInputs, setInputs, errors, handleError] =
    useHandleInputs({
      facility_name: '',
      area: '',
    });

  const validate = () => {
    setLoading(true);
    let isValid = true;

    if (!inputs.facility_name) {
      handleError('Facility field required!', 'facility_name');
      isValid = false;
    }

    if (!inputs.area) {
      handleError('Area field required!', 'area');
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
      const newBreakRequest = {
        id: firebase
          .app()
          .database(database_path)
          .ref()
          .child('time_records')
          .push().key, // generate a unique id
        uid: auth().currentUser.uid, // current user submitting the request
        facility_name: inputs.facility_name || '',
        area: inputs.area,
        month_year: moment().format('MM-YYYY'),
        total_time_spent: null,
        clock_in_date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        clock_out_date_time: null,
        createdAt: new Date().toISOString(), // capture creation timestamp
      };

      // Store the break request in the database
      await firebase
        .app()
        .database(database_path)
        .ref(`time_records/${newBreakRequest.id}`)
        .set(newBreakRequest);

      // Optional: Add some success message or navigate to another screen
      showAlert('Time record added!'); // Assuming you have a showAlert function

      // Reset inputs or take any further action if needed
      setInputs({
        facility_name: '',
        area: '',
      });

      navigation.navigate('Time');
    } catch (error) {
      console.log(error);
      // Handle errors
      showAlert(error.message, 'danger'); // Assuming you have a showAlert function for error messages
    } finally {
      setLoading(false); // Reset the loading state
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: 'white'}}>
      <View style={styles.MainView}>
        <Text style={styles.SigninText}>Add Time Record</Text>

        <View style={styles.ViewTextinp1}>
          <InputField
            placeholder="Enter Facility Name"
            onChange={e => {
              setInputs({facility_name: e});
            }}
            onFocus={() => handleError(null, 'facility_name')}
            error={errors.facility_name}
          />
        </View>

        <View style={styles.ViewTextinp1}>
          <InputField
            placeholder="Enter Area"
            onChange={e => {
              setInputs({area: e});
            }}
            onFocus={() => handleError(null, 'area')}
            error={errors.area}
          />
        </View>

        <View style={styles.Viewbtn}>
          <TouchableOpacity
            disabled={loading}
            onPress={validate}
            style={styles.btnsignup}>
            <Text style={{color: 'white', fontWeight: '800', fontSize: 14}}>
              {loading ? 'Loading...' : 'Clock In'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default AddTimeRecord;

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

const styles2 = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#116363',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
  },
  teamMemberContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  teamMemberImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  teamMemberName: {
    flex: 1,
  },
});
