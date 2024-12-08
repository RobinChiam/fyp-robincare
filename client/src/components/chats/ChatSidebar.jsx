import { Box, Text } from "@chakra-ui/react";

const ChatSidebar = ({ chats, selectChat }) => (
  <Box w="200px" borderRight="1px solid" borderColor="gray.200" p="4">
    {chats.map((chat, index) => (
      <Text key={index} onClick={() => selectChat(chat)} cursor="pointer">
        {chat.name}
      </Text>
    ))}
  </Box>
);

export default ChatSidebar;
