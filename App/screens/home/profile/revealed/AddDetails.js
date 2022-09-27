import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Input, Icon} from 'react-native-elements';
import ProgressCircle from 'react-native-progress-circle';
import ScrollPicker from 'react-native-wheel-scrollview-picker';
import Modal from 'react-native-modal';
import {useSelector, useDispatch} from 'react-redux';

import {verticalScale, scale} from '../../../../configs/size';
import {tStyle} from '../../../../configs/textStyles';
import EnterNumber from '../../../onboarding/Login';
import FinalScreen from './FinalScreen';
import {
  updateRealProfile,
  updateUserData,
} from '../../../../store/actions/userAction';

const AddDetails = ({navigation, route}) => {
  const [height, setHeight] = useState({feet: 5, inches: 8});
  const [education, setEducation] = useState('');
  const [jobTitle, setJobTitle] = useState('');
  const [religion, setReligion] = useState('');
  const [drinking, setDrinking] = useState(null);
  const [smoking, setSmoking] = useState(null);
  const [fitness, setFitness] = useState('');
  const [food, setFood] = useState('');
  const [profileModalVisible, setProfileModalVisible] = useState(false);
  const [userInfo, setUserInfo] = useState({});
  const [isScrollable, setIsScrollable] = useState(true);
  const [tick, setTick] = useState(0);

  const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();

  const eduOptions = ['High School', 'Undergraduate', 'Postgraduate'];
  const relOptions = [
    'Agnostic',
    'Atheist',
    'Buddhist',
    'Catholic',
    'Christian',
    'Hindu',
    'Jain',
    'Jewish',
    'Mormon',
    'Sikh',
    'Muslim',
    'Spiritual',
    'Zoroastrian',
    'Other',
  ];
  const fitnessOptions = ['Active', 'Sometimes', 'Almost Never'];
  const foodOptions = ['Vegetarian', 'Non - Vegetarian', 'Vegan', 'Other'];

  console.log('route', route.params);
  useEffect(() => {
    if (route.params?.isEditing) {
      const basicDetails = route.params?.realProfile?.basicDetails;
      if (basicDetails) {
        setHeight(basicDetails?.height || {});
        setEducation(basicDetails?.education || '');
        setJobTitle(basicDetails?.jobTitle || '');
        setReligion(basicDetails?.religion || '');
        setDrinking(basicDetails?.drinking || null);
        setSmoking(basicDetails?.smoking || null);
        setFitness(basicDetails?.fitness || '');
        setFood(basicDetails?.food || '');
      }
    }
  }, [route]);

  const navHandler = async () => {
    if (
      !route.params?.name ||
      !route.params?.bio ||
      !route.params?.uriString ||
      !height ||
      !education
    )
      return;
    const body = {
      name: route.params?.name,
      bio: route.params?.bio,
      photos: route.params?.uriString,
      basicDetails: {
        height,
        education,
        jobTitle,
        drinking,
        smoking,
        religion,
        fitness,
        food,
      },
    };
    try {
      if (route.params?.isEditing)
        await dispatch(
          updateRealProfile(body, token, true, () =>
            navigation.navigate('RevealedProfile'),
          ),
        );
      else {
        await dispatch(updateRealProfile(body, token));
        setProfileModalVisible(true);
        setUserInfo(body);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  const reFetch = async () => {
    try {
      await dispatch(updateUserData(token));
      navigation.navigate('RevealedProfile');
    } catch (err) {
      console.log('err', err);
      navigation.navigate('RevealedProfile');
    }
  };

  return (
    <ScrollView
      contentContainerStyle={styles.container}
      scrollEnabled={isScrollable}>
      <TouchableOpacity
        onPress={() => navigation.goBack()}
        style={styles.backBtn}>
        <Image
          source={require('../../../../assets/images/arrowBack.png')}
          style={{height: verticalScale(16), width: scale(8)}}
          resizeMode="contain"
        />
        <Text style={styles.text1}>Back</Text>
      </TouchableOpacity>
      <View style={styles.topContainer}>
        <ProgressCircle
          percent={50}
          radius={scale(32)}
          borderWidth={2}
          color="#48E545"
          shadowColor="#e1fae1"
          bgColor="#fff">
          <View style={styles.progress}>
            <Text style={styles.text2}>50 %</Text>
            <Text style={styles.text3}>complete</Text>
          </View>
        </ProgressCircle>
        <View style={{marginLeft: scale(20)}}>
          <Text style={styles.text4}>Name</Text>
          <View style={styles.nameContainerStyle}>
            <Text style={styles.nameText}>{route.params?.name}</Text>
          </View>
        </View>
      </View>
      <View style={styles.divider} />
      <View
        style={{
          flexDirection: 'row',
          marginHorizontal: scale(24),
          justifyContent: 'space-between',
        }}>
        <Text style={styles.text5}>Basic Details</Text>
        <View style={styles.steps}>
          <Text style={styles.text6}>Step 3/3</Text>
        </View>
      </View>
      <View style={styles.bioContainer}>
        <TouchableOpacity
          onPress={() => setIsScrollable(!isScrollable)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Text style={styles.text7}>Height</Text>
            <Text style={styles.text8}>
              (<Text style={{color: 'red'}}>*</Text> required)
            </Text>
          </View>
          <View style={{marginRight: scale(10)}}>
            {isScrollable ? (
              <Icon
                type="ionicon"
                name="chevron-down-outline"
                size={verticalScale(16)}
              />
            ) : (
              <Text style={styles.text12}>Done</Text>
            )}
          </View>
        </TouchableOpacity>
        {!isScrollable && (
          <>
            <View
              style={{
                width: scale(120),
                alignSelf: 'center',
                flexDirection: 'row',
              }}>
              <View style={{width: scale(60)}}>
                <ScrollPicker
                  dataSource={[...Array(11).keys()]}
                  selectedIndex={height.feet}
                  renderItem={i => <Text style={{color: '#000000'}}>{i}</Text>}
                  onValueChange={i => {
                    setHeight({
                      feet: i,
                      inches: height.inches,
                    });
                    setTick(tick + 1);
                  }}
                  wrapperHeight={verticalScale(150)}
                  wrapperWidth={scale(60)}
                  wrapperColor="#FFFFFF"
                  itemHeight={verticalScale(50)}
                  highlightColor="#181636"
                />
              </View>
              <View style={{width: scale(60)}}>
                <ScrollPicker
                  dataSource={[...Array(12).keys()]}
                  selectedIndex={height.inches}
                  renderItem={i => <Text style={{color: '#000'}}>{i}</Text>}
                  onValueChange={i => {
                    setHeight({
                      feet: height.feet,
                      inches: i,
                    });
                  }}
                  wrapperHeight={verticalScale(150)}
                  wrapperWidth={scale(60)}
                  wrapperColor="#FFFFFF"
                  itemHeight={verticalScale(50)}
                  highlightColor="#181636"
                />
              </View>
            </View>
          </>
        )}
        <Text style={styles.text9}>
          Your height is{' '}
          <Text style={{fontWeight: 'bold'}}>
            {height.feet} feet {height.inches} inches
          </Text>{' '}
          ({Math.round((height.feet * 12 + height.inches) * 2.54)} cm)
        </Text>
      </View>
      <View style={styles.bioContainer}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Text style={styles.text7}>Education</Text>
          <Text style={styles.text8}>
            (<Text style={{color: 'red'}}>*</Text> required)
          </Text>
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {eduOptions.map(option => (
            <TouchableOpacity
              style={{
                ...styles.btn,
                backgroundColor: option === education ? '#799BDC' : '#FFF',
              }}
              onPress={() => setEducation(option)}>
              <Text
                style={{
                  ...styles.text10,
                  color: option === education ? '#FFF' : '#181636',
                }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.bioContainer}>
        <Text style={styles.text7}>Job Title</Text>
        <Input
          containerStyle={styles.inputContainer}
          inputContainerStyle={{borderBottomWidth: 0}}
          inputStyle={styles.text5}
          value={jobTitle}
          onChangeText={val => setJobTitle(val)}
        />
      </View>
      <View style={styles.bioContainer}>
        <Text style={styles.text7}>Religion</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {relOptions.map(option => (
            <TouchableOpacity
              style={{
                ...styles.btn,
                backgroundColor: option === religion ? '#799BDC' : '#FFF',
              }}
              onPress={() => setReligion(option)}>
              <Text
                style={{
                  ...styles.text10,
                  color: option === religion ? '#FFF' : '#181636',
                }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.bioContainer}>
        <Text style={styles.text7}>Drinking</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={{...styles.imgBtn, borderWidth: drinking === true ? 1 : 0}}
              onPress={() => setDrinking(true)}>
              <Image
                source={require('../../../../assets/images/drinking.png')}
                resizeMode="contain"
                style={{height: verticalScale(31), width: scale(17)}}
              />
            </TouchableOpacity>
            <Text
              style={{
                ...styles.text11,
                fontWeight: drinking === true ? 'bold' : '500',
              }}>
              Yes
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                ...styles.imgBtn,
                borderWidth: drinking === false ? 1 : 0,
              }}
              onPress={() => setDrinking(false)}>
              <Image
                source={require('../../../../assets/images/drinking.png')}
                resizeMode="contain"
                style={{height: verticalScale(31), width: scale(17)}}
              />
              <View style={styles.line} />
            </TouchableOpacity>
            <Text
              style={{
                ...styles.text11,
                fontWeight: drinking === false ? 'bold' : '500',
              }}>
              No
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.bioContainer}>
        <Text style={styles.text7}>Smoking</Text>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={{...styles.imgBtn, borderWidth: smoking === true ? 1 : 0}}
              onPress={() => setSmoking(true)}>
              <Image
                source={require('../../../../assets/images/smoking.png')}
                resizeMode="contain"
                style={{height: verticalScale(40), width: scale(17)}}
              />
            </TouchableOpacity>
            <Text
              style={{
                ...styles.text11,
                fontWeight: smoking === true ? 'bold' : '500',
              }}>
              Yes
            </Text>
          </View>
          <View style={{alignItems: 'center'}}>
            <TouchableOpacity
              style={{
                ...styles.imgBtn,
                borderWidth: smoking === false ? 1 : 0,
              }}
              onPress={() => setSmoking(false)}>
              <Image
                source={require('../../../../assets/images/smoking.png')}
                resizeMode="contain"
                style={{height: verticalScale(40), width: scale(17)}}
              />
              <View style={styles.line} />
            </TouchableOpacity>
            <Text
              style={{
                ...styles.text11,
                fontWeight: smoking === false ? 'bold' : '500',
              }}>
              No
            </Text>
          </View>
        </View>
      </View>
      <View style={styles.bioContainer}>
        <Text style={styles.text7}>Fitness</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {fitnessOptions.map(option => (
            <TouchableOpacity
              style={{
                ...styles.btn,
                backgroundColor: option === fitness ? '#799BDC' : '#FFF',
              }}
              onPress={() => setFitness(option)}>
              <Text
                style={{
                  ...styles.text10,
                  color: option === fitness ? '#FFF' : '#181636',
                }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <View style={styles.bioContainer}>
        <Text style={styles.text7}>Food</Text>
        <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
          {foodOptions.map(option => (
            <TouchableOpacity
              style={{
                ...styles.btn,
                backgroundColor: option === food ? '#799BDC' : '#FFF',
              }}
              onPress={() => setFood(option)}>
              <Text
                style={{
                  ...styles.text10,
                  color: option === food ? '#FFF' : '#181636',
                }}>
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
      <TouchableOpacity onPress={navHandler} style={styles.forwardBtn}>
        <Image
          source={require('../../../../assets/images/arrowRight.png')}
          resizeMode="contain"
          style={{height: scale(40), width: scale(40)}}
        />
      </TouchableOpacity>
      <View style={{height: verticalScale(150)}} />
      <Modal
        isVisible={profileModalVisible}
        onBackdropPress={() => {
          setProfileModalVisible(false);
        }}
        style={{margin: 0}}>
        <FinalScreen userInfo={userInfo} navHandler={reFetch} />
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(16),
    marginTop: verticalScale(10),
  },
  text1: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 14, 19.6, '#000000'),
    marginLeft: scale(16),
  },
  topContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: scale(24),
    marginTop: verticalScale(20),
  },
  progress: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(64),
    backgroundColor: '#e1fae1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text2: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 21, 29.4, '#181636'),
  },
  text3: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 8, 11.2, '#181636'),
  },
  text4: {
    ...tStyle('Manrope-Bold', '600', 'normal', 18, 25.2, '#181636'),
  },
  nameContainerStyle: {
    width: scale(233),
    height: verticalScale(48),
    marginTop: verticalScale(6),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#4F4F4F',
    justifyContent: 'center',
    paddingLeft: scale(16),
  },
  nameText: {
    ...tStyle('Halant-SemiBold', '600', 'normal', 24, 30, '#181636'),
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#E3E3E3',
    marginHorizontal: scale(24),
    marginVertical: verticalScale(20),
  },
  text5: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 16, 22.4, '#181636'),
  },
  text6: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 14, 19.6, '#000000'),
  },
  steps: {
    height: verticalScale(24),
    width: scale(69),
    borderRadius: scale(50),
    backgroundColor: '#FAEFFE',
    justifyContent: 'center',
    alignItems: 'center',
  },
  forwardBtn: {
    position: 'absolute',
    bottom: verticalScale(96),
    alignSelf: 'center',
  },
  bioContainer: {
    borderRadius: scale(16),
    elevation: 2,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    alignSelf: 'center',
    width: scale(312),
    marginTop: verticalScale(27),
    paddingHorizontal: scale(16),
    paddingTop: verticalScale(12),
    paddingBottom: verticalScale(16),
  },
  counter: {
    position: 'absolute',
    right: scale(20),
    bottom: verticalScale(14),
  },
  text7: {
    ...tStyle('Halant-SemiBold', '600', 'normal', 20, 28, '#181636'),
  },
  text8: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 10, 10, '#6D6D6D'),
    marginLeft: scale(7),
  },
  text9: {
    ...tStyle('Manrope-Regular', '600', 'normal', 12, 16.8, '#181636'),
  },
  btn: {
    height: verticalScale(25),
    justifyContent: 'center',
    paddingHorizontal: scale(12),
    borderWidth: 1,
    borderColor: '#799BDC',
    borderRadius: scale(40),
    marginTop: verticalScale(14),
    marginRight: scale(6),
  },
  text10: {
    ...tStyle('Manrope-Regular', '300', 'normal', 12, 16.8, '#000000'),
  },
  imgBtn: {
    height: scale(64),
    width: scale(64),
    borderRadius: scale(64),
    backgroundColor: '#F5FFF3',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: scale(10),
    borderColor: '#c2e0bc',
  },
  text11: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#666666'),
    marginTop: verticalScale(4),
  },
  line: {
    borderBottomWidth: 2,
    borderColor: '#FF7F7F',
    width: scale(64),
    transform: [{rotate: '135deg'}],
    position: 'absolute',
    top: scale(32),
  },
  inputContainer: {
    width: scale(280),
    height: verticalScale(48),
    borderWidth: 1,
    borderColor: '#4F4F4F',
    borderRadius: scale(8),
    marginTop: verticalScale(14),
  },
  text12: {
    ...tStyle('Manrope-Regular', 'bold', 'normal', 16, 18, '#87B2E5'),
  },
});

export default AddDetails;
