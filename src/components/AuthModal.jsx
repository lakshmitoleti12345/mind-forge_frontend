import React, { useState } from 'react';
import { X, Lock, User, Mail, AlertCircle, CheckCircle2, Shield } from 'lucide-react';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }) {
  const [authMode, setAuthMode] = useState('student_login'); // student_login, student_register, admin_login
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    try {
      if (authMode === 'student_register') {
        await onLoginSuccess('register', { username, password, email, is_admin: false });
        setSuccessMsg('Student account created successfully!');
      } else if (authMode === 'admin_login') {
        await onLoginSuccess('login', { username, password });
        setSuccessMsg('Admin access granted.');
      } else {
        await onLoginSuccess('login', { username, password });
        setSuccessMsg('Welcome back!');
      }
      setTimeout(() => {
        onClose();
      }, 700);
    } catch (err) {
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#0f172a] w-full max-w-sm rounded-xl p-6 border border-slate-800 shadow-2xl space-y-5">
        
        {/* Modal Top Bar */}
        <div className="flex justify-between items-start">
          <div>
            <h3 className="text-lg font-bold text-slate-100 tracking-tight">
              {authMode === 'admin_login' ? 'Admin Portal' : authMode === 'student_register' ? 'Create Student Account' : 'Sign In'}
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              {authMode === 'admin_login' ? 'Authorized admin authentication' : 'Access your full-stack practice history'}
            </p>
          </div>
          <button onClick={onClose} className="p-1 text-slate-400 hover:text-slate-200 rounded-md hover:bg-slate-800 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Auth Segmented Switcher */}
        <div className="grid grid-cols-3 p-1 rounded-lg bg-slate-900 border border-slate-800 text-xs font-medium text-slate-400">
          <button
            type="button"
            onClick={() => { setAuthMode('student_login'); setErrorMsg(''); }}
            className={`py-1.5 rounded-md text-center transition-all ${authMode === 'student_login' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'hover:text-slate-200'}`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('student_register'); setErrorMsg(''); }}
            className={`py-1.5 rounded-md text-center transition-all ${authMode === 'student_register' ? 'bg-indigo-600 text-white font-semibold shadow-sm' : 'hover:text-slate-200'}`}
          >
            Register
          </button>
          <button
            type="button"
            onClick={() => { setAuthMode('admin_login'); setErrorMsg(''); }}
            className={`py-1.5 rounded-md text-center transition-all ${authMode === 'admin_login' ? 'bg-amber-600 text-white font-semibold shadow-sm' : 'hover:text-slate-200'}`}
          >
            Admin
          </button>
        </div>

        {/* Error / Success Feedback Banners */}
        {errorMsg && (
          <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        {successMsg && (
          <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>{successMsg}</span>
          </div>
        )}

        {/* Clean Input Form */}
        <form onSubmit={handleSubmit} className="space-y-3.5">
          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Username</label>
            <div className="relative">
              <User className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                placeholder="Enter username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          {authMode === 'student_register' && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1">Email Address</label>
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-slate-900 border border-slate-700/80 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-2.5 rounded-lg text-xs font-semibold text-white shadow-sm transition-all mt-2 ${
              authMode === 'admin_login'
                ? 'bg-amber-600 hover:bg-amber-500'
                : 'bg-indigo-600 hover:bg-indigo-500'
            }`}
          >
            {loading ? 'Authenticating...' : authMode === 'admin_login' ? 'Sign In to Admin Portal' : authMode === 'student_register' ? 'Create Account' : 'Sign In'}
          </button>
        </form>

      </div>
    </div>
  );
}
