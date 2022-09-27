import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  Text,
  Modal,
  StyleSheet,
  TouchableWithoutFeedback,
  Image,
} from 'react-native';
import {scale, verticalScale} from '../../../configs/size';
import {SafeAreaView} from 'react-native-safe-area-context';
import Swiper from '../../../components/Swiper';
import {useSelector} from 'react-redux';

import {tStyle} from '../../../configs/textStyles';
import ProfileCard from '../../../components/ProfileCard';
import MatchModal from '../../../components/MatchModal';
import {apiUrl} from '../../../configs/constants';
import {useFocusEffect} from '@react-navigation/native';

const Profiles = ({navigation}) => {
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showModal, setShowModal] = useState(false);
  const [boldMoveCount, setBoldMoveCount] = useState(2);
  const [profilesArray, setProfilesArray] = useState([]);
  const [remainingProfiles, setRemainingProfiles] = useState([]);
  const [count, setCount] = useState(0);
  const [matchDetails, setMatchDetails] = useState({
    showModal: false,
    avatar1: '0',
    avatar2: '0',
  });

  const token = useSelector(state => state.user.token);
  const me = useSelector(state => state.user.data);

  const swipeAction = async (type = 'skip', id, index, userAvatar) => {
    const body = {
      swipeMode: type,
      swipedUserId: id,
    };
    try {
      const res = await fetch(`${apiUrl}/matches/user-action`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      setCurrentCardIndex(currentCardIndex + 1);
      if (boldMoveCount) setBoldMoveCount(data?.superlikeCount);
      if (data?.matched) {
        setMatchDetails({
          showModal: true,
          avatar1: me?.avatar || 0,
          avatar2: data?.match?.matchedUser?.avatar,
        });
        setTimeout(() => {
          setMatchDetails({...matchDetails, showModal: false});
          navigation.navigate('Chat', {
            screen: 'ChatList',
            params: {
              showChatBox: true,
              matchedUser: data?.match,
            },
          });
        }, 1400);
      }
    } catch (err) {
      console.log('err', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (currentCardIndex % 22 == 0) {
        const filter = encodeURI(
          JSON.stringify({exclude: remainingProfiles, limit: 25}),
        );
        fetch(`${apiUrl}/match/suggestions?filter=${filter}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        })
          .then(res => res.json())
          .then(data => {
            var tempArr = profilesArray;
            var tempArr2 = remainingProfiles;
            data.forEach(user => {
              var qna = [];
              const userAnswers = user?.userAnswers || [];
              userAnswers.forEach(item => {
                let type = '';
                if (item?.category == 'VALUES') {
                  type = 'Values & Opinion';
                } else if (item?.category == 'RELATIONSHIP FOCUSED') {
                  type = 'Light Hearted';
                } else {
                  type = 'Casual';
                }
                qna.push({
                  ...item,
                  type,
                });
              });
              console.log('user', user);
              tempArr.push({
                username: user?.username,
                selectedAvatar: user?.avatar || '0',
                id: user?.id,
                location: user?.city || 'unknown',
                userAnswers: qna,
                gender: user?.gender || '',
              });
              tempArr2.push(user?.id);
            });
            setProfilesArray(tempArr);
            setRemainingProfiles(tempArr2);
            setCount(count + 1);
          })
          .catch(err => console.log('err', err));
      }
    }, [currentCardIndex]),
  );

  useEffect(() => {
    if (currentCardIndex === 0) setShowModal(false);
  }, []);

  const swiperRef = useRef();
  const renderItem = (item, index) => {
    const user = profilesArray[index];
    return (
      <ProfileCard
        username={user.username}
        selectedAvatar={user.selectedAvatar}
        answeredQues={user.userAnswers}
        location={user.location}
        changeThreshold={() => setThreshold(160)}
        swipeUp={() => swiperRef.current.swipeTop()}
        swipeDown={() => swiperRef.current.swipeBottom()}
        boldMoveCount={boldMoveCount}
        changeBoldMoveCount={() => {
          if (boldMoveCount > 0) setBoldMoveCount(boldMoveCount - 1);
        }}
        topSwipe={item.topSwipe}
        downSwipe={item.downSwipe}
        index={index}
        currentCardIndex={currentCardIndex}
        id={user.id}
        swipeAction={swipeAction}
        gender={user.gender}
        enablePanResponder={item.enablePanResponder}
        disablePanResponder={item.disablePanResponder}
      />
    );
  };

  return (
    <View>
      {currentCardIndex < profilesArray.length ? (
        <Swiper
          ref={swiperRef}
          cards={profilesArray}
          renderCard={renderItem}
          stackSize={10}
          horizontalSwipe={false}
          infinite={false}
          backgroundColor="#ffffff"
          stackSeparation={verticalScale(12)}
          verticalThreshold={80}
          swipeAnimationDuration={200}
          onSwiped={() => {
            setCurrentCardIndex(currentCardIndex + 1);
            var tempArr = remainingProfiles;
            tempArr.splice(0, 1);
            setRemainingProfiles(tempArr);
          }}
          onSwipedTop={() => {
            swipeAction(
              'like',
              profilesArray[currentCardIndex].id,
              currentCardIndex,
              profilesArray[currentCardIndex].selectedAvatar,
            );
          }}
          onSwipedBottom={() => {
            swipeAction(
              'skip',
              profilesArray[currentCardIndex].id,
              currentCardIndex,
              profilesArray[currentCardIndex].selectedAvatar,
            );
          }}
        />
      ) : (
        <View style={styles.noPofileContainer}>
          <Image
            source={require('../../../assets/images/noprofiles.gif')}
            style={styles.anime}
          />
          <Text style={styles.text2}>
            We’re finding more profiles around you
          </Text>
          <View style={{flexDirection: 'row'}}>
            <Text style={styles.text3}>To change preferences </Text>
            <Text
              style={styles.text4}
              onPress={() => {
                navigation.navigate('Profile', {screen: 'Anonymous'});
              }}>
              tap here
            </Text>
          </View>
        </View>
      )}
      <Modal visible={showModal} transparent={true}>
        <TouchableWithoutFeedback onPress={() => setShowModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.wrapper}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../../assets/images/up.png')}
                  style={styles.img}
                />
                <Text style={styles.txt}>Swipe up to like</Text>
              </View>
            </View>
            <View style={styles.wrapper}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../../assets/images/up.png')}
                  style={styles.img}
                />
                <Text style={styles.txt}>Double tap for bold move</Text>
              </View>
            </View>
            <View style={{...styles.wrapper, borderBottomWidth: 0}}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Image
                  source={require('../../../assets/images/down.png')}
                  style={styles.img}
                />
                <Text style={styles.txt}>Swipe down to dislike</Text>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
      <Modal
        visible={matchDetails.showModal}
        transparent={true}
        onRequestClose={() =>
          setMatchDetails({...matchDetails, showModal: false})
        }>
        <MatchModal
          avatar1={matchDetails.avatar1}
          avatar2={matchDetails.avatar2}
          hideModal={() => setMatchDetails({...matchDetails, showModal: false})}
        />
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000D9',
  },
  wrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#FFFFFF',
    borderStyle: 'dashed',
  },
  txt: {
    ...tStyle('Manrope', '600', 'normal', 16, 20, '#FFFFFF'),
  },
  img: {
    height: verticalScale(20),
    width: scale(18.84),
    marginRight: scale(8),
  },
  noPofileContainer: {
    alignSelf: 'center',
    alignItems: 'center',
    marginTop: verticalScale(200),
  },
  anime: {
    height: scale(140),
    width: scale(140),
  },
  text2: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 16, 20, '#181636CC'),
    marginTop: verticalScale(8),
  },
  text3: {
    ...tStyle('Manrope', '400', 'normal', 12, 15, '#171434'),
    marginTop: verticalScale(8),
  },
  text4: {
    ...tStyle('Manrope', '400', 'normal', 12, 15, '#86b3e6'),
    marginTop: verticalScale(8),
  },
});

export default Profiles;
