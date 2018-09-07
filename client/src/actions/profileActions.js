import axios from 'axios';

import {
  GET_PROFILE, PROFILE_LOADING, CLEAR_CURRENT_PROFILE, GET_ERRORS,
} from './types';

// Profile loading
export const setProfileLoading = () => ({
  type: PROFILE_LOADING,
});

// Clear current profile
export const clearCurrentProfile = () => ({
  type: CLEAR_CURRENT_PROFILE,
});

// Get current profile
export const getCurrentProfile = () => (dispatch) => {
  dispatch(setProfileLoading());
  axios
    .get('/api/profile')
    .then(res => dispatch({
      type: GET_PROFILE,
      payload: res.data,
    }))
    .catch(() => dispatch({
      type: GET_PROFILE,
      payload: {},
    }));
};

// Create Profile
export const createProfile = (profileData, history) => (dispatch) => {
  axios
    .post('/api/profile', profileData)
    .then(() => history.push('/dashboard'))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    }));
};
