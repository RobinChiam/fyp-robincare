import React, { useState } from "react";
import {
  Input,
  Button,
  Textarea,
  Box,
  Heading,
  VStack,
  useToast,
} from "@chakra-ui/react";
import axiosInstance from "../../utils/axiosInstance"; // Use axiosInstance
import DoctorNavbar from "../../components/layout/DoctorNavbar"; // Include DoctorNavbar

const DoctorWriteBlog = () => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [thumbnail, setThumbnail] = useState(null); // File for the thumbnail
  const toast = useToast();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setThumbnail(file);
      toast({
        title: "File Selected",
        description: `You selected ${file.name}.`,
        status: "info",
        isClosable: true,
      });
    }
  };

  const handleSubmit = async () => {
    if (!title || !content || !thumbnail) {
      toast({
        title: "Missing Fields",
        description: "Please provide all required fields.",
        status: "error",
        isClosable: true,
      });
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    formData.append("thumbnail", thumbnail);

    try {
      const response = await axiosInstance.post("/blog", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      toast({
        title: "Success!",
        description: "Blog created successfully!",
        status: "success",
        duration: 3000,
        isClosable: true,
      });
      setTitle("");
      setContent("");
      setThumbnail(null);
    } catch (error) {
      toast({
        title: "Error!",
        description: error.response?.data?.message || "Failed to create blog.",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
    }
  };

  return (
    <>
      <DoctorNavbar />
      <Box p="6" maxW="600px" mx="auto">
        <Heading mb="4">Create a Blog</Heading>
        <VStack spacing="4">
          <Input
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <Textarea
            placeholder="Content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <Input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
          />
          <Button colorScheme="blue" onClick={handleSubmit}>
            Submit
          </Button>
        </VStack>
      </Box>
    </>
  );
};

export default DoctorWriteBlog;
