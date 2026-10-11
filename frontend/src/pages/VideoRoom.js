import React, { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import io from "socket.io-client";
import Peer from "simple-peer";
import api, { API_BASE_URL } from "../api/config";
import "./VideoRoom.css";

function PeerVideo({ peer, peerID }) {
  const ref = useRef();

  useEffect(() => {
    const onStream = (stream) => {
      if (ref.current) ref.current.srcObject = stream;
    };
    peer.on("stream", onStream);
    return () => {
      peer.off?.("stream", onStream);
    };
  }, [peer]);

  return (
    <div className="tile">
      <video ref={ref} autoPlay playsInline />
      <span className="tile-label">Peer {peerID.slice(0, 4)}</span>
    </div>
  );
}

export default function VoiceRoom() {
  const { joincode } = useParams();
  const navigate = useNavigate();
  const [peers, setPeers] = useState([]);
  const [session, setSession] = useState(null);
  const [sessionError, setSessionError] = useState("");
  const [muted, setMuted] = useState(false);
  const [cameraOff, setCameraOff] = useState(false);
  const [mediaError, setMediaError] = useState("");
  const [leaving, setLeaving] = useState(false);

  const userVideo = useRef(null);
  const streamRef = useRef(null);
  const socketRef = useRef(null);
  const peersRef = useRef([]);

  const syncPeers = useCallback(() => {
    setPeers([...peersRef.current]);
  }, []);

  const removePeer = useCallback((id) => {
    const item = peersRef.current.find((p) => p.peerID === id);
    if (item) {
      try {
        item.peer.destroy();
      } catch {
        // ignore
      }
    }
    peersRef.current = peersRef.current.filter((p) => p.peerID !== id);
    syncPeers();
  }, [syncPeers]);

  useEffect(() => {
    let cancelled = false;

    async function loadSession() {
      try {
        const res = await api.get(`/api/sessions/${joincode}`);
        if (!cancelled) setSession(res.data);
      } catch (err) {
        if (!cancelled) {
          setSessionError(err.response?.data?.error || "Session not found");
        }
      }
    }

    loadSession();
    return () => {
      cancelled = true;
    };
  }, [joincode]);

  useEffect(() => {
    if (sessionError || !joincode) return undefined;

    if (!navigator.mediaDevices?.getUserMedia) {
      setMediaError("Your browser does not support camera/microphone access.");
      return undefined;
    }

    const socket = io(API_BASE_URL, { transports: ["websocket", "polling"] });
    socketRef.current = socket;

    const createPeer = (userToSignal, callerID, stream) => {
      const peer = new Peer({ initiator: true, trickle: false, stream });
      peer.on("signal", (signal) => {
        socket.emit("signal", { to: userToSignal, from: callerID, data: signal });
      });
      return peer;
    };

    const addPeer = (incomingSignal, from, stream) => {
      const peer = new Peer({ initiator: false, trickle: false, stream });
      peer.on("signal", (signal) => {
        socket.emit("signal", { to: from, from: socket.id, data: signal });
      });
      peer.signal(incomingSignal);
      return peer;
    };

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        streamRef.current = stream;
        if (userVideo.current) userVideo.current.srcObject = stream;

        socket.emit("join-room", joincode);

        socket.on("user-joined", (userId) => {
          if (peersRef.current.some((p) => p.peerID === userId)) return;
          const peer = createPeer(userId, socket.id, stream);
          peersRef.current.push({ peerID: userId, peer });
          syncPeers();
        });

        socket.on("signal", ({ from, data }) => {
          const item = peersRef.current.find((p) => p.peerID === from);
          if (item) {
            item.peer.signal(data);
          } else {
            const peer = addPeer(data, from, stream);
            peersRef.current.push({ peerID: from, peer });
            syncPeers();
          }
        });

        socket.on("user-left", (userId) => {
          removePeer(userId);
        });
      })
      .catch(() => {
        setMediaError("Camera and microphone permission is required to join the room.");
      });

    return () => {
      peersRef.current.forEach(({ peer }) => {
        try {
          peer.destroy();
        } catch {
          // ignore
        }
      });
      peersRef.current = [];
      streamRef.current?.getTracks().forEach((track) => track.stop());
      socket.disconnect();
    };
  }, [joincode, sessionError, removePeer, syncPeers]);

  const toggleMute = () => {
    const track = streamRef.current?.getAudioTracks()?.[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setMuted(!track.enabled);
  };

  const toggleCamera = () => {
    const track = streamRef.current?.getVideoTracks()?.[0];
    if (!track) return;
    track.enabled = !track.enabled;
    setCameraOff(!track.enabled);
  };

  const handleExit = () => {
    setLeaving(true);
    peersRef.current.forEach(({ peer }) => {
      try {
        peer.destroy();
      } catch {
        // ignore
      }
    });
    streamRef.current?.getTracks().forEach((track) => track.stop());
    socketRef.current?.disconnect();
    navigate("/feedback", {
      state: {
        topic: session?.topic || "",
        joinCode: joincode,
        sessionId: session?._id,
      },
    });
  };

  if (sessionError) {
    return (
      <div className="page page-narrow">
        <div className="panel room-error">
          <h1>Room unavailable</h1>
          <p>{sessionError}</p>
          <Link to="/join" className="btn btn-primary">
            Try another code
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="room">
      <header className="room-top">
        <div>
          <p className="room-code">Room {joincode}</p>
          <h1>{session?.topic || "Loading session…"}</h1>
        </div>
        <button type="button" className="btn btn-danger" onClick={handleExit} disabled={leaving}>
          {leaving ? "Leaving…" : "Leave & get feedback"}
        </button>
      </header>

      {mediaError && <p className="form-error room-banner">{mediaError}</p>}

      <div className="video-grid">
        <div className="tile tile-self">
          <video ref={userVideo} autoPlay muted playsInline />
          <span className="tile-label">You{muted ? " · muted" : ""}{cameraOff ? " · camera off" : ""}</span>
        </div>
        {peers.map(({ peer, peerID }) => (
          <PeerVideo key={peerID} peer={peer} peerID={peerID} />
        ))}
      </div>

      <div className="room-controls">
        <button type="button" className={`btn ${muted ? "btn-danger" : "btn-ghost"}`} onClick={toggleMute}>
          {muted ? "Unmute" : "Mute"}
        </button>
        <button
          type="button"
          className={`btn ${cameraOff ? "btn-danger" : "btn-ghost"}`}
          onClick={toggleCamera}
        >
          {cameraOff ? "Camera on" : "Camera off"}
        </button>
      </div>

      {session?.prompts?.length > 0 && (
        <aside className="panel prompts-panel">
          <h2>Discussion cues</h2>
          <ul>
            {session.prompts.map((prompt) => (
              <li key={prompt}>{prompt}</li>
            ))}
          </ul>
        </aside>
      )}
    </div>
  );
}
