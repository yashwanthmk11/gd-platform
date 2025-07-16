import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import JoinRoom from "./pages/JoinRoom";
import VoiceRoom from "./pages/VideoRoom"; // ✅ Corrected import name
import "./App.css"; // Ensure this file exists for styling
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
        <Route path="/voice/:joincode" element={<VoiceRoom />} /> {/* ✅ Corrected */}
        <Route path="/feedback" element={<Feedback />} />
        <Route path="/create-session" element={<CreateSession />} />
        <Route path="*" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
