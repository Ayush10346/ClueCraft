import React, { useState, useEffect } from 'react';
import MazeMiniGame from './MazeMiniGame';
import { SCENE_SVGS } from './svgs';
import { saveLeaderboard, saveHistory } from './api';

function Game({ cases, setScreen, showToast, settings, startCase, currentUser, activeTheme }) {
  const [currentCase, setCurrentCase] = useState(null);
  const [revealedClues, setRevealedClues] = useState(new Set());
  const [selectedSuspect, setSelectedSuspect] = useState(null);
  const [hintsUsed, setHintsUsed] = useState(0);
  const [score, setScore] = useState(0);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [gamePhase, setGamePhase] = useState('intro');

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    if (!cases || cases.length === 0) {
      showToast('No cases available. Please create one in Admin Panel.', 'error');
      setScreen('home');
      return;
    }
    const c = cases[Math.floor(Math.random() * cases.length)];
    setCurrentCase(c);
    setRevealedClues(new Set());
    setSelectedSuspect(null);
    setHintsUsed(0);
    setScore(0);
    setIsGameOver(false);
    setGamePhase('intro');
  };

  useEffect(() => {
    if (currentCase) {
      const s = Math.max(0, 10000 - hintsUsed * 1000);
      setScore(s);
    }
  }, [hintsUsed, currentCase]);

  if (!currentCase) return <div style={{padding:'100px',textAlign:'center'}}>Loading case...</div>;

  const revealNextClue = () => {
    const nextIdx = revealedClues.size;
    if (nextIdx >= currentCase.clues.length) {
      return;
    }
    setRevealedClues(new Set([...revealedClues, nextIdx]));
    showToast('New Evidence Recovered', 'info');
  };

  const useHint = () => {
    const rem = settings.maxHints - hintsUsed;
    if (rem <= 0) return;
    setHintsUsed(u => u + 1);
    showToast('Hint used - score penalty applied', 'info');
  };

  const accuse = () => {
    if (!selectedSuspect) return;
    const correct = selectedSuspect === currentCase.killer;
    setIsCorrect(correct);
    setIsGameOver(true);
    
    // Save to leaderboard immediately if correct
    if (correct) {
      saveLeaderboard({
        name: currentUser?.username || 'Anonymous',
        case_title: currentCase.title,
        score: score,
        time: "N/A",
        badge: score > 8000 ? 'Ace' : ''
      }).catch(console.error);
      // Save play history
      if (currentUser) {
        saveHistory({
          username: currentUser.username,
          case_id: currentCase.id,
          case_title: currentCase.title,
          theme_name: activeTheme?.name || 'Unknown',
          score: score,
          time_taken: "N/A",
          result: 'solved'
        }).catch(console.error);
      }
    } else if (currentUser) {
      // Save failed attempt too
      saveHistory({
        username: currentUser.username,
        case_id: currentCase.id,
        case_title: currentCase.title,
        theme_name: activeTheme?.name || 'Unknown',
        score: Math.floor(score * 0.1),
        time_taken: "N/A",
        result: 'failed'
      }).catch(console.error);
    }
  };

  const confidencePct = Math.min(100, revealedClues.size * 15 + (selectedSuspect ? 20 : 0) + hintsUsed * 5);
  const confStates = ['Select a suspect', 'Gathering evidence…', 'Building the case…', 'Strong lead — commit?', 'High confidence'];
  const confStateStr = confStates[Math.min(4, Math.floor(confidencePct / 25))];

  return (
    <div id="screen-game" className="screen active" style={{ display: 'block' }}>
      <div className="game-layout">
        <div className="game-main">
          <div className="case-meta">
            <div className="case-num">CASE #{currentCase.id.substring(0,6)}</div>
            <span className={`tag-pill tag-${currentCase.difficulty}`}>{currentCase.difficulty.toUpperCase()}</span>
            <div className="case-score-display">Score: <span style={{ color: 'var(--amber)', marginLeft: '3px' }}>{score.toLocaleString()}</span></div>
          </div>

          {gamePhase === 'intro' && (
            <div className="fade-in-section">
              <div className="case-title-area" style={{ textAlign: 'center', marginBottom: '40px' }}>
                <h2 className="case-title" style={{ fontSize: '48px', color: 'var(--red)', textShadow: '0 0 15px var(--red)' }}>{currentCase.title}</h2>
                <div className="case-location" style={{ justifyContent: 'center', fontSize: '14px' }}>LOCATION: {currentCase.location}</div>
              </div>
              
              <div className="crime-scene" style={{ marginBottom: '40px', border: '2px solid var(--red)', boxShadow: '0 0 20px rgba(0,229,255,0.2)' }}>
                {currentCase.image ? (
                  <img className="crime-scene-img loaded" src={currentCase.image} alt="Scene" />
                ) : (
                  <div className="crime-scene-svg-wrap" dangerouslySetInnerHTML={{ __html: SCENE_SVGS[currentCase.id] || `<div style="width:100%;height:100%;display:flex;align-items:center;justify-content:center;font-size:80px;background:#050814;">${currentCase.icon}</div>` }}></div>
                )}
                <div className="scene-overlay"></div>
                <div className="scene-tape">
                  <div className="scene-tape-text">CRIME SCENE — DO NOT CROSS — CLUECRAFT INVESTIGATION — RESTRICTED ACCESS — CRIME SCENE — DO NOT CROSS — CLUECRAFT INVESTIGATION — RESTRICTED ACCESS —&nbsp;&nbsp;&nbsp;</div>
                </div>
              </div>
              
              <div className="story-section" style={{ background: 'rgba(0,229,255,0.05)', padding: '24px', borderLeft: '4px solid var(--red)' }}>
                <div className="section-label" style={{ fontSize: '12px' }}>Incident Report</div>
                <div className="story-text" style={{ fontSize: '18px', borderLeft: 'none', paddingLeft: '0' }}>{currentCase.story}</div>
              </div>
              
              <div style={{ textAlign: 'center', marginTop: '40px' }}>
                <button className="btn-primary" style={{ fontSize: '16px', padding: '18px 60px' }} onClick={() => setGamePhase('investigation')}>
                  BEGIN INVESTIGATION
                </button>
              </div>
            </div>
          )}

          {gamePhase === 'investigation' && (
            <div className="fade-in-section">
              <div className="case-title-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="case-title" style={{ fontSize: '24px' }}>{currentCase.title}</h2>
                  <div className="case-location" style={{ color: 'var(--subtle)' }}>{currentCase.location}</div>
                </div>
                <button className="btn-primary" style={{ padding: '12px 24px', fontSize: '10px' }} onClick={() => setGamePhase('interrogation')}>
                  PROCEED TO INTERROGATION
                </button>
              </div>

              <div className="progress-dots" style={{ marginBottom: '30px', justifyContent: 'center' }}>
                {currentCase.clues.map((_, i) => (
                  <div key={i} className={`dot ${revealedClues.has(i) ? 'done' : ''}`} style={{ width: '12px', height: '12px' }}></div>
                ))}
              </div>

              <div className="story-section">
                <div className="section-label" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>EVIDENCE LOG</span>
                  <span style={{ color: 'var(--subtle)', letterSpacing: '0' }}>
                    {revealedClues.size} / {currentCase.clues.length} Collected
                  </span>
                </div>
                
                {revealedClues.size === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px', border: '1px dashed rgba(0,229,255,0.2)', color: 'var(--subtle)', fontStyle: 'italic' }}>
                    Evidence board is empty. Navigate the sector to find clues.
                  </div>
                )}
                
                <div className="clues-grid" style={{ gridTemplateColumns: '1fr', gap: '15px' }}>
                  {Array.from(revealedClues).map((clueIdx) => (
                    <div key={clueIdx} className="clue-card revealed slide-in-top">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                        <div className="clue-num" style={{ margin: 0, fontSize: '11px', background: 'var(--red)', color: '#000', padding: '2px 8px', fontWeight: 'bold' }}>
                          EVIDENCE {String(clueIdx + 1).padStart(2, '0')}
                        </div>
                        <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, var(--red), transparent)' }}></div>
                      </div>
                      <div className="clue-text" style={{ fontSize: '14px', lineHeight: '1.6' }}>{currentCase.clues[clueIdx].text}</div>
                    </div>
                  ))}
                </div>
                
                <MazeMiniGame 
                    totalClues={currentCase.clues.length} 
                    revealedCount={revealedClues.size}
                    onClueFound={revealNextClue} 
                    onComplete={() => setGamePhase('interrogation')}
                />
              </div>
            </div>
          )}

          {gamePhase === 'interrogation' && (
            <div className="fade-in-section">
              <div className="case-title-area" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 className="case-title" style={{ fontSize: '24px', color: 'var(--amber)' }}>INTERROGATION LOG</h2>
                  <div className="case-location" style={{ color: 'var(--subtle)' }}>{currentCase.title}</div>
                </div>
                <button className="btn-secondary" style={{ padding: '12px 24px', fontSize: '10px', borderColor: 'var(--subtle)', color: 'var(--subtle)' }} onClick={() => setGamePhase('investigation')}>
                  BACK TO EVIDENCE
                </button>
              </div>

              <div className="crime-scene" style={{ height: '120px', aspectRatio: 'auto', marginBottom: '30px', border: '1px solid rgba(0,230,118,0.3)', boxShadow: '0 0 15px rgba(0,230,118,0.1)' }}>
                 <div className="crime-scene-svg-wrap" style={{ background: '#050814', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--amber)', fontSize: '24px', letterSpacing: '0.2em' }}>
                    INTERROGATION ROOM ACTIVE
                 </div>
              </div>
              
              <div className="story-section">
                <div className="section-label">Suspect Profiles</div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                  {currentCase.suspects.map((s, i) => (
                    <div key={i} className={`suspect-card ${selectedSuspect === s.name ? 'selected open' : ''}`} onClick={() => setSelectedSuspect(s.name)}>
                      <div className="suspect-name">{s.name}</div>
                      <div className="suspect-role" style={{ color: 'var(--red)' }}>{s.role}</div>
                      <div className="suspect-motive">Motive: {s.motive}</div>
                      <div className="suspect-expand"><div className="suspect-alibi" style={{ color: 'var(--amber)', marginTop: '10px', borderTop: '1px solid rgba(0,230,118,0.2)', paddingTop: '10px' }}>Alibi Statement: {s.alibi}</div></div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Sidebar Logic */}
        <div className="game-sidebar">
          <div className="sidebar-section">
            <div className="sidebar-label" style={{ color: gamePhase === 'interrogation' ? 'var(--amber)' : 'var(--red)' }}>OPERATION STATUS</div>
            <div style={{ fontFamily: 'var(--mono)', fontSize: '14px', marginBottom: '8px' }}>
              PHASE: {gamePhase.toUpperCase()}
            </div>
            <div className="confidence-bar-bg"><div className="confidence-bar" style={{ width: `${confidencePct}%`, background: gamePhase === 'interrogation' ? 'var(--amber)' : 'var(--red)' }}></div></div>
            <div className="confidence-label"><span>{confidencePct}%</span><span>{confStateStr}</span></div>
          </div>
          
          <div className="sidebar-section">
            <div className="sidebar-label">Collected Intelligence</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px' }}>
                <div style={{ fontSize: '20px', color: 'var(--red)', fontFamily: 'var(--display)' }}>{revealedClues.size}</div>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--subtle)' }}>Evidence Artifacts</div>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.05)', padding: '10px' }}>
                <div style={{ fontSize: '20px', color: 'var(--amber)', fontFamily: 'var(--display)' }}>{currentCase.suspects.length}</div>
                <div style={{ fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em', color: 'var(--subtle)' }}>Persons of Interest</div>
              </div>
            </div>
          </div>
          
          {(gamePhase === 'investigation' || gamePhase === 'interrogation') && (
            <div className="sidebar-section">
              <div className="sidebar-label">HQ Support</div>
              <button className="hint-btn" onClick={useHint} disabled={hintsUsed >= settings.maxHints}>
                Request Hint ({settings.maxHints - hintsUsed} left)
              </button>
              <div className={`hint-log ${hintsUsed > 0 ? 'has-hints' : ''}`}>
                {hintsUsed > 0 && Array.from({ length: hintsUsed }).map((_, i) => (
                  <div key={i} style={{ marginBottom: '5px', paddingBottom: '5px', borderBottom: '1px solid rgba(0,230,118,0.2)' }}>
                    HQ: Consider evidence {currentCase.clues.findIndex((cl)=>!cl.misleading)+1}. Look at the motives closely.
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {gamePhase === 'interrogation' && (
            <div className="sidebar-section" style={{ marginTop: '20px', paddingTop: '20px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <div className="sidebar-label" style={{ color: 'var(--red)' }}>FINAL DECISION</div>
              {selectedSuspect ? (
                <div style={{ marginBottom: '15px', padding: '10px', border: '1px solid var(--red)', background: 'rgba(0,229,255,0.1)' }}>
                  <div style={{ fontSize: '10px', color: 'var(--subtle)' }}>TARGET ACCUSED:</div>
                  <div style={{ fontSize: '18px', color: 'var(--paper)', fontFamily: 'var(--display)' }}>{selectedSuspect}</div>
                </div>
              ) : (
                <div style={{ marginBottom: '15px', color: 'var(--subtle)', fontSize: '12px', fontStyle: 'italic' }}>Select a target from the suspect list...</div>
              )}
              
              <button className="btn-primary" style={{ width: '100%', padding: '16px' }} onClick={accuse} disabled={!selectedSuspect}>
                FILE ARREST WARRANT
              </button>
              <p style={{ fontFamily: 'var(--mono)', fontSize: '9px', color: 'var(--amber)', textAlign: 'center', marginTop: '10px', letterSpacing: '0.07em' }}>WARNING: Action cannot be undone</p>
            </div>
          )}
        </div>
      </div>

      <div className={`modal-overlay ${isGameOver ? 'open' : ''}`}>
        <div className="verdict-modal">
          <div className="verdict-icon">{isCorrect ? '⚖️' : '🔒'}</div>
          <h2 className={`verdict-title ${isCorrect ? 'correct' : 'wrong'}`}>{isCorrect ? 'Case Solved!' : 'Wrong Accusation'}</h2>
          {isCorrect && <div style={{ color: 'var(--amber)', fontSize: '18px', marginBottom: '10px', textAlign: 'center', fontWeight: 'bold', textTransform: 'uppercase', letterSpacing: '0.1em' }}>🎉 Congratulations, Detective! 🎉</div>}
          <div className="verdict-subtitle">
            {isCorrect ? `${selectedSuspect} is guilty` : `${selectedSuspect} is innocent — the killer was ${currentCase.killer}`}
          </div>
          <p className="verdict-explanation">{currentCase.explanation}</p>
          <div className="verdict-score-grid">
            <div className="verdict-score-item"><div className="verdict-score-num" style={{ color: 'var(--amber)' }}>{(isCorrect ? score : Math.floor(score * 0.1)).toLocaleString()}</div><div className="verdict-score-label">Final Score</div></div>
            <div className="verdict-score-item"><div className="verdict-score-num" style={{ color: '#1a4a45' }}>{revealedClues.size}/{currentCase.clues.length}</div><div className="verdict-score-label">Clues Revealed</div></div>
            <div className="verdict-score-item"><div className="verdict-score-num" style={{ color: 'var(--muted)' }}>{hintsUsed}</div><div className="verdict-score-label">Hints Used</div></div>
          </div>
          <div className="verdict-actions" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
            <button className="btn-primary" onClick={startNewGame}>NEXT CASE</button>
            <button className="btn-secondary" style={{ margin: 0 }} onClick={() => { setIsGameOver(false); }}>REVIEW CASE</button>
            <button className="btn-secondary" style={{ margin: 0 }} onClick={() => setScreen('leaderboard')}>LEADERBOARD</button>
            <button className="btn-secondary" style={{ margin: 0, borderColor: 'var(--red)', color: 'var(--red)' }} onClick={() => setScreen('home')}>QUIT TO DASHBOARD</button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Game;
