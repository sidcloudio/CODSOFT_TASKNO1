import React, { createContext, useState, useEffect, useContext } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { userInfo, getAuthHeaders, isAuthenticated } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  // 1. Fetch Cart from DB on login / load
  useEffect(() => {
    const fetchCart = async () => {
      if (!isAuthenticated) {
        // Retrieve local guest cart
        const localCart = localStorage.getItem('neocartx-cart');
        setCartItems(localCart ? JSON.parse(localCart) : []);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch('/api/cart', {
          headers: getAuthHeaders(),
        });
        if (response.ok) {
          const data = await response.json();
          // Filter items to ensure product exists
          const validItems = data.items.filter(item => item.product);
          setCartItems(validItems);
        }
      } catch (error) {
        console.error('Error fetching cart:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, [isAuthenticated, userInfo]);

  // 2. Sync Cart to DB or localStorage when items change
  const syncCartToDB = async (items) => {
    if (!isAuthenticated) {
      localStorage.setItem('neocartx-cart', JSON.stringify(items));
      return;
    }

    try {
      const response = await fetch('/api/cart', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify({
          items: items.map(item => ({
            product: item.product._id,
            quantity: item.quantity,
          })),
        }),
      });
      if (response.ok) {
        const data = await response.json();
        // Keep state aligned
        const validItems = data.items.filter(item => item.product);
        setCartItems(validItems);
      }
    } catch (error) {
      console.error('Error syncing cart:', error);
    }
  };

  const addToCart = (product, qty = 1) => {
    const quantity = Number(qty);
    const existingIndex = cartItems.findIndex(item => item.product._id === product._id);
    let newItems = [...cartItems];

    if (existingIndex > -1) {
      const newQty = newItems[existingIndex].quantity + quantity;
      newItems[existingIndex].quantity = Math.min(newQty, product.countInStock);
    } else {
      newItems.push({ product, quantity });
    }

    setCartItems(newItems);
    syncCartToDB(newItems);
  };

  const removeFromCart = (productId) => {
    const newItems = cartItems.filter(item => item.product._id !== productId);
    setCartItems(newItems);
    syncCartToDB(newItems);
  };

  const updateQuantity = (productId, qty) => {
    const quantity = Number(qty);
    const newItems = cartItems.map(item => {
      if (item.product._id === productId) {
        return { ...item, quantity: Math.min(quantity, item.product.countInStock) };
      }
      return item;
    });

    setCartItems(newItems);
    syncCartToDB(newItems);
  };

  const clearCart = () => {
    setCartItems([]);
    if (isAuthenticated) {
      syncCartToDB([]);
    } else {
      localStorage.removeItem('neocartx-cart');
    }
  };

  // Pricing calculations
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.product.price * item.quantity, 0);
  const shippingPrice = itemsPrice > 1000 ? 0 : itemsPrice > 0 ? 15.0 : 0.0;
  const taxPrice = itemsPrice * 0.08; // 8% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
