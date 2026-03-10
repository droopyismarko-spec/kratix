"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Welcome() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      setUser(user);
    };
    init();
  }, []);

  if (!user) return null;

  const firstName = user.email.split("@")[0];

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08080f",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: "white",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "24px",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .take-btn:hover { background: #7c74ff !important; }
        .skip-btn:hover { color: #fff !important; border-color: #ffffff30 !important; }
      `}</style>

      <div style={{ maxWidth: "560px", width: "100%", animation: "fadeUp 0.5s ease both" }}>

        <div style={{ marginBottom: "48px" }}>
          <p style={{ fontSize: "13px", color: "#6c63ff", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
            Welcome to Kratix
          </p>
          <h1 style={{ fontSize: "clamp(32px, 5vw, 48px)", fontWeight: "800", letterSpacing: "-1.5px", lineHeight: 1.1, marginBottom: "16px" }}>
            Good to have you,<br />
            <span style={{ color: "#6c63ff" }}>{firstName}.</span>
          </h1>
          <p style={{ color: "#444", fontSize: "16px", lineHeight: "1.7" }}>
            Before we build your personalized plan, we'd like to learn a little about you.
          </p>
        </div>

        <div style={{
          background: "#0f0f1a",
          border: "1px solid #ffffff08",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
        }}>
          <p style={{ fontSize: "12px", color: "#444", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "24px" }}>
            What we ask about
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { category: "Fitness & Body", desc: "Your current fitness level and goals", color: "#34d399" },
              { category: "Confidence & Social", desc: "How you feel in social situations", color: "#a78bfa" },
              { category: "Habits & Discipline", desc: "Your daily routines and challenges", color: "#f59e0b" },
              { category: "Mental Health", desc: "Your mindset and stress levels", color: "#ec4899" },
              { category: "Nutrition & Diet", desc: "Your eating habits and challenges", color: "#3b82f6" },
              { category: "Focus & Productivity", desc: "How you manage your time and energy", color: "#6c63ff" },
            ].map((item, i) => (
              <div key={i} style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <div style={{
                  width: "8px", height: "8px",
                  borderRadius: "50%",
                  background: item.color,
                  flexShrink: 0,
                  boxShadow: `0 0 8px ${item.color}80`,
                }}></div>
                <div>
                  <span style={{ fontSize: "14px", fontWeight: "600", color: "#fff" }}>{item.category}</span>
                  <span style={{ fontSize: "14px", color: "#444", marginLeft: "8px" }}>{item.desc}</span>
                </div>
              </div>
            ))}
          </div>
          <div style={{
            marginTop: "24px",
            paddingTop: "24px",
            borderTop: "1px solid #ffffff08",
            fontSize: "13px",
            color: "#333",
          }}>
            20 questions — takes about 2 minutes
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          <a href="/quiz" className="take-btn" style={{
            background: "#6c63ff",
            color: "#fff",
            padding: "18px",
            borderRadius: "12px",
            fontSize: "16px",
            fontWeight: "700",
            textDecoration: "none",
            textAlign: "center",
            transition: "background 0.2s",
            display: "block",
          }}>
            Take the Quiz Now
          </a>
          <a href="/dashboard" className="skip-btn" style={{
            background: "transparent",
            color: "#444",
            border: "1px solid #ffffff10",
            padding: "18px",
            borderRadius: "12px",
            fontSize: "15px",
            textDecoration: "none",
            textAlign: "center",
            transition: "all 0.2s",
            display: "block",
          }}>
            Skip for now — go to Dashboard
          </a>
        </div>

      </div>
    </main>
  );
}