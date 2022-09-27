import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
  ActivityIndicator,
} from 'react-native';
import {Button, Icon, Input} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import size, {moderateScale, scale, verticalScale} from '../../configs/size';
import {apiUrl} from '../../configs/constants';
import {tStyle} from '../../configs/textStyles';
import colors from '../../configs/colors';
import {useSelector} from 'react-redux';

const SelectUsername = ({navigation, route}) => {
  const [username, setUsername] = useState('');
  const animatedHeights = useState(
    new Animated.ValueXY({x: verticalScale(268), y: scale(280)}),
  )[0];
  const animatedPositions = useState(
    new Animated.ValueXY({x: scale(-140), y: scale(140)}),
  )[0];
  const progressBarWidth = useState(new Animated.Value(scale(20)))[0];
  const avatarSize = useState(
    new Animated.ValueXY({x: verticalScale(195), y: scale(231)}),
  )[0];
  //--> undo

  const avatarArray = useSelector(state => state.user.avatarArray);

  const [suggestedUsernames, setSuggestedUsernames] = useState([]);
  const selectedAvatar = route.params.selectedAvatar;

  // ->delete
  // const animatedHeights = useState(
  //   new Animated.ValueXY({x: verticalScale(203), y: scale(160)}),
  // )[0];
  // const animatedPositions = useState(
  //   new Animated.ValueXY({x: scale(-80), y: scale(80)}),
  // )[0];
  // const progressBarWidth = useState(new Animated.Value(scale(60)))[0];
  // -> delete

  // --> undo
  const changeAnimatedHeights = () => {
    Animated.timing(animatedHeights, {
      toValue: {x: verticalScale(203), y: scale(160)},
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const changeAnimatedPositions = () => {
    Animated.timing(animatedPositions, {
      toValue: {x: verticalScale(-80), y: scale(80)},
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  // --> undo

  const changeProgressBar = () => {
    Animated.timing(progressBarWidth, {
      toValue: scale(60),
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  // --> undo

  // -> delete
  // const avatarSize = useState(
  //   new Animated.ValueXY({x: verticalScale(102), y: scale(121)}),
  // )[0];
  // -> delete

  const changeAvatarSize = () => {
    Animated.timing(avatarSize, {
      toValue: {x: verticalScale(102), y: scale(121)},
      duration: 500,
      useNativeDriver: false,
    }).start();
  };
  // --> undo

  useEffect(() => {
    changeAnimatedHeights();
    changeAnimatedPositions();
    changeAvatarSize();
    // --> undo
    changeProgressBar();
  }, []);

  const fetchUsernames = () => {
    fetch(`${apiUrl}/username/generate`)
      .then(res => res.json())
      .then(data => setSuggestedUsernames(data))
      .catch(err => console.log('err', err));
  };

  useEffect(fetchUsernames, []);

  const checkUsername = async () => {
    if (!username) return;
    try {
      const res = await fetch(`${apiUrl}/username/verify/${username}`);
      const data = await res.json();
      if (data.available) {
        navigation.navigate('AddProfileDetails', {
          selectedAvatar,
          username,
        });
      } else {
        alert('Username already taken, try something else.');
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={{...styles.topContainer, height: animatedHeights.x}}>
        <View style={styles.progressBar}>
          <Animated.View
            style={{
              ...styles.progressBarFill,
              width: progressBarWidth,
            }}></Animated.View>
        </View>
        <Text style={styles.text1}>Add Username!</Text>
        <Text style={styles.text2}>
          Let the real you find the real suitable for you
        </Text>
        <Animated.View
          style={[
            styles.imgContainer,
            {
              backgroundColor: avatarArray[selectedAvatar].backgroundColor,
              borderColor: avatarArray[selectedAvatar].borderColor,
              height: animatedHeights.y,
              width: animatedHeights.y,
              bottom: animatedPositions.x,
              // borderRadius: 1000,
            },
          ]}>
          <Animated.Image
            source={{uri: avatarArray[selectedAvatar].image}}
            resizeMode="contain"
            style={{height: avatarSize.x, width: avatarSize.y}}
          />
        </Animated.View>
      </Animated.View>
      <Animated.View
        style={{...styles.bottomContainer, marginTop: animatedPositions.y}}>
        <View style={styles.inputContainer}>
          <Text style={styles.inputTextStyle}>
            {username || 'Hello, I am...'}
          </Text>
        </View>
        <View style={styles.usernameRefreshRow}>
          <Text style={styles.text3}>Suggested usernames</Text>
          <Icon
            name={'refresh'}
            type={'Ionicon'}
            size={moderateScale(18)}
            color={'#333333'}
            onPress={fetchUsernames}
          />
        </View>
        {suggestedUsernames.length > 0 ? (
          <View style={styles.usernameWrapper}>
            {suggestedUsernames.map(name => (
              <TouchableOpacity
                style={styles.usernameContainer}
                onPress={() => {
                  setUsername(name);
                  Animated.timing(progressBarWidth, {
                    toValue: scale(100),
                    duration: 500,
                    useNativeDriver: false,
                  }).start();
                }}>
                <Text style={styles.text4}>{name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        ) : (
          <ActivityIndicator size="small" />
        )}
      </Animated.View>
      {username ? (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: verticalScale(24),
            alignSelf: 'center',
          }}
          onPress={checkUsername}>
          <Image
            source={require('../../assets/images/arrowRight.png')}
            style={{height: verticalScale(40), width: verticalScale(40)}}
          />
        </TouchableOpacity>
      ) : null}
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
    width: scale(100),
    backgroundColor: '#3BA2E4',
  },
  topContainer: {
    height: verticalScale(203),
    paddingTop: verticalScale(46),
    alignItems: 'center',
    backgroundColor: colors.pastel.blue,
    borderBottomLeftRadius: scale(20),
    borderBottomRightRadius: scale(20),
  },
  text1: {
    ...tStyle('Manrope-SemiBold', '700', 'normal', 20, 22, '#000000'),
    marginBottom: verticalScale(10),
  },
  text2: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#666666'),
  },
  imgContainer: {
    position: 'absolute',
    bottom: scale(-80),
    height: scale(160),
    width: scale(160),
    borderRadius: scale(140),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bottomContainer: {
    flex: 1,
    marginTop: scale(80),
    paddingTop: verticalScale(18),
  },
  inputContainer: {
    height: verticalScale(48),
    width: scale(312),
    marginHorizontal: scale(24),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#4F4F4F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text3: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#333333'),
  },
  usernameWrapper: {
    marginLeft: scale(20),
    flexWrap: 'wrap',
    flexDirection: 'row',
  },
  usernameContainer: {
    height: verticalScale(28),
    marginRight: scale(8),
    paddingHorizontal: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FAEFFE',
    borderRadius: scale(48),
    marginBottom: verticalScale(12),
  },
  text4: {
    ...tStyle('Halant-SemiBold', '500', 'normal', 14, 19.6, '#333333'),
  },
  inputTextStyle: {
    padding: 0,
    fontFamily: 'Halant-Bold',
    fontWeight: '600',
    fontSize: 20,
    textAlign: 'center',
    color: '#333',
  },
  usernameRefreshRow: {
    marginBottom: scale(16),
    marginTop: scale(24),
    marginLeft: scale(24),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: scale(312),
  },
});

export default SelectUsername;
