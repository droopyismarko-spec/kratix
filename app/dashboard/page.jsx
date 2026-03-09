"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

const features = [
  { title: "AI Coach", desc: "Your personal discipline coach", color: "#6c63ff", icon: "🧠", ready: true, href: "/coach" },
  { title: "Habit Tracker", desc: "Build unbreakable daily habits", color: "#a78bfa", icon: "⚡", ready: true, href: "/habits" },
  { title: "Workout System", desc: "AI-generated workout plans", color: "#34d399", icon: "🏋️", ready: false },
  { title: "Nutrition Scanner", desc: "Scan meals for macros instantly", color: "#3b82f6", icon: "🥗", ready: false },
  { title: "Physique Scan", desc: "AI body composition analysis", color: "#f59e0b", icon: "📸", ready: false },
  { title: "Posture Analysis", desc: "Fix your posture with AI", color: "#ec4899", icon: "🧍", ready: false },
  { title: "Outfit Rating", desc: "AI feedback on your style", color: "#ff6b6b", icon: "👔", ready: false },
  { title: "Breathing & Calm", desc: "Guided breathing exercises", color: "#06b6d4", icon: "🌬️", ready: false },
  { title: "Rankings", desc: "Compete with friends globally", color: "#f97316", icon: "🏆", ready: false },
  { title: "Progress Tracker", desc: "Track your transformation", color: "#8b5cf6", icon: "📈", ready: false },
];

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [greeting, setGreeting] = useState("Welcome back");

  useEffect(() => {
    const getUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) window.location.href = "/login";
      else {
        setUser(user);
        const hour = new Date().getHours();
        if (hour < 12) setGreeting("Good morning");
        else if (hour < 18) setGreeting("Good afternoon");
        else setGreeting("Good evening");
      }
    };
    getUser();
  }, []);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };

  if (!user) return null;

  const firstName = user.email.split("@")[0];

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08080f",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: "white",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .feature-card:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 20px 40px rgba(0,0,0,0.3) !important;
        }
        .signout-btn:hover { background: #ffffff15 !important; color: #fff !important; }
      `}</style>

      {/* NAVBAR */}
      <nav style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "20px 40px",
        borderBottom: "1px solid #ffffff08",
        position: "sticky",
        top: 0,
        background: "#08080fdd",
        backdropFilter: "blur(12px)",
        zIndex: 100,
      }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#fff" }}>Kratix</h1>
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <span style={{ color: "#333", fontSize: "13px" }}>{user.email}</span>
          <button
            className="signout-btn"
            onClick={handleSignOut}
            style={{
              background: "#ffffff08",
              border: "1px solid #ffffff10",
              color: "#555",
              padding: "8px 18px",
              borderRadius: "8px",
              fontSize: "13px",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
          >
            Sign Out
          </button>
        </div>
      </nav>

      <div style={{ padding: "60px 40px", maxWidth: "1200px", margin: "0 auto" }}>

        {/* HEADER */}
        <div style={{ marginBottom: "56px", animation: "fadeUp 0.5s ease both" }}>
          <p style={{ fontSize: "13px", color: "#6c63ff", letterSpacing: "2px", marginBottom: "12px", textTransform: "uppercase" }}>
            Dashboard
          </p>
          <h2 style={{ fontSize: "clamp(32px, 5vw, 52px)", fontWeight: "800", marginBottom: "8px", letterSpacing: "-1.5px", lineHeight: 1.1 }}>
            {greeting},<br />
            <span style={{ color: "#6c63ff" }}>{firstName}.</span>
          </h2>
          <p style={{ color: "#333", fontSize: "15px" }}>What are we working on today?</p>
        </div>

        {/* STREAK BAR */}
        <div style={{
          background: "#0f0f1a",
          border: "1px solid #ffffff08",
          borderRadius: "16px",
          padding: "24px 32px",
          marginBottom: "40px",
          display: "flex",
          gap: "40px",
          flexWrap: "wrap",
          animation: "fadeUp 0.5s 0.1s ease both",
          opacity: 0,
          animationFillMode: "forwards",
        }}>
          {[
            { label: "Day Streak", value: "1", unit: "days", color: "#f59e0b" },
            { label: "Habits Done", value: "0", unit: "today", color: "#34d399" },
            { label: "Weekly Score", value: "0", unit: "pts", color: "#6c63ff" },
            { label: "Global Rank", value: "—", unit: "rank", color: "#ec4899" },
          ].map((stat, i) => (
            <div key={i}>
              <div style={{ fontSize: "28px", fontWeight: "800", color: stat.color }}>{stat.value} <span style={{ fontSize: "14px", color: "#333" }}>{stat.unit}</span></div>
              <div style={{ fontSize: "12px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginTop: "2px" }}>{stat.label}</div>
            </div>
          ))}
        </div>

        {/* FEATURES GRID */}
        <p style={{ fontSize: "11px", color: "#333", letterSpacing: "3px", textTransform: "uppercase", marginBottom: "20px" }}>Your Tools</p>
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
          gap: "16px",
        }}>
          {features.map((f, i) => (
            <div
              key={i}
              className="feature-card"
              onClick={() => f.ready && f.href && (window.location.href = f.href)}
              style={{
                background: "#0f0f1a",
                border: `1px solid ${f.ready ? f.color + "20" : "#ffffff06"}`,
                borderRadius: "16px",
                padding: "28px",
                cursor: f.ready ? "pointer" : "default",
                opacity: f.ready ? 1 : 0.45,
                transition: "all 0.25s ease",
                animation: `fadeUp 0.5s ${0.1 + i * 0.05}s ease both`,
                animationFillMode: "forwards",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* GLOW */}
              {f.ready && (
                <div style={{
                  position: "absolute",
                  top: 0, left: 0, right: 0,
                  height: "2px",
                  background: `linear-gradient(90deg, transparent, ${f.color}, transparent)`,
                }}></div>
              )}

              <div style={{
                width: "44px",
                height: "44px",
                background: f.color + "15",
                borderRadius: "12px",
                marginBottom: "16px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "20px",
              }}>
                {f.icon}
              </div>

              <h3 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "6px" }}>{f.title}</h3>
              <p style={{ fontSize: "13px", color: "#444", lineHeight: "1.6" }}>{f.desc}</p>

              {!f.ready && (
                <div style={{
                  display: "inline-block",
                  marginTop: "12px",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: "#2a2a2a",
                  textTransform: "uppercase",
                  background: "#ffffff05",
                  padding: "4px 10px",
                  borderRadius: "99px",
                }}>
                  Coming Soon
                </div>
              )}

              {f.ready && (
                <div style={{
                  display: "inline-block",
                  marginTop: "12px",
                  fontSize: "10px",
                  letterSpacing: "2px",
                  color: f.color,
                  textTransform: "uppercase",
                  background: f.color + "15",
                  padding: "4px 10px",
                  borderRadius: "99px",
                }}>
                  Available →
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}