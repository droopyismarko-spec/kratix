"use client";

export default function Home() {
  return (
    <main style={{
      minHeight: '100vh',
      background: '#08080f',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif',
      color: 'white',
    }}>

      {/* NAVBAR */}
      <nav style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '20px 48px',
        borderBottom: '1px solid #ffffff0f',
        backdropFilter: 'blur(10px)',
        position: 'sticky',
        top: 0,
        background: '#08080fcc',
        zIndex: 100,
      }}>
        <h1 style={{ fontSize: '22px', fontWeight: '800', color: '#fff', letterSpacing: '1px' }}>
          Kratix
        </h1>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="/login" style={{ color: '#888', fontSize: '14px', textDecoration: 'none' }}>
            Sign in
          </a>
          <a href="/login" style={{
            background: '#6c63ff',
            color: '#fff',
            padding: '10px 22px',
            borderRadius: '8px',
            fontSize: '14px',
            fontWeight: '600',
            textDecoration: 'none',
          }}>
            Get Started Free
          </a>
        </div>
      </nav>

      {/* HERO */}
      <section style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '120px 24px 100px',
      }}>
        <div style={{
          background: '#6c63ff20',
          border: '1px solid #6c63ff40',
          borderRadius: '99px',
          padding: '6px 18px',
          fontSize: '13px',
          color: '#a89fff',
          marginBottom: '32px',
          display: 'inline-block',
        }}>
          Free alternative to Critique AI
        </div>
        <h2 style={{
          fontSize: 'clamp(40px, 7vw, 88px)',
          fontWeight: '800',
          lineHeight: '1.05',
          marginBottom: '24px',
          maxWidth: '900px',
          letterSpacing: '-2px',
        }}>
          Build Discipline.<br />
          <span style={{
            background: 'linear-gradient(135deg, #6c63ff, #a78bfa)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}>
            Master Yourself.
          </span>
        </h2>
        <p style={{
          fontSize: '18px',
          color: '#666',
          maxWidth: '500px',
          lineHeight: '1.7',
          marginBottom: '48px',
        }}>
          AI habit tracking, confidence coaching, food scanning and posture analysis — completely free, forever. No subscriptions.
        </p>
        <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href="/login" style={{
            background: '#6c63ff',
            color: '#fff',
            padding: '16px 40px',
            borderRadius: '10px',
            fontSize: '16px',
            fontWeight: '700',
            textDecoration: 'none',
          }}>
            Start for Free
          </a>
          <a href="#features" style={{
            background: '#ffffff0a',
            color: '#888',
            border: '1px solid #ffffff15',
            padding: '16px 40px',
            borderRadius: '10px',
            fontSize: '16px',
            textDecoration: 'none',
          }}>
            See Features
          </a>
        </div>
      </section>

      {/* PREVIEW CARD */}
      <section style={{ display: 'flex', justifyContent: 'center', padding: '0 24px 100px' }}>
        <div style={{
          background: '#0f0f1a',
          border: '1px solid #ffffff10',
          borderRadius: '20px',
          padding: '32px',
          maxWidth: '680px',
          width: '100%',
        }}>
          <div style={{ fontSize: '12px', color: '#555', letterSpacing: '2px', marginBottom: '20px', textTransform: 'uppercase' }}>Today's Focus</div>
          <div style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>Social Confidence</div>
          {[
            { time: '8:00 AM', task: 'Morning Reflection', dur: '15 min' },
            { time: '2:00 PM', task: 'Voice Practice', dur: '15 min' },
            { time: '8:00 PM', task: 'Evening Review', dur: '15 min' },
          ].map((t, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              background: '#ffffff05',
              border: '1px solid #ffffff08',
              borderRadius: '10px',
              padding: '16px 20px',
              marginBottom: '10px',
            }}>
              <div style={{ width: '36px', height: '36px', background: '#6c63ff20', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '8px', height: '8px', background: '#6c63ff', borderRadius: '50%' }}></div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: '15px', fontWeight: '600' }}>{t.task}</div>
                <div style={{ fontSize: '12px', color: '#555' }}>{t.time} · {t.dur}</div>
              </div>
              <div style={{ width: '20px', height: '20px', border: '2px solid #333', borderRadius: '50%' }}></div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" style={{ padding: '80px 48px 120px', maxWidth: '1200px', margin: '0 auto' }}>
        <p style={{ textAlign: 'center', fontSize: '12px', letterSpacing: '3px', color: '#6c63ff', marginBottom: '16px', textTransform: 'uppercase' }}>
          Features
        </p>
        <h3 style={{ textAlign: 'center', fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: '800', marginBottom: '64px', letterSpacing: '-1px' }}>
          Everything Critique AI charges for.<br />
          <span style={{ color: '#555' }}>Free.</span>
        </h3>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '16px',
        }}>
          {[
            { title: 'Habit Tracker', desc: 'Build unbreakable daily habits with streaks, reminders and AI accountability.' },
            { title: 'AI Confidence Coach', desc: 'Chat with your personal AI coach anytime. Real feedback, not generic advice.' },
            { title: 'Food Scanner', desc: 'Snap a photo of your meal and instantly get macros and calorie estimates.' },
            { title: 'Daily Discipline Plan', desc: 'A personalized morning, afternoon and evening plan built around your goals.' },
            { title: 'Posture Analysis', desc: 'Upload a photo and get instant AI feedback on your posture and how to fix it.' },
            { title: 'Friends Leaderboard', desc: 'Compete with friends on streaks. Discipline is better with rivals.' },
          ].map((f, i) => (
            <div key={i} style={{
              background: '#0f0f1a',
              border: '1px solid #ffffff0a',
              borderRadius: '16px',
              padding: '32px',
              transition: 'border-color 0.2s',
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = '#6c63ff40'}
            onMouseLeave={e => e.currentTarget.style.borderColor = '#ffffff0a'}
            >
              <div style={{ width: '40px', height: '40px', background: '#6c63ff15', borderRadius: '10px', marginBottom: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: '12px', height: '12px', background: '#6c63ff', borderRadius: '3px' }}></div>
              </div>
              <h4 style={{ fontSize: '17px', fontWeight: '700', marginBottom: '10px' }}>{f.title}</h4>
              <p style={{ fontSize: '14px', color: '#555', lineHeight: '1.7' }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        textAlign: 'center',
        padding: '100px 24px',
        borderTop: '1px solid #ffffff08',
        background: '#0c0c18',
      }}>
        <h3 style={{ fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: '800', marginBottom: '16px', letterSpacing: '-1px' }}>
          Ready to level up?
        </h3>
        <p style={{ color: '#555', fontSize: '16px', marginBottom: '40px' }}>
          Free forever. No credit card. No catch.
        </p>
        <a href="/login" style={{
          background: '#6c63ff',
          color: '#fff',
          padding: '18px 56px',
          borderRadius: '10px',
          fontSize: '16px',
          fontWeight: '700',
          textDecoration: 'none',
          display: 'inline-block',
        }}>
          Join for Free
        </a>
      </section>

      {/* FOOTER */}
      <footer style={{
        textAlign: 'center',
        padding: '32px',
        borderTop: '1px solid #ffffff08',
        color: '#2a2a2a',
        fontSize: '13px',
      }}>
        Kratix © 2026 — Free Forever
      </footer>

    </main>
  )
}