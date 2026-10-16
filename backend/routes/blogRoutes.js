import express from "express";
import auth from "../middleware/auth.js";
import upload from "../middleware/upload.js";
import {
  createBlog,
  getAllBlogs,
  getBlogById,
  deleteBlog
} from "../controllers/blogController.js";

const router = express.Router();

// Routes
router.post("/", auth, upload.single("image"), createBlog);
router.post("/blog", auth, upload.single("image"), createBlog);
router.get("/", getAllBlogs);
router.get("/:id", getBlogById);
router.delete("/:id", auth, deleteBlog);

export default router;
