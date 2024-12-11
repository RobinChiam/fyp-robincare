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
import Navbar from "../../components/layout/Navbar"; // Import Navbar component

const PatientDashboard = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserAndAppointments = async () => {
      try {
        const userResponse = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true,
        });
        setUser(userResponse.data);

        const appointmentsResponse = await axios.get(
          "http://localhost:5000/appointments/my-appointments",
          { withCredentials: true }
        );
        setAppointments(appointmentsResponse.data.appointments || []);
      } catch (error) {
        console.error("Error fetching data:", error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchUserAndAppointments();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      // Send a POST request to the logout endpoint
      const response = await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true } // Ensure cookies are sent with the request
      );
      console.log(response.data.message); // Log the success message
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };
  

  return (
    <Box>
      {/* Navbar */}
      <Navbar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <Box py="10" px="6">
        <Heading mb="4">Welcome, {user?.name || "Patient"}!</Heading>
        <Text mb="6">
          Here is your personalized dashboard with upcoming appointments, medical records, and more.
        </Text>
        <Box>
          <Heading size="md" mb="4">
            Upcoming Appointments
          </Heading>
          {appointments.length > 0 ? (
            <VStack align="start" spacing="4">
              {appointments.map((appt) => (
                <Box key={appt.id} p="4" borderWidth="1px" borderRadius="md">
                  <Text>
                    <strong>Date:</strong> {appt.date}
                  </Text>
                  <Text>
                    <strong>Time:</strong> {appt.time}
                  </Text>
                  <Text>
                    <strong>Doctor:</strong> {appt.doctorName}
                  </Text>
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
