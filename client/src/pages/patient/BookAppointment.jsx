import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
    Box, Select, Input, Button, VStack, Heading, Text
} from '@chakra-ui/react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../../components/layout/Navbar';

const BookAppointment = () => {
    const [doctors, setDoctors] = useState([]);
    const [selectedDoctor, setSelectedDoctor] = useState('');
    const [timeSlots, setTimeSlots] = useState([]);
    const [date, setDate] = useState('');
    const [timeSlot, setTimeSlot] = useState('');
    const [message, setMessage] = useState('');
    const [user, setUser] = useState(null); // State for authenticated user
    const navigate = useNavigate();

    useEffect(() => {
        const authenticateUser = async () => {
            try {
                const userResponse = await axios.get("http://localhost:5000/api/users/me", {
                    withCredentials: true,
                });
                setUser(userResponse.data);

                const doctorsResponse = await axios.get("http://localhost:5000/doctor/list", {
                    withCredentials: true,
                });
                setDoctors(doctorsResponse.data);
            } catch (error) {
                console.error("Authentication error:", error.message);
                navigate("/login"); // Redirect to login page if not authenticated
            }
        };

        authenticateUser();
    }, [navigate]);

    const handleLogout = async () => {
        try {
            await axios.post(
                "http://localhost:5000/auth/logout",
                {},
                { withCredentials: true }
            );
            navigate("/login");
        } catch (error) {
            console.error("Error during logout:", error.message);
        }
    };

    const generateTimeSlots = (startTime, endTime) => {
        const slots = [];
        let current = new Date(`1970-01-01T${startTime}:00`);
        const end = new Date(`1970-01-01T${endTime}:00`);

        while (current < end) {
            const next = new Date(current.getTime() + 30 * 60000); // Add 30 minutes
            const formatTime = time =>
                time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
            slots.push(`${formatTime(current)} - ${formatTime(next)}`);
            current = next;
        }
        return slots;
    };

    const handleDoctorChange = (doctorId) => {
        setSelectedDoctor(doctorId);

        // Find the selected doctor from the list
        const doctor = doctors.find(doc => doc._id === doctorId);

        if (doctor && doctor.consultationHours) {
            const { start, end } = doctor.consultationHours;
            const slots = generateTimeSlots(start, end);
            setTimeSlots(slots); // Update the available time slots
        } else {
            setTimeSlots([]); // Clear time slots if no doctor or hours are available
        }
    };

    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:5000/appointments/create', {
                patientId: user._id,
                doctorId: selectedDoctor,
                date,
                timeSlot
            }, { withCredentials: true });

            setMessage(response.data.message);
        } catch (error) {
            setMessage(error.response?.data?.message || 'Error booking appointment');
        }
    };

    return (
        <Box>
            {/* Navbar */}
            {user && <Navbar user={user} onLogout={handleLogout} />}

            <Box p={6} maxWidth="500px" mx="auto">
                <Heading as="h1" size="lg" mb={4}>Book Appointment</Heading>
                <VStack spacing={4}>
                    <Select
                        placeholder="Select Doctor"
                        onChange={(e) => handleDoctorChange(e.target.value)}
                    >
                        {doctors.map(doctor => (
                            <option key={doctor._id} value={doctor._id}>
                                {doctor.user?.name} ({doctor.specialization})
                            </option>
                        ))}
                    </Select>
                    <Input
                        type="date"
                        onChange={(e) => setDate(e.target.value)}
                        value={date}
                    />
                    <Select
                        placeholder="Select Time Slot"
                        onChange={(e) => setTimeSlot(e.target.value)}
                    >
                        {timeSlots.map((slot, index) => (
                            <option key={index} value={slot}>{slot}</option>
                        ))}
                    </Select>
                    <Button colorScheme="blue" onClick={handleSubmit}>Book Appointment</Button>
                    {message && <Text color="green.500">{message}</Text>}
                </VStack>
            </Box>
        </Box>
    );
};

export default BookAppointment;
