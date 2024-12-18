const Blog = require("../models/blog-model");
const Doctor = require('../models/doctor-model');
const { blogInfo } = require('../config/mailer');
const User = require('../models/user-model');
const DOMPurify = require("dompurify");
const { JSDOM } = require("jsdom"); // Required for DOMPurify to work on the server

// Initialize DOMPurify for server-side sanitization
const window = new JSDOM("").window;
const purify = DOMPurify(window);

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

    if (!title || !content || !thumbnail) {
      return res.status(400).json({ error: "All fields are required" });
    }

    // Sanitize content using DOMPurify
    const sanitizedContent = purify.sanitize(content);

    // Find the doctor associated with the user ID
    const doctor = await Doctor.findOne({ user: req.user.id });
    if (!doctor) {
      return res
        .status(404)
        .json({ error: "Doctor profile not found for this user" });
    }

    // Create the new blog
    const newBlog = new Blog({
      title,
      content: sanitizedContent,
      thumbnail,
      doctor: doctor._id,
    });

    await newBlog.save();

    // Notify all users about the new blog
    const users = await User.find(
      { role: "patient", subscribedToEmails: true },
      "email"
    );
    const recipientEmails = users.map((user) => user.email);

    // Notify all users about the new blog
    await blogInfo(req, res, title, recipientEmails);

    res.status(201).json(newBlog);
  } catch (error) {
    console.log("Error creating blog:", error.message);
    res.status(500).json({ error: "Failed to create blog" });
  }
};

// Get blog by ID
const getBlogsById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findById(id)
      .populate({
        path: "doctor",
        model: "Doctor",
        populate: { path: "user", model: "User", select: "name profilePicture" },
      })
      .exec();

    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }

    res.status(200).json(blog);
  } catch (error) {
    console.error("Error fetching the blog:", error.message);
    res.status(500).json({ error: "Unable to fetch the blog" });
  }
};

// Get all blogs (public list)
const getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find()
      .populate({
        path: "doctor",
        populate: { path: "user", select: "name profilePicture" },
      })
      .exec();

    res.status(200).json(blogs);
  } catch (error) {
    console.error("Error fetching blogs:", error.message);
    res.status(500).json({ error: "Unable to fetch blogs" });
  }
};

module.exports = {
  getBlogsByDoctor,
  createBlog,
  getBlogsById,
  getBlogs,
};