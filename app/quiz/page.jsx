"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabase";

const questions = [
  {
    id: 1,
    category: "Fitness & Body",
    question: "What is your current fitness goal?",
    options: ["Lose weight", "Build muscle", "Improve endurance", "Stay healthy & active"],
  },
  {
    id: 2,
    category: "Fitness & Body",
    question: "How many days per week do you currently exercise?",
    options: ["0 days", "1–2 days", "3–4 days", "5+ days"],
  },
  {
    id: 3,
    category: "Confidence & Social",
    question: "How would you rate your confidence in social situations?",
    options: ["Very low — I avoid them", "Low — I struggle", "Average — I manage", "High — I enjoy them"],
  },
  {
    id: 4,
    category: "Confidence & Social",
    question: "What is your biggest social challenge?",
    options: ["Starting conversations", "Public speaking", "Making friends", "Being assertive"],
  },
  {
    id: 5,
    category: "Habits & Discipline",
    question: "What time do you usually wake up?",
    options: ["Before 6 AM", "6–7 AM", "7–9 AM", "After 9 AM"],
  },
  {
    id: 6,
    category: "Habits & Discipline",
    question: "What is your biggest discipline problem?",
    options: ["Procrastination", "Phone addiction", "Inconsistency", "Lack of motivation"],
  },
  {
    id: 7,
    category: "Mental Health & Mindset",
    question: "How do you handle stress?",
    options: ["Very poorly — I shut down", "Poorly — I get anxious", "Okay — I push through", "Well — I stay calm"],
  },
  {
    id: 8,
    category: "Mental Health & Mindset",
    question: "How would you describe your current mindset?",
    options: ["Fixed — I doubt my ability to change", "Struggling — I want to change but find it hard", "Growing — I'm making progress", "Strong — I believe in myself"],
  },
  {
    id: 9,
    category: "Nutrition & Diet",
    question: "How would you describe your current diet?",
    options: ["Very poor — lots of junk food", "Average — could be better", "Good — mostly healthy", "Excellent — very clean"],
  },
  {
    id: 10,
    category: "Nutrition & Diet",
    question: "What is your biggest nutrition challenge?",
    options: ["Overeating", "Skipping meals", "Eating unhealthy foods", "Not knowing what to eat"],
  },
  {
    id: 11,
    category: "Focus & Productivity",
    question: "How productive are you on a typical day?",
    options: ["Very unproductive", "Somewhat productive", "Moderately productive", "Highly productive"],
  },
  {
    id: 12,
    category: "Focus & Productivity",
    question: "What kills your focus the most?",
    options: ["Social media", "Distracting environment", "Lack of sleep", "No clear goals"],
  },
];

const categoryColors = {
  "Fitness & Body": "#34d399",
  "Confidence & Social": "#a78bfa",
  "Habits & Discipline": "#f59e0b",
  "Mental Health & Mindset": "#ec4899",
  "Nutrition & Diet": "#3b82f6",
  "Focus & Productivity": "#6c63ff",
};

export default function Quiz() {
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState({});
  const [selected, setSelected] = useState(null);
  const [done, setDone] = useState(false);
  const [saving, setSaving] = useState(false);

  const q = questions[current];
  const progress = ((current) / questions.length) * 100;
  const color = categoryColors[q?.category] || "#6c63ff";

  const handleSelect = (option) => {
    setSelected(option);
  };

  const handleNext = async () => {
    if (!selected) return;
    const newAnswers = { ...answers, [q.id]: { question: q.question, answer: selected, category: q.category } };
    setAnswers(newAnswers);
    setSelected(null);

    if (current + 1 < questions.length) {
      setCurrent(current + 1);
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
        <div>
          <div style={{ fontSize: "64px", marginBottom: "24px" }}>🏆</div>
          <h2 style={{ fontSize: "40px", fontWeight: "800", marginBottom: "16px", letterSpacing: "-1px" }}>
            Your plan is ready.
          </h2>
          <p style={{ color: "#555", fontSize: "16px", marginBottom: "40px", maxWidth: "400px", lineHeight: "1.7" }}>
            Based on your answers, your AI coach has built a personalized discipline plan just for you.
          </p>
          <a href="/dashboard" style={{
            background: "#6c63ff",
            color: "#fff",
            padding: "16px 40px",
            borderRadius: "10px",
            fontSize: "16px",
            fontWeight: "700",
            textDecoration: "none",
            display: "inline-block",
          }}>
            Go to Dashboard
          </a>
        </div>
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

      {/* PROGRESS BAR */}
      <div style={{ width: "100%", maxWidth: "600px", marginBottom: "48px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "10px" }}>
          <span style={{ fontSize: "12px", color: "#555", letterSpacing: "1px" }}>
            Question {current + 1} of {questions.length}
          </span>
          <span style={{ fontSize: "12px", color: color }}>
            {q.category}
          </span>
        </div>
        <div style={{ background: "#ffffff0a", borderRadius: "99px", height: "4px" }}>
          <div style={{
            height: "100%",
            borderRadius: "99px",
            background: color,
            width: `${progress}%`,
            transition: "width 0.4s ease",
          }}></div>
        </div>
      </div>

      {/* QUESTION CARD */}
      <div style={{
        background: "#0f0f1a",
        border: "1px solid #ffffff10",
        borderRadius: "20px",
        padding: "48px",
        width: "100%",
        maxWidth: "600px",
      }}>
        <div style={{
          display: "inline-block",
          background: color + "20",
          color: color,
          fontSize: "11px",
          letterSpacing: "2px",
          padding: "4px 12px",
          borderRadius: "99px",
          marginBottom: "24px",
          textTransform: "uppercase",
        }}>
          {q.category}
        </div>

        <h2 style={{ fontSize: "24px", fontWeight: "800", marginBottom: "32px", lineHeight: "1.3", letterSpacing: "-0.5px" }}>
          {q.question}
        </h2>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "32px" }}>
          {q.options.map((option, i) => (
            <div
              key={i}
              onClick={() => handleSelect(option)}
              style={{
                background: selected === option ? color + "20" : "#ffffff05",
                border: `1px solid ${selected === option ? color : "#ffffff10"}`,
                borderRadius: "12px",
                padding: "16px 20px",
                cursor: "pointer",
                fontSize: "15px",
                color: selected === option ? "#fff" : "#888",
                fontWeight: selected === option ? "600" : "400",
                transition: "all 0.15s",
                display: "flex",
                alignItems: "center",
                gap: "12px",
              }}
            >
              <div style={{
                width: "20px",
                height: "20px",
                borderRadius: "50%",
                border: `2px solid ${selected === option ? color : "#333"}`,
                background: selected === option ? color : "transparent",
                flexShrink: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}>
                {selected === option && <div style={{ width: "8px", height: "8px", background: "#fff", borderRadius: "50%" }}></div>}
              </div>
              {option}
            </div>
          ))}
        </div>

        <button
          onClick={handleNext}
          disabled={!selected || saving}
          style={{
            width: "100%",
            background: selected ? color : "#ffffff0a",
            color: selected ? "#fff" : "#333",
            border: "none",
            borderRadius: "10px",
            padding: "16px",
            fontSize: "16px",
            fontWeight: "700",
            cursor: selected ? "pointer" : "default",
            transition: "all 0.2s",
          }}
        >
          {saving ? "Saving..." : current + 1 === questions.length ? "Complete" : "Next →"}
        </button>
      </div>
    </main>
  );
}