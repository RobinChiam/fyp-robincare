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

const PatientInvoices = () => {
  const navigate = useNavigate();
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get("/billing/my-invoices");
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
      <Navbar />
      <Box p={6}>
        <Heading mb={4}>Your Invoices</Heading>
        {loading ? (
          <Spinner />
        ) : invoices.length === 0 ? (
          <Text>No invoices found.</Text>
        ) : (
          <Table variant="simple">
            <Thead>
              <Tr>
                <Th>Date</Th>
                <Th>Amount</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {invoices.map((invoice) => (
                <Tr key={invoice._id}>
                  <Td>{new Date(invoice.date).toLocaleDateString()}</Td>
                  <Td>RM{invoice.amount.toFixed(2)}</Td>
                  <Td>{invoice.isPaid ? "Paid" : "Unpaid"}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => navigate(`/dashboard/patient/invoice/${invoice._id}`)}
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

export default PatientInvoices;
