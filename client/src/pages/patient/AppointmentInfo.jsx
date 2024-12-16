import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Spinner,
  VStack,
  Divider,
} from "@chakra-ui/react";
import Navbar from "../../components/layout/Navbar";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const AppointmentInfo = () => {
  const { id } = useParams(); // Get appointment ID from URL
  const [appointment, setAppointment] = useState(null);
  const [loading, setLoading] = useState(true);

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
    <Box>
      <Navbar />
      <Box p={6}>
        {loading ? (
          <Spinner />
        ) : appointment ? (
          <Box borderWidth={1} borderRadius="md" p={6}>
            <Heading mb={4}>Appointment Details</Heading>
            <VStack align="start" spacing={4}>
              <Text><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</Text>
              <Text><strong>Time:</strong> {appointment.timeSlot}</Text>
              <Text><strong>Status:</strong> {appointment.status}</Text>
              <Divider />
              <Text><strong>Doctor:</strong> {appointment.doctorId?.user?.name || "Unknown Doctor"}</Text>
              <Text><strong>Specialization:</strong> {appointment.doctorId?.specialization || "N/A"}</Text>
              <Text><strong>Email:</strong> {appointment.doctorId?.user?.email || "N/A"}</Text>
              <Divider />
              <Text><strong>Patient:</strong> {appointment.patientId?.user?.name || "Unknown Patient"}</Text>
              <Text><strong>Email:</strong> {appointment.patientId?.user?.email || "N/A"}</Text>
            </VStack>
          </Box>
        ) : (
          <Text>Appointment not found.</Text>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentInfo;
