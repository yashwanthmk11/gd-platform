import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/config";
import "./JoinRoom.css";

export default function JoinRoom() {
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = joinCode.trim().toUpperCase();
    if (code.length !== 6) {
      setError("Join code must be 6 characters.");
      return;
    }

    setError("");
    setLoading(true);
    try {
      await api.get(`/api/sessions/${code}`);
      navigate(`/voice/${code}`);
    } catch (err) {
      setError(err.response?.data?.error || "Session not found. Check the code and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page page-narrow join-page">
      <div className="panel join-card">
        <p className="eyebrow">Join</p>
        <h1>Enter a room</h1>
        <p className="page-sub">Ask the host for the 6-character code, then jump into the discussion.</p>
        <form className="form-stack" onSubmit={handleSubmit}>
          {error && <p className="form-error">{error}</p>}
          <label>
            Join code
            <input
              type="text"
              placeholder="ABC123"
              value={joinCode}
              maxLength={6}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              required
            />
          </label>
          <button className="btn btn-primary btn-block" type="submit" disabled={loading}>
            {loading ? "Checking…" : "Join room"}
          </button>
        </form>
      </div>
    </div>
  );
}
