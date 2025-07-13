import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
  },
  aiCount: {
    type: Number,
    required: true,
    default: 1,
  },
  humanCount: {
    type: Number,
    required: true,
    default: 1,
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  scheduledAt: {
    type: Date,
    required: true,
  },
  joinCode: {
    type: String,
    required: true,
    unique: true,
  },
});

const Session = mongoose.model("Session", sessionSchema);
export default Session;
