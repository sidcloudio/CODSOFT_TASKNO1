import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const CartPage = () => {
  const { cartItems, updateQuantity, removeFromCart, itemsPrice, shippingPrice, taxPrice, totalPrice } = useCart();
  const { isAuthenticated } = useAuth();
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleCheckoutRedirect = () => {
    if (isAuthenticated) {
      navigate('/checkout');
    } else {
      addToast('Please login to finalize checkout authorization', 'info');
      navigate('/login?redirect=checkout');
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a13] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-3xl font-black tracking-tight dark:text-white font-sans">Shopping Cart</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Review your selected cybernetic cargo before deployment.</p>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
            <ShoppingBag className="w-12 h-12 text-slate-300 dark:text-slate-800 animate-bounce" />
            <h3 className="font-bold text-lg dark:text-white">Your Cart is Empty</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              No hardware augmentations have been loaded to your cart cache.
            </p>
            <Link
              to="/shop"
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white font-bold text-sm shadow-md"
            >
              Browse Hardware Grid
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Items Column */}
            <div className="lg:col-span-2 space-y-4">
              {cartItems.map((item) => (
                <motion.div
                  key={item.product._id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5 rounded-2xl border border-slate-200/50 bg-white/70 dark:border-slate-800/40 dark:bg-slate-900/40"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-xl object-cover bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white text-base leading-tight hover:text-cyan-500">
                        <Link to={`/product/${item.product._id}`}>{item.product.name}</Link>
                      </h4>
                      <p className="text-xs text-slate-400 font-semibold mt-1">
                        Price: ${item.product.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between w-full sm:w-auto gap-6 sm:gap-4 border-t sm:border-t-0 pt-4 sm:pt-0">
                    {/* Quantity selectors */}
                    <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden glass-panel">
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-50"
                      >
                        -
                      </button>
                      <span className="px-3 text-sm font-bold w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.product._id, item.quantity + 1)}
                        disabled={item.quantity >= item.product.countInStock}
                        className="px-3 py-1 hover:bg-slate-100 dark:hover:bg-slate-900 disabled:opacity-50"
                      >
                        +
                      </button>
                    </div>

                    <button
                      onClick={() => {
                        removeFromCart(item.product._id);
                        addToast(`${item.product.name} removed from cart`, 'info');
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-rose-500/30 hover:bg-rose-500/5 text-slate-400 hover:text-rose-500 dark:border-slate-800 transition-colors"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Checkout / Summary Column */}
            <div className="space-y-6">
              <div className="glass-panel border rounded-2xl p-6 space-y-6">
                <h3 className="text-lg font-bold tracking-tight border-b pb-3 dark:text-white">Summary</h3>
                
                <div className="space-y-3.5 text-sm">
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Subtotal</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      ${itemsPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  
                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Shipping Estimate</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
                    </span>
                  </div>

                  <div className="flex justify-between text-slate-500 dark:text-slate-400">
                    <span>Tax (8%)</span>
                    <span className="font-bold text-slate-800 dark:text-slate-200">
                      ${taxPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold border-t pt-4 dark:text-white">
                    <span>Deployment Total</span>
                    <span className="text-glow-cyan text-cyan-500">
                      ${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                </div>

                <button
                  onClick={handleCheckoutRedirect}
                  className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white font-bold text-sm flex items-center justify-center gap-2"
                >
                  Proceed to Checkout
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              {/* Secure Transaction badge */}
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-slate-400">
                <ShieldCheck className="w-4 h-4 text-cyan-500" />
                <span>SSL Encrypted Checkout Terminal</span>
              </div>
            </div>

          </div>
        )}

      </div>
    </div>
  );
};

export default CartPage;
