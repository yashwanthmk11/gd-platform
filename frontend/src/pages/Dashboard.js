import React, { useEffect, useState } from "react";
import axios from "axios";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import "./Dashboard.css";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const [feedbacks, setFeedbacks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const res = await axios.get("https://gd-platform-3.onrender.com/api/feedback");
        setFeedbacks(res.data);
      } catch (err) {
        console.error("❌ Failed to fetch feedbacks");
      }
    };
    fetchFeedbacks();
  }, []);

  const exportToPDF = async (feedback, index) => {
    const input = document.getElementById(`feedback-${index}`);
    if (!input) return alert("❌ Element not found");

    const canvas = await html2canvas(input);
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`AI_Feedback_${index + 1}.pdf`);
  };

  return (
    <div className="dashboard-container">
      <h2>📊 AI Feedback History</h2>

      {/* 🔘 Action Buttons */}
      <div style={{ display: "flex", gap: "1rem", margin: "1.5rem 0" }}>
        <button
          onClick={() => navigate("/create-session")}
          style={{
            padding: "10px 16px",
            backgroundColor: "#2563eb",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          ➕ Create New GD Session
        </button>

        <button
          onClick={() => navigate("/join")}
          style={{
            padding: "10px 16px",
            backgroundColor: "#22c55e",
            color: "white",
            border: "none",
            borderRadius: "6px",
            cursor: "pointer",
          }}
        >
          🔗 Join GD Session
        </button>
      </div>

      {/* 🧠 Feedbacks */}
      {feedbacks.length === 0 ? (
        <p className="no-feedback" style={{ color: "#555" }}>
          No feedbacks yet. Start or join a session to view insights here!
        </p>
      ) : (
        feedbacks.map((feedback, index) => (
          <div className="feedback-card" key={index} id={`feedback-${index}`}>
            <div className="feedback-header">
              <span className="feedback-date">
                🗓️ {new Date(feedback.createdAt).toLocaleString()}
              </span>
              <button onClick={() => exportToPDF(feedback, index)}>📥 Download PDF</button>
            </div>
            <p><strong>🎤 Transcript:</strong> {feedback.transcript}</p>
            <p><strong>🤖 AI Feedback:</strong> {feedback.feedback}</p>
          </div>
        ))
      )}
    </div>
  );
}

export default Dashboard;
