import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';

import {verticalScale, scale} from '../../../../configs/size';
import {tStyle} from '../../../../configs/textStyles';
import {launchImageLibrary} from 'react-native-image-picker';
import {useSelector} from 'react-redux';

const RevealedProfile = ({navigation}) => {
  const [tick, setTick] = useState(0);

  const avatarArray = useSelector(state => state.user.avatarArray);
  const user = useSelector(state => state.user.data);
  const userProfile = useSelector(state => state.user.data?.realProfile);
  const avatar = user.avatar;
  const bio = userProfile?.bio;
  const name = userProfile?.name;
  const basicDetails = userProfile?.basicDetails;
  const profilePicsArray = userProfile?.photos.split(',');

  console.log('real', userProfile);

  const addImageHandler = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 0,
    };
    try {
      const res = await launchImageLibrary(options);
      var newArray = profilePicsArray;
      res.assets.forEach(obj => newArray.push(obj.uri));
      setProfilePicsArray(newArray);
      setTick(tick + 1);
    } catch (err) {
      Alert('Error! Try picking another');
    }
  };

  const removeImageHandler = ind => {
    var newArray = profilePicsArray;
    newArray.splice(ind, 1);
    setProfilePicsArray(newArray);
    setTick(tick + 1);
  };

  return Object.keys(user).length && avatarArray.length ? (
    <ScrollView contentContainerStyle={styles.container}>
      {userProfile ? (
        <>
          <Text style={styles.text1}>Name</Text>
          <Text style={styles.text2}>{name}</Text>
          <View style={styles.divider} />
          <Text style={styles.text3}>Profile Pictures</Text>
          <View style={{flexDirection: 'row', flexWrap: 'wrap'}}>
            {profilePicsArray
              ? profilePicsArray.map((picUrl, i) => (
                  <View
                    style={{
                      ...styles.imgWrapper,
                      marginRight: (i + 1) % 3 === 0 ? 0 : scale(12),
                    }}>
                    <Image
                      source={{
                        uri: picUrl,
                        height: scale(96),
                        width: scale(96),
                      }}
                      style={{borderRadius: scale(12)}}
                      resizeMode="cover"
                    />
                    {/* <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => removeImageHandler(i)}>
                  <Image
                    source={require('../../../../assets/images/remove.png')}
                    style={{height: scale(5.35), width: scale(5.35)}}
                  />
                </TouchableOpacity> */}
                  </View>
                ))
              : null}
            <TouchableOpacity
              style={styles.addPicsBtn}
              activeOpacity={1}
              onPress={() =>
                navigation.navigate('AddName', {
                  isEditing: true,
                  realProfile: userProfile,
                })
              }>
              <Image
                source={require('../../../../assets/images/add.png')}
                style={{height: scale(22), width: scale(22)}}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.divider} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.text4}>Bio</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddBio', {
                  isEditing: true,
                  realProfile: userProfile,
                  name: userProfile?.name || '',
                  uriString: userProfile?.photos || '',
                })
              }>
              <Text style={styles.text5}>Update Bio</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.bioContainer}>
            <Text style={styles.bioText}>{bio}</Text>
            {/* <Text style={styles.bioText2}>{bio.length}/200</Text> */}
          </View>
          <View style={styles.divider} />
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <Text style={styles.text4}>Basic Details</Text>
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('AddDetails', {
                  isEditing: true,
                  realProfile: userProfile,
                  name: userProfile?.name || '',
                  uriString: userProfile?.photos || '',
                  bio: userProfile?.bio || '',
                })
              }>
              <Text style={styles.text5}>Update Details</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.detailsContainer}>
            {Object.keys(basicDetails).map(key => {
              if (!basicDetails[key]) {
                if (key == 'smoking' && basicDetails[key] == false) {
                } else if (key == 'drinking' && basicDetails[key] == false) {
                } else return null;
              }
              var textToShow = basicDetails[key];
              if (key == 'height')
                textToShow =
                  basicDetails[key]?.feet + "'" + basicDetails[key]?.inches;
              if (key == 'smoking' || key == 'drinking')
                textToShow = basicDetails[key] ? 'Yes' : 'No';
              return (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}>
                  <Text
                    style={{
                      ...styles.bioText,
                      marginBottom: verticalScale(24),
                    }}>
                    {key[0].toUpperCase() + key.slice(1)}
                  </Text>
                  <Text style={styles.text6}>{textToShow}</Text>
                </View>
              );
            })}
            {/* <TouchableOpacity onPress={() => {}}>
              <Text style={styles.text7}>verify with OTP</Text>
            </TouchableOpacity> */}
          </View>
          <View style={{height: verticalScale(100)}} />
        </>
      ) : (
        <>
          <View style={styles.avatarWrapper}>
            <Image
              source={{uri: avatarArray[avatar].image}}
              resizeMode="contain"
              style={{height: scale(136), width: scale(160)}}
            />
          </View>
          <Text style={styles.text8}>Create your public profile</Text>
          <Text style={styles.text9}>
            Let the best of you be seen by people
          </Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('AddName')}
            style={{alignSelf: 'center', marginTop: verticalScale(46)}}>
            <Image
              source={require('../../../../assets/images/arrowRight.png')}
              resizeMode="contain"
              style={{height: scale(40), width: scale(40)}}
            />
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  ) : null;
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    paddingHorizontal: scale(24),
  },
  text1: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 18, 25.2, '#000000'),
    marginTop: verticalScale(16),
  },
  text2: {
    ...tStyle('Manrope-Bold', '600', 'normal', 28, 28, '#000000'),
    marginTop: verticalScale(5),
  },
  text3: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 18, 25.8, '#000000'),
    marginTop: verticalScale(16),
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#C4C4C430',
    marginTop: verticalScale(16),
  },
  imgWrapper: {
    marginRight: scale(12),
    marginTop: verticalScale(16),
  },
  addPicsBtn: {
    height: scale(96),
    width: scale(96),
    marginTop: verticalScale(16),
    borderRadius: scale(12),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8FCFF',
  },
  text4: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 18, 25.2, '#000000'),
    marginTop: verticalScale(16),
  },
  text5: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 12, 16.8, '#2F80ED'),
    marginTop: verticalScale(16),
  },
  bioContainer: {
    width: scale(312),
    backgroundColor: '#EEF9FD',
    paddingTop: verticalScale(16),
    paddingBottom: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(12),
    marginTop: verticalScale(8),
  },
  bioText: {
    ...tStyle('Manrope-Regular', '400', 'normal', 12, 16.8, '#24232C'),
  },
  bioText2: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#707070'),
    marginTop: verticalScale(8),
  },
  detailsContainer: {
    width: scale(312),
    backgroundColor: '#EEF9FD',
    paddingVertical: verticalScale(16),
    paddingHorizontal: scale(24),
    borderRadius: scale(12),
    marginTop: verticalScale(14),
  },
  text6: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 14, 19.6, '#24232C'),
  },
  text7: {
    ...tStyle('Manrope-Regular', '300', 'normal', 10, 14, '#2F80ED'),
    alignSelf: 'flex-end',
    marginTop: verticalScale(-15),
  },
  removeBtn: {
    height: scale(14),
    width: scale(14),
    borderRadius: scale(14),
    backgroundColor: '#EB5757',
    position: 'absolute',
    top: scale(5),
    right: scale(5),
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarWrapper: {
    height: scale(176),
    width: scale(176),
    borderRadius: scale(176),
    borderWidth: 1,
    borderColor: '#EEF9FD',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: verticalScale(98),
  },
  text8: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 20, 28, '#000000'),
    alignSelf: 'center',
    marginTop: verticalScale(16),
  },
  text9: {
    ...tStyle('Manrope-Regular', '400', 'normal', 14, 19.6, '#6D6D6D'),
    alignSelf: 'center',
    marginTop: verticalScale(5),
  },
});

export default RevealedProfile;
