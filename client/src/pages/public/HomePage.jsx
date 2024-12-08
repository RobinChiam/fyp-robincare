import React from 'react';
import {
  Box,
  Button,
  Heading,
  Text,
  Stack,
  Image,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react';

const HomePage = () => {
  return (
    <Box>
      <Flex
        align="center"
        justify="space-between"
        flexDirection={useBreakpointValue({ base: 'column', md: 'row' })}
        px={8}
        py={10}
        bg="blue.50"
      >
        <Stack spacing={4} maxW="lg">
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
          src="https://via.placeholder.com/500" // Replace with a relevant healthcare image
          alt="Healthcare"
          mt={useBreakpointValue({ base: 8, md: 0 })}
        />
      </Flex>
    </Box>

  );

};

export default HomePage;
