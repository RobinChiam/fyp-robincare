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

const AdminPatients = () => {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const response = await axiosInstance.get("/patient/list");
        setPatients(response.data);
      } catch (error) {
        console.error("Error fetching patients:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, []);

  return (
    <Box>
      <AdminNavbar />
      <Box p={6}>
        <Heading mb={4}>Patients</Heading>
        {loading ? (
          <Spinner />
        ) : patients.length === 0 ? (
          <Text>No patients found.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Name</Th>
                <Th>Email</Th>
                <Th>Phone</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {patients.map((patient) => (
                <Tr key={patient._id}>
                  <Td>{patient.user.name}</Td>
                  <Td>{patient.user.email}</Td>
                  <Td>{patient.user.phone || "N/A"}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => navigate(`/dashboard/admin/patient/${patient._id}`)}
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

export default AdminPatients;
