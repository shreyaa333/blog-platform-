import express from "express";
import asyncHandler from "express-async-handler";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route  GET /api/users/:username
router.get(
  "/:username",
  asyncHandler(async (req, res) => {
    const user = await User.findOne({ username: req.params.username.toLowerCase() });
    if (!user) {
      res.status(404);
      throw new Error("User not found");
    }
    res.json(user.toPublicJSON());
  })
);

// @route  PUT /api/users/me
router.put(
  "/me",
  protect,
  asyncHandler(async (req, res) => {
    const { name, bio, avatar, coverImage, website } = req.body;
    const user = await User.findById(req.user._id);
    if (name !== undefined) user.name = name;
    if (bio !== undefined) user.bio = bio;
    if (avatar !== undefined) user.avatar = avatar;
    if (coverImage !== undefined) user.coverImage = coverImage;
    if (website !== undefined) user.website = website;
    await user.save();
    res.json(user.toPublicJSON());
  })
);

// @route  PUT /api/users/:id/follow
router.put(
  "/:id/follow",
  protect,
  asyncHandler(async (req, res) => {
    if (req.params.id === String(req.user._id)) {
      res.status(400);
      throw new Error("You cannot follow yourself");
    }
    const target = await User.findById(req.params.id);
    if (!target) {
      res.status(404);
      throw new Error("User not found");
    }

    const me = await User.findById(req.user._id);
    const alreadyFollowing = me.following.some((id) => id.equals(target._id));

    if (alreadyFollowing) {
      me.following = me.following.filter((id) => !id.equals(target._id));
      target.followers = target.followers.filter((id) => !id.equals(me._id));
    } else {
      me.following.push(target._id);
      target.followers.push(me._id);
      await Notification.create({
        recipient: target._id,
        sender: me._id,
        type: "follow",
      });
    }

    await me.save();
    await target.save();

    res.json({ following: !alreadyFollowing, followersCount: target.followers.length });
  })
);

// @route  GET /api/users/me/saved
router.get(
  "/me/saved",
  protect,
  asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id).populate({
      path: "savedPosts",
      populate: { path: "author", select: "name username avatar" },
    });
    res.json(user.savedPosts);
  })
);

export default router;
