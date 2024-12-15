const express = require("express");
const router = express.Router();
const { getBlogsByDoctor, createBlog, getBlogsById, getBlogs } = require("../controllers/blogController");
const authMiddleware = require("../middleware/authMiddleware"); // Assuming JWT-based middleware
const upload = require("../config/upload");

router.get("/", authMiddleware(['doctor']), getBlogsByDoctor);
router.post("/", authMiddleware(['doctor']), upload.single("thumbnail"), createBlog);
router.get('/list', getBlogs);
router.get("/:id", getBlogsById);



module.exports = router;