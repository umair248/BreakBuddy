import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {useAppDispatch, useAppSelector} from '../../services/redux/hooks';
import {useHandleInputs} from '../../hooks/use-handle-input';
import InputField from '../../components/common/input-field';
import {firebase} from '@react-native-firebase/database';
import {database_path} from '../../services/apiPath';
import auth from '@react-native-firebase/auth';
import {CountdownCircleTimer} from 'react-native-countdown-circle-timer';

const Home = () => {
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [isRequestSubmit, setIsRequestSubmit] = useState(0);
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

  useEffect(() => {
    // Function to listen for real-time changes
    const listenToBreakRequests = () => {
      const uid = auth().currentUser?.uid;

      if (uid) {
        const ref = firebase
          .app()
          .database(database_path)
          .ref('break_times')
          .orderByChild('uid')
          .equalTo(uid)
          .limitToLast(1);

        // Real-time listener
        ref.on('value', snapshot => {
          if (snapshot.exists()) {
            const breakRequests = snapshot.val();
            const lastRequest = Object.values(breakRequests)[0]; // Get the latest request

            if (lastRequest.status === 'pending') {
              setIsRequestSubmit(1); // Set to true if last request is pending
            } else if (lastRequest.status === 'accepted') {
              setIsRequestSubmit(2); // Reset if no pending requests
            } else {
              setIsRequestSubmit(0); // Reset if no pending requests
            }
          } else {
            setIsRequestSubmit(0); // Reset if no requests found
          }
          setLoading(false); // Stop loading after data is retrieved
        });

        // Clean up the listener when component unmounts
        return () => ref.off();
      }
    };

    listenToBreakRequests(); // Start listening when the component is mounted
  }, []);

  const handleSubmit = async () => {
    setLoading(false);
    try {
      const newBreakRequest = {
        id: firebase
          .app()
          .database(database_path)
          .ref()
          .child('break_times')
          .push().key, // generate a unique id
        uid: auth().currentUser.uid, // current user submitting the request
        accepted_by_uid: null, // initially, no one has accepted it
        break_duration: Number(inputs.break_duration),
        break_area: inputs.break_area,
        notes: inputs.notes || null, // notes can be nullable
        status: 'pending', // initial status is 'pending'
        acceptAt: null,
        createdAt: new Date().toISOString(), // capture creation timestamp
      };

      // Store the break request in the database
      await database()
        .ref(`break_times/${newBreakRequest.id}`)
        .set(newBreakRequest);

      // Optional: Add some success message or navigate to another screen
      showAlert('Break request submitted successfully!'); // Assuming you have a showAlert function

      // Reset inputs or take any further action if needed
      setInputs({
        break_duration: '',
        break_area: '',
        notes: '',
      });

      setIsRequestSubmit(1);
    } catch (error) {
      // Handle errors
      showAlert(error.message); // Assuming you have a showAlert function for error messages
    } finally {
      setLoading(false); // Reset the loading state
    }
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

      {isRequestSubmit == 2 ? (
        <>
          <View style={styles.MainView}>
            <Text style={[styles.SigninText, {marginBottom: 20}]}>
              Break Count-down
            </Text>
            <CountdownCircleTimer
              isPlaying={true}
              duration={30}
              colors="#116363">
              {({remainingTime}) => (
                <Text style={{fontSize: 30}}>{remainingTime}</Text>
              )}
            </CountdownCircleTimer>
          </View>
        </>
      ) : (
        <></>
      )}
      {isRequestSubmit == 0 ? (
        <>
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
        </>
      ) : (
        <></>
      )}
      {isRequestSubmit == 1 ? (
        <>
          <View style={styles.MainView}>
            <Text style={[styles.SigninText, {textAlign: 'center'}]}>
              Waiting for someone to accept the request!
            </Text>
          </View>
        </>
      ) : (
        <></>
      )}
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
