import { Box, Input, Button, Textarea, VStack } from "@chakra-ui/react";

const AppointmentForm = () => (
  <Box maxW="lg" mx="auto" mt="8" p="6" boxShadow="lg" borderRadius="md">
    <VStack spacing="4">
      <Input placeholder="Title" required />
      <Input placeholder="Date" type="date" required />
      <Textarea placeholder="Description" />
      <Button colorScheme="blue" w="full" type="submit">Book Appointment</Button>
    </VStack>
  </Box>
);

export default AppointmentForm;
