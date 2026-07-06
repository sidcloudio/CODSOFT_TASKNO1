import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import { 
  User, MapPin, ClipboardList, Settings, Plus, Trash2, 
  Check, Lock, ShieldAlert, Cpu
} from 'lucide-react';

const DashboardPage = () => {
  const { userInfo, updateProfile, addAddress, deleteAddress, getAuthHeaders } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('orders'); // orders, addresses, profile
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);

  // Profile Edit fields
  const [name, setName] = useState(userInfo?.name || '');
  const [email, setEmail] = useState(userInfo?.email || '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);

  // Address creation fields
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [addressLoading, setAddressLoading] = useState(false);

  // Fetch Order History
  useEffect(() => {
    const fetchOrders = async () => {
      setLoadingOrders(true);
      try {
        const res = await fetch('/api/orders/myorders', {
          headers: getAuthHeaders(),
        });
        if (res.ok) {
          const data = await res.json();
          setOrders(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    if (userInfo) {
      fetchOrders();
    }
  }, [userInfo]);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    if (password && password !== confirmPassword) {
      addToast('Passwords do not match', 'error');
      return;
    }

    setProfileLoading(true);
    try {
      await updateProfile({ name, email, password });
      addToast('Profile synced successfully!', 'success');
      setPassword('');
      setConfirmPassword('');
    } catch (err) {
      addToast(err.message || 'Profile update failed', 'error');
    } finally {
      setProfileLoading(false);
    }
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (!street || !city || !state || !zipCode || !country) return;

    setAddressLoading(true);
    try {
      await addAddress({ street, city, state, zipCode, country, isDefault: userInfo.addresses.length === 0 });
      addToast('Address added to profile', 'success');
      setShowAddressForm(false);
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
      setCountry('');
    } catch (err) {
      addToast('Failed to save address', 'error');
    } finally {
      setAddressLoading(false);
    }
  };

  const handleDeleteAddress = async (id) => {
    try {
      await deleteAddress(id);
      addToast('Address removed from profile', 'info');
    } catch (err) {
      addToast('Failed to remove address', 'error');
    }
  };

  if (!userInfo) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center">
        <Loader />
      </div>
    );
  }

  const tabs = [
    { id: 'orders', name: 'Order History', icon: ClipboardList },
    { id: 'addresses', name: 'Saved Addresses', icon: MapPin },
    { id: 'profile', name: 'Profile Config', icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a13] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6 dark:border-slate-800">
          <div className="space-y-1">
            <h1 className="text-3xl font-black tracking-tight dark:text-white">User Hub</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Configure profile, shipping nodes, and review transaction telemetry.</p>
          </div>
          
          <div className="flex items-center gap-3 bg-cyan-500/5 px-4 py-2 rounded-xl border border-cyan-500/10 text-cyan-600 dark:text-cyan-400 text-xs font-bold font-mono">
            <Cpu className="w-4.5 h-4.5 text-cyan-500 animate-pulse" />
            <span>OPERATIVE NODE: ACTV</span>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Navigation panel */}
          <aside className="space-y-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                    active
                      ? 'bg-cyan-500/15 border border-cyan-500/25 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4.5 h-4.5 ${active ? 'text-cyan-500' : 'text-slate-400'}`} />
                  {tab.name}
                </button>
              );
            })}
          </aside>

          {/* Content panel */}
          <main className="lg:col-span-3">
            {activeTab === 'orders' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold dark:text-white">Deployment Telemetry History</h3>
                
                {loadingOrders ? (
                  <Loader />
                ) : orders.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-16 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                    <p className="text-sm text-slate-400 font-bold">No orders found in search logs.</p>
                    <p className="text-xs text-slate-400 mt-1">Initiate a transaction at the shop grid to build manifest logs.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {orders.map((ord) => (
                      <div
                        key={ord._id}
                        className="glass-panel border rounded-2xl p-5 space-y-4 shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b pb-3 dark:border-slate-800 gap-2">
                          <div>
                            <p className="text-xs text-slate-400 font-semibold">MANIFEST ID</p>
                            <p className="text-sm font-black dark:text-slate-200">{ord._id}</p>
                          </div>
                          <div className="flex gap-3">
                            <span className="px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border border-cyan-500/20 bg-cyan-500/5 text-cyan-500 rounded-lg">
                              {ord.status}
                            </span>
                            <span className={`px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest border rounded-lg ${
                              ord.isPaid 
                                ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                                : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                            }`}>
                              {ord.isPaid ? 'PAID' : 'UNPAID'}
                            </span>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
                          <div>
                            <p className="text-[10px] uppercase text-slate-400">Date Dispatched</p>
                            <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                              {new Date(ord.createdAt).toLocaleString()}
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-slate-400">Items Count</p>
                            <p className="font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                              {ord.orderItems.reduce((acc, i) => acc + i.quantity, 0)} units
                            </p>
                          </div>
                          <div>
                            <p className="text-[10px] uppercase text-slate-400">Total Price</p>
                            <p className="font-bold text-cyan-500 mt-0.5">
                              ${ord.totalPrice.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                  <h3 className="text-lg font-bold dark:text-white">Shipping Delivery Nodes</h3>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white text-xs font-bold transition-all"
                  >
                    <Plus className="w-4 h-4" />
                    New Node
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddressSubmit} className="glass-panel border rounded-2xl p-5 space-y-4">
                    <h4 className="text-xs font-black uppercase tracking-wider text-slate-400">Add New Shipping Address</h4>
                    <div className="space-y-1.5">
                      <label className="text-[10px] text-slate-400 font-bold uppercase">Street Address</label>
                      <input
                        type="text"
                        required
                        value={street}
                        onChange={(e) => setStreet(e.target.value)}
                        placeholder="101 Cyber Plaza"
                        className="w-full px-3 py-2 rounded-xl border text-sm glass-input"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">City</label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="Neo Tokyo"
                          className="w-full px-3 py-2 rounded-xl border text-sm glass-input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">State / Sector</label>
                        <input
                          type="text"
                          required
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="Kanto"
                          className="w-full px-3 py-2 rounded-xl border text-sm glass-input"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Zip Code</label>
                        <input
                          type="text"
                          required
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="100-0001"
                          className="w-full px-3 py-2 rounded-xl border text-sm glass-input"
                        />
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Country</label>
                        <input
                          type="text"
                          required
                          value={country}
                          onChange={(e) => setCountry(e.target.value)}
                          placeholder="Japan"
                          className="w-full px-3 py-2 rounded-xl border text-sm glass-input"
                        />
                      </div>
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddressForm(false)}
                        className="px-5 py-2.5 rounded-xl border text-xs font-bold"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={addressLoading}
                        className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-xs font-bold"
                      >
                        {addressLoading ? 'Saving...' : 'Deploy Node'}
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {userInfo.addresses.map((addr) => (
                    <div
                      key={addr._id}
                      className="relative border border-slate-100 bg-slate-50/50 p-5 rounded-2xl dark:border-slate-800/40 dark:bg-slate-900/10 flex flex-col justify-between"
                    >
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-slate-900 dark:text-white text-sm">Delivery Destination</h4>
                          {addr.isDefault && (
                            <span className="flex items-center gap-0.5 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider bg-cyan-500/10 text-cyan-500 rounded-md border border-cyan-500/20">
                              <Check className="w-2.5 h-2.5" />
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-normal">
                          {addr.street}, {addr.city}, {addr.state} <br />
                          {addr.zipCode}, {addr.country}
                        </p>
                      </div>

                      <div className="flex justify-end pt-4 border-t mt-4 border-slate-100 dark:border-slate-800/50">
                        <button
                          onClick={() => handleDeleteAddress(addr._id)}
                          className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-500/5 border border-transparent hover:border-rose-500/10 rounded-xl transition-colors"
                          title="Remove address"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'profile' && (
              <div className="space-y-6">
                <h3 className="text-lg font-bold dark:text-white">Profile Node Configuration</h3>
                
                <form onSubmit={handleProfileSubmit} className="glass-panel border rounded-2xl p-6 space-y-4 max-w-xl">
                  
                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold uppercase">Identity Name</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm glass-input"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs text-slate-400 font-bold uppercase">Comm Link Email</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border text-sm glass-input"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4 border-t border-slate-200/50 dark:border-slate-800/50 pt-4 mt-4">
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> New Access Key
                      </label>
                      <input
                        type="password"
                        placeholder="Leave blank to retain key"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm glass-input"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs text-slate-400 font-bold uppercase flex items-center gap-1">
                        <Lock className="w-3.5 h-3.5" /> Confirm Access Key
                      </label>
                      <input
                        type="password"
                        placeholder="Confirm password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="w-full px-3 py-2.5 rounded-xl border text-sm glass-input"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={profileLoading}
                    className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white hover:shadow-glow-cyan text-xs font-bold mt-4"
                  >
                    {profileLoading ? 'Syncing Node...' : 'Update Profile'}
                  </button>

                </form>
              </div>
            )}
          </main>

        </div>

      </div>
    </div>
  );
};

export default DashboardPage;
