import React, { useState, useEffect } from "react";
import {
  Box,
  Text,
  Image,
  VStack,
  Heading,
  Spinner,
  Flex,
  LinkBox,
  LinkOverlay,
  Center,
  IconButton,
  useColorMode,
} from "@chakra-ui/react";
import { SunIcon, MoonIcon } from "@chakra-ui/icons";
import axiosInstance from "../../utils/axiosInstance";
import { Link as RouterLink } from "react-router-dom";
import Header from "../../components/layout/Header";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const { colorMode, toggleColorMode } = useColorMode();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get("/blog/list");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <Box p={6} textAlign="center">
        <Spinner size="xl" />
      </Box>
    );
  }

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
      <Box py={12} px={6}>
        <Heading as="h1" mb={8} textAlign="center" color="blue.500">
          Our Blogs
        </Heading>
        {blogs.length === 0 ? (
          <Center>
            <Text>No Blogs Found</Text>
          </Center>
        ) : (
          <VStack spacing={6} align="stretch" maxW="4xl" mx="auto">
            {blogs.map((blog) => (
              <LinkBox
                as="article"
                key={blog._id}
                borderRadius="lg"
                boxShadow="lg"
                p="6"
                bg="white"
                _hover={{
                  transform: "scale(1.02)",
                  transition: "all 0.3s ease",
                }}
              >
                <Flex align="center" mb={4}>
                  <Image
                    src={`http://localhost:5000${blog?.thumbnail}`}
                    alt="Blog Thumbnail"
                    borderRadius="lg"
                    boxSize="120px"
                    objectFit="cover"
                    mr={6}
                  />
                  <LinkOverlay as={RouterLink} to={`/blog/${blog._id}`}>
                    <Heading as="h2" size="md" mb={2} color="blue.600">
                      {blog.title}
                    </Heading>
                    <Text noOfLines={2} color="gray.600">
                      {blog.content}
                    </Text>
                  </LinkOverlay>
                </Flex>
                <Flex align="center" mt={2}>
                  <Image
                    src={`http://localhost:5000${blog?.doctor?.user?.profilePicture}`}
                    alt="Author Profile"
                    boxSize="40px"
                    borderRadius="full"
                    objectFit="cover"
                    mr={2}
                  />
                  <Text fontSize="sm" color="gray.500">
                    By Dr. {blog?.doctor?.user?.name || "Unknown"}
                  </Text>
                </Flex>
              </LinkBox>
            ))}
          </VStack>
        )}
      </Box>

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

export default BlogList;
