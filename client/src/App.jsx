import React from 'react';
import AppRoutes from './routes/AppRoutes';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { setUser, clearUser } from './features/userSlice';
import axiosInstance from './utils/axiosInstance';
const App = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      axiosInstance
        .get('/api/users/me')
        .then((response) => {
          dispatch(setUser(response.data));
        })
        .catch((err) => {
          console.error('Failed to fetch user data:', err.message);
          localStorage.removeItem('token');
          dispatch(clearUser());
        });
    }
  }, [dispatch]);
  return (
   < AppRoutes />
  );
};  

export default App;
