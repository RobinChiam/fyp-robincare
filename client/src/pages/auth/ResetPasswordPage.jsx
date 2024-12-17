import React, { useState } from 'react';
import {
  Box,
  Input,
  Button,
  Text,
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
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

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
      const response = await axios.post(`http://localhost:5000/auth/reset-password/${token}`, {
        password,
      });
      toast({
        title: 'Success',
        description: response.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      navigate('/login');
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
          Reset Password
        </Heading>
        <Text mb={6} textAlign="center">
          Enter your new password below.
        </Text>
        <VStack spacing={4} align="stretch">
          <FormControl>
            <FormLabel>New Password</FormLabel>
            <Input
              type="password"
              placeholder="Enter new password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              borderColor="blue.400"
              focusBorderColor="blue.600"
              border="2px"
            />
          </FormControl>
          <FormControl>
            <FormLabel>Confirm Password</FormLabel>
            <Input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              borderColor="blue.400"
              focusBorderColor="blue.600"
              border="2px"
            />
          </FormControl>
          <Button colorScheme="blue" onClick={handleResetPassword} size="lg" width="full">
            Reset Password
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
  );
};

export default ResetPasswordPage;
