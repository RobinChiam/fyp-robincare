import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Input, Button, Text, useToast } from '@chakra-ui/react';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { token } = useParams(); // Extract token from URL
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const toast = useToast();

  const handleResetPassword = async () => {
    if (password !== confirmPassword) {      
        toast({
        title: 'Error',
        description: 'Passwords do not match.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });

      return;
    }

    try {
      const response = await axios.post(`http://localhost:5000/auth/reset-password/${token}`, { password });
      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login'); // Redirect to login page after successful reset
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
    <Box p={8} maxWidth="400px" margin="auto">
      {token ? (
        <>
          <Text mb={4}>Enter your new password:</Text>
          <Input
            type="password"
            placeholder="New password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            mb={4}
          />
          <Input
            type="password"
            placeholder="Confirm new password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            mb={4}
          />
          <Button onClick={handleResetPassword} colorScheme="blue">
            Reset Password
          </Button>
          {message && <Text mt={4}>{message}</Text>}
        </>
      ) : (
        <Text>Invalid or missing token. Please check your email for the reset link.</Text>
      )}
    </Box>
  );
};

export default ResetPasswordPage;
