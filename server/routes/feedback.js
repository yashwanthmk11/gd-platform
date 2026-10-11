import express from "express";
import OpenAI from "openai";
import FeedbackModel from "../models/Feedback.js";
import auth, { optionalAuth } from "../middleware/auth.js";

const router = express.Router();

function heuristicFeedback(transcript, topic) {
  const words = transcript.trim().split(/\s+/).filter(Boolean);
  const sentences = transcript.split(/[.!?]+/).filter((s) => s.trim().length > 8);
  const lengthNote =
    words.length < 40
      ? "Your contribution was brief — aim for fuller arguments with clear openings and closings."
      : words.length > 250
        ? "You covered a lot of ground. Tighten structure so each point lands cleanly."
        : "Your length was solid for a group discussion turn.";

  const structureNote =
    sentences.length >= 3
      ? "You showed reasonable structure across multiple points."
      : "Try organizing ideas into distinct points with examples.";

  const topicLine = topic
    ? `On the topic "${topic}", stay anchored to the prompt and acknowledge other views.`
    : "Stay anchored to the discussion topic and acknowledge other views.";

  return [
    "Session feedback",
    "",
    `• Clarity: ${structureNote}`,
    `• Depth: ${lengthNote}`,
    `• Focus: ${topicLine}`,
    "• Next step: Open with a one-line stance, support with one example, then invite a counterpoint.",
  ].join("\n");
}

async function generateAiFeedback(transcript, topic) {
  if (!process.env.OPENAI_API_KEY) {
    return heuristicFeedback(transcript, topic);
  }

  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      temperature: 0.6,
      max_tokens: 450,
      messages: [
        {
          role: "system",
          content:
            "You are an expert group-discussion coach. Give concise, actionable feedback on communication, structure, persuasion, and collaboration. Use short bullet points.",
        },
        {
          role: "user",
          content: `Topic: ${topic || "General group discussion"}\n\nTranscript:\n${transcript}\n\nProvide feedback for the participant.`,
        },
      ],
    });

    return (
      completion.choices?.[0]?.message?.content?.trim() ||
      heuristicFeedback(transcript, topic)
    );
  } catch (err) {
    console.error("OpenAI feedback error:", err.message);
    return heuristicFeedback(transcript, topic);
  }
}

router.post("/", optionalAuth, async (req, res) => {
  try {
    const { transcript, topic = "", sessionId = null } = req.body;

    if (!transcript?.trim()) {
      return res.status(400).json({ error: "Transcript is required" });
    }

    const feedback = await generateAiFeedback(transcript.trim(), topic);

    const newFeedback = new FeedbackModel({
      transcript: transcript.trim(),
      feedback,
      topic,
      sessionId: sessionId || null,
      userId: req.user?.id || null,
    });

    await newFeedback.save();

    res.json({ feedback, id: newFeedback._id, createdAt: newFeedback.createdAt });
  } catch (err) {
    console.error("Feedback error:", err.message);
    res.status(500).json({ error: "Failed to generate feedback" });
  }
});

router.get("/", auth, async (req, res) => {
  try {
    const feedbacks = await FeedbackModel.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(feedbacks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch feedback" });
  }
});

router.get("/latest", auth, async (req, res) => {
  try {
    const latest = await FeedbackModel.findOne({ userId: req.user.id }).sort({
      createdAt: -1,
    });
    if (!latest) {
      return res.status(404).json({ feedback: "No feedback yet. Submit a transcript after your session." });
    }
    res.json(latest);
  } catch {
    res.status(500).json({ feedback: "AI feedback not found." });
  }
});

export default router;
