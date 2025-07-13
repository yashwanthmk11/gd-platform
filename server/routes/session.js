import express from "express";
import Session from "../models/Session.js";

const router = express.Router();

router.post("/", async (req, res) => {
  const { topic, aiCount, humanCount, createdBy, scheduledAt } = req.body;

  console.log("🧾 Request Body:", req.body);

  if (!topic || !createdBy || !scheduledAt) {
    return res.status(400).json({ error: "Missing topic, createdBy, or scheduledAt field" });
  }

  const joinCode = Math.random().toString(36).substr(2, 6).toUpperCase();

  try {
    const session = new Session({
      topic,
      aiCount,
      humanCount,
      createdBy,
      scheduledAt,
      joinCode,
    });

    await session.save();
    res.status(201).json(session);
  } catch (err) {
    console.error("❌ Session creation error:", err);
    res.status(500).json({ error: "Failed to create session" });
  }
});


export default router;
