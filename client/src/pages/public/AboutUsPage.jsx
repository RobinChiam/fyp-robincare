import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  VStack,
  Flex,
  Image,
  Container,
} from '@chakra-ui/react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const AboutUsPage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh" // Ensures footer placement for short content
    >
      <Header />
      <Box flex="1" bg="gray.50" py={12}>
        <Container maxW={{ base: '100%', md: '80%', lg: '70%' }} px={4}>
          <VStack spacing={8}>
            {/* Page Heading */}
            <Heading as="h1" size="xl">
              About Us
            </Heading>
            {/* Introductory Section */}
            <Text fontSize="lg" color="gray.600" textAlign="center">
              We are a healthcare technology company committed to revolutionizing
              the way patients and doctors interact. Our goal is to make healthcare
              more accessible, efficient, and effective for everyone.
            </Text>

            {/* Mission Statement Section */}
            <Box bg="white" shadow="md" borderRadius="md" p={6} w="100%">
              <Heading as="h2" size="lg" mb={4}>
                Our Mission
              </Heading>
              <Text fontSize="md" color="gray.700">
                Our mission is to improve health outcomes by bridging the gap
                between patients and healthcare providers through innovative
                technology solutions. We strive to create a seamless and
                efficient healthcare experience for all.
              </Text>
            </Box>

            {/* Who Are We Section */}
            <Flex
              direction={{ base: 'column', md: 'row' }}
              align="center"
              justify="space-between"
              bg="white"
              shadow="md"
              borderRadius="md"
              p={6}
              w="100%"
            >
              <Image
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi752Rgs296dEl1R_34upm50nxMfokCQiwPV3dFEMG5Lb9CvjuykEwgTdp-6sXW2FnJ6AXHa3-88X4-Nzidg9iAJeEcuR1hWur3_FLQFADJ9ijyDLhvicNAbEQo0X55cU6vO5lmGG-JdEM/s1600/Healthcare+Warriors.jpg"
                alt="Team working together"
                borderRadius="md"
                objectFit="cover"
                maxW="300px"
                mb={{ base: 4, md: 0 }}
              />
              <Box ml={{ md: 6 }}>
                <Heading as="h2" size="lg" mb={4}>
                  Who Are We?
                </Heading>
                <Text fontSize="md" color="gray.700">
                  We are a team of passionate healthcare professionals,
                  developers, and innovators dedicated to leveraging technology to
                  improve healthcare services. Our focus is on delivering
                  solutions that address real-world challenges faced by patients
                  and healthcare providers.
                </Text>
              </Box>
            </Flex>

            {/* Why Do We Strive Section */}
            <Box bg="white" shadow="md" borderRadius="md" p={6} w="100%">
              <Heading as="h2" size="lg" mb={4}>
                Why Do We Strive to Improve Healthcare?
              </Heading>
              <Text fontSize="md" color="gray.700">
                Healthcare is a fundamental need, and everyone deserves access to
                quality medical care. We believe that by streamlining processes,
                improving communication, and making healthcare data more
                accessible, we can empower patients and providers to make better
                decisions together.
              </Text>
            </Box>

            {/* Features Section */}
            <Stack direction={{ base: 'column', md: 'row' }} spacing={8} pt={8}>
              <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                <Heading fontSize="lg">Accessible Healthcare</Heading>
                <Text mt={4}>
                  Easy appointment booking and seamless medical consultations for
                  patients and providers.
                </Text>
              </Box>
              <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                <Heading fontSize="lg">Secure Records</Heading>
                <Text mt={4}>
                  Keep all your health records secure and accessible whenever you
                  need them.
                </Text>
              </Box>
              <Box p={5} shadow="md" borderWidth="1px" borderRadius="md">
                <Heading fontSize="lg">Expert Doctors</Heading>
                <Text mt={4}>
                  Consult with experienced specialists in a variety of medical
                  fields.
                </Text>
              </Box>
            </Stack>
          </VStack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default AboutUsPage;
