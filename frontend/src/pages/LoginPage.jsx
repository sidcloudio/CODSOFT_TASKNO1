import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Cpu, Mail, Lock, LogIn, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const { login, isAuthenticated, loading, error } = useAuth();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const redirect = searchParams.get('redirect') || '';

  useEffect(() => {
    // If already authenticated, redirect away
    if (isAuthenticated) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;

    try {
      await login(email, password);
      addToast('Authorized successfully!', 'success');
      navigate(redirect ? `/${redirect}` : '/');
    } catch (err) {
      addToast(err.message || 'Authentication failed', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-[#070a13] py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-300">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 w-96 h-96 rounded-full bg-cyan-500/5 glow-orb -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/3 left-1/2 w-96 h-96 rounded-full bg-indigo-500/5 glow-orb -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-md w-full space-y-8 glass-panel border rounded-3xl p-8 relative z-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 items-center justify-center text-white shadow-md mx-auto">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white mt-3">Link Profile</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Access secure e-commerce gateway</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 text-xs font-semibold text-center leading-normal">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            
            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Interface E-Mail</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="name@sector.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm glass-input"
                />
                <Mail className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Secure Password</label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-bold text-cyan-500 hover:text-cyan-400 transition-colors"
                >
                  Forgot Keys?
                </Link>
              </div>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm glass-input"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white text-sm font-bold flex items-center justify-center gap-2"
          >
            <LogIn className="w-4 h-4" />
            {loading ? 'Authenticating...' : 'Authorize Link'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            First time logging on?{' '}
            <Link
              to={redirect ? `/register?redirect=${redirect}` : '/register'}
              className="font-bold text-cyan-500 hover:text-cyan-400 inline-flex items-center gap-0.5"
            >
              Configure Profile
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default LoginPage;
