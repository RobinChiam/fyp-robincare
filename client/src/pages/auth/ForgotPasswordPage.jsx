import React, { useState } from 'react';
import { Box, Text, Heading, FormControl, FormLabel, Input, Button, useToast } from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom'; 
import axios from 'axios';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const toast = useToast();

  const handleForgotPassword = async () => {
    try {
      const response = await axios.post('http://localhost:5000/auth/forget-password', {email} );
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
  );
};

export default ForgotPasswordPage;
