import express from "express";
import Blog from "../models/Blog.js";
import User from "../models/User.js";
import auth from "../middleware/auth.js";

const router = express.Router();

// POST /api/blogs  — Sirf logged-in users blog create kar sakte hain
router.post("/blog", auth, async (req, res) => {
  try {
    const { title, content } = req.body;
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ error: "User not found." });

    const newBlog = new Blog({ title, content, author: user.username });
    await newBlog.save();
    res.status(201).json({ message: "Blog Created Successfully!", blog: newBlog });
  } catch (err) {
    res.status(500).json({ error: "Server error while creating blog." });
  }
});

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
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ error: "Blog not found." });
    res.json({ message: "Blog deleted successfully." });
  } catch (err) {
    res.status(500).json({ error: "Server error while deleting blog." });
  }
});

export default router;
