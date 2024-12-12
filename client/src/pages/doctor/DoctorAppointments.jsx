import React, { useState, useEffect } from "react";
import { Box, Heading, VStack, Text, Spinner } from "@chakra-ui/react";
import DoctorNavbar from "../../components/layout/DoctorNavbar";
import axiosInstance from "../../utils/axiosInstance";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const response = await axiosInstance.get("/appointments/my-appointments");
        setAppointments(response.data);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, []);

  return (
    <Box>
      <DoctorNavbar />
      <Box p={6}>
        <Heading mb={4}>Appointments</Heading>
        {loading ? (
            <Spinner />
            ) : appointments.length === 0 ? (
            <Text>No appointments found.</Text>
            ) : (
            <VStack spacing={4} align="stretch">
                {appointments.map((appointment) => (
                <Box key={appointment.id} p={4} borderWidth={1} borderRadius="md">
                    <Text><strong>Date:</strong> {appointment.date}</Text>
                    <Text><strong>Patient:</strong> {appointment.patientName}</Text>
                    <Text><strong>Status:</strong> {appointment.status}</Text>
                </Box>
                ))}
            </VStack>
    )}  

      </Box>
    </Box>
  );
};

export default DoctorAppointments;
