import React, { useState, useEffect, useCallback } from 'react';
import './index.css';

// Generates a maze using Recursive Backtracker
const generateMaze = (width, height) => {
  const w = width % 2 === 0 ? width + 1 : width;
  const h = height % 2 === 0 ? height + 1 : height;
  
  const grid = Array(h).fill(null).map(() => Array(w).fill('#'));
  
  const carve = (x, y) => {
    grid[y][x] = '.';
    const dirs = [[0, -2], [0, 2], [-2, 0], [2, 0]].sort(() => Math.random() - 0.5);
    
    for (let [dx, dy] of dirs) {
      const nx = x + dx, ny = y + dy;
      if (nx > 0 && nx < w - 1 && ny > 0 && ny < h - 1 && grid[ny][nx] === '#') {
        grid[y + dy / 2][x + dx / 2] = '.';
        carve(nx, ny);
      }
    }
  };
  
  carve(1, 1);
  return { grid, w, h };
};

const MazeMiniGame = ({ totalClues, onClueFound, onComplete }) => {
  const [maze, setMaze] = useState(null);
  const [playerPos, setPlayerPos] = useState({ x: 1, y: 1 });
  const [clues, setClues] = useState([]);
  const [exitPos, setExitPos] = useState(null);
  
  // We only want to generate the maze once per mount.
  useEffect(() => {
    const { grid, w, h } = generateMaze(15, 15);
    setMaze(grid);
    
    const emptyCells = [];
    for (let y = 1; y < h; y++) {
      for (let x = 1; x < w; x++) {
        if (grid[y][x] === '.' && !(x === 1 && y === 1)) {
          emptyCells.push({ x, y });
        }
      }
    }
    
    emptyCells.sort(() => Math.random() - 0.5);
    // Place all clues randomly
    setClues(emptyCells.slice(0, totalClues));
    // The exit will be placed at the last empty cell in the shuffled array
    if (emptyCells.length > totalClues) {
      setExitPos(emptyCells[emptyCells.length - 1]);
    }
  }, [totalClues]);

  const move = useCallback((dx, dy) => {
    if (!maze) return;
    const nx = playerPos.x + dx;
    const ny = playerPos.y + dy;
    
    if (maze[ny] && maze[ny][nx] !== '#') {
      setPlayerPos({ x: nx, y: ny });
      
      const clueIndex = clues.findIndex(c => c.x === nx && c.y === ny);
      if (clueIndex !== -1) {
         setClues(prev => prev.filter((_, i) => i !== clueIndex));
         onClueFound();
      } else if (clues.length === 0 && exitPos && nx === exitPos.x && ny === exitPos.y) {
         setTimeout(() => {
            onComplete();
         }, 300);
      }
    }
  }, [maze, playerPos, clues, exitPos, onClueFound, onComplete]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Prevent default scrolling for arrow keys
      if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
         e.preventDefault();
      }
      switch (e.key) {
        case 'ArrowUp': case 'w': case 'W': move(0, -1); break;
        case 'ArrowDown': case 's': case 'S': move(0, 1); break;
        case 'ArrowLeft': case 'a': case 'A': move(-1, 0); break;
        case 'ArrowRight': case 'd': case 'D': move(1, 0); break;
        default: break;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  if (!maze) return <div style={{ color: 'var(--subtle)', padding: '20px', textAlign: 'center' }}>Generating Initial Evidence Sector...</div>;

  return (
    <div className="maze-wrapper" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '20px' }}>
      <div style={{ marginBottom: '10px', color: 'var(--amber)', fontFamily: 'var(--mono)', fontSize: '11px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
        {clues.length > 0 ? "Navigate the scene using WASD or Arrow Keys" : "All clues secured! Proceed to the exit door."}
      </div>
      <div className="maze-grid" style={{ 
        display: 'grid', 
        gridTemplateColumns: `repeat(${maze[0].length}, 25px)`,
        gridTemplateRows: `repeat(${maze.length}, 25px)`,
        gap: '2px',
        background: '#050a10',
        padding: '10px',
        border: '1px solid rgba(0, 229, 255, 0.2)',
        borderRadius: '6px',
        boxShadow: '0 0 15px rgba(0,0,0,0.5)'
      }}>
        {maze.map((row, y) => (
          row.map((cell, x) => {
            const isPlayer = playerPos.x === x && playerPos.y === y;
            const isClue = clues.some(c => c.x === x && c.y === y);
            const isExit = exitPos && exitPos.x === x && exitPos.y === y;
            
            return (
              <div 
                key={`${x}-${y}`} 
                style={{
                  width: '25px', 
                  height: '25px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  background: cell === '#' ? 'rgba(0, 229, 255, 0.15)' : 'rgba(255,255,255,0.03)',
                  border: cell === '#' ? '1px solid rgba(0, 229, 255, 0.3)' : '1px solid transparent',
                  borderRadius: '2px',
                  transition: 'background 0.2s',
                  position: 'relative'
                }}
              >
                {isPlayer && <span style={{ zIndex: 10, position: 'absolute' }}>🕵️</span>}
                {isClue && !isPlayer && <span style={{ color: 'var(--red)', animation: 'pulse 1.5s infinite', position: 'absolute', textShadow: '0 0 5px var(--red)', willChange: 'transform, opacity' }}>🔍</span>}
                {isExit && clues.length === 0 && !isPlayer && <span style={{ animation: 'fade-in 1s', position: 'absolute', fontSize: '18px' }}>🚪</span>}
              </div>
            );
          })
        ))}
      </div>
      
      {/* Mobile Controls */}
      <div className="maze-controls-mobile" style={{ marginTop: '20px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '5px' }}>
        <button className="btn-secondary" style={{ padding: '10px 15px' }} onClick={() => move(0, -1)}>▲</button>
        <div style={{ display: 'flex', gap: '30px' }}>
          <button className="btn-secondary" style={{ padding: '10px 15px' }} onClick={() => move(-1, 0)}>◀</button>
          <button className="btn-secondary" style={{ padding: '10px 15px' }} onClick={() => move(1, 0)}>▶</button>
        </div>
        <button className="btn-secondary" style={{ padding: '10px 15px' }} onClick={() => move(0, 1)}>▼</button>
      </div>
    </div>
  );
};

export default MazeMiniGame;
