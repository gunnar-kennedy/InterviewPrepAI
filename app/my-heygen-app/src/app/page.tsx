"use client";

import { useEffect, useState } from "react";
import StreamingVideo from "./components/StreamingVideo";

export default function Home() {
  const [sessionData, setSessionData] = useState<any>(null);
  const [text, setText] = useState("");

  useEffect(() => {
    const createSession = async () => {
      const res = await fetch("/api/start-session", { method: "POST" });
      const data = await res.json();
      setSessionData(data);
    };

    createSession();
  }, []);

  const handleSpeak = async () => {
    if (!sessionData?.session_id) return;

    await fetch("/api/speak", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        sessionId: sessionData.session_id,
        text,
      }),
    });

    setText("");
  };

  return (
    <main style={{ padding: 20 }}>
      <h1>HeyGen Streaming Avatar</h1>
      {sessionData ? (
        <>
          <StreamingVideo sessionData={sessionData} />
          <textarea
            placeholder="Say something..."
            value={text}
            onChange={(e) => setText(e.target.value)}
            rows={3}
            style={{ width: "100%", marginTop: 10 }}
          />
          <button onClick={handleSpeak} style={{ marginTop: 10 }}>
            Speak
          </button>
        </>
      ) : (
        <p>Loading session...</p>
      )}
    </main>
  );
}
