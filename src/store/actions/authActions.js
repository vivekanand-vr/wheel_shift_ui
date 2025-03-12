import axios from 'axios';
import { 
  loginStart, 
  loginSuccess, 
  loginFailure, 
  registerStart, 
  registerSuccess, 
  registerFailure,
  logout
} from '../slices/authSlice';

// Set your API base URL here
const API_URL = 'http://localhost:9000/api/v1/users'; // Change this to your actual backend URL

export const loginUser = (credentials) => async (dispatch) => {
  try {
    dispatch(loginStart());
    const response = await axios.post(`${API_URL}/login`, credentials);
    dispatch(loginSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Login failed';
    dispatch(loginFailure(errorMessage));
    throw new Error(errorMessage);
  }
};

export const registerUser = (userData) => async (dispatch) => {
  try {
    dispatch(registerStart());
    const response = await axios.post(`${API_URL}`, userData);
    dispatch(registerSuccess(response.data));
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.message || 'Registration failed';
    dispatch(registerFailure(errorMessage));
    throw new Error(errorMessage);
  }
};

export const logoutUser = () => (dispatch) => {
  dispatch(logout());
};