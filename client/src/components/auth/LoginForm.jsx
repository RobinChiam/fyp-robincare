import { useState } from 'react';
import axiosInstance from '../../utils/axiosInstance';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  HStack,
  useToast,
  Text,
  Link,
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../../features/userSlice';

const LoginForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [credentials, setCredentials] = useState({
    identifier: '',
    password: '',
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async () => {
    try {
      const response = await axiosInstance.post('/auth/login', credentials);
      const { token, user } = response.data;
  
      // Save JWT to localStorage
      localStorage.setItem('token', token);
  
      // Save user details to Redux, ensuring `_id` is set
      dispatch(setUser({ ...user, _id: user._id || user.id }));
  
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
      console.error('Login error:', err.response?.data || err.message);
      toast({
        title: 'Login failed.',
        description: err.response?.data?.message || 'Invalid credentials or network error.',
        status: 'error',
        isClosable: true,
      });
    }
  };
  

  return (
    <Box px={8} py={12} maxW="lg" mx="auto">
      <Button
        variant="link"
        colorScheme="blue"
        mb={6}
        onClick={() => navigate('/')}
      >
        Back to Home
      </Button>

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
        <HStack justify="space-between" width="100%">
          <Button variant="link" colorScheme="blue" as="a" href="/forgot-password">
            Forgot Password?
          </Button>
          <Text fontSize="sm">
            Don’t have an account?{' '}
            <Link href="/register" color="blue.500" fontWeight="bold">
              Click Here
            </Link>
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};

export default LoginForm;
