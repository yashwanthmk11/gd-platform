import React, { useState } from "react";
import axios from "axios";
// import Session from "../../../server/models/Session";

const Feedback = () => {
  const [transcript, setTranscript] = useState("");
  const [feedback, setFeedback] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFeedback("");

    try {
      const res = await axios.post("https://gd-platform-3.onrender.com/api/feedback", {
        transcript,
        // sessionid : currentSessionId, 
      });

      setFeedback(res.data.feedback);
    } catch (err) {
      setFeedback("❌ Failed to get feedback. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">AI Feedback Generator</h1>

      <form onSubmit={handleSubmit}>
        <textarea
          rows={6}
          placeholder="Paste your GD transcript here..."
          className="w-full p-3 border rounded mb-4"
          value={transcript}
          onChange={(e) => setTranscript(e.target.value)}
        />

        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          disabled={loading}
        >
          {loading ? "Generating..." : "Get Feedback"}
        </button>
      </form>

      {feedback && (
        <div className="mt-6 p-4 bg-gray-100 rounded shadow">
          <h2 className="font-semibold mb-2">AI Feedback:</h2>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
};

export default Feedback;
