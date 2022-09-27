import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {Input} from 'react-native-elements';

import {verticalScale, scale} from '../../../../configs/size';
import {tStyle} from '../../../../configs/textStyles';

const PreferenceModal = ({
  showModal,
  setShowModal,
  interestedIn,
  setInterstedIn,
  location,
  setLocation,
  updateProfile,
}) => {
  const [showGenModal, setShowGenModal] = useState(false);
  const [showLocModal, setShowLocModal] = useState(false);
  const [searchInput, setSearchInput] = useState('');

  const genderArray2 = ['male', 'female', 'non-binary', 'everyone'];
  const popularLocation = [
    'Mumbai',
    'Delhi',
    'Banglore',
    'Pune',
    'Kerala',
    'Chennai',
    'Hyderabad',
  ];

  const getImage = (gender, selectedGen) => {
    const style = {
      height: scale(56),
      width: scale(56),
      borderColor: '#70B7D1',
      borderRadius: scale(25),
      borderWidth: gender == selectedGen ? 1 : 0,
    };
    if (gender === 'male')
      return (
        <Image
          source={require('../../../../assets/images/Male.png')}
          style={style}
        />
      );
    if (gender === 'female')
      return (
        <Image
          source={require('../../../../assets/images/Female.png')}
          style={style}
        />
      );
    if (gender === 'non-binary')
      return (
        <Image
          source={require('../../../../assets/images/Non-Binary.png')}
          style={style}
        />
      );
    if (gender === 'everyone')
      return (
        <Image
          source={require('../../../../assets/images/Everyone.png')}
          style={style}
        />
      );
  };

  return (
    <Modal visible={showModal} transparent={true} onRequestClose={setShowModal}>
      <View style={styles.modalContainer}>
        <TouchableOpacity
          onPress={() => setShowModal(false)}
          style={{width: '100%', height: '100%'}}
        />

        {!showGenModal && !showLocModal && (
          <View style={styles.wrapper}>
            <TouchableOpacity
              style={styles.btn}
              activeOpacity={1}
              onPress={() => setShowLocModal(true)}>
              <Image
                source={require('../../../../assets/images/loc.png')}
                style={styles.img1}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.txt1}>Location</Text>
                <Text style={styles.txt2}>
                  You’re currently swiping in {location}
                </Text>
              </View>
              <Image
                source={require('../../../../assets/images/arrowBlack.png')}
                style={styles.img2}
                resizeMode="contain"
              />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity
              activeOpacity={1}
              onPress={() => setShowGenModal(true)}
              style={{...styles.btn, marginTop: verticalScale(-8)}}>
              <Image
                source={require('../../../../assets/images/gen.png')}
                style={styles.img3}
                resizeMode="contain"
              />
              <View>
                <Text style={styles.txt1}>Interested in</Text>
                <Text style={styles.txt2}>
                  You’re currently interested in {interestedIn}
                </Text>
              </View>
              <Image
                source={require('../../../../assets/images/arrowBlack.png')}
                style={styles.img2}
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        )}
        {showGenModal && (
          <View style={{...styles.wrapper, height: verticalScale(302)}}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setShowGenModal(false)}>
              <Image
                source={require('../../../../assets/images/arrowBack.png')}
                style={{height: verticalScale(10), width: scale(15)}}
                resizeMode="contain"
              />
              <Text style={styles.txt3}>Interested In</Text>
            </TouchableOpacity>
            <View style={{flexDirection: 'row', alignSelf: 'center'}}>
              {genderArray2.map(gen => (
                <TouchableOpacity
                  style={{
                    marginTop: verticalScale(24),
                    alignItems: 'center',
                    marginHorizontal: scale(8),
                  }}
                  onPress={() => setInterstedIn(gen)}>
                  {getImage(gen, interestedIn)}
                  <Text
                    style={{
                      ...styles.dobText,
                      marginTop: verticalScale(8),
                      fontWeight: gen === interestedIn ? '700' : '500',
                    }}>
                    {gen}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                updateProfile();
                setShowGenModal(false);
                setShowModal();
              }}>
              <Text style={styles.txt4}>Save changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: 'center', marginTop: verticalScale(16)}}
              onPress={() => setShowGenModal(false)}>
              <Text style={styles.txt5}>cancel</Text>
            </TouchableOpacity>
          </View>
        )}
        {showLocModal && (
          <View style={{...styles.wrapper, height: verticalScale(360)}}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setShowLocModal(false)}>
              <Image
                source={require('../../../../assets/images/arrowBack.png')}
                style={{height: verticalScale(10), width: scale(15)}}
                resizeMode="contain"
              />
              <Text style={styles.txt3}>Select location</Text>
            </TouchableOpacity>
            <View style={styles.searchBar}>
              <Image
                source={require('../../../../assets/images/search.png')}
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
            <Text style={styles.txt7}>Popular Location</Text>
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                marginHorizontal: scale(25),
              }}>
              {popularLocation.map(loc => (
                <TouchableOpacity
                  style={{
                    ...styles.locBtn,
                    borderWidth: loc === location ? 1 : 0,
                  }}
                  onPress={() => setLocation(loc)}>
                  <Text style={styles.txt8}>{loc}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => {
                updateProfile();
                setShowLocModal(false);
                setShowModal();
              }}>
              <Text style={styles.txt4}>Save changes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={{alignSelf: 'center', marginTop: verticalScale(16)}}
              onPress={() => setShowLocModal(false)}>
              <Text style={styles.txt5}>cancel</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: '#000000D9',
    position: 'absolute',
    bottom: 0,
  },
  wrapper: {
    position: 'absolute',
    bottom: 0,
    height: verticalScale(170),
    borderTopLeftRadius: scale(15),
    borderTopRightRadius: scale(15),
    backgroundColor: '#fff',
    width: '100%',
  },
  btn: {
    flexDirection: 'row',
    height: verticalScale(85),
  },
  img1: {
    height: scale(18),
    width: scale(18),
    marginTop: verticalScale(28),
    marginLeft: scale(19),
  },
  img2: {
    height: scale(12),
    width: scale(18),
    marginTop: verticalScale(41),
    position: 'absolute',
    right: scale(20),
  },
  img3: {
    height: scale(24),
    width: scale(18),
    marginTop: verticalScale(28),
    marginLeft: scale(19),
  },
  txt1: {
    ...tStyle('Manrope-SemiBold', '600', 'normal', 18, 24.5, '#333333'),
    marginTop: verticalScale(24),
    marginLeft: scale(27),
  },
  txt2: {
    ...tStyle('Manrope-Regular', '400', 'normal', 12, 16.4, '#33333380'),
    marginTop: verticalScale(4),
    marginLeft: scale(27),
  },
  divider: {
    borderBottomWidth: 1,
    borderColor: '#E3E3E3',
    marginLeft: scale(19),
    marginRight: scale(22.5),
  },
  dobText: {
    ...tStyle('Manrope-Regular', '500', 'normal', 12, 16.8, '#666666'),
    textAlign: 'center',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: verticalScale(24),
    marginLeft: scale(30),
  },
  txt3: {
    ...tStyle('Manrope-Bold', '600', 'normal', 18, 24.5, '#333333'),
    marginLeft: scale(10),
  },
  saveBtn: {
    width: scale(300),
    height: verticalScale(55),
    backgroundColor: '#87B2E5',
    borderRadius: scale(8),
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    marginTop: verticalScale(30),
  },
  txt4: {
    ...tStyle('Manrope-Bold', '700', 'normal', 16, 21.8, '#FFF'),
  },
  txt5: {
    ...tStyle('Manrope-Regular', '400', 'normal', 16, 21.8, '#333333'),
  },
  txt7: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 10, 14, '#333333'),
    marginLeft: scale(30),
    marginTop: verticalScale(16),
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
  txt8: {
    ...tStyle('Manrope-Regular', '400', 'normal', 12, 16.8, '#393939'),
  },
  searchBar: {
    height: verticalScale(48),
    width: scale(306),
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
});

export default PreferenceModal;
