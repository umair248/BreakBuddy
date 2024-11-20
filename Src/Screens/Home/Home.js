import {
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Image,
  FlatList,
  Alert,
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
import {showAlert} from '../../lib/helpers';
import messaging from '@react-native-firebase/messaging';

const Home = () => {
  const user = useAppSelector(state => state.user.user);
  const [loading, setLoading] = useState(false);
  const [isRequestSubmit, setIsRequestSubmit] = useState(0);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [inputs, handleInputs, setInputs, errors, handleError] =
    useHandleInputs({
      break_duration: '',
      break_area: '',
      notes: '',
      accepted_by_uid: [],
    });

  const getAndStoreToken = async () => {
    try {
      // Get the FCM token
      const fcmToken = await messaging().getToken();
      if (fcmToken) {
        console.log('FCM Token:', fcmToken);

        // Save the token in the Realtime Database
        const uid = auth().currentUser?.uid;
        if (uid) {
          await firebase
            .app()
            .database(database_path)
            .ref(`users/${uid}`)
            .update({fcmToken});
          console.log('FCM Token saved successfully.');
        } else {
          console.log('User is not authenticated.');
        }
      } else {
        console.log('Failed to get FCM token.');
      }
    } catch (error) {
      console.error('Error fetching or saving FCM token:', error);
    }
  };

  const requestPushNotificationPermission = async () => {
    const authStatus = await messaging().hasPermission();

    console.log('NOTIFICATION LOG');
    console.log(authStatus);

    if (
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL
    ) {
      console.log('Push notifications are already enabled.');
      return;
    }

    // Show Alert Dialog
    Alert.alert(
      'Enable Notifications',
      'Would you like to enable push notifications for break alerts?',
      [
        {
          text: 'Disallow',
          onPress: () => console.log('Push notifications disallowed'),
          style: 'cancel',
        },
        {
          text: 'Allow',
          onPress: async () => {
            try {
              const status = await messaging().requestPermission();
              if (status === messaging.AuthorizationStatus.AUTHORIZED) {
                console.log('Push notifications enabled.');
                await getAndStoreToken(); // Fetch and store token after enabling
              } else {
                console.log('Push notifications denied.');
              }
            } catch (error) {
              console.error(
                'Error requesting push notification permission:',
                error,
              );
            }
          },
        },
      ],
      {cancelable: false},
    );
  };

  // Example usage
  useEffect(() => {
    requestPushNotificationPermission();
  }, []);

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
      setIsRequestSubmit(1);
      setLoading(false);
      // handleSubmit();
    } else {
      setLoading(false);
    }
  };

  const [acceptedUserName, setAcceptedUserName] = useState(null);
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
        ref.on('value', async snapshot => {
          if (snapshot.exists()) {
            const breakRequests = snapshot.val();
            const lastRequest = Object.values(breakRequests)[0]; // Get the latest request

            const now = new Date();
            const acceptAt = lastRequest.acceptAt
              ? new Date(lastRequest.acceptAt)
              : null;
            const breakDurationMs = lastRequest.break_duration * 60 * 1000;

            if (lastRequest.status === 'pending') {
              setSelectedRequest(lastRequest);
              setIsRequestSubmit(2); // Set to true if last request is pending
            } else if (lastRequest.status === 'accepted') {
              // Check if the break time has ended
              if (now - acceptAt >= breakDurationMs) {
                await firebase
                  .app()
                  .database(database_path)
                  .ref(`break_times/${lastRequest.id}`)
                  .update({
                    status: 'ended',
                  });
                setIsRequestSubmit(0); // Reset request submission
              } else {
                setSelectedRequest(lastRequest);
                setIsRequestSubmit(3); // Break is ongoing

                // Fetch the full name of the user who accepted the request
                const acceptedByUid = lastRequest?.accepted_by_uid || null;
                if (acceptedByUid) {
                  const userRef = firebase
                    .app()
                    .database(database_path)
                    .ref(`users/${acceptedByUid}`);

                  userRef.once('value', userSnapshot => {
                    if (userSnapshot.exists()) {
                      const userData = userSnapshot.val();
                      console.log('USER DATA');
                      console.log(userData);
                      const fullName = userData.fullname; // Adjust if the field name is different
                      setAcceptedUserName(fullName); // Store the full name in state
                    }
                  });
                }
              }
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

  // useEffect(() => {
  //   // Function to listen for real-time changes
  //   const listenToBreakRequests = () => {
  //     const uid = auth().currentUser?.uid;

  //     if (uid) {
  //       const ref = firebase
  //         .app()
  //         .database(database_path)
  //         .ref('break_times')
  //         .orderByChild('uid')
  //         .equalTo(uid)
  //         .limitToLast(1);

  //       // Real-time listener
  //       ref.on('value', async snapshot => {
  //         if (snapshot.exists()) {
  //           const breakRequests = snapshot.val();
  //           const lastRequest = Object.values(breakRequests)[0]; // Get the latest request

  //           const now = new Date();
  //           const acceptAt = lastRequest.acceptAt
  //             ? new Date(lastRequest.acceptAt)
  //             : null;
  //           const breakDurationMs = lastRequest.break_duration * 60 * 1000;

  //           if (lastRequest.status === 'pending') {
  //             setSelectedRequest(lastRequest);
  //             setIsRequestSubmit(2); // Set to true if last request is pending
  //           } else if (lastRequest.status === 'accepted') {
  //             if (now - acceptAt >= breakDurationMs) {
  //               // Update the status in Firebase to 'accepted' and reset `setIsRequestSubmit`
  //               await firebase
  //                 .app()
  //                 .database(database_path)
  //                 .ref(`break_times/${lastRequest.id}`)
  //                 .update({
  //                   status: 'ended',
  //                 });
  //               setIsRequestSubmit(0); // Reset request submission
  //             } else {
  //               setSelectedRequest(lastRequest);
  //               setIsRequestSubmit(3); // Break is ongoing
  //             }
  //           } else {
  //             setIsRequestSubmit(0); // Reset if no pending requests
  //           }
  //         } else {
  //           setIsRequestSubmit(0); // Reset if no requests found
  //         }
  //         setLoading(false); // Stop loading after data is retrieved
  //       });

  //       // Clean up the listener when component unmounts
  //       return () => ref.off();
  //     }
  //   };

  //   listenToBreakRequests(); // Start listening when the component is mounted
  // }, []);

  const handleSubmit = async () => {
    if (!inputs.accepted_by_uid || inputs.accepted_by_uid.length === 0) {
      showAlert('Select at least one team member!', 'danger');
      return;
    }

    setLoading(true);
    try {
      const newBreakRequest = {
        id: firebase
          .app()
          .database(database_path)
          .ref()
          .child('break_times')
          .push().key, // generate a unique id
        uid: auth().currentUser.uid, // current user submitting the request
        request_send_uids: inputs.accepted_by_uid || [],
        accepted_by_uid: null, // initially, no one has accepted it
        break_duration: Number(inputs.break_duration),
        break_area: inputs.break_area,
        notes: inputs.notes || null, // notes can be nullable
        status: 'pending', // initial status is 'pending'
        acceptAt: null,
        createdAt: new Date().toISOString(), // capture creation timestamp
      };

      // Store the break request in the database
      await firebase
        .app()
        .database(database_path)
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

      setIsRequestSubmit(2);
    } catch (error) {
      console.log(error);
      // Handle errors
      showAlert(error.message, 'danger'); // Assuming you have a showAlert function for error messages
    } finally {
      setLoading(false); // Reset the loading state
    }
  };

  const cancelRequest = async (status = 'cancelled') => {
    setLoading(true);
    try {
      await firebase
        .app()
        .database(database_path)
        .ref(`break_times/${selectedRequest?.id}`)
        .update({
          status: status,
        });
      showAlert('Request Cancelled!');
      setIsRequestSubmit(0);
    } catch (error) {
      console.log(error);
      // Handle errors
      showAlert(error.message, 'danger'); // Assuming you have a showAlert function for error messages
    } finally {
      setLoading(false);
    }
  };

  const [users, setUsers] = useState([]);

  const fetchUsers = async () => {
    const currentUserUid = firebase.auth().currentUser.uid; // Get current user's UID

    const ref = firebase
      .app()
      .database(database_path)
      .ref('users')
      .orderByChild('uid');

    try {
      const snapshot = await ref.once('value');
      if (snapshot.exists()) {
        const userListObject = snapshot.val();
        const userList = Object.keys(userListObject)
          .map(key => ({
            id: key, // Optional: Keeping the unique ID
            ...userListObject[key],
          }))
          .filter(user => user.id !== currentUserUid); // Exclude the current user

        setUsers(userList);
      } else {
        console.log('No users found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    if (isRequestSubmit == 1) {
      fetchUsers();
    } else {
      fetchUsers();
    }
  }, [isRequestSubmit]);

  const renderTeamMember = ({item}) => {
    const isSelected = inputs.accepted_by_uid?.includes(item.id); // Check if item.id is in the array

    return (
      <View style={styles2.teamMemberContainer}>
        <Text style={styles2.teamMemberName}>{item.fullname}</Text>
        <TouchableOpacity
          onPress={() => {
            // Check if accepted_by_uid exists and is an array
            let updatedAcceptedByUid = inputs.accepted_by_uid
              ? [...inputs.accepted_by_uid]
              : [];

            if (isSelected) {
              // If the item.id is already in the array, remove it
              updatedAcceptedByUid = updatedAcceptedByUid.filter(
                uid => uid !== item.id,
              );
            } else {
              // If item.id is not in the array, add it
              updatedAcceptedByUid.push(item.id);
            }

            // Update the inputs with the new array
            setInputs({accepted_by_uid: updatedAcceptedByUid});
          }}
          style={{
            width: 100,
            height: 30,
            backgroundColor: '#FD932F',
            justifyContent: 'center',
            alignItems: 'center',
          }}>
          <Text style={{color: 'white', fontSize: 16}}>
            {isSelected ? 'Selected' : 'Add'}
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const [duration, setDuration] = useState(0); // State to store remaining duration
  useEffect(() => {
    if (
      isRequestSubmit === 3 &&
      selectedRequest?.break_duration &&
      selectedRequest?.acceptAt
    ) {
      const acceptAt = new Date(selectedRequest.acceptAt).getTime(); // Convert acceptAt to timestamp
      const now = Date.now(); // Current timestamp
      const totalDuration = selectedRequest.break_duration * 60; // Total duration in seconds
      const elapsedTime = Math.floor((now - acceptAt) / 1000); // Elapsed time in seconds
      const remainingDuration = Math.max(totalDuration - elapsedTime, 0); // Ensure non-negative duration

      setDuration(remainingDuration); // Update the state with the calculated duration

      // If no time is left, end the request immediately
      if (remainingDuration <= 0) {
        cancelRequest('ended');
      }
    }
  }, [isRequestSubmit, selectedRequest, cancelRequest]);

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

      {isRequestSubmit == 3 ? (
        <>
          <View style={styles.MainView}>
            <Text style={[styles.SigninText, {marginBottom: 5}]}>
              Break Request
            </Text>
            <Text style={[styles.SigninText, {marginBottom: 20}]}>
              Accepted by {acceptedUserName || ''}
            </Text>
            <CountdownCircleTimer
              isPlaying={true}
              // duration={selectedRequest?.break_duration * 60}
              duration={duration}
              onComplete={() => {
                cancelRequest('ended');
              }}
              colors="#116363">
              {({remainingTime}) => {
                const minutes = Math.floor(remainingTime / 60);
                const seconds = remainingTime % 60;
                return (
                  <Text style={{fontSize: 30}}>
                    {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
                  </Text>
                );
              }}
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
                <Text style={{color: 'white', fontWeight: '800', fontSize: 14}}>
                  {loading ? 'Loading...' : 'Select Team Member'}
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
          <View style={styles2.container}>
            <Text style={styles2.title}>
              Select Team Member Whom you want to send break request
            </Text>
            <FlatList
              data={users}
              renderItem={renderTeamMember}
              keyExtractor={item => item.id} // Assuming each member has a unique id
            />
            <View style={{gap: 10}}>
              <TouchableOpacity
                disabled={loading}
                onPress={() => {
                  if (inputs.accepted_by_uid == null) {
                    showAlert(
                      'You need to select team member in order to send the request!',
                      'danger',
                    );
                    return;
                  }
                  handleSubmit();
                }}
                style={[styles.btnsignup, {height: 50}]}>
                <Text style={{color: 'white', fontWeight: '800', fontSize: 14}}>
                  {loading ? 'Loading...' : 'Submit Request'}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                disabled={loading}
                onPress={() => {
                  setIsRequestSubmit(0);
                }}
                style={[styles.btnsignup, {height: 50}]}>
                <Text style={{color: 'white', fontWeight: '800', fontSize: 14}}>
                  Go Back
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </>
      ) : (
        <></>
      )}

      {isRequestSubmit == 2 ? (
        <>
          <View style={styles.MainView}>
            <Text style={[styles.SigninText, {textAlign: 'center'}]}>
              Waiting for someone to accept the request!
            </Text>
            <View style={styles.Viewbtn}>
              <TouchableOpacity
                disabled={loading}
                onPress={cancelRequest}
                style={styles.btnsignup}>
                <Text style={{color: 'white', fontWeight: '800', fontSize: 16}}>
                  {loading ? 'Loading...' : 'Cancel Request'}
                </Text>
              </TouchableOpacity>
            </View>
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
