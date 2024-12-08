import { Box, Heading, Text, Button } from "@chakra-ui/react";

const Error500Page = () => (
  <Box textAlign="center" py="10" px="6">
    <Heading>500 - Internal Server Error</Heading>
    <Text mt="4">Something went wrong. Please try again later.</Text>
    <Button mt="6" colorScheme="blue" size="lg" onClick={() => window.location.reload()}>
      Reload Page
    </Button>
  </Box>
);

export default Error500Page;
