import {
  CardStyleInterpolators,
  createStackNavigator,
} from '@react-navigation/stack';
import React from 'react';
import AnonProfileNavigator from '../screens/anonProfileCreation';
import HomeTabs from '../screens/home';
import Onboarding from '../screens/onboarding/Onboarding';

const Stack = createStackNavigator();

const Root = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="onboarding" component={Onboarding} />
      <Stack.Screen name="main" component={AnonProfileNavigator} />
      <Stack.Screen
        name="tabs"
        component={HomeTabs}
        options={{
          transitionSpec: {
            open: {
              animation: 'timing',
              config: {
                duration: 600,
              },
            },
            close: {},
          },
          cardStyleInterpolator: CardStyleInterpolators.forVerticalIOS,
        }}
      />
    </Stack.Navigator>
  );
};

export default Root;
