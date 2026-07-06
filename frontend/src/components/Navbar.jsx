import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useTheme } from '../context/ThemeContext';
import { useToast } from '../context/ToastContext';
import { 
  ShoppingBag, Heart, Sun, Moon, User, Menu, X, 
  Cpu, LogOut, LayoutDashboard, Settings
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Navbar = () => {
  const { userInfo, logout, isAuthenticated, isAdmin } = useAuth();
  const { cartItems } = useCart();
  const { wishlistItems } = useWishlist();
  const { theme, toggleTheme } = useTheme();
  const { addToast } = useToast();
  
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    addToast('Logged out successfully', 'info');
    setUserDropdownOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="sticky top-0 z-50 w-full glass-panel border-b transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/20 group-hover:rotate-12 transition-transform duration-300">
              <Cpu className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-2xl tracking-wider bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 dark:from-cyan-400 dark:to-indigo-400">
              NEO<span className="text-cyan-500 dark:text-white">CARTX</span>
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`relative font-semibold text-sm tracking-wide transition-colors ${
                  isActive(link.path)
                    ? 'text-cyan-500 dark:text-cyan-400 font-bold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white'
                }`}
              >
                {link.name}
                {isActive(link.path) && (
                  <motion.div
                    layoutId="activeNavBorder"
                    className="absolute -bottom-1 left-0 right-0 h-0.5 bg-cyan-500 dark:bg-cyan-400"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Action Icons */}
          <div className="hidden md:flex items-center gap-6">
            
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors"
              title="Toggle theme"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Wishlist Icon */}
            <Link
              to="/wishlist"
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors"
            >
              <Heart className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {wishlistItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white shadow-md animate-pulse">
                  {wishlistItems.length}
                </span>
              )}
            </Link>

            {/* Cart Icon */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors"
            >
              <ShoppingBag className="w-5 h-5 text-slate-700 dark:text-slate-300" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-cyan-500 text-[10px] font-bold text-white shadow-md animate-pulse">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>

            {/* User Dropdown */}
            <div className="relative">
              {isAuthenticated ? (
                <>
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-3 pr-2 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900/60 transition-colors"
                  >
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-cyan-500 to-indigo-500 text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                      {userInfo.name.charAt(0)}
                    </div>
                    <span className="text-sm font-semibold max-w-[80px] truncate">{userInfo.name.split(' ')[0]}</span>
                  </button>

                  <AnimatePresence>
                    {userDropdownOpen && (
                      <>
                        {/* Overlay backdrop */}
                        <div className="fixed inset-0 z-40" onClick={() => setUserDropdownOpen(false)} />
                        
                        <motion.div
                          initial={{ opacity: 0, y: 10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 10, scale: 0.95 }}
                          transition={{ duration: 0.15 }}
                          className="absolute right-0 mt-2 w-52 rounded-xl glass-panel-heavy p-2 shadow-2xl z-50"
                        >
                          <div className="px-3 py-2 border-b border-slate-200/50 dark:border-slate-800/50 mb-1">
                            <p className="text-xs text-slate-400 font-semibold">Logged in as</p>
                            <p className="text-sm font-semibold truncate dark:text-slate-200">{userInfo.email}</p>
                          </div>
                          
                          {isAdmin && (
                            <Link
                              to="/admin"
                              onClick={() => setUserDropdownOpen(false)}
                              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-cyan-500 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors font-semibold"
                            >
                              <LayoutDashboard className="w-4 h-4" />
                              Admin Dashboard
                            </Link>
                          )}
                          
                          <Link
                            to="/dashboard"
                            onClick={() => setUserDropdownOpen(false)}
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 transition-colors"
                          >
                            <User className="w-4 h-4" />
                            My Dashboard
                          </Link>

                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-rose-500 hover:bg-rose-500/10 transition-colors"
                          >
                            <LogOut className="w-4 h-4" />
                            Log Out
                          </button>
                        </motion.div>
                      </>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:shadow-glow-cyan hover:scale-[1.02] active:scale-[0.98] transition-all"
                >
                  <User className="w-4 h-4" />
                  Sign In
                </Link>
              )}
            </div>

          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-4">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-slate-700" />}
            </button>

            {/* Cart Icon Mobile */}
            <Link
              to="/cart"
              className="relative p-2 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartItems.length > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4.5 w-4.5 items-center justify-center rounded-full bg-cyan-500 text-[9px] font-bold text-white">
                  {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
                </span>
              )}
            </Link>

            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-xl border border-slate-200 dark:border-slate-800"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden glass-panel-heavy border-t overflow-hidden"
          >
            <div className="px-4 pt-3 pb-6 space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`block px-3 py-2 rounded-lg text-base font-medium ${
                    isActive(link.path)
                      ? 'bg-slate-100 dark:bg-slate-800 text-cyan-500 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              ))}

              <Link
                to="/wishlist"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg text-base font-medium text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900"
              >
                <Heart className="w-5 h-5" />
                Wishlist ({wishlistItems.length})
              </Link>

              {isAuthenticated ? (
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50 space-y-2">
                  <div className="px-3 py-1.5">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-semibold truncate">{userInfo.email}</p>
                  </div>
                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setMobileMenuOpen(false)}
                      className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-cyan-500 font-semibold hover:bg-slate-50 dark:hover:bg-slate-900"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      Admin Dashboard
                    </Link>
                  )}
                  <Link
                    to="/dashboard"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-900"
                  >
                    <User className="w-4 h-4" />
                    My Dashboard
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-2 w-full text-left px-3 py-2 rounded-lg text-sm text-rose-500 hover:bg-rose-500/10"
                  >
                    <LogOut className="w-4 h-4" />
                    Log Out
                  </button>
                </div>
              ) : (
                <div className="pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center justify-center gap-2 w-full px-5 py-2.5 rounded-xl text-sm font-bold bg-gradient-to-r from-cyan-500 to-indigo-500 text-white"
                  >
                    <User className="w-4 h-4" />
                    Sign In
                  </Link>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
