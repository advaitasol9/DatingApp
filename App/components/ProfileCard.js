import React, {useState, useEffect, version, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  TouchableWithoutFeedback,
  PanResponder,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import size, {moderateScale, scale, verticalScale} from '../configs/size';
import {tStyle} from '../configs/textStyles';
import colors from '../configs/colors';
import LinearGradient from 'react-native-linear-gradient';
import ProfileModal from './ProfileModal';
import {useSelector} from 'react-redux';
import {backgroundColors} from '../assets/colors';

const ProfileCard = ({
  username,
  selectedAvatar,
  location,
  answeredQues = [],
  id,
  swipeAction,
  swipeUp,
  swipeDown,
  boldMoveCount,
  changeBoldMoveCount,
  topSwipe = false,
  downSwipe = false,
  index,
  currentCardIndex = 0,
  gender,
  hideActionButtons = false,
  enablePanResponder,
  disablePanResponder,
}) => {
  const [showLikeGradient, setShowLikeGradient] = useState(false);
  const [showDislikeGradient, setShowDislikeGradient] = useState(false);
  const [showSuperLikeGr, setShowSuperLikeGr] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showBoldMoveModal, setShowBoldMoveModal] = useState(false);
  const animatediDim = useState(
    new Animated.ValueXY({x: scale(316), y: verticalScale(455)}),
  )[0];
  const animatedPos = useState(new Animated.Value(0))[0];
  const quesFontSize = Animated.divide(animatediDim.x, scale(26.33));
  const ansFontSize = Animated.divide(animatediDim.x, scale(15.8));
  const animatedPos2 = Animated.add(verticalScale(80), animatedPos);
  const superLikePos = Animated.divide(animatediDim.y, verticalScale(13));

  const avatarArray = useSelector(state => state.user.avatarArray);

  const [lastTap, setLastTap] = useState(0);
  const [timeoutRef, setTimeoutRef] = useState();
  const DOUBLE_PRESS_DELAY = 400;

  useEffect(() => {
    if (showProfileModal) disablePanResponder && disablePanResponder();
    else enablePanResponder && enablePanResponder();
  }, [showProfileModal]);

  const handleTap = () => {
    const timeNow = Date.now();
    if (lastTap && timeNow - lastTap < DOUBLE_PRESS_DELAY) {
      showSuperLikeAnimation();
      clearTimeout(timeoutRef);
    } else {
      setLastTap(timeNow);
      const timeout = setTimeout(() => {
        setShowProfileModal(true);
      }, 500);
      setTimeoutRef(timeout);
    }
  };

  const showLikeAnimation = () => {
    setShowLikeGradient(true);
    Animated.timing(animatedPos, {
      toValue: verticalScale(30),
      duration: 300,
      useNativeDriver: false,
    }).start();
    setTimeout(
      () =>
        Animated.timing(animatediDim, {
          toValue: {x: scale(242), y: verticalScale(344)},
          duration: 300,
          useNativeDriver: false,
        }).start(),
      300,
    );
    setTimeout(
      () =>
        Animated.timing(animatedPos, {
          toValue: verticalScale(-400),
          duration: 300,
          useNativeDriver: false,
        }).start(),
      400,
    );
    setTimeout(swipeUp, 700);
  };

  const showDislikeAnimation = () => {
    setShowDislikeGradient(true);
    Animated.timing(animatedPos, {
      toValue: verticalScale(-30),
      duration: 300,
      useNativeDriver: false,
    }).start();
    setTimeout(
      () =>
        Animated.timing(animatediDim, {
          toValue: {x: scale(242), y: verticalScale(344)},
          duration: 300,
          useNativeDriver: false,
        }).start(),
      300,
    );
    setTimeout(
      () =>
        Animated.timing(animatedPos, {
          toValue: verticalScale(600),
          duration: 300,
          useNativeDriver: false,
        }).start(),
      400,
    );
    setTimeout(swipeDown, 700);
  };

  const showSuperLikeAnimation = () => {
    if (boldMoveCount > 0) {
      setShowModal(true);
      setShowSuperLikeGr(true);
      Animated.timing(animatedPos, {
        toValue: verticalScale(85),
        duration: 600,
        useNativeDriver: false,
      }).start();
      Animated.timing(animatediDim, {
        toValue: {x: scale(242), y: verticalScale(344)},
        duration: 600,
        useNativeDriver: false,
      }).start();
      setTimeout(
        () =>
          Animated.timing(animatedPos, {
            toValue: verticalScale(-450),
            duration: 300,
            useNativeDriver: false,
          }).start(),
        900,
      );
      setTimeout(() => {
        swipeUp();
        swipeAction('superLike', id, currentCardIndex, selectedAvatar);
        changeBoldMoveCount();
      }, 1200);
    } else {
      setShowBoldMoveModal(true);
    }
  };

  const onPressLike = () => {
    setShowProfileModal(false);
    showLikeAnimation();
  };

  const onPressSuperLike = () => {
    setShowProfileModal(false);
    showSuperLikeAnimation();
  };

  const onPressDislike = () => {
    setShowProfileModal(false);
    showDislikeAnimation();
  };

  const getGenderImage = useMemo(() => {
    if (gender == 'male') {
      return require('../assets/images/male-icon.png');
    } else if (gender == 'female') {
      return require('../assets/images/female-icon.png');
    } else {
      return require('../assets/images/non-binary-icon.png');
    }
  }, [gender]);

  const renderQuesType = quesType => {
    var imagePath;
    var textToShow;
    if (quesType === 'Casual') {
      imagePath = require('../assets/images/casual.png');
      textToShow = 'Casual';
    }
    if (quesType === 'Light Hearted') {
      imagePath = require('../assets/images/heart.png');
      textToShow = 'Light Hearted';
    }
    if (quesType === 'Values & Opinion') {
      imagePath = require('../assets/images/values.png');
      textToShow = 'Values & Opinion';
    }
    return (
      <View style={styles.imgContainer2}>
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

  return avatarArray.length === 0 ? null : (
    <Animated.View
      style={{
        ...styles.container,
        backgroundColor: backgroundColors[index % 6],
        maxWidth: animatediDim.x,
        maxHeight: animatediDim.y,
        position: 'absolute',
        top: animatedPos,
      }}>
      <View style={styles.imgContainer}>
        <Image
          source={{uri: avatarArray[selectedAvatar]?.image}}
          resizeMode="contain"
          style={{height: verticalScale(60), width: scale(50)}}
        />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={styles.text1}>{username}</Text>
        <View style={[styles.wrapper, {marginLeft: scale(2)}]}>
          <Image
            source={require('../assets/images/active.png')}
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
          <Text style={styles.text3}>{location || 'Unknown'}</Text>
          <Image
            source={getGenderImage}
            style={{
              height: verticalScale(12),
              width: verticalScale(12),
              marginLeft: scale(8),
            }}
            resizeMode="contain"
          />
        </View>
      </View>
      <TouchableWithoutFeedback onPress={handleTap}>
        <View style={styles.bottomContainer}>
          {answeredQues.map(item => (
            <View style={styles.qnaQrapper}>
              {renderQuesType(item.type)}
              {item.questions.map(ques => (
                <>
                  <Animated.Text
                    style={{...styles.text5, fontSize: quesFontSize}}>
                    {ques.question}
                  </Animated.Text>
                  <Animated.Text
                    style={{...styles.text6, fontSize: ansFontSize}}
                    numberOfLines={2}>
                    {ques.answer}
                  </Animated.Text>
                </>
              ))}
            </View>
          ))}
        </View>
      </TouchableWithoutFeedback>
      {showLikeGradient || (topSwipe && index === currentCardIndex) ? (
        <LinearGradient
          colors={['#FFFFFF00', '#CEFFD6']}
          style={styles.likeOverlay}>
          <Image
            source={require('../assets/images/like.png')}
            style={styles.overlayBtn}
          />
        </LinearGradient>
      ) : null}
      {showDislikeGradient || (downSwipe && index === currentCardIndex) ? (
        <LinearGradient
          colors={['#FFFFFF00', '#FFCECE']}
          style={styles.likeOverlay}>
          <Image
            source={require('../assets/images/dislike.png')}
            style={styles.overlayBtn}
          />
        </LinearGradient>
      ) : null}
      {showSuperLikeGr ? (
        <LinearGradient
          colors={['#FFFFFF00', '#FFDCBC']}
          style={styles.likeOverlay}>
          <Animated.Image
            source={require('../assets/images/superlike.png')}
            style={{
              ...styles.overlayBtn,
              height: superLikePos,
              width: superLikePos,
              bottom: superLikePos,
            }}
          />
        </LinearGradient>
      ) : null}

      <Modal visible={showModal} transparent={true}>
        <View style={styles.overlayContainer}>
          <Animated.View
            style={{
              ...styles.container,
              backgroundColor: avatarArray[selectedAvatar]?.backgroundColor,
              maxWidth: animatediDim.x,
              maxHeight: animatediDim.y,
              position: 'absolute',
              top: animatedPos2,
            }}>
            <TouchableOpacity style={styles.imgContainer}>
              <Image
                source={{uri: avatarArray[selectedAvatar]?.image}}
                resizeMode="contain"
                style={{height: verticalScale(60), width: scale(50)}}
              />
            </TouchableOpacity>
            <View style={styles.detailsContainer}>
              <Text style={styles.text1}>{username}</Text>
              <View style={[styles.wrapper, {marginLeft: scale(2)}]}>
                <Image
                  source={require('../assets/images/active.png')}
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
                <Text style={styles.text3}>{location || 'Unknown'}</Text>
              </View>
            </View>
            <View style={styles.bottomContainer}>
              {answeredQues.map(item => (
                <View style={styles.qnaQrapper}>
                  {renderQuesType(item.type)}
                  {item.questions.map(ques => (
                    <>
                      <Animated.Text
                        style={{...styles.text5, fontSize: quesFontSize}}>
                        {ques.question}
                      </Animated.Text>
                      <Animated.Text
                        style={{...styles.text6, fontSize: ansFontSize}}
                        numberOfLines={2}>
                        {ques.answer}
                      </Animated.Text>
                    </>
                  ))}
                </View>
              ))}
            </View>
            <LinearGradient
              colors={['#FFFFFF00', '#FFDCBC']}
              style={styles.likeOverlay}>
              <Animated.Image
                source={require('../assets/images/superlike.png')}
                style={{
                  ...styles.overlayBtn,
                  height: superLikePos,
                  width: superLikePos,
                  bottom: superLikePos,
                }}
              />
            </LinearGradient>
          </Animated.View>
        </View>
      </Modal>
      <Modal
        visible={showProfileModal}
        onRequestClose={() => {
          setShowProfileModal(false);
        }}>
        <ProfileModal
          username={username}
          selectedAvatar={selectedAvatar}
          location={location}
          answeredQues={answeredQues}
          onPressLike={onPressLike}
          onPressDislike={onPressDislike}
          onPressSuperLike={onPressSuperLike}
          index={index}
          genderImage={getGenderImage}
          hideActionButtons={hideActionButtons}
          closeModal={() => {
            setShowProfileModal(false);
          }}
        />
      </Modal>
      <Modal
        visible={showBoldMoveModal}
        transparent={true}
        onRequestClose={() => setShowBoldMoveModal(false)}>
        <TouchableWithoutFeedback onPress={() => setShowBoldMoveModal(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.wrapper2}>
              <Image
                source={require('../assets/images/superlike.png')}
                style={styles.img2}
              />
              <Text style={styles.txt2}>0 Bold moves left</Text>
              <Text style={styles.txt3}>
                You’ll get another bold move tomorrow :)
              </Text>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'center',
    borderRadius: scale(12.1),
    elevation: 1,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    paddingBottom: verticalScale(10),
    overflow: 'hidden',
    minHeight: verticalScale(455),
    minWidth: scale(320),
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
    marginBottom: verticalScale(2),
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
    marginLeft: scale(1),
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
  likeOverlay: {
    flex: 1,
    width: '100%',
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  overlayBtn: {
    height: verticalScale(36),
    width: verticalScale(36),
    alignSelf: 'center',
    position: 'absolute',
    bottom: verticalScale(31),
  },
  overlayContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
    backgroundColor: '#00000070',
  },
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000D9',
  },
  wrapper2: {
    position: 'absolute',
    bottom: 0,
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
    backgroundColor: '#fff',
    width: '100%',
    alignItems: 'center',
  },
  img2: {
    height: scale(36),
    width: scale(36),
    marginTop: verticalScale(16),
    marginBottom: verticalScale(8),
  },
  txt2: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 16, 20, '#181636CC'),
    marginBottom: verticalScale(8),
  },
  txt3: {
    ...tStyle('Manrope', '400', 'normal', 12, 15, '#181636CC'),
    marginBottom: verticalScale(16),
  },
});

export default ProfileCard;
