import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";
import "./VoiceRoom.css";
import axios from "axios";

const socket = io("https://gd-platform-3.onrender.com");

function VoiceRoom() {
  const { joincode } = useParams();
  const [peers, setPeers] = useState([]);
  const [feedbackPopup, setFeedbackPopup] = useState(false);
  const [feedbackText, setFeedbackText] = useState("");
  const userAudio = useRef();
  const peersRef = useRef([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      alert("Your browser doesn't support audio or permissions are blocked.");
      return;
    }

    navigator.mediaDevices
      .getUserMedia({ video: false, audio: true })
      .then((stream) => {
        userAudio.current.srcObject = stream;

        socket.emit("join-room", joincode);

        socket.on("user-joined", (userId) => {
          const peer = createPeer(userId, socket.id, stream);
          peersRef.current.push({ peerID: userId, peer });
          setPeers((prev) => [...prev, peer]);
        });

        socket.on("signal", ({ from, data }) => {
          const item = peersRef.current.find((p) => p.peerID === from);
          if (item) {
            item.peer.signal(data);
          } else {
            const peer = addPeer(data, from, stream);
            peersRef.current.push({ peerID: from, peer });
            setPeers((prev) => [...prev, peer]);
          }
        });
      })
      .catch((err) => {
        console.error("Mic access error:", err);
        alert("Mic access is required. Please allow microphone permission.");
      });

    return () => {
      socket.disconnect();
    };
  }, [joincode]);

  // ✅ Handle exit
  const handleExit = async () => {
    peersRef.current.forEach(({ peer }) => peer.destroy());
    socket.disconnect();

    // Optionally call backend AI feedback API
    try {
      const res = await axios.get("https://gd-platform-3.onrender.com/api/feedback/latest");
      setFeedbackText(res.data?.feedback || "Thanks for participating!");
    } catch (err) {
      setFeedbackText("Thanks for participating in the GD. Feedback not available.");
    }

    setFeedbackPopup(true);

    // Redirect after 4 seconds
    setTimeout(() => {
      navigate("/dashboard");
    }, 4000);
  };

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("signal", { to: userToSignal, from: callerID, data: signal });
    });

    return peer;
  }

  function addPeer(incomingSignal, from, stream) {
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream,
    });

    peer.on("signal", (signal) => {
      socket.emit("signal", { to: from, from: socket.id, data: signal });
    });

    peer.signal(incomingSignal);
    return peer;
  }

  return (
    <div className="voice-room-container">
      <h2>🗣️ Group Discussion Room: {joincode}</h2>

      <button
        onClick={handleExit}
        style={{
          padding: "10px 16px",
          backgroundColor: "#dc2626",
          color: "white",
          border: "none",
          borderRadius: "6px",
          cursor: "pointer",
          marginBottom: "16px",
        }}
      >
        🚪 Exit Session
      </button>

      <audio ref={userAudio} autoPlay muted />
      {peers.map((peer, index) => (
        <PeerAudio key={index} peer={peer} />
      ))}

      {/* ✅ Feedback Modal */}
      {feedbackPopup && (
        <div
          style={{
            position: "fixed",
            top: "30%",
            left: "50%",
            transform: "translate(-50%, -30%)",
            background: "white",
            border: "1px solid #ccc",
            padding: "30px",
            borderRadius: "10px",
            boxShadow: "0 0 15px rgba(0,0,0,0.3)",
            zIndex: 999,
            textAlign: "center",
          }}
        >
          <h3>🤖 AI Feedback</h3>
          <p>{feedbackText}</p>
          <p style={{ marginTop: "10px", fontSize: "14px", color: "#666" }}>
            Redirecting to dashboard...
          </p>
        </div>
      )}
    </div>
  );
}

function PeerAudio({ peer }) {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", (stream) => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <audio ref={ref} autoPlay />;
}

export default VoiceRoom;
