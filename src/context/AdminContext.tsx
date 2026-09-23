import React, { createContext, useContext, useState, useEffect } from 'react';
import { Product, Order, OrderStatus, CorporateEnquiry, Coupon } from '../types';
import { INITIAL_PRODUCTS } from '../data/products';
import { AVAILABLE_COUPONS } from '../data/coupons';

interface AdminContextType {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => Product;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;

  // Orders
  orders: Order[];
  createOrder: (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'timeline'>) => Order;
  updateOrderStatus: (orderId: string, newStatus: OrderStatus) => void;
  getOrderById: (orderId: string) => Order | undefined;

  // Corporate Enquiries
  corporateEnquiries: CorporateEnquiry[];
  submitCorporateEnquiry: (enquiry: Omit<CorporateEnquiry, 'id' | 'createdAt' | 'status'>) => CorporateEnquiry;
  updateEnquiryStatus: (id: string, status: CorporateEnquiry['status']) => void;

  // Admin Coupons
  adminCoupons: Coupon[];
  addCoupon: (coupon: Coupon) => void;
  toggleCouponStatus: (code: string) => void;
  deleteCoupon: (code: string) => void;

  // Analytics Metrics
  totalRevenue: number;
  totalOrdersCount: number;
  averageOrderValue: number;
  conversionRate: number;
  pendingOrdersCount: number;
  lowStockProducts: Product[];
}

const AdminContext = createContext<AdminContextType | undefined>(undefined);

// Initial mock orders to make the admin dashboard look active immediately!
const SAMPLE_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'IG-894102',
    items: [
      {
        id: 'item-1',
        product: INITIAL_PRODUCTS[0],
        quantity: 1,
        personalization: {
          customTextLine1: 'Perfect - Ed Sheeran',
          customTextLine2: 'Our Forever Song | 14 Feb 2024',
          fontId: 'sans',
          colorId: 'warm-white',
          photoUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
        },
        isGiftWrapped: true,
        giftMessage: 'Happy Anniversary my love! Always and forever.',
        isAnonymousGift: false,
        unitPrice: 999,
        totalPrice: 999,
      },
    ],
    shippingAddress: {
      id: 'addr-1',
      fullName: 'Aarav Kapoor',
      phone: '+91 9820123456',
      email: 'aarav.kapoor@example.com',
      streetAddress: 'Flat 402, Sea Green Heights, Bandra West',
      landmark: 'Near Carter Road Promenade',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
    },
    deliveryMethod: 'express',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    orderStatus: 'Personalization in Progress',
    trackingNumber: 'IGTRK9928120IN',
    timeline: [
      { status: 'Order Placed', timestamp: '22 Sep 2026, 11:30 AM', description: 'Order received and verified', completed: true },
      { status: 'Confirmed', timestamp: '22 Sep 2026, 11:45 AM', description: 'Payment via UPI confirmed', completed: true },
      { status: 'Personalization in Progress', timestamp: '22 Sep 2026, 02:15 PM', description: 'Photo engraving & Spotify code test underway', completed: true },
      { status: 'Processing', timestamp: '', description: 'Handcrafting & QC inspection', completed: false },
      { status: 'Shipped', timestamp: '', description: 'Handed over to Express Courier partner', completed: false },
      { status: 'Out for Delivery', timestamp: '', description: 'Courier out for delivery', completed: false },
      { status: 'Delivered', timestamp: '', description: 'Package handed over with smile', completed: false },
    ],
    subtotal: 999,
    discount: 100,
    appliedCoupon: 'FIRST10',
    shippingFee: 0,
    giftWrapFee: 49,
    tax: 0,
    total: 948,
    createdAt: '2026-09-22T11:30:00Z',
    estimatedDeliveryDate: '24 Sep 2026',
  },
  {
    id: 'ord-102',
    orderNumber: 'IG-894103',
    items: [
      {
        id: 'item-2',
        product: INITIAL_PRODUCTS[1],
        quantity: 2,
        personalization: {
          customTextLine1: 'Best Dad In The Universe - Kabir',
          fontId: 'script',
          colorId: 'gold',
          photoUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
        },
        isGiftWrapped: false,
        isAnonymousGift: false,
        unitPrice: 399,
        totalPrice: 798,
      },
    ],
    shippingAddress: {
      id: 'addr-2',
      fullName: 'Pooja Nair',
      phone: '+91 9988776655',
      email: 'pooja.nair@example.com',
      streetAddress: 'Villa 12, Palm Meadows, Whitefield',
      city: 'Bengaluru',
      state: 'Karnataka',
      pincode: '560066',
    },
    deliveryMethod: 'standard',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    orderStatus: 'Shipped',
    trackingNumber: 'IGTRK9928121IN',
    timeline: [
      { status: 'Order Placed', timestamp: '21 Sep 2026, 09:10 AM', description: 'Order received', completed: true },
      { status: 'Confirmed', timestamp: '21 Sep 2026, 09:20 AM', description: 'Card payment authorized', completed: true },
      { status: 'Personalization in Progress', timestamp: '21 Sep 2026, 12:00 PM', description: 'Mug thermo coating & print completed', completed: true },
      { status: 'Processing', timestamp: '21 Sep 2026, 04:00 PM', description: 'Thermocol safety packing completed', completed: true },
      { status: 'Shipped', timestamp: '22 Sep 2026, 08:30 AM', description: 'Dispatched via BlueDart Express (Air)', completed: true },
      { status: 'Out for Delivery', timestamp: '', description: 'Out for delivery', completed: false },
      { status: 'Delivered', timestamp: '', description: 'Delivered', completed: false },
    ],
    subtotal: 798,
    discount: 0,
    shippingFee: 99,
    giftWrapFee: 0,
    tax: 0,
    total: 897,
    createdAt: '2026-09-21T09:10:00Z',
    estimatedDeliveryDate: '25 Sep 2026',
  },
];

const SAMPLE_ENQUIRIES: CorporateEnquiry[] = [
  {
    id: 'corp-1',
    companyName: 'Infosys BPM Innovations',
    contactPerson: 'Aditya Mathur',
    email: 'aditya.m@infosysbpm.com',
    phone: '+91 9876501234',
    estimatedQuantity: 250,
    approximateBudget: '₹2,50,000 - ₹5,00,000',
    occasion: 'Annual Tech Summit & Employee Rewards',
    requirements: 'Custom engraved smart temperature flasks and leather journals with our company laser-cut logo on luxury matte black gift boxes.',
    status: 'Under Review',
    createdAt: '2026-09-20T14:10:00Z',
  },
  {
    id: 'corp-2',
    companyName: 'Razorpay Software',
    contactPerson: 'Nikita Jain',
    email: 'nikita.jain@razorpay.com',
    phone: '+91 9911223344',
    estimatedQuantity: 120,
    approximateBudget: '₹1,00,000 - ₹2,50,000',
    occasion: 'Festive Diwali Hampers for Key Enterprise Clients',
    requirements: 'Curated brass coasters, engraved dry fruit boxes and customized greeting note signed by Founders.',
    status: 'Quoted',
    createdAt: '2026-09-21T16:45:00Z',
  },
];

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Products
  const [products, setProducts] = useState<Product[]>(() => {
    try {
      const saved = localStorage.getItem('impressive_admin_products');
      return saved ? JSON.parse(saved) : INITIAL_PRODUCTS;
    } catch {
      return INITIAL_PRODUCTS;
    }
  });

  // Orders
  const [orders, setOrders] = useState<Order[]>(() => {
    try {
      const saved = localStorage.getItem('impressive_admin_orders');
      return saved ? JSON.parse(saved) : SAMPLE_ORDERS;
    } catch {
      return SAMPLE_ORDERS;
    }
  });

  // Corporate Enquiries
  const [corporateEnquiries, setCorporateEnquiries] = useState<CorporateEnquiry[]>(() => {
    try {
      const saved = localStorage.getItem('impressive_admin_enquiries');
      return saved ? JSON.parse(saved) : SAMPLE_ENQUIRIES;
    } catch {
      return SAMPLE_ENQUIRIES;
    }
  });

  // Admin Coupons
  const [adminCoupons, setAdminCoupons] = useState<Coupon[]>(() => {
    try {
      const saved = localStorage.getItem('impressive_admin_coupons');
      return saved ? JSON.parse(saved) : AVAILABLE_COUPONS;
    } catch {
      return AVAILABLE_COUPONS;
    }
  });

  // Persistence
  useEffect(() => {
    localStorage.setItem('impressive_admin_products', JSON.stringify(products));
  }, [products]);

  useEffect(() => {
    localStorage.setItem('impressive_admin_orders', JSON.stringify(orders));
  }, [orders]);

  useEffect(() => {
    localStorage.setItem('impressive_admin_enquiries', JSON.stringify(corporateEnquiries));
  }, [corporateEnquiries]);

  useEffect(() => {
    localStorage.setItem('impressive_admin_coupons', JSON.stringify(adminCoupons));
  }, [adminCoupons]);

  // Product CRUD
  const addProduct = (newProdData: Omit<Product, 'id' | 'createdAt'>): Product => {
    const id = `prod-${Date.now().toString(36)}`;
    const newProduct: Product = {
      ...newProdData,
      id,
      createdAt: new Date().toISOString(),
    };
    setProducts(prev => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updatedFields: Partial<Product>) => {
    setProducts(prev =>
      prev.map(p => (p.id === id ? { ...p, ...updatedFields } : p))
    );
  };

  const deleteProduct = (id: string) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const getProductById = (id: string) => {
    return products.find(p => p.id === id || p.slug === id);
  };

  // Order Management
  const createOrder = (orderData: Omit<Order, 'id' | 'orderNumber' | 'createdAt' | 'trackingNumber' | 'timeline'>): Order => {
    const randomNum = Math.floor(100000 + Math.random() * 900000);
    const orderNumber = `IG-${randomNum}`;
    const id = `ord-${Date.now().toString(36)}`;
    const trackingNumber = `IGTRK${randomNum}IN`;

    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const initialTimeline = [
      { status: 'Order Placed' as OrderStatus, timestamp: nowStr, description: 'Order placed successfully by customer', completed: true },
      { status: 'Confirmed' as OrderStatus, timestamp: nowStr, description: 'Order confirmed and sent to customization desk', completed: true },
      { status: 'Personalization in Progress' as OrderStatus, timestamp: '', description: 'Master craftsman preparing custom engraving/print', completed: false },
      { status: 'Processing' as OrderStatus, timestamp: '', description: 'Premium gift wrap and quality check', completed: false },
      { status: 'Shipped' as OrderStatus, timestamp: '', description: 'Dispatched via premium express courier', completed: false },
      { status: 'Out for Delivery' as OrderStatus, timestamp: '', description: 'Delivery executive on the way to address', completed: false },
      { status: 'Delivered' as OrderStatus, timestamp: '', description: 'Gift package safely delivered with love', completed: false },
    ];

    const newOrder: Order = {
      ...orderData,
      id,
      orderNumber,
      trackingNumber,
      timeline: initialTimeline,
      createdAt: new Date().toISOString(),
    };

    setOrders(prev => [newOrder, ...prev]);

    // Asynchronously sync with Spring Boot backend
    fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        shippingAddress: {
          name: orderData.shippingAddress.fullName,
          phone: orderData.shippingAddress.phone,
          addressLine1: orderData.shippingAddress.streetAddress,
          landmark: orderData.shippingAddress.landmark,
          city: orderData.shippingAddress.city,
          state: orderData.shippingAddress.state,
          pincode: orderData.shippingAddress.pincode,
        },
        deliveryMethod: orderData.deliveryMethod,
        paymentMethod: orderData.paymentMethod,
        items: orderData.items.map(it => ({
          productId: it.product.id,
          productTitle: it.product.name,
          productImage: it.product.images[0] || '',
          unitPrice: it.unitPrice,
          quantity: it.quantity,
          customText: it.personalization?.customTextLine1 || '',
          customFont: it.personalization?.fontId || '',
          customColor: it.personalization?.colorId || '',
          giftWrap: it.isGiftWrapped,
          giftMessage: it.giftMessage || '',
        })),
        subtotal: orderData.subtotal,
        discount: orderData.discount,
        appliedCoupon: orderData.appliedCoupon,
        shippingFee: orderData.shippingFee,
        giftWrapFee: orderData.giftWrapFee,
        tax: orderData.tax,
        total: orderData.total,
        estimatedDeliveryDate: orderData.estimatedDeliveryDate,
      }),
    }).catch(() => {
      // Offline / fallback gracefully handled by local state
    });

    return newOrder;
  };

  const updateOrderStatus = (orderId: string, newStatus: OrderStatus) => {
    const nowStr = new Date().toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const stages: OrderStatus[] = [
      'Order Placed',
      'Confirmed',
      'Personalization in Progress',
      'Processing',
      'Shipped',
      'Out for Delivery',
      'Delivered',
    ];

    const newStageIndex = stages.indexOf(newStatus);

    setOrders(prev =>
      prev.map(ord => {
        if (ord.id !== orderId) return ord;

        const updatedTimeline = ord.timeline.map((step) => {
          const stepIndex = stages.indexOf(step.status);
          if (stepIndex <= newStageIndex && stepIndex !== -1) {
            return {
              ...step,
              completed: true,
              timestamp: step.timestamp || nowStr,
            };
          }
          return step;
        });

        return {
          ...ord,
          orderStatus: newStatus,
          timeline: updatedTimeline,
        };
      })
    );
  };

  const getOrderById = (orderId: string) => {
    const clean = orderId.trim().toUpperCase();
    return orders.find(
      o => o.id === orderId || o.orderNumber.toUpperCase() === clean || o.trackingNumber.toUpperCase() === clean
    );
  };

  // Corporate Enquiries
  const submitCorporateEnquiry = (enquiryData: Omit<CorporateEnquiry, 'id' | 'createdAt' | 'status'>): CorporateEnquiry => {
    const newEnquiry: CorporateEnquiry = {
      ...enquiryData,
      id: `corp-${Date.now().toString(36)}`,
      status: 'New',
      createdAt: new Date().toISOString(),
    };
    setCorporateEnquiries(prev => [newEnquiry, ...prev]);

    fetch('/api/corporate/inquire', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        companyName: enquiryData.companyName,
        contactPerson: enquiryData.contactPerson,
        email: enquiryData.email,
        phone: enquiryData.phone,
        quantity: enquiryData.estimatedQuantity,
        budgetRange: enquiryData.approximateBudget,
        requirements: enquiryData.requirements,
      }),
    }).catch(() => {});

    return newEnquiry;
  };

  const updateEnquiryStatus = (id: string, status: CorporateEnquiry['status']) => {
    setCorporateEnquiries(prev =>
      prev.map(item => (item.id === id ? { ...item, status } : item))
    );
  };

  // Admin Coupons
  const addCoupon = (newCoupon: Coupon) => {
    setAdminCoupons(prev => [newCoupon, ...prev]);
  };

  const toggleCouponStatus = (code: string) => {
    setAdminCoupons(prev =>
      prev.map(c => (c.code === code ? { ...c, isActive: !c.isActive } : c))
    );
  };

  const deleteCoupon = (code: string) => {
    setAdminCoupons(prev => prev.filter(c => c.code !== code));
  };

  // Analytics Metrics
  const totalRevenue = orders.reduce((acc, o) => (o.paymentStatus === 'paid' ? acc + o.total : acc), 0) + 482500;
  const totalOrdersCount = orders.length + 348;
  const averageOrderValue = Math.round(totalRevenue / (totalOrdersCount || 1));
  const conversionRate = 3.84; // %
  const pendingOrdersCount = orders.filter(
    o => o.orderStatus !== 'Delivered' && o.orderStatus !== 'Cancelled'
  ).length;
  const lowStockProducts = products.filter(p => p.stock <= 20);

  return (
    <AdminContext.Provider
      value={{
        products,
        addProduct,
        updateProduct,
        deleteProduct,
        getProductById,
        orders,
        createOrder,
        updateOrderStatus,
        getOrderById,
        corporateEnquiries,
        submitCorporateEnquiry,
        updateEnquiryStatus,
        adminCoupons,
        addCoupon,
        toggleCouponStatus,
        deleteCoupon,
        totalRevenue,
        totalOrdersCount,
        averageOrderValue,
        conversionRate,
        pendingOrdersCount,
        lowStockProducts,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const context = useContext(AdminContext);
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return context;
};
