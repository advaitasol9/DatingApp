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
  Platform,
} from 'react-native';
import {Input} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import size, {moderateScale, scale, verticalScale} from '../../configs/size';
import {tStyle} from '../../configs/textStyles';
import colors from '../../configs/colors';
import LottieView from 'lottie-react-native';
import {useSelector, useDispatch} from 'react-redux';
import {getUniqueId} from 'react-native-device-info';
import {loginWithPassword} from '../../store/actions/userAction';

const FinalAnonScreen = ({navigation, route}) => {
  const progressBarWidth = useState(new Animated.Value(scale(250)))[0];
  const username = route.params.username;
  const password = route.params.password;
  const selectedAvatar = route.params.selectedAvatar;

  const dispatch = useDispatch();
  const avatarArray = useSelector(state => state.user.avatarArray);

  const changeProgressBar = () => {
    Animated.timing(progressBarWidth, {
      toValue: scale(300),
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const deviceId = getUniqueId();

  const login = async () => {
    try {
      const body = {
        username,
        password,
        deviceId,
        deviceType: Platform.OS,
      };
      await dispatch(loginWithPassword(body));
      navigation.navigate('Questionnaire', {...route.params});
    } catch (err) {
      alert(err);
      console.log('err', err);
    }
  };

  useEffect(() => {
    changeProgressBar();
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.progressBar}>
        <Animated.View
          style={{
            ...styles.progressBarFill,
            width: progressBarWidth,
          }}></Animated.View>
      </View>
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
        <Text style={styles.text1}>
          Hey {username}, thats a sexy avatar you got there!
        </Text>
        <Text style={styles.text2}>
          Help us judge your personality by answering atleast one question from
          the next three segments. These questions have been scientifically
          researched and psychologically proven to get you the best matches
          possible.
        </Text>
      </View>
      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: verticalScale(24),
          alignSelf: 'center',
        }}
        onPress={login}>
        <Image
          source={require('../../assets/images/arrowRight.png')}
          style={{height: verticalScale(40), width: verticalScale(40)}}
        />
      </TouchableOpacity>
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
    ...tStyle('Manrope-SemiBold', '700', 'normal', 20, 28, '#000000'),
    marginHorizontal: scale(52),
    textAlign: 'center',
  },
  text2: {
    ...tStyle('Manrope-Regular', '500', 'normal', 14, 22.4, '#666666'),
    marginHorizontal: scale(35),
    textAlign: 'center',
    marginTop: scale(18),
  },
  imgContainer: {
    position: 'absolute',
    top: verticalScale(142),
    alignSelf: 'center',
    height: scale(150),
    width: scale(150),
    borderRadius: scale(75),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarBg: {
    height: verticalScale(324),
    width: scale(432),
    position: 'absolute',
    top: verticalScale(50),
    alignSelf: 'center',
  },
  bottomContainer: {
    flex: 1,
    alignItems: 'center',
    marginTop: verticalScale(322),
  },
});

export default FinalAnonScreen;
