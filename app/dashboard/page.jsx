"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Dashboard() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
      else setUser(user);
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!user) return null;

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08080f",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: "white",
    }}>
      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: "1px solid #ffffff0f",
      }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#fff" }}>Kratix</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#555", fontSize: "14px" }}>{user.email}</span>
          <button
            onClick={handleSignOut}
            style={{
              background: "#ffffff0a",
              border: "1px solid #ffffff15",
              color: "#888",
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      {/* CONTENT */}
      <div style={{ padding: "60px 40px", maxWidth: "1100px", margin: "0 auto" }}>
        <p style={{ fontSize: "13px", color: "#6c63ff", letterSpacing: "2px", marginBottom: "12px", textTransform: "uppercase" }}>
          Dashboard
        </p>
        <h2 style={{ fontSize: "40px", fontWeight: "800", marginBottom: "8px", letterSpacing: "-1px" }}>
          Welcome back 👋
        </h2>
        <p style={{ color: "#555", marginBottom: "56px" }}>Here's your discipline hub.</p>

        {/* CARDS */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: "16px",
        }}>
          {[
            { title: "Habit Tracker", desc: "Track your daily habits and streaks", color: "#6c63ff", soon: false },
            { title: "AI Coach", desc: "Chat with your personal AI coach", color: "#a78bfa", soon: false },
            { title: "Food Scanner", desc: "Scan your meals for macros", color: "#34d399", soon: true },
            { title: "Posture Analysis", desc: "Check your posture with AI", color: "#f59e0b", soon: true },
            { title: "Daily Plan", desc: "Your personalized daily schedule", color: "#ec4899", soon: true },
            { title: "Leaderboard", desc: "Compete with friends", color: "#3b82f6", soon: true },
          ].map((card, i) => (
            <div key={i} style={{
              background: "#0f0f1a",
              border: "1px solid #ffffff0a",
              borderRadius: "16px",
              padding: "28px",
              cursor: card.soon ? "default" : "pointer",
              opacity: card.soon ? 0.5 : 1,
              transition: "border-color 0.2s",
            }}
            onMouseEnter={e => { if (!card.soon) e.currentTarget.style.borderColor = card.color + "40" }}
            onMouseLeave={e => e.currentTarget.style.borderColor = "#ffffff0a"}
            >
              <div style={{
                width: "40px", height: "40px",
                background: card.color + "20",
                borderRadius: "10px",
                marginBottom: "16px",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <div style={{ width: "12px", height: "12px", background: card.color, borderRadius: "3px" }}></div>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>{card.title}</h3>
              <p style={{ fontSize: "13px", color: "#555" }}>{card.desc}</p>
              {card.soon && <p style={{ fontSize: "11px", color: "#333", marginTop: "12px", letterSpacing: "1px" }}>COMING SOON</p>}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}