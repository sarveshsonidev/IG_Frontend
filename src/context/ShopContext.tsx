import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, CartItem, PersonalizationData, Coupon, UserAddress, Order, OrderStatus } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { AVAILABLE_COUPONS } from '../data/coupons';
import { checkPincodeDelivery, PincodeInfo } from '../data/pincodes';

export interface ToastMessage {
  id: string;
  message: string;
  type: 'success' | 'info' | 'error';
}

interface ShopContextType {
  // Cart
  cart: CartItem[];
  addToCart: (
    product: Product,
    quantity?: number,
    personalization?: PersonalizationData,
    isGiftWrapped?: boolean,
    giftMessage?: string,
    isAnonymousGift?: boolean
  ) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  removeFromCart: (itemId: string) => void;
  clearCart: () => void;
  cartCount: number;
  subtotal: number;
  discount: number;
  shippingFee: number;
  giftWrapFee: number;
  tax: number;
  total: number;
  freeShippingThreshold: number;
  freeShippingRemaining: number;
  isCartDrawerOpen: boolean;
  setIsCartDrawerOpen: (open: boolean) => void;

  // Wishlist
  wishlist: string[]; // product IDs
  toggleWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;
  wishlistCount: number;

  // Coupons
  coupons: Coupon[];
  appliedCoupon: Coupon | null;
  applyCoupon: (code: string) => { success: boolean; message: string };
  removeCoupon: () => void;

  // Recently Viewed & Compare
  recentlyViewed: Product[];
  addRecentlyViewed: (product: Product) => void;
  compareList: Product[];
  toggleCompare: (product: Product) => void;
  clearCompare: () => void;
  isCompareModalOpen: boolean;
  setIsCompareModalOpen: (open: boolean) => void;

  // Modals
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  isGiftFinderOpen: boolean;
  setIsGiftFinderOpen: (open: boolean) => void;
  quickViewProduct: Product | null;
  setQuickViewProduct: (product: Product | null) => void;

  // Pincode & Delivery
  currentPincode: string;
  pincodeInfo: PincodeInfo | null;
  checkPincode: (pin: string) => { success: boolean; message?: string };

  // Toasts
  toasts: ToastMessage[];
  showToast: (message: string, type?: 'success' | 'info' | 'error') => void;
  removeToast: (id: string) => void;

  // Utilities
  formatPrice: (amount: number) => string;
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

const FREE_SHIPPING_MIN = 999;
const STANDARD_SHIPPING_COST = 99;
const GIFT_WRAP_COST = 49;

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Cart
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('impressive_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartDrawerOpen, setIsCartDrawerOpen] = useState(false);

  // Wishlist
  const [wishlist, setWishlist] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('impressive_wishlist');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Coupons
  const [appliedCoupon, setAppliedCoupon] = useState<Coupon | null>(() => {
    try {
      const saved = localStorage.getItem('impressive_coupon');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  // Recently Viewed
  const [recentlyViewed, setRecentlyViewed] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('impressive_recent');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Compare
  const [compareList, setCompareList] = useState<Product[]>([]);
  const [isCompareModalOpen, setIsCompareModalOpen] = useState(false);

  // Modals & Popups
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isGiftFinderOpen, setIsGiftFinderOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Pincode
  const [currentPincode, setCurrentPincode] = useState<string>(() => {
    return localStorage.getItem('impressive_pincode') || '400001';
  });
  const [pincodeInfo, setPincodeInfo] = useState<PincodeInfo | null>(() => {
    try {
      return checkPincodeDelivery('400001');
    } catch {
      return null;
    }
  });

  // Toasts
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'success') => {
    const id = Date.now().toString() + Math.random().toString().slice(2, 6);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      removeToast(id);
    }, 3500);
  };

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Sync state to LocalStorage
  useEffect(() => {
    localStorage.setItem('impressive_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('impressive_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem('impressive_coupon', JSON.stringify(appliedCoupon));
    } else {
      localStorage.removeItem('impressive_coupon');
    }
  }, [appliedCoupon]);

  useEffect(() => {
    localStorage.setItem('impressive_recent', JSON.stringify(recentlyViewed));
  }, [recentlyViewed]);

  const addToCart = (
    product: Product,
    quantity: number = 1,
    personalization?: PersonalizationData,
    isGiftWrapped: boolean = false,
    giftMessage?: string,
    isAnonymousGift: boolean = false
  ) => {
    const itemId = `${product.id}-${Date.now().toString(36)}`;
    const unitPrice = product.price;
    const newItem: CartItem = {
      id: itemId,
      product,
      quantity,
      personalization,
      isGiftWrapped,
      giftMessage,
      isAnonymousGift,
      unitPrice,
      totalPrice: unitPrice * quantity,
    };

    setCart(prev => [newItem, ...prev]);
    showToast(`Added "${product.name.slice(0, 30)}..." to your cart!`, 'success');
    setIsCartDrawerOpen(true);
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }
    setCart(prev =>
      prev.map(item =>
        item.id === itemId
          ? {
              ...item,
              quantity,
              totalPrice: item.unitPrice * quantity,
            }
          : item
      )
    );
  };

  const removeFromCart = (itemId: string) => {
    setCart(prev => prev.filter(item => item.id !== itemId));
    showToast('Item removed from cart', 'info');
  };

  const clearCart = () => {
    setCart([]);
  };

  const toggleWishlist = (productId: string) => {
    setWishlist(prev => {
      const exists = prev.includes(productId);
      if (exists) {
        showToast('Removed from Wishlist', 'info');
        return prev.filter(id => id !== productId);
      } else {
        showToast('Saved to Wishlist ❤️', 'success');
        return [...prev, productId];
      }
    });
  };

  const isInWishlist = (productId: string) => wishlist.includes(productId);

  const addRecentlyViewed = (product: Product) => {
    setRecentlyViewed(prev => {
      const filtered = prev.filter(p => p.id !== product.id);
      return [product, ...filtered].slice(0, 8);
    });
  };

  const toggleCompare = (product: Product) => {
    setCompareList(prev => {
      const exists = prev.some(p => p.id === product.id);
      if (exists) {
        showToast(`Removed from product comparison`, 'info');
        return prev.filter(p => p.id !== product.id);
      }
      if (prev.length >= 3) {
        showToast(`You can compare up to 3 products at a time`, 'error');
        return prev;
      }
      showToast(`Added to product comparison`, 'success');
      return [...prev, product];
    });
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  const applyCoupon = (code: string) => {
    const found = AVAILABLE_COUPONS.find(c => c.code.toUpperCase() === code.trim().toUpperCase() && c.isActive);
    if (!found) {
      return { success: false, message: 'Invalid or expired coupon code.' };
    }
    if (subtotal < found.minOrderValue) {
      return {
        success: false,
        message: `This coupon requires a minimum order value of ₹${found.minOrderValue}.`,
      };
    }
    setAppliedCoupon(found);
    showToast(`Coupon "${found.code}" applied successfully! 🎉`, 'success');
    return { success: true, message: `Coupon applied: ${found.description}` };
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    showToast('Coupon removed', 'info');
  };

  const checkPincode = (pin: string) => {
    try {
      const info = checkPincodeDelivery(pin);
      setCurrentPincode(pin);
      setPincodeInfo(info);
      localStorage.setItem('impressive_pincode', pin);
      showToast(`Delivery verified for ${info.city}!`, 'success');
      return { success: true };
    } catch (err: any) {
      return { success: false, message: err.message || 'Invalid pincode.' };
    }
  };

  // Calculations
  const cartCount = cart.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cart.reduce((acc, item) => acc + item.totalPrice, 0);
  const giftWrapFee = cart.reduce((acc, item) => acc + (item.isGiftWrapped ? GIFT_WRAP_COST * item.quantity : 0), 0);

  // Discount calculation
  let discount = 0;
  if (appliedCoupon && subtotal >= appliedCoupon.minOrderValue) {
    if (appliedCoupon.discountType === 'percentage') {
      const calculated = (subtotal * appliedCoupon.discountValue) / 100;
      discount = appliedCoupon.maxDiscount ? Math.min(calculated, appliedCoupon.maxDiscount) : calculated;
    } else {
      discount = appliedCoupon.discountValue;
    }
  }

  const freeShippingThreshold = FREE_SHIPPING_MIN;
  const freeShippingRemaining = Math.max(0, FREE_SHIPPING_MIN - subtotal);
  const shippingFee = subtotal >= FREE_SHIPPING_MIN || cart.length === 0 ? 0 : STANDARD_SHIPPING_COST;
  const tax = 0; // Prices are all-inclusive of GST in India
  const total = Math.max(0, subtotal - discount + shippingFee + giftWrapFee);

  const formatPrice = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <ShopContext.Provider
      value={{
        cart,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        cartCount,
        subtotal,
        discount,
        shippingFee,
        giftWrapFee,
        tax,
        total,
        freeShippingThreshold,
        freeShippingRemaining,
        isCartDrawerOpen,
        setIsCartDrawerOpen,
        wishlist,
        toggleWishlist,
        isInWishlist,
        wishlistCount: wishlist.length,
        coupons: AVAILABLE_COUPONS,
        appliedCoupon,
        applyCoupon,
        removeCoupon,
        recentlyViewed,
        addRecentlyViewed,
        compareList,
        toggleCompare,
        clearCompare,
        isCompareModalOpen,
        setIsCompareModalOpen,
        isSearchOpen,
        setIsSearchOpen,
        isGiftFinderOpen,
        setIsGiftFinderOpen,
        quickViewProduct,
        setQuickViewProduct,
        currentPincode,
        pincodeInfo,
        checkPincode,
        toasts,
        showToast,
        removeToast,
        formatPrice,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
