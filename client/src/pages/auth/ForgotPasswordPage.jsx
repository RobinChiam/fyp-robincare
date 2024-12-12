import React, { useEffect, useState } from 'react';
import { Box, Text, Input, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';
import { useSelector } from 'react-redux';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();
  const navigate = useNavigate();

  // Access the logged-in user's details from Redux
  const user = useSelector((state) => state.user.userDetails);

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

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/forget-password', { email });
      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'An error occurred.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };

  return (
    // Render form only if user is not logged in
    !user && (
      <Box p={8} maxWidth="400px" margin="auto">
        <Text mb={4}>Enter your email to reset your password:</Text>
        <Input
          placeholder="Email address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          mb={4}
        />
        <Button onClick={handleForgotPassword} colorScheme="blue">
          Submit
        </Button>
      </Box>
    )
  );
};

export default ForgotPasswordPage;
