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
  Button,
  Text,
} from "@chakra-ui/react";
import AdminNavbar from "../../components/layout/AdminNavbar";
import axiosInstance from "../../utils/axiosInstance";

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHealthRecords = async () => {
      try {
        const response = await axiosInstance.get("/medical-records/all");
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching health records:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHealthRecords();
  }, []);

  const handleCopyToClipboard = (id) => {
    navigator.clipboard.writeText(id);
    alert("Record ID copied to clipboard!");
  };

  return (
    <Box>
      <AdminNavbar />
      <Box p={6}>
        <Heading mb={4}>Health Records</Heading>
        {loading ? (
          <Spinner />
        ) : records.length === 0 ? (
          <Text>No health records found.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Patient</Th>
                <Th>Doctor</Th>
                <Th>Diagnosis</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {records.map((record) => (
                <Tr key={record._id}>
                  <Td>{new Date(record.createdAt).toLocaleDateString()}</Td>
                  <Td>{record.patientId?.user?.name || "Unknown"}</Td>
                  <Td>{record.doctorId?.user?.name || "Unknown"}</Td>
                  <Td>{record.diagnosis}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => handleCopyToClipboard(record._id)}
                    >
                      Get ID
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

export default HealthRecords;