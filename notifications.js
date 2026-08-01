import express from "express";
import asyncHandler from "express-async-handler";
import Notification from "../models/Notification.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

// @route  GET /api/notifications
router.get(
  "/",
  protect,
  asyncHandler(async (req, res) => {
    const notifications = await Notification.find({ recipient: req.user._id })
      .populate("sender", "name username avatar")
      .populate("post", "title slug")
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(notifications);
  })
);

// @route  GET /api/notifications/unread-count
router.get(
  "/unread-count",
  protect,
  asyncHandler(async (req, res) => {
    const count = await Notification.countDocuments({ recipient: req.user._id, read: false });
    res.json({ count });
  })
);

// @route  PUT /api/notifications/:id/read
router.put(
  "/:id/read",
  protect,
  asyncHandler(async (req, res) => {
    const notification = await Notification.findOne({ _id: req.params.id, recipient: req.user._id });
    if (!notification) {
      res.status(404);
      throw new Error("Notification not found");
    }
    notification.read = true;
    await notification.save();
    res.json(notification);
  })
);

// @route  PUT /api/notifications/read-all
router.put(
  "/read-all",
  protect,
  asyncHandler(async (req, res) => {
    await Notification.updateMany({ recipient: req.user._id, read: false }, { read: true });
    res.json({ message: "All notifications marked as read" });
  })
);

export default router;
