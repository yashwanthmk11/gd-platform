import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./CreateSession.css"; // make sure this CSS exists

const CreateSession = () => {
  const navigate = useNavigate();
  const [topic, setTopic] = useState("");
  const [aiCount, setAiCount] = useState(1);
  const [humanCount, setHumanCount] = useState(1);
  const [scheduledAt, setScheduledAt] = useState(new Date().toISOString().slice(0, 16));
   // pre-filled with current datetime
  
  const handleSubmit = async (e) => {
    e.preventDefault();

    const userRaw = localStorage.getItem("user");
    console.log("🧠 Raw user from localStorage:", userRaw);

    let user;
    try {
      user = JSON.parse(userRaw);
    } catch (err) {
      alert("❌ Failed to parse user data. Please log in again.");
      return;
    }

    if (!user || !user._id) {
      alert("⚠️ User not found. Please log in again.");
      return;
    }

    console.log("✅ User ID:", user._id);

    try {
      const res = await axios.post("/api/sessions", {
        topic,
        aiCount: Number(aiCount),
        humanCount: Number(humanCount),
        createdBy: user._id,
        scheduledAt,
      });

      alert("✅ Session Created!");
      navigate(`/voice/${res.data.joinCode}`);
    } catch (err) {
      console.error("❌ Session creation failed:", err);
      alert("Session creation failed");
    }
  };

  return (
    <div className="create-session-container">
      <div className="create-session-card">
        <h2>Create GD Session</h2>
        <form onSubmit={handleSubmit}>
          <label>Topic</label>
          <input
            type="text"
            placeholder="E.g., Climate Change"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            required
          />

          <label>Number of AI Participants</label>
          <input
            type="number"
            value={aiCount}
            min="0"
            max="4"
            onChange={(e) => setAiCount(e.target.value)}
          />

          <label>Number of Human Participants</label>
          <input
            type="number"
            value={humanCount}
            min="1"
            max="4"
            onChange={(e) => setHumanCount(e.target.value)}
          />

          <label>Schedule Time</label>
          <input
            type="datetime-local"
            value={scheduledAt}
            onChange={(e) => setScheduledAt(e.target.value)}
            required
          />

          <button type="submit">Create Session</button>
        </form>
      </div>
    </div>
  );
};

export default CreateSession;
