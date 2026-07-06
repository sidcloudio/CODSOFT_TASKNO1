import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Rating from '../components/Rating';
import { ProductDetailsSkeleton } from '../components/Skeletons';
import { ShoppingCart, Heart, ArrowLeft, Send, CheckCircle2 } from 'lucide-react';

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { isAuthenticated, getAuthHeaders } = useAuth();
  const { addToast } = useToast();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Image gallery selection
  const [selectedImage, setSelectedImage] = useState('');
  
  // Quantity selection
  const [quantity, setQuantity] = useState(1);
  
  // Review inputs
  const [ratingInput, setRatingInput] = useState(5);
  const [commentInput, setCommentInput] = useState('');
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/products/${id}`);
        if (res.ok) {
          const data = await res.json();
          setProduct(data.product);
          setReviews(data.reviews || []);
          setSelectedImage(data.product.images[0]);
        } else {
          addToast('Product not found in database', 'error');
          navigate('/shop');
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
  }, [id, navigate]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product, quantity);
    addToast(`${product.name} (${quantity}) added to cart`, 'success');
  };

  const handleWishlistToggle = () => {
    if (!product) return;
    toggleWishlist(product);
    addToast(
      isInWishlist(product._id)
        ? `${product.name} removed from wishlist`
        : `${product.name} added to wishlist`,
      'info'
    );
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!ratingInput || !commentInput) return;
    
    setSubmitLoading(true);
    try {
      const response = await fetch(`/api/products/${id}/reviews`, {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({ rating: ratingInput, comment: commentInput }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Failed to submit review');
      }
      
      addToast('Review submitted successfully!', 'success');
      setCommentInput('');
      
      // Reload details to sync newly created review
      const reloadRes = await fetch(`/api/products/${id}`);
      if (reloadRes.ok) {
        const reloadData = await reloadRes.json();
        setProduct(reloadData.product);
        setReviews(reloadData.reviews);
      }
    } catch (err) {
      addToast(err.message, 'error');
    } finally {
      setSubmitLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-12">
        <ProductDetailsSkeleton />
      </div>
    );
  }

  if (!product) return null;

  const isWishlisted = isInWishlist(product._id);
  const outOfStock = product.countInStock === 0;

  return (
    <div className="min-h-screen bg-white dark:bg-[#070a13] py-10 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Back Link */}
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-cyan-500 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop Grid
        </Link>

        {/* Details Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          
          {/* Gallery Block */}
          <div className="space-y-4">
            <div className="w-full aspect-square rounded-3xl border border-slate-200/50 bg-slate-50 dark:border-slate-800/40 dark:bg-slate-950 overflow-hidden shadow-lg relative">
              <img
                src={selectedImage}
                alt={product.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.target.src = 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=600&auto=format&fit=crop';
                }}
              />
            </div>
            
            {/* Gallery Thumbnails */}
            {product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-20 h-20 rounded-2xl border-2 overflow-hidden bg-slate-50 dark:bg-slate-950 transition-all ${
                      selectedImage === img
                        ? 'border-cyan-500 shadow-glow-cyan scale-102'
                        : 'border-slate-200 dark:border-slate-800'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Configuration / Checkout Options Block */}
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-cyan-500 uppercase tracking-widest">{product.brand}</span>
                <span className="text-slate-400">•</span>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">{product.category?.name}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-black tracking-tight dark:text-white">{product.name}</h1>
              
              <div className="flex items-center gap-4 pt-1">
                <Rating value={product.rating} text={`from ${product.numReviews} client logs`} />
                <span className={`text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-lg border ${
                  outOfStock 
                    ? 'border-rose-500/20 bg-rose-500/5 text-rose-500' 
                    : 'border-emerald-500/20 bg-emerald-500/5 text-emerald-500'
                }`}>
                  {outOfStock ? 'Depleted' : 'Operational'}
                </span>
              </div>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              {product.description}
            </p>

            <div className="text-3xl font-black pt-4 border-t border-slate-200/50 dark:border-slate-800/50">
              ${product.price?.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>

            {/* Config details */}
            {!outOfStock && (
              <div className="flex items-center gap-4 pt-2">
                <span className="text-xs font-semibold text-slate-400">Qty Limit:</span>
                <div className="flex items-center border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden glass-panel">
                  <button
                    onClick={() => setQuantity(prev => Math.max(1, prev - 1))}
                    className="px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold transition-colors"
                  >
                    -
                  </button>
                  <span className="px-4 text-sm font-bold w-10 text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(prev => Math.min(product.countInStock, prev + 1))}
                    className="px-3.5 py-1.5 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold transition-colors"
                  >
                    +
                  </button>
                </div>
                <span className="text-xs font-semibold text-slate-400">({product.countInStock} files available)</span>
              </div>
            )}

            {/* Shopping CTAs */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button
                onClick={handleAddToCart}
                disabled={outOfStock}
                className={`flex-grow py-3.5 rounded-2xl flex items-center justify-center gap-2 font-bold text-sm transition-all ${
                  outOfStock
                    ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed'
                    : 'bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white hover:scale-[1.01] active:scale-[0.99]'
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                {outOfStock ? 'Depleted' : 'Initiate Augmentation'}
              </button>

              <button
                onClick={handleWishlistToggle}
                className={`px-6 py-3.5 rounded-2xl border font-bold text-sm flex items-center justify-center gap-2 transition-all ${
                  isWishlisted
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-500'
                    : 'border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900'
                }`}
              >
                <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                {isWishlisted ? 'Augment Wishlisted' : 'Save To Hub'}
              </button>
            </div>

          </div>
        </div>

        {/* Reviews Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 pt-10 border-t border-slate-200/50 dark:border-slate-800/50">
          
          {/* Review Stats / Form */}
          <div className="space-y-6">
            <h3 className="text-xl font-black dark:text-white">Client Logs & Reviews</h3>
            
            {isAuthenticated ? (
              <form onSubmit={handleReviewSubmit} className="glass-panel border rounded-2xl p-5 space-y-4">
                <h4 className="text-sm font-bold uppercase tracking-wider text-slate-800 dark:text-slate-200">Log New Experience</h4>
                
                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold">Security Rating</label>
                  <select
                    value={ratingInput}
                    onChange={(e) => setRatingInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-sm glass-input"
                  >
                    <option value="5">5 Stars (Optimal)</option>
                    <option value="4">4 Stars (Highly Capable)</option>
                    <option value="3">3 Stars (Standard)</option>
                    <option value="2">2 Stars (Warning Levels)</option>
                    <option value="1">1 Star (Malfunction)</option>
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-slate-400 font-semibold">Diagnostics Log</label>
                  <textarea
                    required
                    placeholder="Enter diagnostic details..."
                    value={commentInput}
                    onChange={(e) => setCommentInput(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 rounded-xl border text-sm glass-input resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitLoading}
                  className="w-full py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 hover:shadow-glow-cyan text-white text-xs font-bold flex items-center justify-center gap-1.5"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitLoading ? 'Transmitting...' : 'Transmit Log'}
                </button>
              </form>
            ) : (
              <div className="glass-panel border rounded-2xl p-5 text-center space-y-3">
                <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                  Authentication required to submit diagnostics telemetry logs.
                </p>
                <Link
                  to="/login"
                  className="inline-block px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-indigo-500 text-white text-xs font-bold"
                >
                  Authorize Profile
                </Link>
              </div>
            )}
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-2 space-y-4">
            {reviews.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-2xl">
                <p className="text-sm text-slate-400 font-bold">No telemetry logs logged yet.</p>
                <p className="text-xs text-slate-400 mt-1">Be the first to submit a diagnostic review.</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[600px] overflow-y-auto pr-2">
                {reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="p-5 rounded-2xl border border-slate-100 bg-slate-50/50 dark:border-slate-800/40 dark:bg-slate-900/10 space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="font-bold text-sm text-slate-950 dark:text-white">{rev.name || rev.user?.name}</h4>
                      <span className="text-[10px] text-slate-400 font-semibold">
                        {new Date(rev.createdAt).toISOString().split('T')[0]}
                      </span>
                    </div>
                    <Rating value={rev.rating} />
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed pt-1">
                      {rev.comment}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};

export default ProductDetailsPage;
