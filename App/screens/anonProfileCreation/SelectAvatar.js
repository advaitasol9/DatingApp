import React, {useState, useEffect, useRef, useMemo} from 'react';
import {
  StyleSheet,
  Text,
  Image,
  View,
  TouchableOpacity,
  FlatList,
} from 'react-native';
import {Icon} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import size, {moderateScale, scale, verticalScale} from '../../configs/size';
import {tStyle} from '../../configs/textStyles';
import colors from '../../configs/colors';
import {useSelector, useDispatch} from 'react-redux';

import {fetchAvatars} from '../../store/actions/userAction';

function shuffle(array) {
  let currentIndex = array.length,
    randomIndex;

  // While there remain elements to shuffle...
  while (currentIndex != 0) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    // And swap it with the current element.
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }

  return array;
}

const SelectAvatar = ({navigation}) => {
  const [selectedAvatar, setSelectedAvatar] = useState('0');
  const [showAllAvatars, setShowAllAvatars] = useState(false);
  const flatListRef = useRef(null);
  const selectedAvatarFlastlist = useRef(null);

  const dispatch = useDispatch();

  const avatarArray = useSelector(state => state.user.avatarArray);

  console.log('avatar', avatarArray);

  const shuffledAvatars = useMemo(() => {
    return shuffle(avatarArray);
  }, [avatarArray]);

  useEffect(() => {
    dispatch(fetchAvatars());
  }, []);

  // useEffect(() => {
  //   if (!avatarArray || avatarArray.length == 0) return;
  //   const dirs = RNFetchBlob.fs.dirs;
  //   RNFetchBlob.config({
  //     path: dirs.DocumentDir + 'selectedAvatar',
  //   })
  //     .fetch('GET', `${avatarArray[selectedAvatar].image}`)
  //     .then(resp => resp.blob())
  //     .then(blob => {
  //       console.log('blob', blob);
  //       let url = URL.createObjectURL(blob);
  //       imgRef.current.src = url;
  //     })
  //     .catch(err => console.log('err', err));
  // }, [avatarArray, selectedAvatar]);

  const renderAvatars = ({item, index}) => {
    if (!avatarArray.length) return null;
    if (!showAllAvatars && index > 20) return null;
    return (
      <TouchableOpacity
        style={[
          styles.smallImgContainer,
          {
            backgroundColor: avatarArray[item].backgroundColor,
            borderColor: avatarArray[item].borderColor,
            borderWidth: item === selectedAvatar ? 1 : 0,
            marginLeft: index === 0 ? scale(24) : scale(12),
            marginRight:
              index === Object.keys(avatarArray).length - 1 ||
              (!showAllAvatars && index == 20)
                ? scale(12)
                : 0,
          },
        ]}
        onPress={() => {
          if (showAllAvatars) {
            setSelectedAvatar(item);
            flatListRef.current?.scrollToIndex({animated: true, index: index});
            selectedAvatarFlastlist.current?.scrollToIndex({
              animated: true,
              index: index,
            });
          } else setShowAllAvatars(true);
        }}>
        {!showAllAvatars && index == 20 ? (
          <Icon
            type="ionicon"
            name="add-outline"
            color="#000000"
            size={scale(30)}
          />
        ) : (
          <Image
            source={{uri: avatarArray[item].image}}
            resizeMode="contain"
            style={{height: scale(55), width: scale(55)}}
          />
        )}
      </TouchableOpacity>
    );
  };

  const renderSelectedAvatar = ({item}) => {
    if (!avatarArray.length) return null;
    return (
      <View
        style={[
          styles.imgContainer,
          {
            backgroundColor: avatarArray[item].backgroundColor,
            borderColor: avatarArray[item].borderColor,
          },
        ]}>
        <Image
          // ref={imgRef}
          source={{uri: avatarArray[item].image}}
          resizeMode="contain"
          style={{height: verticalScale(195), width: scale(231)}}
        />
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.topContainer}>
        <View style={styles.progressBar}>
          <View style={styles.progressBarFill}></View>
        </View>
        <Text style={styles.text1}>Select a Avatar!</Text>
        <Text style={styles.text2}>
          Let the real you find the real suitable for you
        </Text>
        {/* <FlatList
          data={Object.keys(avatarArray)}
          renderItem={renderSelectedAvatar}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ref={selectedAvatarFlastlist}
          style={{
            position: 'absolute',
            bottom: scale(-140),
            height: scale(280),
          }}
          scrollEnabled={false}
          // initialNumToRender={100}
          initialScrollIndex={Number(selectedAvatar)}
          onScrollToIndexFailed={info => {
            console.log('i', info.index);
            const wait = new Promise(resolve => setTimeout(resolve, 10));
            wait.then(() => {
              selectedAvatarFlastlist.current?.scrollToIndex({
                animated: false,
                index: info.index,
              });
            });
          }}
        /> */}
        <View
          style={{
            position: 'absolute',
            bottom: scale(-140),
          }}>
          <View
            style={[
              styles.imgContainer,
              {
                backgroundColor: avatarArray[selectedAvatar].backgroundColor,
                borderColor: '#99BF8D',
              },
            ]}>
            <Image
              source={{uri: avatarArray[selectedAvatar]?.image}}
              resizeMode="contain"
              style={{height: verticalScale(195), width: scale(231)}}
            />
          </View>
        </View>
      </View>
      <View style={styles.bottomContainer}>
        <FlatList
          data={Object.keys(shuffledAvatars)}
          renderItem={renderAvatars}
          horizontal={true}
          showsHorizontalScrollIndicator={false}
          ref={flatListRef}
          // initialNumToRender={100}
          // initialScrollIndex={Number(selectedAvatar)}
          // onScrollToIndexFailed={info => {
          //   const wait = new Promise(resolve => setTimeout(resolve, 1000));
          //   wait.then(() => {
          //     flatListRef.current?.scrollToIndex({
          //       index: info.index,
          //       animated: true,
          //     });
          //   });
          // }}
        />
        <TouchableOpacity
          style={{
            position: 'absolute',
            bottom: verticalScale(24),
            alignSelf: 'center',
          }}
          onPress={() =>
            navigation.navigate('SelectUsername', {selectedAvatar})
          }>
          <Image
            source={require('../../assets/images/arrowRight.png')}
            style={{height: verticalScale(40), width: verticalScale(40)}}
          />
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
    width: scale(20),
    backgroundColor: '#3BA2E4',
  },
  topContainer: {
    height: verticalScale(268),
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
    marginHorizontal: scale(40),
    height: scale(280),
    width: scale(280),
    borderRadius: scale(140),
    borderWidth: 1,
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bottomContainer: {
    flex: 1,
    marginTop: scale(140),
    paddingTop: verticalScale(33),
  },
  smallImgContainer: {
    height: scale(64),
    width: scale(64),
    borderRadius: scale(32),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: scale(12),
    overflow: 'hidden',
  },
});

export default SelectAvatar;
