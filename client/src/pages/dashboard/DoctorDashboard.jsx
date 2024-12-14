import React, { useState, useEffect } from "react";
import { Box, Heading, VStack, Text, Spinner, Divider } from "@chakra-ui/react";
import DoctorNavbar from "../../components/layout/DoctorNavbar";
import axiosInstance from "../../utils/axiosInstance";

const DoctorDashboard = () => {
  const [futureAppointments, setFutureAppointments] = useState([]);
  const [missedAppointmentsCount, setMissedAppointmentsCount] = useState(0);
  const [totalAppointmentsCount, setTotalAppointmentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
          const userResponse = await axiosInstance.get('/api/users/me');
          setUser(userResponse.data);

        const response = await axiosInstance.get("/appointments/doctor-appointments");
        const {
          futureAppointments = [],
          missedAppointmentsCount = 0,
          totalAppointmentsCount = 0,
        } = response.data;

        setFutureAppointments(futureAppointments);
        setMissedAppointmentsCount(missedAppointmentsCount);
        setTotalAppointmentsCount(totalAppointmentsCount);
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
      <Heading mb="4">Welcome, Dr. {user?.name || "to Your Dashboard"}!</Heading>
        {loading ? (
          <Spinner />
        ) : (
          <VStack spacing={4} align="stretch">
            <Text fontWeight="bold">Total Appointments: {totalAppointmentsCount}</Text>
            <Text fontWeight="bold">Missed Appointments: {missedAppointmentsCount}</Text>
            <Divider />
            <Heading size="md" mt="4">Upcoming Appointments</Heading>
            {futureAppointments.length > 0 ? (
              futureAppointments.map((appointment) => (
                <Box key={appointment._id} p={4} borderWidth={1} borderRadius="md">
                  <Text><strong>Date:</strong> {new Date(appointment.date).toLocaleDateString()}</Text>
                  <Text><strong>Time:</strong> {appointment.timeSlot}</Text>
                  <Text><strong>Patient:</strong> {appointment.patientId?.name || "Unknown"}</Text>
                  <Text><strong>Status:</strong> {appointment.status}</Text>
                </Box>
              ))
            ) : (
              <Text>No Upcoming Appointments</Text>
            )}
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default DoctorDashboard