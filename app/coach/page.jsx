"use client";
import { useEffect, useState, useRef } from "react";
import { supabase } from "../../lib/supabase";

export default function Coach() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState(null);
  const [quizAnswers, setQuizAnswers] = useState(null);
  const bottomRef = useRef(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      setUser(user);

      // Load quiz answers so AI knows the user
      const { data } = await supabase
        .from("profiles")
        .select("quiz_answers")
        .eq("id", user.id)
        .single();
      
      if (data?.quiz_answers) setQuizAnswers(data.quiz_answers);

      // Welcome message
      setMessages([{
        role: "assistant",
        content: "I know your goals and where you're starting from. What do you want to work on today?"
      }]);
    };
    init();
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
  messages: newMessages,
  quizAnswers,
  userId: user.id,
}),
      });

      const data = await response.json();
      setMessages(prev => [...prev, { role: "assistant", content: data.reply }]);
    } catch (err) {
      setMessages(prev => [...prev, { role: "assistant", content: "Something went wrong. Try again." }]);
    }

    setLoading(false);
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08080f",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: "white",
      display: "flex",
      flexDirection: "column",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .send-btn:hover { background: #7c74ff !important; }
        .back-btn:hover { color: #fff !important; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        alignItems: "center",
        gap: "16px",
        padding: "20px 40px",
        borderBottom: "1px solid #ffffff08",
        background: "#08080fdd",
        backdropFilter: "blur(12px)",
        position: "sticky",
        top: 0,
        zIndex: 100,
      }}>
        <a href="/dashboard" className="back-btn" style={{ color: "#444", fontSize: "20px", textDecoration: "none", transition: "color 0.2s" }}>←</a>
        <div>
          <h1 style={{ fontSize: "18px", fontWeight: "800" }}>AI Coach</h1>
          <p style={{ fontSize: "12px", color: "#444", marginTop: "2px" }}>Personalized to your quiz answers</p>
        </div>
        <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "8px", height: "8px", background: "#34d399", borderRadius: "50%", boxShadow: "0 0 8px #34d39980" }}></div>
          <span style={{ fontSize: "12px", color: "#444" }}>Online</span>
        </div>
      </nav>

      {/* MESSAGES */}
      <div style={{
        flex: 1,
        overflowY: "auto",
        padding: "32px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        maxWidth: "720px",
        width: "100%",
        margin: "0 auto",
      }}>
        {messages.map((msg, i) => (
          <div key={i} style={{
            display: "flex",
            justifyContent: msg.role === "user" ? "flex-end" : "flex-start",
            animation: "fadeUp 0.3s ease both",
          }}>
            {msg.role === "assistant" && (
              <div style={{
                width: "32px", height: "32px",
                background: "#6c63ff20",
                border: "1px solid #6c63ff30",
                borderRadius: "10px",
                display: "flex", alignItems: "center", justifyContent: "center",
                marginRight: "10px",
                flexShrink: 0,
                marginTop: "4px",
              }}>
                <div style={{ width: "10px", height: "10px", background: "#6c63ff", borderRadius: "3px" }}></div>
              </div>
            )}
            <div style={{
              maxWidth: "75%",
              background: msg.role === "user" ? "#6c63ff" : "#0f0f1a",
              border: msg.role === "user" ? "none" : "1px solid #ffffff08",
              borderRadius: msg.role === "user" ? "18px 18px 4px 18px" : "18px 18px 18px 4px",
              padding: "14px 18px",
              fontSize: "15px",
              lineHeight: "1.6",
              color: msg.role === "user" ? "#fff" : "#ccc",
            }}>
              {msg.content}
            </div>
          </div>
        ))}

        {loading && (
          <div style={{ display: "flex", alignItems: "center", gap: "10px", animation: "fadeUp 0.3s ease both" }}>
            <div style={{
              width: "32px", height: "32px",
              background: "#6c63ff20",
              border: "1px solid #6c63ff30",
              borderRadius: "10px",
              display: "flex", alignItems: "center", justifyContent: "center",
              flexShrink: 0,
            }}>
              <div style={{ width: "10px", height: "10px", background: "#6c63ff", borderRadius: "3px" }}></div>
            </div>
            <div style={{
              background: "#0f0f1a",
              border: "1px solid #ffffff08",
              borderRadius: "18px 18px 18px 4px",
              padding: "14px 18px",
              display: "flex", gap: "4px", alignItems: "center",
            }}>
              {[0,1,2].map(i => (
                <div key={i} style={{
                  width: "6px", height: "6px",
                  background: "#444",
                  borderRadius: "50%",
                  animation: `fadeUp 0.6s ${i * 0.15}s ease infinite alternate`,
                }}></div>
              ))}
            </div>
          </div>
        )}
        <div ref={bottomRef}></div>
      </div>

      {/* INPUT */}
      <div style={{
        padding: "20px 24px",
        borderTop: "1px solid #ffffff08",
        background: "#08080f",
      }}>
        <div style={{
          maxWidth: "720px",
          margin: "0 auto",
          display: "flex",
          gap: "10px",
        }}>
          <input
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sendMessage()}
            placeholder="Ask your coach anything..."
            style={{
              flex: 1,
              background: "#0f0f1a",
              border: "1px solid #ffffff10",
              borderRadius: "12px",
              padding: "14px 18px",
              color: "white",
              fontSize: "15px",
              outline: "none",
            }}
          />
          <button
            className="send-btn"
            onClick={sendMessage}
            disabled={loading}
            style={{
              background: "#6c63ff",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "14px 20px",
              fontSize: "18px",
              cursor: "pointer",
              transition: "background 0.2s",
              fontWeight: "700",
            }}
          >
            →
          </button>
        </div>
      </div>
    </main>
  );
}