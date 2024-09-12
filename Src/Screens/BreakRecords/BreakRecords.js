import React, { useState } from 'react';
import { View, Text, Button, FlatList, StyleSheet,TouchableOpacity } from 'react-native';
import { red } from 'react-native-reanimated/lib/typescript/Colors';

const BreakRecords = () => {
  const [records, setRecords] = useState([
    // Sample data, replace with your actual data
    { teamName: 'Team Name 1', requestStatus: 'Approved', date: '01-01-2024',time:'01:40 -02:30pm' },
    { teamName: 'Team Name 2', requestStatus: 'Rejected', date: '02-01-2024',time:'01:40 -02:30pm' },
    // ...
  ]);

  const renderRecord = ({ item }) => (
    <View style={styles.recordContainer}>
      <Text style={styles.teamName}>{item.teamName}</Text>
      <Text style={styles.requestStatus}>{item.requestStatus}</Text>
      <View style={{flexDirection:'column'}}>
      <Text style={styles.date}>{item.date}</Text>
      <Text style={{color:"red"}}>{item.time}</Text>
      </View>
      <TouchableOpacity style={{width:'20%',height:40,backgroundColor:'#FD932F',justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:'white',fontSize:20}}>Delete</Text>
        </TouchableOpacity>
      {/* <Button title="Delete" onPress={() => handleDeleteRecord(item)} /> */}
    </View>
  );

  const handleDeleteRecord = (record) => {
    // Handle deleting the record (e.g., remove from list, update database)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Break Records</Text>
      <Text style={styles.description}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse tempus leo nec consectetur.</Text>
      <FlatList
        data={records}
        renderItem={renderRecord}
        keyExtractor={(item) => item.id}
      />
      <View style={styles.bottomNav}>
        {/* Bottom navigation buttons */}
      </View>
    </View>
  );

};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff', // White background
    padding:4
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#007766', // Primary green color
    marginBottom: 10,
  },
  description: {
    color: '#333', // Dark gray text
    marginBottom: 20,
  },
  recordContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderColor: '#ccc', // Light gray border
  },
  teamName: {
    fontWeight: 'bold',
  },
  requestStatus: {
    color: '#007766', // Primary green color for approved, red for rejected
  },
  date: {
    color: '#666', // Light gray text
  },
  deleteButton: {
    backgroundColor: '#007766', // Primary green button
    padding: 10,
    borderRadius: 5,
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    padding: 10,
  },
});
export default BreakRecords;
