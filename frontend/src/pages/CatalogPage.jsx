import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, SlidersHorizontal, ArrowUpDown, RefreshCw, Cpu, Layers } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import { CatalogSkeleton } from '../components/Skeletons';

const CatalogPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  
  // States
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Filtering inputs synced with URL SearchParams
  const keyword = searchParams.get('keyword') || '';
  const category = searchParams.get('category') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const sort = searchParams.get('sort') || 'newest';

  const [searchInput, setSearchInput] = useState(keyword);
  const [minPriceInput, setMinPriceInput] = useState(minPrice);
  const [maxPriceInput, setMaxPriceInput] = useState(maxPrice);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Sync state if URL changes
  useEffect(() => {
    setSearchInput(keyword);
    setMinPriceInput(minPrice);
    setMaxPriceInput(maxPrice);
  }, [keyword, category, minPrice, maxPrice]);

  // Fetch Categories
  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await fetch('/api/categories');
        if (res.ok) {
          const data = await res.json();
          setCategories(data);
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  // Fetch Products based on parameters
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const query = new URLSearchParams();
        if (keyword) query.set('keyword', keyword);
        if (category) query.set('category', category);
        if (minPrice) query.set('minPrice', minPrice);
        if (maxPrice) query.set('maxPrice', maxPrice);
        if (sort) query.set('sort', sort);

        const res = await fetch(`/api/products?${query.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setProducts(data);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [keyword, category, minPrice, maxPrice, sort]);

  // Update query params helper
  const updateQueryParam = (name, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) {
      newParams.set(name, value);
    } else {
      newParams.delete(name);
    }
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    updateQueryParam('keyword', searchInput);
  };

  const handlePriceApply = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (minPriceInput) newParams.set('minPrice', minPriceInput);
    else newParams.delete('minPrice');
    if (maxPriceInput) newParams.set('maxPrice', maxPriceInput);
    else newParams.delete('maxPrice');
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setSearchInput('');
    setMinPriceInput('');
    setMaxPriceInput('');
    setSearchParams({});
  };

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a13] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
          <div>
            <h1 className="text-3xl font-black tracking-tight dark:text-white">Hardware Grid</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Search and filter active cybernetic modules.</p>
          </div>
          
          {/* Action Row */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setShowMobileFilters(!showMobileFilters)}
              className="md:hidden flex items-center gap-2 px-4 py-2.5 rounded-xl border text-sm font-bold glass-panel"
            >
              <SlidersHorizontal className="w-4 h-4 text-cyan-500" />
              Filters
            </button>

            <form onSubmit={handleSearchSubmit} className="relative flex-grow sm:flex-grow-0">
              <input
                type="text"
                placeholder="Search specs..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="w-full sm:w-64 pl-10 pr-4 py-2 rounded-xl border text-sm glass-input"
              />
              <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
            </form>

            {/* Sorting */}
            <div className="flex items-center gap-2">
              <ArrowUpDown className="w-4 h-4 text-slate-400" />
              <select
                value={sort}
                onChange={(e) => updateQueryParam('sort', e.target.value)}
                className="px-3 py-2 rounded-xl border text-sm glass-input"
              >
                <option value="newest">Newest Cargo</option>
                <option value="popularity">Popularity</option>
                <option value="priceAsc">Price: Low to High</option>
                <option value="priceDesc">Price: High to Low</option>
              </select>
            </div>

            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-xl border hover:bg-slate-100 dark:hover:bg-slate-800/50 text-slate-500 hover:text-cyan-500 transition-colors"
            >
              <RefreshCw className="w-4.5 h-4.5" />
            </button>
          </div>
        </div>

        {/* Workspace Layout */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Filters Sidebar (Desktop) */}
          <aside className="hidden md:block space-y-6">
            
            {/* Category Filter */}
            <div className="glass-panel rounded-2xl p-5 border space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Categories</h3>
              <div className="space-y-1.5">
                <button
                  onClick={() => updateQueryParam('category', '')}
                  className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                    !category
                      ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                  }`}
                >
                  All Tech Modules
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    onClick={() => updateQueryParam('category', cat.slug)}
                    className={`w-full text-left px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      category === cat.slug
                        ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 font-bold'
                        : 'text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="glass-panel rounded-2xl p-5 border space-y-4">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Price Range</h3>
              <form onSubmit={handlePriceApply} className="space-y-3">
                <div className="flex gap-2">
                  <input
                    type="number"
                    placeholder="Min"
                    value={minPriceInput}
                    onChange={(e) => setMinPriceInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border text-xs glass-input"
                  />
                  <input
                    type="number"
                    placeholder="Max"
                    value={maxPriceInput}
                    onChange={(e) => setMaxPriceInput(e.target.value)}
                    className="w-full px-3 py-1.5 rounded-xl border text-xs glass-input"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white text-xs font-bold transition-all"
                >
                  Apply
                </button>
              </form>
            </div>

          </aside>

          {/* Mobile Filters Drawer Overlay */}
          {showMobileFilters && (
            <div className="md:hidden fixed inset-0 z-50 flex justify-end">
              <div className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs" onClick={() => setShowMobileFilters(false)} />
              <div className="relative w-80 max-w-full h-full bg-white dark:bg-[#090e1a] shadow-2xl p-6 overflow-y-auto space-y-6">
                <div className="flex items-center justify-between border-b pb-4 mb-4">
                  <h3 className="font-bold text-lg">Filters</h3>
                  <button onClick={() => setShowMobileFilters(false)} className="text-slate-400">Close</button>
                </div>
                
                {/* Category List */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Categories</h4>
                  <div className="space-y-1.5">
                    <button
                      onClick={() => { updateQueryParam('category', ''); setShowMobileFilters(false); }}
                      className={`w-full text-left px-3 py-1.5 rounded-lg text-sm ${!category ? 'bg-cyan-500/10 text-cyan-400 font-bold' : ''}`}
                    >
                      All
                    </button>
                    {categories.map((cat) => (
                      <button
                        key={cat._id}
                        onClick={() => { updateQueryParam('category', cat.slug); setShowMobileFilters(false); }}
                        className={`w-full text-left px-3 py-1.5 rounded-lg text-sm ${category === cat.slug ? 'bg-cyan-500/10 text-cyan-400 font-bold' : ''}`}
                      >
                        {cat.name}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Price list */}
                <div className="space-y-3">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">Price</h4>
                  <form onSubmit={(e) => { handlePriceApply(e); setShowMobileFilters(false); }} className="space-y-3">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        placeholder="Min"
                        value={minPriceInput}
                        onChange={(e) => setMinPriceInput(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border text-xs glass-input"
                      />
                      <input
                        type="number"
                        placeholder="Max"
                        value={maxPriceInput}
                        onChange={(e) => setMaxPriceInput(e.target.value)}
                        className="w-full px-3 py-1.5 rounded-xl border text-xs glass-input"
                      />
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-xs font-bold"
                    >
                      Apply
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid Panel */}
          <div className="md:col-span-3">
            {loading ? (
              <CatalogSkeleton />
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center space-y-4 border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <Cpu className="w-12 h-12 text-slate-300 dark:text-slate-800 animate-bounce" />
                <h3 className="font-bold text-lg text-slate-800 dark:text-slate-200">No Augments Found</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
                  Your search parameters yielded zero records in the main frame. Try clearing filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-5 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-xs font-bold hover:text-cyan-500 transition-colors"
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default CatalogPage;
