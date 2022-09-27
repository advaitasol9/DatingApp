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
import {useDispatch, useSelector} from 'react-redux';

import {verticalScale, scale} from '../../../../configs/size';
import {tStyle} from '../../../../configs/textStyles';
import {updateRealProfile} from '../../../../store/actions/userAction';

const AddBio = ({navigation, route}) => {
  const [bio, setBio] = useState('');
  const [tick, setTick] = useState(0);

  const dispatch = useDispatch();
  const token = useSelector(state => state.user.token);

  useEffect(() => {
    if (route.params?.isEditing) {
      const realProfile = route.params?.realProfile;
      setBio(realProfile?.bio || '');
    }
  }, [route]);

  const navHandler = async () => {
    if (!route.params?.name || !bio || !route.params?.uriString) return;
    if (route.params?.isEditing) {
      const realProfile = route.params?.realProfile;
      const body = {
        name: realProfile?.name,
        bio,
        basicDetails: realProfile?.basicDetails,
        photos: realProfile?.photos,
      };
      try {
        await dispatch(updateRealProfile(body, token));
        navigation.navigate('RevealedProfile');
      } catch (err) {
        console.log('err', err);
      }
    } else {
      navigation.navigate('AddDetails', {
        name: route.params?.name,
        uriString: route.params?.uriString,
        bio,
        isEditing: route.params?.isEditing,
        realProfile: route.params?.realProfile,
      });
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          percent={20}
          radius={scale(32)}
          borderWidth={2}
          color="#48E545"
          shadowColor="#e1fae1"
          bgColor="#fff">
          <View style={styles.progress}>
            <Text style={styles.text2}>20 %</Text>
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
        <Text style={styles.text5}>Add your bio</Text>
        <View style={styles.steps}>
          <Text style={styles.text6}>Step 2/3</Text>
        </View>
      </View>
      <View style={styles.bioContainer}>
        <Input
          containerStyle={styles.inputContainerStyle}
          inputContainerStyle={{borderBottomWidth: 0}}
          inputStyle={styles.inputText}
          value={bio}
          placeholder="Write bio here..."
          onChangeText={val => setBio(val)}
        />
        <View style={styles.counter}>
          <Text style={styles.inputText}>{bio.length}/200</Text>
        </View>
      </View>
      <TouchableOpacity onPress={navHandler} style={styles.forwardBtn}>
        <Image
          source={require('../../../../assets/images/arrowRight.png')}
          resizeMode="contain"
          style={{height: scale(40), width: scale(40)}}
        />
      </TouchableOpacity>
      <View style={{height: verticalScale(100)}} />
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
    marginTop: verticalScale(27),
  },
  inputContainerStyle: {
    width: scale(312),
    height: verticalScale(160),
    paddingHorizontal: scale(12),
  },
  inputText: {
    ...tStyle('Manrope-Regular', '300', 'normal', 12, 16.8, '#181636'),
  },
  counter: {
    position: 'absolute',
    right: scale(20),
    bottom: verticalScale(14),
  },
});

export default AddBio;
