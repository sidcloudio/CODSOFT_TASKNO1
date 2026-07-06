import React, { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userInfo, setUserInfo] = useState(() => {
    const saved = localStorage.getItem('neocartx-user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync token header utility
  const getAuthHeaders = () => {
    return {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${userInfo?.token}`,
    };
  };

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }
      setUserInfo(data);
      localStorage.setItem('neocartx-user', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const register = async (name, email, password) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }
      setUserInfo(data);
      localStorage.setItem('neocartx-user', JSON.stringify(data));
      setLoading(false);
      return data;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  const logout = () => {
    setUserInfo(null);
    localStorage.removeItem('neocartx-user');
  };

  const updateProfile = async (profileData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(profileData),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.message || 'Profile update failed');
      }
      const updatedUser = { ...userInfo, ...data };
      setUserInfo(updatedUser);
      localStorage.setItem('neocartx-user', JSON.stringify(updatedUser));
      setLoading(false);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      setLoading(false);
      throw err;
    }
  };

  // Address Handlers
  const addAddress = async (address) => {
    try {
      const response = await fetch('/api/auth/addresses', {
        method: 'POST',
        headers: getAuthHeaders(),
        body: JSON.stringify(address),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      const updatedUser = { ...userInfo, addresses: data };
      setUserInfo(updatedUser);
      localStorage.setItem('neocartx-user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const updateAddress = async (id, address) => {
    try {
      const response = await fetch(`/api/auth/addresses/${id}`, {
        method: 'PUT',
        headers: getAuthHeaders(),
        body: JSON.stringify(address),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      const updatedUser = { ...userInfo, addresses: data };
      setUserInfo(updatedUser);
      localStorage.setItem('neocartx-user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  const deleteAddress = async (id) => {
    try {
      const response = await fetch(`/api/auth/addresses/${id}`, {
        method: 'DELETE',
        headers: getAuthHeaders(),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      const updatedUser = { ...userInfo, addresses: data };
      setUserInfo(updatedUser);
      localStorage.setItem('neocartx-user', JSON.stringify(updatedUser));
    } catch (err) {
      console.error(err);
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        userInfo,
        loading,
        error,
        login,
        register,
        logout,
        updateProfile,
        addAddress,
        updateAddress,
        deleteAddress,
        getAuthHeaders,
        isAuthenticated: !!userInfo,
        isAdmin: !!userInfo?.isAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
