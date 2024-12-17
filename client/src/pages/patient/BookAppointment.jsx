import React, { useEffect, useState } from "react";
import {
  Box,
  Select,
  Input,
  Button,
  VStack,
  Heading,
  Text,
  Progress,
  useToast,
  useColorModeValue,
} from "@chakra-ui/react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/layout/Navbar";

const BookAppointment = () => {
  const [step, setStep] = useState(1);
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState("");
  const [date, setDate] = useState("");
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState("");
  const [reason, setReason] = useState("");
  const [message, setMessage] = useState("");
  const [patientId, setPatientId] = useState(null);
  const navigate = useNavigate();
  const toast = useToast();

  const bgColor = useColorModeValue("gray.50", "gray.700");
  const cardBg = useColorModeValue("white", "gray.800");
  const textColor = useColorModeValue("gray.800", "gray.200");

  const user = useSelector((state) => state.user.userDetails);

  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const response = await axiosInstance.get("/patient/id");
        setPatientId(response.data.patientId);
      } catch (error) {
        setMessage("Could not fetch patient details.");
      }
    };
    if (user?.role === "patient") fetchPatientId();
  }, [user]);

  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get("/doctor/list");
        setDoctors(response.data);
      } catch {
        navigate("/login");
      }
    };
    fetchDoctors();
  }, [navigate]);

  const handleSubmit = async () => {
    try {
      await axiosInstance.post("/appointments/create", {
        patientId,
        doctorId: selectedDoctor,
        date,
        timeSlot,
        reason,
      });
      toast({
        title: "Appointment Created",
        description: "Your appointment has been booked successfully!",
        status: "success",
        duration: 5000,
        isClosable: true,
      });
      navigate("/dashboard/patient");
    } catch {
      setMessage("Error booking appointment. Please try again.");
    }
  };

  return (
    <Box bg={bgColor} minH="100vh">
      <Navbar />
      <Box display="flex" alignItems="center" justifyContent="center" py={8}>
        <Box
          p={6}
          maxW="lg"
          w="full"
          bg={cardBg}
          borderRadius="lg"
          boxShadow="lg"
          textColor={textColor}
        >
          <Heading as="h1" size="lg" mb={6} textAlign="center">
            Book Appointment
          </Heading>
          <Progress value={(step / 2) * 100} mb={6} />
          {step === 1 && (
            <VStack spacing={4}>
              <Select
                placeholder="Select Doctor"
                onChange={(e) => setSelectedDoctor(e.target.value)}
              >
                {doctors.map((doctor) => (
                  <option key={doctor._id} value={doctor._id}>
                    {doctor.user?.name} ({doctor.specialization})
                  </option>
                ))}
              </Select>
              <Input
                placeholder="Reason for Appointment"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
              <Button
                colorScheme="blue"
                onClick={() => setStep(2)}
                isDisabled={!selectedDoctor || !reason}
              >
                Next
              </Button>
            </VStack>
          )}
          {step === 2 && (
            <VStack spacing={4}>
              <Input
                type="date"
                onChange={(e) => setDate(e.target.value)}
                value={date}
                min={new Date().toISOString().split("T")[0]}
              />
              <Select
                placeholder="Select Time Slot"
                onChange={(e) => setTimeSlot(e.target.value)}
              >
                {timeSlots.map((slot, index) => (
                  <option key={index} value={slot}>
                    {slot}
                  </option>
                ))}
              </Select>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isDisabled={!timeSlot}
              >
                Confirm Appointment
              </Button>
              <Button variant="outline" onClick={() => setStep(1)}>
                Back
              </Button>
            </VStack>
          )}
          {message && <Text color="red.500">{message}</Text>}
        </Box>
      </Box>
    </Box>
  );
};

export default BookAppointment;
