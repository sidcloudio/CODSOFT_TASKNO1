import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Mail, Send, CheckCircle, ArrowLeft } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const { addToast } = useToast();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
      addToast('Reset instructions transmitted successfully!', 'success');
    }, 1500);
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-white dark:bg-[#070a13] py-12 px-4 sm:px-6 lg:px-8 relative transition-colors duration-300">
      
      {/* Glow Orbs */}
      <div className="absolute top-1/3 left-1/2 w-96 h-96 rounded-full bg-cyan-500/5 glow-orb -translate-x-1/2 -translate-y-1/2" />

      <div className="max-w-md w-full space-y-6 glass-panel border rounded-3xl p-8 relative z-10 shadow-2xl">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex w-12 h-12 rounded-2xl bg-gradient-to-tr from-cyan-500 to-indigo-500 items-center justify-center text-white shadow-md mx-auto">
            <Cpu className="w-6 h-6" />
          </div>
          <h2 className="text-2xl font-black tracking-tight dark:text-white mt-3">Restore Access Keys</h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider">Sync security keys back to node</p>
        </div>

        {submitted ? (
          <div className="text-center space-y-4 py-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400">
              <CheckCircle className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-800 dark:text-white">Transmission Complete</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              We have dispatched a cryptographic reset link to <strong className="text-slate-700 dark:text-slate-200">{email}</strong>. Please check your spam protocols or inbox within 5 minutes.
            </p>
            <Link
              to="/login"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-bold hover:text-cyan-500 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              Return to Login Terminal
            </Link>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
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

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white text-sm font-bold flex items-center justify-center gap-2"
            >
              <Send className="w-4 h-4" />
              {loading ? 'Transmitting Key...' : 'Request Recovery Key'}
            </button>

            <div className="text-center pt-2">
              <Link
                to="/login"
                className="text-xs font-bold text-slate-400 hover:text-cyan-500 inline-flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Back to Sign In
              </Link>
            </div>
          </form>
        )}

      </div>
    </div>
  );
};

export default ForgotPasswordPage;
