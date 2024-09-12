import React from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, StyleSheet } from 'react-native';

const Profile= () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        <Image
          style={styles.profileImage}
          source={require('../Home/assets/userprofile.png')}
        />
        {/* <TouchableOpacity style={styles.editIconContainer}>
          <Text style={styles.editIconText}>+</Text>
        </TouchableOpacity> */}
      </View>
      <Text style={styles.profileTitle}>Profile</Text>
      <TextInput style={styles.input} placeholder="Mario Foster" />
      <TextInput style={styles.input} placeholder="marioft@gmail.com" />
      <TextInput style={styles.input} placeholder="Department" />
      <TextInput style={styles.input} placeholder="mario23%$" secureTextEntry />
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.saveButtonText}>Save Change</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems:'center'
  },
  logoutButton: {
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor:'#FD932F'
    // borderRadius: 4,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileContainer: {
    alignItems: 'center',
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 50,
  },
  editIconContainer: {
    position: 'absolute',
    bottom: 0,
    right: 10,
    backgroundColor:'#FD932F',
    borderRadius: 50,
    padding: 4,
  },
  editIconText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  profileTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color:"#116363",
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    // borderRadius: 4,
    paddingHorizontal: 10,
    marginVertical: 8,
     width:'80%',
    height:'8%'
  },
  saveButton: {
    backgroundColor:'#FD932F',
     padding: 15,
    // borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
    width:'60%',
    // height:'8%'
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize:22
  },
});

export default Profile;
