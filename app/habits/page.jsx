"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

export default function Habits() {
  const [habits, setHabits] = useState([]);
  const [newHabit, setNewHabit] = useState("");
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { window.location.href = "/login"; return; }
      setUser(user);
      await loadHabits(user.id);
      setLoading(false);
    };
    init();
  }, []);

  const loadHabits = async (userId) => {
    const { data } = await supabase
      .from("habits")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: true });
    if (data) setHabits(data);
  };

  const addHabit = async () => {
    if (!newHabit.trim() || !user) return;
    setAdding(true);
    const { data } = await supabase.from("habits").insert({
      user_id: user.id,
      name: newHabit.trim(),
    }).select().single();
    if (data) setHabits(prev => [...prev, data]);
    setNewHabit("");
    setAdding(false);
  };

  const toggleHabit = async (habit) => {
    const today = new Date().toISOString().split("T")[0];
    const alreadyDone = habit.completed_today;
    const newStreak = alreadyDone ? Math.max(0, habit.streak - 1) : habit.streak + 1;

    const { data } = await supabase.from("habits").update({
      completed_today: !alreadyDone,
      streak: newStreak,
      last_completed: !alreadyDone ? today : habit.last_completed,
    }).eq("id", habit.id).select().single();

    if (data) setHabits(prev => prev.map(h => h.id === habit.id ? data : h));
  };

  const deleteHabit = async (id) => {
    await supabase.from("habits").delete().eq("id", id);
    setHabits(prev => prev.filter(h => h.id !== id));
  };

  const completedCount = habits.filter(h => h.completed_today).length;
  const totalCount = habits.length;
  const progressPct = totalCount > 0 ? (completedCount / totalCount) * 100 : 0;

  if (loading) return (
    <main style={{ minHeight: "100vh", background: "#08080f", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ color: "#333", fontSize: "14px" }}>Loading...</div>
    </main>
  );

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08080f",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: "white",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes checkPop {
          0% { transform: scale(1); }
          50% { transform: scale(1.3); }
          100% { transform: scale(1); }
        }
        .habit-row:hover .delete-btn { opacity: 1 !important; }
        .add-btn:hover { background: #7c74ff !important; }
        .back-btn:hover { color: #fff !important; }
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
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <a href="/dashboard" className="back-btn" style={{ color: "#444", fontSize: "20px", textDecoration: "none", transition: "color 0.2s" }}>←</a>
          <h1 style={{ fontSize: "20px", fontWeight: "800" }}>Habit Tracker</h1>
        </div>
        <div style={{ fontSize: "13px", color: "#444" }}>
          {completedCount}/{totalCount} done today
        </div>
      </nav>

      <div style={{ maxWidth: "640px", margin: "0 auto", padding: "48px 24px" }}>

        {/* PROGRESS */}
        <div style={{
          background: "#0f0f1a",
          border: "1px solid #ffffff08",
          borderRadius: "20px",
          padding: "32px",
          marginBottom: "32px",
          animation: "fadeUp 0.4s ease both",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px" }}>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#a78bfa" }}>{completedCount}<span style={{ fontSize: "16px", color: "#333" }}>/{totalCount}</span></div>
              <div style={{ fontSize: "12px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginTop: "4px" }}>Habits completed today</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#f59e0b" }}>
                {habits.length > 0 ? Math.max(...habits.map(h => h.streak)) : 0}
              </div>
              <div style={{ fontSize: "12px", color: "#444", letterSpacing: "1px", textTransform: "uppercase", marginTop: "4px" }}>Best streak 🔥</div>
            </div>
          </div>
          <div style={{ background: "#ffffff08", borderRadius: "99px", height: "8px", overflow: "hidden" }}>
            <div style={{
              height: "100%",
              borderRadius: "99px",
              background: "linear-gradient(90deg, #6c63ff, #a78bfa)",
              width: `${progressPct}%`,
              transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
              boxShadow: "0 0 12px #6c63ff60",
            }}></div>
          </div>
        </div>

        {/* ADD HABIT */}
        <div style={{
          display: "flex",
          gap: "10px",
          marginBottom: "32px",
          animation: "fadeUp 0.4s 0.1s ease both",
          animationFillMode: "forwards",
          opacity: 0,
        }}>
          <input
            value={newHabit}
            onChange={e => setNewHabit(e.target.value)}
            onKeyDown={e => e.key === "Enter" && addHabit()}
            placeholder="Add a new habit..."
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
            className="add-btn"
            onClick={addHabit}
            disabled={adding}
            style={{
              background: "#6c63ff",
              color: "white",
              border: "none",
              borderRadius: "12px",
              padding: "14px 24px",
              fontSize: "20px",
              cursor: "pointer",
              transition: "background 0.2s",
              fontWeight: "700",
            }}
          >
            +
          </button>
        </div>

        {/* HABITS LIST */}
        {habits.length === 0 ? (
          <div style={{
            textAlign: "center",
            padding: "60px 24px",
            color: "#333",
            animation: "fadeUp 0.4s 0.2s ease both",
            animationFillMode: "forwards",
            opacity: 0,
          }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>⚡</div>
            <p style={{ fontSize: "16px", marginBottom: "8px", color: "#444" }}>No habits yet.</p>
            <p style={{ fontSize: "14px" }}>Add your first habit above to start building discipline.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {habits.map((habit, i) => (
              <div
                key={habit.id}
                className="habit-row"
                style={{
                  background: habit.completed_today ? "#a78bfa10" : "#0f0f1a",
                  border: `1px solid ${habit.completed_today ? "#a78bfa30" : "#ffffff08"}`,
                  borderRadius: "14px",
                  padding: "18px 20px",
                  display: "flex",
                  alignItems: "center",
                  gap: "16px",
                  transition: "all 0.2s",
                  animation: `fadeUp 0.4s ${0.1 + i * 0.05}s ease both`,
                  animationFillMode: "forwards",
                  opacity: 0,
                  position: "relative",
                }}
              >
                {/* CHECKBOX */}
                <div
                  onClick={() => toggleHabit(habit)}
                  style={{
                    width: "26px",
                    height: "26px",
                    borderRadius: "8px",
                    border: `2px solid ${habit.completed_today ? "#a78bfa" : "#2a2a2a"}`,
                    background: habit.completed_today ? "#a78bfa" : "transparent",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                    transition: "all 0.2s",
                    animation: habit.completed_today ? "checkPop 0.3s ease" : "none",
                    boxShadow: habit.completed_today ? "0 0 12px #a78bfa60" : "none",
                  }}
                >
                  {habit.completed_today && <span style={{ fontSize: "13px", color: "white" }}>✓</span>}
                </div>

                {/* NAME */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: "15px",
                    fontWeight: "600",
                    color: habit.completed_today ? "#666" : "#fff",
                    textDecoration: habit.completed_today ? "line-through" : "none",
                    transition: "all 0.2s",
                  }}>
                    {habit.name}
                  </div>
                  {habit.streak > 0 && (
                    <div style={{ fontSize: "12px", color: "#f59e0b", marginTop: "3px" }}>
                      🔥 {habit.streak} day streak
                    </div>
                  )}
                </div>

                {/* DELETE */}
                <button
                  className="delete-btn"
                  onClick={() => deleteHabit(habit.id)}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "#333",
                    fontSize: "18px",
                    cursor: "pointer",
                    opacity: 0,
                    transition: "opacity 0.2s",
                    padding: "4px 8px",
                  }}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}