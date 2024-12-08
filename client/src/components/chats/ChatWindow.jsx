import { Box, Input, Button, VStack, Text } from "@chakra-ui/react";

const ChatWindow = ({ messages, sendMessage }) => (
  <Box p="4" border="1px solid" borderColor="gray.200" borderRadius="md">
    <VStack spacing="4" align="start" h="300px" overflowY="scroll">
      {messages.map((msg, index) => (
        <Text key={index}>{msg}</Text>
      ))}
    </VStack>
    <Input placeholder="Type a message" mt="4" />
    <Button mt="2" colorScheme="blue" w="full">Send</Button>
  </Box>
);

export default ChatWindow;
