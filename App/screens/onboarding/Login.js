import OTPInputView from '@twotalltotems/react-native-otp-input';
import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  Text,
  Platform,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {Input, Button, Icon} from 'react-native-elements';
import {moderateScale, scale, verticalScale} from '../../configs/size';
import messaging from '@react-native-firebase/messaging';
import {tStyle} from '../../configs/textStyles';
import {useSelector, useDispatch} from 'react-redux';
import {
  updateUserData,
  fetchAvatars,
  logout,
} from '../../store/actions/userAction';
import {getUniqueId} from 'react-native-device-info';
import {apiUrl} from '../../configs/constants';

const inputTypes = {
  otp: 'OTP',
  phone: 'Phone',
};

const Dash = ({hasError}) => (
  <View style={[styles.dash, hasError && {borderColor: '#EB5757'}]} />
);

const EnterNumber = props => {
  const [num, setNum] = useState();
  const [uid, setUid] = useState();
  const [otp, setOtp] = useState();
  const [error, setError] = useState(false);
  const [inputType, setinputType] = useState(inputTypes.phone);

  const token = useSelector(state => state.user.token);
  const deviceId = getUniqueId();
  const dispatch = useDispatch();

  console.log('tokenn', token);

  const getOtp = async () => {
    if (!num || num.length < 10) return;
    try {
      var res;
      if (token) {
        res = await fetch(`${apiUrl}/app/send-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            countryCode: '91',
            phone: num,
          }),
        });
      } else {
        res = await fetch(`${apiUrl}/user/login/phone/otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            countryCode: '91',
            phone: num,
          }),
        });
      }
      const data = await res.json();
      if (data?.error?.name == 'ConflictError') {
        Alert.alert(
          'Alert',
          'This mobile number is already registered. Try logging in.',
          [
            {
              text: 'OK',
            },
          ],
        );
        return;
      } else if (data?.error?.name == 'UnauthorizedError') {
        alert('This mobile number is not registered! Please sign-up first.');
        return;
      }

      setUid(data?.uid);
      setinputType(inputTypes.otp);
    } catch (err) {
      const error = JSON.parse(err);
      console.log('error', error.message);
    }
  };

  const verityOtp = async () => {
    if (!otp || otp.length < 4) return;
    try {
      let userToken = '';
      if (!token) {
        const res = await fetch(`${apiUrl}/user/login/phone`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            countryCode: '91',
            phone: num,
            uid: uid,
            otp: otp,
          }),
        });
        const data = await res.json();
        userToken = data.token;
        await dispatch(updateUserData(data.token, true));
        await dispatch(fetchAvatars());
      } else {
        userToken = token;
        const res = await fetch(`${apiUrl}/app/verify-otp`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            countryCode: '91',
            phone: num,
            uid: uid,
            otp: otp,
            deviceId: deviceId,
            deviceType: Platform.OS,
          }),
        });
        console.log('body', res);
        await dispatch(updateUserData(token, true));
      }
      updateFcmToken(userToken);
      props.closeModal();
      props.navigate();
    } catch (err) {
      console.log('err', err);
    }
  };

  const updateFcmToken = async token => {
    try {
      const fcmtoken = await messaging().getToken();
      const res = await fetch(`${apiUrl}/user/me/save-device-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fcmtoken: fcmtoken,
        }),
      });
      console.log('result of storing fcm token', res);
    } catch (error) {
      console.log('error while storing fcm token', error);
    }
  };

  // return false ? (
  return (
    <View style={[{flex: 1}, props.fullSize && {backgroundColor: '#ffffff'}]}>
      {props.fullSize && (
        <View style={styles.backBtn}>
          <TouchableOpacity onPress={props?.closeModal}>
            <Icon type="ionicon" name="chevron-back-outline" color="#4f4f4f" />
          </TouchableOpacity>
          <Text style={styles.text1}>
            {inputType == inputTypes.phone && !props?.number
              ? ''
              : 'Verification'}
          </Text>
        </View>
      )}
      {!props.fullSize && (
        <TouchableOpacity
          onPress={props?.closeModal}
          style={{flex: 1, opacity: 1}}
          activeOpacity={0}
        />
      )}
      {inputType == inputTypes.phone && !props?.number ? (
        <View
          style={[
            styles.container,
            !props.fullSize && {
              flex: 0,
              height: verticalScale(215),
              borderTopLeftRadius: moderateScale(15),
              borderTopRightRadius: moderateScale(15),
              position: 'absolute',
              bottom: 0,
              paddingBottom: 0,
            },
          ]}>
          <Input
            value={num}
            maxLength={10}
            onChangeText={setNum}
            label={props.fullSize ? 'Verify phone number' : 'Enter Your Number'}
            keyboardType={'number-pad'}
            labelStyle={[
              styles.label,
              !props.fullSize && {marginTop: verticalScale(24)},
            ]}
            inputStyle={[
              styles.input,
              {
                color: error ? '#EB5757' : '#333333',
              },
            ]}
            inputContainerStyle={[
              {
                borderBottomWidth: 0,
              },
            ]}
            errorStyle={styles.inpError}
            containerStyle={styles.inputCont}
          />
          <View style={styles.dashCont}>
            {Array.from('x'.repeat(10)).map(() => (
              <Dash hasError={error} />
            ))}
          </View>
          {error && <Text style={styles.error}>Account does not exist!</Text>}
          {props.fullSize ? (
            <Text style={styles.subtitle}>
              Help us to keep the creeps off the app and ensure a safe space for
              everyone.
            </Text>
          ) : null}

          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <TouchableOpacity style={styles.btnCont} onPress={getOtp}>
              <Text style={styles.btnTitle}>Next</Text>
            </TouchableOpacity>
            {/* <Text style={styles.text2}>By continuing, you agree to our</Text>
            <Text style={styles.text2}>terms and conditions.</Text> */}
          </View>
        </View>
      ) : (
        <View
          style={[
            styles.otpContainer,
            !props.fullSize && {
              flex: 0,
              height: verticalScale(304),
              borderTopLeftRadius: moderateScale(15),
              borderTopRightRadius: moderateScale(15),
              position: 'absolute',
              bottom: 0,
              paddingBottom: verticalScale(15),
            },
          ]}>
          <Text
            style={[
              styles.label,
              {
                marginLeft: scale(24),
                alignSelf: 'flex-start',
              },
              !props.fullSize && {
                marginTop: verticalScale(24),
              },
            ]}>
            Verify your OTP
          </Text>
          {/* {props.fullSize ? (
            <Text style={styles.subtitle}>
              Help us to keep the creeps off the app and ensure a safe space for
              everyone.
            </Text>
          ) : null} */}
          <View style={styles.row}>
            <Text style={styles.otpSentText}>
              A four digit OTP is sent to +91 {num || props?.number}
            </Text>
            <Text
              style={[styles.edit, {marginLeft: scale(12)}]}
              onPress={() => {
                setinputType(inputTypes.phone);
              }}>
              Edit
            </Text>
          </View>
          <OTPInputView
            pinCount={4}
            style={styles.otpCont}
            codeInputFieldStyle={styles.otpInput}
            onCodeFilled={code => setOtp(code)}
            autoFocusOnLoad={false}
          />
          <View style={{flexDirection: 'row', marginTop: verticalScale(24)}}>
            <Text style={styles.noOtpText}>Did not receive otp?</Text>
            <TouchableOpacity onPress={getOtp}>
              <Text style={[styles.resendOtp, {marginLeft: scale(4)}]}>
                Resend OTP
              </Text>
            </TouchableOpacity>
          </View>
          <View style={{flex: 1, justifyContent: 'flex-end'}}>
            <TouchableOpacity
              style={[styles.btnCont, {marginTop: verticalScale(32)}]}
              onPress={verityOtp}>
              <Text style={styles.btnTitle}>Verify OTP</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
    paddingBottom: verticalScale(20),
  },
  otpContainer: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
    alignItems: 'center',
    paddingBottom: verticalScale(20),
  },
  input: {
    letterSpacing: scale(11.5),
    paddingHorizontal: 0,
    paddingBottom: 0,
    marginBottom: 0,
  },
  inputCont: {
    marginLeft: scale(24),
    width: scale(236),
    marginBottom: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingTop: 0,
    marginTop: 0,
  },
  inpError: {marginBottom: 0, height: 0, paddingBottom: 0},
  otpCont: {
    width: scale(312),
    marginTop: verticalScale(24),
    height: verticalScale(48),
  },
  otpInput: {
    height: verticalScale(48),
    width: scale(69),
    borderRadius: moderateScale(8),
    borderColor: '#DCDCDC',
    color: '#87B2E5',
  },
  row: {
    flexDirection: 'row',
    marginTop: verticalScale(12),
    marginLeft: scale(26),
    alignSelf: 'flex-start',
  },

  btnCont: {
    width: scale(300),
    height: verticalScale(40),
    borderRadius: moderateScale(3),
    alignSelf: 'center',
    marginTop: verticalScale(48),
    marginBottom: verticalScale(10),
    backgroundColor: '#87B2E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btn: {
    backgroundColor: '#87B2E5',
  },

  dashCont: {
    width: scale(216),
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft: scale(24),
  },
  dash: {
    width: scale(20),
    height: 0,
    borderTopWidth: verticalScale(1),
    borderColor: '#333333',
  },
  label: {
    ...tStyle('Manrope-Bold', '600', 'normal', 22, 24.59, '#333333'),
    marginTop: verticalScale(50),
  },
  btnTitle: tStyle('Manrope-Regular', '700', 'normal', 16, 21.86, '#FFFFFF'),
  error: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 16.39, '#EB5757'),
    marginLeft: scale(24),
  },
  otpSentText: tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#333333'),
  subtitle: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 12, 16.8, '#333333'),
    alignSelf: 'flex-start',
    marginHorizontal: scale(24),
    marginTop: verticalScale(15),
    marginBottom: verticalScale(40),
  },
  edit: tStyle('Manrope-Regular', '600', 'normal', 10, 14, '#87B2E5'),
  noOtpText: tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#333333'),
  resendOtp: tStyle('Manrope-Regular', '600', 'normal', 12, 16.8, '#87B2E5'),
  backBtn: {
    alignSelf: 'flex-start',
    marginTop: verticalScale(20),
    marginLeft: scale(20),
    flexDirection: 'row',
    justifyContent: 'center',
    backgroundColor: '#FFF',
    alignItems: 'flex-end',
  },
  text1: {
    ...tStyle('Manrope-ExtraBold', '900', 'normal', 24, 24, '#4f4f4f'),
    marginLeft: scale(10),
  },
  text2: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 12, 14, '#666565'),
    alignSelf: 'center',
  },
});

export default EnterNumber;
