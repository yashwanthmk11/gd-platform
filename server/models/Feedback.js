import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
  {
    transcript: {
      type: String,
      required: true,
    },
    feedback: {
      type: String,
      required: true,
    },
    topic: {
      type: String,
      default: "",
    },
    sessionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Session",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Feedback", feedbackSchema);
