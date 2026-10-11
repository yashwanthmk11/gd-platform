import React from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import "./Home.css";

export default function Home() {
  const { isAuthenticated } = useAuth();

  return (
    <section className="hero">
      <div className="hero-copy">
        <p className="hero-brand">Podium</p>
        <h1>Practice group discussions that feel like the real room.</h1>
        <p className="hero-lede">
          Create a session, invite peers with a join code, and leave with clear coaching on how you
          spoke.
        </p>
        <div className="hero-actions">
          {isAuthenticated ? (
            <>
              <Link to="/create-session" className="btn btn-primary">
                Create a session
              </Link>
              <Link to="/dashboard" className="btn btn-ghost">
                Open dashboard
              </Link>
            </>
          ) : (
            <>
              <Link to="/register" className="btn btn-primary">
                Start practicing
              </Link>
              <Link to="/login" className="btn btn-ghost">
                Log in
              </Link>
            </>
          )}
        </div>
      </div>

      <div className="hero-visual" aria-hidden="true">
        <div className="hero-stage">
          <div className="hero-ring hero-ring-a" />
          <div className="hero-ring hero-ring-b" />
          <div className="hero-seat hero-seat-1" />
          <div className="hero-seat hero-seat-2" />
          <div className="hero-seat hero-seat-3" />
          <div className="hero-seat hero-seat-4" />
          <div className="hero-center">
            <span>Live room</span>
          </div>
        </div>
      </div>
    </section>
  );
}
