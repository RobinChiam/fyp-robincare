import React, { useState, useEffect } from "react";
import { Box, Heading, VStack, Text, Spinner, Divider, Button } from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import DoctorNavbar from "../../components/layout/DoctorNavbar";
import axiosInstance from "../../utils/axiosInstance";

const DoctorDashboard = () => {
  const [futureAppointments, setFutureAppointments] = useState([]);
  const [missedAppointmentsCount, setMissedAppointmentsCount] = useState(0);
  const [totalAppointmentsCount, setTotalAppointmentsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

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

  const confirmAppointment = async (id) => {
    try {
      await axiosInstance.post(`/appointments/updateAppointment/${id}`, { status: 'confirmed' });
      fetchAppointments(); // Refresh appointments after confirmation
    } catch (error) {
      console.error('Error confirming appointment:', error.message);
    }
  };

  useEffect(() => {
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
                  <Text>
                    <strong>Patient:</strong> {appointment.patientId?.user?.name || "Unknown Patient"}
                  </Text>
                  <Text><strong>Status:</strong> {appointment.status}</Text>
                  {appointment.status === 'pending' && (
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => confirmAppointment(appointment._id)}
                    >
                      Confirm Appointment
                    </Button>
                  )}
                  {appointment.status === 'confirmed' && (
                    <Button
                      colorScheme="green"
                      size="sm"
                      onClick={() => navigate(`/dashboard/doctor/complete-appointment/${appointment._id}`)}
                    >
                      Complete
                    </Button>
                  )}
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

export default DoctorDashboard;
