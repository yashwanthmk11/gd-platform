import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { createServer } from "http";
import { Server } from "socket.io";

import authRoutes from "./routes/auth.js";
import feedbackRoutes from "./routes/feedback.js";
import sessionRoutes from "./routes/session.js";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());
app.use(express.json({ limit: "1mb" }));

app.use("/api/auth", authRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/sessions", sessionRoutes);

app.get("/", (_req, res) => {
  res.json({ status: "ok", service: "podium-api" });
});

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("User connected:", socket.id);

  socket.on("join-room", (roomId) => {
    if (!roomId) return;
    socket.join(roomId);
    socket.data.roomId = roomId;
    socket.to(roomId).emit("user-joined", socket.id);
  });

  socket.on("signal", ({ to, from, data }) => {
    if (!to || !data) return;
    io.to(to).emit("signal", { from, data });
  });

  socket.on("disconnect", () => {
    const roomId = socket.data.roomId;
    if (roomId) {
      socket.to(roomId).emit("user-left", socket.id);
    }
    console.log("User disconnected:", socket.id);
  });
});

const clientBuild = path.join(__dirname, "../frontend/build");
app.use(express.static(clientBuild));
app.get(/^\/(?!api).*/, (req, res, next) => {
  if (req.method !== "GET") return next();
  res.sendFile(path.join(clientBuild, "index.html"), (err) => {
    if (err) next();
  });
});

const PORT = process.env.PORT || 5000;

if (!process.env.MONGO_URI) {
  console.error("MONGO_URI is missing. Set it in server/.env");
  process.exit(1);
}

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
  });
