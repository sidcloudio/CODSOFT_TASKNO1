import React, { createContext, useState, useEffect, useContext } from 'react';
import { useCart } from './CartContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState(() => {
    const saved = localStorage.getItem('neocartx-wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('neocartx-wishlist', JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    const exists = wishlistItems.some(item => item._id === product._id);
    if (exists) {
      setWishlistItems(prev => prev.filter(item => item._id !== product._id));
    } else {
      setWishlistItems(prev => [...prev, product]);
    }
  };

  const isInWishlist = (productId) => {
    return wishlistItems.some(item => item._id === productId);
  };

  const moveToCart = (product) => {
    addToCart(product, 1);
    setWishlistItems(prev => prev.filter(item => item._id !== product._id));
  };

  const removeFromWishlist = (productId) => {
    setWishlistItems(prev => prev.filter(item => item._id !== productId));
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlistItems,
        toggleWishlist,
        isInWishlist,
        moveToCart,
        removeFromWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);
