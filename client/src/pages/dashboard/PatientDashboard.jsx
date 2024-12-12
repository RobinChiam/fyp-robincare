import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Navbar from "../../components/layout/Navbar";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const appointmentsResponse = await axios.get(
          "http://localhost:5000/appointments/my-appointments",
          { withCredentials: true }
        );
        setAppointments(appointmentsResponse.data.appointments || []);
      } catch (error) {
        console.error("Error fetching appointments:", error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <Box>
      {/* Navbar */}
      <Navbar onLogout={handleLogout} />

      {/* Main Content */}
      <Box py="10" px="6">
        <Heading mb="4">Welcome to Your Dashboard!</Heading>
        <Text mb="6">Here is your personalized dashboard with upcoming appointments, medical records, and more.</Text>
        <Box>
          <Heading size="md" mb="4">Upcoming Appointments</Heading>
          {loading ? (
            <Spinner />
          ) : appointments.length > 0 ? (
            <VStack align="start" spacing="4">
              {appointments.map((appt) => (
                <Box key={appt.id} p="4" borderWidth="1px" borderRadius="md">
                  <Text><strong>Date:</strong> {appt.date}</Text>
                  <Text><strong>Time:</strong> {appt.time}</Text>
                  <Text><strong>Doctor:</strong> {appt.doctorName}</Text>
                </Box>
              ))}
            </VStack>
          ) : (
            <Text>No appointments found.</Text>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default PatientDashboard;
