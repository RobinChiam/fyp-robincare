import { Box, VStack, Text } from "@chakra-ui/react";

const AppointmentList = ({ appointments }) => (
  <Box>
    {appointments.map((appointment) => (
      <Box key={appointment.id} p="4" borderBottom="1px solid" borderColor="gray.200">
        <Text fontWeight="bold">{appointment.title}</Text>
        <Text>{appointment.date}</Text>
      </Box>
    ))}
  </Box>
);

export default AppointmentList;
