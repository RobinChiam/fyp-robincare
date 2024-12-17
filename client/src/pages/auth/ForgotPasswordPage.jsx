import React, { useEffect, useState } from 'react';
import {
  Box,
  Text,
  Input,
  Button,
  useToast,
  Heading,
  VStack,
  FormControl,
  FormLabel,
  useColorMode,
  IconButton,
  Link,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector } from 'react-redux';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const toast = useToast();
  const navigate = useNavigate();
  const { colorMode, toggleColorMode } = useColorMode();

  const user = useSelector((state) => state.user.userDetails);

  useEffect(() => {
    if (user) {
      if (user.role === 'patient') navigate('/dashboard/patient');
      else if (user.role === 'doctor') navigate('/dashboard/doctor');
      else if (user.role === 'admin') navigate('/dashboard/admin');

      toast({
        title: 'Already logged in',
        description: 'Redirecting to your dashboard.',
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
    !user && (
      <Box
        minH="100vh"
        bg={colorMode === 'light' ? 'gray.100' : 'gray.800'}
        color={colorMode === 'light' ? 'gray.800' : 'gray.100'}
        display="flex"
        alignItems="center"
        justifyContent="center"
        position="relative"
      >
        <Box
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          p={8}
          borderRadius="md"
          boxShadow="lg"
          width="100%"
          maxW="400px"
        >
          <Heading as="h2" size="lg" mb={6} textAlign="center">
            Forgot Password
          </Heading>
          <Text mb={6} textAlign="center">
            Enter your email below to receive a password reset link.
          </Text>
          <VStack spacing={4} align="stretch">
            <FormControl>
              <FormLabel>Email Address</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                borderColor="blue.400"
                focusBorderColor="blue.600"
                border="2px"
              />
            </FormControl>
            <Button
              colorScheme="blue"
              onClick={handleForgotPassword}
              size="lg"
              width="full"
            >
              Submit
            </Button>
          </VStack>

          <Box mt={6} textAlign="center">
            <Link href="/" color="blue.500">
              Back to Home
            </Link>
          </Box>
        </Box>

        {/* Dark/Light Mode Toggle at Bottom Right */}
        <Box position="absolute" bottom={4} right={4}>
          <IconButton
            aria-label="Toggle Theme"
            icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            onClick={toggleColorMode}
            size="lg"
            isRound
          />
        </Box>
      </Box>
    )
  );
};

export default ForgotPasswordPage;
