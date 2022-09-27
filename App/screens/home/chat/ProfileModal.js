import React, {useState, useEffect, useCallback} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {useFocusEffect} from '@react-navigation/native';
import Carousel from 'react-native-snap-carousel';

import {scale, verticalScale} from '../../../configs/size';
import {tStyle} from '../../../configs/textStyles';
import {useSelector} from 'react-redux';
import {apiUrl, tempUrl} from '../../../configs/constants';

const ProfileModal = ({currentChatUser, navigate, getMatches}) => {
  const [tabSelected, setTabSelected] = useState('Anonymous');
  const [answeredQues, setAnsweredQues] = useState([]);
  const [revealRequested, setRevealRequested] = useState(false);
  const [userRequesting, setUserRequesting] = useState('');
  const [isRevealed, setIsRevealed] = useState(false);

  const avatarArray = useSelector(state => state.user.avatarArray);
  const token = useSelector(state => state.user.token);
  const me = useSelector(state => state.user.data);
  const userAnswers = currentChatUser?.matchedUser?.userAnswers || [];
  const avatar = currentChatUser?.matchedUser?.avatar || 10;
  const realProfile = currentChatUser?.matchedUser?.realProfile;
  const basicDetails = realProfile?.basicDetails;
  const profilePicsArray = realProfile?.photos.split(',');

  // console.log('currentChatuser', basicDetails);

  useFocusEffect(
    useCallback(() => {
      if (!currentChatUser?.revealRequest) setRevealRequested(false);
      if (currentChatUser?.revealRequest?.responseStatus == 'pending') {
        setRevealRequested(true);
        setUserRequesting(
          currentChatUser?.revealRequest?.reqFrom == me?.id ? 'me' : 'them',
        );
      }
      if (currentChatUser?.isRevealed) setIsRevealed(true);
    }, [currentChatUser]),
  );

  const requestReveal = async () => {
    if (!me?.realProfile || !Object.keys(me?.realProfile).length)
      Alert.alert('Not yet!', 'Create your public profile first.', [
        {text: 'OK', onPress: navigate},
      ]);
    else {
      try {
        const res = await fetch(`${apiUrl}/profile/request`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            userId: currentChatUser?.matchedUser?.id,
          }),
        });
        const data = await res.json();
        if (data?.error) {
          console.log(data);
          alert(data?.error?.message || 'Error requesting!');
          throw new Error('Error');
        }
        getMatches();
      } catch (err) {
        console.log('err', err);
      }
    }
  };

  const reqResponse = async res => {
    if (
      res == 'accept' &&
      (!me?.realProfile || !Object.keys(me?.realProfile).length)
    ) {
      Alert.alert('Not yet!', 'Create your public profile first.', [
        {text: 'OK', onPress: navigate},
      ]);
    } else {
      try {
        const body = {
          userId: currentChatUser?.matchedUser?.id,
          response: res,
        };
        const response = await fetch(`${apiUrl}/profile/request`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(body),
        });
        getMatches(res);
      } catch (err) {
        console.log('err', err);
      }
    }
  };

  useEffect(() => {
    var qna = [];
    userAnswers.forEach(item => {
      var type = 'Values & Opinion';
      if (item?.question?.category == 'RELATIONSHIP FOCUSED')
        type = 'Light Hearted';
      if (item?.question?.category == 'CASUAL') type = 'Casual';
      qna.push({
        ques: item?.question?.question,
        ans: item?.answer,
        type,
      });
    });
    setAnsweredQues(qna);
  }, []);

  const userInfo = {
    name: 'Angelina',
    age: 25,
    details: {
      gender: 'Female',
      smoking: 'No',
      fitness: 'Active',
      height: "5'4",
      education: 'XYZ University',
      food: 'Non Vegetarian',
      drinking: 'Occasionally',
    },
  };

  const renderQuesType = quesType => {
    var imagePath;
    var textToShow;
    if (quesType === 'Casual') {
      imagePath = require('../../../assets/images/casual.png');
      textToShow = 'Casual';
    }
    if (quesType === 'Light Hearted') {
      imagePath = require('../../../assets/images/heart.png');
      textToShow = 'Light Hearted';
    }
    if (quesType === 'Values & Opinion') {
      imagePath = require('../../../assets/images/values.png');
      textToShow = 'Values & Opinion';
    }
    return (
      <View
        style={{
          ...styles.imgContainer2,
          backgroundColor: avatarArray[avatar].backgroundColor,
        }}>
        <Image
          source={imagePath}
          style={{
            height: verticalScale(12),
            width: verticalScale(12),
            marginLeft: quesType === 'values' ? 5 : 0,
          }}
        />
        <Text
          style={{
            ...styles.text4,
          }}>
          {textToShow}
        </Text>
      </View>
    );
  };

  const getIcon = key => {
    if (key == 'gender') {
      const gender = userInfo.details[key].toLowerCase();
      if (gender === 'male')
        return (
          <Icon
            type="ionicon"
            name="male-outline"
            color="#000000"
            size={scale(14)}
          />
        );
      if (gender === 'female')
        return (
          <Icon
            type="ionicon"
            name="female-outline"
            color="#000000"
            size={scale(14)}
          />
        );
      return (
        <Icon
          type="ionicon"
          name="male-female-outline"
          color="#000000"
          size={scale(14)}
        />
      );
    }
    if (key == 'smoking')
      return (
        <Icon
          type="ionicon"
          name="brush-outline"
          color="#000000"
          size={scale(14)}
        />
      );
    if (key == 'fitness')
      return (
        <Icon
          type="ionicon"
          name="barbell-outline"
          color="#000000"
          size={scale(14)}
        />
      );
    if (key == 'height')
      return (
        <Icon
          type="ionicon"
          name="man-outline"
          color="#000000"
          size={scale(14)}
        />
      );
    if (key == 'education')
      return (
        <Icon
          type="ionicon"
          name="school-outline"
          color="#000000"
          size={scale(14)}
        />
      );
    if (key == 'food')
      return (
        <Icon
          type="ionicon"
          name="restaurant-outline"
          color="#000000"
          size={scale(14)}
        />
      );
    if (key == 'drinking')
      return (
        <Icon
          type="ionicon"
          name="wine-outline"
          color="#000000"
          size={scale(14)}
        />
      );
  };

  return (
    <View
      style={{
        ...styles.container,
        backgroundColor: isRevealed ? '#EEF9FD' : '#fff',
      }}>
      {isRevealed && (
        <View style={styles.tabContainer}>
          {['Anonymous', 'Revealed'].map(tab => {
            const focused = tab === tabSelected;
            return (
              <TouchableOpacity
                onPress={() => setTabSelected(tab)}
                style={{
                  ...styles.tabBtn,
                  backgroundColor: focused ? '#87B2E5' : '#FFF',
                }}>
                <Text
                  style={{
                    ...styles.tabText,
                    color: focused ? '#FFF' : '#181636',
                  }}>
                  {tab}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>
      )}
      {tabSelected === 'Anonymous' ? (
        <View style={styles.card}>
          <ScrollView
            contentContainerStyle={{flexGrow: 1}}
            showsVerticalScrollIndicator={false}>
            <View
              style={{
                ...styles.imgContainer,
                backgroundColor: avatarArray[avatar].backgroundColor,
              }}>
              <Image
                source={{uri: avatarArray[avatar].image}}
                resizeMode="contain"
                style={{height: verticalScale(60), width: scale(50)}}
              />
            </View>
            <View style={styles.detailsContainer}>
              <Text style={styles.text1}>
                {currentChatUser?.matchedUser?.username || ''}
              </Text>
              <View style={[styles.wrapper, {marginLeft: scale(2)}]}>
                <Image
                  source={require('../../../assets/images/active.png')}
                  style={{height: verticalScale(6), width: verticalScale(6)}}
                />
                <Text style={styles.text2}>Recently Active</Text>
              </View>
              <View style={styles.wrapper}>
                <Icon
                  type="ionicon"
                  name="location"
                  color="#000000"
                  size={verticalScale(10)}
                />
                <Text style={styles.text3}>
                  {currentChatUser?.matchedUser?.city || 'Unknown'}
                </Text>
              </View>
            </View>
            <View style={styles.bottomContainer}>
              {answeredQues.map(item => (
                <View style={styles.qnaQrapper}>
                  {renderQuesType(item.type)}
                  <Text style={styles.text5}>{item.ques}</Text>
                  <Text style={styles.text6} numberOfLines={2}>
                    {item.ans}
                  </Text>
                </View>
              ))}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View style={styles.revealedContaier}>
          <ScrollView contentContainerStyle={{flexGrow: 1}}>
            <Text style={styles.text8}>
              {realProfile?.name}
              {/* , {realProfile.age} */}
            </Text>
            <Carousel
              data={profilePicsArray}
              renderItem={({item}) => {
                console.log('p', item);
                return (
                  <Image
                    source={{uri: item}}
                    style={styles.profileImage}
                    resizeMode="cover"
                  />
                );
              }}
              sliderWidth={scale(320)}
              itemWidth={scale(320)}
            />
            <Text style={styles.text9}>{realProfile?.bio || ''}</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginTop: verticalScale(10),
              }}>
              {basicDetails
                ? Object.keys(basicDetails).map(key => {
                    if (!basicDetails[key]) return null;
                    var textToShow = basicDetails[key];
                    if (key == 'height')
                      textToShow =
                        basicDetails[key]?.feet +
                        "'" +
                        basicDetails[key]?.inches;
                    if (key == 'smoking' || key == 'drinking')
                      textToShow = basicDetails[key] ? 'Yes' : 'No';
                    return (
                      <View style={styles.detailsWrapper}>
                        {getIcon(key)}
                        <Text style={styles.text10}>{textToShow}</Text>
                      </View>
                    );
                  })
                : null}
            </View>
            <Text style={styles.text11}>
              {realProfile?.name
                ? realProfile?.name + 'can also view your public profile'
                : ''}
            </Text>
          </ScrollView>
        </View>
      )}
      {isRevealed ? null : revealRequested ? (
        userRequesting == 'me' ? (
          <View style={styles.btn}>
            <Text style={styles.text7}>Profile view requested</Text>
          </View>
        ) : (
          <View style={styles.btnWrapper}>
            <TouchableOpacity
              style={styles.declineBtn}
              onPress={() => reqResponse('reject')}>
              <Icon
                type="ionicon"
                name="close-circle"
                color="#D23535"
                size={scale(14)}
              />
              <Text style={styles.declineText}>Decline</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.acceptBtn}
              onPress={() => reqResponse('accept')}>
              <Icon
                type="ionicon"
                name="checkmark-circle"
                color="#25CB71"
                size={scale(14)}
              />
              <Text style={styles.acceptText}>Accept</Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <TouchableOpacity style={styles.btn} onPress={requestReveal}>
          <Text style={styles.text7}>Request Profile View</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: verticalScale(583),
    backgroundColor: '#fff',
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
    paddingTop: verticalScale(24),
    paddingHorizontal: scale(20),
  },
  card: {
    height: verticalScale(455),
    width: scale(320),
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
    backgroundColor: '#fff',
    borderRadius: scale(16),
  },
  imgContainer: {
    position: 'absolute',
    top: verticalScale(12),
    left: scale(13),
    height: scale(80),
    width: scale(80),
    borderRadius: scale(40),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  detailsContainer: {
    position: 'absolute',
    top: verticalScale(22),
    left: scale(105),
  },
  wrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: verticalScale(4),
  },
  text1: {
    ...tStyle('Halant-SemiBold', '600', 'normal', 24, 29, '#1B1B21'),
  },
  text2: {
    ...tStyle('Manrope', '500', 'normal', 10, 12.5, '#18163666'),
    marginLeft: scale(4),
  },
  text3: {
    ...tStyle('Manrope', '500', 'normal', 12, 15, '#181636'),
    marginLeft: scale(4),
  },
  bottomContainer: {
    flex: 1,
    marginTop: verticalScale(90),
    marginLeft: scale(13),
    marginRight: scale(7),
    paddingLeft: scale(4),
    paddingRight: scale(30),
    overflow: 'hidden',
  },
  text4: {
    ...tStyle('Manrope-Bold', '600', 'normal', 10, 10, '#181636'),
    marginLeft: scale(4),
  },
  text5: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#000000'),
    marginTop: verticalScale(14),
  },
  text6: {
    ...tStyle('Halant-SemiBold', '500', 'normal', 20, 27, '#181636'),
    marginVertical: verticalScale(10),
  },
  qnaQrapper: {
    borderBottomWidth: 1,
    borderBottomColor: '#e6eaed',
  },
  imgContainer2: {
    alignSelf: 'flex-start',
    height: verticalScale(21),
    borderRadius: scale(40),
    padding: scale(4),
    paddingHorizontal: scale(8),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginTop: verticalScale(12),
  },
  btn: {
    width: scale(300),
    height: verticalScale(50),
    borderRadius: scale(8),
    backgroundColor: '#87B2E5',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(24),
  },
  btnWrapper: {
    width: scale(300),
    height: verticalScale(50),
    marginTop: verticalScale(24),
    flexDirection: 'row',
    alignSelf: 'center',
  },
  declineBtn: {
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    backgroundColor: '#FFF0F0',
    flex: 1,
    borderTopLeftRadius: scale(8),
    borderBottomLeftRadius: scale(8),
  },
  acceptBtn: {
    justifyContent: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EAFFEA',
    flex: 1,
    borderTopRightRadius: scale(8),
    borderBottomRightRadius: scale(8),
  },
  declineText: {
    ...tStyle('Manrope-Refular', '500', 'normal', 14, 18.8, '#D23535'),
    marginLeft: scale(4),
  },
  acceptText: {
    ...tStyle('Manrope-Refular', '500', 'normal', 14, 18.8, '#25CB71'),
    marginLeft: scale(4),
  },
  text7: {
    ...tStyle('Manrope-Bold', '700', 'normal', 16, 21.8, '#fff'),
  },
  tabContainer: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    height: verticalScale(49),
    width: scale(328),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'space-around',
    marginBottom: verticalScale(24),
  },
  tabBtn: {
    width: scale(148),
    height: verticalScale(35),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(8),
  },
  tabText: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 16, 22.4, '#181636'),
  },
  revealedContaier: {
    backgroundColor: '#fff',
    flex: 1,
    borderTopRightRadius: scale(20),
    borderTopLeftRadius: scale(15),
    marginHorizontal: scale(-20),
    paddingHorizontal: scale(20),
  },
  text8: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 20, 20, '#000000'),
    marginTop: verticalScale(32),
  },
  profileImage: {
    height: scale(320),
    width: scale(320),
    borderRadius: scale(24),
    marginTop: verticalScale(12),
  },
  text9: {
    ...tStyle('Manrope-Regular', '400', 'normal', 12, 16.8, '#24232C'),
    marginTop: verticalScale(26),
  },
  text10: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 12, 16.8, '#24232C'),
    marginLeft: scale(6),
  },
  text11: {
    ...tStyle('Manrope-Regular', '400', 'normal', 12, 16.8, '#848080'),
    marginTop: verticalScale(17),
    alignSelf: 'center',
    marginBottom: verticalScale(24),
  },
  detailsWrapper: {
    height: verticalScale(21),
    paddingHorizontal: scale(12),
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: scale(8),
    backgroundColor: '#D5E8FE',
    borderRadius: scale(30),
    marginTop: verticalScale(10),
  },
});

export default ProfileModal;
