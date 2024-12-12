import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  const user = useSelector((state) => state.user.userDetails);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();

  useEffect(() => {
    // Check if the user is already logged in based on Redux state or token
    const token = localStorage.getItem('token');
    if (user || token) {
      setIsAlreadyLoggedIn(true);

      // Redirect based on user role
      if (user?.role === 'patient') {
        navigate('/dashboard/patient');
      } else if (user?.role === 'doctor') {
        navigate('/dashboard/doctor');
      } else if (user?.role === 'admin') {
        navigate('/dashboard/admin');
      }

      // Show a toast notification only if this is a pre-login state
      if (!user && token) {
        toast({
          title: 'Already logged in',
          description: 'You are being redirected to your dashboard.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      setIsAlreadyLoggedIn(false); // Ensure this is reset for logged-out state
    }
  }, [user, navigate, toast]);

  return (
    // Render LoginForm only if the user is not logged in
    !isAlreadyLoggedIn && <LoginForm />
  );
};

export default LoginPage;
