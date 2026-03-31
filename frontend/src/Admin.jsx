import React, { useState, useEffect } from 'react';
import { saveCase, generateAI } from './api';

const API = 'http://127.0.0.1:5000/api';

function Admin({ cases, themes = [], loadData, showToast, settings, setSettings, currentUser }) {
  const [view, setView] = useState('dashboard'); // dashboard | ongoing | create | themes | log
  const [editingCase, setEditingCase] = useState(null);
  const [expandedTheme, setExpandedTheme] = useState(null);
  const [adminLog, setAdminLog] = useState([]);
  const [logLoading, setLogLoading] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiGenerating, setAiGenerating] = useState(false);

  // Theme creation form state
  const blankThemeForm = { name: '', description: '', icon: '🔍', image: '' };
  const [themeForm, setThemeForm] = useState(blankThemeForm);
  const [themeCreating, setThemeCreating] = useState(false);

  const blankForm = {
    id: '', title: '', location: '', description: '', story: '',
    difficulty: 'medium', icon: '🔍', image: '', killer: '', explanation: '',
    clues: [{text:'', misleading:false}, {text:'', misleading:false}, {text:'', misleading:true}],
    suspects: [{name:'', role:'', motive:'', alibi:'', hidden:''}],
    theme_id: themes[0]?.id || ''
  };
  const [form, setForm] = useState(blankForm);

  // Keep form.theme_id in sync when themes load
  useEffect(() => {
    if (!form.id && themes.length > 0 && !form.theme_id) {
      setForm(f => ({ ...f, theme_id: themes[0].id }));
    }
  }, [themes]);

  // Group cases by theme
  const casesByTheme = themes.map(t => ({
    ...t,
    cases: cases.filter(c => String(c.theme_id) === String(t.id))
  }));

  const loadLog = async () => {
    setLogLoading(true);
    try {
      const res = await fetch(`${API}/admin-log`);
      const data = await res.json();
      setAdminLog(data);
    } catch(e) {}
    setLogLoading(false);
  };

  useEffect(() => { if (view === 'log') loadLog(); }, [view]);

  // ── Theme CRUD ──
  const handleCreateTheme = async () => {
    if (!themeForm.name.trim()) return showToast('Theme name is required', 'error');
    setThemeCreating(true);
    try {
      const res = await fetch(`${API}/themes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(themeForm)
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Failed to create theme');
      }
      await logAction('CREATE', themeForm.name, `Theme "${themeForm.name}" created`);
      showToast(`Theme "${themeForm.name}" created!`, 'success');
      setThemeForm(blankThemeForm);
      await loadData();
    } catch (e) {
      showToast(e.message, 'error');
    }
    setThemeCreating(false);
  };

  const handleDeleteTheme = async (theme) => {
    const caseCount = cases.filter(c => String(c.theme_id) === String(theme.id)).length;
    const msg = caseCount > 0
      ? `Delete "${theme.name}"? It has ${caseCount} case(s) that will become uncategorised.`
      : `Delete "${theme.name}"? This cannot be undone.`;
    if (!window.confirm(msg)) return;
    try {
      await fetch(`${API}/themes/${theme.id}`, { method: 'DELETE' });
      await logAction('DELETE', theme.name, `Theme "${theme.name}" deleted`);
      showToast(`Theme deleted`, 'success');
      await loadData();
    } catch (e) {
      showToast('Failed to delete theme', 'error');
    }
  };

  const logAction = async (action, target, detail) => {
    await fetch(`${API}/admin-log`, {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ admin: currentUser?.username || 'admin', action, target, detail })
    }).catch(()=>{});
  };

  const handleSave = async () => {
    try {
      if (!form.title) return showToast('Title required', 'error');
      const toSave = { ...form };
      const isNew = !toSave.id;
      if (!toSave.id) toSave.id = String(Date.now());
      toSave.clues = toSave.clues.filter(c => c.text);
      await saveCase(toSave);
      await logAction(isNew ? 'CREATE' : 'EDIT', toSave.title, `Case "${toSave.title}" ${isNew ? 'created' : 'updated'} under ${themes.find(t=>String(t.id)===String(toSave.theme_id))?.name || 'Unknown'}`);
      showToast(`Case ${isNew ? 'created' : 'updated'}!`, 'success');
      await loadData();
      // Small tick so React re-renders with fresh cases before view switch
      await new Promise(r => setTimeout(r, 80));
      setView('ongoing');
    } catch(e) { showToast('Failed to save', 'error'); }
  };

  const handleEdit = (c) => {
    setForm({ ...c, clues: c.clues || [], suspects: c.suspects || [] });
    setView('create');
  };

  const handleDelete = async (c) => {
    if (!window.confirm(`Delete "${c.title}"? This cannot be undone.`)) return;
    try {
      await fetch(`${API}/cases/${c.id}`, {
        method: 'DELETE',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ admin: currentUser?.username || 'admin' })
      });
      showToast('Case deleted', 'success');
      await loadData();   // await so list updates immediately
    } catch(e) { showToast('Failed to delete', 'error'); }
  };

  const handleGenerate = async () => {
    if (!aiPrompt) return showToast('Enter a scene description', 'error');
    setAiGenerating(true);
    try {
      const res = await generateAI(aiPrompt, form.difficulty, settings.apiKey);
      setForm(prev => ({ ...prev, ...res, id: '', theme_id: prev.theme_id }));
      showToast('AI case generated! Review & save.', 'success');
    } catch(e) { showToast('AI generation failed', 'error'); }
    setAiGenerating(false);
  };

  const actionColors = { CREATE: '#5dbfb0', EDIT: 'var(--amber)', DELETE: 'var(--red)', SETTINGS: 'var(--subtle)' };

  return (
    <div style={{ paddingTop: '56px', minHeight: '100vh', background: '#080810' }}>

      {/* Admin Header */}
      <div style={{ background: 'rgba(10,10,11,0.9)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '18px 40px', display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{ flex: 1 }}>
          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--red)', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '3px' }}>Administrator Console</div>
          <h1 style={{ fontFamily: 'var(--display)', fontSize: '24px', margin: 0 }}>ClueCraft Admin</h1>
        </div>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {[['dashboard','◈ Dashboard'],['ongoing','📁 Ongoing Crimes'],['create','＋ New Crime'],['themes','🗂 Themes'],['log','📋 Change Log']].map(([v,l]) => (
            <button key={v} onClick={() => { if(v==='create'){ setForm({...blankForm, theme_id: themes[0]?.id || ''}); } setView(v); }}
              style={{ background: view===v ? 'rgba(192,57,43,0.15)' : 'transparent', border: `1px solid ${view===v ? 'rgba(192,57,43,0.5)' : 'rgba(255,255,255,0.1)'}`, color: view===v ? 'var(--amber)' : 'var(--subtle)', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.08em', padding: '8px 16px', cursor: 'pointer', transition: 'all 0.2s', borderRadius: '3px' }}>
              {l}
            </button>
          ))}
        </div>
      </div>

      <div style={{ padding: '40px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* ── DASHBOARD ── */}
        {view === 'dashboard' && (
          <div>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--subtle)', marginBottom: '40px', letterSpacing: '0.06em' }}>
              Welcome back, <strong style={{ color: 'var(--amber)' }}>{currentUser?.username}</strong>. What would you like to do?
            </p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '40px' }}>
              {/* Ongoing Crimes Card */}
              <div onClick={() => setView('ongoing')} style={{ background: 'rgba(14,22,32,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor='rgba(192,57,43,0.5)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(0)'; }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(192,57,43,0.2), rgba(20,20,30,0.9))', padding: '40px', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>📁</div>
                  <h2 style={{ fontFamily: 'var(--display)', fontSize: '28px', margin: '0 0 8px' }}>Ongoing Crimes</h2>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--subtle)', margin: 0 }}>
                    {cases.length} active case{cases.length !== 1 ? 's' : ''} across {themes.length} categories
                  </p>
                </div>
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--red)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Manage & Modify Cases ▸
                </div>
              </div>

              {/* Create New Crime Card */}
              <div onClick={() => { setForm(blankForm); setView('create'); }} style={{ background: 'rgba(14,22,32,0.8)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '8px', overflow: 'hidden', cursor: 'pointer', transition: 'all 0.3s' }}
                onMouseOver={e => { e.currentTarget.style.borderColor='rgba(212,136,42,0.5)'; e.currentTarget.style.transform='translateY(-4px)'; }}
                onMouseOut={e => { e.currentTarget.style.borderColor='rgba(255,255,255,0.07)'; e.currentTarget.style.transform='translateY(0)'; }}>
                <div style={{ background: 'linear-gradient(135deg, rgba(212,136,42,0.2), rgba(20,20,30,0.9))', padding: '40px', minHeight: '180px', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔏</div>
                  <h2 style={{ fontFamily: 'var(--display)', fontSize: '28px', margin: '0 0 8px' }}>Create New Crime</h2>
                  <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--subtle)', margin: 0 }}>
                    Write manually or generate using AI
                  </p>
                </div>
                <div style={{ padding: '16px 24px', borderTop: '1px solid rgba(255,255,255,0.05)', fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--amber)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Add Crime Scene ▸
                </div>
              </div>
            </div>

            {/* Quick stats */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px' }}>
              {[['Cases', cases.length, '#5dbfb0'], ['Categories', themes.length, 'var(--amber)'], ['Active Users', '—', 'var(--subtle)'], ['Solved', '—', 'var(--subtle)']].map(([label, val, color]) => (
                <div key={label} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', padding: '20px', textAlign: 'center', borderRadius: '4px' }}>
                  <div style={{ fontFamily: 'var(--display)', fontSize: '28px', color, marginBottom: '6px' }}>{val}</div>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── ONGOING CRIMES ── */}
        {view === 'ongoing' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--display)', fontSize: '28px', marginBottom: '4px' }}>Ongoing Crimes</h2>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--subtle)', letterSpacing: '0.06em' }}>{cases.length} cases across {themes.length} categories</p>
              </div>
              <button onClick={() => { setForm(blankForm); setView('create'); }} style={{ background: 'var(--red)', color: 'white', border: 'none', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '10px 20px', cursor: 'pointer', borderRadius: '3px' }}>
                + New Crime
              </button>
            </div>

            {casesByTheme.map(theme => (
              <div key={theme.id} style={{ marginBottom: '16px', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '6px', overflow: 'hidden' }}>
                {/* Theme header */}
                <div onClick={() => setExpandedTheme(expandedTheme === theme.id ? null : theme.id)}
                  style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '16px 20px', background: 'rgba(255,255,255,0.03)', cursor: 'pointer', transition: 'background 0.2s' }}
                  onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.05)'}
                  onMouseOut={e => e.currentTarget.style.background='rgba(255,255,255,0.03)'}>
                  {theme.image && <img src={theme.image} alt="" style={{ width: '50px', height: '34px', objectFit: 'cover', borderRadius: '3px', opacity: 0.8 }} />}
                  <span style={{ fontSize: '22px' }}>{theme.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: 'var(--display)', fontSize: '18px' }}>{theme.name}</div>
                    <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)' }}>{theme.cases.length} case{theme.cases.length !== 1 ? 's' : ''}</div>
                  </div>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '12px', color: 'var(--subtle)' }}>{expandedTheme === theme.id ? '▲' : '▼'}</span>
                </div>

                {/* Cases list */}
                {expandedTheme === theme.id && (
                  <div>
                    {theme.cases.length === 0 && (
                      <div style={{ padding: '30px', textAlign: 'center', color: 'var(--subtle)', fontFamily: 'var(--mono)', fontSize: '11px' }}>No cases in this category yet.</div>
                    )}
                    {theme.cases.map(c => (
                      <div key={c.id} style={{ display: 'grid', gridTemplateColumns: '40px 1fr 100px 80px 160px', alignItems: 'center', gap: '14px', padding: '14px 20px', borderTop: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                        onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                        onMouseOut={e => e.currentTarget.style.background='transparent'}>
                        <div style={{ fontSize: '22px', textAlign: 'center' }}>{c.icon || '🔍'}</div>
                        <div>
                          <div style={{ fontFamily: 'var(--serif)', fontSize: '16px', marginBottom: '2px' }}>{c.title}</div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)' }}>{c.location} · {c.clues?.length || 0} clues · {c.suspects?.length || 0} suspects</div>
                        </div>
                        <div>
                          <span className={`tag-pill tag-${c.difficulty || 'medium'}`}>{c.difficulty || 'medium'}</span>
                        </div>
                        <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--subtle)' }}>
                          #{c.id.toString().substring(0, 6)}
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button onClick={() => handleEdit(c)} style={{ background: 'rgba(212,136,42,0.1)', border: '1px solid rgba(212,136,42,0.3)', color: 'var(--amber)', fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.08em', padding: '6px 14px', cursor: 'pointer', borderRadius: '3px', transition: 'all 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.background='rgba(212,136,42,0.2)'}
                            onMouseOut={e => e.currentTarget.style.background='rgba(212,136,42,0.1)'}>Edit</button>
                          <button onClick={() => handleDelete(c)} style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', color: 'var(--red)', fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.08em', padding: '6px 14px', cursor: 'pointer', borderRadius: '3px', transition: 'all 0.2s' }}
                            onMouseOver={e => e.currentTarget.style.background='rgba(192,57,43,0.2)'}
                            onMouseOut={e => e.currentTarget.style.background='rgba(192,57,43,0.1)'}>Delete</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* ── THEME MANAGER ── */}
        {view === 'themes' && (
          <div>
            <div style={{ marginBottom: '36px' }}>
              <h2 style={{ fontFamily: 'var(--display)', fontSize: '28px', marginBottom: '4px' }}>Theme Manager</h2>
              <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--subtle)', letterSpacing: '0.06em' }}>Crime categories displayed on the player home screen</p>
            </div>

            {/* Create New Theme */}
            <div style={{ background: 'rgba(212,136,42,0.06)', border: '1px solid rgba(212,136,42,0.25)', borderRadius: '8px', padding: '28px', marginBottom: '36px' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: '20px', marginBottom: '4px', color: 'var(--amber)', display: 'flex', alignItems: 'center', gap: '8px' }}>＋ Create New Theme</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)', letterSpacing: '0.08em', marginBottom: '20px' }}>Themes appear as clickable category cards on the player dashboard</div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '14px' }}>
                <div className="form-group">
                  <label className="form-label">Theme Name *</label>
                  <input className="form-input" value={themeForm.name} onChange={e => setThemeForm({...themeForm, name: e.target.value})} placeholder="e.g. Arson, Fraud, Cybercrime" />
                </div>
                <div className="form-group">
                  <label className="form-label">Icon (Emoji)</label>
                  <input className="form-input" value={themeForm.icon} onChange={e => setThemeForm({...themeForm, icon: e.target.value})} placeholder="🔥" />
                </div>
              </div>
              <div className="form-group" style={{ marginBottom: '14px' }}>
                <label className="form-label">Description</label>
                <input className="form-input" value={themeForm.description} onChange={e => setThemeForm({...themeForm, description: e.target.value})} placeholder="Short description shown on the theme card" />
              </div>
              <div className="form-group" style={{ marginBottom: '20px' }}>
                <label className="form-label">Banner Image URL (optional)</label>
                <input className="form-input" value={themeForm.image} onChange={e => setThemeForm({...themeForm, image: e.target.value})} placeholder="https://... or /themes/image.jpg" />
              </div>

              {/* Live Preview */}
              {themeForm.name && (
                <div style={{ marginBottom: '20px' }}>
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '10px' }}>Preview</div>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '12px', background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(212,136,42,0.3)', borderRadius: '6px', padding: '14px 20px', minWidth: '280px' }}>
                    <span style={{ fontSize: '28px' }}>{themeForm.icon || '❓'}</span>
                    <div>
                      <div style={{ fontFamily: 'var(--display)', fontSize: '18px' }}>{themeForm.name}</div>
                      <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)', marginTop: '2px' }}>{themeForm.description || 'No description yet'}</div>
                    </div>
                  </div>
                </div>
              )}

              <button onClick={handleCreateTheme} disabled={themeCreating || !themeForm.name.trim()}
                style={{ background: 'rgba(212,136,42,0.85)', border: 'none', color: '#000', fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '12px 28px', cursor: 'pointer', borderRadius: '3px', fontWeight: 'bold', opacity: (!themeForm.name.trim() || themeCreating) ? 0.5 : 1 }}>
                {themeCreating ? 'Creating...' : '✓ Create Theme'}
              </button>
            </div>

            {/* Existing Themes */}
            <div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--subtle)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '16px' }}>Existing Themes ({themes.length})</div>
              {themes.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px', color: 'var(--subtle)', fontFamily: 'var(--mono)', fontSize: '11px' }}>No themes yet. Create one above.</div>
              )}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px' }}>
                {themes.map(t => {
                  const count = cases.filter(c => String(c.theme_id) === String(t.id)).length;
                  return (
                    <div key={t.id} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '6px', overflow: 'hidden' }}>
                      {t.image && (
                        <div style={{ height: '80px', overflow: 'hidden', position: 'relative' }}>
                          <img src={t.image} alt={t.name} style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.5, filter: 'brightness(0.6)' }} />
                          <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(8,8,16,1), transparent)' }} />
                        </div>
                      )}
                      <div style={{ padding: '16px 20px', display: 'flex', alignItems: 'center', gap: '14px' }}>
                        <span style={{ fontSize: '28px' }}>{t.icon}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontFamily: 'var(--display)', fontSize: '18px', marginBottom: '2px' }}>{t.name}</div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)', marginBottom: '4px' }}>{t.description}</div>
                          <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: count > 0 ? '#5dbfb0' : 'var(--subtle)' }}>{count} case{count !== 1 ? 's' : ''}</div>
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                          <button onClick={() => { setForm(f => ({...f, theme_id: t.id})); setView('create'); }}
                            style={{ background: 'rgba(212,136,42,0.1)', border: '1px solid rgba(212,136,42,0.3)', color: 'var(--amber)', fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.08em', padding: '5px 12px', cursor: 'pointer', borderRadius: '3px', whiteSpace: 'nowrap' }}>
                            + Add Case
                          </button>
                          <button onClick={() => handleDeleteTheme(t)}
                            style={{ background: 'rgba(192,57,43,0.1)', border: '1px solid rgba(192,57,43,0.3)', color: 'var(--red)', fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.08em', padding: '5px 12px', cursor: 'pointer', borderRadius: '3px' }}>
                            Delete
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* ── CREATE / EDIT CRIME ── */}
        {view === 'create' && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '30px' }}>
              <div>
                <h2 style={{ fontFamily: 'var(--display)', fontSize: '28px', marginBottom: '4px' }}>{form.id ? 'Edit Crime Scene' : 'Create New Crime'}</h2>
                <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--subtle)', letterSpacing: '0.06em' }}>All changes are immediately reflected for players</p>
              </div>
            </div>

            {/* ── THEME SELECTOR — top of form, prominent ── */}
            <div style={{ background: 'rgba(192,57,43,0.06)', border: '1px solid rgba(192,57,43,0.3)', borderRadius: '8px', padding: '20px 24px', marginBottom: '28px', display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: '18px', color: 'var(--red)', flexShrink: 0 }}>🗂 Crime Category *</div>
              <div style={{ flex: 1, minWidth: '200px' }}>
                {themes.length === 0 ? (
                  <div style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--amber)' }}>
                    ⚠ No themes exist yet. <button onClick={() => setView('themes')} style={{ background: 'none', border: 'none', color: 'var(--amber)', cursor: 'pointer', fontFamily: 'var(--mono)', fontSize: '11px', textDecoration: 'underline' }}>Create a theme first →</button>
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                    {themes.map(t => (
                      <button key={t.id} onClick={() => setForm({...form, theme_id: t.id})}
                        style={{ display: 'flex', alignItems: 'center', gap: '7px', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', transition: 'all 0.18s', fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.05em', border: '1px solid', background: String(form.theme_id) === String(t.id) ? 'rgba(192,57,43,0.2)' : 'rgba(255,255,255,0.03)', borderColor: String(form.theme_id) === String(t.id) ? 'var(--red)' : 'rgba(255,255,255,0.1)', color: String(form.theme_id) === String(t.id) ? 'var(--paper)' : 'var(--subtle)' }}>
                        <span style={{ fontSize: '16px' }}>{t.icon}</span> {t.name}
                        {String(form.theme_id) === String(t.id) && <span style={{ color: 'var(--red)', fontWeight: 'bold' }}>✓</span>}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              {!form.theme_id && <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: '#ff6b6b' }}>Select a category for this crime</div>}
            </div>

            {/* AI Generator */}
            <div style={{ background: 'rgba(26,58,92,0.12)', border: '1px solid rgba(26,58,92,0.35)', borderRadius: '6px', padding: '24px', marginBottom: '30px' }}>
              <div style={{ fontFamily: 'var(--display)', fontSize: '18px', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>◈ AI Crime Generator</div>
              <div style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)', marginBottom: '14px' }}>Describe a crime scene and AI fills in story, clues, suspects, and killer automatically</div>
              <div style={{ display: 'flex', gap: '12px' }}>
                <input className="form-input" style={{ flex: 1 }} value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} placeholder="e.g. A gallery curator found dead beside a stolen painting..." />
                <select className="form-input" style={{ width: '120px' }} value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <button onClick={handleGenerate} disabled={aiGenerating} style={{ background: 'rgba(26,58,92,0.6)', border: '1px solid rgba(46,95,138,0.5)', color: '#7fb3d3', fontFamily: 'var(--mono)', fontSize: '11px', letterSpacing: '0.08em', padding: '8px 20px', cursor: 'pointer', whiteSpace: 'nowrap', borderRadius: '3px' }}>
                  {aiGenerating ? 'Generating...' : '◈ Generate'}
                </button>
              </div>
            </div>

            {/* Form grid — removed redundant theme_id dropdown (handled above) */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
              <div className="form-group"><label className="form-label">Case Title *</label>
                <input className="form-input" value={form.title} onChange={e => setForm({...form, title: e.target.value})} placeholder="e.g. The Gallery at Midnight" />
              </div>
              <div className="form-group"><label className="form-label">Location</label>
                <input className="form-input" value={form.location} onChange={e => setForm({...form, location: e.target.value})} placeholder="e.g. Meridian Gallery, Floor 3" />
              </div>
              <div className="form-group"><label className="form-label">Difficulty</label>
                <select className="form-input" value={form.difficulty} onChange={e => setForm({...form, difficulty: e.target.value})}>
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
              </div>
              <div className="form-group"><label className="form-label">Scene Icon (Emoji)</label>
                <input className="form-input" value={form.icon} onChange={e => setForm({...form, icon: e.target.value})} placeholder="🔍" />
              </div>
              <div className="form-group" style={{ gridColumn: 'span 2' }}><label className="form-label">Scene Image URL</label>
                <input className="form-input" value={form.image} onChange={e => setForm({...form, image: e.target.value})} placeholder="https://... or /scenes/image.jpg" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '18px' }}><label className="form-label">Cinematic Story</label>
              <textarea className="form-textarea" style={{ minHeight: '120px' }} value={form.story} onChange={e => setForm({...form, story: e.target.value})} placeholder="Write the scene narrative that players read before investigating..." />
            </div>

            {/* Clues */}
            <div style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>Clues (mark exactly one as Misleading)</label>
              {form.clues.map((cl, i) => (
                <div key={i} style={{ display: 'flex', gap: '8px', marginBottom: '7px', alignItems: 'center' }}>
                  <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)', width: '24px' }}>{i+1}.</span>
                  <input className="form-input" style={{ flex: 1 }} value={cl.text} onChange={e => { const n=[...form.clues]; n[i].text=e.target.value; setForm({...form,clues:n}); }} placeholder={`Clue ${i+1}`} />
                  <button onClick={() => { const n=[...form.clues]; n[i].misleading=!n[i].misleading; setForm({...form,clues:n}); }}
                    style={{ padding: '8px 12px', fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.08em', border: '1px solid', cursor: 'pointer', whiteSpace: 'nowrap', background: cl.misleading ? 'rgba(192,57,43,0.12)' : 'rgba(93,191,176,0.08)', borderColor: cl.misleading ? 'rgba(192,57,43,0.4)' : 'rgba(93,191,176,0.3)', color: cl.misleading ? 'var(--red)' : '#5dbfb0', borderRadius: '3px' }}>
                    {cl.misleading ? '✕ Red Herring' : '✓ True'}
                  </button>
                  <button onClick={() => setForm({...form, clues: form.clues.filter((_,j)=>j!==i)})} style={{ background: 'none', border: '1px solid rgba(192,57,43,0.2)', color: 'var(--red)', width: '28px', height: '28px', cursor: 'pointer', borderRadius: '3px', fontSize: '12px' }}>✕</button>
                </div>
              ))}
              <button onClick={() => setForm({...form, clues: [...form.clues, {text:'', misleading:false}]})} style={{ background: 'none', border: '1px dashed rgba(255,255,255,0.15)', color: 'var(--subtle)', fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.07em', padding: '8px', cursor: 'pointer', width: '100%', marginTop: '4px', borderRadius: '3px' }}>
                + Add Clue
              </button>
            </div>

            {/* Suspects */}
            <div style={{ marginBottom: '22px' }}>
              <label className="form-label" style={{ marginBottom: '10px', display: 'block' }}>Suspects (3 recommended)</label>
              {form.suspects.map((s, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)', borderRadius: '4px', padding: '14px', marginBottom: '10px' }}>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input className="form-input" value={s.name} onChange={e => { const n=[...form.suspects]; n[i].name=e.target.value; setForm({...form,suspects:n}); }} placeholder="Full Name" />
                    <input className="form-input" value={s.role} onChange={e => { const n=[...form.suspects]; n[i].role=e.target.value; setForm({...form,suspects:n}); }} placeholder="Role / Occupation" />
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
                    <input className="form-input" value={s.motive} onChange={e => { const n=[...form.suspects]; n[i].motive=e.target.value; setForm({...form,suspects:n}); }} placeholder="Motive" />
                    <input className="form-input" value={s.alibi} onChange={e => { const n=[...form.suspects]; n[i].alibi=e.target.value; setForm({...form,suspects:n}); }} placeholder="Alibi" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <input className="form-input" style={{ flex: 1 }} value={s.hidden} onChange={e => { const n=[...form.suspects]; n[i].hidden=e.target.value; setForm({...form,suspects:n}); }} placeholder="Hidden detail (revealed with hints)" />
                    <button onClick={() => setForm({...form, suspects: form.suspects.filter((_,j)=>j!==i)})} style={{ background: 'none', border: '1px solid rgba(192,57,43,0.2)', color: 'var(--red)', padding: '8px 12px', cursor: 'pointer', borderRadius: '3px', fontFamily: 'var(--mono)', fontSize: '10px' }}>Remove</button>
                  </div>
                </div>
              ))}
              <button onClick={() => setForm({...form, suspects: [...form.suspects, {name:'',role:'',motive:'',alibi:'',hidden:''}]})} style={{ background: 'none', border: '1px dashed rgba(255,255,255,0.15)', color: 'var(--subtle)', fontFamily: 'var(--mono)', fontSize: '10px', letterSpacing: '0.07em', padding: '8px', cursor: 'pointer', width: '100%', borderRadius: '3px' }}>
                + Add Suspect
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px', marginBottom: '18px' }}>
              <div className="form-group"><label className="form-label">Killer (exact suspect name)</label>
                <input className="form-input" value={form.killer} onChange={e => setForm({...form, killer: e.target.value})} placeholder="Must match a suspect's name exactly" />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: '28px' }}><label className="form-label">Explanation (shown after verdict)</label>
              <textarea className="form-textarea" style={{ minHeight: '100px' }} value={form.explanation} onChange={e => setForm({...form, explanation: e.target.value})} placeholder="Explain exactly how and why the killer committed the crime..." />
            </div>

            <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
              <button onClick={handleSave} disabled={!form.theme_id} style={{ background: form.theme_id ? 'var(--red)' : 'rgba(192,57,43,0.3)', color: 'white', border: 'none', fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '13px 30px', cursor: form.theme_id ? 'pointer' : 'not-allowed', borderRadius: '3px' }}>
                {form.id ? '✓ Save Changes' : '✓ Create Crime'}
              </button>
              <button onClick={() => setView(form.id ? 'ongoing' : 'dashboard')} style={{ background: 'transparent', border: '1px solid rgba(255,255,255,0.15)', color: 'var(--subtle)', fontFamily: 'var(--mono)', fontSize: '12px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '13px 30px', cursor: 'pointer', borderRadius: '3px' }}>
                Cancel
              </button>
              {!form.theme_id && <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: '#ff6b6b' }}>⚠ Select a crime category above</span>}
            </div>
          </div>
        )}

        {/* ── CHANGE LOG ── */}
        {view === 'log' && (
          <div>
            <h2 style={{ fontFamily: 'var(--display)', fontSize: '28px', marginBottom: '6px' }}>Change History</h2>
            <p style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--subtle)', letterSpacing: '0.06em', marginBottom: '30px' }}>All admin actions across cases and categories</p>

            {logLoading && <div style={{ textAlign: 'center', padding: '60px', color: 'var(--subtle)', fontFamily: 'var(--mono)', fontSize: '11px' }}>LOADING LOGS...</div>}

            {!logLoading && adminLog.length === 0 && (
              <div style={{ textAlign: 'center', padding: '80px', color: 'var(--subtle)' }}>
                <div style={{ fontSize: '40px', marginBottom: '14px', opacity: 0.4 }}>📋</div>
                <p>No changes recorded yet. Create or modify a case to see logs here.</p>
              </div>
            )}

            {!logLoading && adminLog.map(entry => (
              <div key={entry.id} style={{ display: 'grid', gridTemplateColumns: '90px 80px 1fr 180px', alignItems: 'center', gap: '16px', padding: '13px 18px', borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.15s' }}
                onMouseOver={e => e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                onMouseOut={e => e.currentTarget.style.background='transparent'}>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '9px', letterSpacing: '0.1em', textTransform: 'uppercase', padding: '3px 8px', border: '1px solid', borderColor: (actionColors[entry.action] || 'var(--subtle)') + '40', color: actionColors[entry.action] || 'var(--subtle)', borderRadius: '2px', textAlign: 'center' }}>{entry.action}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '11px', color: 'var(--amber)' }}>{entry.admin}</span>
                <span style={{ fontSize: '14px' }}>{entry.detail}</span>
                <span style={{ fontFamily: 'var(--mono)', fontSize: '10px', color: 'var(--subtle)', textAlign: 'right' }}>
                  {new Date(entry.created_at).toLocaleString('en-GB', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}
                </span>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}

export default Admin;
