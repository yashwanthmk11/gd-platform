import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Register from "./pages/Register";
import JoinRoom from "./pages/JoinRoom";
import VoiceRoom from "./pages/VideoRoom";
import Feedback from "./pages/Feedback";
import CreateSession from "./pages/CreateSession";
import Home from "./pages/Home";
import Footer from "./pages/Footer"; // ✅ Imported

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <div className="flex-grow">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/join" element={<JoinRoom />} />
            <Route path="/voice/:joincode" element={<VoiceRoom />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/create-session" element={<CreateSession />} />
            <Route path="*" element={<Home />} />
          </Routes>
        </div>
        
        <div className="app-container">
  <main className="main-content">
    {/* Your page content goes here */}
  </main>
  <footer className="footer">
    © 2025 Health Tracking App. Built with ❤️ by <a href="https://github.com/yashwanthmk11" target="_blank" rel="noopener noreferrer">Yashwanth M K</a>
  </footer>
</div>

      </div>
    </Router>
  );
}

export default App;
