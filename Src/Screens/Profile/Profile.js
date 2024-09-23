import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../../services/redux/hooks';
import {useHandleInputs} from '../../hooks/use-handle-input';
import InputField from '../../components/common/input-field';
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from 'react-native-responsive-screen';
import auth from '@react-native-firebase/auth';
import {showAlert} from '../../lib/helpers';
import {firebase} from '@react-native-firebase/database';
import {database_path} from '../../services/apiPath';
import {userUpdate} from '../../services/redux/slices/user-slice';

const Profile = () => {
  const currentUser = auth().currentUser;
  const user = useAppSelector(state => state.user.user);
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [inputs, handleInputs, setInputs, errors, handleError] =
    useHandleInputs({
      fullname: user?.fullname || '',
      email: user?.email || '',
      department: user?.department || '',
    });

  useEffect(() => {
    setInputs({
      fullname: user?.fullname || '',
      email: user?.email || '',
      department: user?.department || '',
    });
  }, [user]);

  const validate = () => {
    setLoading(true);
    let isValid = true;

    if (!inputs.fullname) {
      handleError('Fullname field required!', 'fullname');
      isValid = false;
    }

    if (!inputs.email) {
      handleError('Email field required!', 'email');
      isValid = false;
    }

    if (!inputs.department) {
      handleError('Department field required!', 'department');
      isValid = false;
    }

    if (isValid) {
      handleSubmit();
    } else {
      setLoading(false);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await firebase
        .app()
        .database(database_path)
        .ref(`users/${user?.uid}`)
        .update({
          fullname: inputs.fullname,
          email: inputs.email,
          department: inputs.department,
        });

      showAlert('Record Updated!');

      dispatch(
        userUpdate({
          fullname: inputs.fullname,
          email: inputs.email,
          department: inputs.department,
        }),
      );
    } catch (error) {
      console.log('ERROR');
      console.log(error);
      if (error.code === 'auth/email-already-in-use') {
        showAlert('This email address already in use!', 'danger'); // Show error message
      }
      if (error.code === 'auth/invalid-email') {
        showAlert('That email address is invalid!', 'danger'); // Show error message
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.logoutButton}>
        <Text style={styles.logoutText}>Log out</Text>
      </TouchableOpacity>
      <View style={styles.profileContainer}>
        {/* <Image
          style={styles.profileImage}
          source={require('../Home/assets/userprofile.png')}
        /> */}
        {/* <TouchableOpacity style={styles.editIconContainer}>
          <Text style={styles.editIconText}>+</Text>
        </TouchableOpacity> */}
      </View>
      <Text style={styles.profileTitle}>Profile</Text>
      <View style={styles.ViewTextinp}>
        <InputField
          placeholder="Enter your fullname"
          onChange={e => {
            setInputs({fullname: e});
          }}
          onFocus={() => handleError(null, 'fullname')}
          error={errors.fullname}
          value={inputs?.fullname || ''}
        />
      </View>
      <View style={styles.ViewTextinp}>
        <InputField
          placeholder="Enter your email"
          onChange={e => {
            setInputs({email: e});
          }}
          onFocus={() => handleError(null, 'email')}
          error={errors.email}
          value={inputs?.email || ''}
        />
      </View>
      <View style={styles.ViewTextinp}>
        <InputField
          placeholder="Enter your department"
          onChange={e => {
            setInputs({department: e});
          }}
          onFocus={() => handleError(null, 'department')}
          error={errors.department}
          value={inputs?.department || ''}
        />
      </View>
      {/* <Text style={styles.profileTitle}>Profile</Text>
      <TextInput style={styles.input} placeholder="Mario Foster" />
      <TextInput style={styles.input} placeholder="marioft@gmail.com" />
      <TextInput style={styles.input} placeholder="Department" />
      <TextInput style={styles.input} placeholder="mario23%$" secureTextEntry /> */}
      <TouchableOpacity
        disabled={loading}
        onPress={validate}
        style={styles.saveButton}>
        <Text style={styles.saveButtonText}>
          {loading ? 'Loading...' : 'Save Changes'}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  ViewTextinp: {
    width: wp('80%'),
    paddingVertical: hp('2%'),
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  logoutButton: {
    alignSelf: 'flex-end',
    padding: 8,
    backgroundColor: '#FD932F',
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
    backgroundColor: '#FD932F',
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
    color: '#116363',
  },
  input: {
    height: 40,
    borderColor: '#ddd',
    borderWidth: 1,
    // borderRadius: 4,
    paddingHorizontal: 10,
    marginVertical: 8,
    width: '80%',
    height: '8%',
  },
  saveButton: {
    backgroundColor: '#FD932F',
    padding: 15,
    // borderRadius: 4,
    alignItems: 'center',
    marginTop: 20,
    width: '60%',
    // height:'8%'
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 22,
  },
});

export default Profile;
