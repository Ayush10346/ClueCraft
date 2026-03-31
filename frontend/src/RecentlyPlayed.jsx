import React, { useState, useEffect } from 'react';
import { fetchHistory } from './api';

function RecentlyPlayed({ username, visible }) {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (visible && username) {
      setLoading(true);
      fetchHistory(username)
        .then(data => setHistory(data))
        .catch(() => {})
        .finally(() => setLoading(false));
    }
  }, [visible, username]);

  if (!visible) return null;

  return (
    <div style={{ paddingTop: '56px', minHeight: '80vh', padding: '80px 40px 60px' }}>
      <div style={{ maxWidth: '800px', margin: '0 auto' }}>
        <h2 style={{ fontFamily: 'var(--display)', fontSize: '34px', marginBottom: '6px' }}>Investigation History</h2>
        <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--subtle)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '36px' }}>Your most recent 20 cases</p>

        {loading && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--subtle)' }}>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.1em' }}>LOADING RECORDS...</div>
          </div>
        )}

        {!loading && !username && (
          <div style={{ textAlign: 'center', padding: '60px', color: 'var(--subtle)' }}>
            <div style={{ fontSize: '40px', marginBottom: '14px', opacity: 0.5 }}>🔒</div>
            <p>Please log in to view your investigation history.</p>
          </div>
        )}

        {!loading && username && history.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px', color: 'var(--subtle)' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.4 }}>📁</div>
            <p style={{ fontSize: '16px' }}>No investigations on record yet.</p>
            <p style={{ fontSize: '13px', marginTop: '8px' }}>Select a crime category on the Dashboard and solve your first case!</p>
          </div>
        )}

        {!loading && history.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {history.map((h, idx) => (
              <div key={h.id} style={{
                display: 'grid',
                gridTemplateColumns: '36px 1fr auto auto auto',
                alignItems: 'center',
                gap: '16px',
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.06)',
                borderRadius: '4px',
                borderLeft: `3px solid ${h.result === 'solved' ? '#1a4a45' : 'var(--red)'}`,
                transition: 'background 0.2s',
              }}>
                {/* Index */}
                <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--subtle)' }}>
                  {String(idx + 1).padStart(2, '0')}
                </div>
                {/* Case info */}
                <div>
                  <div style={{ fontFamily: 'var(--display)', fontSize: '17px', marginBottom: '3px' }}>{h.case_title}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)', letterSpacing: '0.08em' }}>
                    {h.theme_name} &nbsp;•&nbsp; {new Date(h.played_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </div>
                </div>
                {/* Result badge */}
                <div style={{
                  fontFamily: 'var(--mono)',
                  fontSize: '9px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  padding: '3px 10px',
                  border: '1px solid',
                  borderColor: h.result === 'solved' ? 'rgba(93,191,176,0.4)' : 'rgba(192,57,43,0.4)',
                  color: h.result === 'solved' ? '#5dbfb0' : 'var(--red)',
                  background: h.result === 'solved' ? 'rgba(93,191,176,0.06)' : 'rgba(192,57,43,0.06)',
                }}>
                  {h.result === 'solved' ? '✓ Solved' : '✕ Failed'}
                </div>
                {/* Time */}
                <div style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--subtle)', minWidth: '50px', textAlign: 'right' }}>
                  {h.time_taken}
                </div>
                {/* Score */}
                <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', color: 'var(--amber)', minWidth: '70px', textAlign: 'right' }}>
                  {h.score?.toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default RecentlyPlayed;
