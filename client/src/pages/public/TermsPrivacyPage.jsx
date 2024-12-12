import React from 'react';
import {
  Box,
  Heading,
  Text,
  Stack,
  Container,
  List,
  ListItem,
} from '@chakra-ui/react';
import Header from '../../components/layout/Header';
import Footer from '../../components/layout/Footer';

const TermsAndPrivacy = () => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      minHeight="100vh" // Ensures the footer is pushed to the bottom for short content
    >
      <Header />
      <Box flex="1" as="main" bg="gray.50" py={10}>
        <Container maxW={{ base: '100%', md: '80%', lg: '70%' }}>
          {/* Terms and Privacy Section */}
          <Stack spacing={8}>
            <Heading as="h1" size="2xl" textAlign="center" color={'black'}>
              Terms of Service and Privacy Policy
            </Heading>

            <Box>
              <Heading as="h2" size="lg" mb={4} color={'black'}>
                Terms of Service
              </Heading>
              <Text fontSize="md" color="black" mb={4}>
                Welcome to our Healthcare Management System. By accessing or
                using our web application, you agree to comply with and be
                bound by the following terms of service:
              </Text>
              <List spacing={3}>
                <ListItem>
                  <Text fontSize="md" color="black">
                    1. You agree to use the platform only for lawful purposes
                    and in accordance with these terms.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize="md" color="black">
                    2. You are responsible for maintaining the confidentiality
                    of your account credentials and agree to notify us
                    immediately of any unauthorized access.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize="md" color="black">
                    3. We reserve the right to suspend or terminate accounts
                    that violate these terms or engage in prohibited activities.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize="md" color="black">
                    4. The content provided on this platform is for
                    informational purposes only and does not substitute for
                    professional medical advice.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize="md" color="black">
                    5. Our services may be subject to additional terms,
                    conditions, or agreements that will be presented at the time
                    of use.
                  </Text>
                </ListItem>
              </List>
            </Box>

            <Box>
              <Heading as="h2" size="lg" mb={4}>
                Privacy Policy
              </Heading>
              <Text fontSize="md" color="black" mb={4}>
                Your privacy is important to us. This privacy policy explains
                how we collect, use, and protect your personal information:
              </Text>
              <List spacing={3}>
                <ListItem>
                  <Text fontSize="md" color="black">
                    1. <strong>Information Collection:</strong> We collect
                    information such as your name, email address, health
                    records, and appointment details to provide our services.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize="md" color="black">
                    2. <strong>Use of Information:</strong> Your information is
                    used to manage appointments, facilitate communication with
                    doctors, and improve our services.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize="md" color="black">
                    3. <strong>Data Security:</strong> We implement
                    industry-standard measures to protect your data from
                    unauthorized access or disclosure.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize="md" color="black">
                    4. <strong>Sharing Information:</strong> We do not sell your
                    data. Information may be shared with healthcare providers or
                    third parties as required for service delivery or legal
                    compliance.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize="md" color="black">
                    5. <strong>Cookies:</strong> Our website may use cookies to
                    enhance your browsing experience. You can disable cookies
                    through your browser settings.
                  </Text>
                </ListItem>
                <ListItem>
                  <Text fontSize="md" color="black">
                    6. <strong>Your Rights:</strong> You have the right to
                    access, correct, or delete your personal information by
                    contacting us at support@example.com.
                  </Text>
                </ListItem>
              </List>
            </Box>

            <Text fontSize="sm" color="black" textAlign="center" mt={10}>
              Last updated: {new Date().toLocaleDateString()}
            </Text>
          </Stack>
        </Container>
      </Box>
      <Footer />
    </Box>
  );
};

export default TermsAndPrivacy;
