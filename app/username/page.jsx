"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Username() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checking, setChecking] = useState(false);
  const [available, setAvailable] = useState(null);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      setUser(user);

      // Check if username exists - ignore errors (means no record yet)
      const { data } = await supabase
        .from("profiles")
        .select("username")
        .eq("id", user.id)
        .maybeSingle();

      if (data?.username) {
        window.location.href = "/welcome";
      }
    };
    init();
  }, []);

  const checkUsername = async (value) => {
    setUsername(value);
    setAvailable(null);
    if (value.length < 3) return;
    setChecking(true);
    const { data } = await supabase
      .from("profiles")
      .select("username")
      .eq("username", value.toLowerCase())
      .single();
    setAvailable(!data);
    setChecking(false);
  };

  const handleSubmit = async () => {
    if (!username || !available || loading) return;
    if (username.length < 3) { setError("Username must be at least 3 characters."); return; }
    if (!/^[a-zA-Z0-9_]+$/.test(username)) { setError("Only letters, numbers and underscores."); return; }

    setLoading(true);
    setError("");

    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, username: username.toLowerCase() });

    if (error) {
      setError("Username taken. Try another.");
      setLoading(false);
      return;
    }

    window.location.href = "/welcome";
  };

  if (!user) return null;

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
        .submit-btn:hover { background: #7c74ff !important; }
      `}</style>

      <div style={{ maxWidth: "480px", width: "100%", animation: "fadeUp 0.5s ease both" }}>

        <p style={{ fontSize: "13px", color: "#6c63ff", letterSpacing: "2px", textTransform: "uppercase", marginBottom: "16px" }}>
          Step 1 of 2
        </p>
        <h1 style={{ fontSize: "clamp(28px, 5vw, 42px)", fontWeight: "800", letterSpacing: "-1px", lineHeight: 1.1, marginBottom: "12px" }}>
          Pick your username.
        </h1>
        <p style={{ color: "#444", fontSize: "15px", lineHeight: "1.7", marginBottom: "48px" }}>
          This is how you'll appear on the leaderboard and to other users.
        </p>

        <div style={{ marginBottom: "12px" }}>
          <div style={{ position: "relative" }}>
            <span style={{
              position: "absolute",
              left: "16px",
              top: "50%",
              transform: "translateY(-50%)",
              color: "#333",
              fontSize: "15px",
            }}>@</span>
            <input
              value={username}
              onChange={e => checkUsername(e.target.value)}
              placeholder="yourname"
              maxLength={20}
              style={{
                width: "100%",
                background: "#0f0f1a",
                border: `1px solid ${available === true ? "#34d399" : available === false ? "#ef4444" : "#ffffff10"}`,
                borderRadius: "12px",
                padding: "16px 16px 16px 36px",
                color: "white",
                fontSize: "18px",
                fontWeight: "600",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
            />
            {username.length >= 3 && (
              <span style={{
                position: "absolute",
                right: "16px",
                top: "50%",
                transform: "translateY(-50%)",
                fontSize: "18px",
              }}>
                {checking ? "..." : available ? "✓" : "✗"}
              </span>
            )}
          </div>

          {available === true && (
            <p style={{ color: "#34d399", fontSize: "13px", marginTop: "8px" }}>Username is available!</p>
          )}
          {available === false && (
            <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>Username is taken. Try another.</p>
          )}
          {error && (
            <p style={{ color: "#ef4444", fontSize: "13px", marginTop: "8px" }}>{error}</p>
          )}
        </div>

        <p style={{ color: "#333", fontSize: "12px", marginBottom: "32px" }}>
          Letters, numbers and underscores only. Min 3 characters.
        </p>

        <button
          className="submit-btn"
          onClick={handleSubmit}
          disabled={!available || loading}
          style={{
            width: "100%",
            background: available ? "#6c63ff" : "#ffffff08",
            color: available ? "#fff" : "#333",
            border: "none",
            borderRadius: "12px",
            padding: "18px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: available ? "pointer" : "default",
            transition: "all 0.2s",
            boxShadow: available ? "0 8px 24px #6c63ff40" : "none",
          }}
        >
          {loading ? "Saving..." : "Continue"}
        </button>

      </div>
    </main>
  );
}