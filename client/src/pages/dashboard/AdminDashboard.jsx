import React, { useState, useEffect } from "react";
import {
  Box,
  Heading,
  Text,
  Flex,
  VStack,
  Spinner,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "../../components/layout/AdminNavbar";

const AdminDashboard = () => {
  const [invoiceStats, setInvoiceStats] = useState({
    totalInvoices: 0,
    unpaidInvoices: 0,
    paidInvoices: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const userResponse = await axios.get("http://localhost:5000/api/users/me", {
          withCredentials: true,
        });
        setUser(userResponse.data);

        const invoicesResponse = await axios.get(
          "http://localhost:5000/billing/summary",
          { withCredentials: true }
        );

        setInvoiceStats({
          totalInvoices: invoicesResponse.data.totalInvoices,
          unpaidInvoices: invoicesResponse.data.unpaidInvoices,
          paidInvoices: invoicesResponse.data.paidInvoices,
        });
      } catch (error) {
        console.error("Error fetching admin data:", error.message);
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };

    fetchAdminData();
  }, [navigate]);

  const handleLogout = async () => {
    try {
      await axios.post(
        "http://localhost:5000/auth/logout",
        {},
        { withCredentials: true }
      );
      navigate("/login");
    } catch (error) {
      console.error("Error during logout:", error.message);
    }
  };

  return (
    <Box>
      {/* Navbar */}
      <AdminNavbar user={user} onLogout={handleLogout} />

      {/* Main Content */}
      <Box py="10" px="6">
        <Heading mb="4">Welcome, {user?.name || "Admin"}!</Heading>
        <Text mb="6">Here is the summary of invoices:</Text>

        {loading ? (
          <Flex justify="center" align="center" h="50vh">
            <Spinner size="xl" />
          </Flex>
        ) : (
          <VStack align="start" spacing="6">
            <Box p="4" borderWidth="1px" borderRadius="md">
              <Text fontSize="lg">
                <strong>Total Invoices:</strong> {invoiceStats.totalInvoices}
              </Text>
            </Box>
            <Box p="4" borderWidth="1px" borderRadius="md">
              <Text fontSize="lg">
                <strong>Unpaid Invoices:</strong> {invoiceStats.unpaidInvoices}
              </Text>
            </Box>
            <Box p="4" borderWidth="1px" borderRadius="md">
              <Text fontSize="lg">
                <strong>Paid Invoices:</strong> {invoiceStats.paidInvoices}
              </Text>
            </Box>
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default AdminDashboard;
