import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Container,
  List,
  ListItem,
  IconButton,
  useColorMode,
} from '@chakra-ui/react';
import { SunIcon, MoonIcon } from '@chakra-ui/icons';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const TermsAndPrivacy = () => {
  const { colorMode, toggleColorMode } = useColorMode();

  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh"
      bg={colorMode === 'light' ? 'gray.50' : 'gray.800'}
      color={colorMode === 'light' ? 'gray.800' : 'gray.200'}
      position="relative"
    >
      <Header />
      <Box flex="1" py={12}>
        <Container maxW="6xl">
          <Stack spacing={8}>
            <Heading as="h1" size="2xl" textAlign="center" color="blue.500">
              Terms of Service and Privacy Policy
            </Heading>

            <Box bg="white" p={6} shadow="lg" borderRadius="lg">
            <Heading as="h2" size="lg" mb={4} color="gray.800">
              Terms of Service
            </Heading>
            <List spacing={3}>
              <ListItem color="gray.700">1. Use the platform only for lawful purposes.</ListItem>
              <ListItem color="gray.700">2. Keep your credentials secure.</ListItem>
              <ListItem color="gray.700">
                3. We reserve the right to suspend accounts that violate these terms.
              </ListItem>
              <ListItem color="gray.700">
                4. The content provided does not replace medical advice.
              </ListItem>
            </List>
          </Box>

          {/* Privacy Section */}
          <Box bg="white" p={6} shadow="lg" borderRadius="lg">
            <Heading as="h2" size="lg" mb={4} color="gray.800">
              Privacy Policy
            </Heading>
            <List spacing={3}>
              <ListItem color="gray.700">1. Your data is collected to improve services.</ListItem>
              <ListItem color="gray.700">2. Your records are encrypted and secure.</ListItem>
              <ListItem color="gray.700">3. We do not share or sell your data.</ListItem>
              <ListItem color="gray.700">
                4. You can access, update, or delete your data anytime.
              </ListItem>
            </List>
          </Box>
          </Stack>
        </Container>
      </Box>

      {/* Theme Toggle Above Footer */}
      <Box position="relative" bottom={10} textAlign="right">
        <IconButton
          aria-label="Toggle Theme"
          icon={colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          size="lg"
          isRound
        />
      </Box>

      <Footer />
    </Box>
  );
};

export default TermsAndPrivacy;
