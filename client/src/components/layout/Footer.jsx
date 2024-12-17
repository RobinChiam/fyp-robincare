import React from 'react';
import { Box, Flex, Text, Link, Stack } from '@chakra-ui/react';

const Footer = () => {
  return (
    <Box bg="gray.700" color="gray.200" py={6}>
      <Flex
        align="center"
        justify="space-between"
        maxW="1200px"
        mx="auto"
        px={8}
      >
        <Text fontSize="sm">
          © {new Date().getFullYear()} Healthcare System. All rights reserved.
        </Text>
        <Stack direction="row" spacing={4}>
          <Link href="/terms-and-privacy" fontSize="sm">
            Terms of Service
          </Link>
        </Stack>
      </Flex>
    </Box>
  );
};

export default Footer;
