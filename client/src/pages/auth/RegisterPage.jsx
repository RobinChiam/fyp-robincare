import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@chakra-ui/react';import RegisterForm from '../../components/auth/RegisterForm';
const RegisterPage = () => {
  const user = useSelector((state) => state.user.userDetails);
    const navigate = useNavigate();
    const toast = useToast();
  
    useEffect(() => {
      if (user) {
        // Redirect based on user role
        if (user.role === 'patient') {
          navigate('/dashboard/patient');
        } else if (user.role === 'doctor') {
          navigate('/dashboard/doctor');
        } else if (user.role === 'admin') {
          navigate('/dashboard/admin');
        }
  
        // Show a toast notification
        toast({
          title: 'Already logged in',
          description: 'You are being redirected to your dashboard.',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    }, [user, navigate, toast]);

  return (
        <RegisterForm />  );
};

export default RegisterPage;
