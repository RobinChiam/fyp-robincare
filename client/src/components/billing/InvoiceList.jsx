import { Box, Text } from "@chakra-ui/react";

const InvoiceList = ({ invoices }) => (
  <Box>
    {invoices.map((invoice) => (
      <Box key={invoice.id} p="4" borderBottom="1px solid" borderColor="gray.200">
        <Text>Invoice #{invoice.id}</Text>
        <Text>Amount: ${invoice.amount}</Text>
        <Text>Status: {invoice.status}</Text>
      </Box>
    ))}
  </Box>
);

export default InvoiceList;
