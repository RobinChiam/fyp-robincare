import React, { useState, useEffect } from "react";
import {
  Box,
  VStack,
  FormControl,
  FormLabel,
  Input,
  Button,
  Avatar,
  Heading,
  Spinner,
  useToast,
} from "@chakra-ui/react";
import axiosInstance from "../../utils/axiosInstance";
import Navbar from "../../components/layout/Navbar";

const EditAdminAccount = () => {
  const [profilePicture, setProfilePicture] = useState(null);
  const [currentProfilePicture, setCurrentProfilePicture] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchAdminDetails = async () => {
      try {
        const response = await axiosInstance.get("/admin/profile");
        const { phone, profilePicture } = response.data;

        setPhone(phone || ""); // Pre-fill or leave blank
        setCurrentProfilePicture(profilePicture); // Set current profile picture for preview
      } catch (error) {
        console.error("Error fetching admin details:", error.message);
        toast({
          title: "Failed to fetch admin details",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminDetails();
  }, [toast]);

  const handleFileChange = (e) => {
    setProfilePicture(e.target.files[0]);
  };

  const handleSave = async () => {
    if (password && password !== confirmPassword) {
      toast({
        title: "Passwords do not match",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    try {
      const formData = new FormData();
      if (profilePicture instanceof File) formData.append("profilePicture", profilePicture);
      formData.append("password", password);
      formData.append("confirmPassword", confirmPassword);
      formData.append("phone", phone);

      const response = await axiosInstance.post("/admin/profile/update", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast({
        title: response.data.message,
        status: response.data.message === "No changes made" ? "info" : "success",
        duration: 3000,
        isClosable: true,
      });
    } catch (error) {
      console.error("Error updating admin profile:", error.message);
      toast({
        title: "Failed to update admin profile",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <Box>
      <Navbar />
      <Box py="10" px="6">
        <Heading mb="6">Edit Admin Account</Heading>
        {loading ? (
          <Spinner size="xl" />
        ) : (
          <VStack spacing="4" align="start">
            <FormControl>
              <FormLabel>Profile Picture</FormLabel>
              <Avatar
                size="xl"
                src={
                  profilePicture
                    ? URL.createObjectURL(profilePicture) // Preview new upload
                    : `http://localhost:5000${currentProfilePicture}` // Show current picture
                }
                mb="4"
              />
              <Input type="file" onChange={handleFileChange} />
            </FormControl>

            <FormControl>
              <FormLabel>New Password</FormLabel>
              <Input
                type="password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Confirm Password</FormLabel>
              <Input
                type="password"
                placeholder="Confirm new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </FormControl>

            <FormControl>
              <FormLabel>Phone Number</FormLabel>
              <Input
                type="tel"
                placeholder="Enter your phone number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </FormControl>

            <Button colorScheme="blue" onClick={handleSave}>
              Save Changes
            </Button>
          </VStack>
        )}
      </Box>
    </Box>
  );
};

export default EditAdminAccount;
