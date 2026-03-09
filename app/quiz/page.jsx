"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

const questions = [
  { id: 1, category: "Fitness & Body", question: "What is your current fitness goal?", options: ["Lose weight", "Build muscle", "Improve endurance", "Stay healthy & active"] },
  { id: 2, category: "Fitness & Body", question: "How many days per week do you currently exercise?", options: ["0 days", "1–2 days", "3–4 days", "5+ days"] },
  { id: 3, category: "Fitness & Body", question: "How would you describe your current body?", options: ["Underweight", "Average", "Overweight", "Athletic"] },
  { id: 4, category: "Confidence & Social", question: "How would you rate your confidence in social situations?", options: ["Very low — I avoid them", "Low — I struggle", "Average — I manage", "High — I enjoy them"] },
  { id: 5, category: "Confidence & Social", question: "What is your biggest social challenge?", options: ["Starting conversations", "Public speaking", "Making friends", "Being assertive"] },
  { id: 6, category: "Confidence & Social", question: "How do you feel about your appearance?", options: ["Very insecure", "Somewhat insecure", "Neutral", "Confident"] },
  { id: 7, category: "Habits & Discipline", question: "What time do you usually wake up?", options: ["Before 6 AM", "6–7 AM", "7–9 AM", "After 9 AM"] },
  { id: 8, category: "Habits & Discipline", question: "What is your biggest discipline problem?", options: ["Procrastination", "Phone addiction", "Inconsistency", "Lack of motivation"] },
  { id: 9, category: "Habits & Discipline", question: "How many hours of sleep do you get?", options: ["Less than 5", "5–6 hours", "7–8 hours", "More than 9"] },
  { id: 10, category: "Mental Health", question: "How do you handle stress?", options: ["Very poorly", "Poorly", "Okay", "Well"] },
  { id: 11, category: "Mental Health", question: "How would you describe your current mindset?", options: ["Fixed — I doubt myself", "Struggling — want to change", "Growing — making progress", "Strong — I believe in myself"] },
  { id: 12, category: "Mental Health", question: "How often do you feel anxious or overwhelmed?", options: ["Every day", "A few times a week", "Occasionally", "Rarely"] },
  { id: 13, category: "Nutrition & Diet", question: "How would you describe your current diet?", options: ["Very poor", "Average", "Good", "Excellent"] },
  { id: 14, category: "Nutrition & Diet", question: "What is your biggest nutrition challenge?", options: ["Overeating", "Skipping meals", "Eating unhealthy", "Not knowing what to eat"] },
  { id: 15, category: "Nutrition & Diet", question: "How much water do you drink daily?", options: ["Less than 1L", "1–2L", "2–3L", "3L+"] },
  { id: 16, category: "Focus & Productivity", question: "How productive are you on a typical day?", options: ["Very unproductive", "Somewhat productive", "Moderately productive", "Highly productive"] },
  { id: 17, category: "Focus & Productivity", question: "What kills your focus the most?", options: ["Social media", "Distracting environment", "Lack of sleep", "No clear goals"] },
  { id: 18, category: "Focus & Productivity", question: "How do you plan your day?", options: ["I don't plan at all", "Loosely in my head", "Basic to-do list", "Detailed schedule"] },
  { id: 19, category: "Your Goals", question: "What is your #1 goal right now?", options: ["Get in shape", "Build confidence", "Be more disciplined", "Improve my mental health"] },
  { id: 20, category: "Your Goals", question: "How committed are you to changing your life?", options: ["Just curious", "Somewhat committed", "Very committed", "100% — I'm ready"] },
];

const categoryColors = {
  "Fitness & Body": "#34d399",
  "Confidence & Social": "#a78bfa",
  "Habits & Discipline": "#f59e0b",
  "Mental Health": "#ec4899",
  "Nutrition & Diet": "#3b82f6",
  "Focus & Productivity": "#6c63ff",
  "Your Goals": "#ff6b6b",
};

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);
  const [visible, setVisible] = useState(true);

  const q = questions[current];
  const progress = (current / questions.length) * 100;
  const color = categoryColors[q?.category] || "#6c63ff";

  const handleSelect = (option) => setSelected(option);

  const handleNext = async () => {
    if (!selected) return;
    const newAnswers = { ...answers, [q.id]: { question: q.question, answer: selected, category: q.category } };
    setAnswers(newAnswers);
    setVisible(false);
    await new Promise(r => setTimeout(r, 300));
    if (current + 1 < questions.length) {
      setCurrent(current + 1);
      setSelected(null);
      setVisible(true);
    } else {
      setSaving(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        await supabase.from("profiles").upsert({
          id: user.id,
          quiz_answers: newAnswers,
          quiz_completed: true,
        });
      }
      setSaving(false);
      setDone(true);
    }
  };

  if (done) {
    return (
      <main style={{
        minHeight: "100vh",
        background: "#08080f",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
        color: "white",
        textAlign: "center",
        padding: "24px",
      }}>
        <div style={{ animation: "fadeUp 0.6s ease both" }}>
          <div style={{
            width: "72px", height: "72px",
            background: "#6c63ff20",
            border: "1px solid #6c63ff40",
            borderRadius: "20px",
            margin: "0 auto 32px",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <div style={{ width: "24px", height: "24px", background: "#6c63ff", borderRadius: "6px" }}></div>
          </div>
          <h2 style={{ fontSize: "40px", fontWeight: "800", marginBottom: "16px", letterSpacing: "-1px" }}>
            Your plan is ready.
          </h2>
          <p style={{ color: "#555", fontSize: "16px", maxWidth: "400px", lineHeight: "1.7", margin: "0 auto 40px" }}>
            Based on your answers, your AI coach has built a personalized discipline plan just for you.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <a href="/habits" style={{
              background: "#6c63ff",
              color: "#fff",
              padding: "16px 40px",
              borderRadius: "10px",
              fontSize: "16px",
              fontWeight: "700",
              textDecoration: "none",
              display: "inline-block",
            }}>
              Set Up My Habits
            </a>
            <a href="/dashboard" style={{
              background: "#ffffff08",
              color: "#888",
              border: "1px solid #ffffff10",
              padding: "16px 40px",
              borderRadius: "10px",
              fontSize: "16px",
              textDecoration: "none",
              display: "inline-block",
            }}>
              Go to Dashboard
            </a>
          </div>
        </div>
        <style>{`
          @keyframes fadeUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>
      </main>
    );
  }

  return (
    <main style={{
      minHeight: "100vh",
      background: "#08080f",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: "white",
      padding: "24px",
    }}>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to { opacity: 0; transform: translateY(-24px); }
        }
        .option-btn:hover {
          transform: translateX(6px) !important;
          border-color: var(--hover-color) !important;
          color: white !important;
        }
        .next-btn:hover {
          transform: scale(1.02);
          opacity: 0.9;
        }
      `}</style>

      {/* TOP BAR */}
      <div style={{ width: "100%", maxWidth: "580px", marginBottom: "40px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
          <span style={{ fontSize: "13px", color: color, fontWeight: "600", letterSpacing: "1px", textTransform: "uppercase" }}>
            {q.category}
          </span>
          <span style={{ fontSize: "13px", color: "#333" }}>
            {current + 1} / {questions.length}
          </span>
        </div>

        <div style={{ background: "#ffffff08", borderRadius: "99px", height: "6px", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            borderRadius: "99px",
            background: `linear-gradient(90deg, ${color}, ${color}aa)`,
            width: `${progress}%`,
            transition: "width 0.5s cubic-bezier(0.4,0,0.2,1)",
            boxShadow: `0 0 12px ${color}60`,
          }}></div>
        </div>

        <div style={{ display: "flex", gap: "4px", marginTop: "12px", justifyContent: "center" }}>
          {questions.map((_, i) => (
            <div key={i} style={{
              width: i === current ? "20px" : "6px",
              height: "6px",
              borderRadius: "99px",
              background: i < current ? color : i === current ? color : "#ffffff10",
              transition: "all 0.3s ease",
              boxShadow: i === current ? `0 0 8px ${color}` : "none",
            }}></div>
          ))}
        </div>
      </div>

      {/* QUESTION CARD */}
      <div style={{
        background: "#0f0f1a",
        border: `1px solid ${color}20`,
        borderRadius: "24px",
        padding: "48px",
        width: "100%",
        maxWidth: "580px",
        animation: visible ? "fadeUp 0.35s ease both" : "fadeOut 0.25s ease both",
        boxShadow: `0 0 40px ${color}10`,
      }}>
        <h2 style={{
          fontSize: "clamp(20px, 3vw, 26px)",
          fontWeight: "800",
          marginBottom: "32px",
          lineHeight: "1.3",
          letterSpacing: "-0.5px",
        }}>
          {q.question}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "32px" }}>
          {q.options.map((option, i) => (
            <div
              key={i}
              className="option-btn"
              onClick={() => handleSelect(option)}
              style={{
                "--hover-color": color,
                background: selected === option ? color + "15" : "#ffffff04",
                border: `1px solid ${selected === option ? color : "#ffffff08"}`,
                borderRadius: "12px",
                padding: "16px 20px",
                cursor: "pointer",
                fontSize: "15px",
                color: selected === option ? "#fff" : "#777",
                fontWeight: selected === option ? "600" : "400",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                gap: "14px",
                transform: selected === option ? "translateX(6px)" : "translateX(0)",
              }}
            >
              <div style={{
                width: "22px",
                height: "22px",
                borderRadius: "50%",
                border: `2px solid ${selected === option ? color : "#2a2a2a"}`,
                background: selected === option ? color : "transparent",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                transition: "all 0.2s",
                boxShadow: selected === option ? `0 0 10px ${color}60` : "none",
              }}>
                {selected === option && (
                  <div style={{ width: "8px", height: "8px", background: "#fff", borderRadius: "50%" }}></div>
                )}
              </div>
              {option}
            </div>
          ))}
        </div>

        <button
          className="next-btn"
          onClick={handleNext}
          disabled={!selected || saving}
          style={{
            width: "100%",
            background: selected ? `linear-gradient(135deg, ${color}, ${color}bb)` : "#ffffff05",
            color: selected ? "#fff" : "#222",
            border: "none",
            borderRadius: "12px",
            padding: "18px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: selected ? "pointer" : "default",
            transition: "all 0.2s ease",
            boxShadow: selected ? `0 8px 24px ${color}40` : "none",
            letterSpacing: "0.5px",
          }}
        >
          {saving ? "Saving..." : current + 1 === questions.length ? "Complete" : "Next"}
        </button>
      </div>

      <p style={{ marginTop: "24px", fontSize: "13px", color: "#222", textAlign: "center" }}>
        {current < 5 ? "Getting to know you..." : current < 10 ? "Building your profile..." : current < 15 ? "Almost there..." : current < 19 ? "Final stretch..." : "Last question"}
      </p>
    </main>
  );
}