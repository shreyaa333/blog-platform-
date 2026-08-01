import express from "express";
import asyncHandler from "express-async-handler";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";
import Notification from "../models/Notification.js";
import { protect, optionalAuth } from "../middleware/auth.js";

const router = express.Router();

// @route  GET /api/posts
// Supports: ?page=1&limit=10&tag=react&author=username&search=keyword&sort=trending|latest
router.get(
  "/",
  asyncHandler(async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { published: true };
    if (req.query.tag) query.tags = req.query.tag.toLowerCase();
    if (req.query.search) query.$text = { $search: req.query.search };

    if (req.query.author) {
      const User = (await import("../models/User.js")).default;
      const authorDoc = await User.findOne({ username: req.query.author.toLowerCase() });
      if (!authorDoc) return res.json({ posts: [], total: 0, page, pages: 0 });
      query.author = authorDoc._id;
    }

    let sortOption = { createdAt: -1 };
    if (req.query.sort === "trending") sortOption = { views: -1, likesCount: -1, createdAt: -1 };
    if (req.query.sort === "most_liked") sortOption = { likesCount: -1, createdAt: -1 };

    const [posts, total] = await Promise.all([
      Post.find(query)
        .populate("author", "name username avatar")
        .sort(sortOption)
        .skip(skip)
        .limit(limit),
      Post.countDocuments(query),
    ]);

    res.json({
      posts: posts.map((p) => ({
        ...p.toObject(),
        likesCount: p.likes.length,
      })),
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  })
);

// @route  GET /api/posts/tags  -> list of distinct tags with counts
router.get(
  "/meta/tags",
  asyncHandler(async (req, res) => {
    const tags = await Post.aggregate([
      { $match: { published: true } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 30 },
    ]);
    res.json(tags.map((t) => ({ tag: t._id, count: t.count })));
  })
);

// @route  GET /api/posts/:slug
router.get(
  "/:slug",
  optionalAuth,
  asyncHandler(async (req, res) => {
    const post = await Post.findOne({ slug: req.params.slug }).populate(
      "author",
      "name username avatar bio"
    );
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    post.views += 1;
    await post.save();

    let savedByMe = false;
    if (req.user) {
      const User = (await import("../models/User.js")).default;
      const me = await User.findById(req.user._id).select("savedPosts");
      savedByMe = me.savedPosts.some((id) => id.equals(post._id));
    }

    res.json({
      ...post.toObject(),
      likesCount: post.likes.length,
      likedByMe: req.user ? post.likes.some((id) => id.equals(req.user._id)) : false,
      savedByMe,
    });
  })
);

// @route  POST /api/posts
router.post(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const { title, subtitle, content, coverImage, tags, published } = req.body;
    if (!title || !content) {
      res.status(400);
      throw new Error("Title and content are required");
    }

    const post = await Post.create({
      title,
      subtitle,
      content,
      coverImage,
      tags: Array.isArray(tags) ? tags.map((t) => t.toLowerCase().trim()) : [],
      author: req.user._id,
      published: published !== undefined ? published : true,
    });

    const populated = await post.populate("author", "name username avatar");
    res.status(201).json(populated);
  })
);

// @route  PUT /api/posts/:id
router.put(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }
    if (!post.author.equals(req.user._id)) {
      res.status(403);
      throw new Error("Not authorized to edit this post");
    }

    const { title, subtitle, content, coverImage, tags, published } = req.body;
    if (title) post.title = title;
    if (subtitle !== undefined) post.subtitle = subtitle;
    if (content) post.content = content;
    if (coverImage !== undefined) post.coverImage = coverImage;
    if (tags) post.tags = tags.map((t) => t.toLowerCase().trim());
    if (published !== undefined) post.published = published;

    await post.save();
    const populated = await post.populate("author", "name username avatar");
    res.json(populated);
  })
);

// @route  DELETE /api/posts/:id
router.delete(
  "/:id",
  protect,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }
    if (!post.author.equals(req.user._id)) {
      res.status(403);
      throw new Error("Not authorized to delete this post");
    }
    await Comment.deleteMany({ post: post._id });
    await post.deleteOne();
    res.json({ message: "Post deleted" });
  })
);

// @route  PUT /api/posts/:id/like
router.put(
  "/:id/like",
  protect,
  asyncHandler(async (req, res) => {
    const post = await Post.findById(req.params.id);
    if (!post) {
      res.status(404);
      throw new Error("Post not found");
    }

    const alreadyLiked = post.likes.some((id) => id.equals(req.user._id));
    if (alreadyLiked) {
      post.likes = post.likes.filter((id) => !id.equals(req.user._id));
    } else {
      post.likes.push(req.user._id);
      if (!post.author.equals(req.user._id)) {
        await Notification.create({
          recipient: post.author,
          sender: req.user._id,
          type: "like",
          post: post._id,
        });
      }
    }
    post.likesCount = post.likes.length;
    await post.save();
    res.json({ likesCount: post.likes.length, likedByMe: !alreadyLiked });
  })
);

// @route  PUT /api/posts/:id/save  -> bookmark/unbookmark
router.put(
  "/:id/save",
  protect,
  asyncHandler(async (req, res) => {
    const User = (await import("../models/User.js")).default;
    const user = await User.findById(req.user._id);
    const idx = user.savedPosts.findIndex((id) => id.equals(req.params.id));
    let saved;
    if (idx > -1) {
      user.savedPosts.splice(idx, 1);
      saved = false;
    } else {
      user.savedPosts.push(req.params.id);
      saved = true;
    }
    await user.save();
    res.json({ saved });
  })
);

export default router;
