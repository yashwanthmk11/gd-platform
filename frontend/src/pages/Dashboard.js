import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import api from "../api/config";
import { useAuth } from "../context/AuthContext";
import "./Dashboard.css";

export default function Dashboard() {
  const { user } = useAuth();
  const [feedbacks, setFeedbacks] = useState([]);
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [fbRes, sessRes] = await Promise.all([
          api.get("/api/feedback"),
          api.get("/api/sessions/mine"),
        ]);
        if (!cancelled) {
          setFeedbacks(fbRes.data || []);
          setSessions(sessRes.data || []);
        }
      } catch (err) {
        console.error("Dashboard load failed", err);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const exportToPDF = async (index) => {
    const input = document.getElementById(`feedback-${index}`);
    if (!input) return;

    const canvas = await html2canvas(input, { scale: 2, backgroundColor: "#ffffff" });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF();
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`Podium_Feedback_${index + 1}.pdf`);
  };

  const copyCode = async (code) => {
    try {
      await navigator.clipboard.writeText(code);
    } catch {
      // ignore
    }
  };

  return (
    <div className="page dashboard">
      <header className="dash-header">
        <div>
          <p className="dash-kicker">Workspace</p>
          <h1 className="page-title">Hello, {user?.name?.split(" ")[0] || "there"}</h1>
          <p className="page-sub">Host a room, join with a code, and review coaching from past sessions.</p>
        </div>
        <div className="dash-actions">
          <Link to="/create-session" className="btn btn-primary">
            Create session
          </Link>
          <Link to="/join" className="btn btn-ghost">
            Join room
          </Link>
        </div>
      </header>

      <section className="dash-section">
        <div className="section-head">
          <h2>Your sessions</h2>
          <Link to="/create-session">New</Link>
        </div>
        {loading ? (
          <p className="empty-note">Loading sessions…</p>
        ) : sessions.length === 0 ? (
          <div className="empty-panel panel">
            <p>No sessions yet. Create one and share the join code with your group.</p>
            <Link to="/create-session" className="btn btn-primary btn-sm">
              Create session
            </Link>
          </div>
        ) : (
          <div className="session-grid">
            {sessions.map((session) => (
              <article className="panel session-card" key={session._id}>
                <h3>{session.topic}</h3>
                <p className="meta">
                  {new Date(session.scheduledAt).toLocaleString()} · up to {session.humanCount} people
                </p>
                <div className="code-row">
                  <code>{session.joinCode}</code>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => copyCode(session.joinCode)}>
                    Copy
                  </button>
                  <Link to={`/voice/${session.joinCode}`} className="btn btn-primary btn-sm">
                    Enter
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      <section className="dash-section">
        <div className="section-head">
          <h2>AI feedback history</h2>
          <Link to="/feedback">Generate</Link>
        </div>
        {loading ? (
          <p className="empty-note">Loading feedback…</p>
        ) : feedbacks.length === 0 ? (
          <div className="empty-panel panel">
            <p>No feedback yet. After a session, paste your transcript to get coaching notes.</p>
            <Link to="/feedback" className="btn btn-accent btn-sm">
              Open feedback
            </Link>
          </div>
        ) : (
          <div className="feedback-list">
            {feedbacks.map((feedback, index) => (
              <article className="panel feedback-card" key={feedback._id || index} id={`feedback-${index}`}>
                <div className="feedback-header">
                  <div>
                    <p className="feedback-date">{new Date(feedback.createdAt).toLocaleString()}</p>
                    {feedback.topic && <p className="feedback-topic">{feedback.topic}</p>}
                  </div>
                  <button type="button" className="btn btn-ghost btn-sm" onClick={() => exportToPDF(index)}>
                    Download PDF
                  </button>
                </div>
                <div className="feedback-body">
                  <h4>Transcript</h4>
                  <p>{feedback.transcript}</p>
                  <h4>Coaching</h4>
                  <pre>{feedback.feedback}</pre>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
