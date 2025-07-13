import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  transcript: {
    type: String,
    required: true,
  },
  feedback: {
    type: String,
    required: true,
  },
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Session",
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Feedback", feedbackSchema);
