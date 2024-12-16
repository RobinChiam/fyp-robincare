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

const HealthRecords = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const response = await axiosInstance.get("/medical-records/my-records");
        setRecords(response.data);
      } catch (error) {
        console.error("Error fetching health records:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  return (
    <Box>
      <Navbar />
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
                <Th>Diagnosis</Th>
                <Th>Doctor</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {records.map((record) => (
                <Tr key={record._id}>
                  <Td>{new Date(record.createdAt).toLocaleDateString()}</Td>
                  <Td>{record.diagnosis}</Td>
                  <Td>{record.doctorId?.user?.name || "Unknown Doctor"}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => navigate(`/dashboard/patient/health-record/${record._id}`)}
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

export default HealthRecords;
