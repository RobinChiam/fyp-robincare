import { Box, Heading, Text } from "@chakra-ui/react";

const MedicalRecordsPage = ({ records }) => (
  <Box py="10" px="6">
    <Heading>Medical Records</Heading>
    {records.map((record, index) => (
      <Box key={index} p="4" borderBottom="1px solid" borderColor="gray.200">
        <Text fontWeight="bold">{record.title}</Text>
        <Text>{record.date}</Text>
        <Text>{record.details}</Text>
      </Box>
    ))}
  </Box>
);

export default MedicalRecordsPage;
