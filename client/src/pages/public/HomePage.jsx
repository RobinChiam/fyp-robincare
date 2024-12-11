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
  useBreakpointValue,
  Icon,
  Container,
} from '@chakra-ui/react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const HomePage = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh" // Ensures the footer is pushed to the bottom for short content
    >
      <Header />
      <Box flex="1" as="main" bg="blue.50" py={10}>
        <Container maxW={{ base: '100%', md: '80%', lg: '70%' }}>
          {/* Hero Section */}
          <Flex
            align="center"
            justify="center"
            flexDirection={useBreakpointValue({ base: 'column', md: 'row' })}
            gap={8}
          >
            <Stack spacing={6} maxW="lg">
              <Heading as="h1" size="2xl">
                Your Health, Our Priority
              </Heading>
              <Text fontSize="lg" color="gray.600">
                Welcome to our Healthcare Management System. Book appointments,
                consult with doctors, and access your health records — all in one
                place.
              </Text>
              <Button colorScheme="blue" size="lg" as="a" href="/register">
                Get Started
              </Button>
            </Stack>
            <Image
              src="https://img.freepik.com/premium-photo/dynamic-healthcare-photography-doctors-innovation_1281529-16781.jpg"
              alt="Healthcare"
              maxW={{ base: '90%', md: '400px' }}
              w="auto"
              h="auto"
              objectFit="contain"
              borderRadius="md"
              boxShadow="md"
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
                description="Our platform connects you with experienced and certified healthcare professionals."
                icon={<Icon name="star" />}
              />
              <Feature
                title="Easy Appointments"
                description="Schedule your appointments quickly and easily from anywhere."
                icon={<Icon name="calendar" />}
              />
              <Feature
                title="Secure Records"
                description="Your health records are stored securely and accessible anytime."
                icon={<Icon name="lock" />}
              />
            </SimpleGrid>
          </Box>

          {/* Testimonials Section */}
          <Box py={10}>
            <Heading as="h2" size="xl" textAlign="center" mb={6}>
              What Our Users Say
            </Heading>
            <SimpleGrid columns={{ base: 1, md: 2 }} spacing={8}>
              <Testimonial
                name="John Doe"
                feedback="This platform is a game-changer. Booking appointments is now effortless!"
                avatar="https://media.istockphoto.com/id/1437816897/photo/business-woman-manager-or-human-resources-portrait-for-career-success-company-we-are-hiring.jpg?s=612x612&w=0&k=20&c=tyLvtzutRh22j9GqSGI33Z4HpIwv9vL_MZw_xOE19NQ="
              />
              <Testimonial
                name="Jane Smith"
                feedback="I love having all my health records in one place. Highly recommend it!"
                avatar="https://via.placeholder.com/80"
              />
            </SimpleGrid>
          </Box>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

// Feature Component
const Feature = ({ title, description, icon }) => (
  <Stack align="center" bg="white" shadow="md" p={6} rounded="lg">
    {icon}
    <Heading as="h3" size="md">
      {title}
    </Heading>
    <Text textAlign="center">{description}</Text>
  </Stack>
);

// Testimonial Component
const Testimonial = ({ name, feedback, avatar }) => (
  <Flex align="center" shadow="md" p={6} rounded="lg" bg="blue.50">
    <Image
      src={avatar}
      alt={name}
      boxSize="80px"
      rounded="full"
      mr={4}
      objectFit="cover"
    />
    <Box>
      <Text fontSize="lg" fontWeight="bold">
        {name}
      </Text>
      <Text>{feedback}</Text>
    </Box>
  </Flex>
);

export default HomePage;
