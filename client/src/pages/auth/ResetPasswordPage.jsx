import React from 'react';
import { Box, Heading, FormControl, FormLabel, Input, Button, VStack } from '@chakra-ui/react';

const ResetPasswordPage = () => {
  return (
    <Box px={8} py={12} maxW="lg" mx="auto">
      <Heading mb={6}>Reset Password</Heading>
      <VStack spacing={4}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Enter your email" />
        </FormControl>
        <Button colorScheme="blue" width="100%">
          Send Reset Link
        </Button>
      </VStack>
    </Box>
  );
};

export default ResetPasswordPage;
