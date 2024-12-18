import { configureStore } from '@reduxjs/toolkit';
import userReducer from '../features/userSlice';

const preloadedState = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const user = JSON.parse(atob(token.split('.')[1])); // Decode JWT payload
        return { user: { userDetails: { ...user, _id: user.id || user._id } } }; // Map `id` to `_id`
      } catch (err) {
        console.error('Failed to decode token:', err);
        return {};
      }
    }
    return {};
  };
  

const store = configureStore({
  reducer: {
    user: userReducer,
  },
  preloadedState: preloadedState(), // Load initial state
});

export default store;
