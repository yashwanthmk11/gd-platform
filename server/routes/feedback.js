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
// /routes/feedback.js
router.get("/latest", async (req, res) => {
  try {
    const latest = await Feedback.findOne().sort({ createdAt: -1 }).limit(1);
    res.json(latest);
  } catch {
    res.status(500).json({ feedback: "AI feedback not found." });
  }
});



export default router;
