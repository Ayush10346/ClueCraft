import React, { useState, useEffect } from 'react';
import Home from './Home';
import Game from './Game';
import Leaderboard from './Leaderboard';
import Admin from './Admin';
import Auth from './Auth';
import ThemeView from './ThemeView';
import RecentlyPlayed from './RecentlyPlayed';
import { fetchCases, fetchLeaderboard, fetchThemes } from './api';
import './index.css';

function App() {
  const [screen, setScreen] = useState('home');
  const [cases, setCases] = useState([]);
  const [themes, setThemes] = useState([]);
  const [activeTheme, setActiveTheme] = useState(null);
  const [activeCase, setActiveCase] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [toasts, setToasts] = useState([]);
  const [settings, setSettings] = useState({ apiKey: '', maxHints: 3 });
  const [currentUser, setCurrentUser] = useState(null);
  const [showLoginMenu, setShowLoginMenu] = useState(false);

  useEffect(() => {
    // Load auth
    const stored = localStorage.getItem('cluecraft_user');
    if (stored) setCurrentUser(JSON.parse(stored));

    // Admin shortcut Ctrl+Shift+A
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault();
        const stored = localStorage.getItem('cluecraft_user');
        let user = null;
        if (stored) {
          try { user = JSON.parse(stored); } catch(err) {}
        }
        if (user && user.role === 'admin') {
          setScreen('admin');
        } else {
          setScreen('admin-login');
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Noise overlay removed to prevent GPU freeze on CSS animations

    loadData();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const loadData = async () => {
    try {
      const [c, l, t] = await Promise.all([fetchCases(), fetchLeaderboard(), fetchThemes()]);
      setCases(c);
      setLeaderboard(l);
      setThemes(t);
    } catch (e) {
      console.warn('Backend fetch failed:', e);
      showToast('Cannot connect to backend server.', 'error');
    }
  };

  const showToast = (msg, type = 'info') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  return (
    <>
      <nav>
        <div className="nav-brand">
          <div className="nav-logo">
            <svg viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="11" cy="11" r="8.5" stroke="#c0392b" strokeWidth="1.5"/>
              <circle cx="11" cy="11" r="5.5" stroke="rgba(192,57,43,0.45)" strokeWidth="1"/>
              <circle cx="11" cy="11" r="2.5" stroke="rgba(192,57,43,0.3)" strokeWidth="1"/>
              <line x1="17.5" y1="17.5" x2="25" y2="25" stroke="#c0392b" strokeWidth="2" strokeLinecap="round"/>
              <circle cx="11" cy="11" r="1" fill="#c0392b"/>
            </svg>
          </div>
          ClueCraft
          <span className="nav-brand-sub">Investigation Platform</span>
        </div>

        {!currentUser ? (
          <>
            <button className={`nav-btn ${screen === 'home' ? 'active' : ''}`} onClick={() => { loadData(); setScreen('home'); window.scrollTo(0,0); }}>Home</button>
            <button className="nav-btn" onClick={() => { setScreen('home'); setTimeout(() => document.getElementById('rules')?.scrollIntoView({behavior:'smooth'}), 100); }}>Rules</button>
            <button className="nav-btn" onClick={() => setScreen('login')}>Login</button>
          </>
        ) : (
          <>
            <button className={`nav-btn ${screen === 'home' ? 'active' : ''}`} onClick={() => { loadData(); setScreen('home'); window.scrollTo(0,0); }}>Dashboard</button>
            <button className="nav-btn" onClick={() => { setScreen('home'); setTimeout(() => document.getElementById('rules')?.scrollIntoView({behavior:'smooth'}), 100); }}>Rules</button>
            <button className={`nav-btn ${screen === 'leaderboard' ? 'active' : ''}`} onClick={() => { loadData(); setScreen('leaderboard'); }}>Leaderboard</button>
            <button className={`nav-btn ${screen === 'recent' ? 'active' : ''}`} onClick={() => setScreen('recent')}>Recently Played</button>
            <div style={{ position: 'relative', display: 'inline-block', marginLeft: '10px' }} onMouseEnter={() => setShowLoginMenu(true)} onMouseLeave={() => setShowLoginMenu(false)}>
              <button className="nav-btn" style={{color: 'var(--amber)'}}>Profile ▾</button>
              {showLoginMenu && (
                <div style={{ position: 'absolute', top: '100%', right: 0, background: 'rgba(10,10,11,0.97)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '4px', minWidth: '220px', zIndex: 100, backdropFilter: 'blur(10px)', overflow: 'hidden', textAlign: 'left', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                  <div style={{ padding: '15px', borderBottom: '1px solid rgba(255,255,255,0.05)', fontSize: '13px', color: 'var(--subtle)' }}>
                    <div>Alias: <strong style={{color: '#fff'}}>{currentUser.username}</strong></div>
                    <div style={{marginTop: '6px'}}>Clearance: <strong style={{color: '#fff', textTransform: 'capitalize'}}>{currentUser.role}</strong></div>
                  </div>
                  <button className="nav-btn" style={{ width: '100%', textAlign: 'left', padding: '12px 15px', color: '#ff6b6b' }} onClick={() => { localStorage.removeItem('cluecraft_user'); setCurrentUser(null); setScreen('home'); }}>Sign Out</button>
                </div>
              )}
            </div>
          </>
        )}
      </nav>

      {currentUser && (
        <div style={{ marginTop: '56px', padding: '12px 40px', background: 'rgba(0,0,0,0.3)', borderBottom: '1px solid rgba(255,255,255,0.05)', textAlign: 'center', fontSize: '14px', color: 'var(--subtle)', letterSpacing: '0.5px' }}>
          Welcome <strong style={{color: 'var(--amber)'}}>{currentUser.username}</strong>
        </div>
      )}

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type} show`}>{t.msg}</div>
        ))}
      </div>

      {/* Universal Back Button */}
      {screen !== 'home' && (
        <button
          onClick={() => {
            if (screen === 'themeview') { setScreen('home'); }
            else if (screen === 'game') { activeTheme ? setScreen('themeview') : setScreen('home'); }
            else { setScreen('home'); }
          }}
          style={{
            position: 'fixed',
            bottom: '28px',
            left: '28px',
            background: 'rgba(10,10,11,0.92)',
            border: '1px solid rgba(255,255,255,0.12)',
            color: 'var(--paper)',
            fontFamily: 'var(--mono)',
            fontSize: '11px',
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            padding: '10px 18px',
            cursor: 'pointer',
            zIndex: 200,
            backdropFilter: 'blur(10px)',
            display: 'flex',
            alignItems: 'center',
            gap: '7px',
            transition: 'all 0.2s',
            borderRadius: '3px',
          }}
          onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(192,57,43,0.5)'; e.currentTarget.style.color = 'var(--amber)'; }}
          onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.12)'; e.currentTarget.style.color = 'var(--paper)'; }}
        >
          &#8592; {screen === 'game' && activeTheme ? activeTheme.name : 'Home'}
        </button>
      )}

      {/* Home screen */}
      <div style={{ display: screen === 'home' ? 'block' : 'none' }}>
        <Home setScreen={setScreen} stats={{ cases: cases.length }} loadData={loadData} cases={cases} currentUser={currentUser} themes={themes} setActiveTheme={setActiveTheme} />
      </div>

      {/* Theme View */}
      {screen === 'themeview' && activeTheme && (
        <ThemeView theme={activeTheme} setScreen={setScreen} setActiveCase={setActiveCase} showToast={showToast} />
      )}

      {/* Game */}
      {screen === 'game' && (
        <Game cases={activeCase ? [activeCase] : cases} setScreen={setScreen} showToast={showToast} settings={settings} startCase={activeCase} currentUser={currentUser} activeTheme={activeTheme} />
      )}

      <div style={{ display: screen === 'leaderboard' ? 'block' : 'none' }}>
        <Leaderboard leaderboard={leaderboard} />
      </div>

      <RecentlyPlayed username={currentUser?.username} visible={screen === 'recent'} />

      <div style={{ display: screen === 'admin' ? 'block' : 'none' }}>
        {currentUser?.role === 'admin' ? (
          <Admin cases={cases} themes={themes} loadData={loadData} showToast={showToast} settings={settings} setSettings={setSettings} currentUser={currentUser} />
        ) : (
          <div style={{padding:'100px',textAlign:'center',color:'var(--amber)'}}>Access Denied. Admin clearance required.</div>
        )}
      </div>

      <div style={{ display: screen === 'signup' ? 'block' : 'none' }}>
        <Auth type="signup" setScreen={setScreen} showToast={showToast} />
      </div>
      <div style={{ display: screen === 'login' ? 'block' : 'none' }}>
        <Auth type="login" setScreen={setScreen} showToast={showToast} />
      </div>
      <div style={{ display: screen === 'admin-login' ? 'block' : 'none' }}>
        <Auth type="admin-login" setScreen={setScreen} showToast={showToast} />
      </div>
    </>
  );
}

export default App;
