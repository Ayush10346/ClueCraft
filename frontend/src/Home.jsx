import React, { useEffect, useState } from 'react';
import './Home.css';

function Home({ setScreen, stats, loadData, cases, currentUser, themes, setActiveTheme }) {
  const [animateIn, setAnimateIn] = useState(false);

  useEffect(() => {
    setTimeout(() => setAnimateIn(true), 100);
  }, []);

  const handleThemeClick = (theme) => {
    if (!currentUser) {
      setScreen('login');
      return;
    }
    setActiveTheme(theme);
    setScreen('themeview');
  };

  return (
    <div id="screen-home" className="screen active" style={{ display: 'block' }}>
      
      {/* Hero Section */}
      <div className={`home-hero-massive ${animateIn ? 'visible' : ''}`}>
        <div className="hero-bg-glow"></div>
        <div className="fp-ring ring-1"></div>
        <div className="fp-ring ring-2"></div>
        <div className="fp-ring ring-3"></div>
        
        <div className="hero-content">
          <div className="badge pulse" style={{ margin: '0 auto 20px auto' }}>Interactive Investigation Platform</div>
          <h1 className="home-title massive-title">
            <span className="title-word-1">Clue</span><span className="title-word-2 home-title-accent">Craft</span>
          </h1>
          <div className="home-divider expand" style={{ margin: '30px auto' }}></div>
          <p className="home-sub fade-up" style={{ maxWidth: '600px', margin: '0 auto 40px auto', fontSize: '18px', lineHeight: '1.6' }}>
            Piece together evidence, interrogate suspects, and deliver justice in AI-generated, logically watertight crime scenarios.
          </p>
          
          {!currentUser && (
            <div className="home-action-group fade-up-delayed">
              <button className="btn-primary hero-btn" onClick={() => setScreen('login')} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '16px', padding: '16px 32px' }}>
                <span>🔍</span> Start Playing
              </button>
            </div>
          )}
          
          {!currentUser && (
            <div className="auth-hint fade-up-delayed-2" style={{ marginTop: '25px', fontSize: '14px' }}>
              <span style={{ color: 'var(--subtle)' }}>Agent credentials required to play. </span>
              <a href="#" style={{ color: 'var(--amber)', textDecoration: 'none', fontWeight: 'bold' }} onClick={(e) => { e.preventDefault(); setScreen('login'); }}>Login</a>
              <span style={{ color: 'var(--subtle)', margin: '0 8px' }}>or</span>
              <a href="#" style={{ color: 'var(--amber)', textDecoration: 'none', fontWeight: 'bold' }} onClick={(e) => { e.preventDefault(); setScreen('signup'); }}>Create Profile</a>
            </div>
          )}
        </div>
      </div>

      {/* Theme Cards Section */}
      <div className={`themes-section ${animateIn ? 'visible' : ''}`}>
        <h2 className="section-heading" style={{ textAlign: 'center', marginBottom: '15px', fontSize: '28px', color: 'var(--text)' }}>Choose Your Investigation</h2>
        <p style={{ textAlign: 'center', fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--subtle)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '40px' }}>Select a crime category to begin</p>
        
        <div className="themes-grid">
          {themes && themes.map((theme, idx) => (
            <div key={theme.id} className="theme-card" onClick={() => handleThemeClick(theme)} style={{ animationDelay: `${idx * 0.15}s` }}>
              <div className="theme-card-img">
                {theme.image ? (
                  <img src={theme.image} alt={theme.name} />
                ) : (
                  <div style={{ width: '100%', height: '100%', background: 'rgba(192,57,43,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '60px' }}>{theme.icon}</div>
                )}
                <div className="theme-card-overlay"></div>
              </div>
              <div className="theme-card-body">
                <span className="theme-card-icon">{theme.icon}</span>
                <h3 className="theme-card-title">{theme.name}</h3>
                <p className="theme-card-desc">{theme.description}</p>
                <div className="theme-card-footer">
                  <span>{theme.case_count || 0} Cases</span>
                  <span className="theme-card-arrow">▸</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {(!themes || themes.length === 0) && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--subtle)' }}>
            No investigation categories available yet.
          </div>
        )}
      </div>

      {/* Rules Section */}
      <div id="rules" className={`rules-section ${animateIn ? 'visible' : ''}`}>
        <h2 className="section-heading" style={{ textAlign: 'center', marginBottom: '50px', fontSize: '28px', color: 'var(--text)' }}>Protocol & Rules of Engagement</h2>
        <div className="rules-grid">
          
          <div className="rule-card">
            <div className="rule-icon">🕵️</div>
            <h3 className="rule-title">1. Review the Scene</h3>
            <p className="rule-desc">Every case begins with a cinematic story. Read the brief carefully. Real killers make mistakes, but they also plant false leads.</p>
          </div>

          <div className="rule-card">
            <div className="rule-icon">🔍</div>
            <h3 className="rule-title">2. Uncover Evidence</h3>
            <p className="rule-desc">You are given up to 6 clues per case. However, be careful—one clue is strictly guaranteed to be a misleading red herring!</p>
          </div>

          <div className="rule-card">
            <div className="rule-icon">⏱️</div>
            <h3 className="rule-title">3. Beat the Clock</h3>
            <p className="rule-desc">Your score drops the longer you take. Using hints dramatically reduces your final score. Fast, sharp deductions yield higher ranks.</p>
          </div>

          <div className="rule-card">
            <div className="rule-icon">⚖️</div>
            <h3 className="rule-title">4. Make an Accusation</h3>
            <p className="rule-desc">Review the suspects' motives and alibis. Once you piece the logic together, lock in your final accusation. Wrong guesses fail the case.</p>
          </div>

        </div>
      </div>
    </div>
  );
}

export default Home;
