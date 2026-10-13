import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

// POST /api/auth/register
router.post("/register", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "Please provide username, email, and password." });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ error: "Email already registered." });

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({ username, email, password: hashed });
    await user.save();
    res.status(201).json({ message: "User Registered Successfully!" });
  } catch (err) {
    res.status(500).json({ error: "Server error during registration." });
  }
});

// POST /api/auth/login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: "Please enter email and password." });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "User not found." });

    const validPass = await bcrypt.compare(password, user.password);
    if (!validPass) return res.status(400).json({ error: "Invalid password." });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ token, username: user.username, userId: user._id });
  } catch (err) {
    res.status(500).json({ error: "Server error during login." });
  }
});

// GET /api/auth/me - Get current logged in user details
router.get("/me", async (req, res) => {
  try {
    let token = req.headers["authorization"];
    if (!token) return res.status(401).json({ error: "No token" });
    if (token.startsWith("Bearer ")) token = token.slice(7).trim();

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    if (!user) return res.status(404).json({ error: "User not found" });

    res.json({ userId: user._id, username: user.username, email: user.email });
  } catch (err) {
    res.status(401).json({ error: "Invalid token" });
  }
});

export default router;
