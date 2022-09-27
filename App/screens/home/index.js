import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import React from 'react';
import {Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

import TabBar from '../../components/TabBar';
import {scale, verticalScale} from '../../configs/size';
import Chat from './chat';
import Profile from './profile';
import Home from './home';

const Tab = createBottomTabNavigator();

const HomeTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={({route}) => ({
        tabBarHideOnKeyboard: true,
        tabBarIcon: ({focused}) => {
          let imgPath;

          if (route.name === 'Home') {
            imgPath = focused
              ? require('../../assets/images/homeSelected.png')
              : require('../../assets/images/home.png');
          } else if (route.name === 'Chat') {
            imgPath = focused
              ? require('../../assets/images/chatSelected.png')
              : require('../../assets/images/chat.png');
          } else if (route.name === 'Profile') {
            imgPath = focused
              ? require('../../assets/images/profileSelected.png')
              : require('../../assets/images/profile.png');
          }
          return (
            <Image
              source={imgPath}
              resizeMode="contain"
              style={{
                height: verticalScale(24),
                width: scale(24),
                // resizeMode: 'contain',
                // aspectRatio: 1,
              }}
            />
          );
        },
        headerTransparent: true,
        headerTitleAlign: 'center',
      })}>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Chat" component={Chat} options={{headerShown: false}} />
      <Tab.Screen
        name="Profile"
        component={Profile}
        options={{headerShown: false}}
      />
    </Tab.Navigator>
  );
};

export default HomeTabs;
