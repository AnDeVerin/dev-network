import axios from 'axios';
import jwtDecode from 'jwt-decode';
import setAuthToken from '../utils/setAuthToken';
import { GET_ERRORS, SET_CURRENT_USER } from './types';

// Register User
export const registerUser = (userData, history) => (dispatch) => {
  axios
    .post('/api/users/register', userData)
    .then(() => history.push('/login'))
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    }));
};

// Set logged in user
export const setCurrentUser = decodedData => ({
  type: SET_CURRENT_USER,
  payload: decodedData,
});

// Login - Get user token
export const loginUser = userData => (dispatch) => {
  axios
    .post('/api/users/login', userData)
    .then((res) => {
      // Get jwt-token
      const { token } = res.data;
      // Save to localStorage
      localStorage.setItem('jwtToken', token);
      // Set token to Auth header
      setAuthToken(token);
      // Decode token to get user data
      const decodedData = jwtDecode(token);
      // set current user
      dispatch(setCurrentUser(decodedData));
    })
    .catch(err => dispatch({
      type: GET_ERRORS,
      payload: err.response.data,
    }));
};

// Log user out
export const logoutUser = () => (dispatch) => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {}, which also sets isAuthenticated to false
  dispatch(setCurrentUser({}));
};
