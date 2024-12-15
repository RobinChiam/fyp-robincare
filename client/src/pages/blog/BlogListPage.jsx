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
} from "@chakra-ui/react";
import axiosInstance from "../../utils/axiosInstance";
import { Link as RouterLink } from "react-router-dom";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

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
    <Box p={6} maxW="800px" mx="auto">
      <Heading mb={4}>All Blogs</Heading>
      {blogs.length === 0 ? (
        <Center>
          <Text>No Blogs Found</Text>
        </Center>
      ) : (
        <VStack spacing={4} align="stretch">
          {blogs.map((blog) => (
            <LinkBox
              as="article"
              key={blog._id}
              border="1px"
              borderRadius="md"
              p="4"
              _hover={{ boxShadow: "lg", cursor: "pointer" }}
            >
              <Flex align="center" mb={2}>
                <Image
                  src={`http://localhost:5000${blog?.thumbnail}`}
                  alt="Blog Thumbnail"
                  borderRadius="md"
                  boxSize="100px"
                  objectFit="cover"
                  mr="4"
                />
                <LinkOverlay as={RouterLink} to={`/blog/${blog._id}`}>
                  <Text fontSize="xl" fontWeight="bold">
                    {blog.title}
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
                  mr="2"
                />
                <Text>By Dr. {blog?.doctor?.user?.name || "Unknown"}</Text>
              </Flex>
              <Text noOfLines={2} mt={2}>
                {blog.content}
              </Text>
            </LinkBox>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default BlogList;
