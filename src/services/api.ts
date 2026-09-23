export const API_BASE_URL = (
  import.meta.env.VITE_API_URL || 'https://ig-backend-gucx.onrender.com'
).replace(/\/$/, '').replace(/\/api$/, '') + '/api';


function getAuthHeader(): HeadersInit {
  const token = localStorage.getItem('impressive_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const api = {
  // Auth
  auth: {
    async login(email: string, password: string) {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Invalid credentials' }));
        throw new Error(err.message || 'Login failed');
      }
      return res.json();
    },

    async register(data: { name: string; email: string; password: string; phone?: string }) {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Registration failed' }));
        throw new Error(err.message || 'Registration failed');
      }
      return res.json();
    },

    async getMe() {
      const res = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) return null;
      return res.json();
    },
  },

  // Products
  products: {
    async getAll(params?: {
      category?: string;
      occasion?: string;
      search?: string;
      featured?: boolean;
      bestSeller?: boolean;
      trending?: boolean;
      newArrival?: boolean;
    }) {
      const query = new URLSearchParams();
      if (params?.category) query.append('category', params.category);
      if (params?.occasion) query.append('occasion', params.occasion);
      if (params?.search) query.append('search', params.search);
      if (params?.featured) query.append('featured', 'true');
      if (params?.bestSeller) query.append('bestSeller', 'true');
      if (params?.trending) query.append('trending', 'true');
      if (params?.newArrival) query.append('newArrival', 'true');

      const res = await fetch(`${API_BASE_URL}/products?${query.toString()}`);
      if (!res.ok) throw new Error('Failed to fetch products');
      return res.json();
    },

    async getById(id: string) {
      const res = await fetch(`${API_BASE_URL}/products/${id}`);
      if (!res.ok) throw new Error('Product not found');
      return res.json();
    },
  },

  // Orders & Tracking
  orders: {
    async create(orderData: any) {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify(orderData),
      });
      if (!res.ok) throw new Error('Failed to create order');
      return res.json();
    },

    async track(orderNumber: string) {
      const res = await fetch(`${API_BASE_URL}/orders/track/${encodeURIComponent(orderNumber)}`);
      if (!res.ok) throw new Error('Order not found');
      return res.json();
    },

    async getUserOrders() {
      const res = await fetch(`${API_BASE_URL}/orders/user`, {
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) throw new Error('Failed to fetch user orders');
      return res.json();
    },
  },

  // Coupons
  coupons: {
    async getActive() {
      const res = await fetch(`${API_BASE_URL}/coupons`);
      if (!res.ok) return [];
      return res.json();
    },

    async apply(code: string, orderAmount: number) {
      const res = await fetch(`${API_BASE_URL}/coupons/apply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, orderAmount }),
      });
      if (!res.ok) throw new Error('Failed to apply coupon');
      return res.json();
    },
  },

  // Corporate Inquiries
  corporate: {
    async submit(data: {
      companyName: string;
      contactPerson: string;
      email: string;
      phone: string;
      quantity?: number;
      budgetRange?: string;
      requirements?: string;
    }) {
      const res = await fetch(`${API_BASE_URL}/corporate/inquire`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Failed to submit corporate enquiry');
      return res.json();
    },
  },

  // Reviews
  reviews: {
    async getByProduct(productId: string) {
      const res = await fetch(`${API_BASE_URL}/reviews/product/${productId}`);
      if (!res.ok) return [];
      return res.json();
    },

    async create(review: any) {
      const res = await fetch(`${API_BASE_URL}/reviews`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(review),
      });
      if (!res.ok) throw new Error('Failed to submit review');
      return res.json();
    },
  },

  // Admin
  admin: {
    async login(email: string, password: string) {
      const res = await fetch(`${API_BASE_URL}/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const err = await res.json().catch(() => ({ message: 'Invalid administrator credentials' }));
        throw new Error(err.message || 'Administrator login failed');
      }
      return res.json();
    },

    async getDashboard() {
      const res = await fetch(`${API_BASE_URL}/admin/dashboard`, {
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) throw new Error('Failed to load dashboard metrics');
      return res.json();
    },

    async getAllOrders() {
      const res = await fetch(`${API_BASE_URL}/orders`, {
        headers: { ...getAuthHeader() },
      });
      if (!res.ok) throw new Error('Failed to load orders');
      return res.json();
    },

    async updateOrderStatus(orderNumber: string, status: string, trackingNumber?: string) {
      const res = await fetch(`${API_BASE_URL}/orders/${orderNumber}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader(),
        },
        body: JSON.stringify({ status, trackingNumber }),
      });
      if (!res.ok) throw new Error('Failed to update order status');
      return res.json();
    },
  },
};
