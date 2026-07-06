import React from 'react';
import { Cpu } from 'lucide-react';
import { motion } from 'framer-motion';

const Loader = ({ fullScreen = false }) => {
  return (
    <div
      className={`${
        fullScreen ? 'fixed inset-0 z-[9999] bg-[#070a13]' : 'w-full py-16'
      } flex flex-col items-center justify-center`}
    >
      <div className="relative flex items-center justify-center">
        {/* Glowing Orb Backdrop */}
        <div className="absolute w-16 h-16 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
        
        {/* Outer Ring */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
          className="w-16 h-16 border-2 border-slate-200 border-t-cyan-500 rounded-full dark:border-slate-800 dark:border-t-cyan-400"
        />

        {/* Core Icon */}
        <motion.div
          animate={{ scale: [0.9, 1.1, 0.9] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: 'easeInOut' }}
          className="absolute text-cyan-500 dark:text-cyan-400"
        >
          <Cpu className="w-6 h-6" />
        </motion.div>
      </div>

      <p className="mt-4 text-xs font-extrabold uppercase tracking-widest text-slate-500 dark:text-slate-400 animate-pulse text-glow-cyan">
        Syncing Quantum Link...
      </p>
    </div>
  );
};

export default Loader;
