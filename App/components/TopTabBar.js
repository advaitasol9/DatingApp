import React from 'react';
import {View, Text, TouchableOpacity, StyleSheet} from 'react-native';

import {scale, verticalScale} from '../configs/size';
import {tStyle} from '../configs/textStyles';

const TopTabBar = props => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        {Object.keys(props.descriptors).map(desc => {
          const {options, navigation, route} = props.descriptors[desc];
          const focused = navigation.isFocused();
          return (
            <TouchableOpacity
              onPress={() => navigation.navigate(route.name)}
              style={{
                ...styles.btn,
                backgroundColor: focused ? '#87B2E5' : '#FFF',
              }}>
              <Text
                style={{...styles.text1, color: focused ? '#FFF' : '#181636'}}>
                {route.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    flexDirection: 'row',
    height: verticalScale(49),
    width: scale(328),
    borderRadius: scale(8),
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  wrapper: {
    height: verticalScale(97),
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#EEF9FD',
  },
  btn: {
    width: scale(148),
    height: verticalScale(35),
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: scale(8),
  },
  text1: {
    ...tStyle('Manrope-SemiBold', '500', 'normal', 16, 22.4, '#181636'),
  },
});

export default TopTabBar;
