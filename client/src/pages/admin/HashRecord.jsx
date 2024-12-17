import React, { useState } from 'react';
import { Box, Input, Button, Text } from '@chakra-ui/react';
import { storeHash, getHash } from '../../api';

const HashRecord = () => {
  const [recordId, setRecordId] = useState('');
  const [hash, setHash] = useState('');
  const [retrievedHash, setRetrievedHash] = useState('');

  const handleStoreHash = async () => {
    try {
      const response = await storeHash(recordId, hash);
      alert(`Hash stored successfully! Transaction Hash: ${response.txHash}`);
    } catch (error) {
      console.error('Error storing hash:', error.message);
    }
  };

  const handleGetHash = async () => {
    try {
      const response = await getHash(recordId);
      setRetrievedHash(response);
      alert('Hash retrieved successfully!');
    } catch (error) {
      console.error('Error retrieving hash:', error.message);
    }
  };

  return (
    <Box p={5} mt={8} borderWidth="1px" borderRadius="lg" boxShadow="md">
      <Text fontSize="xl" mb={4}>Blockchain Hash Management</Text>
      <Input
        placeholder="Record ID"
        value={recordId}
        onChange={(e) => setRecordId(e.target.value)}
        mb={3}
      />
      <Input
        placeholder="Record Hash"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
        mb={3}
      />
      <Button colorScheme="blue" onClick={handleStoreHash} mb={3}>
        Store Hash
      </Button>
      <Button colorScheme="teal" onClick={handleGetHash} mb={3}>
        Retrieve Hash
      </Button>
      {retrievedHash && <Text>Retrieved Hash: {retrievedHash}</Text>}
    </Box>
  );
};

export default HashRecord;
