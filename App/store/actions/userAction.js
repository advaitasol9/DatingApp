export const FETCH_AVATARS = 'FETCH_AVATARS';
export const REGISTER_USER = 'REGISTER_USER';
export const LOGIN_WITH_PASSWORD = 'LOGIN_WITH_PASSWORD';
export const UPDATE_USER_DATA = 'UPDATE_USER_DATA';
export const UPDATE_USER_PROFILE = 'UPDATE_USER_PROFILE';
export const UPDATE_REAL_PROFILE = 'UPDATE_REAL_PROFILE';
export const LOGOUT = 'LOGOUT';

import {apiUrl} from '../../configs/constants';
import AsyncStorage from '@react-native-async-storage/async-storage';

const backgroundColors = [
  '#F8EDFC',
  '#F8F4D4',
  '#FEF2E7',
  '#FEE7E7',
  '#F5FFF3',
];

export const fetchAvatars = () => {
  return async dispatch => {
    try {
      const res = await fetch(`${apiUrl}/appdata/APP_SIGNUP_AVATARS`);
      const fetchedAvatars = await res.json();
      var avatarArray = [];
      fetchedAvatars.data.avatars.forEach((avatar, i) =>
        avatarArray.push({
          image: avatar,
          backgroundColor: backgroundColors[i % 5],
          borderColor: '#99BF8D',
        }),
      );
      dispatch({
        type: FETCH_AVATARS,
        data: {avatarArray},
      });
    } catch (err) {
      console.log('err', err);
    }
  };
};

export const registerUser = body => {
  return async dispatch => {
    try {
      const res = await fetch(`${apiUrl}/user/register`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      });
      console.log('register response', res);
      const data = await res.json();
      console.log('register data', data);
      if (data?.error)
        throw new Error(
          'Error creating account! Check your internet connection or try restarting the app.',
        );
      dispatch({
        type: REGISTER_USER,
        data,
      });
    } catch (err) {
      throw err;
    }
  };
};

export const updateUserProfile = (body, token) => {
  return async dispatch => {
    try {
      const res = await fetch(`${apiUrl}/user/me`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      console.log('data', data);
      // dispatch({
      //   type: UPDATE_USER_PROFILE,
      //   data,
      // });
    } catch (err) {
      throw err;
    }
  };
};

export const updateRealProfile = (
  body,
  token,
  isCallback = false,
  callback = () => {},
) => {
  return async dispatch => {
    try {
      const res = await fetch(`${apiUrl}/user/me/profile`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(body),
      });
      if (isCallback) callback();
      dispatch({
        type: UPDATE_REAL_PROFILE,
        data: body,
      });
    } catch (err) {
      console.log(err);
    }
  };
};

export const loginWithPassword = body => {
  return async dispatch => {
    try {
      const res = await fetch(`${apiUrl}/user/login`, {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(body),
      });
      console.log('body', body);
      const data = await res.json();
      console.log('login data', data);
      if (data?.error)
        throw new Error(
          'Error logging in! Check your internet connection or try restarting the app.',
        );
      else {
        await AsyncStorage.setItem('token', data?.token);
        await AsyncStorage.setItem('verified', 'no');
      }
      dispatch({
        type: LOGIN_WITH_PASSWORD,
        data: {token: data?.token},
      });
    } catch (err) {
      throw err;
    }
  };
};

export const updateUserData = (token, changeVerificationStatus = false) => {
  return async dispatch => {
    try {
      const res = await fetch(`${apiUrl}/user/me`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await res.json();
      if (data?.error) {
        throw new Error('Login failed');
      }
      await AsyncStorage.setItem('token', token);
      if (changeVerificationStatus)
        await AsyncStorage.setItem('verified', 'yes');
      dispatch({
        type: UPDATE_USER_DATA,
        data: {
          userData: data,
          token: token,
        },
      });
    } catch (err) {
      throw err;
    }
  };
};

export const logout = () => {
  return async dispatch => {
    await AsyncStorage.removeItem('token');
    dispatch({type: LOGOUT});
  };
};
