import React from 'react';
import {Image, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {scale} from '../configs/size';

const RevealSent = () => {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        height: scale(16),
        width: scale(32),
        borderRadius: scale(26.67),
        backgroundColor: '#FDF5F5',
        justifyContent: 'center',
        marginLeft: scale(10),
      }}>
      <Icon
        name={'caret-left'}
        type={'font-awesome'}
        size={scale(13)}
        color={'#6D6D6D'}
      />
      <View
        style={{width: scale(4), height: scale(1), backgroundColor: '#6D6D6D'}}
      />
      <Image
        source={require('../assets/images/reveal.png')}
        style={{width: scale(16), height: scale(8)}}
        resizeMode="contain"
      />
    </View>
  );
};

export default RevealSent;
