import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, Send, ShieldCheck, HelpCircle, ArrowUpRight } from 'lucide-react';
import { useToast } from '../context/ToastContext';

const Footer = () => {
  const [email, setEmail] = useState('');
  const { addToast } = useToast();

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email) return;
    addToast('Thank you for subscribing to NeoCartX Intel!', 'success');
    setEmail('');
  };

  return (
    <footer className="relative border-t border-slate-200 dark:border-slate-900 bg-slate-50 dark:bg-[#05080f] pt-16 pb-8 transition-colors duration-300 overflow-hidden">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute top-0 right-0 w-80 h-80 rounded-full bg-indigo-500/5 glow-orb -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full bg-cyan-500/5 glow-orb translate-y-1/3 -translate-x-1/3" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-12 border-b border-slate-200 dark:border-slate-900">
          
          {/* Logo & Description */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <Cpu className="w-4.5 h-4.5" />
              </div>
              <span className="font-extrabold text-xl tracking-wider dark:text-white">
                NEO<span className="text-cyan-500">CARTX</span>
              </span>
            </Link>
            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
              Equipping the next generation of pioneers with cybernetic cores, tactical exo-suits, and sub-atomic power components.
            </p>
          </div>

          {/* Catalog Links */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Catalog</h4>
            <ul className="space-y-2">
              {[
                { name: 'Cyberware Implants', slug: 'cyberware' },
                { name: 'Exo-Suits Systems', slug: 'exo-suits' },
                { name: 'Quantum Core Tech', slug: 'quantum-tech' },
                { name: 'Holo Projectors', slug: 'holo-displays' },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    to={`/shop?category=${item.slug}`}
                    className="group flex items-center gap-1 text-sm text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
                  >
                    {item.name}
                    <ArrowUpRight className="w-3.5 h-3.5 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Info & Support */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Support</h4>
            <ul className="space-y-2">
              {[
                { name: 'F.A.Q.', icon: HelpCircle },
                { name: 'Security Protocol', icon: ShieldCheck },
              ].map((item) => (
                <li key={item.name}>
                  <a
                    href="#"
                    className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-500 dark:text-slate-400 dark:hover:text-cyan-400 transition-colors"
                  >
                    <item.icon className="w-4 h-4 text-slate-400" />
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Input */}
          <div className="space-y-4">
            <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200 text-glow-cyan">
              Subscribe to Intel
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Receive updates on new augmentations, cyber-cores, and quantum shipments directly to your comms channel.
            </p>
            <form onSubmit={handleSubscribe} className="flex gap-2">
              <input
                type="email"
                required
                placeholder="comm-address@net.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border text-sm glass-input"
              />
              <button
                type="submit"
                className="p-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white active:scale-95 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </div>

        </div>

        {/* Footer Base */}
        <div className="flex flex-col sm:flex-row items-center justify-between pt-8 text-xs text-slate-500 dark:text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} NeoCartX Corp. All network nodes reserved.</p>
          <div className="flex gap-6">
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">Core Network</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">Node Policy</a>
            <a href="#" className="hover:text-slate-700 dark:hover:text-slate-300">API Index</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
