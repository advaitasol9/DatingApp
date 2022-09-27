import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {Input} from 'react-native-elements';
import ProgressCircle from 'react-native-progress-circle';
import {launchImageLibrary} from 'react-native-image-picker';
import RNFetchBlob from 'react-native-fetch-blob';
import {useSelector, useDispatch} from 'react-redux';

import {updateRealProfile} from '../../../../store/actions/userAction';
import {verticalScale, scale} from '../../../../configs/size';
import {tStyle} from '../../../../configs/textStyles';
import {apiUrl} from '../../../../configs/constants';

const AddName = ({navigation, route}) => {
  const [name, setName] = useState('');
  const [profilePicsArray, setProfilePicsArray] = useState([]);
  const [uploadArray, setUploadArray] = useState([]);
  const [tick, setTick] = useState(0);

  const me = useSelector(state => state.user.data);
  const token = useSelector(state => state.user.token);
  const dispatch = useDispatch();

  useEffect(() => {
    if (route.params?.isEditing) {
      const realProfile = route.params?.realProfile;
      const picsArray = realProfile?.photos.split(',') || [];
      var tempArr = [];
      picsArray.forEach(url =>
        tempArr.push({
          uri: url,
          wasOnServer: true,
        }),
      );
      setUploadArray(tempArr);
      setProfilePicsArray(picsArray);
      setName(realProfile?.name || '');
    }
  }, [route]);

  const addImageHandler = async () => {
    const options = {
      mediaType: 'photo',
      selectionLimit: 0,
    };
    try {
      const res = await launchImageLibrary(options);
      var newArray = profilePicsArray;
      var tempArr = uploadArray;
      res.assets.forEach(obj => {
        newArray.push(obj.uri);
        tempArr.push({
          name: obj.fileName,
          fileName: obj.uri,
          type: obj.type,
          wasOnServer: false,
        });
      });
      setProfilePicsArray(newArray);
      setUploadArray(tempArr);
      setTick(tick + 1);
    } catch (err) {
      alert('Error! Try picking another image.');
    }
  };

  const removeImageHandler = ind => {
    var newArray = profilePicsArray;
    newArray.splice(ind, 1);
    var uploadArr = uploadArray;
    uploadArr.splice(ind, 1);
    setUploadArray(uploadArr);
    setProfilePicsArray(newArray);
    setTick(tick + 1);
  };

  const navHandler = async () => {
    if (!name || profilePicsArray.length === 0) return;
    var uriString = '';
    uploadArray.forEach((item, i) => {
      if (item?.wasOnServer) {
        const uri = item?.uri;
        if (!uriString) uriString = uri;
        else uriString = uriString + ',' + uri;
        if (i == uploadArray.length - 1) {
          if (route.params?.isEditing) {
            const body = {
              name,
              photos: uriString,
              bio: route.params?.realProfile?.bio,
              basicDetails: route.params?.realProfile?.basicDetails,
            };
            dispatch(
              updateRealProfile(
                body,
                token,
                true,
                navigation.navigate('RevealedProfile'),
              ),
            );
          } else {
            navigation.navigate('AddBio', {
              name,
              uriString,
              isEditing: route.params?.isEditing,
              realProfile: route.params?.realProfile,
            });
          }
        }
      } else {
        RNFetchBlob.fetch(
          'POST',
          `${apiUrl}/files`,
          {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
          [
            // part file from storage
            {
              name: item.name,
              filename: item.fileName,
              type: item.type,
              data: RNFetchBlob.wrap(item.fileName),
            },
          ],
        )
          .then(res => res.json())
          .then(res => {
            const uri = res.files[0].location;
            if (!uriString) uriString = uri;
            else uriString = uriString + ',' + uri;
          })
          .then(() => {
            if (i == uploadArray.length - 1) {
              if (route.params?.isEditing) {
                const body = {
                  name,
                  photos: uriString,
                  bio: route.params?.realProfile?.bio,
                  basicDetails: route.params?.realProfile?.basicDetails,
                };
                dispatch(
                  updateRealProfile(
                    body,
                    token,
                    true,
                    navigation.navigate('RevealedProfile'),
                  ),
                );
              } else
                navigation.navigate('AddBio', {
                  name,
                  uriString,
                  isEditing: route.params?.isEditing,
                  realProfile: route.params?.realProfile,
                });
            }
          })
          .catch(err => console.log('err', err));
      }
    });
  };

  return (
    <View style={{flex: 1}}>
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backBtn}>
          <Image
            source={require('../../../../assets/images/arrowBack.png')}
            style={{height: verticalScale(16), width: scale(8)}}
            resizeMode="contain"
          />
          <Text style={styles.text1}>Profile Creation</Text>
        </TouchableOpacity>
        <View style={styles.topContainer}>
          <ProgressCircle
            percent={10}
            radius={scale(32)}
            borderWidth={2}
            color="#48E545"
            shadowColor="#e1fae1"
            bgColor="#fff">
            <View style={styles.progress}>
              <Text style={styles.text2}>10 %</Text>
              <Text style={styles.text3}>complete</Text>
            </View>
          </ProgressCircle>
          <View style={{marginLeft: scale(20)}}>
            {/* <Text style={styles.text4}>Name</Text> */}
            <Input
              containerStyle={styles.inputContainerStyle}
              inputContainerStyle={{borderBottomWidth: 0}}
              inputStyle={styles.inputText}
              value={name}
              placeholder="Name here..."
              placeholderTextColor="#181636"
              onChangeText={val => setName(val)}
              textAlignVertical={'center'}
            />
          </View>
        </View>
        <View style={styles.divider} />
        <View
          style={{
            flexDirection: 'row',
            marginHorizontal: scale(24),
            justifyContent: 'space-between',
          }}>
          <Text style={styles.text5}>Profile Pictures</Text>
          <View style={styles.steps}>
            <Text style={styles.text6}>Step 1/3</Text>
          </View>
        </View>
        <View
          style={{
            flexDirection: 'row',
            flexWrap: 'wrap',
            marginLeft: scale(24),
          }}>
          {profilePicsArray.map((picUrl, i) => (
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
              <TouchableOpacity
                style={styles.removeBtn}
                onPress={() => removeImageHandler(i)}>
                <Image
                  source={require('../../../../assets/images/remove.png')}
                  style={{height: scale(5.35), width: scale(5.35)}}
                />
              </TouchableOpacity>
            </View>
          ))}
          {[0, 1, 2].map(i => {
            if (i != 2 && profilePicsArray[i]) return null;
            return (
              <TouchableOpacity
                style={{
                  ...styles.addPicsBtn,
                  marginRight: i != 2 ? scale(12) : 0,
                }}
                activeOpacity={1}
                onPress={addImageHandler}>
                <Image
                  source={require('../../../../assets/images/add2.png')}
                  style={{height: scale(22), width: scale(22)}}
                />
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{height: verticalScale(100)}} />
      </ScrollView>
      <TouchableOpacity onPress={navHandler} style={styles.forwardBtn}>
        <Image
          source={require('../../../../assets/images/arrowRight.png')}
          resizeMode="contain"
          style={{height: scale(40), width: scale(40)}}
        />
      </TouchableOpacity>
    </View>
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
  inputContainerStyle: {
    width: scale(233),
    height: verticalScale(48),
    marginTop: verticalScale(6),
    borderRadius: scale(8),
    borderWidth: 1,
    borderColor: '#4F4F4F',
  },
  inputText: {
    ...tStyle('Halant-SemiBold', '600', 'normal', 24, 34, '#181636'),
    // textAlignVertical: 'bottom',
    paddingBottom: verticalScale(4),
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
  forwardBtn: {
    position: 'absolute',
    bottom: verticalScale(96),
    alignSelf: 'center',
  },
});

export default AddName;
