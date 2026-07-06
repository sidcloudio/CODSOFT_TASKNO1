import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/Loader';
import { CheckCircle2, Package, ArrowRight, Home } from 'lucide-react';
import { motion } from 'framer-motion';

const OrderSuccessPage = () => {
  const { id } = useParams();
  const { getAuthHeaders } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${id}`, {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          setOrder(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  if (loading) return <Loader fullScreen />;

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a13] py-16 transition-colors duration-300">
      <div className="max-w-3xl mx-auto px-4 text-center space-y-10">
        
        {/* Success Card */}
        <div className="glass-panel border rounded-3xl p-8 md:p-12 space-y-6 shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />

          {/* Green Check Orb */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 200, damping: 15 }}
            className="inline-flex w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/30 items-center justify-center text-emerald-400 mx-auto"
          >
            <CheckCircle2 className="w-8 h-8" />
          </motion.div>

          <div className="space-y-2 relative z-10">
            <h1 className="text-3xl font-black tracking-tight dark:text-white">Transaction Deployed Successfully</h1>
            <p className="text-sm text-slate-400 font-semibold uppercase tracking-wider">Order ID: {order?._id || id}</p>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-md mx-auto leading-relaxed">
            Your telemetry authorization has been verified. The cargo is being compiled and prepared for sector delivery. 
            A confirmation receipt has been dispatched to your registered comm link address.
          </p>

          {/* Order Details Panel */}
          {order && (
            <div className="border border-slate-100 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/10 rounded-2xl p-6 text-left space-y-4 max-w-lg mx-auto">
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2 border-b pb-2">
                <Package className="w-4 h-4 text-cyan-500" />
                Delivery Manifest
              </h3>
              
              <div className="space-y-1 text-xs">
                <p className="text-slate-400 font-semibold uppercase">Destination</p>
                <p className="font-bold text-slate-800 dark:text-slate-200">
                  {order.shippingAddress.street}, {order.shippingAddress.city}, {order.shippingAddress.state} ({order.shippingAddress.zipCode}), {order.shippingAddress.country}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="space-y-1">
                  <p className="text-slate-400 font-semibold uppercase">Deployment Cost</p>
                  <p className="font-bold text-cyan-500">${order.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-slate-400 font-semibold uppercase">Transit Status</p>
                  <p className="font-bold text-emerald-400">{order.status}</p>
                </div>
              </div>
            </div>
          )}

          {/* Navigation CTAs */}
          <div className="flex flex-col sm:flex-row justify-center gap-4 pt-4">
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white font-bold text-sm"
            >
              Go to Dashboard
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/"
              className="flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 font-bold text-sm"
            >
              <Home className="w-4 h-4" />
              Return Home
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccessPage;
