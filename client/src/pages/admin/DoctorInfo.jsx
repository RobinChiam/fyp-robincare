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

const DoctorInfo = () => {
  const { id } = useParams();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDoctor = async () => {
      try {
        const response = await axiosInstance.get(`/doctor/${id}`);
        setDoctor(response.data);
      } catch (error) {
        console.error("Error fetching doctor details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctor();
  }, [id]);

  return (
    <Box>
      <AdminNavbar />
      <Box p={6}>
        {loading ? (
          <Spinner />
        ) : doctor ? (
          <Box borderWidth={1} borderRadius="md" p={6}>
            <Heading mb={4}>Doctor Details</Heading>
            <VStack align="start" spacing={4}>
              <Text><strong>Name:</strong> {doctor.user.name}</Text>
              <Text><strong>Email:</strong> {doctor.user.email}</Text>
              <Text><strong>Specialization:</strong> {doctor.specialization}</Text>
              <Divider />
              <Text><strong>Phone:</strong> {doctor.user.phone || "N/A"}</Text>
            </VStack>
          </Box>
        ) : (
          <Text>Doctor not found.</Text>
        )}
      </Box>
    </Box>
  );
};

export default DoctorInfo;
