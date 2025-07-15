✅ README.md 


# 🧠 Group Discussion (GD) Platform - AI Integrated

A MERN stack project built for AI-integrated real-time group discussions with speech features and feedback generation.

---

## 🚀 Live Demo

- **Frontend (Vercel)**: [https://groupdiscussion.vercel.app](https://groupdiscussion.vercel.app)
- **Backend (Render)**: [https://gd-platform-3.onrender.com](https://gd-platform-3.onrender.com)

---

## 📌 Features

✅ User Authentication  
✅ Create & Join GD Rooms  
✅ Real-Time Audio Communication (Socket.IO + WebRTC)  
✅ AI Participant Integration  
✅ AI Feedback Summary for GD Sessions  
✅ Session Scheduling with Join Codes  
✅ Dashboard to Track GD History  

---

## 🛠️ Tech Stack

### Frontend
- React.js
- React Router DOM
- Axios
- WebRTC + Socket.IO Client

### Backend
- Node.js
- Express.js
- MongoDB + Mongoose
- OpenAI API (for AI Feedback)
- Socket.IO

---

## 📁 Folder Structure

gd-platform/
├── client/ # React frontend (renamed to frontend)
│ ├── public/
│ └── src/
│ ├── pages/
│ ├── components/
│ └── App.js
├── server/ # Node.js backend
│ ├── routes/
│ ├── models/
│ ├── index.js
│ └── .env



---

## ⚙️ Setup Instructions

### 1. Clone the Repo

```bash
git clone https://github.com/yashwanthmk11/gd-platform.git
cd gd-platform
2. Environment Variables
🔐 Backend .env

MONGO_URI=your_mongodb_connection
JWT_SECRET=your_jwt_secret
OPENAI_API_KEY=your_openai_key
PORT=5000
🌐 Frontend .env (client/.env or frontend/.env)

REACT_APP_API_BASE_URL=https://gd-platform-3.onrender.com
▶️ Run Locally
Backend
cd server
npm install
npm run dev

Frontend
cd  frontend
npm install
npm start
🧪 Test the Flow
Register/Login

Create GD Session — /create-session

Join Room — /voice/:joinCode

View AI Feedback — /feedback

🌍 Deployment
Frontend deployed to Vercel

Backend deployed to Render

MongoDB Atlas used for data storage

🙋‍♂️ Author
Yashwanth M K
📧 mkyashwanth3@gmail.com
🔗 LinkedIn


📄 License
This project is for academic/assignment use and is not intended for production.


---

Let me know if you'd like a **PDF version**, or help **uploading this to GitHub** and **verifying links/images**.












