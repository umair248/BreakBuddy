import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import {database_path} from '../../services/apiPath';
import auth from '@react-native-firebase/auth';
import {showAlert} from '../../lib/helpers';
import moment from 'moment';

const NotificationItem = ({item, onApprove}) => {
  return (
    <View style={styles.notificationContainer}>
      <Text style={styles.teamNameText}>{item?.user?.fullname}</Text>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{item.break_duration} Minutes Break</Text>
      </View>
      <Text style={styles.teamNameText}>{item?.break_area}</Text>
      <Text style={styles.teamNameText}>
        {moment(item?.createAt).format('Do MMM YYYY, h:mm A')}
      </Text>
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
    </View>
  );
};

const BreakRecords = () => {
  const [data, setData] = useState([]);

  const fetchBreakRequest = async () => {
    const ref = firebase
      .app()
      .database(database_path)
      .ref('break_times')
      .orderByChild('uid')
      .equalTo(auth().currentUser.uid); // Filter by 'pending' status

    try {
      const snapshot = await ref.once('value');
      if (snapshot.exists()) {
        const breakRequests = snapshot.val();
        const sortedBreakRequests = Object.values(breakRequests)
          .filter(breakRequest => breakRequest.createdAt) // Ensure createdAt exists
          .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)); // Sort by createdAt in descending order

        // Fetch user data for each break request
        const breakRequestsWithUserData = await Promise.all(
          sortedBreakRequests.map(async request => {
            const userSnapshot = await firebase
              .app()
              .database(database_path)
              .ref(`users/${request.uid}`)
              .once('value');

            const userData = userSnapshot.val();

            return {
              ...request,
              user: userData, // Add user data to the request object
            };
          }),
        );

        setData(breakRequestsWithUserData);
        console.log(breakRequestsWithUserData); // Handle the sorted data as needed
      } else {
        console.log('No pending break requests found.');
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  useEffect(() => {
    fetchBreakRequest();
  }, []);

  const notificationsData = [
    {time: '01:30 - 02:15 pm', teamName: 'Team Name'},
    // ... other notifications
  ];

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
      <View style={styles.notificationsList}>
        {data.map((item, index) => (
          <NotificationItem key={index} onApprove={handleApprove} item={item} />
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
});

export default BreakRecords;
