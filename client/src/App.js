import logo from './logo.svg';
import './App.css';
import { Box, Button, Text } from '@chakra-ui/react';

function App() {
  return (
    <Box p={4}>
      <Text fontSize="xl" mb={4}>
        Welcome to Chakra UI v2!
      </Text>
      <Button colorScheme="teal">Click Me</Button>
    </Box>
  );
}

export default App;
