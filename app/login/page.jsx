"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSignUp, setIsSignUp] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAuth = async () => {
    setLoading(true);
    setMessage("");
    if (isSignUp) {
      const { error } = await supabase.auth.signUp({ email, password });
      if (error) setMessage(error.message);
      else window.location.href = "/welcome";
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setMessage(error.message);
      } else {
        const { data: { user } } = await supabase.auth.getUser();
        const { data } = await supabase
          .from("profiles")
          .select("quiz_completed")
          .eq("id", user.id)
          .single();
        if (data?.quiz_completed) {
          window.location.href = "/dashboard";
        } else {
          window.location.href = "/welcome";
        }
      }
    }
    setLoading(false);
  };

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: "google",
      options: { redirectTo: `${window.location.origin}/welcome` }
    });
  };

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08080f",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      padding: "24px",
    }}>
      <div style={{
        background: "#0f0f1a",
        border: "1px solid #ffffff10",
        borderRadius: "16px",
        padding: "48px",
        width: "100%",
        maxWidth: "420px",
      }}>
        <h1 style={{ fontSize: "28px", fontWeight: "800", color: "#fff", marginBottom: "8px" }}>
          Kratix
        </h1>
        <p style={{ color: "#555", fontSize: "14px", marginBottom: "40px" }}>
          {isSignUp ? "Create your account" : "Welcome back"}
        </p>

        <button
          onClick={handleGoogle}
          style={{
            width: "100%",
            background: "#ffffff0a",
            border: "1px solid #ffffff15",
            borderRadius: "10px",
            padding: "14px",
            color: "white",
            fontSize: "15px",
            fontWeight: "600",
            cursor: "pointer",
            marginBottom: "24px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
          }}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path fill="#4285F4" d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.66-.15-1.18z"/>
            <path fill="#34A853" d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2a4.8 4.8 0 0 1-7.18-2.54H1.83v2.07A8 8 0 0 0 8.98 17z"/>
            <path fill="#FBBC05" d="M4.5 10.52a4.8 4.8 0 0 1 0-3.04V5.41H1.83a8 8 0 0 0 0 7.18l2.67-2.07z"/>
            <path fill="#EA4335" d="M8.98 4.18c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.83 5.4L4.5 7.49a4.77 4.77 0 0 1 4.48-3.31z"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", background: "#ffffff10" }}></div>
          <span style={{ color: "#333", fontSize: "12px" }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "#ffffff10" }}></div>
        </div>

        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontSize: "12px", letterSpacing: "1px", color: "#555", display: "block", marginBottom: "8px" }}>
            EMAIL
          </label>
          <input
            type="email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={{
              width: "100%",
              background: "#ffffff05",
              border: "1px solid #ffffff10",
              borderRadius: "8px",
              padding: "14px 16px",
              color: "white",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
            placeholder="you@example.com"
          />
        </div>

        <div style={{ marginBottom: "28px" }}>
          <label style={{ fontSize: "12px", letterSpacing: "1px", color: "#555", display: "block", marginBottom: "8px" }}>
            PASSWORD
          </label>
          <input
            type="password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: "100%",
              background: "#ffffff05",
              border: "1px solid #ffffff10",
              borderRadius: "8px",
              padding: "14px 16px",
              color: "white",
              fontSize: "15px",
              outline: "none",
              boxSizing: "border-box",
            }}
            placeholder="••••••••"
          />
        </div>

        {message && (
          <p style={{ color: "#6c63ff", fontSize: "13px", marginBottom: "16px", textAlign: "center" }}>
            {message}
          </p>
        )}

        <button
          onClick={handleAuth}
          disabled={loading}
          style={{
            width: "100%",
            background: "#6c63ff",
            color: "#fff",
            border: "none",
            borderRadius: "10px",
            padding: "16px",
            fontSize: "15px",
            fontWeight: "700",
            cursor: "pointer",
            marginBottom: "16px",
          }}
        >
          {loading ? "..." : isSignUp ? "Create Account" : "Sign In"}
        </button>

        <p
          onClick={() => setIsSignUp(!isSignUp)}
          style={{ textAlign: "center", color: "#555", fontSize: "13px", cursor: "pointer" }}
        >
          {isSignUp ? "Already have an account? Sign in" : "No account? Create one free"}
        </p>
      </div>
    </main>
  );
}