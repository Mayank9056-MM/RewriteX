import mongoose from "mongoose";

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      trim: true,
    },
    content: {
      type: String,
      required: [true, "content is required"],
    },
    source: {
      type: String,
      enum: ["beyondchats", "ai", "user"],
      required: [true, "source is required"],
      default: "user",
    },
    author: {
      type: String,
      trim: true,
      default: "Unknown",
    },
    originalArticleId: {
      type: mongoose.Types.ObjectId,
      ref: "Article",
      default: null,
    },
    publishedAt: {
      type: Date,
      default: null,
      index: true,
    },
    sourceUrl: {
      type: String,
      unique: true,
      index: true,
    },
    references: {
      type: [String],
      default: [],
    },
  },
  { timestamps: true }
);

const Article = mongoose.model("Article", articleSchema);
export default Article;
