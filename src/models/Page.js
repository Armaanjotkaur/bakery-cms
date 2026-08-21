import mongoose from "mongoose";

const pageSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    sections: [
      {
        heading: { type: String },
        body: { type: String },
        image: { type: mongoose.Schema.Types.ObjectId, ref: "Media" },
      },
    ],
    status: { type: String, enum: ["draft", "published"], default: "draft" },
  },
  { timestamps: true }
);

export default mongoose.models.Page || mongoose.model("Page", pageSchema);
