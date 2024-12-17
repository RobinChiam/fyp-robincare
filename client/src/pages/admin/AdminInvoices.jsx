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

const AdminInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

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
                  <Td>${invoice.amount.toFixed(2)}</Td>
                  <Td>{invoice.isPaid ? "Paid" : "Unpaid"}</Td>
                  <Td>
                    <Button
                      colorScheme="blue"
                      size="sm"
                      onClick={() => navigate(`/dashboard/admin/invoice/${invoice._id}`)}
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

export default AdminInvoices;
