import React, { useState, useEffect } from "react";
import { Box, Image, VStack, Text, Spinner, Heading, Center } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await axiosInstance.get("/blog");
        setBlogs(response.data);
      } catch (error) {
        console.error("Error fetching blogs:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  return (
    <Box p={6}>
      <Heading mb={4}>Blog Posts</Heading>
      {loading ? (
        <Spinner />
      ) : blogs.length === 0 ? (
        <Center>
          <Text>No Blogs Found</Text>
        </Center>
      ) : (
        <VStack spacing={4} align="stretch">
          {blogs.map((blog) => (
            <Box
              key={blog._id}
              p={4}
              borderWidth={1}
              borderRadius="md"
              display="flex"
              alignItems="center"
            >
              <Image
                src={`http://localhost:5000/${blog.thumbnail}`}
                alt="Blog Thumbnail"
                boxSize="100px"
                objectFit="cover"
                borderRadius="md"
              />
              <Box ml={4}>
                <Heading size="md">
                  <Link to={`/blog/${blog._id}`}>{blog.title}</Link>
                </Heading>
                <Text>By Dr. {blog.doctor.user.name}</Text>
                <Image
                  src={`http://localhost:5000${blog.doctor.user.profilePicture}`}
                  alt="Author"
                  boxSize="40px"
                  borderRadius="full"
                  mt={2}
                />
              </Box>
            </Box>
          ))}
        </VStack>
      )}
    </Box>
  );
};

export default BlogList;
