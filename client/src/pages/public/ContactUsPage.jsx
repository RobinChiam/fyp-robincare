import React, { useState } from 'react';
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
  useToast,
} from '@chakra-ui/react';
import axios from 'axios';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const toast = useToast();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await axios.post('http://localhost:5000/api/contact', formData);
      toast({
        title: 'Message Sent',
        description: 'We have received your message and will get back to you shortly.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setFormData({ name: '', email: '', message: '' }); // Reset form
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Something went wrong. Please try again later.',
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh" // Ensures the container takes full viewport height
    >
      <Header />
      <Box flex="1" px={8} py={12}>
        {/* Main Content */}
        <VStack spacing={6}>
          <Heading>Contact Us</Heading>
          <Text fontSize="lg" color="gray.600" textAlign="center" maxW="lg">
            Have questions or concerns? Reach out to us, and we’ll get back to you
            as soon as possible.
          </Text>
          <Box as="form" onSubmit={handleSubmit} width="100%" maxW="lg">
            <FormControl id="name" isRequired>
              <FormLabel>Name</FormLabel>
              <Input
                placeholder="Your Name"
                value={formData.name}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="email" isRequired mt={4}>
              <FormLabel>Email</FormLabel>
              <Input
                type="email"
                placeholder="Your Email Address"
                value={formData.email}
                onChange={handleChange}
              />
            </FormControl>
            <FormControl id="message" isRequired mt={4}>
              <FormLabel>Message</FormLabel>
              <Textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={handleChange}
              />
            </FormControl>
            <Button
              colorScheme="blue"
              mt={6}
              width="100%"
              type="submit"
              isLoading={loading}
            >
              Send Message
            </Button>
          </Box>
        </VStack>
      </Box>
      <Footer />
    </Box>
  );
};

export default ContactUsPage;
