import React, { useState, useEffect } from 'react';
import {
  Box,
  Heading,
  VStack,
  Text,
  Spinner,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
  Button,
  Image,
} from '@chakra-ui/react';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../../components/layout/Navbar';

const PatientInvoices = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    const fetchInvoices = async () => {
      try {
        const response = await axiosInstance.get('/billing/my-invoices');
        setInvoices(response.data);
      } catch (error) {
        console.error('Error fetching invoices:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchInvoices();
  }, []);

  const filteredInvoices = invoices.filter((invoice) =>
    filter === 'all'
      ? true
      : filter === 'unpaid'
      ? !invoice.isPaid
      : invoice.isPaid
  );

  return (
    <Box>
      <Navbar />
      <Box p={6}>
        <Heading mb={4}>Your Invoices</Heading>
        {loading ? (
          <Spinner />
        ) : invoices.length === 0 ? (
          <Text>No Invoices Found</Text>
        ) : (
          <>
            <Tabs onChange={(index) => setFilter(['all', 'unpaid', 'paid'][index])}>
              <TabList>
                <Tab>All</Tab>
                <Tab>Unpaid</Tab>
                <Tab>Paid</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack spacing={4}>
                    {filteredInvoices.map((invoice) => (
                      <Box
                        key={invoice._id}
                        p={4}
                        borderWidth={1}
                        borderRadius="md"
                        backgroundColor={invoice.isPaid ? 'green.100' : 'red.100'}
                      >
                        <Text><strong>Date:</strong> {new Date(invoice.date).toLocaleDateString()}</Text>
                        <Text><strong>Amount:</strong> ${invoice.amount}</Text>
                        <Text><strong>Status:</strong> {invoice.isPaid ? 'Paid' : 'Unpaid'}</Text>
                        {!invoice.isPaid && (
                          <Button colorScheme="blue" mt={2}>
                            Pay Now
                          </Button>
                        )}
                      </Box>
                    ))}
                  </VStack>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        )}
      </Box>
    </Box>
  );
};

export default PatientInvoices;
