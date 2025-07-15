import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
 import "./JoinRoom.css"; // make sure this CSS exists
const JoinRoom = () => {
  const [joinCode, setJoinCode] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (joinCode.trim().length !== 6) {
      alert("Join code must be 6 characters");
      return;
    }
    navigate(`/voice/${joinCode.trim().toUpperCase()}`);
  };

  return (
    <div className="join-room-container">
      <div className="join-room-card">
        <h2>Join a GD Session</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Enter 6-letter join code"
            value={joinCode}
            maxLength={6}
            onChange={(e) => setJoinCode(e.target.value)}
            required
          />
          <button type="submit">Join Room</button>
        </form>
      </div>
    </div>
  );
};

export default JoinRoom;
