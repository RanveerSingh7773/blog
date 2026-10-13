import express from "express";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";

const router = express.Router();

// Controller helper to create a blog
const handleCreateBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ error: "Title and content are required." });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    let imagePath = "";
    if (req.file) {
      imagePath = `/uploads/${req.file.filename}`;
    } else if (req.body.image) {
      imagePath = req.body.image;
    }

    const newBlog = new Blog({
      title,
      content,
      image: imagePath,
      author: user.username,
      user: user._id
    });
    await newBlog.save();
    res.status(201).json({ message: "Blog Created Successfully!", blog: newBlog });
  } catch (err) {
    res.status(500).json({ error: "Server error while creating blog." });
  }
};

// POST /api/blogs and /api/blogs/blog — Sirf logged-in users blog create kar sakte hain
router.post("/", auth, upload.single("image"), handleCreateBlog);
router.post("/blog", auth, upload.single("image"), handleCreateBlog);

// GET /api/blogs  — Sab log blogs dekh sakte hain (public)
router.get("/", async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching blogs." });
  }
});

// GET /api/blogs/:id  — Ek blog detail (public)
router.get("/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found." });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: "Server error while fetching blog." });
  }
});

// DELETE /api/blogs/:id  — Sirf auth user apna blog delete kar sakta hai
router.delete("/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found." });

    const user = await User.findById(req.userId);
    const isOwner = (blog.user && blog.user.toString() === req.userId) || (user && blog.author === user.username);

    if (!isOwner) {
      return res.status(403).json({ error: "You are not authorized to delete this blog." });
    }

    await Blog.findByIdAndDelete(req.params.id);
    res.json({ message: "Blog deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting blog." });
  }
});

export default router;
