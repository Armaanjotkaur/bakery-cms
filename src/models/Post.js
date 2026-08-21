import mongoose from "mongoose";

const postSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    content: { type: String, required: true }, // HTML from the rich text editor
    coverImage: { type: mongoose.Schema.Types.ObjectId, ref: "Media" },
    status: { type: String, enum: ["draft", "published"], default: "draft" },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

export default mongoose.models.Post || mongoose.model("Post", postSchema);
