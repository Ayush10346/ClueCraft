import React, { useEffect, useState } from 'react';
import { fetchCases } from './api';

function ThemeView({ theme, setScreen, setActiveCase, showToast }) {
  const [cases, setCases] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchCases(theme.id);
        setCases(data);
      } catch (e) {
        showToast('Failed to load cases', 'error');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [theme.id]);

  const startCase = (c) => {
    setActiveCase(c);
    setScreen('game');
  };

  return (
    <div className="screen active" style={{ display: 'block', paddingTop: '56px' }}>
      {/* Theme Banner */}
      <div style={{
        position: 'relative',
        height: '260px',
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'flex-end',
        padding: '30px 40px',
      }}>
        {theme.image && (
          <img src={theme.image} alt={theme.name} style={{
            position: 'absolute', inset: 0, width: '100%', height: '100%',
            objectFit: 'cover', opacity: 0.35, filter: 'brightness(0.5)'
          }} />
        )}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(10,10,11,1) 0%, rgba(10,10,11,0.3) 100%)' }}></div>
        <div style={{ position: 'relative', zIndex: 2 }}>
          <div style={{ fontSize: '40px', marginBottom: '6px' }}>{theme.icon}</div>
          <h1 style={{ fontSize: '38px', marginBottom: '6px', fontFamily: 'var(--display)' }}>{theme.name}</h1>
          <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--subtle)', letterSpacing: '0.08em' }}>{theme.description}</p>
        </div>
      </div>

      {/* Cases Grid */}
      <div style={{ padding: '40px', maxWidth: '1100px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
          <h2 style={{ fontFamily: 'var(--display)', fontSize: '24px' }}>Available Crime Scenes</h2>
          <button className="btn-secondary" onClick={() => setScreen('home')} style={{ padding: '10px 20px', fontSize: '11px' }}>\u27f5 Back to Themes</button>
        </div>

        {loading && <div style={{ textAlign: 'center', padding: '60px', color: 'var(--subtle)' }}>Loading cases...</div>}

        {!loading && cases.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 20px', color: 'var(--subtle)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📁</div>
            <p>No crime scenes available under this category yet.</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>An administrator can create new cases from the Admin Console.</p>
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
          {cases.map(c => (
            <div key={c.id} onClick={() => startCase(c)} style={{
              background: 'rgba(255,255,255,0.03)',
              border: '1px solid rgba(255,255,255,0.07)',
              borderRadius: '6px',
              padding: '24px',
              cursor: 'pointer',
              transition: 'all 0.25s',
              position: 'relative',
              overflow: 'hidden',
            }}
            onMouseOver={e => { e.currentTarget.style.borderColor = 'rgba(192,57,43,0.4)'; e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.4)'; }}
            onMouseOut={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none'; }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
                <span style={{ fontSize: '28px' }}>{c.icon || '🔍'}</span>
                <div>
                  <h3 style={{ fontFamily: 'var(--display)', fontSize: '18px', margin: 0 }}>{c.title}</h3>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)', letterSpacing: '0.08em' }}>{c.location}</span>
                </div>
                <span className={`tag-pill tag-${c.difficulty || 'medium'}`} style={{ marginLeft: 'auto' }}>{c.difficulty || 'medium'}</span>
              </div>
              <p style={{ fontSize: '14px', color: 'var(--subtle)', lineHeight: 1.6, marginBottom: '14px' }}>{c.description || c.story?.substring(0, 120) + '...'}</p>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--red)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                ▸ Begin Investigation
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ThemeView;
