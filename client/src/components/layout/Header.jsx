import React from 'react';
import {
  Box,
  Flex,
  Text,
  Link,
  Button,
  Stack,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react';

const Header = () => {
  const { toggleColorMode } = useColorMode();
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
        <Text fontSize="xl" fontWeight="bold">
          Healthcare System
        </Text>
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
        <Button onClick={toggleColorMode} colorScheme="whiteAlpha">
          Toggle Mode
        </Button>
      </Flex>
    </Box>
  );
};

export default Header;
