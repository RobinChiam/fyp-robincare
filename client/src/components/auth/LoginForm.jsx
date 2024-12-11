import { useState } from 'react';
import axios from 'axios';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  useToast,
} from '@chakra-ui/react';

import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    identifier: '', // Holds either IC/Passport or Email
    password: '',
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async () => {
    try {
      // Send login request with credentials
      const response = await axios.post(
        'http://localhost:5000/auth/login',
        credentials,
        { withCredentials: true } // Ensure cookies are sent and received
      );

      const { user } = response.data; // User data from session
      toast({
        title: 'Login successful.',
        status: 'success',
        isClosable: true,
      });

      // Redirect based on role
      if (user.role === 'patient') {
        navigate('/dashboard/patient');
      } else if (user.role === 'doctor') {
        navigate('/dashboard/doctor');
      } else if (user.role === 'admin') {
        navigate('/dashboard/admin');
      }
    } catch (err) {
      console.error("Login error:", err.response?.data || err.message);
      toast({
        title: 'Login failed.',
        description:
          err.response?.data?.message || 'Invalid credentials or network error.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <Box px={8} py={12} maxW="lg" mx="auto">
      <Heading mb={6}>Login</Heading>
      <VStack spacing={4}>
        <FormControl id="identifier" isRequired>
          <FormLabel>Email or IC/Passport Number</FormLabel>
          <Input
            placeholder="Enter your email or IC/Passport Number"
            value={credentials.identifier}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={credentials.password}
            onChange={handleChange}
          />
        </FormControl>
        <Button colorScheme="blue" width="100%" onClick={handleLogin}>
          Login
        </Button>
        <Button variant="link" colorScheme="blue" as="a" href="/reset-password">
          Forgot Password?
        </Button>
      </VStack>
    </Box>
  );
};

export default LoginForm;
