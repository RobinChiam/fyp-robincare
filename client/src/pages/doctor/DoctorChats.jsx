import React, { useState, useEffect } from "react";
import { Box, Heading, VStack, Text, Spinner } from "@chakra-ui/react";
import DoctorNavbar from "../../components/layout/DoctorNavbar";
import axiosInstance from "../../utils/axiosInstance";

const DoctorChats = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const response = await axiosInstance.get("/doctor/chats");
        setChats(response.data);
      } catch (error) {
        console.error("Error fetching chats:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchChats();
  }, []);

  return (
    <Box>
      <DoctorNavbar />
      <Box p={6}>
        <Heading mb={4}>Chats</Heading>
        {loading ? (
            <Spinner />
            ) : chats.length === 0 ? (
            <Text>No chats found.</Text>
            ) : (
            <VStack spacing={4} align="stretch">
                {chats.map((chat) => (
                <Box key={chat.id} p={4} borderWidth={1} borderRadius="md">
                    <Text><strong>Patient:</strong> {chat.patientName}</Text>
                    <Text><strong>Last Message:</strong> {chat.lastMessage}</Text>
                    <Text><strong>Timestamp:</strong> {chat.timestamp}</Text>
                </Box>
                ))}
            </VStack>
        )}
      </Box>
    </Box>
  );
};

export default DoctorChats;
