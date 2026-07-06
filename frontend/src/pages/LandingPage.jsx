import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Cpu, ArrowRight, Shield, Zap, Sparkles, MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import Loader from '../components/Loader';

const LandingPage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch('/api/categories'),
          fetch('/api/products'),
        ]);

        if (catRes.ok && prodRes.ok) {
          const cats = await catRes.json();
          const prods = await prodRes.json();
          setCategories(cats);
          // Filter featured
          setFeaturedProducts(prods.filter((p) => p.isFeatured).slice(0, 4));
        }
      } catch (error) {
        console.error('Error fetching landing page data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const testimonials = [
    {
      name: 'Kaelen Vance',
      role: 'Mech Mechanic, Sector 7',
      quote: 'The Sentinel Exo-Suit saved my team during a thermal reactor leak. Dynamic posture correction felt completely natural.',
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=100&auto=format&fit=crop',
    },
    {
      name: 'Dr. Evelyn Moss',
      role: 'Neurologist, Kanto Clinic',
      quote: 'NeuralLink V4 Core installation is smooth and its dual-threaded qubit sync improves cognitive speeds significantly.',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=100&auto=format&fit=crop',
    },
  ];

  if (loading) return <Loader fullScreen />;

  return (
    <div className="relative min-h-screen overflow-hidden bg-white dark:bg-[#070a13] transition-colors duration-300">
      
      {/* Interactive Glowing Backdrop Orbs */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] rounded-full bg-cyan-500/10 dark:bg-cyan-500/5 glow-orb -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-1/3 right-1/4 w-[600px] h-[600px] rounded-full bg-indigo-500/10 dark:bg-indigo-500/5 glow-orb translate-x-1/2 translate-y-1/2" />

      {/* Grid Pattern Background */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-24 pt-10 pb-20">
        
        {/* 1. Hero Section */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[70vh]">
          <div className="space-y-6 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-600 dark:text-cyan-400 text-xs font-bold uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Next Gen Hardware Available Now</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl sm:text-6xl font-black tracking-tight leading-[1.1] text-slate-900 dark:text-white"
            >
              Augment Your <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-500 to-indigo-500 text-glow-cyan">
                Digital Reality
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-base sm:text-lg text-slate-500 dark:text-slate-400 max-w-lg mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              NeoCartX is the premier hardware catalog for futuristic cybernetics, high-impact exo-suits, and qubit power cells.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Link
                to="/shop"
                className="group flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-sm shadow-lg shadow-cyan-500/20 hover:shadow-glow-cyan hover:scale-[1.03] active:scale-[0.98] transition-all"
              >
                Enter Shop Grid
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href="#categories"
                className="px-8 py-3.5 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-sm font-bold transition-all"
              >
                Browse Specs
              </a>
            </motion.div>
          </div>

          {/* Hero Media Visualizer */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: 'spring' }}
            className="flex items-center justify-center relative"
          >
            {/* Outer Glowing Border Ring */}
            <div className="absolute inset-0 rounded-3xl bg-gradient-to-tr from-cyan-500/20 to-indigo-500/20 blur-2xl animate-pulse" />
            
            <div className="w-full max-w-md aspect-square rounded-3xl border border-slate-200/50 bg-white/40 dark:border-slate-800/40 dark:bg-slate-900/25 backdrop-blur-md p-6 relative flex flex-col justify-between shadow-2xl overflow-hidden group">
              {/* Graphic Overlay Grid */}
              <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none" />
              
              <div className="flex justify-between items-start z-10">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-500 dark:text-cyan-400">
                  <Cpu className="w-6 h-6 animate-spin" style={{ animationDuration: '6s' }} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest border border-cyan-500/30 text-cyan-600 dark:text-cyan-400 px-2.5 py-1 rounded-lg bg-cyan-500/5">
                  Quantum Link: Actv
                </span>
              </div>
              
              <div className="my-auto py-8 text-center space-y-3 z-10">
                <div className="text-sm font-bold uppercase tracking-widest text-slate-400">System Telemetry</div>
                <div className="text-3xl font-black tracking-wider text-slate-800 dark:text-white font-mono">NEO_GRID_9.42</div>
                <div className="text-xs text-slate-400 leading-normal max-w-[280px] mx-auto">
                  Cortex synchronizer running at 942 TFLOPs. Secure JWT gateway operational.
                </div>
              </div>

              <div className="flex items-center justify-between z-10 border-t border-slate-200/50 dark:border-slate-800/50 pt-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                <span>Latency: 0.18ms</span>
                <span>Uptime: 99.998%</span>
              </div>
            </div>
          </motion.div>
        </section>

        {/* 2. Categories Section */}
        <section id="categories" className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Shop By Augment Category</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Equip specific hardware layers configured for different operational networks.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {categories.map((cat, idx) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="group relative rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-sm p-6 hover:shadow-glow-cyan dark:border-slate-800/40 dark:bg-slate-900/40 hover:-translate-y-1 transition-all duration-300 overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-24 h-24 rounded-full bg-cyan-500/5 glow-orb group-hover:scale-125 transition-transform" />
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 border border-cyan-500/10 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                  <Cpu className="w-6 h-6" />
                </div>
                <h3 className="font-bold text-slate-950 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
                  {cat.name}
                </h3>
                <p className="text-xs text-slate-400 mt-2 line-clamp-2">{cat.description}</p>
              </Link>
            ))}
          </div>
        </section>

        {/* 3. Featured / Trending Products Carousel */}
        {featuredProducts.length > 0 && (
          <section className="space-y-10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-2 text-center sm:text-left">
                <h2 className="text-3xl font-black tracking-tight dark:text-white">Hot Featured Augments</h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Premium gear high-lighted for outstanding performance.
                </p>
              </div>
              <Link
                to="/shop"
                className="flex items-center gap-1 text-sm font-bold text-cyan-500 hover:text-cyan-400 transition-colors"
              >
                Explore Catalog Grid
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </section>
        )}

        {/* 4. Testimonials Section */}
        <section className="space-y-10">
          <div className="text-center space-y-2">
            <h2 className="text-3xl font-black tracking-tight dark:text-white">Operative Reports</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto">
              Real telemetry reports from grid sectors regarding NeoCartX hardware.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {testimonials.map((test, index) => (
              <div
                key={index}
                className="relative rounded-2xl border border-slate-200/50 bg-white/70 backdrop-blur-sm p-8 dark:border-slate-800/40 dark:bg-slate-900/40 space-y-4"
              >
                <div className="absolute top-8 right-8 text-cyan-500/10">
                  <MessageSquare className="w-14 h-14 fill-current" />
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed text-sm z-10 relative">
                  "{test.quote}"
                </p>
                <div className="flex items-center gap-4 z-10 relative pt-2">
                  <img
                    src={test.avatar}
                    alt={test.name}
                    className="w-11 h-11 rounded-full border border-slate-200 dark:border-slate-800"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-950 dark:text-white">{test.name}</h4>
                    <p className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider mt-0.5">{test.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </div>
  );
};

export default LandingPage;
