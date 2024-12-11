import React from 'react';
import {
  Box,
  Flex,
  Text,
  Link,
  Stack,
  useColorModeValue,
} from '@chakra-ui/react';

const Header = () => {
  const bgColor = useColorModeValue('blue.500', 'blue.900');
  const textColor = useColorModeValue('white', 'gray.200');

  return (
    <Box bg={bgColor} px={8} py={4}>
      <Flex
        align="center"
        justify="space-between"
        maxW="1200px"
        mx="auto"
        color={textColor}
      >
        {/* Logo */}
        <Text fontSize="xl" fontWeight="bold">
          Healthcare System
        </Text>

        {/* Navigation Links */}
        <Stack direction="row" spacing={4}>
          <Link href="/" fontSize="lg">
            Home
          </Link>
          <Link href="/about" fontSize="lg">
            About Us
          </Link>
          <Link href="/contact" fontSize="lg">
            Contact Us
          </Link>
          <Link href="/blog" fontSize="lg">
            Blog
          </Link>
        </Stack>

        {/* Login / Register */}
        <Stack direction="row" spacing={1} align="center" fontSize="lg" fontWeight="semibold">
          <Link href="/login" _hover={{ textDecoration: 'underline' }}>
            Login
          </Link>
          <Text>/</Text>
          <Link href="/register" _hover={{ textDecoration: 'underline' }}>
            Register
          </Link>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Header;
