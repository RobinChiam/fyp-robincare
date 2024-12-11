import { Box, Heading, Input, Button, VStack } from "@chakra-ui/react";

const ForgetPasswordForm = () => (
  <Box maxW="md" mx="auto" mt="8" p="6" boxShadow="lg" borderRadius="md">
    <Heading mb={6}>Forgot Password</Heading>
    <VStack spacing="4">
      <Input placeholder="Email" type="email" required />
      <Button colorScheme="blue" w="full" type="submit">Send Reset Link</Button>
    </VStack>
  </Box>
);

export default ForgetPasswordForm;
