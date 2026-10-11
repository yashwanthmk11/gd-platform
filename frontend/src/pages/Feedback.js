import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../api/config";
import "./Feedback.css";

export default function Feedback() {
  const location = useLocation();
  const presetTopic = location.state?.topic || "";
  const sessionId = location.state?.sessionId || null;

  const [topic, setTopic] = useState(presetTopic);
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");
    setError("");

    try {
      const res = await api.post("/api/feedback", {
        transcript,
        topic,
        sessionId,
      });
      setFeedback(res.data.feedback);
    } catch (err) {
      setError(err.response?.data?.error || "Failed to get feedback. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-narrow feedback-page">
      <div className="panel feedback-panel">
        <p className="eyebrow">Coaching</p>
        <h1>AI feedback</h1>
        <p className="page-sub">
          Paste what you said in the discussion. Podium returns actionable notes on clarity,
          structure, and persuasion.
        </p>

        <form className="form-stack" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          <label>
            Topic
            <input
              type="text"
              placeholder="Discussion topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
            />
          </label>
          <label>
            Your transcript
            <textarea
              rows={8}
              placeholder="Paste your speaking notes or transcript…"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              required
            />
          </label>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Generating…" : "Get feedback"}
          </button>
        </form>

        {feedback && (
          <div className="feedback-result">
            <h2>Your coaching notes</h2>
            <pre>{feedback}</pre>
            <Link to="/dashboard" className="btn btn-ghost btn-sm">
              View history
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
