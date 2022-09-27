import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import ChatList from './ChatList';

const Stack = createStackNavigator();

const Chat = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animationEnabled: false}}>
      <Stack.Screen name="ChatList" component={ChatList} />
    </Stack.Navigator>
  );
};

export default Chat;
