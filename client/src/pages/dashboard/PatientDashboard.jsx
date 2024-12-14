import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Spinner,
  Text,
  Divider,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/layout/Navbar";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [missedCount, setMissedCount] = useState(0);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userResponse = await axiosInstance.get('/api/users/me');
        setUser(userResponse.data);

        const response = await axiosInstance.get("/appointments/my-appointments");
        const { futureAppointments, missedAppointmentsCount, totalAppointmentsCount } = response.data;

        setAppointments(futureAppointments);
        setMissedCount(missedAppointmentsCount);
        setTotalCount(totalAppointmentsCount);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  return (
    <Box>
      <Navbar />
      <Box py="10" px="6">
        <Heading mb="4">Welcome, {user?.name || "to Your Dashboard"}!</Heading>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <VStack spacing="4" align="start">
            <Text fontWeight="bold">Total Appointments: {totalCount}</Text>
            <Text fontWeight="bold">Missed Appointments: {missedCount}</Text>
            <Divider />
            <Heading size="md" mt="4">Upcoming Appointments</Heading>
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <Box key={appt._id} borderWidth="1px" borderRadius="md" p="4" width="100%">
                  <Text><strong>Date:</strong> {new Date(appt.date).toLocaleDateString()}</Text>
                  <Text><strong>Time:</strong> {appt.timeSlot}</Text>
                  <Text><strong>Doctor:</strong> {appt.doctorId.name}</Text>
                  <Text><strong>Status:</strong> {appt.status}</Text>
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

export default PatientDashboard;
