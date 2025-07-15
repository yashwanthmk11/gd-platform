import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div style={styles.container}>
      <h1>Welcome to the GD Practice Platform 🧠</h1>
      <p>AI + Human powered voice-based group discussion sessions.</p>
      <div>
        <button style={styles.button} onClick={() => navigate("/login")}>Login</button>
        <button style={{ ...styles.button, background: "#10b981" }} onClick={() => navigate("/register")}>Register</button>
      </div>
    </div>
  );
};

const styles = {
  container: {
    textAlign: "center",
    padding: "4rem",
    background: "#f3f4f6",
    minHeight: "100vh"
  },
  button: {
    margin: "1rem",
    padding: "10px 20px",
    fontSize: "16px",
    borderRadius: "8px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  }
};

export default Home;
