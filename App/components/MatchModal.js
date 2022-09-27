import React, {useState, useEffect} from 'react';
import {View, Text, StyleSheet, Image, Animated} from 'react-native';
import LottieView from 'lottie-react-native';

import {moderateScale, scale, verticalScale} from '../configs/size';
import {tStyle} from '../configs/textStyles';
import {useSelector} from 'react-redux';

const MatchModal = ({avatar1, avatar2}) => {
  const animatediDim = useState(
    new Animated.ValueXY({x: scale(56), y: verticalScale(46)}),
  )[0];
  const animatedBox = useState(new Animated.Value(scale(84)))[0];
  const animatedMargin = useState(new Animated.Value(scale(-25)))[0];

  const avatarArray = useSelector(state => state.user.avatarArray);

  useEffect(() => {
    Animated.timing(animatedBox, {
      toValue: verticalScale(150),
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatediDim, {
      toValue: {x: scale(101), y: verticalScale(84)},
      duration: 500,
      useNativeDriver: false,
    }).start();
    Animated.timing(animatedMargin, {
      toValue: scale(-45),
      duration: 500,
      useNativeDriver: false,
    }).start();

    setTimeout(() => {
      Animated.timing(animatedBox, {
        toValue: verticalScale(84),
        duration: 500,
        useNativeDriver: false,
      }).start();
      Animated.timing(animatediDim, {
        toValue: {x: scale(56), y: verticalScale(46)},
        duration: 500,
        useNativeDriver: false,
      }).start();
      Animated.timing(animatedMargin, {
        toValue: scale(-25),
        duration: 500,
        useNativeDriver: false,
      }).start();
    }, 800);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={{marginTop: verticalScale(100)}}>
          <Text style={styles.text1}>Noice!</Text>
          <Text style={styles.text1}>*wink wink*</Text>
        </View>
        <View style={styles.wrapper}>
          <Animated.View
            style={{
              ...styles.imgWrapper,
              backgroundColor: avatarArray[2].backgroundColor,
              height: animatedBox,
              width: animatedBox,
            }}>
            <Animated.Image
              source={{uri: avatarArray[avatar2].image}}
              resizeMode="contain"
              style={{height: animatediDim.y, width: animatediDim.x}}
            />
          </Animated.View>
          <Animated.View
            style={{
              ...styles.imgWrapper,
              backgroundColor: avatarArray[1].backgroundColor,
              marginLeft: animatedMargin,
              borderWidth: 3,
              height: animatedBox,
              width: animatedBox,
            }}>
            <Animated.Image
              source={{uri: avatarArray[avatar1].image}}
              resizeMode="contain"
              style={{height: animatediDim.y, width: animatediDim.x}}
            />
          </Animated.View>
        </View>
        <View style={styles.avatarBg}>
          <LottieView
            source={require('../assets/images/confetti.json')}
            autoPlay
            loop
            resizeMode="cover"
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000090',
  },
  text1: {
    ...tStyle('Halant-Bold', '700', 'normal', 32, 44.8, '#FFFFFF'),
    alignSelf: 'center',
  },
  imgWrapper: {
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(150),
    width: scale(150),
    borderRadius: scale(150),
    borderColor: '#fff',
  },
  wrapper: {
    flexDirection: 'row',
    alignSelf: 'center',
    paddingVertical: verticalScale(20),
    position: 'absolute',
    top: verticalScale(235),
  },
  avatarBg: {
    position: 'absolute',
    top: verticalScale(235),
    alignSelf: 'center',
    width: scale(400),
    height: verticalScale(198),
  },
});

export default MatchModal;
