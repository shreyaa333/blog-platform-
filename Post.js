import mongoose from "mongoose";
import slugify from "slugify";

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      maxlength: 150,
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    subtitle: {
      type: String,
      default: "",
      maxlength: 200,
    },

    content: {
      type: String,
      required: true,
    },

    coverImage: {
      type: String,
      default: "",
    },

    category: {
      type: String,
      default: "General",
      enum: [
        "Technology",
        "Programming",
        "AI",
        "Design",
        "Lifestyle",
        "Business",
        "General",
        "Other",
      ],
    },

    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],

    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    likes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],

    likesCount: {
      type: Number,
      default: 0,
    },

    views: {
      type: Number,
      default: 0,
    },

    readingTime: {
      type: Number,
      default: 1,
    },

    published: {
      type: Boolean,
      default: true,
    },

    featured: {
      type: Boolean,
      default: false,
    },
  },

  {
    timestamps: true,
  }
);


postSchema.index({
  title: "text",
  subtitle: "text",
  content: "text",
  tags: "text",
});


postSchema.pre("validate", function (next) {

  if (this.isNew && this.title) {
    this.slug =
      `${slugify(this.title, {
        lower: true,
        strict: true,
      })}-${Math.random()
        .toString(36)
        .slice(2,7)}`;
  }


  if(this.content){

    const cleanText = this.content
      .replace(/<[^>]+>/g," ")
      .trim();


    const words = cleanText
      ? cleanText.split(/\s+/).length
      : 0;


    this.readingTime = Math.max(
      1,
      Math.ceil(words / 200)
    );

  }


  this.likesCount = this.likes.length;


  next();

});


export default mongoose.model("Post", postSchema);