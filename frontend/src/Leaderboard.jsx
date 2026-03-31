import React from 'react';

function Leaderboard({ leaderboard }) {
  const ranks = ['gold', 'silver', 'bronze'];
  
  return (
    <div id="screen-leaderboard" className="screen active" style={{ display: 'block' }}>
      <div className="lb-header">
        <h2 className="lb-title">Hall of Justice</h2>
        <div className="lb-sub">Top ClueCraft detectives by score</div>
      </div>
      <div className="lb-table">
        <div className="lb-row header">
          <div>#</div><div>Detective</div><div>Case</div><div>Score</div><div>Time</div>
        </div>
        <div>
          {leaderboard.map((entry, i) => (
            <div className="lb-row" key={i}>
              <div className={`lb-rank ${ranks[i] || ''}`}>{i + 1}</div>
              <div>
                <div className="lb-name">{entry.name}</div>
                {entry.badge && <span className="lb-badge">{entry.badge}</span>}
              </div>
              <div className="lb-case">{entry.case_title}</div>
              <div className="lb-score">{Number(entry.score).toLocaleString()}</div>
              <div className="lb-time">{entry.time}</div>
            </div>
          ))}
          {leaderboard.length === 0 && (
            <div style={{ padding: '20px', textAlign: 'center', color: 'var(--subtle)' }}>No entries yet.</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Leaderboard;
