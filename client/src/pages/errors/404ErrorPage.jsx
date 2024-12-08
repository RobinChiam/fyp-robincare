import { Box, Heading, Text, Button } from "@chakra-ui/react";

const Error404Page = () => (
  <Box textAlign="center" py="10" px="6">
    <Heading>404 - Page Not Found</Heading>
    <Text mt="4">The page you're looking for doesn't exist.</Text>
    <Button mt="6" colorScheme="blue" size="lg" onClick={() => window.history.back()}>
      Go Back
    </Button>
  </Box>
);

export default Error404Page;
