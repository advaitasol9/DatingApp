import React from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import AnonProfile from './anon/AnonProfile';
import Revealed from './revealed';
import TopTabBar from '../../../components/TopTabBar';
import AnonStack from './anon/AnonStack.js';

const Tab = createMaterialTopTabNavigator();

const Profile = () => {
  return (
    <Tab.Navigator tabBar={props => <TopTabBar {...props} />}>
      <Tab.Screen name="Anonymous" component={AnonStack} />
      <Tab.Screen name="Revealed" component={Revealed} />
    </Tab.Navigator>
  );
};

export default Profile;
