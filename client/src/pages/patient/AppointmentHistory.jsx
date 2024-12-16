import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Text,
  Button,
} from "@chakra-ui/react";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const AppointmentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const response = await axiosInstance.get("/appointments/history");
        setHistory(response.data);
      } catch (error) {
        console.error("Error fetching appointment history:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  return (
    <Box>
      <Navbar />
      <Box p={6}>
        <Heading mb={4}>Appointment History</Heading>
        {loading ? (
          <Spinner />
        ) : history.length === 0 ? (
          <Text>No appointments found.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Time</Th>
                <Th>Doctor</Th>
                <Th>Specialization</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {history.map((item) => (
                <Tr key={item._id}>
                  <Td>{new Date(item.date).toLocaleDateString()}</Td>
                  <Td>{item.timeSlot}</Td>
                  <Td>{item.doctorId?.user?.name || "Unknown Doctor"}</Td>
                  <Td>{item.doctorId?.specialization || "N/A"}</Td>
                  <Td>{item.status}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => navigate(`/dashboard/patient/appointment/${item._id}`)}
                    >
                      Details
                    </Button>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentHistory;
