import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Animated,
} from 'react-native';
import {Input} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import size, {moderateScale, scale, verticalScale} from '../../configs/size';
import {tStyle} from '../../configs/textStyles';
import colors from '../../configs/colors';
import {useSelector} from 'react-redux';
import LottieView from 'lottie-react-native';

const FinalQuesScreen = ({navigation, route}) => {
  const username = route.params?.username || '';
  const selectedAvatar = route.params?.selectedAvatar || '1';
  const avatarArray = useSelector(state => state.user.avatarArray);
  return (
    <SafeAreaView style={styles.container}>
      <View
        style={[
          styles.imgContainer,
          {
            backgroundColor: avatarArray[selectedAvatar].backgroundColor,
            borderColor: avatarArray[selectedAvatar].borderColor,
          },
        ]}>
        <Image
          source={{uri: avatarArray[selectedAvatar].image}}
          resizeMode="contain"
          style={{height: verticalScale(90), width: scale(106)}}
        />
      </View>
      <View style={styles.avatarBg}>
        <LottieView
          source={require('../../assets/images/confetti.json')}
          autoPlay
          loop
        />
      </View>
      <View style={styles.bottomContainer}>
        <Text style={styles.text1}>That’s all, let’s get started</Text>
        <Text style={styles.text2}>Find the one you were looking</Text>
        <TouchableOpacity
          style={styles.btn}
          onPress={() => {
            navigation.navigate('tabs');
          }}>
          <Text style={styles.btnText}>Explore Profiles</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  progressBar: {
    height: verticalScale(6),
    width: '100%',
    position: 'absolute',
    top: 0,
    backgroundColor: '#D7EBF7',
  },
  progressBarFill: {
    height: verticalScale(6),
    width: scale(160),
    backgroundColor: '#3BA2E4',
  },
  text1: {
    ...tStyle('Manrope-Regular', '700', 'normal', 20, 28, '#000000'),
    textAlign: 'center',
  },
  text2: {
    ...tStyle('Manrope-Regular', '500', 'normal', 14, 18.9, '#6D6D6D'),
    textAlign: 'center',
    marginTop: scale(8),
  },
  imgContainer: {
    position: 'absolute',
    top: verticalScale(185),
    alignSelf: 'center',
    height: scale(150),
    width: scale(150),
    borderRadius: scale(75),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBg: {
    height: verticalScale(291),
    width: scale(388),
    position: 'absolute',
    top: verticalScale(110),
    alignSelf: 'center',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: verticalScale(373),
  },
  btn: {
    width: scale(300),
    height: verticalScale(56),
    marginHorizontal: scale(30),
    marginTop: verticalScale(24),
    borderRadius: scale(8),
    backgroundColor: '#87B2E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    ...tStyle('Manrope-Regular', '700', 'normal', 16, 21.86, '#FFFFFF'),
  },
});

export default FinalQuesScreen;
