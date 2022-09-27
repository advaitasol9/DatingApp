import React, {useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Animated,
  TouchableOpacity,
  ActivityIndicator,
  BackHandler,
} from 'react-native';
import {Button} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import size, {moderateScale, scale, verticalScale} from '../../configs/size';
import {tStyle} from '../../configs/textStyles';
import Modal from 'react-native-modal';
import EnterNumber from './Login';
import * as Animatable from 'react-native-animatable';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useDispatch, useSelector} from 'react-redux';
import {updateUserData, fetchAvatars} from '../../store/actions/userAction';
import {useFocusEffect} from '@react-navigation/native';

const Onboarding = ({navigation}) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [loginModalVisible, setLoginModalVisible] = useState(false);
  const [verified, setVerified] = useState(null);
  const screenMarginTop = useState(new Animated.Value(verticalScale(640)))[0];

  const dispatch = useDispatch();

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener(
        'hardwareBackPress',
        () => BackHandler.exitApp(),
      );

      return () => backHandler.remove();
    }, []),
  );

  useEffect(() => {
    dispatch(fetchAvatars());
    Animated.timing(screenMarginTop, {
      toValue: verticalScale(0),
      duration: 700,
      useNativeDriver: true,
    }).start();
  }, []);

  const onPress = () => {
    setModalVisible(true);
  };

  useFocusEffect(
    useCallback(() => {
      setTimeout(() => {
        // AsyncStorage.getItem('verified')
        //   .then(val => setVerified(val))
        //   .catch(err => console.log('err', err));
        AsyncStorage.getItem('token')
          .then(token => {
            if (token) {
              console.log('tokennn', token);
              setLoginModalVisible(true);
              try {
                dispatch(updateUserData(token, false));
              } catch (err) {
                console.log('err', err);
                setLoginModalVisible(false);
              }
            } else return;
          })
          .catch(err => {
            setLoginModalVisible(false);
            console.log('err', err);
          });
      }, 500);
    }, []),
  );

  const userData = useSelector(state => state.user.data);

  useFocusEffect(
    useCallback(() => {
      console.log('GETTING VERIFIED');
      AsyncStorage.getItem('verified')
        .then(val => setVerified(val))
        .catch(err => console.log('err', err));
    }, [userData]),
  );

  useFocusEffect(
    useCallback(() => {
      if (
        !userData ||
        Object.keys(userData).length === 0 ||
        verified === null
      ) {
        console.log('verified', verified);
        return;
      }
      if (userData?.userAnswers && userData.userAnswers.length > 0) {
        console.log('async', verified, userData);
        if (verified == 'yes') navigation.replace('tabs', {screen: 'Home'});
        else
          navigation.replace('main', {
            screen: 'Questionnaire',
            params: {showOtpModal: true},
          });
      } else navigation.replace('main', {screen: 'Questionnaire'});
    }, [userData, verified]),
  );

  return (
    <SafeAreaView style={styles.container}>
      <Animatable.View
        style={{flex: 1, position: 'relative'}}
        animation={'slideInUp'}
        duration={700}>
        <View style={styles.imgContainer}>
          <Image
            source={require('../../assets/images/main.png')}
            height={verticalScale(252)}
            width={scale(210.35)}
            resizeMode="contain"
            style={{height: verticalScale(252), width: scale(210.35)}}
          />
          <Image
            source={require('../../assets/images/chances.gif')}
            height={verticalScale(81)}
            width={scale(178)}
            resizeMode="contain"
            style={styles.gifAni}
          />
        </View>
        <Text style={styles.text1}>The personality first connecting app</Text>
        <Text style={styles.text2}>
          If you were a fruit, then you’d be a fine-apple
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginTop: verticalScale(16),
          }}>
          <Text style={styles.text3}>Already a user? Try</Text>
          <TouchableOpacity onPress={onPress}>
            <Text style={styles.text4}>Signing In</Text>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: verticalScale(24),
            alignSelf: 'center',
          }}
          onPress={() => {
            navigation.navigate('main');
          }}>
          <Image
            source={require('../../assets/images/arrowRight.png')}
            style={{height: verticalScale(40), width: verticalScale(40)}}
          />
        </TouchableOpacity>
        {/* <View style={styles.row}>
          <Button
            title={'Login'}
            containerStyle={styles.btn}
            onPress={onPress}
            buttonStyle={{backgroundColor: '#87B2E5'}}
            titleStyle={styles.btnTitle1}
          />
          <Button
            title={'Sign Up'}
            containerStyle={styles.btn}
            type="outline"
            onPress={onPress}
            buttonStyle={{borderColor: '#87B2E5'}}
            titleStyle={styles.btnTitle2}
          />
        </View> */}
        <Modal
          isVisible={modalVisible}
          onBackButtonPress={() => setModalVisible(false)}
          transparent
          style={{
            margin: 0,
            justifyContent: 'flex-end',
          }}>
          <EnterNumber
            navigate={() => {
              // navigation.replace('tabs', {screen: 'Home'});
            }}
            closeModal={() => setModalVisible(false)}
            navigation={navigation}
            fullSize={false}
          />
        </Modal>
        <Modal
          isVisible={loginModalVisible}
          onBackButtonPress={() => setLoginModalVisible(false)}>
          {loginModalVisible && <ActivityIndicator size="large" />}
        </Modal>
      </Animatable.View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imgContainer: {
    width: '100%',
    height: verticalScale(297),
    backgroundColor: '#EEF9FD',
    borderBottomLeftRadius: moderateScale(25),
    borderBottomRightRadius: moderateScale(25),
    justifyContent: 'center',
    alignItems: 'center',
  },
  text1: {
    ...tStyle('Halant-Medium', '600', 'normal', 40, 50, '#24232C'),
    marginLeft: scale(35),
    marginTop: verticalScale(30),
  },
  text2: {
    ...tStyle('Manrope-Regular', '400', 'normal', 14, 19.6, '#24232C'),
    marginHorizontal: scale(35),
    // marginTop: verticalScale(16),
  },
  row: {
    flexDirection: 'row',
    marginHorizontal: scale(30),
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: verticalScale(66),
  },
  btn: {
    height: verticalScale(55),
    width: scale(142),
    borderRadius: moderateScale(8),
  },
  btnTitle1: tStyle('Manrope-Regular', '700', 'normal', 16, 21.86, '#FFFFFF'),
  btnTitle2: tStyle('Manrope-Regular', '700', 'normal', 16, 21.86, '#87B2E5'),
  text3: {
    ...tStyle('Manrope-Regular', '400', 'normal', 14, 19.6, '#24232C'),
    marginLeft: scale(35),
  },
  text4: {
    ...tStyle('Manrope-Bold', 'bold', 'normal', 14, 19.6, '#3e6173'),
    marginLeft: scale(3),
  },
  gifAni: {
    height: verticalScale(81),
    width: scale(178),
    position: 'absolute',
    bottom: verticalScale(23),
  },
});

export default Onboarding;
