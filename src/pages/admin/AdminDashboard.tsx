import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingBag, 
  Users, 
  Tag, 
  Building2, 
  BarChart3, 
  Plus, 
  Edit3, 
  Trash2, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Clock, 
  Search, 
  Filter, 
  Download, 
  Sparkles,
  ArrowUpRight,
  Eye,
  Sliders,
  DollarSign,
  Lock,
  Mail,
  ShieldCheck,
  LogOut,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../../context/AdminContext';
import { useShop } from '../../context/ShopContext';
import { api } from '../../services/api';
import { Product, OrderStatus, CorporateEnquiry, Coupon } from '../../types';

interface AdminDashboardProps {
  onBackToStore: () => void;
}

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ onBackToStore }) => {
  const { 
    products, 
    addProduct, 
    updateProduct, 
    deleteProduct,
    orders, 
    updateOrderStatus,
    corporateEnquiries, 
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
    lowStockProducts
  } = useAdmin();

  const { formatPrice, showToast } = useShop();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState<boolean>(() => {
    return localStorage.getItem('impressive_admin_token') !== null;
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [adminAuthLoading, setAdminAuthLoading] = useState(false);
  const [adminAuthError, setAdminAuthError] = useState('');

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!adminEmail.trim() || !adminPassword.trim()) {
      setAdminAuthError('Please enter both admin email and password.');
      return;
    }
    setAdminAuthLoading(true);
    setAdminAuthError('');
    try {
      const res = await api.admin.login(adminEmail.trim(), adminPassword.trim());
      if (res.token) {
        localStorage.setItem('impressive_admin_token', res.token);
      }
      setIsAdminLoggedIn(true);
      showToast('Welcome Administrator! Management console unlocked.', 'success');
    } catch (err: any) {
      setAdminAuthError(err.message || 'Invalid administrator credentials.');
    } finally {
      setAdminAuthLoading(false);
    }
  };

  const handleFillAdminDemo = () => {
    setAdminEmail('admin@impressivegifts.in');
    setAdminPassword('Admin@123');
  };

  const handleAdminLogout = () => {
    localStorage.removeItem('impressive_admin_token');
    setIsAdminLoggedIn(false);
    showToast('Logged out of Administrator session.', 'info');
  };

  const [adminTab, setAdminTab] = useState<'overview' | 'products' | 'orders' | 'customers' | 'coupons' | 'corporate' | 'analytics'>('overview');

  // Search in tables
  const [productSearch, setProductSearch] = useState('');
  const [orderSearch, setOrderSearch] = useState('');

  // Add Product Modal
  const [showAddProductModal, setShowAddProductModal] = useState(false);
  const [newProductForm, setNewProductForm] = useState({
    name: '',
    slug: '',
    tagline: '',
    category: 'photo-gifts' as any,
    occasions: ['birthday', 'anniversary'] as any,
    recipients: ['Friend', 'Wife'] as any,
    price: 799,
    originalPrice: 1499,
    discountPercentage: 47,
    rating: 4.9,
    reviewCount: 12,
    images: ['https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop'],
    badge: 'New' as any,
    stock: 50,
    isPersonalizable: true,
    personalizationType: 'both' as any,
    description: 'Master artisan crafted customized keepsake.',
    specifications: { 'Material': 'Optical Crystal Acrylic', 'Care': 'Wipe with dry microfiber cloth' },
    instructions: ['Upload clear centered photograph'],
    faq: [{ q: 'Is it durable?', a: 'Yes, scratch-proof acrylic casing.' }],
    isExpressAvailable: true,
  });

  // Create Coupon Modal
  const [showAddCouponModal, setShowAddCouponModal] = useState(false);
  const [newCouponForm, setNewCouponForm] = useState<Coupon>({
    code: '',
    discountType: 'percentage',
    discountValue: 15,
    minOrderValue: 999,
    expiryDate: '2026-12-31',
    description: '',
    isActive: true,
  });

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProductForm.name || !newProductForm.price) {
      showToast('Please provide product name and price.', 'error');
      return;
    }
    addProduct(newProductForm);
    setShowAddProductModal(false);
    showToast(`Product "${newProductForm.name}" created!`, 'success');
  };

  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCouponForm.code) return;
    addCoupon({
      ...newCouponForm,
      code: newCouponForm.code.toUpperCase().trim(),
    });
    setShowAddCouponModal(false);
    showToast(`Coupon ${newCouponForm.code} created!`, 'success');
  };

  const filteredProducts = products.filter(p =>
    p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(productSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o =>
    o.orderNumber.toLowerCase().includes(orderSearch.toLowerCase()) ||
    o.shippingAddress.fullName.toLowerCase().includes(orderSearch.toLowerCase())
  );

  if (!isAdminLoggedIn) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex flex-col justify-between p-4 sm:p-8 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#882434]/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top bar */}
        <div className="max-w-6xl w-full mx-auto flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#882434] text-white flex items-center justify-center font-bold font-serif text-xl shadow-lg shadow-[#882434]/30">
              IG
            </div>
            <div>
              <span className="font-serif text-lg font-bold tracking-tight text-white">ImpressiveGifts</span>
              <span className="ml-2 text-[10px] bg-[#C59B27] text-stone-950 font-sans font-bold px-2 py-0.5 rounded uppercase tracking-wider">Admin</span>
            </div>
          </div>
          <button
            onClick={onBackToStore}
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-stone-300 hover:text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Back to Storefront</span>
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

        {/* Login Card */}
        <div className="max-w-md w-full mx-auto my-auto z-10 py-8">
          <div className="bg-stone-900/90 border border-stone-800 rounded-3xl p-8 shadow-2xl backdrop-blur-xl">
            <div className="text-center mb-6">
              <div className="w-14 h-14 rounded-2xl bg-[#882434]/20 border border-[#882434]/40 text-[#ff8b9e] flex items-center justify-center mx-auto mb-4 shadow-inner">
                <ShieldCheck className="w-8 h-8 text-[#C59B27]" />
              </div>
              <h2 className="text-2xl font-serif font-bold text-white">Admin Authentication</h2>
              <p className="text-xs text-stone-400 mt-1">Management Console & Spring Boot Backend Control</p>
              
              <div className="mt-3 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-stone-800/80 border border-stone-700/60 text-[11px] text-stone-300">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>Active Endpoint: <code className="text-emerald-400 font-mono">POST /api/admin/login</code></span>
              </div>
            </div>

            {adminAuthError && (
              <div className="mb-5 p-3.5 rounded-xl bg-rose-950/60 border border-rose-800/60 text-rose-300 text-xs flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
                <span>{adminAuthError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="email"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    placeholder="admin@impressivegifts.in"
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] transition-colors"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-300 uppercase tracking-wider mb-1.5">
                  Admin Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-stone-500" />
                  <input
                    type="password"
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-stone-950/80 border border-stone-800 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-stone-600 focus:outline-none focus:border-[#C59B27] focus:ring-1 focus:ring-[#C59B27] transition-colors"
                    required
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  disabled={adminAuthLoading}
                  className="w-full py-3 rounded-xl bg-gradient-to-r from-[#882434] to-[#a83246] hover:from-[#721c2a] hover:to-[#882434] text-white font-bold text-sm shadow-lg shadow-[#882434]/30 transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  {adminAuthLoading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      <span>Verifying Credentials...</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4 text-[#C59B27]" />
                      <span>Login to Admin Panel</span>
                    </>
                  )}
                </button>
              </div>

              <div className="pt-3 border-t border-stone-800/80 text-center">
                <button
                  type="button"
                  onClick={handleFillAdminDemo}
                  className="text-xs text-[#C59B27] hover:underline cursor-pointer font-medium inline-flex items-center gap-1.5"
                >
                  <span>Auto-fill Admin Demo Credentials</span>
                  <span className="text-[10px] text-stone-500">(admin@impressivegifts.in / Admin@123)</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Footer info */}
        <div className="text-center text-xs text-stone-500 z-10 py-2">
          Protected by ImpressiveGifts RBAC Engine · Spring Boot 3.3.4 Security & PostgreSQL 18
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] text-stone-900 pb-16">
      {/* Admin Top Navigation Bar */}
      <header className="bg-stone-900 text-white border-b border-stone-800 sticky top-0 z-30 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#882434] text-white flex items-center justify-center font-bold font-serif text-lg">
            IG
          </div>
          <div>
            <h1 className="font-serif text-lg font-bold leading-tight flex items-center gap-2">
              <span>ImpressiveGifts</span>
              <span className="text-[10px] bg-[#C59B27] text-stone-950 font-sans font-bold px-1.5 py-0.5 rounded">
                Admin Console
              </span>
            </h1>
            <p className="text-[10px] text-stone-400">Store Management & Crafting Engine</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={onBackToStore}
            className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-white transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <span>Exit to Store</span>
            <ArrowUpRight className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={handleAdminLogout}
            className="px-3.5 py-2 rounded-xl bg-rose-900/60 hover:bg-rose-900 text-rose-200 hover:text-white border border-rose-700/50 text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout Admin</span>
          </button>
        </div>
      </header>

      {/* Main Admin Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 space-y-8">
        {/* Navigation Tabs Bar */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-300 text-xs font-bold uppercase tracking-wider">
          <button
            onClick={() => setAdminTab('overview')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              adminTab === 'overview' ? 'bg-[#882434] text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Overview & KPIs</span>
          </button>

          <button
            onClick={() => setAdminTab('products')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              adminTab === 'products' ? 'bg-[#882434] text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>Products ({products.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('orders')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              adminTab === 'orders' ? 'bg-[#882434] text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('corporate')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              adminTab === 'corporate' ? 'bg-[#882434] text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>Corporate Leads ({corporateEnquiries.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('coupons')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              adminTab === 'coupons' ? 'bg-[#882434] text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Coupons ({adminCoupons.length})</span>
          </button>

          <button
            onClick={() => setAdminTab('analytics')}
            className={`px-4 py-2.5 rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
              adminTab === 'analytics' ? 'bg-[#882434] text-white shadow-xs' : 'bg-white text-stone-600 hover:bg-stone-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Analytics</span>
          </button>
        </div>

        {/* 1. OVERVIEW & KPIS */}
        {adminTab === 'overview' && (
          <div className="space-y-8 animate-in fade-in duration-200">
            {/* KPI Metric Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              <div className="p-6 rounded-3xl bg-white border border-[#EAE4DA] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Gross Sales</span>
                  <DollarSign className="w-5 h-5 text-emerald-600" />
                </div>
                <div className="text-3xl font-bold font-serif text-stone-900">
                  {formatPrice(totalRevenue)}
                </div>
                <div className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5" /> +24.8% vs last month
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EAE4DA] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Lifetime Orders</span>
                  <ShoppingBag className="w-5 h-5 text-[#882434]" />
                </div>
                <div className="text-3xl font-bold font-serif text-stone-900">
                  {totalOrdersCount}
                </div>
                <div className="text-xs text-stone-500 font-medium">
                  {pendingOrdersCount} orders currently in customization
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EAE4DA] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Average Order Value</span>
                  <BarChart3 className="w-5 h-5 text-[#C59B27]" />
                </div>
                <div className="text-3xl font-bold font-serif text-stone-900">
                  {formatPrice(averageOrderValue)}
                </div>
                <div className="text-xs text-stone-500 font-medium">
                  Boosted by personalized bundles & frames
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EAE4DA] shadow-xs space-y-2">
                <div className="flex items-center justify-between text-stone-400">
                  <span className="text-xs font-bold uppercase tracking-wider">Store Conversion</span>
                  <TrendingUp className="w-5 h-5 text-indigo-600" />
                </div>
                <div className="text-3xl font-bold font-serif text-stone-900">
                  {conversionRate}%
                </div>
                <div className="text-xs text-emerald-700 font-semibold">
                  +1.2% above gifting industry benchmark
                </div>
              </div>
            </div>

            {/* Recent Orders Snapshot & Stock Alerts */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Recent Orders to Process */}
              <div className="lg:col-span-2 bg-white rounded-3xl p-6 border border-[#EAE4DA] shadow-xs space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Live Customization Orders Queue
                  </h3>
                  <button
                    onClick={() => setAdminTab('orders')}
                    className="text-xs font-bold text-[#882434] hover:underline cursor-pointer"
                  >
                    View All Orders →
                  </button>
                </div>

                <div className="space-y-3">
                  {orders.slice(0, 4).map((ord) => (
                    <div
                      key={ord.id}
                      className="p-4 rounded-2xl bg-stone-50 border border-stone-200/70 flex items-center justify-between gap-4"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={ord.items[0]?.personalization?.photoUrl || ord.items[0]?.product.images[0]}
                          alt="custom item"
                          className="w-12 h-12 rounded-xl object-cover border border-stone-200"
                        />
                        <div>
                          <div className="text-xs font-bold text-stone-900 font-mono">
                            {ord.orderNumber} • {ord.shippingAddress.fullName}
                          </div>
                          <div className="text-[11px] text-stone-500">
                            {ord.items.length} gift items • Total: {formatPrice(ord.total)}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-[#882434]/10 text-[#882434]">
                          {ord.orderStatus}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Low Stock Warning Card */}
              <div className="bg-white rounded-3xl p-6 border border-[#EAE4DA] shadow-xs space-y-4">
                <div className="flex items-center gap-2 text-amber-700">
                  <AlertTriangle className="w-5 h-5 text-amber-500" />
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Low Stock Alerts
                  </h3>
                </div>

                <div className="space-y-2.5">
                  {lowStockProducts.map((p) => (
                    <div key={p.id} className="p-3 bg-amber-50/50 rounded-xl border border-amber-200/60 flex items-center justify-between text-xs">
                      <span className="font-medium text-stone-800 line-clamp-1">{p.name}</span>
                      <span className="font-bold text-amber-900 shrink-0 pl-2">{p.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 2. PRODUCT MANAGEMENT */}
        {adminTab === 'products' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="flex-1 max-w-sm relative">
                <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  value={productSearch}
                  onChange={(e) => setProductSearch(e.target.value)}
                  placeholder="Search catalog by name or category..."
                  className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium"
                />
              </div>

              <button
                onClick={() => setShowAddProductModal(true)}
                className="px-5 py-2.5 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md cursor-pointer"
              >
                <Plus className="w-4 h-4" />
                <span>Add New Gift</span>
              </button>
            </div>

            {/* Products Table */}
            <div className="bg-white rounded-3xl border border-[#EAE4DA] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE4DA] font-bold text-stone-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Product</th>
                      <th className="p-4">Category</th>
                      <th className="p-4">Price / MRP</th>
                      <th className="p-4">Stock</th>
                      <th className="p-4">Personalization</th>
                      <th className="p-4">Rating</th>
                      <th className="p-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                    {filteredProducts.map((p) => (
                      <tr key={p.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="p-4 flex items-center gap-3">
                          <img src={p.images[0]} alt={p.name} className="w-10 h-10 rounded-lg object-cover border border-stone-200 shrink-0" />
                          <div className="min-w-0">
                            <div className="font-bold text-stone-900 line-clamp-1">{p.name}</div>
                            <div className="text-[10px] text-stone-400 font-mono">{p.id}</div>
                          </div>
                        </td>
                        <td className="p-4 capitalize">{p.category}</td>
                        <td className="p-4">
                          <span className="font-bold text-stone-900">{formatPrice(p.price)}</span>
                          <span className="text-[10px] text-stone-400 line-through ml-1.5">{formatPrice(p.originalPrice)}</span>
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full font-bold text-[10px] ${
                            p.stock <= 20 ? 'bg-amber-100 text-amber-900' : 'bg-emerald-100 text-emerald-900'
                          }`}>
                            {p.stock} Units
                          </span>
                        </td>
                        <td className="p-4">
                          {p.isPersonalizable ? (
                            <span className="text-emerald-700 font-semibold flex items-center gap-1">
                              <Sparkles className="w-3 h-3 text-[#C59B27]" />
                              {p.personalizationType}
                            </span>
                          ) : (
                            <span className="text-stone-400">None</span>
                          )}
                        </td>
                        <td className="p-4">
                          ⭐ {p.rating} ({p.reviewCount})
                        </td>
                        <td className="p-4 text-right">
                          <button
                            onClick={() => deleteProduct(p.id)}
                            className="p-1 text-stone-400 hover:text-rose-600 transition-colors cursor-pointer"
                            title="Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Add Product Modal */}
            {showAddProductModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
                <form onSubmit={handleCreateProduct} className="bg-white rounded-3xl p-6 max-w-lg w-full space-y-4 shadow-2xl max-h-[90vh] overflow-y-auto">
                  <h3 className="font-serif text-lg font-bold text-stone-900">Add New Personalized Gift</h3>
                  <input
                    type="text"
                    required
                    placeholder="Product Name"
                    value={newProductForm.name}
                    onChange={(e) => setNewProductForm({ ...newProductForm, name: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border rounded-xl text-xs"
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <input
                      type="number"
                      required
                      placeholder="Special Price (₹)"
                      value={newProductForm.price}
                      onChange={(e) => setNewProductForm({ ...newProductForm, price: Number(e.target.value) })}
                      className="p-2.5 bg-stone-50 border rounded-xl text-xs"
                    />
                    <input
                      type="number"
                      required
                      placeholder="MRP (₹)"
                      value={newProductForm.originalPrice}
                      onChange={(e) => setNewProductForm({ ...newProductForm, originalPrice: Number(e.target.value) })}
                      className="p-2.5 bg-stone-50 border rounded-xl text-xs"
                    />
                  </div>
                  <input
                    type="text"
                    placeholder="Image URL"
                    value={newProductForm.images[0]}
                    onChange={(e) => setNewProductForm({ ...newProductForm, images: [e.target.value] })}
                    className="w-full p-2.5 bg-stone-50 border rounded-xl text-xs"
                  />
                  <textarea
                    rows={2}
                    placeholder="Description"
                    value={newProductForm.description}
                    onChange={(e) => setNewProductForm({ ...newProductForm, description: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border rounded-xl text-xs"
                  />
                  <div className="flex gap-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddProductModal(false)}
                      className="flex-1 py-2.5 rounded-xl border text-xs font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2.5 rounded-xl bg-[#882434] text-white text-xs font-bold"
                    >
                      Create Product
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 3. ORDER MANAGEMENT & STATUS UPDATES */}
        {adminTab === 'orders' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="max-w-sm relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="text"
                value={orderSearch}
                onChange={(e) => setOrderSearch(e.target.value)}
                placeholder="Search orders by ID or customer..."
                className="w-full pl-9 pr-4 py-2 bg-white border border-stone-200 rounded-xl text-xs font-medium"
              />
            </div>

            <div className="bg-white rounded-3xl border border-[#EAE4DA] shadow-xs overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#FAF8F5] border-b border-[#EAE4DA] font-bold text-stone-500 uppercase tracking-wider">
                    <tr>
                      <th className="p-4">Order ID</th>
                      <th className="p-4">Customer</th>
                      <th className="p-4">Items / Customization Preview</th>
                      <th className="p-4">Total</th>
                      <th className="p-4">Payment</th>
                      <th className="p-4">Order Status Transition</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100 font-medium text-stone-700">
                    {filteredOrders.map((ord) => (
                      <tr key={ord.id} className="hover:bg-stone-50/70 transition-colors">
                        <td className="p-4 font-mono font-bold text-[#882434]">
                          {ord.orderNumber}
                        </td>
                        <td className="p-4">
                          <div className="font-bold text-stone-900">{ord.shippingAddress.fullName}</div>
                          <div className="text-[10px] text-stone-400">{ord.shippingAddress.city}, {ord.shippingAddress.state}</div>
                        </td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <img
                              src={ord.items[0]?.personalization?.photoUrl || ord.items[0]?.product.images[0]}
                              alt="preview"
                              className="w-9 h-9 rounded-lg object-cover border border-stone-200"
                            />
                            <div className="min-w-0 max-w-[200px]">
                              <div className="truncate font-semibold">{ord.items[0]?.product.name}</div>
                              {ord.items[0]?.personalization?.customTextLine1 && (
                                <div className="text-[10px] text-[#882434] truncate">
                                  "{ord.items[0].personalization.customTextLine1}"
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="p-4 font-bold text-stone-900">
                          {formatPrice(ord.total)}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase ${
                            ord.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ord.paymentStatus} ({ord.paymentMethod})
                          </span>
                        </td>
                        <td className="p-4">
                          <select
                            value={ord.orderStatus}
                            onChange={(e) => {
                              updateOrderStatus(ord.id, e.target.value as OrderStatus);
                              showToast(`Order ${ord.orderNumber} updated to ${e.target.value}`, 'info');
                            }}
                            className="bg-stone-50 border border-stone-300 rounded-xl px-2.5 py-1 text-xs font-semibold cursor-pointer"
                          >
                            <option value="Order Placed">Order Placed</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Personalization in Progress">Personalization in Progress</option>
                            <option value="Processing">Processing</option>
                            <option value="Shipped">Shipped</option>
                            <option value="Out for Delivery">Out for Delivery</option>
                            <option value="Delivered">Delivered</option>
                            <option value="Cancelled">Cancelled</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* 4. CORPORATE LEADS */}
        {adminTab === 'corporate' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              Inbound Corporate Gifting Enquiries
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {corporateEnquiries.map((corp) => (
                <div key={corp.id} className="p-5 rounded-3xl bg-white border border-[#EAE4DA] shadow-xs space-y-3">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <div>
                      <h4 className="font-serif text-base font-bold text-stone-900">{corp.companyName}</h4>
                      <p className="text-xs text-stone-500">{corp.contactPerson} • {corp.email}</p>
                    </div>

                    <select
                      value={corp.status}
                      onChange={(e) => updateEnquiryStatus(corp.id, e.target.value as any)}
                      className="text-xs font-bold px-2.5 py-1 bg-stone-50 border border-stone-200 rounded-xl"
                    >
                      <option value="New">New</option>
                      <option value="Under Review">Under Review</option>
                      <option value="Quoted">Quoted</option>
                      <option value="Converted">Converted</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </div>

                  <div className="text-xs space-y-1 text-stone-700">
                    <p><strong>Occasion:</strong> {corp.occasion}</p>
                    <p><strong>Requested Quantity:</strong> {corp.estimatedQuantity} Units</p>
                    <p><strong>Budget:</strong> {corp.approximateBudget}</p>
                    <p className="text-stone-500 italic pt-1">"{corp.requirements}"</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* 5. COUPONS MANAGER */}
        {adminTab === 'coupons' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <div className="flex items-center justify-between">
              <h3 className="font-serif text-lg font-bold text-stone-900">Active Coupons</h3>
              <button
                onClick={() => setShowAddCouponModal(true)}
                className="px-4 py-2 bg-[#882434] text-white rounded-xl text-xs font-bold"
              >
                + Create Coupon
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {adminCoupons.map((c) => (
                <div key={c.code} className="p-4 rounded-2xl bg-white border border-stone-200 space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-sm font-bold text-[#882434]">{c.code}</span>
                    <button
                      onClick={() => toggleCouponStatus(c.code)}
                      className={`text-[10px] font-bold px-2 py-0.5 rounded cursor-pointer ${
                        c.isActive ? 'bg-emerald-100 text-emerald-800' : 'bg-stone-200 text-stone-600'
                      }`}
                    >
                      {c.isActive ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                  <p className="text-xs text-stone-600">{c.description}</p>
                  <p className="text-[10px] text-stone-400">Min Order: ₹{c.minOrderValue}</p>
                </div>
              ))}
            </div>

            {/* Add Coupon Modal */}
            {showAddCouponModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60">
                <form onSubmit={handleCreateCoupon} className="bg-white p-6 rounded-3xl max-w-sm w-full space-y-3">
                  <h4 className="font-bold text-sm">Create New Promo Code</h4>
                  <input
                    type="text"
                    required
                    placeholder="Coupon Code (e.g. VIP25)"
                    value={newCouponForm.code}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, code: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border rounded-xl text-xs uppercase"
                  />
                  <input
                    type="text"
                    required
                    placeholder="Description"
                    value={newCouponForm.description}
                    onChange={(e) => setNewCouponForm({ ...newCouponForm, description: e.target.value })}
                    className="w-full p-2.5 bg-stone-50 border rounded-xl text-xs"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => setShowAddCouponModal(false)}
                      className="flex-1 py-2 rounded-xl border text-xs"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="flex-1 py-2 rounded-xl bg-[#882434] text-white text-xs font-bold"
                    >
                      Save
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* 6. ANALYTICS & INSIGHTS */}
        {adminTab === 'analytics' && (
          <div className="space-y-6 animate-in fade-in duration-200">
            <h3 className="font-serif text-lg font-bold text-stone-900">
              E-Commerce Performance Insights
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="p-6 rounded-3xl bg-white border border-[#EAE4DA] space-y-3">
                <h4 className="text-xs font-bold uppercase text-stone-400">Top Personalized Categories</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span>Photo Plaques & Acrylic</span><strong>38%</strong></div>
                  <div className="flex justify-between"><span>Engraved Mugs & Bottles</span><strong>26%</strong></div>
                  <div className="flex justify-between"><span>Wooden Frames & Clocks</span><strong>21%</strong></div>
                  <div className="flex justify-between"><span>Corporate Hampers</span><strong>15%</strong></div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EAE4DA] space-y-3">
                <h4 className="text-xs font-bold uppercase text-stone-400">Conversion Funnel</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span>Product Discovery</span><strong>100%</strong></div>
                  <div className="flex justify-between"><span>Personalization Live Preview</span><strong>64%</strong></div>
                  <div className="flex justify-between"><span>Add to Cart Rate</span><strong>28%</strong></div>
                  <div className="flex justify-between"><span>Checkout Completion</span><strong>14%</strong></div>
                </div>
              </div>

              <div className="p-6 rounded-3xl bg-white border border-[#EAE4DA] space-y-3">
                <h4 className="text-xs font-bold uppercase text-stone-400">Top Occasions</h4>
                <div className="space-y-2 text-xs">
                  <div className="flex justify-between"><span>Anniversary & Wedding</span><strong>42%</strong></div>
                  <div className="flex justify-between"><span>Birthday Celebrations</span><strong>31%</strong></div>
                  <div className="flex justify-between"><span>Festive Celebrations</span><strong>18%</strong></div>
                  <div className="flex justify-between"><span>Corporate Gifting</span><strong>9%</strong></div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
