import React, {useCallback, useEffect, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import {firebase} from '@react-native-firebase/database';
import {database_path} from '../../services/apiPath';
import auth from '@react-native-firebase/auth';
import {showAlert} from '../../lib/helpers';
import moment from 'moment';
import {useFocusEffect} from '@react-navigation/native';
import storage from '@react-native-firebase/storage';
import DocumentPicker from 'react-native-document-picker';
import Papa from 'papaparse';
import RNFS from 'react-native-fs'; // File system package

const NotificationItem = ({item, clockOut}) => {
  const [clockOutFile, setClockOutFile] = useState(null);
  const handleFileSelect = async setFileCallback => {
    try {
      const res = await DocumentPicker.pickSingle({
        type: [DocumentPicker.types.images],
      });
      setFileCallback(res);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        console.error(err);
      }
    }
  };
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
      {/* Render Downloadable Clock-In Image if Exists */}
      {item?.clock_in_image_src && (
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => Linking.openURL(item.clock_in_image_src)}>
          <Text style={styles.buttonText}>View Clock-In Image</Text>
        </TouchableOpacity>
      )}

      {/* Render Downloadable Clock-Out Image if Exists */}
      {item?.clock_out_image_src && (
        <TouchableOpacity
          style={styles.downloadButton}
          onPress={() => Linking.openURL(item.clock_out_image_src)}>
          <Text style={styles.buttonText}>View Clock-Out Image</Text>
        </TouchableOpacity>
      )}
      {item?.clock_out_date_time ? null : (
        <>
          <Text
            style={[styles.teamNameText, {fontWeight: '700', marginTop: 10}]}>
            Action
          </Text>
          <TouchableOpacity
            style={[
              styles.fileButton,
              clockOutFile && styles.fileButtonSelected, // Adjust styling if file is selected
            ]}
            onPress={() => {
              if (clockOutFile) {
                setClockOutFile(null); // Reset file if already selected
              } else {
                handleFileSelect(setClockOutFile);
              }
            }}>
            <Text>
              {clockOutFile
                ? 'Remove Clock Out Image'
                : 'Select Clock Out Image'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.rejectButton}
            onPress={() => {
              clockOut(item, clockOutFile);
            }}>
            <Text style={styles.buttonText}>CLOCK OUT</Text>
          </TouchableOpacity>
        </>
      )}
    </View>
  );
};

const TimeRecords = ({navigation}) => {
  const [data, setData] = useState([]);
  const [totalTimeSpent, setTotalTimeSpent] = useState(0); // State to store total time spent

  useFocusEffect(
    useCallback(() => {
      const fetchBreakRequest = () => {
        const uid = auth().currentUser?.uid;
        try {
          const ref = firebase
            .app()
            .database(database_path)
            .ref('time_records')
            .orderByChild('uid')
            .equalTo(uid);

          // Set up the listener for real-time updates
          ref.on('value', snapshot => {
            if (snapshot.exists()) {
              const breakRequests = snapshot.val();

              // Separate records into two categories
              const allBreakRequests = Object.values(breakRequests).sort(
                (a, b) =>
                  new Date(b.clock_in_date_time || 0) -
                  new Date(a.clock_in_date_time || 0),
              ); // Sort by clock_in_date_time (use 0 for missing values)

              const validBreakRequests = allBreakRequests.filter(
                record =>
                  record.clock_in_date_time && record.clock_out_date_time, // Ensure both fields exist
              );

              // Set the data for all records (including incomplete ones)
              setData(allBreakRequests);

              // Calculate total time spent for valid records only
              calculateTotalTimeSpent(validBreakRequests);
            } else {
              console.log('No time records found.');
              setData([]); // Clear data if no records found
              setTotalTimeSpent(0); // Reset total time spent
            }
          });

          // Return cleanup function to remove the listener
          return () => ref.off();
        } catch (error) {
          console.error('Error fetching data:', error);
        }
      };

      fetchBreakRequest();
    }, []),
  );

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

  const generateCSV = () => {
    // Assuming data is passed as a prop or already available
    try {
      // Process the data into CSV format
      const csvData = data.map(item => ({
        Fullname: item?.user?.fullname,
        Facility: item?.facility_name,
        Area: item?.area,
        ClockInTime: moment(item?.clock_in_date_time).format(
          'h:mm A, Do MMMM YYYY',
        ),
        ClockOutTime: item?.clock_out_date_time
          ? moment(item?.clock_out_date_time).format('h:mm A, Do MMMM YYYY')
          : 'No Clock Out',
        TotalTimeSpent: item?.clock_out_date_time
          ? moment(item?.clock_out_date_time).diff(
              moment(item?.clock_in_date_time),
              'minutes',
            ) + ' minutes'
          : 'N/A',
      }));

      // Convert the data to CSV format using PapaParse
      const csv = Papa.unparse(csvData);

      // Define the file path where the CSV will be saved
      const path = RNFS.DownloadDirectoryPath + '/time_records.csv'; // Adjust the path if needed

      // Write the CSV data to a file
      RNFS.writeFile(path, csv, 'utf8')
        .then(() => {
          console.log('CSV file saved at:', path);
          showAlert('CSV Generated and saved!', 'success');
        })
        .catch(err => {
          console.log('Error writing CSV file:', err);
        });
    } catch (error) {
      console.error('Error generating CSV:', error);
    }
  };

  const uploadFile = async (file, path) => {
    if (!file) return null;

    const storageRef = storage().ref(path);
    await storageRef.putFile(file.uri);
    return await storageRef.getDownloadURL();
  };

  const handleClockOut = async (item, isClockOutFile = null) => {
    try {
      const clockOutPath = `time_records/${
        auth().currentUser.uid
      }/clock_out_${Date.now()}`;

      const clockOutUrl = await uploadFile(isClockOutFile, clockOutPath);

      const recordRef = firebase
        .app()
        .database(database_path)
        .ref(`time_records/${item?.id}`);
      await recordRef.update({
        clock_out_date_time: moment().format('YYYY-MM-DD HH:mm:ss'),
        clock_out_image_src: clockOutUrl || null,
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

      <ScrollView style={styles.notificationsList}>
        {data.length <= 0 ? (
          <View style={styles.MainView}>
            <Text style={[styles.SigninText, {textAlign: 'center'}]}>
              No record found!
            </Text>
          </View>
        ) : (
          data.map((item, index) => (
            <NotificationItem
              key={index}
              clockOut={handleClockOut}
              item={item}
            />
          ))
        )}
        {totalTimeSpent == 0 ? null : (
          <Text style={styles.totalTime}>
            Total Time Spent: {Math.floor(totalTimeSpent / 3600)}h{' '}
            {Math.floor((totalTimeSpent % 3600) / 60)}m
          </Text>
        )}
      </ScrollView>
      {/* Add a button to download the PDF, only if there is data */}
      {data.length > 0 && (
        <TouchableOpacity style={styles.downloadButton} onPress={generateCSV}>
          <Text style={styles.buttonText}>Download CSV</Text>
        </TouchableOpacity>
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
  downloadButton: {
    marginVertical: 5,
    padding: 10,
    backgroundColor: '#28A745', // Green background for image buttons
    borderRadius: 5,
    alignItems: 'center',
  },
  fileButton: {
    width: wp('80%'),
    marginBottom: 10,
    padding: 10,
    backgroundColor: '#ccc',
    borderRadius: 5,
    alignItems: 'center',
  },
  fileButtonSelected: {
    backgroundColor: '#d9534f', // Change to a red color to indicate "remove"
    paddingHorizontal: 20, // Make the button wider
  },
});

export default TimeRecords;
