import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Animated,
} from 'react-native';
import {Card} from 'react-native-elements';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Shadow} from 'react-native-shadow-2';

import {moderateScale, scale, verticalScale} from '../configs/size';
import {tStyle} from '../configs/textStyles';

const TabBar = props => {
  const paddingTopHome = useState(new Animated.Value(verticalScale(23)))[0];
  const paddingTopChat = useState(new Animated.Value(0))[0];
  const paddingTopProfile = useState(new Animated.Value(0))[0];

  var focusedRoute;

  const showCurrentRouteName = () => {
    let paddingTop;
    switch (focusedRoute) {
      case 'Home':
        paddingTop = paddingTopHome;
        break;
      case 'Chat':
        paddingTop = paddingTopChat;
        break;
      case 'Profile':
        paddingTop = paddingTopProfile;
      default:
        break;
    }
    Animated.timing(paddingTop, {
      toValue: verticalScale(0),
      duration: 700,
      useNativeDriver: false,
    }).start();
  };

  const hideRouteName = routeName => {
    let paddingTop;
    switch (routeName) {
      case 'Home':
        paddingTop = paddingTopHome;
        break;
      case 'Chat':
        paddingTop = paddingTopChat;
        break;
      case 'Profile':
        paddingTop = paddingTopProfile;
      default:
        break;
    }
    Animated.timing(paddingTop, {
      toValue: verticalScale(23),
      duration: 700,
      useNativeDriver: false,
    }).start();
  };
  return (
    // <SafeAreaView style={{backgroundColor: '#ffffff'}}>
    <Shadow
      viewStyle={styles.shadowCont}
      containerViewStyle={{
        width: scale(320),
        alignSelf: 'center',
        position: 'absolute',
        bottom: verticalScale(20),
      }}
      startColor="rgba(0,0,0,0.1)"
      distance={scale(20)}>
      <View style={styles.container}>
        {Object.keys(props.descriptors).map(desc => {
          const {options, navigation, route} = props.descriptors[desc];
          const focused = navigation.isFocused();
          if (focused) {
            focusedRoute = route.name;
          }
          let paddingTop;
          switch (route.name) {
            case 'Home':
              paddingTop = paddingTopHome;
              break;
            case 'Chat':
              paddingTop = paddingTopChat;
              break;
            case 'Profile':
              paddingTop = paddingTopProfile;
          }
          // console.log('options', props);
          // console.log('navigation', navigation);
          return (
            <TouchableOpacity
              style
              onPress={() => {
                navigation.navigate(route.name);
                hideRouteName(route.name);
                showCurrentRouteName();
              }}>
              <Animated.View
                style={{
                  alignItems: 'center',
                  width: scale(34),
                  height: verticalScale(37),
                  justifyContent: 'center',
                  paddingTop: paddingTop,
                  //   borderWidth: 1,
                  overflow: 'hidden',
                }}>
                {options.tabBarIcon({
                  focused,
                })}
                <Text style={styles.routeName}>{route.name.toLowerCase()}</Text>
              </Animated.View>
              {focused && (
                <Image
                  source={require('../assets/images/tabPointer.png')}
                  height={verticalScale(54.85)}
                  width={scale(19)}
                  style={{
                    position: 'absolute',
                    top: verticalScale(-20),
                    left: scale(-9.5),
                  }}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </Shadow>
    // </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  shadowCont: {
    height: verticalScale(56),
    width: scale(320),
    borderRadius: moderateScale(12),
    backgroundColor: '#ffffff',
    // marginBottom: verticalScale(20),
    justifyContent: 'center',
  },
  container: {
    paddingHorizontal: scale(25),
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },

  routeName: {
    ...tStyle('Manrope-Regular', '400', 'normal', 10, 13.66, '#000000'),
  },
});

export default TabBar;
