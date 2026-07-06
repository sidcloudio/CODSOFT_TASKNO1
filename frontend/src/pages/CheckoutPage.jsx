import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { ShieldCheck, CreditCard, Home, CheckCircle2, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const CheckoutPage = () => {
  const navigate = useNavigate();
  const { cartItems, itemsPrice, shippingPrice, taxPrice, totalPrice, clearCart } = useCart();
  const { userInfo, getAuthHeaders } = useAuth();
  const { addToast } = useToast();

  // Redirect if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  // Steps: 1 = Shipping, 2 = Payment
  const [step, setStep] = useState(1);
  const [processing, setProcessing] = useState(false);

  // Address State
  const defaultAddress = userInfo?.addresses?.find((a) => a.isDefault) || userInfo?.addresses?.[0];
  const [useSavedAddress, setUseSavedAddress] = useState(!!defaultAddress);
  const [selectedAddressId, setSelectedAddressId] = useState(defaultAddress?._id || '');

  // Form Fields
  const [street, setStreet] = useState(defaultAddress?.street || '');
  const [city, setCity] = useState(defaultAddress?.city || '');
  const [state, setState] = useState(defaultAddress?.state || '');
  const [zipCode, setZipCode] = useState(defaultAddress?.zipCode || '');
  const [country, setCountry] = useState(defaultAddress?.country || '');

  // Payment Form Fields
  const [cardName, setCardName] = useState(userInfo?.name || '');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Handle saved address selection
  const handleSelectAddress = (id) => {
    setSelectedAddressId(id);
    const addr = userInfo.addresses.find((a) => a._id === id);
    if (addr) {
      setStreet(addr.street);
      setCity(addr.city);
      setState(addr.state);
      setZipCode(addr.zipCode);
      setCountry(addr.country);
    }
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode || !country) {
      addToast('Please enter full shipping address details', 'error');
      return;
    }
    setStep(2);
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      addToast('Please fill out card details', 'error');
      return;
    }

    setProcessing(true);
    try {
      // Create shippingAddress object
      const shippingAddress = { street, city, state, zipCode, country };

      // Compile order items formatted for backend
      const orderItems = cartItems.map((item) => ({
        name: item.product.name,
        quantity: item.quantity,
        image: item.product.images[0],
        price: item.product.price,
        product: item.product._id,
      }));

      // Mock transaction result
      const paymentResult = {
        id: 'MOCK_TXN_' + Math.random().toString(36).substring(2, 11).toUpperCase(),
        status: 'SUCCESS',
        update_time: new Date().toISOString(),
        email_address: userInfo.email,
      };

      const response = await fetch('/api/orders', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          orderItems,
          shippingAddress,
          itemsPrice,
          shippingPrice,
          taxPrice,
          totalPrice,
          paymentResult,
        }),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Deployment of order failed');
      }

      addToast('Transaction complete! Order deployed.', 'success');
      clearCart();
      navigate(`/order-success/${data._id}`);
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a13] py-10 transition-colors duration-300 relative">
      
      {/* Processing Loader Overlay */}
      <AnimatePresence>
        {processing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-slate-950/80 backdrop-blur-md"
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-20 h-20 rounded-full bg-cyan-500/20 blur-xl animate-pulse" />
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1.2, ease: 'linear' }}
                className="w-16 h-16 border-2 border-slate-700 border-t-cyan-500 rounded-full"
              />
            </div>
            <p className="mt-6 text-sm font-extrabold uppercase tracking-widest text-cyan-400 text-glow-cyan animate-pulse">
              Securing Payment Node...
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Title */}
        <div>
          <h1 className="text-3xl font-black tracking-tight dark:text-white">Deployment Terminal</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Finalize order delivery addresses and secure authorization.</p>
        </div>

        {/* Step Indicators */}
        <div className="flex gap-4 items-center">
          <div className={`flex items-center gap-2 text-sm font-bold ${step >= 1 ? 'text-cyan-500' : 'text-slate-400'}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">1</span>
            <span>Shipping</span>
          </div>
          <div className="h-px bg-slate-200 dark:bg-slate-800 flex-grow max-w-[80px]" />
          <div className={`flex items-center gap-2 text-sm font-bold ${step >= 2 ? 'text-cyan-500' : 'text-slate-400'}`}>
            <span className="w-6 h-6 rounded-full border border-current flex items-center justify-center text-xs">2</span>
            <span>Secure Payment</span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Form Side */}
          <div className="lg:col-span-2 space-y-6">
            {step === 1 ? (
              /* SHIPPING STEP */
              <div className="glass-panel border rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 border-b pb-3">
                  <Home className="w-5 h-5 text-cyan-500" />
                  <h3 className="text-lg font-bold dark:text-white">Shipping Address</h3>
                </div>

                {userInfo?.addresses?.length > 0 && (
                  <div className="space-y-4">
                    <label className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider">
                      <input
                        type="checkbox"
                        checked={useSavedAddress}
                        onChange={(e) => {
                          setUseSavedAddress(e.target.checked);
                          if (e.target.checked) {
                            handleSelectAddress(selectedAddressId || userInfo.addresses[0]._id);
                          }
                        }}
                        className="rounded border-slate-300 dark:border-slate-800 dark:bg-slate-900 focus:ring-cyan-500"
                      />
                      Use Saved Address Profile
                    </label>

                    {useSavedAddress && (
                      <select
                        value={selectedAddressId}
                        onChange={(e) => handleSelectAddress(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm glass-input"
                      >
                        {userInfo.addresses.map((addr) => (
                          <option key={addr._id} value={addr._id}>
                            {addr.street}, {addr.city}, {addr.state} ({addr.zipCode})
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <form onSubmit={handleNextStep} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Street Address</label>
                    <input
                      type="text"
                      required
                      disabled={useSavedAddress}
                      placeholder="123 Grid Lane"
                      value={street}
                      onChange={(e) => setStreet(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm glass-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">City</label>
                      <input
                        type="text"
                        required
                        disabled={useSavedAddress}
                        placeholder="Neo Tokyo"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm glass-input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">State / Sector</label>
                      <input
                        type="text"
                        required
                        disabled={useSavedAddress}
                        placeholder="Kanto"
                        value={state}
                        onChange={(e) => setState(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm glass-input"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Zip / Grid Code</label>
                      <input
                        type="text"
                        required
                        disabled={useSavedAddress}
                        placeholder="100-0001"
                        value={zipCode}
                        onChange={(e) => setZipCode(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm glass-input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Country</label>
                      <input
                        type="text"
                        required
                        disabled={useSavedAddress}
                        placeholder="Japan"
                        value={country}
                        onChange={(e) => setCountry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm glass-input"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white font-bold text-sm flex items-center justify-center gap-2 mt-6"
                  >
                    Proceed to Payment
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </form>
              </div>
            ) : (
              /* PAYMENT STEP */
              <div className="glass-panel border rounded-2xl p-6 space-y-6">
                <div className="flex items-center gap-2 border-b pb-3">
                  <CreditCard className="w-5 h-5 text-cyan-500" />
                  <h3 className="text-lg font-bold dark:text-white">Secure Credit Card</h3>
                </div>

                <form onSubmit={handlePlaceOrder} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Cardholder Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Alex Vance"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm glass-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Card Number</label>
                    <input
                      type="text"
                      required
                      placeholder="4000 1234 5678 9010"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl border text-sm glass-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Expiry Date</label>
                      <input
                        type="text"
                        required
                        placeholder="MM / YY"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm glass-input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase tracking-wider">Secure CVV</label>
                      <input
                        type="password"
                        required
                        maxLength={3}
                        placeholder="•••"
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="w-full px-4 py-2.5 rounded-xl border text-sm glass-input"
                      />
                    </div>
                  </div>

                  <div className="flex gap-4 pt-4 border-t mt-6">
                    <button
                      type="button"
                      onClick={() => setStep(1)}
                      className="px-6 py-3 rounded-xl border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-900 text-xs font-bold transition-all"
                    >
                      Back
                    </button>
                    <button
                      type="submit"
                      className="flex-grow py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white text-xs font-bold"
                    >
                      Deploy Order Authorization (${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })})
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>

          {/* Summary Side */}
          <div className="space-y-6">
            <div className="glass-panel border rounded-2xl p-6 space-y-4">
              <h3 className="text-base font-bold dark:text-white border-b pb-2">Order Items</h3>
              
              <div className="space-y-3.5 max-h-56 overflow-y-auto pr-1">
                {cartItems.map((item) => (
                  <div key={item.product._id} className="flex justify-between items-center gap-3 text-xs">
                    <div className="flex items-center gap-2 truncate">
                      <img src={item.product.images[0]} alt="" className="w-8 h-8 rounded-lg object-cover" />
                      <span className="font-semibold text-slate-700 dark:text-slate-300 truncate">{item.product.name}</span>
                    </div>
                    <span className="font-bold flex-shrink-0 text-slate-500">
                      {item.quantity}x ${item.product.price?.toLocaleString()}
                    </span>
                  </div>
                ))}
              </div>

              <div className="border-t border-slate-200 dark:border-slate-800 pt-4 space-y-2 text-xs">
                <div className="flex justify-between text-slate-400">
                  <span>Subtotal</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">${itemsPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Shipping</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">
                    {shippingPrice === 0 ? 'Free' : `$${shippingPrice.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Tax (8%)</span>
                  <span className="font-bold text-slate-700 dark:text-slate-300">${taxPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-black border-t pt-3 dark:text-white">
                  <span>Total</span>
                  <span className="text-cyan-500">${totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-2 text-xs text-slate-400 font-semibold bg-cyan-500/5 p-4 rounded-xl border border-cyan-500/10">
              <ShieldCheck className="w-4 h-4 text-cyan-500" />
              <span>SSL Guard Secure Payment Protocol Active</span>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};

export default CheckoutPage;
