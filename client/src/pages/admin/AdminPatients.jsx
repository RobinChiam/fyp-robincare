import React, { useState, useEffect } from "react";
import { Box, Heading, VStack, Text, Spinner } from "@chakra-ui/react";
import AdminNavbar from "../../components/layout/AdminNavbar";
import axiosInstance from "../../utils/axiosInstance";

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axiosInstance.get("/admin/patients");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchPatients();
  }, []);

  return (
    <Box>
      <AdminNavbar />
      <Box p={6}>
        <Heading mb={4}>Patients</Heading>
        {loading ? (
            <Spinner />
            ) : patients.length === 0 ? (
            <Text>No patients found.</Text>
            ) : (
            <VStack spacing={4} align="stretch">
                {patients.map((patient) => (
                <Box key={patient.id} p={4} borderWidth={1} borderRadius="md">
                    <Text><strong>Name:</strong> {patient.name}</Text>
                    <Text><strong>Email:</strong> {patient.email}</Text>
                    <Text><strong>Phone:</strong> {patient.phone}</Text>
                </Box>
                ))}
            </VStack>
        )}
      </Box>
    </Box>
  );
};

export default AdminPatients;
