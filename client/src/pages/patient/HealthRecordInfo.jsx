import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  VStack,
  Text,
  Spinner,
  Divider,
} from "@chakra-ui/react";
import Navbar from "../../components/layout/Navbar";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const HealthRecordInfo = () => {
  const { id } = useParams(); // Get health record ID from URL
  const [record, setRecord] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecord = async () => {
      try {
        const response = await axiosInstance.get(`/medical-records/${id}`);
        setRecord(response.data);
      } catch (error) {
        console.error("Error fetching health record details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRecord();
  }, [id]);

  return (
    <Box>
      <Navbar />
      <Box p={6}>
        {loading ? (
          <Spinner />
        ) : record ? (
          <Box borderWidth={1} borderRadius="md" p={6}>
            <Heading mb={4}>Health Record Details</Heading>
            <VStack align="start" spacing={4}>
              <Text><strong>Diagnosis:</strong> {record.diagnosis}</Text>
              <Text><strong>Prescription:</strong> {record.prescription || "N/A"}</Text>
              <Text><strong>Notes:</strong> {record.notes || "N/A"}</Text>
              <Text><strong>Date:</strong> {new Date(record.createdAt).toLocaleDateString()}</Text>
              <Divider />
              <Text><strong>Doctor:</strong> {record.doctorId?.user?.name || "Unknown Doctor"}</Text>
              <Text><strong>Specialization:</strong> {record.doctorId?.specialization || "N/A"}</Text>
              <Divider />
              <Text><strong>Attachments:</strong></Text>
              {record.attachments && record.attachments.length > 0 ? (
                record.attachments.map((attachment, index) => (
                  <Text key={index}>
                    <a href={`http://localhost:5000${attachment}`} target="_blank" rel="noopener noreferrer">
                      {`Attachment ${index + 1}`}
                    </a>
                  </Text>
                ))
              ) : (
                <Text>No attachments available.</Text>
              )}
            </VStack>
          </Box>
        ) : (
          <Text>Health record not found.</Text>
        )}
      </Box>
    </Box>
  );
};

export default HealthRecordInfo;
