import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import AdminNavbar from "../../components/layout/AdminNavbar";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const PatientInfo = () => {
  const { id } = useParams();
  const [patient, setPatient] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPatient = async () => {
      try {
        const response = await axiosInstance.get(`/patient/${id}`);
        setPatient(response.data);
      } catch (error) {
        console.error("Error fetching patient details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatient();
  }, [id]);

  return (
    <Box>
      <AdminNavbar />
      <Box p={6}>
        {loading ? (
          <Spinner />
        ) : patient ? (
          <Box borderWidth={1} borderRadius="md" p={6}>
            <Heading mb={4}>Patient Details</Heading>
            <VStack align="start" spacing={4}>
              <Text><strong>Name:</strong> {patient.user.name}</Text>
              <Text><strong>Email:</strong> {patient.user.email}</Text>
              <Text><strong>Phone:</strong> {patient.user.phone || "N/A"}</Text>
              <Divider />
              <Text><strong>Address:</strong> {patient.address || "N/A"}</Text>
              <Text><strong>Medical History:</strong> {patient.medicalHistory.join(", ") || "None"}</Text>
            </VStack>
          </Box>
        ) : (
          <Text>Patient not found.</Text>
        )}
      </Box>
    </Box>
  );
};

export default PatientInfo;
