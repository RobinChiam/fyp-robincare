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

const InvoiceInfo = () => {
  const { id } = useParams(); // Get invoice ID from URL
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoice = async () => {
      try {
        const response = await axiosInstance.get(`/billing/invoice/${id}`);
        setInvoice(response.data);
      } catch (error) {
        console.error("Error fetching invoice details:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoice();
  }, [id]);

  return (
    <Box>
      <Navbar />
      <Box p={6}>
        {loading ? (
          <Spinner />
        ) : invoice ? (
          <Box borderWidth={1} borderRadius="md" p={6}>
            <Heading mb={4}>Invoice Details</Heading>
            <VStack align="start" spacing={4}>
              <Text><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</Text>
              <Text><strong>Amount:</strong> RM{invoice.amount.toFixed(2)}</Text>
              <Text><strong>Description:</strong> {invoice.description || "N/A"}</Text>
              <Text><strong>Status:</strong> {invoice.isPaid ? "Paid" : "Unpaid"}</Text>
              <Divider />
              <Text><strong>Doctor:</strong> {invoice.doctorId?.user?.name || "Unknown Doctor"}</Text>
              <Text><strong>Specialization:</strong> {invoice.doctorId?.specialization || "N/A"}</Text>
              <Divider />
              <Text><strong>Patient:</strong> {invoice.patientId?.user?.name || "Unknown Patient"}</Text>
              <Text><strong>Email:</strong> {invoice.patientId?.user?.email || "N/A"}</Text>
            </VStack>
          </Box>
        ) : (
          <Text>Invoice not found.</Text>
        )}
      </Box>
    </Box>
  );
};

export default InvoiceInfo;
