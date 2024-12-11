import { Box, Heading, Input, Button, VStack } from "@chakra-ui/react";
import React, {useState} from "react";
import axios from "axios";

const ForgetPasswordForm = ({token}) => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);

    async function handleSubmit(e) {
        e.preventDefault();
        setError(null);
        setMessage(null);
        
        if (password !== confirmPassword) {
          setError("Passwords don't match");
          return;
        }
    
        try {
          const res = await axios.post('http://localhost:5000/auth/reset-password', {
            token,
            newPassword: password
          });
    
          setMessage('Password has been successfully reset');
          // You can choose to redirect to a login page here
          // window.location.href = '/login';
        } catch (err) {
          // If the server responded with an error message
          if (err.response && err.response.data && err.response.data.error) {
            setError(err.response.data.error);
          } else {
            setError('An unexpected error occurred. Please try again.');
          }
        }
      }

return (
    <Box maxW="md" mx="auto" mt="8" p="6" boxShadow="lg" borderRadius="md">
    <VStack spacing="4">
      <Input placeholder="Password" type="password" required />
      <Input placeholder="ConfirmPassword" type="password" required />
      <Button colorScheme="blue" w="full" type="submit">Reset Password</Button>
    </VStack>
  </Box>
)
};

export default ForgetPasswordForm;
