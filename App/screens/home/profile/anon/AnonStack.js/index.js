import {createStackNavigator} from '@react-navigation/stack';
import React from 'react';
import AnonProfile from '../AnonProfile';
import MyCard from './MyCard';

const Stack = createStackNavigator();

const AnonStack = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name={'AnonProfile'} component={AnonProfile} />
      <Stack.Screen name={'MyCard'} component={MyCard} />
    </Stack.Navigator>
  );
};

export default AnonStack;
