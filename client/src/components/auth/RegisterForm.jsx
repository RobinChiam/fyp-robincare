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
import { useState } from 'react';
import axios from 'axios';

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    icOrPassport: '',
    fullName: '',
    email: '',
    dob: '',
    password: '',
    confirmPassword: '',
  });

  const [errors, setErrors] = useState({});
  const toast = useToast();

  const validateForm = () => {
    const newErrors = {};

    if (!formData.icOrPassport) newErrors.icOrPassport = 'IC or Passport is required.';
    if (!formData.fullName) newErrors.fullName = 'Full Name is required.';
    if (!formData.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = 'Invalid email format.';
    if (!formData.dob) newErrors.dob = 'Date of Birth is required.';
    if (!formData.password || formData.password.length < 8)
      newErrors.password = 'Password must be at least 8 characters.';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };


  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post('/auth/register', formData);
      toast({
        title: 'Registration successful!',
        description: 'Check your email for the 6-digit PIN to verify your account.',
        status: 'success',
        isClosable: true,
      });
    } catch (error) {
      toast({
        title: 'Registration failed.',
        description: error.response?.data?.message || 'An error occurred.',
        status: 'error',
        isClosable: true,
      });
    }
  }; 

  return (
    <Box px={8} py={12} maxW="lg" mx="auto">
      <Heading mb={6}>Register</Heading>
      <VStack spacing={4}>
        <FormControl id="icOrPassport" isRequired>
          <FormLabel>IC or Passport Number</FormLabel>
          <Input
            placeholder="Enter your IC or Passport Number"
            value={formData.icOrPassport}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="fullName" isRequired>
          <FormLabel>Full Name</FormLabel>
          <Input
            placeholder="Enter your full name"
            value={formData.fullName}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input
            type="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="dob" isRequired>
          <FormLabel>Date of Birth</FormLabel>
          <Input
            type="date"
            value={formData.dob}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input
            type="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
          />
        </FormControl>
        <FormControl id="confirmPassword" isRequired>
          <FormLabel>Confirm Password</FormLabel>
          <Input
            type="password"
            placeholder="Confirm your password"
            value={formData.confirmPassword}
            onChange={handleChange}
          />
        </FormControl>
        <Button colorScheme="blue" width="100%" onClick={handleSubmit}>
          Register
        </Button>
      </VStack>
    </Box>
  );
};
export default RegisterForm;
