import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {
  createStackNavigator,
  CardStyleInterpolators,
} from '@react-navigation/stack';

import SelectAvatar from './SelectAvatar';
import SelectUsername from './SelectUsername';
import AddProfileDetails from './AddProfileDetails';
import FinalAnonScreen from './FinalAnonScreen';
import Questionnaire from './Questionnaire';
import FinalQuesScreen from './FinalQuesScreen';

const Stack = createStackNavigator();

const AnonProfileNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animationEnabled: false,
      }}>
      <Stack.Screen name="SelectAvatar" component={SelectAvatar} />
      <Stack.Screen name="SelectUsername" component={SelectUsername} />
      <Stack.Screen name="AddProfileDetails" component={AddProfileDetails} />
      <Stack.Screen name="FinalAnonScreen" component={FinalAnonScreen} />
      <Stack.Screen name="Questionnaire" component={Questionnaire} />
      <Stack.Screen name="FinalQuesScreen" component={FinalQuesScreen} />
    </Stack.Navigator>
  );
};

export default AnonProfileNavigator;
