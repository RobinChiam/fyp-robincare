import { Box, Heading, FormControl, FormLabel, Input, Button, VStack } from '@chakra-ui/react';

const LoginForm = () => (
    <Box px={8} py={12} maxW="lg" mx="auto">
      <Heading mb={6}>Login</Heading>
      <VStack spacing={4}>
        <FormControl id="email" isRequired>
          <FormLabel>Email</FormLabel>
          <Input type="email" placeholder="Enter your email" />
        </FormControl>
        <FormControl id="password" isRequired>
          <FormLabel>Password</FormLabel>
          <Input type="password" placeholder="Enter your password" />
        </FormControl>
        <Button colorScheme="blue" width="100%">
          Login
        </Button>
        <Button variant="link" colorScheme="blue" as="a" href="/reset-password">
          Forgot Password?
        </Button>
      </VStack>
    </Box>
);

export default LoginForm;
