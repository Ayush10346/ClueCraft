const API_BASE = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? '/api' : `http://${window.location.hostname}:5000/api`);

export const fetchCases = async (themeId) => {
  const url = themeId ? `${API_BASE}/cases?theme_id=${themeId}` : `${API_BASE}/cases`;
  const res = await fetch(url);
  if (!res.ok) throw new Error('Failed to fetch cases');
  return res.json();
};

export const fetchThemes = async () => {
  const res = await fetch(`${API_BASE}/themes`);
  if (!res.ok) throw new Error('Failed to fetch themes');
  return res.json();
};

export const saveCase = async (caseData) => {
  const res = await fetch(`${API_BASE}/cases`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(caseData)
  });
  if (!res.ok) throw new Error('Failed to save case');
  return res.json();
};

export const generateAI = async (prompt, difficulty, apiKey) => {
  const res = await fetch(`${API_BASE}/generate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt, difficulty, api_key: apiKey })
  });
  if (!res.ok) throw new Error('Failed to generate case');
  return res.json();
};

export const fetchLeaderboard = async () => {
  const res = await fetch(`${API_BASE}/leaderboard`);
  if (!res.ok) throw new Error('Failed to fetch leaderboard');
  return res.json();
};

export const saveLeaderboard = async (scoreData) => {
  const res = await fetch(`${API_BASE}/leaderboard`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(scoreData)
  });
  if (!res.ok) throw new Error('Failed to save score');
  return res.json();
};

export const registerUser = async (username, email, password) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, email, password })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Registration failed');
  }
  return res.json();
};

export const loginUser = async (username, password) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || 'Login failed');
  }
  return res.json();
};

export const saveHistory = async (entry) => {
  const res = await fetch(`${API_BASE}/history`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(entry)
  });
  if (!res.ok) throw new Error('Failed to save history');
  return res.json();
};

export const fetchHistory = async (username) => {
  const res = await fetch(`${API_BASE}/history/${username}`);
  if (!res.ok) throw new Error('Failed to fetch history');
  return res.json();
};
