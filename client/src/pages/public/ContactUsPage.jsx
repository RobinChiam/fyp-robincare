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
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const ContactUsPage = () => {
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });
  const [loading, setLoading] = useState(false);
  const toast = useToast();
  const { colorMode, toggleColorMode } = useColorMode();

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      toast({
        title: 'Message Sent',
        description: 'We will get back to you shortly.',
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
      setFormData({ name: '', email: '', message: '' });
    } catch {
      toast({
        title: 'Error',
        description: 'Failed to send your message.',
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
      minHeight="100vh"
      bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
      color={colorMode === 'light' ? 'gray.800' : 'gray.200'}
      position="relative"
    >
      <Header />
      <Box flex="1" py={12}>
        <VStack spacing={8}>
          <Heading as="h1" size="2xl" textAlign="center" color="blue.500">
            Contact Us
          </Heading>
          <Text fontSize="lg" textAlign="center">
            Fill out the form below, and we’ll get back to you as soon as possible.
          </Text>
          <Box as="form" onSubmit={handleSubmit} width="100%" maxW="lg">
            <VStack spacing={6}>
              <FormControl id="name" isRequired>
                <FormLabel>Name</FormLabel>
                <Input placeholder="Your Name" value={formData.name} onChange={handleChange} />
              </FormControl>
              <FormControl id="email" isRequired>
                <FormLabel>Email</FormLabel>
                <Input placeholder="Your Email" value={formData.email} onChange={handleChange} />
              </FormControl>
              <FormControl id="message" isRequired>
                <FormLabel>Message</FormLabel>
                <Textarea placeholder="Your Message" value={formData.message} onChange={handleChange} />
              </FormControl>
              <Button type="submit" colorScheme="blue" width="100%" isLoading={loading}>
                Send Message
              </Button>
            </VStack>
          </Box>
        </VStack>
      </Box>
      <Box position="relative" bottom={4} right={4} textAlign={'right'}>
        <IconButton
          aria-label="Toggle Theme"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          size="lg"
          isRound
        />
      </Box>
      <Footer />
    </Box>
  );
};

export default ContactUsPage;
