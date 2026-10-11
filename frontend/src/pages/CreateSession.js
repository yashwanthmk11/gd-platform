import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/config";
import "./CreateSession.css";

export default function CreateSession() {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [aiCount, setAiCount] = useState(2);
  const [humanCount, setHumanCount] = useState(4);
  const [scheduledAt, setScheduledAt] = useState(() =>
    new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16)
  );
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await api.post("/api/sessions", {
        topic,
        aiCount: Number(aiCount),
        humanCount: Number(humanCount),
        scheduledAt,
      });
      setCreated(res.data);
    } catch (err) {
      setError(err.response?.data?.error || "Session creation failed");
    } finally {
      setLoading(false);
    }
  };

  const copyCode = async () => {
    if (!created?.joinCode) return;
    try {
      await navigator.clipboard.writeText(created.joinCode);
    } catch {
      // ignore
    }
  };

  if (created) {
    return (
      <div className="page page-narrow create-page">
        <div className="panel create-card success-card">
          <p className="eyebrow">Session ready</p>
          <h1>Share this join code</h1>
          <p className="page-sub">{created.topic}</p>
          <div className="join-code-display">{created.joinCode}</div>
          <div className="create-actions">
            <button type="button" className="btn btn-ghost" onClick={copyCode}>
              Copy code
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={() => navigate(`/voice/${created.joinCode}`)}
            >
              Enter room
            </button>
          </div>
          <Link className="back-link" to="/dashboard">
            Back to dashboard
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="page page-narrow create-page">
      <div className="panel create-card">
        <p className="eyebrow">Host</p>
        <h1>Create a GD session</h1>
        <p className="page-sub">Set the topic, room size, and coaching prompts for your group.</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          <label>
            Topic
            <input
              type="text"
              placeholder="e.g. Should remote work be the default?"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              required
            />
          </label>
          <label>
            Coaching prompts
            <input
              type="number"
              min="0"
              max="4"
              value={aiCount}
              onChange={(e) => setAiCount(e.target.value)}
            />
            <span className="field-hint">AI discussion cues shown in the room (0–4).</span>
          </label>
          <label>
            Max participants
            <input
              type="number"
              min="1"
              max="8"
              value={humanCount}
              onChange={(e) => setHumanCount(e.target.value)}
            />
          </label>
          <label>
            Schedule
            <input
              type="datetime-local"
              value={scheduledAt}
              onChange={(e) => setScheduledAt(e.target.value)}
              required
            />
          </label>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Creating…" : "Create session"}
          </button>
        </form>
      </div>
    </div>
  );
}
