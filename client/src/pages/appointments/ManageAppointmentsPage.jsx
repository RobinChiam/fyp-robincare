import { Box, Heading } from "@chakra-ui/react";
import AppointmentList from "../../components/appointments/AppointmentList";

const ManageAppointmentsPage = ({ appointments }) => (
  <Box py="10" px="6">
    <Heading>Manage Appointments</Heading>
    <AppointmentList appointments={appointments} />
  </Box>
);

export default ManageAppointmentsPage;
