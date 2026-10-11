import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    topic: {
      type: String,
      required: true,
      trim: true,
    },
    aiCount: {
      type: Number,
      default: 1,
      min: 0,
      max: 4,
    },
    humanCount: {
      type: Number,
      required: true,
      default: 4,
      min: 1,
      max: 8,
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
      uppercase: true,
    },
    prompts: {
      type: [String],
      default: [],
    },
    status: {
      type: String,
      enum: ["scheduled", "live", "ended"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

const Session = mongoose.model("Session", sessionSchema);
export default Session;
