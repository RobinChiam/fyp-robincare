import React, { useState, useEffect } from "react";
import { Box, Heading, VStack, Text, Spinner } from "@chakra-ui/react";
import Navbar from "../../components/layout/Navbar";
import axiosInstance from "../../utils/axiosInstance";

const AppointmentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get("/appointments/history");
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching appointment history:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchHistory();
  }, []);

  return (
    <Box>
      <Navbar />
      <Box p={6}>
        <Heading mb={4}>Appointment History</Heading>
        {loading ? (
          <Spinner />
        ) : history.length === 0 ? (
          <Text>No appointments found.</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {history.map((item) => (
              <Box key={item.id} p={4} borderWidth={1} borderRadius="md">
                <Text><strong>Date:</strong> {item.date}</Text>
                <Text><strong>Doctor:</strong> {item.doctor}</Text>
                <Text><strong>Status:</strong> {item.status}</Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentHistory;
