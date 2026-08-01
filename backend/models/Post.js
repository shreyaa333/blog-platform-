import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 150 },
    slug: { type: String, required: true, unique: true, index: true },
    subtitle: { type: String, default: "", maxlength: 200 },
    content: { type: String, required: true }, // HTML/Markdown from rich text editor
    coverImage: { type: String, default: "" },
    tags: [{ type: String, trim: true, lowercase: true }],
    author: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    likes: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    likesCount: { type: Number, default: 0 },
    views: { type: Number, default: 0 },
    readingTime: { type: Number, default: 1 }, // minutes
    published: { type: Boolean, default: true },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

postSchema.index({ title: "text", subtitle: "text", content: "text", tags: "text" });

postSchema.pre("validate", function (next) {
  if (this.title && (this.isModified("title") || !this.slug)) {
    this.slug = `${slugify(this.title, { lower: true, strict: true })}-${Math.random()
      .toString(36)
      .slice(2, 7)}`;
  }
  if (this.content) {
    const words = this.content.replace(/<[^>]+>/g, " ").trim().split(/\s+/).length;
    this.readingTime = Math.max(1, Math.ceil(words / 200));
  }
  next();
});

export default mongoose.model("Post", postSchema);
