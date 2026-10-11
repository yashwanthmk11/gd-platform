import express from "express";
import Session from "../models/Session.js";
import auth from "../middleware/auth.js";

const router = express.Router();

function generateJoinCode() {
  return Math.random().toString(36).slice(2, 8).toUpperCase();
}

function buildPrompts(topic, aiCount) {
  if (!aiCount || aiCount < 1) return [];

  const base = [
    `Open with a clear stance on "${topic}" in under 30 seconds.`,
    `Challenge a common assumption related to "${topic}".`,
    `Offer one data-backed or real-world example supporting your view.`,
    `Summarize opposing perspectives fairly before rebutting.`,
  ];

  return base.slice(0, Math.min(aiCount + 1, base.length));
}

router.post("/", auth, async (req, res) => {
  const { topic, aiCount = 1, humanCount = 4, scheduledAt } = req.body;

  if (!topic?.trim() || !scheduledAt) {
    return res.status(400).json({ error: "Topic and scheduled time are required" });
  }

  try {
    let joinCode = generateJoinCode();
    let attempts = 0;
    while (attempts < 5) {
      const exists = await Session.findOne({ joinCode });
      if (!exists) break;
      joinCode = generateJoinCode();
      attempts += 1;
    }

    const session = new Session({
      topic: topic.trim(),
      aiCount: Number(aiCount) || 0,
      humanCount: Number(humanCount) || 4,
      createdBy: req.user.id,
      scheduledAt: new Date(scheduledAt),
      joinCode,
      prompts: buildPrompts(topic.trim(), Number(aiCount) || 0),
      status: "scheduled",
    });

    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.error("Session creation error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
});

router.get("/mine", auth, async (req, res) => {
  try {
    const sessions = await Session.find({ createdBy: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(sessions);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch sessions" });
  }
});

router.get("/:joinCode", async (req, res) => {
  try {
    const session = await Session.findOne({
      joinCode: req.params.joinCode.toUpperCase(),
    }).populate("createdBy", "name email");

    if (!session) {
      return res.status(404).json({ error: "Session not found" });
    }

    res.json(session);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch session" });
  }
});

export default router;
