const Blog = require("../models/blog-model");
const Doctor = require('../models/doctor-model');


// Get all blogs for a doctor
const getBlogsByDoctor = async (req, res) => {
  try {
    const doctor = await Doctor.findOne({ user: req.user.id });
    const blogs = await Blog.find({ doctor: doctor._id });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch blogs" });
  }
};

// Create a new blog
const createBlog = async (req, res) => {
    try {
      const { title, content } = req.body;
      const thumbnail = req.file ? `/uploads/${req.file.filename}` : null;
        console.log(title + " " + content + " " + thumbnail);
      if (!title || !content || !thumbnail) {
        return res.status(400).json({ error: "All fields are required" });
      }
  
      // Find the doctor associated with the user ID
      const doctor = await Doctor.findOne({ user: req.user.id });
      if (!doctor) {
        return res.status(404).json({ error: "Doctor profile not found for this user" });
      }
  
      // Create the new blog
      const newBlog = new Blog({
        title,
        content,
        thumbnail,
        doctor: doctor._id, // Store the doctor ID in the Blog document
      });
  
      await newBlog.save();
      res.status(201).json(newBlog);
    } catch (error) {
      console.log("Error creating blog:", error.message);
      res.status(500).json({ error: "Failed to create blog" });
    }
  };
  

const getBlogsById = async (req, res) => {
     try {
          const { id } = req.params;
        //   console.log(id);
          const blog = await Blog.findById(id)
          .populate({
            path: "doctor",
            model: "Doctor", // Explicitly specify the model to ensure the reference is resolved
            populate: { path: "user", model: "User", select: "name profilePicture" },
          })
          .exec();
        console.log(blog);

          if (!blog) {
            return res.status(404).json({ error: 'Blog not found' });
          }
      
          res.status(200).json(blog);
        } catch (error) {
          console.error('Error fetching the blog:', error.message);
          res.status(500).json({ error: 'Unable to fetch the blog' });
        }
      };

const getBlogs = async (req, res) => {
    try {
        const blogs = await Blog.find()
          .populate({
            path: 'doctor',
            populate: { path: 'user', select: 'name profilePicture' }
          })
          .exec();
    
        res.status(200).json(blogs);
      } catch (error) {
        console.error('Error fetching blogs:', error.message);
        res.status(500).json({ error: 'Unable to fetch blogs' });
      }
    };

module.exports = {
  getBlogsByDoctor,
  createBlog,
  getBlogsById,
  getBlogs
}