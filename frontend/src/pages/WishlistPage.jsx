import React from 'react';
import { Link } from 'react-router-dom';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import { Heart, Trash2, ShoppingCart, ArrowRight } from 'lucide-react';
import { motion } from 'framer-motion';

const WishlistPage = () => {
  const { wishlistItems, moveToCart, removeFromWishlist } = useWishlist();
  const { addToast } = useToast();

  const handleMoveToCart = (product) => {
    if (product.countInStock === 0) {
      addToast('Cannot move depleted item to cart', 'error');
      return;
    }
    moveToCart(product);
    addToast(`${product.name} moved to cart`, 'success');
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a13] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-3xl font-black tracking-tight dark:text-white font-sans">Saved Augments</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Manage saved modules and sync them to your cart.</p>
        </div>

        {wishlistItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <Heart className="w-12 h-12 text-slate-300 dark:text-slate-800 animate-pulse" />
            <h3 className="font-bold text-lg dark:text-white">Wishlist Cache is Empty</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              No items have been saved to your workspace hub.
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-sm shadow-md"
            >
              Browse Hardware Grid
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {wishlistItems.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="relative rounded-2xl group border border-slate-200/50 bg-white/70 backdrop-blur-sm shadow-md dark:border-slate-800/40 dark:bg-slate-900/40 overflow-hidden"
              >
                {/* Floating stock label */}
                {product.countInStock === 0 && (
                  <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-rose-500 text-white">
                    Depleted
                  </span>
                )}

                {/* Product Image */}
                <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop';
                    }}
                  />
                </div>

                {/* Content */}
                <div className="p-5 space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{product.brand}</span>
                    <h3 className="font-bold text-slate-900 dark:text-white truncate text-base hover:text-cyan-500 mt-1">
                      <Link to={`/product/${product._id}`}>{product.name}</Link>
                    </h3>
                    <p className="text-lg font-black text-slate-900 dark:text-white mt-1">
                      ${product.price?.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
                    <button
                      onClick={() => handleMoveToCart(product)}
                      disabled={product.countInStock === 0}
                      className={`flex-grow py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                        product.countInStock === 0
                          ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                          : 'bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:shadow-glow-cyan'
                      }`}
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Move To Cart
                    </button>

                    <button
                      onClick={() => {
                        removeFromWishlist(product._id);
                        addToast(`${product.name} removed from wishlist`, 'info');
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-rose-500/30 hover:bg-rose-500/5 text-slate-400 hover:text-rose-500 dark:border-slate-800 transition-colors"
                      title="Remove"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};

export default WishlistPage;
