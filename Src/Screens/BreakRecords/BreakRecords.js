import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import {database_path} from '../../services/apiPath';
import auth from '@react-native-firebase/auth';
import {showAlert} from '../../lib/helpers';
import moment from 'moment';

const NotificationItem = ({item, onApprove, viewMode = false}) => {
  return (
    <View style={styles.notificationContainer}>
      <Text style={styles.teamNameText}>{item?.user?.fullname}</Text>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{item.break_duration} Minutes Break</Text>
      </View>
      <Text style={styles.teamNameText}>Break Area: {item?.break_area}</Text>
      {item?.acceptAt && (
        <>
          <Text style={styles.teamNameText}>
            Accepted On: {moment(item?.acceptAt).format('h:mm A, Do MMM YYYY')}
          </Text>
          <Text style={styles.teamNameText}>
            Break Ends On:{' '}
            {moment(item?.acceptAt)
              .add(item?.break_duration || 0, 'minutes') // Add break_duration minutes to acceptAt
              .format('h:mm A, Do MMM YYYY')}
          </Text>
        </>
      )}
      <Text style={styles.teamNameText}>
        Covered By: {item?.accepted_user?.fullname}
      </Text>
      {viewMode == false && (
        <View style={styles.buttonContainer}>
          <View style={styles.rejectButton}>
            <Text style={[styles.buttonText, {textTransform: 'capitalize'}]}>
              {item?.status}
            </Text>
          </View>
          {/* onPress={onApprove} */}
          {/* <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity> */}
        </View>
      )}
    </View>
  );
};

const BreakRecords = () => {
  const [data, setData] = useState([]);
  const [viewMode, setViewMode] = useState('myRequests'); // State to toggle view
  const [acceptedData, setAcceptedData] = useState([]); // Replace with actual accepted requests data

  const handleToggle = mode => setViewMode(mode);

  // const fetchBreakRequest = async () => {
  //   const ref = firebase
  //     .app()
  //     .database(database_path)
  //     .ref('break_times')
  //     .orderByChild('uid')
  //     .equalTo(auth().currentUser.uid); // Filter by current user's UID

  //   try {
  //     const snapshot = await ref.once('value');
  //     if (snapshot.exists()) {
  //       const breakRequests = snapshot.val();
  //       const sortedBreakRequests = Object.values(breakRequests)
  //         .filter(breakRequest => breakRequest.createdAt) // Ensure createdAt exists
  //         .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order

  //       // Fetch user data for each break request
  //       const breakRequestsWithUserData = await Promise.all(
  //         sortedBreakRequests.map(async request => {
  //           // Fetch the requesting user's data
  //           const requesterSnapshot = await firebase
  //             .app()
  //             .database(database_path)
  //             .ref(`users/${request.uid}`)
  //             .once('value');
  //           const requesterData = requesterSnapshot.val();

  //           // Fetch the accepted user's data if the request has been accepted
  //           let acceptedUserData = null;
  //           if (request.accepted_by_uid) {
  //             const acceptedUserSnapshot = await firebase
  //               .app()
  //               .database(database_path)
  //               .ref(`users/${request.accepted_by_uid}`)
  //               .once('value');
  //             acceptedUserData = acceptedUserSnapshot.val();
  //           }

  //           return {
  //             ...request,
  //             user: requesterData, // Add requester data to the request object
  //             accepted_user: acceptedUserData, // Add accepted user's data if available
  //           };
  //         }),
  //       );

  //       setData(breakRequestsWithUserData);
  //       console.log(breakRequestsWithUserData); // Log or handle the data as needed
  //     } else {
  //       console.log('No break requests found.');
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };

  const fetchBreakRequest = async () => {
    try {
      let ref;

      if (viewMode === 'myRequests') {
        // Fetch requests created by the current user
        ref = firebase
          .app()
          .database(database_path)
          .ref('break_times')
          .orderByChild('uid')
          .equalTo(auth().currentUser.uid);
      } else if (viewMode === 'acceptedRequests') {
        // Fetch requests accepted by the current user
        ref = firebase
          .app()
          .database(database_path)
          .ref('break_times')
          .orderByChild('accepted_by_uid')
          .equalTo(auth().currentUser.uid);
      }

      const snapshot = await ref.once('value');

      if (snapshot.exists()) {
        const breakRequests = snapshot.val();
        const sortedBreakRequests = Object.values(breakRequests)
          .filter(breakRequest => breakRequest.createdAt) // Ensure createdAt exists
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order

        // Fetch user data for each break request
        const breakRequestsWithUserData = await Promise.all(
          sortedBreakRequests.map(async request => {
            // Fetch the requesting user's data
            const requesterSnapshot = await firebase
              .app()
              .database(database_path)
              .ref(`users/${request.uid}`)
              .once('value');
            const requesterData = requesterSnapshot.val();

            // Fetch the accepted user's data if the request has been accepted
            let acceptedUserData = null;
            if (request.accepted_by_uid) {
              const acceptedUserSnapshot = await firebase
                .app()
                .database(database_path)
                .ref(`users/${request.accepted_by_uid}`)
                .once('value');
              acceptedUserData = acceptedUserSnapshot.val();
            }

            return {
              ...request,
              user: requesterData, // Add requester data to the request object
              accepted_user: acceptedUserData, // Add accepted user's data if available
            };
          }),
        );

        // Update the state
        if (viewMode === 'myRequests') {
          setData(breakRequestsWithUserData); // For "My Break Requests"
        } else if (viewMode === 'acceptedRequests') {
          setAcceptedData(breakRequestsWithUserData); // For "Accepted Requests"
        }

        console.log(breakRequestsWithUserData); // Log or handle the data as needed
      } else {
        console.log('No break requests found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchBreakRequest();
  }, [viewMode]);

  const handleApprove = async item => {
    try {
    } catch (error) {
      console.log(error);
      // Handle errors
      showAlert(error.message, 'danger'); // Assuming you have a showAlert function for error messages
    }
  };

  const handleReject = notification => {
    // Handle rejection logic
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Break Records</Text>
      {/* Buttons to toggle views */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'myRequests' && styles.activeButton,
          ]}
          onPress={() => handleToggle('myRequests')}>
          <Text
            style={[
              styles.buttonText,
              {color: viewMode === 'acceptedRequests' ? 'black' : '#fff'},
            ]}>
            My Break Requests
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[
            styles.toggleButton,
            viewMode === 'acceptedRequests' && styles.activeButton,
          ]}
          onPress={() => handleToggle('acceptedRequests')}>
          <Text
            style={[
              styles.buttonText,
              {color: viewMode === 'myRequests' ? 'black' : '#fff'},
            ]}>
            Accepted Requests
          </Text>
        </TouchableOpacity>
      </View>
      {viewMode == 'myRequests' ? (
        <View style={styles.notificationsList}>
          {data.map((item, index) => (
            <NotificationItem
              key={index}
              onApprove={handleApprove}
              item={item}
            />
          ))}

          {data.length <= 0 ? (
            <>
              <View style={styles.MainView}>
                <Text style={[styles.SigninText, {textAlign: 'center'}]}>
                  No record found!
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
        </View>
      ) : (
        <View style={styles.notificationsList}>
          {acceptedData.map((item, index) => (
            <NotificationItem
              key={index}
              onApprove={handleApprove}
              item={item}
              viewMode={true}
            />
          ))}

          {acceptedData.length <= 0 ? (
            <>
              <View style={styles.MainView}>
                <Text style={[styles.SigninText, {textAlign: 'center'}]}>
                  No record found!
                </Text>
              </View>
            </>
          ) : (
            <></>
          )}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  MainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    flex: 1,
    backgroundColor: '#fff', // Background color
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  notificationsList: {
    flex: 1,
  },
  notificationContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  timeContainer: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 4,
    marginBottom: 8,
  },
  timeText: {
    color: '#333',
    fontWeight: 'bold',
  },
  teamNameText: {
    color: '#666',
    marginBottom: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  approveButton: {
    backgroundColor: '#4CAF50', // Green
    padding: 10,
    borderRadius: 4,
  },
  rejectButton: {
    // backgroundColor: '#FF5722', // Red
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  buttonGroup: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  toggleButton: {
    flex: 1,
    padding: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    borderRadius: 5,
    marginHorizontal: 5,
  },
  activeButton: {
    backgroundColor: '#4CAF50',
  },
  notificationContainer: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  MainView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  SigninText: {
    fontSize: 16,
    color: '#333',
  },
});

export default BreakRecords;
