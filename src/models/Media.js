import mongoose from "mongoose";

const mediaSchema = new mongoose.Schema(
  {
    fileName: { type: String, required: true },
    fileType: { type: String, required: true }, // "image" | "pdf" | "doc" etc.
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    url: { type: String, required: true },
    publicId: { type: String, required: true }, // Cloudinary public_id, needed for delete/replace
    resourceType: { type: String, required: true }, // Cloudinary resource_type ("image" | "raw"), needed to destroy the right asset
    hash: { type: String, required: true, index: true }, // md5, for duplicate detection
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },
    uploadedAt: { type: Date, default: Date.now },
    usedIn: [
      {
        refType: { type: String }, // "Post" | "Service" | "Page"
        refId: { type: mongoose.Schema.Types.ObjectId },
      },
    ],
  },
  { timestamps: true }
);

export default mongoose.models.Media || mongoose.model("Media", mediaSchema);
