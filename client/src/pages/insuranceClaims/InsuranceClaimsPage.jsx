import { Box, Heading, Button } from "@chakra-ui/react";

const InsuranceClaimsPage = ({ claims }) => (
  <Box py="10" px="6">
    <Heading>Insurance Claims</Heading>
    {claims.map((claim) => (
      <Box key={claim.id} p="4" borderBottom="1px solid" borderColor="gray.200">
        <Text>Claim ID: {claim.id}</Text>
        <Text>Status: {claim.status}</Text>
        <Button mt="2" size="sm" colorScheme="blue">View Details</Button>
      </Box>
    ))}
  </Box>
);

export default InsuranceClaimsPage;
