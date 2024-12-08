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
  Text,
} from '@chakra-ui/react';
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

  const [step, setStep] = useState(1); // Step 1: Registration form, Step 2: PIN input
  const [pin, setPin] = useState('');
  const [email, setEmail] = useState(''); // Store email for PIN verification
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

  const handleRegister = async () => {
    if (!validateForm()) return;

    try {
      const response = await axios.post('/auth/register', formData);
      setEmail(formData.email); // Store email for PIN verification
      toast({
        title: 'Verification email sent!',
        description: 'Check your email for the 6-digit PIN.',
        status: 'success',
        isClosable: true,
      });
      setStep(2); // Move to the PIN input step
    } catch (error) {
      toast({
        title: 'Registration failed.',
        description: error.response?.data?.message || 'An error occurred.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  const handlePinVerification = async () => {
    try {
      const response = await axios.post('/auth/verify-pin', { email, pin });
      toast({
        title: 'Account created successfully!',
        status: 'success',
        isClosable: true,
      });
      // Redirect to login or dashboard
    } catch (error) {
      toast({
        title: 'PIN verification failed.',
        description: error.response?.data?.message || 'Invalid PIN.',
        status: 'error',
        isClosable: true,
      });
    }
  };

  return (
    <Box px={8} py={12} maxW="lg" mx="auto">
      {step === 1 ? (
        <>
          <Heading mb={6}>Register</Heading>
          <VStack spacing={4}>
            {Object.values(errors).map((err, idx) => (
              <Text color="red.500" key={idx}>
                {err}
              </Text>
            ))}
            <FormControl id="icOrPassport" isRequired>
              <FormLabel>IC or Passport Number</FormLabel>
              <Input
                placeholder="Enter your IC or Passport Number"
                value={formData.icOrPassport}
                onChange={(e) => setFormData({ ...formData, icOrPassport: e.target.value })}
              />
            </FormControl>
            <FormControl id="fullName" isRequired>
              <FormLabel>Full Name</FormLabel>
              <Input
                placeholder="Enter your full name"
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              />
            </FormControl>
            <FormControl id="email" isRequired>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </FormControl>
            <FormControl id="dob" isRequired>
              <FormLabel>Date of Birth</FormLabel>
              <Input
                type="date"
                value={formData.dob}
                onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
              />
            </FormControl>
            <FormControl id="password" isRequired>
              <FormLabel>Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              />
            </FormControl>
            <FormControl id="confirmPassword" isRequired>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm your password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
              />
            </FormControl>
            <Button colorScheme="blue" width="100%" onClick={handleRegister}>
              Register
            </Button>
          </VStack>
        </>
      ) : (
        <>
          <Heading mb={6}>Enter Verification PIN</Heading>
          <VStack spacing={4}>
            <FormControl id="pin" isRequired>
              <FormLabel>6-digit PIN</FormLabel>
              <Input
                placeholder="Enter the PIN sent to your email"
                value={pin}
                onChange={(e) => setPin(e.target.value)}
              />
            </FormControl>
            <Button colorScheme="blue" width="100%" onClick={handlePinVerification}>
              Verify PIN
            </Button>
          </VStack>
        </>
      )}
    </Box>
  );
};

export default RegisterForm;
