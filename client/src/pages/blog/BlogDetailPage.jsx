import React, { useState, useEffect } from "react";
import { Box, Image, Heading, Text, Spinner, Center } from "@chakra-ui/react";
import { useParams } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const BlogDetail = () => {
    const { id } = useParams();
    const [blog, setBlog] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
  
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
          console.error("Error fetching the blog:", err.message);
          setError("This blog doesn't exist.");
        } finally {
          setLoading(false);
        }
      };
  
      fetchBlog();
    }, [id]);
  
    return (
      <Box p={6}>
        {loading ? (
          <Spinner />
        ) : error ? (
          <Center>
            <Text color="red.500" fontSize="lg">{error}</Text>
          </Center>
        ) : (
          blog && (
            <Box>
              <Image
                src={`http://localhost:5000/${blog.thumbnail}`}
                alt="Blog Thumbnail"
                width="100%"
                borderRadius="md"
                mb={4}
              />
              <Heading>{blog.title}</Heading>
              <Text mt={2} fontStyle="italic">
                By Dr. {blog.doctor.user.name} on {new Date(blog.createdAt).toLocaleDateString()}
              </Text>
              <Text mt={6}>{blog.content}</Text>
            </Box>
          )
        )}
      </Box>
    );
  };
  
  export default BlogDetail;