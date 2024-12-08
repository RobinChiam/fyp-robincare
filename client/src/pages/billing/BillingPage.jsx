import { Box, Heading } from "@chakra-ui/react";
import InvoiceList from "../../components/billing/InvoiceList";

const BillingPage = ({ invoices }) => (
  <Box py="10" px="6">
    <Heading>Billing</Heading>
    <InvoiceList invoices={invoices} />
  </Box>
);

export default BillingPage;
