import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';

import RevealedProfile from './RevealedProfile';
import AddName from './AddName';
import AddBio from './AddBio';
import AddDetails from './AddDetails';

const Stack = createStackNavigator();

const Revealed = () => {
  return (
    <Stack.Navigator
      screenOptions={{headerShown: false, animationEnabled: false}}>
      <Stack.Screen name="RevealedProfile" component={RevealedProfile} />
      <Stack.Screen name="AddName" component={AddName} />
      <Stack.Screen name="AddBio" component={AddBio} />
      <Stack.Screen name="AddDetails" component={AddDetails} />
    </Stack.Navigator>
  );
};

export default Revealed;
