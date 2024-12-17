import React from 'react';
import {
  Box,
  Heading,
  Text,
  VStack,
  Flex,
  Image,
  Container,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const AboutUsPage = () => {
  const { colorMode, toggleColorMode } = useColorMode();

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
        <Container maxW="6xl">
          <VStack spacing={10}>
            <Heading as="h1" size="2xl" textAlign="center" color="blue.500">
              About Us
            </Heading>

            <Text fontSize="lg" textAlign="center" px={{ base: 4, md: 0 }}>
              We are dedicated to improving healthcare accessibility, efficiency, and outcomes for patients and providers through innovative technology.
            </Text>

            {/* Our Mission Section */}
            <Box bg="white" shadow="lg" borderRadius="lg" p={8} w="100%">
              <Heading as="h2" size="lg" mb={4} color="gray.800">
                Our Mission
              </Heading>
              <Text fontSize="md" color="gray.700">
                Our mission is to bridge the gap between patients and healthcare providers, creating a seamless healthcare experience for all.
              </Text>
            </Box>

            <Flex
              direction={{ base: 'column', md: 'row' }}
              align="center"
              bg="white"
              shadow="lg"
              borderRadius="lg"
              p={6}
              w="100%"
            >
              <Image
                src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi752Rgs296dEl1R_34upm50nxMfokCQiwPV3dFEMG5Lb9CvjuykEwgTdp-6sXW2FnJ6AXHa3-88X4-Nzidg9iAJeEcuR1hWur3_FLQFADJ9ijyDLhvicNAbEQo0X55cU6vO5lmGG-JdEM/s1600/Healthcare+Warriors.jpg"
                alt="Our Team"
                borderRadius="lg"
                maxW="300px"
                mb={{ base: 4, md: 0 }}
              />
               <Box ml={{ md: 6 }}>
                <Heading as="h2" size="lg" mb={4} color="gray.800">
                  Who Are We?
                </Heading>
                <Text color="gray.700">
                  A passionate team of healthcare professionals, developers, and innovators committed to enhancing healthcare delivery.
                </Text>
              </Box>
            </Flex>
          </VStack>
        </Container>
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

export default AboutUsPage;
