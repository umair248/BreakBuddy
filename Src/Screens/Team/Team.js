import React, { useState } from 'react';
import { View, Text, TextInput, Button, Image, FlatList,StyleSheet, TouchableOpacity } from 'react-native';

const Team = () => {
  const [teamMembers, setTeamMembers] = useState([
    { name: 'Name 1', image: require('../Home/assets/userprofile.png') },
    { name: 'Name 2', image: require('../Home/assets/userprofile.png') },
    // ...
  ]);

  const renderTeamMember = ({ item }) => (
    <View style={styles.teamMemberContainer}>
      <Image source={item.image} style={styles.teamMemberImage} />
      <Text style={styles.teamMemberName}>{item.name}</Text>
      <TouchableOpacity style={{width:50,height:40,backgroundColor:'#FD932F',justifyContent:'center',alignItems:'center'}}>
        <Text style={{color:'white',fontSize:20}}>Add</Text>
        </TouchableOpacity>
      {/* <Button  title="Add" onPress={() => handleAddMember(item)} /> */}
    </View>
  );

  const handleAddMember = (member) => {
    // Handle adding member to the team (e.g., navigation, API call)
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Team Members</Text>
      <TextInput
        style={styles.searchInput}
        placeholder="Search members"
        onChangeText={(text) => handleSearch(text)} // Implement search logic
      />
      <FlatList
        data={teamMembers}
        renderItem={renderTeamMember}
        keyExtractor={(item) => item.id} // Assuming each member has a unique id
      />
      <View style={{alignItems:'center'}}>
      <TouchableOpacity style={{width:'80%',height:50, alignItems:'center',justifyContent:'center',backgroundColor:'#FD932F'}}>
        <Text style={{color:'white',fontSize:20}}>My Team</Text>
        </TouchableOpacity>
      </View>
      </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    color:"#116363",
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
    flex:   
 1,
  },
});
export default Team;
