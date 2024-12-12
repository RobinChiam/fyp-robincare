import React, { useState, useEffect } from "react";
import { Box, Heading, VStack, Text, Spinner } from "@chakra-ui/react";
import AdminNavbar from "../../components/layout/AdminNavbar";
import axiosInstance from "../../utils/axiosInstance";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/doctor/list");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchDoctors();
  }, []);

  return (
    <Box>
      <AdminNavbar />
      <Box p={6}>
        <Heading mb={4}>Doctors</Heading>
        {loading ? (
          <Spinner />
        ) : (
          <VStack spacing={4} align="stretch">
            {doctors.map((doctor) => (
              <Box key={doctor.id} p={4} borderWidth={1} borderRadius="md">
                <Text><strong>Name:</strong> {doctor.user.name}</Text>
                <Text><strong>Specialization:</strong> {doctor.specialization}</Text>
                <Text><strong>Email:</strong> {doctor.user.email}</Text>
              </Box>
            ))}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default AdminDoctors;
