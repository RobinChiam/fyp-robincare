import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  Divider,
  Center,
  useColorModeValue,
} from "@chakra-ui/react";
import Navbar from "../../components/layout/Navbar";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const AppointmentInfo = () => {
  const { id } = useParams();
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");

  useEffect(() => {
    const fetchAppointmentInfo = async () => {
      try {
        const response = await axiosInstance.get(`/appointments/${id}`);
        setAppointment(response.data);
      } catch (error) {
        console.error("Error fetching appointment details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointmentInfo();
  }, [id]);

  return (
    <Box minH="100vh" bg={bgColor} color={textColor}>
      <Navbar />
      <Box p={8} maxW="lg" mx="auto">
        {loading ? (
          <Center>
            <Spinner size="xl" />
          </Center>
        ) : appointment ? (
          <Box bg={cardBg} p={6} boxShadow="lg" borderRadius="lg">
            <Heading mb={6} textAlign="center" color="blue.500">
              Appointment Details
            </Heading>
            <VStack align="start" spacing={4}>
              <Text fontSize="lg">
                <strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}
              </Text>
              <Text fontSize="lg">
                <strong>Time:</strong> {appointment.timeSlot}
              </Text>
              <Text fontSize="lg">
                <strong>Status:</strong> {appointment.status}
              </Text>
              <Divider />
              <Text fontSize="lg">
                <strong>Doctor:</strong> {appointment.doctorId?.user?.name || "Unknown Doctor"}
              </Text>
              <Text fontSize="lg">
                <strong>Specialization:</strong> {appointment.doctorId?.specialization || "N/A"}
              </Text>
              <Text fontSize="lg">
                <strong>Email:</strong> {appointment.doctorId?.user?.email || "N/A"}
              </Text>
              <Divider />
              <Text fontSize="lg">
                <strong>Patient:</strong> {appointment.patientId?.user?.name || "Unknown Patient"}
              </Text>
              <Text fontSize="lg">
                <strong>Email:</strong> {appointment.patientId?.user?.email || "N/A"}
              </Text>
            </VStack>
          </Box>
        ) : (
          <Center>
            <Text fontSize="lg" color="gray.500">
              Appointment not found.
            </Text>
          </Center>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentInfo;
