import express from "express";
const router = express.Router();
import FeedbackModel from "../models/Feedback.js";

router.post("/", async (req, res) => {
  try {
    const { transcript } = req.body;

    if (!transcript) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    // 🔥 MOCK FEEDBACK instead of OpenAI
    const feedback = "You spoke confidently. Try to improve structure and support your points better.";

    const newFeedback = new FeedbackModel({
      transcript,
      feedback,
      sessionId: null,
      userId: null,
    });

    await newFeedback.save();

    res.json({ feedback }); // ✅ return this
  } catch (err) {
    console.error("🔥 Feedback error:", err.message);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});
// GET /api/feedback - Get all feedbacks
router.get("/", async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error("🔥 Failed to fetch feedbacks:", err.message);
    res.status(500).json({ error: "Failed to fetch feedbacks" });
  }
});


export default router;
