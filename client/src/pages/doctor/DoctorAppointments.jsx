import React, { useState, useEffect } from "react";
import { Box, Heading, VStack, Text, Spinner, Divider } from "@chakra-ui/react";
import DoctorNavbar from "../../components/layout/DoctorNavbar";
import axiosInstance from "../../utils/axiosInstance";

const DoctorAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAppointmentsHistory = async () => {
      try {
        const response = await axiosInstance.get("/appointments/doctor-appointments");
        const { futureAppointments = [], missedAppointmentsCount = 0 } = response.data;
        setAppointments(response.data.appointments || []);
      } catch (error) {
        console.error("Error fetching appointments history:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAppointmentsHistory();
  }, []);

  return (
    <Box>
      <DoctorNavbar />
      <Box p={6}>
        <Heading mb={4}>Appointments History</Heading>
        {loading ? (
          <Spinner />
        ) : (
          <VStack spacing={4} align="stretch">
            {appointments.length > 0 ? (
              appointments.map((appointment) => (
                <Box key={appointment._id} p={4} borderWidth={1} borderRadius="md">
                  <Text><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</Text>
                  <Text><strong>Time Slot:</strong> {appointment.timeSlot}</Text>
                  <Text><strong>Patient:</strong> {appointment.patientId?.user?.name || "N/A"}</Text>
                  <Text><strong>Status:</strong> {appointment.status}</Text>
                </Box>
              ))
            ) : (
              <Text>No Appointments Found</Text>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default DoctorAppointments;
