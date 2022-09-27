import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Icon} from 'react-native-elements';

import {verticalScale, scale} from '../../../../configs/size';
import {tStyle} from '../../../../configs/textStyles';
import {useSelector, useDispatch} from 'react-redux';
import PreferenceModal from './PreferenceModal';
import {updateUserProfile, logout} from '../../../../store/actions/userAction';
import messaging from '@react-native-firebase/messaging';
import {apiUrl} from '../../../../configs/constants';

const AnonProfile = ({navigation}) => {
  const [location, setLocation] = useState('');
  const [interestedIn, setInterestedIn] = useState('');
  const [showModal, setShowModal] = useState(false);

  const avatarArray = useSelector(state => state.user.avatarArray);
  const me = useSelector(state => state.user.data);
  const token = useSelector(state => state.user.token);
  const {username, avatar, city, gender, lookingFor} = me;
  console.log('profile ', me?.userIdentities);

  const dispatch = useDispatch();

  const updateProfile = async () => {
    console.log('updating');
    const body = {
      username,
      avatar,
      city: location,
      gender,
      lookingFor: interestedIn,
    };
    console.log('body', body, token);
    try {
      await dispatch(updateUserProfile(body, token));
    } catch (err) {
      console.log('err', err);
    }
  };

  useEffect(() => {
    setLocation(city);
    setInterestedIn(lookingFor);
  }, [me]);

  const updateFcmToken = async () => {
    try {
      await messaging().deleteToken();
      const res = await fetch(`${apiUrl}/user/me/save-device-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fcmtoken: '',
        }),
      });
      console.log('result of storing fcm token', res);
    } catch (error) {
      console.log('error while storing fcm token', error);
    }
  };

  const logoutHandler = async () => {
    try {
      await updateFcmToken();
      await dispatch(logout());
      navigation.navigate('onboarding');
    } catch (err) {
      console.log('err', err);
    }
  };

  return Object.keys(me).length && avatarArray.length > 0 ? (
    <View style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.imgWrapper}>
          <Image
            source={{uri: avatarArray[avatar]?.image}}
            resizeMode="contain"
            style={{height: scale(81), width: scale(97)}}
          />
        </View>
        <View style={{marginLeft: scale(20)}}>
          <Text style={styles.text1}>{username}</Text>
          <View
            style={{
              flexDirection: 'row',
              marginTop: scale(-6),
              alignItems: 'center',
            }}>
            <Icon
              type="ionicon"
              name="location"
              color="#000000"
              size={verticalScale(12)}
            />
            <Text style={styles.text2}>{location}</Text>
          </View>
          <TouchableOpacity
            style={styles.updateBtn}
            onPress={() => {
              navigation.navigate('Revealed');
            }}>
            <Text style={styles.text3}>Update Details</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.btmContainer}>
        <TouchableOpacity
          style={styles.btn}
          activeOpacity={1}
          onPress={() => setShowModal(true)}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Image
              source={require('../../../../assets/images/homeFilter.png')}
              resizeMode="contain"
              style={{width: scale(17.5), height: verticalScale(16.8)}}
            />
            <Text style={styles.text4}>Preferences</Text>
          </View>
          <Image
            source={require('../../../../assets/images/arrowBlack.png')}
            resizeMode="contain"
            style={{width: scale(8), height: verticalScale(16)}}
          />
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            navigation.navigate('MyCard');
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              type="ionicon"
              name="laptop-outline"
              size={scale(17.5)}
              color="#333333"
            />
            <Text style={styles.text4}>My card</Text>
          </View>
          <Image
            source={require('../../../../assets/images/arrowBlack.png')}
            resizeMode="contain"
            style={{width: scale(13), height: verticalScale(15)}}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={logoutHandler}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon
              type="ionicon"
              name="log-out-outline"
              size={scale(20)}
              color="#333333"
            />
            <Text style={styles.text4}>Logout</Text>
          </View>
          <Image
            source={require('../../../../assets/images/arrowBlack.png')}
            resizeMode="contain"
            style={{width: scale(8), height: verticalScale(16)}}
          />
        </TouchableOpacity>
      </View>
      <View style={styles.footer}>
        <Text style={styles.text5}>Copyright © Chance</Text>
        <Text style={styles.text5}>Version 1.0.1</Text>
      </View>
      <PreferenceModal
        showModal={showModal}
        setShowModal={() => setShowModal(false)}
        interestedIn={interestedIn}
        setInterstedIn={setInterestedIn}
        location={location}
        setLocation={setLocation}
        updateProfile={updateProfile}
      />
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topContainer: {
    flexDirection: 'row',
    paddingBottom: verticalScale(20),
    backgroundColor: '#EEF9FD',
    alignItems: 'center',
  },
  imgWrapper: {
    height: scale(107),
    width: scale(107),
    borderRadius: scale(107),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(47),
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  text1: {
    ...tStyle('Halant-SemiBold', '600', 'normal', 26, 34, '#000000'),
  },
  text2: {
    ...tStyle('Manrope-Regular', '500', 'normal', 14, 17.5, '#181636CC'),
    marginLeft: scale(4),
  },
  updateBtn: {
    marginTop: verticalScale(8),
    width: scale(88),
    height: verticalScale(24),
    borderRadius: scale(17),
    backgroundColor: '#87B2E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text3: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 10, 13.66, '#FFFFFF'),
  },
  btmContainer: {
    marginHorizontal: scale(20),
    paddingTop: verticalScale(16),
  },
  btn: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#38383810',
    paddingVertical: verticalScale(20),
    paddingLeft: scale(7),
    paddingRight: scale(16),
  },
  text4: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 18, 25.2, '#333333'),
    marginLeft: scale(14),
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: scale(25),
    marginTop: verticalScale(24),
  },
  text5: {
    ...tStyle('Manrope-Regular', '400', 'normal', 10, 14, '#646161'),
  },
});

export default AnonProfile;
