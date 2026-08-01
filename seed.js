// Populates the database with a few demo users and posts.
// Run with: npm run seed   (make sure MONGO_URI is set in .env first)
import dotenv from "dotenv";
import connectDB from "../config/db.js";
import User from "../models/User.js";
import Post from "../models/Post.js";
import Comment from "../models/Comment.js";

dotenv.config();
await connectDB();

const run = async () => {
  await Promise.all([User.deleteMany(), Post.deleteMany(), Comment.deleteMany()]);

  const users = await User.create([
    {
      name: "Ava Chen",
      username: "avachen",
      email: "ava@example.com",
      password: "password123",
      bio: "Frontend engineer. Writing about React, design systems, and CSS.",
      avatar: "https://i.pravatar.cc/150?img=47",
    },
    {
      name: "Marcus Reed",
      username: "marcusreed",
      email: "marcus@example.com",
      password: "password123",
      bio: "Backend & infra. Distributed systems, Go, and databases.",
      avatar: "https://i.pravatar.cc/150?img=12",
    },
    {
      name: "Priya Nair",
      username: "priyanair",
      email: "priya@example.com",
      password: "password123",
      bio: "Product designer sharing notes on UX and creative process.",
      avatar: "https://i.pravatar.cc/150?img=32",
    },
  ]);

  const posts = await Post.create([
    {
      title: "Why I Stopped Using CSS-in-JS",
      subtitle: "A year with utility-first CSS changed how I think about styling.",
      content: `<p>For a long time I believed CSS-in-JS was the endgame for styling React apps...</p><p>Then I spent six months on a utility-first codebase and something clicked.</p><h2>The runtime cost nobody talks about</h2><p>Every CSS-in-JS library has to do work in the browser...</p><h2>What changed my mind</h2><p>Once the class names stopped feeling ugly, the workflow became faster than anything I'd used before.</p>`,
      coverImage: "https://images.unsplash.com/photo-1517180102446-f3ece451e9d8?w=1200",
      tags: ["css", "react", "frontend"],
      author: users[0]._id,
      views: 482,
      featured: true,
    },
    {
      title: "Designing APIs That Don't Make You Cry",
      subtitle: "Lessons from ten years of building backend systems.",
      content: `<p>Good API design is mostly about empathy for the person calling it at 2am during an incident.</p><h2>Consistency beats cleverness</h2><p>Pick a convention and never break it.</p><h2>Errors are a feature</h2><p>A clear error message saves hours of debugging.</p>`,
      coverImage: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=1200",
      tags: ["backend", "api", "engineering"],
      author: users[1]._id,
      views: 731,
      featured: true,
    },
    {
      title: "The Case for Boring Design",
      subtitle: "Novelty is not the same as quality.",
      content: `<p>Every designer wants to ship something that feels new. But most of the best products are quietly boring.</p><h2>Familiar patterns reduce cognitive load</h2><p>Users don't want to learn your interface, they want to use it.</p>`,
      coverImage: "https://images.unsplash.com/photo-1541462608143-67571c6738dd?w=1200",
      tags: ["design", "ux", "product"],
      author: users[2]._id,
      views: 305,
    },
    {
      title: "A Practical Guide to Database Indexing",
      subtitle: "Stop guessing. Start measuring.",
      content: `<p>Indexes are the single highest-leverage tool for query performance, and also the most misunderstood.</p><h2>When an index helps</h2><p>Selective columns used in WHERE, JOIN, and ORDER BY clauses benefit most.</p><h2>When it hurts</h2><p>Every index slows down writes. Don't index everything.</p>`,
      coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=1200",
      tags: ["database", "backend", "performance"],
      author: users[1]._id,
      views: 210,
    },
    {
      title: "How I Structure a New React Project in 2026",
      subtitle: "Folders, conventions, and tools that scale past a weekend project.",
      content: `<p>Every new project starts with the same ten decisions. Here's what I reach for by default.</p><h2>File structure</h2><p>Feature folders over type folders, every time.</p>`,
      coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=1200",
      tags: ["react", "javascript", "frontend"],
      author: users[0]._id,
      views: 158,
    },
  ]);

  await Comment.create([
    { post: posts[0]._id, author: users[1]._id, content: "This matches my experience exactly. Great writeup!" },
    { post: posts[0]._id, author: users[2]._id, content: "Curious what your build times looked like before/after." },
    { post: posts[1]._id, author: users[0]._id, content: "The point about errors as a feature is so underrated." },
  ]);

  console.log("Seed complete:");
  console.log(`  Users: ${users.length}`);
  console.log(`  Posts: ${posts.length}`);
  console.log("\nDemo login: ava@example.com / password123");
  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
