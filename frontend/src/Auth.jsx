import React, { useState } from 'react';
import { registerUser, loginUser } from './api';

function Auth({ type, setScreen, showToast }) {
  const [formData, setFormData] = useState({ username: '', password: '', email: '', adminKey: '' });

  const getTitle = () => {
    switch (type) {
      case 'signup': return 'Create Detective Profile';
      case 'login': return 'Agent Login';
      case 'admin-login': return 'Administrator Access';
      default: return 'Login';
    }
  };

  const getSub = () => {
    switch (type) {
      case 'signup': return 'Join the agency and track your case history.';
      case 'login': return 'Welcome back, detective. Access your clearance.';
      case 'admin-login': return 'Authorised personnel only. Enter clearance code.';
      default: return '';
    }
  };

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (type === 'signup') {
        const res = await registerUser(formData.username, formData.email, formData.password);
        showToast(`Profile created, welcome ${res.user.username}`, 'success');
        setScreen('home'); // or set current user via props
        setTimeout(() => window.location.reload(), 1500); // Quick reload for state hydration
      } else {
        const res = await loginUser(formData.username, formData.password);
        if (type === 'admin-login' && res.user.role !== 'admin') {
          setError('Admin clearance required.');
        } else {
          showToast(`Logged in successfully`, 'success');
          // use simple localStorage for persistence
          localStorage.setItem('cluecraft_user', JSON.stringify(res.user));
          setTimeout(() => window.location.reload(), 1500); 
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="screen-auth" className="screen active" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
      <div className="verdict-modal" style={{ position: 'relative', top: '0', left: '0', transform: 'none', background: 'var(--bg-glass)', width: '100%', maxWidth: '400px' }}>
        <h2 className="admin-page-title" style={{ textAlign: 'center' }}>{getTitle()}</h2>
        <div className="admin-page-sub" style={{ textAlign: 'center', marginBottom: '30px' }}>{getSub()}</div>

        {error && <div style={{ background: 'rgba(192,57,43,0.1)', color: '#ff6b6b', padding: '10px', borderRadius: '4px', marginBottom: '15px', textAlign: 'center' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          {type === 'signup' && (
            <div className="form-group" style={{ marginBottom: '15px' }}>
              <label className="form-label">Email Address</label>
              <input type="email" required className="form-input" placeholder="agent@cluecraft.org" value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
          )}
          
          <div className="form-group" style={{ marginBottom: '15px' }}>
            <label className="form-label">{type === 'admin-login' ? 'Admin ID' : 'Username'}</label>
            <input type="text" required className="form-input" placeholder="Enter ID" value={formData.username} onChange={e => setFormData({ ...formData, username: e.target.value })} />
          </div>

          <div className="form-group" style={{ marginBottom: '25px' }}>
            <label className="form-label">{type === 'admin-login' ? 'Clearance Code' : 'Password'}</label>
            <input type="password" required className="form-input" placeholder="••••••••" value={formData.password} onChange={e => setFormData({ ...formData, password: e.target.value })} />
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', padding: '12px' }} disabled={loading}>
            {loading ? 'Processing...' : (type === 'signup' ? 'Create Profile' : 'Authenticate')}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '20px', fontSize: '12px', color: 'var(--subtle)' }}>
          {type === 'login' && <span>New to the agency? <a href="#" style={{ color: 'var(--amber)', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); setScreen('signup'); }}>Create Profile</a></span>}
          {type === 'signup' && <span>Already have clearance? <a href="#" style={{ color: 'var(--amber)', textDecoration: 'none' }} onClick={(e) => { e.preventDefault(); setScreen('login'); }}>Login instead</a></span>}
          
          <div style={{ marginTop: '25px', paddingTop: '15px', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <a href="#" style={{ color: 'var(--subtle)', textDecoration: 'none', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '5px', transition: 'color 0.2s' }} 
               onClick={(e) => { e.preventDefault(); setScreen('home'); }}
               onMouseOver={(e) => e.target.style.color = '#fff'}
               onMouseOut={(e) => e.target.style.color = 'var(--subtle)'}>
              ⟵ Return to Home
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Auth;
