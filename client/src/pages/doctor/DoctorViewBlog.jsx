import React, { useEffect, useState } from "react";
import {
  Box,
  Text,
  Image,
  VStack,
  Heading,
  Spinner,
  useToast,
  Flex,
  LinkBox,
  LinkOverlay,
} from "@chakra-ui/react";
import axiosInstance from "../../utils/axiosInstance";
import DoctorNavbar from "../../components/layout/DoctorNavbar";
import { Link as RouterLink } from "react-router-dom";

const DoctorViewBlog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const toast = useToast();

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get("/blog");
        setBlogs(response.data);
      } catch (error) {
        toast({
          title: "Error!",
          description: "Failed to fetch blogs.",
          status: "error",
          duration: 3000,
          isClosable: true,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) {
    return (
      <>
        <DoctorNavbar />
        <Box p="6" textAlign="center">
          <Spinner size="xl" />
        </Box>
      </>
    );
  }

  return (
    <>
      <DoctorNavbar />
      <Box p="6" maxW="800px" mx="auto">
        <Heading mb="4">Your Blogs</Heading>
        <VStack spacing="4" align="stretch">
          {blogs.length > 0 ? (
            blogs.map((blog) => (
              <LinkBox
                as="article"
                key={blog._id}
                border="1px"
                borderRadius="md"
                p="4"
                _hover={{ boxShadow: "lg", cursor: "pointer" }}
              >
                <Flex align="center" mb="2">
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
                <Text noOfLines={2}>{blog.content}</Text>
              </LinkBox>
            ))
          ) : (
            <Text>No blogs found.</Text>
          )}
        </VStack>
      </Box>
    </>
  );
};

export default DoctorViewBlog;
