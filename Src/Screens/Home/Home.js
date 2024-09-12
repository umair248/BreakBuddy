import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View,Image } from 'react-native'
import React from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';


const Home = () => {
  return (
    <SafeAreaView style={{flex:1, backgroundColor:'white'}}>
    <View style={styles.profileviewStyleview}>
        <View>
            <Image style={{width:wp('20%'),height:hp('10%')}} source={require('../Home/assets/userprofile.png')}></Image>
        </View>
        <View>
      <Text style={styles.SigninText}>User Name</Text>
      </View>
    </View>
    <View style={styles.MainView}>
          <Text style={styles.SigninText}>Wanna Send Request?</Text>
    
        <View style={styles.ViewTextinp1} >
          <TextInput placeholder='Enter Break Duration' style={styles.Textinp1}></TextInput>
        </View>
        <View style={styles.ViewTextinp2} >
          <TextInput placeholder='Enter Team Name' style={styles.Textinp2}></TextInput>
        </View>
        <View style={styles.ViewTextinp2} >
          <TextInput placeholder='Enter Break Area' style={styles.Textinp2}></TextInput>
        </View>
        <View style={styles.ViewTextinp2} >
          <TextInput placeholder='Add notes' style={styles.Textinp3}></TextInput>
        </View>
        <View style={styles.Viewbtn} >
          <TouchableOpacity onPress={()=>{props.navigation.navigate('Home')}} style={styles.btnsignup}>
            <Text style={{color:'white',fontWeight:'800',fontSize:20}}>Send Request</Text>
          </TouchableOpacity>
        </View>
        </View>
    </SafeAreaView>
  )
}

export default Home

const styles = StyleSheet.create({
    profileviewStyleview:{
        // width:wp('50%'),
        // backgroundColor:'grey',
        // justifyContent:'center',
        alignItems:'center',
        flexDirection:'row',
        padding:10

    },
    MainView:{
        flex:1,
        justifyContent:'center',
        alignItems:'center',

    },
    SigninText:{
        fontSize:hp('3%'),
        color:"#116363",
        fontStyle:'italic',
        fontWeight:'800'
    },
    ViewTextinp1:{
      width:wp('80%'),
      paddingVertical:hp("2%"),
    },
    Textinp1:{
      borderColor:'black',
      borderWidth:1
    }, 
    Textinp2:{
      borderColor:'black',
      borderWidth:1
    },
     ViewTextinp2:{
      width:wp('80%'),
      paddingVertical:hp("2%"),

    },
    Textinp3:{
        borderColor:'black',
        borderWidth:1,
        height:hp('10%')
      },
    Viewbtn:{
      width:wp('40%'),
paddingVertical:hp('2%')
    },
    btnsignup:{
      // width:wp('100%'),
      height:('25%'),
      justifyContent:'center',
      alignItems:'center',
      backgroundColor:'#FD932F'

    }
})