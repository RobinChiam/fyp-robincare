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
import axiosInstance from "../../utils/axiosInstance";
import DoctorNavbar from "../../components/layout/DoctorNavbar";

const DoctorDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [user, setUser] = useState(null);


  useEffect(() => {
    const fetchStats = async () => {
      try {
        const userResponse = await axiosInstance.get('/api/users/me');
          setUser(userResponse.data);
        const response = await axiosInstance.get("/appointments/doctor-today");
        setStats(response.data);
      } catch (error) {
        console.error("Error fetching stats:", error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [navigate]);

  return (
    <Box>
      <DoctorNavbar />
      <Box py="10" px="6">
      <Heading mb="4">Welcome, Dr. {user?.name || "to Your Dashboard"}!</Heading>
      {loading ? (
          <Spinner size="xl" />
        ) : (
          <VStack spacing="4" align="start">
            <Text>Total Appointments Today: {stats.totalAppointments}</Text>
            <Text>Pending Appointments: {stats.pendingAppointments}</Text>
            <Text>Completed Appointments: {stats.completedAppointments}</Text>
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
