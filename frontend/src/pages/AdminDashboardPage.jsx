import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Loader from '../components/Loader';
import { 
  BarElement, CategoryScale, Chart as ChartJS, Legend, 
  LinearScale, LineElement, PointElement, Title, Tooltip 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { 
  BarChart, Users, Package, ShoppingCart, AlertCircle, Plus, 
  Trash2, Edit3, Check, Loader2, RefreshCw, Cpu
} from 'lucide-react';

// Register ChartJS plugins
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const AdminDashboardPage = () => {
  const { getAuthHeaders } = useAuth();
  const { addToast } = useToast();

  const [activeTab, setActiveTab] = useState('metrics'); // metrics, products, categories, orders, users
  const [metrics, setMetrics] = useState(null);
  const [salesHistory, setSalesHistory] = useState([]);
  const [recentOrders, setRecentOrders] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);

  // CRUD Loading States
  const [actionLoading, setActionLoading] = useState(false);

  // 1. Create/Edit Category Modal state
  const [showCatModal, setShowCatModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null); // null means adding new
  const [catName, setCatName] = useState('');
  const [catDesc, setCatDesc] = useState('');

  // 2. Create/Edit Product Modal state
  const [showProdModal, setShowProdModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null means adding new
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodPrice, setProdPrice] = useState('');
  const [prodStock, setProdStock] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodCategory, setProdCategory] = useState('');
  const [prodImage, setProdImage] = useState('');
  const [prodFeatured, setProdFeatured] = useState(false);

  // Fetch Dashboard details & all models
  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [dashRes, catRes, prodRes, orderRes, usersRes] = await Promise.all([
        fetch('/api/admin/dashboard', { headers: getAuthHeaders() }),
        fetch('/api/categories'),
        fetch('/api/products'),
        fetch('/api/orders/admin/all', { headers: getAuthHeaders() }),
        fetch('/api/admin/users', { headers: getAuthHeaders() })
      ]);

      if (dashRes.ok) {
        const data = await dashRes.json();
        setMetrics(data.metrics);
        setSalesHistory(data.salesHistory || []);
      }
      if (catRes.ok) setCategoriesList(await catRes.json());
      if (prodRes.ok) setProductsList(await prodRes.json());
      if (orderRes.ok) setRecentOrders(await orderRes.json());
      if (usersRes.ok) setUsersList(await usersRes.json());
    } catch (err) {
      console.error(err);
      addToast('Error syncing administrative data frame', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Category Actions
  const handleCatSubmit = async (e) => {
    e.preventDefault();
    if (!catName) return;

    setActionLoading(true);
    try {
      const url = editingCategory 
        ? `/api/categories/admin/${editingCategory._id}` 
        : '/api/categories/admin';
      const method = editingCategory ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({ name: catName, description: catDesc }),
      });

      if (response.ok) {
        addToast(editingCategory ? 'Category updated' : 'Category created', 'success');
        setShowCatModal(false);
        setCatName('');
        setCatDesc('');
        setEditingCategory(null);
        await fetchDashboardData();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditCat = (cat) => {
    setEditingCategory(cat);
    setCatName(cat.name);
    setCatDesc(cat.description || '');
    setShowCatModal(true);
  };

  const handleDeleteCat = async (id) => {
    if (!window.confirm('Delete category? All products linked will lose category references.')) return;
    try {
      const response = await fetch(`/api/categories/admin/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        addToast('Category removed successfully', 'info');
        await fetchDashboardData();
      }
    } catch (err) {
      addToast('Deletion failed', 'error');
    }
  };

  // Product Actions
  const handleProdSubmit = async (e) => {
    e.preventDefault();
    if (!prodName || !prodPrice || !prodCategory || !prodBrand) {
      addToast('Please fill out all required fields', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const url = editingProduct 
        ? `/api/products/admin/manage/${editingProduct._id}` 
        : '/api/products/admin/manage';
      const method = editingProduct ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: getAuthHeaders(),
        body: JSON.stringify({
          name: prodName,
          brand: prodBrand,
          price: Number(prodPrice),
          countInStock: Number(prodStock),
          description: prodDesc,
          category: prodCategory,
          images: [prodImage || 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop'],
          isFeatured: prodFeatured,
        }),
      });

      if (response.ok) {
        addToast(editingProduct ? 'Product synchronized' : 'Product deployed', 'success');
        setShowProdModal(false);
        setEditingProduct(null);
        // Reset states
        setProdName('');
        setProdBrand('');
        setProdPrice('');
        setProdStock('');
        setProdDesc('');
        setProdCategory('');
        setProdImage('');
        setProdFeatured(false);
        await fetchDashboardData();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditProd = (prod) => {
    setEditingProduct(prod);
    setProdName(prod.name);
    setProdBrand(prod.brand);
    setProdPrice(prod.price);
    setProdStock(prod.countInStock);
    setProdDesc(prod.description);
    setProdCategory(prod.category?._id || prod.category || '');
    setProdImage(prod.images[0] || '');
    setProdFeatured(prod.isFeatured || false);
    setShowProdModal(true);
  };

  const handleDeleteProd = async (id) => {
    if (!window.confirm('Erase product card from server grid?')) return;
    try {
      const response = await fetch(`/api/products/admin/manage/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        addToast('Product wiped from registry', 'info');
        await fetchDashboardData();
      }
    } catch (err) {
      addToast('Deletion error', 'error');
    }
  };

  // Order Actions
  const handleUpdateOrderStatus = async (id, status, isPaid, isDelivered) => {
    try {
      const response = await fetch(`/api/orders/admin/${id}/status`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify({ status, isPaid, isDelivered }),
      });
      if (response.ok) {
        addToast('Order status synchronized', 'success');
        await fetchDashboardData();
      }
    } catch (err) {
      addToast('Failed to update status', 'error');
    }
  };

  // User Actions
  const handleDeleteUser = async (id) => {
    if (!window.confirm('Sever user grid credentials? This cannot be undone.')) return;
    try {
      const response = await fetch(`/api/admin/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      if (response.ok) {
        addToast('User server connection terminated', 'info');
        await fetchDashboardData();
      } else {
        const data = await response.json();
        throw new Error(data.message);
      }
    } catch (err) {
      addToast(err.message, 'error');
    }
  };

  // Prepare chart objects
  const chartData = {
    labels: salesHistory.map((item) => item.date),
    datasets: [
      {
        label: 'Credits Revenue ($)',
        data: salesHistory.map((item) => item.sales),
        borderColor: '#06b6d4',
        backgroundColor: 'rgba(6, 182, 212, 0.1)',
        tension: 0.35,
        fill: true,
        pointBackgroundColor: '#6366f1',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: {
        grid: { color: 'rgba(255, 255, 255, 0.05)' },
        ticks: { color: '#94a3b8' },
      },
      x: {
        grid: { display: false },
        ticks: { color: '#94a3b8' },
      },
    },
  };

  if (loading) return <Loader fullScreen />;

  const tabs = [
    { id: 'metrics', name: 'Analytics', icon: BarChart },
    { id: 'products', name: 'Products Catalog', icon: Package },
    { id: 'categories', name: 'Categories', icon: ShoppingCart },
    { id: 'orders', name: 'Orders Logs', icon: ShoppingCart },
    { id: 'users', name: 'Client Nodes', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a13] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b pb-6 dark:border-slate-800">
          <div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white">Admin Operations Terminal</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Deploy inventory updates, audit billing logs, and verify server registers.</p>
          </div>
          
          <button
            onClick={fetchDashboardData}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-bold font-mono hover:text-cyan-400 hover:border-cyan-400/20"
          >
            <RefreshCw className="w-4 h-4 text-cyan-500 animate-spin" style={{ animationDuration: '4s' }} />
            Sync Server Data
          </button>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          
          {/* Side Tabs panel */}
          <aside className="lg:col-span-1 space-y-2">
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
          <main className="lg:col-span-4 space-y-8">
            
            {/* TABS 1: METRICS & GRAPHS */}
            {activeTab === 'metrics' && metrics && (
              <div className="space-y-8 animate-fadeIn">
                {/* Metric Cards Row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  
                  <div className="glass-panel border rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center border border-cyan-500/20 text-cyan-500">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Gross Revenue</p>
                      <p className="text-lg font-black dark:text-white">${metrics.totalSales?.toLocaleString(undefined, { maximumFractionDigits: 0 })}</p>
                    </div>
                  </div>

                  <div className="glass-panel border rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center border border-indigo-500/20 text-indigo-500">
                      <ShoppingCart className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Total Orders</p>
                      <p className="text-lg font-black dark:text-white">{metrics.ordersCount}</p>
                    </div>
                  </div>

                  <div className="glass-panel border rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center border border-purple-500/20 text-purple-500">
                      <Package className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Products Grid</p>
                      <p className="text-lg font-black dark:text-white">{metrics.productsCount}</p>
                    </div>
                  </div>

                  <div className="glass-panel border rounded-2xl p-5 flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center border border-amber-500/20 text-amber-500">
                      <AlertCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold text-slate-400 uppercase">Low Stock</p>
                      <p className="text-lg font-black dark:text-white">{metrics.lowStockCount}</p>
                    </div>
                  </div>

                </div>

                {/* Sales Graph */}
                <div className="glass-panel border rounded-3xl p-6">
                  <h3 className="font-bold text-sm uppercase tracking-wider text-slate-400 mb-6 flex items-center gap-2">
                    <BarChart className="w-4 h-4 text-cyan-500" />
                    7-Day Gross Sales History
                  </h3>
                  <div className="h-64 flex items-center justify-center">
                    <Line data={chartData} options={chartOptions} />
                  </div>
                </div>
              </div>
            )}

            {/* TABS 2: PRODUCTS CRUD */}
            {activeTab === 'products' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                  <h3 className="text-lg font-bold dark:text-white">Active Product Registry</h3>
                  
                  <button
                    onClick={() => {
                      setEditingProduct(null);
                      setProdName('');
                      setProdBrand('');
                      setProdPrice('');
                      setProdStock('');
                      setProdDesc('');
                      setProdCategory(categoriesList[0]?._id || '');
                      setProdImage('');
                      setProdFeatured(false);
                      setShowProdModal(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    Deploy Augment
                  </button>
                </div>

                {/* Modal overlay */}
                {showProdModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
                    <form onSubmit={handleProdSubmit} className="glass-panel-heavy border rounded-3xl p-6 w-full max-w-lg space-y-4 max-h-[90vh] overflow-y-auto">
                      <h3 className="font-black text-lg border-b pb-2">
                        {editingProduct ? 'Synchronize Product details' : 'Deploy new hardware module'}
                      </h3>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">Name *</label>
                          <input
                            type="text"
                            required
                            value={prodName}
                            onChange={(e) => setProdName(e.target.value)}
                            placeholder="Cortex V5"
                            className="w-full px-3 py-2 rounded-xl border text-xs glass-input"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">Brand *</label>
                          <input
                            type="text"
                            required
                            value={prodBrand}
                            onChange={(e) => setProdBrand(e.target.value)}
                            placeholder="CortexCorp"
                            className="w-full px-3 py-2 rounded-xl border text-xs glass-input"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">Price ($) *</label>
                          <input
                            type="number"
                            required
                            step="0.01"
                            value={prodPrice}
                            onChange={(e) => setProdPrice(e.target.value)}
                            placeholder="999.99"
                            className="w-full px-3 py-2 rounded-xl border text-xs glass-input"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">Stock Count *</label>
                          <input
                            type="number"
                            required
                            value={prodStock}
                            onChange={(e) => setProdStock(e.target.value)}
                            placeholder="10"
                            className="w-full px-3 py-2 rounded-xl border text-xs glass-input"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">Category *</label>
                          <select
                            value={prodCategory}
                            onChange={(e) => setProdCategory(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border text-xs glass-input"
                          >
                            <option value="">Select Category</option>
                            {categoriesList.map((cat) => (
                              <option key={cat._id} value={cat._id}>{cat.name}</option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] text-slate-400 font-bold uppercase">Image URL</label>
                          <input
                            type="text"
                            value={prodImage}
                            onChange={(e) => setProdImage(e.target.value)}
                            placeholder="https://..."
                            className="w-full px-3 py-2 rounded-xl border text-xs glass-input"
                          />
                        </div>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Description *</label>
                        <textarea
                          required
                          rows={3}
                          value={prodDesc}
                          onChange={(e) => setProdDesc(e.target.value)}
                          placeholder="Hardware capabilities..."
                          className="w-full px-3 py-2 rounded-xl border text-xs glass-input resize-none"
                        />
                      </div>

                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="featuredCheck"
                          checked={prodFeatured}
                          onChange={(e) => setProdFeatured(e.target.checked)}
                          className="rounded border-slate-300 dark:border-slate-800 focus:ring-cyan-500"
                        />
                        <label htmlFor="featuredCheck" className="text-xs font-semibold text-slate-400">Featured (Highlights on landing page)</label>
                      </div>

                      <div className="flex gap-3 border-t pt-4">
                        <button
                          type="button"
                          onClick={() => setShowProdModal(false)}
                          className="px-5 py-2 rounded-xl border text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-xs font-bold"
                        >
                          {actionLoading ? 'Deploying...' : 'Deploy'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* Table details */}
                <div className="glass-panel border rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold">
                          <th className="p-4">Name</th>
                          <th className="p-4">Brand</th>
                          <th className="p-4">Category</th>
                          <th className="p-4">Price</th>
                          <th className="p-4">Stock</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-semibold">
                        {productsList.map((prod) => (
                          <tr key={prod._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="p-4 font-bold text-slate-800 dark:text-slate-200 max-w-[150px] truncate">{prod.name}</td>
                            <td className="p-4 text-slate-400">{prod.brand}</td>
                            <td className="p-4 text-slate-400">{prod.category?.name || 'General'}</td>
                            <td className="p-4 text-cyan-500 font-bold">${prod.price?.toLocaleString()}</td>
                            <td className={`p-4 ${prod.countInStock <= 5 ? 'text-amber-500 font-bold' : 'text-slate-400'}`}>{prod.countInStock}</td>
                            <td className="p-4 flex justify-center gap-2">
                              <button
                                onClick={() => handleEditProd(prod)}
                                className="p-2 border rounded-lg hover:border-cyan-500/20 text-slate-400 hover:text-cyan-500 transition-colors"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDeleteProd(prod._id)}
                                className="p-2 border rounded-lg hover:border-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TABS 3: CATEGORIES CRUD */}
            {activeTab === 'categories' && (
              <div className="space-y-6 animate-fadeIn">
                <div className="flex items-center justify-between border-b pb-4 dark:border-slate-800">
                  <h3 className="text-lg font-bold dark:text-white">Active Product Categories</h3>
                  
                  <button
                    onClick={() => {
                      setEditingCategory(null);
                      setCatName('');
                      setCatDesc('');
                      setShowCatModal(true);
                    }}
                    className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-xs font-bold"
                  >
                    <Plus className="w-4 h-4" />
                    New Category
                  </button>
                </div>

                {showCatModal && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/50 backdrop-blur-xs">
                    <form onSubmit={handleCatSubmit} className="glass-panel-heavy border rounded-3xl p-6 w-full max-w-sm space-y-4">
                      <h3 className="font-black text-lg border-b pb-2">
                        {editingCategory ? 'Update Category' : 'Create Category'}
                      </h3>
                      
                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Name *</label>
                        <input
                          type="text"
                          required
                          value={catName}
                          onChange={(e) => setCatName(e.target.value)}
                          placeholder="Category Name"
                          className="w-full px-3 py-2 rounded-xl border text-xs glass-input"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] text-slate-400 font-bold uppercase">Description</label>
                        <textarea
                          rows={3}
                          value={catDesc}
                          onChange={(e) => setCatDesc(e.target.value)}
                          placeholder="Description..."
                          className="w-full px-3 py-2 rounded-xl border text-xs glass-input resize-none"
                        />
                      </div>

                      <div className="flex gap-3 border-t pt-4">
                        <button
                          type="button"
                          onClick={() => setShowCatModal(false)}
                          className="px-5 py-2 rounded-xl border text-xs font-bold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-xs font-bold"
                        >
                          {actionLoading ? 'Saving...' : 'Save'}
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categoriesList.map((cat) => (
                    <div
                      key={cat._id}
                      className="border border-slate-100 bg-slate-50/50 dark:border-slate-800/40 dark:bg-slate-900/10 p-5 rounded-2xl flex items-center justify-between"
                    >
                      <div>
                        <h4 className="font-bold text-slate-950 dark:text-white text-sm">{cat.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{cat.description || 'No description logged.'}</p>
                      </div>
                      <div className="flex gap-2 flex-shrink-0 ml-4">
                        <button
                          onClick={() => handleEditCat(cat)}
                          className="p-2 border rounded-lg hover:border-cyan-500/20 text-slate-400 hover:text-cyan-500 transition-colors"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteCat(cat._id)}
                          className="p-2 border rounded-lg hover:border-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TABS 4: ORDERS CONTROL */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold dark:text-white border-b pb-4 dark:border-slate-800">
                  Global Shipping & Order manifests
                </h3>

                <div className="glass-panel border rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold">
                          <th className="p-4">ID</th>
                          <th className="p-4">Customer</th>
                          <th className="p-4">Date</th>
                          <th className="p-4">Cost</th>
                          <th className="p-4">Payment</th>
                          <th className="p-4">Shipping Status</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-semibold">
                        {recentOrders.map((ord) => (
                          <tr key={ord._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="p-4 font-mono font-bold dark:text-white">{ord._id?.substring(0, 8)}...</td>
                            <td className="p-4 dark:text-slate-300">{ord.user?.name || 'Operative'}</td>
                            <td className="p-4 text-slate-400">{new Date(ord.createdAt).toLocaleString().split(',')[0]}</td>
                            <td className="p-4 font-bold text-slate-900 dark:text-white">${ord.totalPrice?.toLocaleString()}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                                ord.isPaid 
                                  ? 'border-emerald-500/20 bg-emerald-500/5 text-emerald-400' 
                                  : 'border-rose-500/20 bg-rose-500/5 text-rose-400'
                              }`}>
                                {ord.isPaid ? 'Paid' : 'Unpaid'}
                              </span>
                            </td>
                            <td className="p-4">
                              <span className="px-2 py-0.5 rounded-full border border-cyan-500/20 bg-cyan-500/5 text-cyan-400 text-[9px] font-bold uppercase tracking-wider">
                                {ord.status}
                              </span>
                            </td>
                            <td className="p-4 flex justify-center gap-1.5">
                              {!ord.isPaid && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord._id, 'Paid', true, ord.isDelivered)}
                                  className="px-2 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 hover:bg-emerald-500/20 text-emerald-400 text-[9px]"
                                  title="Approve payment verification"
                                >
                                  Pay
                                </button>
                              )}
                              {ord.status !== 'Delivered' && (
                                <button
                                  onClick={() => handleUpdateOrderStatus(ord._id, 'Delivered', ord.isPaid, true)}
                                  className="px-2 py-1 rounded bg-indigo-500/10 border border-indigo-500/20 hover:bg-indigo-500/20 text-indigo-400 text-[9px]"
                                  title="Mark order as delivered"
                                >
                                  Deliver
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* TABS 5: CLIENT NODES (USERS LIST) */}
            {activeTab === 'users' && (
              <div className="space-y-6 animate-fadeIn">
                <h3 className="text-lg font-bold dark:text-white border-b pb-4 dark:border-slate-800">
                  Client Nodes Registry
                </h3>

                <div className="glass-panel border rounded-2xl overflow-hidden shadow-sm">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40 text-slate-400 font-bold">
                          <th className="p-4">Identity</th>
                          <th className="p-4">Comm Link</th>
                          <th className="p-4">Security Role</th>
                          <th className="p-4 text-center">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/40 font-semibold">
                        {usersList.map((user) => (
                          <tr key={user._id} className="hover:bg-slate-50/50 dark:hover:bg-slate-900/10">
                            <td className="p-4 font-bold text-slate-800 dark:text-slate-200">{user.name}</td>
                            <td className="p-4 text-slate-400">{user.email}</td>
                            <td className="p-4">
                              <span className={`px-2 py-0.5 rounded-full border text-[9px] font-bold uppercase tracking-wider ${
                                user.isAdmin 
                                  ? 'border-indigo-500/20 bg-indigo-500/5 text-indigo-400' 
                                  : 'border-slate-300 dark:border-slate-800 text-slate-400'
                              }`}>
                                {user.isAdmin ? 'Admin' : 'Customer'}
                              </span>
                            </td>
                            <td className="p-4 flex justify-center">
                              {!user.isAdmin && (
                                <button
                                  onClick={() => handleDeleteUser(user._id)}
                                  className="p-2 border rounded-lg hover:border-rose-500/20 text-slate-400 hover:text-rose-500 transition-colors"
                                  title="Terminate client profile connection"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

          </main>

        </div>

      </div>
    </div>
  );
};

export default AdminDashboardPage;
