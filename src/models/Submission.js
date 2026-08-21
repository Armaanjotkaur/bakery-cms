import mongoose from "mongoose";

const submissionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    message: { type: String, required: true },
    isRead: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Submission || mongoose.model("Submission", submissionSchema);
