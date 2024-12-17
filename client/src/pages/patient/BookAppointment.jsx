import React, { useEffect, useState } from 'react';
import {
  Box, Select, Input, Button, VStack, Heading, Text, Progress, useToast
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axiosInstance from '../../utils/axiosInstance';
import Navbar from '../../components/layout/Navbar';

const BookAppointment = () => {
  const [step, setStep] = useState(1); // Step tracker
  const [doctors, setDoctors] = useState([]);
  const [selectedDoctor, setSelectedDoctor] = useState('');
  const [date, setDate] = useState('');
  const [timeSlots, setTimeSlots] = useState([]);
  const [timeSlot, setTimeSlot] = useState('');
  const [reason, setReason] = useState('');
  const [message, setMessage] = useState('');
  const [patientId, setPatientId] = useState(null); // Store patientId
  const navigate = useNavigate();
  const toast = useToast();

  const user = useSelector((state) => state.user.userDetails);

  // Fetch patientId if the user is a patient
  useEffect(() => {
    const fetchPatientId = async () => {
      try {
        const response = await axiosInstance.get('/patient/id'); // New route
        setPatientId(response.data.patientId);
      } catch (error) {
        console.error('Error fetching patient ID:', error.message);
        setMessage('Could not fetch patient details. Please try again later.');
      }
    };
  
    if (user?.role === 'patient') {
      fetchPatientId();
    }
  }, [user]);

  // Fetch list of doctors
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await axiosInstance.get('/doctor/list');
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error.message);
        navigate('/login');
      }
    };

    fetchDoctors();
  }, [navigate]);

  const generateTimeSlots = (startTime, endTime, minTime) => {
    const slots = [];
    const currentDate = new Date();
    const currentYear = currentDate.getFullYear();
    const currentMonth = String(currentDate.getMonth() + 1).padStart(2, '0');
    const currentDay = String(currentDate.getDate()).padStart(2, '0');
  
    // Base date will be today's date
    const baseDate = `${currentYear}-${currentMonth}-${currentDay}`;
  
    let current = new Date(`${baseDate}T${startTime}:00`);
    const end = new Date(`${baseDate}T${endTime}:00`);
  
    while (current < end) {
      const next = new Date(current.getTime() + 30 * 60000); // Add 30 minutes
      if (!minTime || current >= minTime) {
        const formatTime = (time) =>
          time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
        slots.push(`${formatTime(current)} - ${formatTime(next)}`);
      }
      current = next;
    }
    return slots;
  };
  

  const handleDoctorChange = async (doctorId) => {
    setSelectedDoctor(doctorId);
    setDate(''); // Reset date and time when doctor changes
    setTimeSlots([]);
    setTimeSlot('');

    const doctor = doctors.find(doc => doc._id === doctorId);

    if (doctor && doctor.consultationHours) {
      const { start, end } = doctor.consultationHours;

      // Filter time slots based on existing appointments
      const minTime = new Date();
      const filteredSlots = generateTimeSlots(start, end, minTime);
      setTimeSlots(filteredSlots);
    }
  };

  const handleDateChange = async (selectedDate) => {
    setDate(selectedDate);
  
    try {
      const doctor = doctors.find((doc) => doc._id === selectedDoctor);
  
      if (!doctor || !doctor.consultationHours) {
        setTimeSlots(['No consultation hours available for this doctor']);
        return;
      }
  
      const { start, end } = doctor.consultationHours;
      const currentDate = new Date();
      const isToday = selectedDate === currentDate.toISOString().split('T')[0];
  
      // Generate minimum time for today's date
      const minTime = isToday ? new Date() : null;
  
      const response = await axiosInstance.post('/appointments/available-slots', {
        doctorId: selectedDoctor,
        date: selectedDate, // Ensure only the date (YYYY-MM-DD) is sent
      });
  
      const bookedSlots = response.data.bookedSlots || [];
      const availableSlots = generateTimeSlots(start, end, minTime).filter(
        (slot) => !bookedSlots.includes(slot)
      );
  
      if (availableSlots.length > 0) {
        setTimeSlots(availableSlots);
      } else {
        setTimeSlots(['Doctor has been fully booked, please select a different date']);
      }
    } catch (error) {
      console.error('Error fetching available slots:', error.message);
      setMessage('Error fetching available slots.');
    }
  };

  const handleSubmit = async () => {
    try {
      const response = await axiosInstance.post('/appointments/create', {
        patientId,
        doctorId: selectedDoctor,
        date,
        timeSlot,
        reason,
      });
  
      toast({
        title: 'Appointment Created',
        description: response.data.message,
        status: 'success',
        duration: 5000,
        isClosable: true,
      });
  
      navigate('/dashboard/patient');
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Error booking appointment';
      setMessage(errorMessage);
  
      toast({
        title: 'Error',
        description: errorMessage,
        status: 'error',
        duration: 5000,
        isClosable: true,
      });
    }
  };
  

  return (
    <Box>
      <Navbar />
      <Box p={6} maxWidth="500px" mx="auto">
        <Heading as="h1" size="lg" mb={4}>Book Appointment</Heading>
        <Progress value={(step / 2) * 100} mb={4} />
        {step === 1 && (
          <VStack spacing={4}>
            <Select placeholder="Select Doctor" onChange={(e) => handleDoctorChange(e.target.value)}>
              {doctors.map(doctor => (
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
            <Button colorScheme="blue" onClick={() => setStep(2)} disabled={!selectedDoctor || !reason}>
              Next
            </Button>
          </VStack>
        )}
        {step === 2 && (
          <VStack spacing={4}>
            <Input
              type="date"
              onChange={(e) => handleDateChange(e.target.value)}
              value={date}
              min={new Date().toISOString().split('T')[0]}
            />
            <Select
              placeholder="Select Time Slot"
              onChange={(e) => setTimeSlot(e.target.value)}
            >
              {timeSlots.map((slot, index) => (
                <option key={index} value={slot}>{slot}</option>
              ))}
            </Select>
            <Button colorScheme="blue" 
            onClick={handleSubmit} 
            disabled={!timeSlot || timeSlot === 'Doctor has been fully booked, please select a different date' 
              || timeSlot === 'No consultation hours available for this doctor'}>
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
  );
};

export default BookAppointment;
