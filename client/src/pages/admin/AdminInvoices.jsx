import React, { useState, useEffect } from "react";
import { Box, Heading, VStack, Text, Spinner } from "@chakra-ui/react";
import AdminNavbar from "../../components/layout/AdminNavbar";
import axiosInstance from "../../utils/axiosInstance";

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get("/billing/all-invoices");
        setInvoices(response.data);
      } catch (error) {
        console.error("Error fetching invoices:", error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  return (
    <Box>
      <AdminNavbar />
      <Box p={6}>
        <Heading mb={4}>Invoices</Heading>
        {loading ? (
            <Spinner />
            ) : invoices.length === 0 ? (
            <Text>No invoices found.</Text>
            ) : (
            <VStack spacing={4} align="stretch">
                {invoices.map((invoice) => (
                <Box key={invoice.id} p={4} borderWidth={1} borderRadius="md">
                    <Text><strong>ID:</strong> {invoice.id}</Text>
                    <Text><strong>Status:</strong> {invoice.status}</Text>
                    <Text><strong>Amount:</strong> ${invoice.amount}</Text>
                </Box>
                ))}
            </VStack>
        )}
      </Box>
    </Box>
  );
};

export default AdminInvoices;
