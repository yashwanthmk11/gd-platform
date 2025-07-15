// src/pages/VoiceRoom.js
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";
import "./VoiceRoom.css"; // make sure this CSS exists
const socket = io("https://gd-platform-3.onrender.com"); // ✅ Replace with your server if deployed

function VoiceRoom() {
  const { roomId } = useParams();
  const [peers, setPeers] = useState([]);
  const userAudio = useRef();
  const peersRef = useRef([]);

  useEffect(() => {
    // 👂 Ask mic permission and join room
    navigator.mediaDevices.getUserMedia({ video: false, audio: true }).then((stream) => {
      userAudio.current.srcObject = stream;

      socket.emit("join-room", roomId);

      socket.on("user-joined", (userId) => {
        const peer = createPeer(userId, socket.id, stream);
        peersRef.current.push({ peerID: userId, peer });
        setPeers((prev) => [...prev, peer]);
      });

      socket.on("signal", ({ from, data }) => {
        const item = peersRef.current.find(p => p.peerID === from);
        if (item) {
          item.peer.signal(data);
        } else {
          const peer = addPeer(data, from, stream);
          peersRef.current.push({ peerID: from, peer });
          setPeers((prev) => [...prev, peer]);
        }
      });
    });
  }, [roomId]);

  function createPeer(userToSignal, callerID, stream) {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream,
    });

    peer.on("signal", signal => {
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

    peer.on("signal", signal => {
      socket.emit("signal", { to: from, from: socket.id, data: signal });
    });

    peer.signal(incomingSignal);

    return peer;
  }

  return (
    <div>
      <h2>🗣️ Group Discussion Room: {roomId}</h2>
      <audio ref={userAudio} autoPlay muted />
      {peers.map((peer, index) => (
        <PeerAudio key={index} peer={peer} />
      ))}
    </div>
  );
}

// Component to render each peer's audio
function PeerAudio({ peer }) {
  const ref = useRef();

  useEffect(() => {
    peer.on("stream", stream => {
      ref.current.srcObject = stream;
    });
  }, [peer]);

  return <audio ref={ref} autoPlay />;
}

export default VoiceRoom;
