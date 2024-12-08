import React from 'react';
import { Box, Heading, Text, Stack, VStack, Flex } from '@chakra-ui/react';

const AboutUsPage = () => {
  return (
    <Box px={8} py={12} bg="gray.50">
      <VStack spacing={6}>
        <Heading as="h1" size="xl">
          About Us
        </Heading>
        <Text fontSize="lg" color="gray.600" textAlign="center" maxW="3xl">
          We are dedicated to providing world-class healthcare solutions that
          connect patients and doctors seamlessly. Our mission is to improve
          health outcomes through technology.
        </Text>
        <Stack direction={{ base: 'column', md: 'row' }} spacing={8} pt={8}>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading fontSize="lg">Accessible Healthcare</Heading>
            <Text mt={4}>Easy appointment booking and medical consultations.</Text>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading fontSize="lg">Secure Records</Heading>
            <Text mt={4}>
              Keep all your health records secure and accessible at any time.
            </Text>
          </Box>
          <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
            <Heading fontSize="lg">Expert Doctors</Heading>
            <Text mt={4}>Consult with top-notch specialists in various fields.</Text>
          </Box>
        </Stack>
      </VStack>
    </Box>
  );
};

export default AboutUsPage;
