# Podium — Group Discussion Practice Platform

Practice real group discussions with live video rooms, join codes, and AI coaching feedback.

**Live**

- Frontend: [https://gd-platform.vercel.app](https://gd-platform.vercel.app/)
- Backend: [https://gd-platform-3.onrender.com](https://gd-platform-3.onrender.com)

---

## Features

- User authentication (JWT)
- Create & join GD rooms with 6-character codes
- Real-time audio/video (Socket.IO + WebRTC)
- Discussion coaching prompts in-room
- AI feedback from session transcripts (OpenAI when configured)
- Dashboard with session history, feedback archive, and PDF export

---

## Tech stack

| Layer | Stack |
|-------|--------|
| Frontend | React, React Router, Axios, Socket.IO Client, simple-peer, html2canvas + jsPDF |
| Backend | Node.js, Express, MongoDB/Mongoose, JWT, Socket.IO, OpenAI |
| Deploy | Vercel (frontend), Render (API), MongoDB Atlas |

---

## Folder structure

```
gd-platform/
├── frontend/          # React app
│   ├── public/
│   └── src/
│       ├── api/
│       ├── components/
│       ├── context/
│       └── pages/
└── server/            # Express API + Socket.IO
    ├── middleware/
    ├── models/
    ├── routes/
    └── index.js
```

---

## Setup

### 1. Clone

```bash
git clone https://github.com/yashwanthmk11/gd-platform.git
cd gd-platform
```

### 2. Backend env (`server/.env`)

```env
MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
PORT=5000
```

Copy from `server/.env.example` if needed. Without `OPENAI_API_KEY`, feedback still works using a built-in coaching heuristic.

### 3. Frontend env (`frontend/.env`)

```env
REACT_APP_API_BASE_URL=http://localhost:5000
```

For production builds, point this at your Render API URL.

### 4. Run locally

```bash
# Terminal 1 — API
cd server
npm install
npm run dev

# Terminal 2 — React
cd frontend
npm install
npm start
```

Or from the repo root after `npm run install:all`:

```bash
npm run dev:server
npm run dev:frontend
```

---

## Typical flow

1. Register / log in  
2. **Create session** → copy join code  
3. Peers **Join** with the code → `/voice/:joinCode`  
4. Leave the room → paste transcript on **Feedback**  
5. Review history and export PDF from the **Dashboard**

---

## Author

**Yashwanth M K**  
Email: mkyashwanth3@gmail.com  

This project is for academic use and is not intended as a production service.
