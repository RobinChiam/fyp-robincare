const express = require('express');
const router = express.Router();
const Blog = require('../models/blog-model');
const Doctor = require('../models/doctor-model');

router.get('/blog', async (req, res) => {
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
});

router.get('/blog/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const blog = await Blog.findById(id)
        .populate({
          path: 'doctor',
          populate: { path: 'user', select: 'name profilePicture' }
        })
        .exec();
  
      if (!blog) {
        return res.status(404).json({ error: 'Blog not found' });
      }
  
      res.status(200).json(blog);
    } catch (error) {
      console.error('Error fetching the blog:', error.message);
      res.status(500).json({ error: 'Unable to fetch the blog' });
    }
  });

module.exports = router;
