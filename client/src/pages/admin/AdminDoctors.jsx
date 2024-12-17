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
import AdminNavbar from "../../components/layout/AdminNavbar";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const AdminDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/doctor/list");
        setDoctors(response.data);
      } catch (error) {
        console.error("Error fetching doctors:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDoctors();
  }, []);

  return (
    <Box>
      <AdminNavbar />
      <Box p={6}>
        <Heading mb={4}>Doctors</Heading>
        {loading ? (
          <Spinner />
        ) : doctors.length === 0 ? (
          <Text>No doctors found.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Specialization</Th>
                <Th>Email</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {doctors.map((doctor) => (
                <Tr key={doctor._id}>
                  <Td>{doctor.user.name}</Td>
                  <Td>{doctor.specialization}</Td>
                  <Td>{doctor.user.email}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => navigate(`/dashboard/admin/doctor/${doctor._id}`)}
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

export default AdminDoctors;
