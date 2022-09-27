import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {Input} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import size, {moderateScale, scale, verticalScale} from '../../configs/size';
import {tStyle} from '../../configs/textStyles';
import colors from '../../configs/colors';
import {useDispatch, useSelector} from 'react-redux';
import {registerUser} from '../../store/actions/userAction';
import moment from 'moment';

const AddProfileDetails = ({navigation, route}) => {
  const dateRef = useRef();
  const monthRef = useRef();
  const yearRef = useRef();

  const [date, setDate] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [gender, setGender] = useState('');
  const [genderSearching, setGenderSearching] = useState('');
  const [lat, setLat] = useState('');
  const [lng, setLng] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [location, setLocation] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [dobError, setDobError] = useState(false);

  const progressBarWidth = useState(new Animated.Value(scale(100)))[0];
  const imgContainerSize = useState(new Animated.Value(scale(160)))[0];
  const imgContainerPos = useState(
    new Animated.ValueXY({x: verticalScale(100), y: scale(121)}),
  )[0];
  const textContainerPos = useState(
    new Animated.ValueXY({x: verticalScale(130), y: scale(313)}),
  )[0];

  const username = route.params.username;
  const selectedAvatar = route.params.selectedAvatar;
  const genderArray1 = ['Male', 'Female', 'Non-Binary'];
  const genderArray2 = ['Male', 'Female', 'Non-Binary', 'Everyone'];
  const popularLocation = [
    'Mumbai',
    'Delhi',
    'Banglore',
    'Pune',
    'Kerala',
    'Chennai',
    'Hyderabad',
  ];

  const dispatch = useDispatch();
  const avatarArray = useSelector(state => state.user.avatarArray);

  const getImage = (gender, selectedGen) => {
    const style = {
      height: scale(56),
      width: scale(56),
      borderColor: '#70B7D1',
      borderRadius: scale(25),
      borderWidth: gender == selectedGen ? 1 : 0,
    };
    if (gender === 'Male')
      return (
        <Image source={require('../../assets/images/Male.png')} style={style} />
      );
    if (gender === 'Female')
      return (
        <Image
          source={require('../../assets/images/Female.png')}
          style={style}
        />
      );
    if (gender === 'Non-Binary')
      return (
        <Image
          source={require('../../assets/images/Non-Binary.png')}
          style={style}
        />
      );
    if (gender === 'Everyone')
      return (
        <Image
          source={require('../../assets/images/Everyone.png')}
          style={style}
        />
      );
  };

  const generatePassword = () => {
    var result = '';
    var characters =
      'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < 8; i++) {
      result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
  };

  const formSubmission = async () => {
    if (!date || !month || !year || !gender || !genderSearching || !location)
      return;

    const password = generatePassword();

    const dob = new Date(`${year}-${month}-${date}`);

    const body = {
      username: username,
      password: password,
      avatar: selectedAvatar,
      gender: gender,
      lookingFor: genderSearching,
      dob: dob.toDateString(),
      city: location,
    };

    try {
      console.log('register body', body);
      await dispatch(registerUser(body));
      navigation.navigate('FinalAnonScreen', {
        username,
        password,
        selectedAvatar,
        dob: date + '/' + month + '/' + year,
        gender,
        genderSearching,
      });
    } catch (err) {
      alert(err);
      console.log('err', err);
    }
  };

  const changeImgPos = () => {
    Animated.timing(imgContainerPos, {
      toValue: {x: scale(81), y: verticalScale(121)},
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const changeContainerSize = () => {
    Animated.timing(imgContainerSize, {
      toValue: scale(62),
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const changeTextPos = () => {
    Animated.timing(textContainerPos, {
      toValue: {x: scale(156), y: verticalScale(155)},
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  const changeProgressBar = () => {
    Animated.timing(progressBarWidth, {
      toValue: scale(250),
      duration: 500,
      useNativeDriver: false,
    }).start();
  };

  useEffect(() => {
    if (!month || !year || !date) {
      return;
    }
    const timeStamp = moment([year, month - 1, date]);
    if (!timeStamp.isValid()) {
      setDobError(true);
    } else {
      if (moment(moment.now()).isSameOrBefore(timeStamp, 'date')) {
        setDobError(true);
      } else {
        setDobError(false);
      }
    }
  }, [month, year, date]);

  useEffect(() => {
    changeContainerSize();
    changeImgPos();
    changeTextPos();
    changeProgressBar();
  }, []);

  useEffect(() => {
    var tempArr = popularLocation.filter(item =>
      item.toLowerCase().includes(searchInput.toLowerCase()),
    );
    setFilteredLocations(tempArr);
  }, [searchInput]);

  const renderCards = () => {
    return (
      <ScrollView
        contentContainerStyle={styles.bottomContainer}
        showsVerticalScrollIndicator={false}>
        <View style={{...styles.card, paddingLeft: 0}}>
          <Text style={styles.text5}>My birthdate is</Text>
          <View
            style={{
              flexDirection: 'row',
              paddingLeft: scale(8),
              marginTop: verticalScale(8),
              height: verticalScale(50),
            }}>
            <View>
              <Input
                ref={dateRef}
                style={styles.dobText}
                inputContainerStyle={[
                  styles.dobContainers,
                  dobError && {borderColor: 'red'},
                ]}
                keyboardType="number-pad"
                placeholder="date"
                placeholderTextColor="#666666"
                value={date}
                maxLength={2}
                onChangeText={val => {
                  setDate(val.replace(/[^0-9]/g, ''));
                  if (val.length == 2) {
                    monthRef.current.focus();
                  }
                }}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.dobText}>/</Text>
            </View>
            <View>
              <Input
                ref={monthRef}
                style={styles.dobText}
                inputContainerStyle={[
                  styles.dobContainers,
                  dobError && {borderColor: 'red'},
                ]}
                keyboardType="number-pad"
                placeholder="month"
                placeholderTextColor="#666666"
                value={month}
                maxLength={2}
                onChangeText={val => {
                  setMonth(val.replace(/[^0-9]/g, ''));
                  if (val.length == 2) {
                    yearRef.current.focus();
                  }
                }}
              />
            </View>
            <View style={{justifyContent: 'center'}}>
              <Text style={styles.dobText}>/</Text>
            </View>
            <View>
              <Input
                ref={yearRef}
                style={styles.dobText}
                inputContainerStyle={[
                  styles.dobContainers,
                  dobError && {borderColor: 'red'},
                ]}
                keyboardType="number-pad"
                placeholder="year"
                placeholderTextColor="#666666"
                value={year}
                maxLength={4}
                onChangeText={val => {
                  setYear(val.replace(/[^0-9]/g, ''));
                  if (val.length == 4) {
                    yearRef.current.blur();
                  }
                }}
              />
            </View>
          </View>
          <Text style={styles.text6}>Example</Text>
          <Text style={styles.text7}>15 /06/ 1993</Text>
        </View>
        <View style={[styles.card, {marginTop: scale(24)}]}>
          <Text style={styles.text5}>I am</Text>
          <View
            style={{
              width: scale(240),
              flexDirection: 'row',
              alignSelf: 'center',
              alignItems: 'center',
              justifyContent: 'space-between',
            }}>
            {genderArray1.map(gen => {
              return (
                <TouchableOpacity
                  style={{
                    marginTop: verticalScale(16),
                    alignItems: 'center',
                    marginHorizontal: scale(8),
                  }}
                  onPress={() => setGender(gen)}>
                  {getImage(gen, gender)}
                  <Text
                    style={{
                      ...styles.dobText,
                      marginTop: verticalScale(8),
                      fontWeight: gen === gender ? '700' : '500',
                    }}>
                    {gen}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
        <View style={[styles.card, {marginTop: scale(24)}]}>
          <Text style={styles.text5}>Looking for</Text>
          <View style={{flexDirection: 'row', alignSelf: 'center'}}>
            {genderArray2.map(gen => (
              <TouchableOpacity
                style={{
                  marginTop: verticalScale(16),
                  alignItems: 'center',
                  marginHorizontal: scale(8),
                }}
                onPress={() => setGenderSearching(gen)}>
                {getImage(gen, genderSearching)}
                <Text
                  style={{
                    ...styles.dobText,
                    marginTop: verticalScale(8),
                    fontWeight: gen === genderSearching ? '700' : '500',
                  }}>
                  {gen}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <View style={[styles.card, {marginTop: scale(24)}]}>
          <Text style={styles.txt8}>Select location</Text>
          <View style={styles.searchBar}>
            <Image
              source={require('../../assets/images/search.png')}
              style={{height: scale(19), width: scale(19)}}
              resizeMode="contain"
            />
            <Input
              containerStyle={styles.inputContainerStyle}
              inputContainerStyle={{borderBottomWidth: 0}}
              inputStyle={styles.inputText}
              value={searchInput}
              placeholder="Search for locations"
              placeholderTextColor="#333333"
              onChangeText={val => setSearchInput(val)}
            />
          </View>
          <Text style={styles.txt10}>Popular Location</Text>
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
            }}>
            {filteredLocations.map(loc => (
              <TouchableOpacity
                style={{
                  ...styles.locBtn,
                  borderWidth: loc === location ? 1 : 0,
                }}
                onPress={() => setLocation(loc)}>
                <Text style={styles.txt9}>{loc}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.progressBar}>
          <Animated.View
            style={{
              ...styles.progressBarFill,
              width: progressBarWidth,
            }}></Animated.View>
        </View>
        <Text style={styles.text1}>Add Profile Details!</Text>
        <Text style={styles.text2}>
          Let the real you find the real suitable for you
        </Text>
        <View
          style={{
            position: 'absolute',
            left: scale(156),
            bottom: verticalScale(56),
          }}>
          <Text style={styles.text3}>Hello, I am...</Text>
        </View>
      </View>
      {renderCards()}
      <Animated.View
        style={[
          styles.imgContainer,
          {
            backgroundColor: avatarArray[selectedAvatar].backgroundColor,
            borderColor: avatarArray[selectedAvatar].borderColor,
            position: 'absolute',
            left: imgContainerPos.x,
            top: imgContainerPos.y,
            height: imgContainerSize,
            width: imgContainerSize,
          },
        ]}>
        <Image
          source={{uri: avatarArray[selectedAvatar].image}}
          resizeMode="contain"
          style={{height: verticalScale(44), width: scale(53)}}
        />
      </Animated.View>
      <Animated.View
        style={{
          position: 'absolute',
          left: textContainerPos.x,
          top: textContainerPos.y,
        }}>
        <Text style={styles.text4}>{username}</Text>
      </Animated.View>
      {date &&
      month &&
      year &&
      gender &&
      genderSearching &&
      location &&
      !dobError ? (
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: verticalScale(24),
            alignSelf: 'center',
          }}
          onPress={formSubmission}>
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
    width: scale(140),
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
  inlineWrapper: {
    marginTop: verticalScale(24),
    flexDirection: 'row',
  },
  imgContainer: {
    borderRadius: scale(100),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  text3: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 19.6, '#666666'),
  },
  text4: {
    ...tStyle('Halant-Bold', '600', 'normal', 24, 29, '#000000'),
  },
  bottomContainer: {
    flexGrow: 1,
    padding: scale(24),
  },
  card: {
    width: '100%',
    borderRadius: scale(16),
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowRadius: scale(10),
    shadowOpacity: 0.2,
    elevation: 2,
    backgroundColor: '#fff',
    paddingHorizontal: scale(16),
    paddingVertical: verticalScale(20),
  },
  dobContainers: {
    width: scale(74),
    height: verticalScale(48),
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: scale(12),
  },
  text5: {
    ...tStyle('Halant-SemiBold', '600', 'normal', 21, 29.4, '#333333'),
    paddingLeft: scale(16),
  },
  dobText: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#666666'),
    textAlign: 'center',
  },
  text6: {
    ...tStyle('Manrope-Regular', '500', 'normal', 10, 14, '#333333'),
    marginTop: verticalScale(8),
    marginLeft: scale(16),
  },
  text7: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#333333'),
    marginTop: verticalScale(4),
    marginLeft: scale(16),
  },
  txt8: {
    ...tStyle('Manrope-Bold', '600', 'normal', 18, 24.5, '#333333'),
    marginLeft: scale(10),
  },
  searchBar: {
    height: verticalScale(48),
    width: scale(286),
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderRadius: scale(8),
    borderColor: '#DCDCDC',
    paddingLeft: scale(10),
    marginTop: verticalScale(20),
  },
  inputContainerStyle: {
    height: verticalScale(16),
    paddingTop: verticalScale(10),
    justifyContent: 'center',
  },
  inputText: {
    ...tStyle('Manrope-Regular', '400', 'normal', 12, 16.8, '#333333'),
  },
  locBtn: {
    marginTop: verticalScale(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(5),
    backgroundColor: '#FAEFFE',
    height: verticalScale(26),
    borderRadius: scale(32),
    paddingHorizontal: scale(10),
    borderColor: '#E6A1FF',
  },
  txt9: {
    ...tStyle('Manrope-Regular', '400', 'normal', 12, 16.8, '#393939'),
  },
  txt10: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 10, 14, '#333333'),
    marginTop: verticalScale(16),
  },
});

export default AddProfileDetails;
