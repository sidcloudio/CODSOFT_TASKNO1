import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Cpu, Mail, Lock, User, UserPlus, ArrowRight } from 'lucide-react';

const RegisterPage = () => {
  const { register, isAuthenticated, loading, error } = useAuth();
  const { addToast } = useToast();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const redirect = searchParams.get('redirect') || '';

  useEffect(() => {
    if (isAuthenticated) {
      navigate(redirect ? `/${redirect}` : '/');
    }
  }, [isAuthenticated, navigate, redirect]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!name || !email || !password) return;

    if (password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    try {
      await register(name, email, password);
      addToast('Profile configured successfully!', 'success');
      navigate(redirect ? `/${redirect}` : '/');
    } catch (err) {
      addToast(err.message || 'Registration failed', 'error');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-[#070a13] py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-300">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 w-96 h-96 rounded-full bg-cyan-500/5 glow-orb -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/3 left-1/2 w-96 h-96 rounded-full bg-indigo-500/5 glow-orb -translate-x-1/2 translate-y-1/2" />

      <div className="max-w-md w-full space-y-6 glass-panel border rounded-3xl p-8 relative z-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 items-center justify-center text-white shadow-md mx-auto">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white mt-3">Register Profile</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Initialize new customer node</p>
        </div>

        {error && (
          <div className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 text-rose-500 text-xs font-semibold text-center leading-normal">
            {error}
          </div>
        )}

        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="space-y-3.5">
            
            {/* Name Field */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Full Identity Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  placeholder="Alex Vance"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm glass-input"
                />
                <User className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Comm Link Email</label>
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
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Secure Access Key</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm glass-input"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-1.5">
              <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Confirm Access Key</label>
              <div className="relative">
                <input
                  type="password"
                  required
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border text-sm glass-input"
                />
                <Lock className="absolute left-3.5 top-3.5 w-4 h-4 text-slate-400" />
              </div>
            </div>

          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white text-sm font-bold flex items-center justify-center gap-2 mt-4"
          >
            <UserPlus className="w-4 h-4" />
            {loading ? 'Initializing Node...' : 'Register Profile'}
          </button>
        </form>

        <div className="text-center pt-2">
          <p className="text-xs text-slate-400">
            Already registered?{' '}
            <Link
              to={redirect ? `/login?redirect=${redirect}` : '/login'}
              className="font-bold text-cyan-500 hover:text-cyan-400 inline-flex items-center gap-0.5"
            >
              Sign In Here
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>

      </div>
    </div>
  );
};

export default RegisterPage;
