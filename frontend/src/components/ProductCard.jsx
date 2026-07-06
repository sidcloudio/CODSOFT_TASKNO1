import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useToast } from '../context/ToastContext';
import Rating from './Rating';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { addToast } = useToast();

  const isWishlisted = isInWishlist(product._id);
  const outOfStock = product.countInStock === 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    if (outOfStock) return;
    addToCart(product, 1);
    addToast(`${product.name} added to cart`, 'success');
  };

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    toggleWishlist(product);
    addToast(
      isWishlisted ? `${product.name} removed from wishlist` : `${product.name} added to wishlist`,
      'info'
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -6, transition: { duration: 0.2 } }}
      className="relative rounded-2xl group border border-slate-200/50 bg-white/70 backdrop-blur-sm shadow-md hover:shadow-glow-cyan dark:border-slate-800/40 dark:bg-slate-900/40 overflow-hidden transition-all duration-300"
    >
      {/* Wishlist Button floating */}
      <button
        onClick={handleWishlistToggle}
        className="absolute top-4 right-4 z-10 p-2.5 rounded-xl backdrop-blur-md border border-slate-200 bg-white/70 text-slate-400 hover:text-rose-500 hover:bg-white dark:border-slate-800 dark:bg-slate-950/40 dark:hover:bg-slate-900 transition-colors"
      >
        <Heart className={`w-4 h-4 transition-transform group-active:scale-90 ${isWishlisted ? 'fill-rose-500 text-rose-500' : ''}`} />
      </button>

      {/* Stock warning float */}
      {outOfStock ? (
        <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-rose-500 text-white shadow-md">
          Depleted
        </span>
      ) : product.countInStock <= 5 ? (
        <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-amber-500 text-slate-950 shadow-md">
          Low Stock ({product.countInStock})
        </span>
      ) : product.isFeatured ? (
        <span className="absolute top-4 left-4 z-10 px-2.5 py-1 text-[10px] font-black uppercase tracking-widest rounded-lg bg-cyan-500 text-white shadow-md">
          Hot Tech
        </span>
      ) : null}

      <Link to={`/product/${product._id}`} className="block">
        {/* Product Image Panel */}
        <div className="w-full aspect-[4/3] bg-slate-100 dark:bg-slate-950 overflow-hidden relative">
          <img
            src={product.images[0] || '/placeholder.jpg'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={(e) => {
              e.target.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop';
            }}
          />
          {/* Subtle overlay shading */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/10 to-transparent pointer-events-none" />
        </div>

        {/* Product Details Panel */}
        <div className="p-5 space-y-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
            <span>{product.brand}</span>
            <span>•</span>
            <span className="text-cyan-500">{product.category?.name || 'General'}</span>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-slate-100 truncate text-base group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">
            {product.name}
          </h3>

          <div className="flex items-center justify-between">
            <Rating value={product.rating} text={`(${product.numReviews})`} />
            <div className="flex items-center gap-1 text-[10px] text-emerald-400 bg-emerald-500/5 px-2 py-0.5 rounded-full border border-emerald-500/10">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Certified</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/40">
            <span className="text-lg font-black text-slate-900 dark:text-white">
              ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </span>

            <button
              onClick={handleAddToCart}
              disabled={outOfStock}
              className={`p-2.5 rounded-xl flex items-center justify-center transition-all ${
                outOfStock
                  ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                  : 'bg-gradient-to-tr from-cyan-500 to-indigo-500 text-white hover:shadow-glow-cyan hover:scale-105 active:scale-95'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
