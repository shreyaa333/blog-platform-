import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import generateToken from "../utils/generateToken.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route  POST /api/auth/register
router.post(
  "/register",
  asyncHandler(async (req, res) => {
    const { name, username, email, password } = req.body;

    if (!name || !username || !email || !password) {
      res.status(400);
      throw new Error("Please fill in all fields");
    }
    if (password.length < 6) {
      res.status(400);
      throw new Error("Password must be at least 6 characters");
    }

    const existing = await User.findOne({ $or: [{ email }, { username: username.toLowerCase() }] });
    if (existing) {
      res.status(400);
      throw new Error("Email or username already in use");
    }

    const user = await User.create({ name, username: username.toLowerCase(), email, password });
    const token = generateToken(user._id);

    res.status(201).json({ token, user: user.toPublicJSON() });
  })
);

// @route  POST /api/auth/login
router.post(
  "/login",
  asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      res.status(400);
      throw new Error("Please provide email and password");
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user || !(await user.matchPassword(password))) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    const token = generateToken(user._id);
    res.json({ token, user: user.toPublicJSON() });
  })
);

// @route  GET /api/auth/me
router.get(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    res.json({ user: req.user.toPublicJSON() });
  })
);

export default router;
