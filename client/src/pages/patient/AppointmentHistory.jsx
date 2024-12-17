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
  TableContainer,
  Center,
} from "@chakra-ui/react";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { useColorModeValue } from "@chakra-ui/react";


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
    <Box minH="100vh" bg="gray.50">
      <Navbar />
      <Box p={8}>
        <Heading mb={6} textAlign="center" color="blue.600">
          Appointment History
        </Heading>
        {loading ? (
          <Center>
            <Spinner size="xl" />
          </Center>
        ) : history.length === 0 ? (
          <Center>
            <Text fontSize="lg" color="gray.500">
              No appointments found.
            </Text>
          </Center>
        ) : (
        <TableContainer borderRadius="lg" boxShadow="lg" bg={useColorModeValue("white", "gray.800")}>
        <Table variant="striped" colorScheme="blue">
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
                  <Tr key={item._id} _hover={{ bg: "gray.100" }}>
                    <Td>{new Date(item.date).toLocaleDateString()}</Td>
                    <Td>{item.timeSlot}</Td>
                    <Td>{item.doctorId?.user?.name || "Unknown Doctor"}</Td>
                    <Td>{item.doctorId?.specialization || "N/A"}</Td>
                    <Td>{item.status}</Td>
                    <Td>
                      <Button
                        colorScheme="blue"
                        size="sm"
                        onClick={() =>
                          navigate(`/dashboard/patient/appointment/${item._id}`)
                        }
                      >
                        Details
                      </Button>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          </TableContainer>
        )}
      </Box>
    </Box>
  );
};

export default AppointmentHistory;
