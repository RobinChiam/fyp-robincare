import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Spinner,
  Text,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/layout/Navbar";

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);


  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        const userResponse = await axiosInstance.get('/api/users/me');
          setUser(userResponse.data);
        const response = await axiosInstance.get("/appointments/my-appointments");
        setAppointments(response.data.appointments || []);
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
            {appointments.length > 0 ? (
              appointments.map((appt) => (
                <Box key={appt.id}>
                  <Text>Date: {appt.date}</Text>
                  <Text>Doctor: {appt.doctorName}</Text>
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

export default PatientDashboard;
