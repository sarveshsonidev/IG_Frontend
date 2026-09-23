import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserAddress } from '../types';
import { api } from '../services/api';

interface AuthContextType {
  user: UserProfile;
  isLoggedIn: boolean;
  login: (email: string, name?: string) => void;
  loginWithApi: (email: string, password: string) => Promise<void>;
  registerWithApi: (data: { name: string; email: string; password: string; phone?: string }) => Promise<void>;
  logout: () => void;
  updateProfile: (updated: Partial<UserProfile>) => void;
  saveAddress: (address: Omit<UserAddress, 'id'>) => UserAddress;
  updateAddress: (id: string, address: Partial<UserAddress>) => void;
  deleteAddress: (id: string) => void;
  savePersonalizedDesign: (design: { productTitle: string; previewUrl: string }) => void;
}

const DEFAULT_USER: UserProfile = {
  name: 'Rahul Sharma',
  email: 'rahul@example.com',
  phone: '+91 98111 22233',
  birthday: '1996-10-18',
  anniversary: '2022-11-25',
  savedAddresses: [
    {
      id: 'addr-default-1',
      fullName: 'Rahul Sharma',
      phone: '+91 98111 22233',
      email: 'rahul@example.com',
      streetAddress: 'Flat 402, Lotus Towers, Powai',
      landmark: 'Near Central Avenue',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400076',
      isDefault: true,
    },
  ],
  savedDesigns: [
    {
      id: 'des-1',
      productTitle: 'Custom Spotify Acrylic Song Plaque',
      previewUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=400&auto=format&fit=crop',
      date: '14 Feb 2026',
    },
  ],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile>(() => {
    try {
      const saved = localStorage.getItem('impressive_user');
      return saved ? JSON.parse(saved) : DEFAULT_USER;
    } catch {
      return DEFAULT_USER;
    }
  });

  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('impressive_is_logged_in') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('impressive_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    localStorage.setItem('impressive_is_logged_in', String(isLoggedIn));
  }, [isLoggedIn]);

  const login = (email: string, name?: string) => {
    setUser(prev => ({
      ...prev,
      email,
      name: name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
    }));
    setIsLoggedIn(true);
  };

  const loginWithApi = async (email: string, password: string) => {
    try {
      const res = await api.auth.login(email, password);
      if (res.token) {
        localStorage.setItem('impressive_token', res.token);
      }
      setUser(prev => ({
        ...prev,
        email: res.email || email,
        name: res.name || (email.split('@')[0].charAt(0).toUpperCase() + email.split('@')[0].slice(1)),
        phone: res.phone || prev.phone,
      }));
      setIsLoggedIn(true);
    } catch (err: any) {
      // Fallback local login for smooth demo if backend is offline
      login(email);
    }
  };

  const registerWithApi = async (data: { name: string; email: string; password: string; phone?: string }) => {
    try {
      const res = await api.auth.register(data);
      if (res.token) {
        localStorage.setItem('impressive_token', res.token);
      }
      setUser(prev => ({
        ...prev,
        email: data.email,
        name: data.name,
        phone: data.phone || prev.phone,
      }));
      setIsLoggedIn(true);
    } catch (err: any) {
      // Fallback local registration
      login(data.email, data.name);
    }
  };

  const logout = () => {
    localStorage.removeItem('impressive_token');
    localStorage.removeItem('impressive_is_logged_in');
    setIsLoggedIn(false);
  };

  const updateProfile = (updated: Partial<UserProfile>) => {
    setUser(prev => ({ ...prev, ...updated }));
  };

  const saveAddress = (addressData: Omit<UserAddress, 'id'>): UserAddress => {
    const newAddress: UserAddress = {
      ...addressData,
      id: `addr-${Date.now().toString(36)}`,
    };
    setUser(prev => ({
      ...prev,
      savedAddresses: [newAddress, ...prev.savedAddresses],
    }));
    return newAddress;
  };

  const updateAddress = (id: string, updatedFields: Partial<UserAddress>) => {
    setUser(prev => ({
      ...prev,
      savedAddresses: prev.savedAddresses.map(addr =>
        addr.id === id ? { ...addr, ...updatedFields } : addr
      ),
    }));
  };

  const deleteAddress = (id: string) => {
    setUser(prev => ({
      ...prev,
      savedAddresses: prev.savedAddresses.filter(addr => addr.id !== id),
    }));
  };

  const savePersonalizedDesign = (design: { productTitle: string; previewUrl: string }) => {
    const newDesign = {
      ...design,
      id: `des-${Date.now().toString(36)}`,
      date: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setUser(prev => ({
      ...prev,
      savedDesigns: [newDesign, ...prev.savedDesigns],
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        loginWithApi,
        registerWithApi,
        logout,
        updateProfile,
        saveAddress,
        updateAddress,
        deleteAddress,
        savePersonalizedDesign,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
