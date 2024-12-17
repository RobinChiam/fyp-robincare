import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import {
  useToast,
  Box,
  Heading,
  Text,
  Spinner,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import LoginForm from '../../components/auth/LoginForm';

const LoginPage = () => {
  const user = useSelector((state) => state.user.userDetails);
  const [isAlreadyLoggedIn, setIsAlreadyLoggedIn] = useState(false);
  const navigate = useNavigate();
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (user || token) {
      setIsAlreadyLoggedIn(true);

      if (user?.role === 'patient') navigate('/dashboard/patient');
      else if (user?.role === 'doctor') navigate('/dashboard/doctor');
      else if (user?.role === 'admin') navigate('/dashboard/admin');

      if (!user && token) {
        toast({
          title: 'Already logged in',
          description: 'Redirecting to dashboard...',
          status: 'info',
          duration: 3000,
          isClosable: true,
        });
      }
    } else {
      setIsAlreadyLoggedIn(false);
    }
  }, [user, navigate, toast]);

  return (
    <Box
      minH="100vh"
      bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
      color={colorMode === 'light' ? 'gray.800' : 'gray.50'}
      display="flex"
      alignItems="center"
      justifyContent="center"
      px={{ base: 4, md: 8 }}
      position="relative"
    >
      {!isAlreadyLoggedIn ? (
        <Box
          bg={colorMode === 'light' ? 'white' : 'gray.700'}
          p={{ base: 6, md: 12 }}
          borderRadius="lg"
          boxShadow="2xl"
          width="100%"
          maxW="500px"
        >
          <Heading as="h2" mb={8} textAlign="center" color="blue.500" fontSize="2xl">
            Welcome Back!
          </Heading>
          <Text mb={8} textAlign="center" fontSize="md">
            Please log in to access your account.
          </Text>
          <LoginForm />
        </Box>
      ) : (
        <Box textAlign="center">
          <Spinner size="lg" color="blue.500" />
          <Text mt={4}>Redirecting to your dashboard...</Text>
        </Box>
      )}

      {/* Light/Dark Mode Toggle */}
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
  );
};

export default LoginPage;
