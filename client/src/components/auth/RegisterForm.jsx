import { useState } from 'react';
import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Heading,
  Input,
  VStack,
  Select,
  Progress,
  InputGroup,
  InputRightElement,
  useToast,
  Link,
  HStack,
  Text,
  Checkbox,
} from '@chakra-ui/react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    icOrPassport: '',
    fullName: '',
    email: '',
    dob: '',
    phoneNumber: '',
    gender: '',
    password: '',
    confirmPassword: '',
  });

  const [step, setStep] = useState(1);
  const [pin, setPin] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null); // Store the selected file
  const toast = useToast();

  const validateStep1 = () => {
    const newErrors = {};
  
    // Format IC Number: Remove all non-numeric characters
    if (formData.icOrPassport) {
      formData.icOrPassport = formData.icOrPassport.replace(/\D/g, ''); // Strip all non-digits
    }
  
    // Date of Birth Validation
    if (!formData.dob) {
      newErrors.dob = 'Date of Birth is required.';
    } else {
      const dob = new Date(formData.dob);
      const formattedDOB = dob
        .toISOString()
        .slice(2, 10) // Extract YY-MM-DD
        .replace(/-/g, ''); // Format as YYMMDD
  
      // IC Number Validation
      if (!formData.icOrPassport) {
        newErrors.icOrPassport = 'IC Number is required.';
      } else if (!/^\d{12}$/.test(formData.icOrPassport)) {
        newErrors.icOrPassport = 'IC Number must be exactly 12 digits long.';
      } else {
        const icFirstSix = formData.icOrPassport.slice(0, 6);
        if (icFirstSix !== formattedDOB) {
          newErrors.icOrPassport = 'IC Number does not match the Date of Birth.';
        }
      }
    }
  
    if (!formData.fullName) newErrors.fullName = 'Full Name is required.';
    if (!formData.email || !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(formData.email))
      newErrors.email = 'Valid email is required.';
    if (!formData.phoneNumber || !/^\d{10,15}$/.test(formData.phoneNumber))
      newErrors.phoneNumber = 'Phone Number must be 10-15 digits.';
    if (!formData.gender) newErrors.gender = 'Gender is required.';
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  

  const handleNextStep = async () => {
    if (step === 1) {
      if (validateStep1()) {
        setStep(2);
      } else {
        toast({
          title: 'Validation Error',
          description: 'Please fill in all required fields.',
          status: 'error',
          isClosable: true,
        });
      }
    } else if (step === 2) {
      if (formData.password !== formData.confirmPassword) {
        toast({
          title: 'Password Mismatch',
          description: 'Passwords do not match.',
          status: 'error',
          isClosable: true,
        });
        return;
      }

      try {
        setIsLoading(true);
        await axios.post('http://localhost:5000/auth/register', formData);
        toast({
          title: 'Registration Successful!',
          description: 'Please check your email for the verification PIN.',
          status: 'success',
          isClosable: true,
        });
        setStep(3);
      } catch (err) {
        toast({
          title: 'Registration Failed',
          description: err.response?.data?.message || 'An error occurred.',
          status: 'error',
          isClosable: true,
        });
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePreviousStep = () => setStep((prev) => prev - 1);

  const handlePinVerification = async () => {
    setIsLoading(true);
    try {
      await axios.post('http://localhost:5000/auth/verify-pin', { email: formData.email, pin });
      toast({
        title: 'Account Verified',
        description: 'Your account has been created successfully!',
        status: 'success',
        isClosable: true,
      });
      setStep(4);
    } catch (err) {
      toast({
        title: 'Verification Failed',
        description: err.response?.data?.message || 'Invalid PIN.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileSelection = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      toast({
        title: 'File Selected',
        description: `You selected ${file.name}.`,
        status: 'info',
        isClosable: true,
      });
    }
  };

  const handleCompleteRegistration = async () => {
    setIsLoading(true);
  
    const formDataToSend = new FormData();
    if (selectedFile) {
      // Append the file only if a file was selected
      formDataToSend.append('profilePicture', selectedFile);
    }
    formDataToSend.append('email', formData.email);
  
    try {
      const response = await axios.post('http://localhost:5000/api/profilePic', formDataToSend, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
  
      toast({
        title: 'Registration Complete',
        description: response.data.message || 'Your account has been successfully registered.',
        status: 'success',
        isClosable: true,
      });
      setIsCompleted(true);
      setTimeout(() => navigate('/login'), 4000); // Redirect to login after a delay
    } catch (err) {
      toast({
        title: 'Upload Failed',
        description: err.response?.data?.message || 'An error occurred during the upload.',
        status: 'error',
        isClosable: true,
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Box px={8} py={12} maxW="lg" mx="auto">
      {isCompleted ? (
        <Heading textAlign="center" color="green.500" mb={6}>
          Registration Completed Successfully!
        </Heading>
      ) : (
        <>
          <Heading mb={6}>Register</Heading>
          <Progress value={(step / 4) * 100} size="sm" colorScheme="blue" mb={6} />
          <VStack spacing={4}>
            {step === 1 && (
              <>
                <FormControl id="fullName" isRequired>
                  <FormLabel>Full Name</FormLabel>
                  <Input
                    placeholder="Enter your full name"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                  {errors.fullName && <Text color="red.500">{errors.fullName}</Text>}
                </FormControl>
                <FormControl id="icOrPassport" isRequired>
                  <FormLabel>IC or Passport Number</FormLabel>
                  <Input
                    placeholder="Enter your IC or Passport Number"
                    value={formData.icOrPassport}
                    onChange={(e) => setFormData({ ...formData, icOrPassport: e.target.value })}
                  />
                  {errors.icOrPassport && <Text color="red.500">{errors.icOrPassport}</Text>}
                </FormControl>
                <FormControl id="email" isRequired>
                  <FormLabel>Email</FormLabel>
                  <Input
                    type="email"
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                  {errors.email && <Text color="red.500">{errors.email}</Text>}
                </FormControl>
                <FormControl id="dob" isRequired>
                  <FormLabel>Date of Birth</FormLabel>
                  <Input
                    type="date"
                    value={formData.dob}
                    onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  />
                  {errors.dob && <Text color="red.500">{errors.dob}</Text>}
                </FormControl>
                <FormControl id="phoneNumber" isRequired>
                  <FormLabel>Phone Number</FormLabel>
                  <Input
                    type="tel"
                    placeholder="Enter your phone number"
                    value={formData.phoneNumber}
                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                  />
                  {errors.phoneNumber && <Text color="red.500">{errors.phoneNumber}</Text>}
                </FormControl>
                <FormControl id="gender" isRequired>
                  <FormLabel>Gender</FormLabel>
                  <Select
                    placeholder="Select your gender"
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </Select>
                  {errors.gender && <Text color="red.500">{errors.gender}</Text>}
                </FormControl>
                <Button colorScheme="blue" width="100%" onClick={handleNextStep}>
                  Next
                </Button>
              </>
            )}
            {step === 2 && (
              <>
                <FormControl id="password" isRequired>
                  <FormLabel>Password</FormLabel>
                  <InputGroup>
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      placeholder="Enter your password"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      pr="4.5rem"
                    />
                    <InputRightElement width="4.5rem">
                      <Button size="sm" onClick={() => setShowPassword(!showPassword)} ml={1}>
                        {showPassword ? 'Hide' : 'Show'}
                      </Button>
                    </InputRightElement>
                  </InputGroup>
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
                <Checkbox
                  isChecked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  colorScheme="blue"
                  mt={4}
                >
                  I accept the{' '}
                  <Link href="/terms-and-privacy" color="blue.500" isExternal>
                    Terms and Privacy Agreement
                  </Link>
                  .
                </Checkbox>
                <HStack width="100%">
                  <Button variant="outline" onClick={handlePreviousStep}>
                    Back
                  </Button>
                  <Button
                    colorScheme="blue"
                    width="100%"
                    onClick={handleNextStep}
                    isDisabled={!acceptedTerms}
                    isLoading={isLoading}
                  >
                    Register
                  </Button>
                </HStack>
              </>
            )}
            {step === 3 && (
              <>
                <FormControl id="pin" isRequired>
                  <FormLabel>Verification PIN</FormLabel>
                  <Input
                    placeholder="Enter the 6-digit PIN sent to your email"
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                  />
                </FormControl>
                <Button
                  colorScheme="blue"
                  width="100%"
                  onClick={handlePinVerification}
                  isLoading={isLoading}
                >
                  Verify PIN
                </Button>
              </>
            )}
            {step === 4 && (
              <>
                <FormControl id="profilePicture">
                  <FormLabel>Profile Picture (Optional)</FormLabel>
                  <Input type="file" accept="image/*" onChange={handleFileSelection} />
                  <Text fontSize="sm" color="gray.500">
                    You can skip this step and upload a profile picture later in your profile settings.
                  </Text>
                </FormControl>
                <HStack width="100%">
                  <Button variant="outline" onClick={handlePreviousStep}>
                    Back
                  </Button>
                  <Button
                    colorScheme="blue"
                    width="100%"
                    onClick={handleCompleteRegistration}
                    isLoading={isLoading}
                  >
                    Complete Registration
                  </Button>
                </HStack>
              </>
            )}

          </VStack>
        </>
      )}
      <Text mt={6} textAlign="center">
        Already have an account?{' '}
        <Link href="/login" color="blue.500" fontWeight="bold">
          Click Here
        </Link>
      </Text>

      <Link href="/" color="blue.500" mt={6} display="block" textAlign="center">
        Back to Home
      </Link>
    </Box>
  );
};

export default RegisterForm;
