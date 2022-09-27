import {
  FETCH_AVATARS,
  REGISTER_USER,
  LOGIN_WITH_PASSWORD,
  UPDATE_USER_DATA,
  LOGOUT,
  UPDATE_REAL_PROFILE,
} from '../actions/userAction';

const initialState = {
  avatarArray: [],
  data: {},
  token: '',
};

export const userReducer = (state = initialState, action) => {
  if (action.type === FETCH_AVATARS) {
    return {...state, avatarArray: action.data.avatarArray};
  } else if (action.type === REGISTER_USER) {
    return {...state, data: action.data};
  } else if (action.type === LOGIN_WITH_PASSWORD) {
    return {...state, token: action.data.token};
  } else if (action.type === UPDATE_USER_DATA) {
    return {
      ...state,
      data: action.data.userData,
      token: action.data.token,
    };
  } else if (action.type === LOGOUT) {
    return {...state, data: {}, token: ''};
  } else if (action.type === UPDATE_REAL_PROFILE) {
    return {
      ...state,
      data: {
        ...state.data,
        realProfile: action.data,
      },
    };
  } else return state;
};
