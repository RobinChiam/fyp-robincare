import { Box, Input, Button, VStack } from "@chakra-ui/react";

const PaymentForm = () => (
  <Box maxW="md" mx="auto" mt="8" p="6" boxShadow="lg" borderRadius="md">
    <VStack spacing="4">
      <Input placeholder="Card Number" required />
      <Input placeholder="Expiry Date" required />
      <Input placeholder="CVV" type="password" required />
      <Button colorScheme="blue" w="full" type="submit">Pay Now</Button>
    </VStack>
  </Box>
);

export default PaymentForm;
