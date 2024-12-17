import React from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Image,
  Flex,
  SimpleGrid,
  IconButton,
  useColorMode,
  Container,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const HomePage = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  const Feature = ({ title, description }) => (
    <Box p={6} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
      <Heading as="h3" size="md" mb={2} color="blue.500">
        {title}
      </Heading>
      <Text color="gray.700">{description}</Text> {/* Explicit color */}
    </Box>
  );

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

      <Box flex="1" as="main" py={12}>
        <Container maxW="6xl">
          {/* Hero Section */}
          <Flex
            align="center"
            justify="center"
            flexDirection={{ base: 'column', md: 'row' }}
            gap={8}
            py={12}
          >
            <Stack spacing={6} maxW="lg">
              <Heading as="h1" size="2xl" color="blue.500">
                Your Health, Our Priority
              </Heading>
              <Text fontSize="lg">
                Book appointments, consult with top doctors, and securely manage your health records all in one place.
              </Text>
              <Button colorScheme="blue" size="lg" as="a" href="/register">
                Get Started
              </Button>
            </Stack>
            <Image
              src="https://img.freepik.com/premium-photo/dynamic-healthcare-photography-doctors-innovation_1281529-16781.jpg"
              alt="Healthcare"
              borderRadius="lg"
              boxShadow="lg"
              maxW={{ base: '90%', md: '400px' }}
            />
          </Flex>

          {/* Feature Section */}
          <Box py={10}>
            <Heading as="h2" size="xl" textAlign="center" mb={6}>
              Why Choose Us?
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 3 }} spacing={8}>
              <Feature
                title="Expert Doctors"
                description="Access highly qualified healthcare professionals across specialties."
              />
              <Feature
                title="Easy Appointments"
                description="Schedule appointments conveniently and at your fingertips."
              />
              <Feature
                title="Secure Records"
                description="Your data is encrypted, secure, and always available when needed."
              />
            </SimpleGrid>
          </Box>
        </Container>
      </Box>

      {/* Theme Toggle Above Footer */}
      <Box position="relative" bottom={10} right={4} textAlign="right">
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

// Feature Component
const Feature = ({ title, description }) => (
  <Box p={6} shadow="md" borderWidth="1px" borderRadius="lg" bg="white">
    <Heading as="h3" size="md" mb={2} color="blue.500">
      {title}
    </Heading>
    <Text>{description}</Text>
  </Box>
);

export default HomePage;
