import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import JoinRoom from "./pages/JoinRoom";
import VoiceRoom from "./pages/VoiceRoom";
import Feedback from "./pages/Feedback";
import CreateSession from "./pages/CreateSession";
import Home from "./pages/Home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/join" element={<JoinRoom />} />
        <Route path="/voice/:roomId" element={<VoiceRoom />} />
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/create-session" element={<CreateSession />} />

        {/* Fallback for unknown routes */}
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
