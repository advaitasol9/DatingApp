import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import LottieView from 'lottie-react-native';

import {verticalScale, scale} from '../../../../configs/size';
import {tStyle} from '../../../../configs/textStyles';

const FinalScreen = ({userInfo, navHandler}) => {
  return (
    <View style={styles.container}>
      <View style={styles.imgContainer}>
        {userInfo?.photos ? (
          <Image
            source={{uri: userInfo?.photos.split(',')[0]}}
            resizeMode="cover"
            style={{height: scale(150), width: scale(150)}}
          />
        ) : null}
      </View>
      <View style={styles.avatarBg}>
        <LottieView
          source={require('../../../../assets/images/confetti.json')}
          autoPlay
          loop
        />
      </View>
      <View style={styles.textContainer}>
        <Text style={styles.text1}>Congratulations</Text>
        <Text style={styles.text2}>Your profile is created!</Text>
      </View>
      <TouchableOpacity style={styles.btn} onPress={navHandler}>
        <Text style={styles.btnText}>Find Connections</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  imgContainer: {
    position: 'absolute',
    marginTop: verticalScale(142),
    alignSelf: 'center',
    height: scale(150),
    width: scale(150),
    borderRadius: scale(75),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  avatarBg: {
    height: verticalScale(324),
    width: scale(432),
    position: 'absolute',
    top: verticalScale(50),
    alignSelf: 'center',
  },
  text1: {
    ...tStyle('Manrope-Bold', '700', 'normal', 32, 44.8, '#000000'),
  },
  text2: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 18, 25.2, '#6D6D6D'),
  },
  textContainer: {
    position: 'absolute',
    top: verticalScale(322),
    alignSelf: 'center',
    alignItems: 'center',
  },
  btn: {
    width: scale(300),
    height: verticalScale(55),
    position: 'absolute',
    bottom: verticalScale(24),
    alignSelf: 'center',
    borderRadius: scale(8),
    backgroundColor: '#87B2E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 16, 21.8, '#FFFFFF'),
  },
});

export default FinalScreen;
