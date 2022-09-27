import React from 'react';
import {Text, View} from 'react-native';
import {Icon} from 'react-native-elements';
import {scale} from '../configs/size';
import {tStyle} from '../configs/textStyles';

const RevealReceived = () => {
  return (
    <View
      style={{
        height: scale(18),
        width: scale(68),
        backgroundColor: '#E8F7FF',
        borderRadius: scale(25),
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: scale(6),
      }}>
      <Icon
        type={'ionicon'}
        name={'paper-plane'}
        size={scale(10)}
        style={{marginRight: scale(2)}}
      />
      <Text
        style={{
          ...tStyle(
            'Halant-Medium',
            '500',
            'normal',
            scale(10),
            scale(16),
            '#000000',
          ),
        }}>
        Your Turn
      </Text>
    </View>
  );
};

export default RevealReceived;
