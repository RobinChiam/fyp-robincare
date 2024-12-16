import React, { useState, useEffect } from "react";
import { Box, Heading, VStack, Button, Text, Input, Textarea } from "@chakra-ui/react";
import { useParams, useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const CompleteAppointment = () => {
  const { id } = useParams(); // Appointment ID from URL
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    appointmentId: id, // Include appointmentId
    diagnosis: "",
    prescription: "",
    notes: "",
    attachments: [],
  });
  const navigate = useNavigate();

  // Fetch initial appointment details
  useEffect(() => {
    const fetchAppointmentDetails = async () => {
      try {
        const response = await axiosInstance.get(`/appointments/${id}`);
        const { patientId, doctorId, date } = response.data;
  
        setFormData((prevData) => ({
          ...prevData,
          patientId: patientId._id, // ObjectId for submission
          patientName: patientId?.user?.name, // Display name for UI
          doctorId: doctorId._id, // ObjectId for submission
          doctorName: doctorId?.user?.name, // Display name for UI
        }));
      } catch (error) {
        console.error("Error fetching appointment details:", error.message);
      }
    };
    fetchAppointmentDetails();
  }, [id]);

  // Handle file uploads
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    setFormData((prevData) => ({
      ...prevData,
      attachments: [...prevData.attachments, ...files],
    }));
  };
  
  const handleSubmit = async () => {
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("patientId", formData.patientId);
      formDataToSend.append("doctorId", formData.doctorId);
      formDataToSend.append("appointmentId", formData.appointmentId);
      formDataToSend.append("diagnosis", formData.diagnosis);
      formDataToSend.append("prescription", formData.prescription);
      formDataToSend.append("notes", formData.notes);
  
      // Append file attachments with the correct field name: 'files'
      formData.attachments.forEach((file) => {
        formDataToSend.append("files", file); // Change 'attachments' to 'files'
      });
  
      // Send request to create health record
      await axiosInstance.post("/medical-records/create", formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
  
      // Update appointment status
      await axiosInstance.post(`/appointments/updateAppointment/${id}`, { status: "complete" });
  
      alert("Appointment completed successfully!");
      navigate("/dashboard/doctor");
    } catch (error) {
      console.error("Error completing appointment:", error.message);
    }
  };

  return (
    <Box p={6}>
      <Heading>Complete Appointment</Heading>
      <VStack spacing={4} align="stretch" mt={6}>
        {step === 1 && (
          <>
            <Text>Patient: {formData.patientName}</Text>
            <Text>Doctor: {formData.doctorName}</Text>
            <Button onClick={() => setStep(2)}>Next</Button>
          </>
        )}
        {step === 2 && (
          <>
            <Textarea
              placeholder="Diagnosis"
              value={formData.diagnosis}
              onChange={(e) => setFormData({ ...formData, diagnosis: e.target.value })}
            />
            <Textarea
              placeholder="Prescription"
              value={formData.prescription}
              onChange={(e) => setFormData({ ...formData, prescription: e.target.value })}
            />
            <Textarea
              placeholder="Notes"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
            <Button onClick={() => setStep(3)}>Next</Button>
          </>
        )}
        {step === 3 && (
          <>
            <Input type="file" multiple onChange={handleFileUpload} />
            <Button onClick={handleSubmit}>Complete Appointment</Button>
          </>
        )}
      </VStack>
    </Box>
  );
};

export default CompleteAppointment;
