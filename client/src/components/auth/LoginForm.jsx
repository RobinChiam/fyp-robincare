import { useState } from 'react';
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

const LoginForm = () => {
  const [credentials, setCredentials] = useState({
    identifier: '', // This will hold either IC/Passport or Email
    password: '',
  });

  const toast = useToast();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setCredentials((prev) => ({ ...prev, [id]: value }));
  };

  const handleLogin = async () => {
    // Simulate API call for login
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      });

      if (response.ok) {
        toast({
          title: 'Login successful.',
          status: 'success',
          isClosable: true,
        });
        // Redirect user to dashboard
      } else {
        const error = await response.json();
        toast({
          title: 'Login failed.',
          description: error.message || 'Invalid credentials.',
          status: 'error',
          isClosable: true,
        });
      }
    } catch (err) {
      toast({
        title: 'Network error.',
        description: 'Failed to login.',
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
