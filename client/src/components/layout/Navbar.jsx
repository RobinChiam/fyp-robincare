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
  useColorModeValue,
} from "@chakra-ui/react";
import Navbar from "../../components/layout/Navbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const AppointmentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const bgColor = useColorModeValue("gray.50", "gray.800");
  const cardBg = useColorModeValue("white", "gray.700");
  const textColor = useColorModeValue("gray.800", "gray.200");
  const tableStripedColor = useColorModeValue("gray.100", "gray.600");

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
    <Box minH="100vh" bg={bgColor} color={textColor}>
      <Navbar />
      <Box p={8}>
        <Heading mb={6} textAlign="center" color="blue.500">
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
          <TableContainer
            borderRadius="lg"
            boxShadow="lg"
            bg={cardBg}
            overflow="hidden"
          >
            <Table variant="striped" colorScheme="blue">
              <Thead bg={tableStripedColor}>
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
                  <Tr key={item._id} _hover={{ bg: tableStripedColor }}>
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
