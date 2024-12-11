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
import DoctorNavbar from "../../components/layout/DoctorNavbar"; // Import DoctorNavbar component

const DoctorDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalAppointments: 0,
    pendingAppointments: 0,
    completedAppointments: 0,
  });
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true,
        });
        setUser(userResponse.data);

        const appointmentsResponse = await axios.get(
          "http://localhost:5000/appointments/doctor-today",
          { withCredentials: true }
        );

        const { totalAppointments, pendingAppointments, completedAppointments } =
          appointmentsResponse.data;

        setStats({
          totalAppointments,
          pendingAppointments,
          completedAppointments,
        });

        setAppointments(appointmentsResponse.data.appointments || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchDoctorData();
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
      <DoctorNavbar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <Box py="10" px="6">
        <Heading mb="4">Welcome, Dr. {user?.name || "Doctor"}!</Heading>
        <Text mb="6">
          Here's your dashboard overview for today:
        </Text>

        {loading ? (
          <Flex justify="center" align="center" h="50vh">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <VStack align="start" spacing="6">
            <Box p="4" borderWidth="1px" borderRadius="md">
              <Text fontSize="lg">
                <strong>Total Appointments Today:</strong> {stats.totalAppointments}
              </Text>
            </Box>
            <Box p="4" borderWidth="1px" borderRadius="md">
              <Text fontSize="lg">
                <strong>Pending Appointments:</strong> {stats.pendingAppointments}
              </Text>
            </Box>
            <Box p="4" borderWidth="1px" borderRadius="md">
              <Text fontSize="lg">
                <strong>Completed Appointments:</strong> {stats.completedAppointments}
              </Text>
            </Box>
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default DoctorDashboard;
