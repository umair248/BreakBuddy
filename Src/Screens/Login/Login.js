import { SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import {
    widthPercentageToDP as wp,
    heightPercentageToDP as hp,
  } from 'react-native-responsive-screen';

const Login = (props) => {
  return (
    <SafeAreaView style={styles.BgView}>
        
    <View style={styles.MainView}>
      <Text style={styles.SigninText}>Sign In Now</Text>

    <View style={styles.ViewTextinp1} >
      <TextInput placeholder='User Name' style={styles.Textinp1}></TextInput>
    </View>
    <View style={styles.ViewTextinp2} >
      <TextInput placeholder='Password' style={styles.Textinp2}></TextInput>
    </View>
    <View style={{paddingTop:10,}}>
    <TouchableOpacity onPress={()=>{props.navigation.navigate('Signup')}}>
      <Text style={{color:'blue'}}>Don't have account?</Text>
    </TouchableOpacity>
    </View>
    <View style={styles.Viewbtn} >
      <TouchableOpacity onPress={()=>{props.navigation.navigate('Home')}} style={styles.btnsignup}>
        <Text style={{color:'white',fontWeight:'800',fontSize:20}}>Submit</Text>
      </TouchableOpacity>
    </View>
    </View>
    
    </SafeAreaView>
  )
}

export default Login

const styles = StyleSheet.create({
    BgView:{
        flex:1,
        backgroundColor:'white'
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
    },
    Viewbtn:{
      width:wp('80%'),
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