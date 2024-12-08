import React from 'react';
import {
  Box,
  Heading,
  Input,
  Textarea,
  Button,
  FormControl,
  FormLabel,
  VStack,
  Text,
} from '@chakra-ui/react';

const ContactUsPage = () => {
  return (
    <Box px={8} py={12}>
      <VStack spacing={6}>
        <Heading>Contact Us</Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center" maxW="lg">
          Have questions or concerns? Reach out to us, and we’ll get back to you
          as soon as possible.
        </Text>
        <Box width="100%" maxW="lg">
          <FormControl id="name" isRequired>
            <FormLabel>Name</FormLabel>
            <Input placeholder="Your Name" />
          </FormControl>
          <FormControl id="email" isRequired mt={4}>
            <FormLabel>Email</FormLabel>
            <Input type="email" placeholder="Your Email Address" />
          </FormControl>
          <FormControl id="message" isRequired mt={4}>
            <FormLabel>Message</FormLabel>
            <Textarea placeholder="Your Message" />
          </FormControl>
          <Button colorScheme="blue" mt={6} width="100%">
            Send Message
          </Button>
        </Box>
      </VStack>
    </Box>
  );
};

export default ContactUsPage;
