import 'react-native-gesture-handler';
import React, {useEffect} from 'react';
import {SafeAreaProvider} from 'react-native-safe-area-context';
import Onboarding from './App/screens/onboarding/Onboarding';
import AnonProfileNavigator from './App/screens/anonProfileCreation';
import HomeTabs from './App/screens/home';
import {NavigationContainer} from '@react-navigation/native';
import Root from './App/navigation/root';
import {createStore, combineReducers, applyMiddleware} from 'redux';
import ReduxThunk from 'redux-thunk';
import {Provider} from 'react-redux';
import {userReducer} from './App/store/reducers/userReducer';
import messaging from '@react-native-firebase/messaging';
import NotificationController from './App/controllers/NotificationController.android';

const rootReducer = combineReducers({
  user: userReducer,
});

const store = createStore(rootReducer, applyMiddleware(ReduxThunk));

const App = () => {
  useEffect(async () => {
    const authStatus = await messaging().requestPermission();
    console.log('notif permission', authStatus);
  }, []);

  return (
    <SafeAreaProvider>
      {/* <Onboarding /> */}
      {/* <AnonProfileNavigator />
       */}
      <Provider store={store}>
        <NavigationContainer theme={{colors: {background: '#fff'}}}>
          {/* <HomeTabs /> */}
          <Root />
        </NavigationContainer>
      </Provider>
      <NotificationController />
    </SafeAreaProvider>
  );
};

export default App;
