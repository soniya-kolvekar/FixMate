'use client';
import { useState } from 'react';
import { loginUser, registerUser } from '../lib/firebase';

export default function AuthModal({ isOpen, mode, onClose, onAuthSuccess, onShowToast }) {
  const [authMode, setAuthMode] = useState(mode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Customer');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (authMode === 'login') {
        const res = await loginUser(email, password);
        const inferredRole = email.toLowerCase().includes('dispatcher') ? 'Dispatcher' : 'Dispatcher'; // Defaulting to Dispatcher for the user flow or check email
        onAuthSuccess(res.user, inferredRole);
        onShowToast(`🔥 Welcome back, ${res.user.displayName || res.user.email}! (Firebase Auth)`);
      } else {
        const res = await registerUser(email, password, role);
        onAuthSuccess(res.user, role);
        onShowToast(`🔥 Account created as ${role}! (Firebase Auth & Firestore)`);
      }
      onClose();
    } catch (err) {
      onShowToast(`⚠️ Auth error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="bg-white rounded-2xl max-w-md w-full mx-4 shadow-2xl overflow-hidden">
        <div className="bg-slate-50 px-7 py-6 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-xl font-extrabold text-[#0A2540]">
            {authMode === 'login' ? 'FixMate Secure Login' : 'Create FixMate Account'}
          </h3>
          <button onClick={onClose} className="text-2xl text-slate-400 hover:text-[#0A2540]">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-7 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@domain.com" 
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600" 
              required 
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Password</label>
            <input 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••" 
              className="w-full p-3 rounded-lg border border-slate-300 text-sm focus:outline-none focus:border-blue-600" 
              required 
            />
          </div>

          {authMode === 'signup' && (
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Select User Role</label>
              <select 
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full p-3 rounded-lg border border-slate-300 text-sm font-semibold text-[#0A2540]"
              >
                <option value="Customer">Customer (Book & Track Repairs)</option>
                <option value="Technician">Technician (Job Management)</option>
                <option value="Dispatcher">Dispatcher (Route Optimization)</option>
                <option value="Admin">Admin (System Control)</option>
              </select>
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#0A2540] hover:bg-[#13395F] text-white font-bold py-3.5 rounded-lg transition-colors shadow-md"
          >
            {loading ? 'Processing...' : (authMode === 'login' ? 'Login with Firebase' : 'Register with Firebase')}
          </button>

          <div className="text-center pt-2">
            {authMode === 'login' ? (
              <p className="text-xs text-slate-600">
                Don't have an account?{' '}
                <button type="button" onClick={() => setAuthMode('signup')} className="font-bold text-blue-600 hover:underline">
                  Sign Up Here
                </button>
              </p>
            ) : (
              <p className="text-xs text-slate-600">
                Already registered?{' '}
                <button type="button" onClick={() => setAuthMode('login')} className="font-bold text-blue-600 hover:underline">
                  Login Here
                </button>
              </p>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}
