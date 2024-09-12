import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

const NotificationItem = ({ time, teamName, onApprove, onReject }) => {
  return (
    <View style={styles.notificationContainer}>
      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>{time}</Text>
      </View>
      <Text style={styles.teamNameText}>{teamName}</Text>
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.approveButton} onPress={onApprove}>
          <Text style={styles.buttonText}>Approve</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.rejectButton} onPress={onReject}>
          <Text style={styles.buttonText}>Reject</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const Notification = () => {
  const notificationsData = [
    { time: '01:30 - 02:15 pm', teamName: 'Team Name' },
    // ... other notifications
  ];

  const handleApprove = (notification) => {
    // Handle approval logic
  };

  const handleReject = (notification) => {
    // Handle rejection logic
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications</Text>
      <View style={styles.notificationsList}>
        {notificationsData.map((notification, index) => (
          <NotificationItem
            key={index}
            time={notification.time}
            teamName={notification.teamName}
            onApprove={() => handleApprove(notification)}
            onReject={() => handleReject(notification)}
          />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
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
    shadowOffset: { width: 0, height: 2 },
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
    justifyContent: 'space-between',
  },
  approveButton: {
    backgroundColor: '#4CAF50', // Green
    padding: 10,
    borderRadius: 4,
  },
  rejectButton: {
    backgroundColor: '#FF5722', // Red
    padding: 10,
    borderRadius: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Notification;
