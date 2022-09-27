import React, {useState, useEffect, version} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  Modal,
  TouchableOpacity,
  Animated,
  ScrollView,
} from 'react-native';
import {Button, Card, Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import size, {moderateScale, scale, verticalScale} from '../configs/size';
import {tStyle} from '../configs/textStyles';
import colors from '../configs/colors';
import {avatarArray} from '../assets/images/avatars';
import LinearGradient from 'react-native-linear-gradient';
import {Shadow} from 'react-native-shadow-2';
import {useSelector} from 'react-redux';
import {backgroundColors} from '../assets/colors';

const ProfileModal = ({
  username,
  selectedAvatar,
  location,
  answeredQues = [],
  swipeUp,
  swipeDown,
  onPressLike,
  onPressDislike,
  onPressSuperLike,
  index,
  genderImage,
  hideActionButtons,
  closeModal,
}) => {
  const [barHeight, setBarHeight] = useState(0);
  const [barTopMargin, setBarTopMargin] = useState(0);
  const animatediDim = useState(
    new Animated.ValueXY({x: scale(316), y: verticalScale(471)}),
  )[0];
  const animatedPos = useState(new Animated.Value(0))[0];
  const quesFontSize = Animated.divide(animatediDim.x, scale(26.33));
  const ansFontSize = Animated.divide(animatediDim.x, scale(15.8));
  const animatedPos2 = Animated.add(verticalScale(63), animatedPos);
  const superLikePos = Animated.divide(animatediDim.y, verticalScale(13));

  const avatarArray = useSelector(state => state.user.avatarArray);

  const reactions = [
    {
      img: require('../assets/images/like2.png'),
      onPress: onPressLike,
    },
    {
      img: require('../assets/images/superlike2.png'),
      onPress: onPressSuperLike,
    },
    {
      img: require('../assets/images/dislike2.png'),
      onPress: onPressDislike,
    },
  ];

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
      <View
        style={{
          ...styles.imgContainer2,
          backgroundColor: backgroundColors[index % 6],
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

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: backgroundColors[index % 6],
      }}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginHorizontal: scale(18),
          marginVertical: verticalScale(20),
        }}>
        <Icon
          name={'arrow-back'}
          type={'Ionicon'}
          size={moderateScale(24)}
          color={'#000000'}
          onPress={closeModal}
        />
        {/* <Image
          source={require('../assets/images/homeFilter.png')}
          height={scale(20)}
          width={scale(20)}
          style={{
            height: scale(20),
            width: scale(20),
            marginVertical: verticalScale(20),
            alignSelf: 'flex-end',
          }}
          resizeMode="contain"
        /> */}
      </View>
      <Image
        source={require('../assets/images/chance.png')}
        resizeMode="contain"
        style={styles.logo}
      />
      <Shadow
        viewStyle={{
          height: verticalScale(512),
          width: '100%',
        }}
        radius={scale(15)}
        startColor="rgba(0,0,0,0.1)"
        distance={10}
        sides={['top']}>
        <Animated.View
          style={{
            ...styles.container,
            // backgroundColor: backgroundColors[index % 6],
            backgroundColor: '#ffffff',
            // width: animatediDim.x,
            // height: animatediDim.y,
          }}>
          <TouchableOpacity
            style={[
              styles.imgContainer,
              {backgroundColor: backgroundColors[index % 6]},
            ]}>
            <Image
              source={{uri: avatarArray[selectedAvatar].image}}
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
              <Text style={styles.text3}>{location || 'Unkwown'}</Text>
              <Image
                source={genderImage}
                style={{
                  height: verticalScale(12),
                  width: verticalScale(12),
                  marginLeft: scale(8),
                }}
                resizeMode="contain"
              />
            </View>
          </View>
          <View style={styles.row}>
            <ScrollView
              style={styles.bottomContainer}
              onScroll={({nativeEvent}) => {
                console.log('nativeEvent', nativeEvent);
                const {contentOffset, contentSize, layoutMeasurement} =
                  nativeEvent;
                setBarHeight(
                  (
                    (layoutMeasurement.height / contentSize.height) *
                    100
                  ).toFixed(2),
                );
                setBarTopMargin(contentOffset.y / contentSize.height);
              }}
              scrollEventThrottle={500}
              showsVerticalScrollIndicator={false}>
              {answeredQues.map(item => (
                <View
                  style={{
                    borderBottomWidth: answeredQues.indexOf(item) < 3 ? 1 : 0,
                    borderBottomColor: '#e6eaed',
                  }}>
                  {renderQuesType(item.type)}
                  {item.questions.map(ques => (
                    <>
                      <Animated.Text
                        style={{...styles.text5, fontSize: quesFontSize}}>
                        {ques.question}
                      </Animated.Text>
                      <Animated.Text
                        style={{...styles.text6, fontSize: ansFontSize}}>
                        {ques.answer}
                      </Animated.Text>
                    </>
                  ))}
                </View>
              ))}
            </ScrollView>
            <View style={styles.scrollIndicator}>
              <View
                style={[
                  styles.scrollBar,
                  {
                    height: `${barHeight}%`,
                    marginTop: Number(barTopMargin) * verticalScale(370),
                  },
                ]}
              />
            </View>
          </View>
        </Animated.View>
      </Shadow>
      <Card
        containerStyle={styles.reactionsCont}
        wrapperStyle={styles.reactionsWrap}>
        {!hideActionButtons &&
          reactions.map(item => (
            <TouchableOpacity onPress={item.onPress}>
              <Image
                source={item.img}
                height={verticalScale(46)}
                width={scale(46)}
                style={{height: verticalScale(46), width: scale(46)}}
                resizeMode="contain"
              />
            </TouchableOpacity>
          ))}
      </Card>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
    width: '100%',
    height: verticalScale(516),
  },
  logo: {
    height: verticalScale(33),
    width: scale(72),
    position: 'absolute',
    top: verticalScale(12),
    alignSelf: 'center',
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
    ...tStyle('Halant-SemiBold', '600', 'normal', 24, 30, '#1B1B21'),
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
    marginRight: scale(21),
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
    ...tStyle('Manrope-Bold', '600', 'normal', 10, 12.5, '#181636'),
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
  reactionsCont: {
    width: scale(360),
    height: verticalScale(68),
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
    backgroundColor: '#ffffff',
    alignSelf: 'flex-start',
    marginLeft: 0,
    position: 'absolute',
    bottom: 0,
    paddingHorizontal: 0,
  },
  reactionsWrap: {
    flex: 1,
    width: '100%',
    marginHorizontal: 0,
    marginLeft: 0,
    paddingHorizontal: scale(63),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    paddingHorizontal: scale(24),
    paddingRight: scale(15),
  },
  scrollIndicator: {
    height: verticalScale(370),
    width: scale(2),
    borderRadius: scale(24),
    backgroundColor: '#cccccc',
    alignItems: 'center',
    marginTop: verticalScale(93),
  },
  scrollBar: {
    width: scale(4),
    borderRadius: scale(17),
    backgroundColor: '#6d6d6d',
  },
});

export default ProfileModal;
