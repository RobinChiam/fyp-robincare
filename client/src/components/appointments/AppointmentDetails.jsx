import { Box, Text } from "@chakra-ui/react";

const AppointmentDetails = ({ appointment }) => (
  <Box p="6" boxShadow="lg" borderRadius="md">
    <Text fontSize="lg" fontWeight="bold">Details for {appointment.title}</Text>
    <Text>Date: {appointment.date}</Text>
    <Text>Description: {appointment.description}</Text>
  </Box>
);

export default AppointmentDetails;
