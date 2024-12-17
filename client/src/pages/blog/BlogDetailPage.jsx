import React, { useState, useEffect } from "react";
import {
  Box,
  Image,
  Heading,
  Text,
  Spinner,
  Center,
  Flex,
  Container,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import Header from "../../components/layout/Header";

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await axiosInstance.get(`/blog/${id}`);
        if (response.data) {
          setBlog(response.data);
        } else {
          setError("This blog doesn't exist.");
        }
      } catch (err) {
        setError("This blog doesn't exist.");
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  return (
    <Box
      minH="100vh"
      bg={colorMode === "light" ? "gray.50" : "gray.800"}
      color={colorMode === "light" ? "gray.800" : "gray.200"}
      position="relative"
      m={0}
      p={0}
    >
      <Header /> {/* Ensure Header is flush at the top */}
      <Container maxW="4xl" py={12}>
        {loading ? (
          <Center>
            <Spinner size="xl" />
          </Center>
        ) : error ? (
          <Center>
            <Text color="red.500" fontSize="lg">
              {error}
            </Text>
          </Center>
        ) : (
          blog && (
            <Box bg="white" p={6} shadow="lg" borderRadius="lg">
              <Image
                src={`http://localhost:5000${blog.thumbnail}`}
                alt="Blog Thumbnail"
                width="100%"
                maxH="300px"
                objectFit="contain"
                borderRadius="lg"
                mb={6}
              />
              <Heading as="h1" size="xl" mb={4} color="blue.500">
                {blog.title}
              </Heading>
              <Flex align="center" mb={6}>
                <Image
                  src={`http://localhost:5000${blog?.doctor?.user?.profilePicture}`}
                  alt="Profile Picture"
                  boxSize="50px"
                  borderRadius="full"
                  objectFit="cover"
                  mr={3}
                />
                <Text fontSize="sm" color="gray.500">
                  By Dr. {blog?.doctor?.user?.name || "Unknown"} on{" "}
                  {blog?.createdAt
                    ? new Date(blog.createdAt).toLocaleDateString()
                    : "Unknown Date"}
                </Text>
              </Flex>
              <Text fontSize="md" lineHeight="1.8" color="gray.700">
                {blog.content}
              </Text>
            </Box>
          )
        )}
      </Container>

      {/* Theme Toggle */}
      <Box position="absolute" bottom={4} right={4}>
        <IconButton
          aria-label="Toggle Theme"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
          onClick={toggleColorMode}
          size="lg"
          isRound
        />
      </Box>
    </Box>
  );
};

export default BlogDetail;
