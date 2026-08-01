import express from "express";
import asyncHandler from "express-async-handler";
import Comment from "../models/Comment.js";
import Post from "../models/Post.js";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route  GET /api/comments/:postId
router.get(
  "/:postId",
  asyncHandler(async (req, res) => {
    const comments = await Comment.find({ post: req.params.postId })
      .populate("author", "name username avatar")
      .sort({ createdAt: -1 });
    res.json(comments);
  })
);

// @route  POST /api/comments/:postId
router.post(
  "/:postId",
  protect,
  asyncHandler(async (req, res) => {
    const { content, parentComment } = req.body;
    if (!content?.trim()) {
      res.status(400);
      throw new Error("Comment cannot be empty");
    }

    const post = await Post.findById(req.params.postId);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const comment = await Comment.create({
      post: post._id,
      author: req.user._id,
      content: content.trim(),
      parentComment: parentComment || null,
    });

    if (!post.author.equals(req.user._id)) {
      await Notification.create({
        recipient: post.author,
        sender: req.user._id,
        type: "comment",
        post: post._id,
        comment: comment._id,
      });
    }

    const populated = await comment.populate("author", "name username avatar");
    res.status(201).json(populated);
  })
);

// @route  DELETE /api/comments/:id
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }
    if (!comment.author.equals(req.user._id)) {
      res.status(403);
      throw new Error("Not authorized to delete this comment");
    }
    await comment.deleteOne();
    res.json({ message: "Comment deleted" });
  })
);

// @route  PUT /api/comments/:id/like
router.put(
  "/:id/like",
  protect,
  asyncHandler(async (req, res) => {
    const comment = await Comment.findById(req.params.id);
    if (!comment) {
      res.status(404);
      throw new Error("Comment not found");
    }
    const already = comment.likes.some((id) => id.equals(req.user._id));
    if (already) {
      comment.likes = comment.likes.filter((id) => !id.equals(req.user._id));
    } else {
      comment.likes.push(req.user._id);
    }
    await comment.save();
    res.json({ likesCount: comment.likes.length, likedByMe: !already });
  })
);

export default router;
