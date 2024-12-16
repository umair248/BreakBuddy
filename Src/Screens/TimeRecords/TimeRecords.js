import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {firebase} from '@react-native-firebase/database';
import {database_path} from '../../services/apiPath';
import auth from '@react-native-firebase/auth';
import {showAlert} from '../../lib/helpers';
import moment from 'moment';

const NotificationItem = ({item, clockOut}) => {
  // Calculate total time spent if clock_out_date_time exists
  const totalTimeSpent = item?.clock_out_date_time
    ? moment(item?.clock_out_date_time).diff(
        moment(item?.clock_in_date_time),
        'minutes',
      ) // Get difference in minutes
    : null;

  // Format the total time spent into hours and minutes
  const formattedTimeSpent = totalTimeSpent
    ? `${Math.floor(totalTimeSpent / 60)} hrs ${totalTimeSpent % 60} mins`
    : 'N/A';

  return (
    <View style={styles.notificationContainer}>
      <View style={styles.rowContainer}>
        <Text style={[styles.teamNameText, {fontWeight: 700}]}>
          {item?.user?.fullname}
        </Text>
      </View>
      <Text style={styles.teamNameText}>Facility: {item?.facility_name}</Text>
      <Text style={styles.teamNameText}>Area: {item?.area}</Text>
      <Text style={styles.teamNameText}>
        Clock In Time:{'  '}
        {moment(item?.clock_in_date_time).format('h:mm A, Do MMMM YYYY')}
      </Text>
      <Text style={styles.teamNameText}>
        Clock In Out:{'  '}
        {item?.clock_out_date_time
          ? moment(item?.clock_out_date_time).format('h:mm A, Do MMMM YYYY')
          : 'No Clock Out'}
      </Text>
      <Text style={styles.teamNameText}>
        Total Time Spent:{'  '}
        {formattedTimeSpent}
      </Text>
      {item?.clock_out_date_time ? null : (
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={() => {
            clockOut(item);
          }}>
          <Text style={styles.buttonText}>CLOCK OUT</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const TimeRecords = ({navigation}) => {
  const [data, setData] = useState([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0); // State to store total time spent

  const fetchBreakRequest = () => {
    try {
      let ref;

      ref = firebase
        .app()
        .database(database_path)
        .ref('time_records')
        .orderByChild('uid')
        .equalTo(auth().currentUser.uid);

      // Set up the listener for real-time updates
      ref.on('value', async snapshot => {
        if (snapshot.exists()) {
          const breakRequests = snapshot.val();
          const sortedBreakRequests = Object.values(breakRequests)
            .filter(
              record => record.clock_in_date_time && record.clock_out_date_time, // Ensure both fields exist
            )
            .sort(
              (a, b) =>
                new Date(b.clock_in_date_time) - new Date(a.clock_in_date_time),
            ); // Sort by clock_in_date_time in descending order

          setData(sortedBreakRequests); // Set the fetched and sorted data
          calculateTotalTimeSpent(sortedBreakRequests); // Calculate total time spent
        } else {
          console.log('No time records found.');
          setData([]); // Clear data if no records found
          setTotalTimeSpent(0); // Reset total time spent
        }
      });

      // Cleanup function to remove the listener when the component unmounts or `viewMode` changes
      return () => ref.off();
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const calculateTotalTimeSpent = records => {
    const totalTime = records.reduce((sum, record) => {
      const clockInTime = moment(
        record.clock_in_date_time,
        'YYYY-MM-DD HH:mm:ss',
      );
      const clockOutTime = moment(
        record.clock_out_date_time,
        'YYYY-MM-DD HH:mm:ss',
      );
      const duration = clockOutTime.diff(clockInTime, 'seconds'); // Calculate duration in seconds
      return sum + duration;
    }, 0);

    setTotalTimeSpent(totalTime); // Update state with total time spent
  };

  useEffect(() => {
    const unsubscribe = fetchBreakRequest();

    // Cleanup listener on component unmount
    return unsubscribe;
  }, []);

  const handleClockOut = async item => {
    try {
      const recordRef = firebase
        .app()
        .database(database_path)
        .ref(`time_records/${item?.id}`);
      await recordRef.update({
        clock_out_date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
      });

      showAlert('Clock-out time updated successfully!', 'success');
    } catch (error) {
      console.log(error);
      // Handle errors
      showAlert(error.message, 'danger'); // Assuming you have a showAlert function for error messages
    }
  };
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Time Records</Text>
      {/* Buttons to toggle views */}
      <View style={styles.buttonGroup}>
        <TouchableOpacity
          style={[styles.toggleButton, styles.activeButton]}
          onPress={() => {
            navigation.navigate('AddTimeRecord');
          }}>
          <Text style={[styles.buttonText]}>Add Time Record</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.notificationsList}>
        {data.map((item, index) => (
          <NotificationItem key={index} clockOut={handleClockOut} item={item} />
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
        <Text style={styles.totalTime}>
          Total Time Spent: {Math.floor(totalTimeSpent / 3600)}h{' '}
          {Math.floor((totalTimeSpent % 3600) / 60)}m
        </Text>
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
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    textAlign: 'center',
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
  rowContainer: {
    flexDirection: 'row', // Align children horizontally
    justifyContent: 'space-between', // Optional: space between elements
    alignItems: 'center', // Optional: vertically center the text
  },
});

export default TimeRecords;
