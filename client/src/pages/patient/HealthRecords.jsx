import React, { useState, useEffect } from "react";
import { Box, Heading, VStack, Text, Spinner } from "@chakra-ui/react";
import Navbar from "../../components/layout/Navbar";
import axiosInstance from "../../utils/axiosInstance";

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axiosInstance.get("/medical-records/my-records");
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching records:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchRecords();
  }, []);

  return (
    <Box>
      <Navbar />
      <Box p={6}>
        <Heading mb={4}>Health Records</Heading>
        {loading ? (
          <Spinner />
        ) : records.length === 0 ? (
          <Text>No health records found.</Text>
        ) : (
          <VStack spacing={4} align="stretch">
            {records.map((record) => (
              <Box key={record.id} p={4} borderWidth={1} borderRadius="md">
                <Text><strong>Title:</strong> {record.title}</Text>
                <Text><strong>Description:</strong> {record.description}</Text>
                <Text><strong>Date:</strong> {record.date}</Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default HealthRecords;
