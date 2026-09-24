import React, { useState } from 'react';
import { 
  User, 
  Package, 
  Heart, 
  MapPin, 
  Sparkles, 
  Tag, 
  HelpCircle, 
  Calendar, 
  Plus, 
  Trash2, 
  Edit3, 
  LogOut,
  CheckCircle2,
  ExternalLink,
  Lock,
  Mail,
  Phone,
  ArrowRight,
  ShieldCheck,
  Gift,
  AlertCircle
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useAdmin } from '../context/AdminContext';
import { useShop } from '../context/ShopContext';
import { AVAILABLE_COUPONS } from '../data/coupons';

interface AccountPageProps {
  onTrackOrder: (orderId: string) => void;
  onSelectProduct: (product: any) => void;
  onExploreGifts: () => void;
}

export const AccountPage: React.FC<AccountPageProps> = ({
  onTrackOrder,
  onSelectProduct,
  onExploreGifts,
}) => {
  const { user, isLoggedIn, loginWithApi, registerWithApi, logout, updateProfile, saveAddress, deleteAddress } = useAuth();
  const { orders } = useAdmin();
  const { formatPrice, showToast } = useShop();

  // Authentication State for when !isLoggedIn
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');

  const [activeTab, setActiveTab] = useState<'profile' | 'orders' | 'addresses' | 'designs' | 'coupons' | 'help'>('orders');

  // New Address form modal toggle
  const [showAddAddressModal, setShowAddAddressModal] = useState(false);
  const [newAddr, setNewAddr] = useState({
    fullName: user.name,
    phone: user.phone,
    email: user.email,
    streetAddress: '',
    landmark: '',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400001',
    isDefault: false,
  });

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginEmail.trim() || !loginPassword.trim()) {
      setAuthError('Please enter both email and password.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      await loginWithApi(loginEmail.trim(), loginPassword.trim());
      showToast('Welcome back to ImpressiveGifts!', 'success');
    } catch (err: any) {
      setAuthError(err.message || 'Invalid email or password.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleFillDemoCustomer = async () => {
    setLoginEmail('rahul@example.com');
    setLoginPassword('User@123');
    setAuthLoading(true);
    setAuthError('');
    try {
      await loginWithApi('rahul@example.com', 'User@123');
      showToast('Logged in as Rahul Sharma (Customer)!', 'success');
    } catch {
      showToast('Logged in as Customer!', 'success');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim()) {
      setAuthError('Please fill in all required fields.');
      return;
    }
    if (regPassword !== regConfirmPassword) {
      setAuthError('Passwords do not match.');
      return;
    }
    if (regPassword.length < 6) {
      setAuthError('Password must be at least 6 characters.');
      return;
    }
    setAuthLoading(true);
    setAuthError('');
    try {
      await registerWithApi({
        name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        phone: regPhone.trim(),
      });
      showToast('Account registered successfully! Welcome to ImpressiveGifts!', 'success');
    } catch (err: any) {
      setAuthError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setAuthLoading(false);
    }
  };

  const handleSaveAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddr.streetAddress || !newAddr.pincode) {
      showToast('Please enter complete address details.', 'error');
      return;
    }
    saveAddress(newAddr);
    setShowAddAddressModal(false);
    showToast('New address saved successfully!', 'success');
  };

  const handleProfileSave = (e: React.FormEvent) => {
    e.preventDefault();
    showToast('Profile and anniversary reminder dates updated! 📅', 'success');
  };

  // ==========================================
  // 1. CUSTOMER SIGN IN & REGISTRATION VIEW
  // ==========================================
  if (!isLoggedIn) {
    return (
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center max-w-lg mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-[#882434] uppercase tracking-wider">
            Customer Portal
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
            {authMode === 'login' ? 'Customer Sign In' : 'Create Customer Account'}
          </h1>
          <p className="text-xs sm:text-sm text-stone-500">
            {authMode === 'login'
              ? 'Access your orders, saved addresses, and personalized gift previews.'
              : 'Join ImpressiveGifts to enjoy 10% off your first order and milestone alerts.'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Form Card (7 cols) */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4DA] shadow-xs space-y-6">
            {/* Tabs for Login vs Register */}
            <div className="flex bg-stone-100 p-1.5 rounded-2xl">
              <button
                type="button"
                onClick={() => { setAuthMode('login'); setAuthError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'login'
                    ? 'bg-[#882434] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Sign In
              </button>
              <button
                type="button"
                onClick={() => { setAuthMode('register'); setAuthError(''); }}
                className={`flex-1 py-2.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  authMode === 'register'
                    ? 'bg-[#882434] text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                New Customer Register
              </button>
            </div>

            {authError && (
              <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                <span>{authError}</span>
              </div>
            )}

            {/* Quick Demo Customer Login Chip */}
            {authMode === 'login' && (
              <div className="p-3 bg-[#FDF9EE] border border-[#C59B27]/40 rounded-xl flex items-center justify-between text-xs">
                <div>
                  <span className="font-semibold text-stone-800 block">Demo Customer:</span>
                  <span className="text-stone-500 font-mono text-[11px]">rahul@example.com / User@123</span>
                </div>
                <button
                  type="button"
                  onClick={handleFillDemoCustomer}
                  className="px-3 py-1.5 bg-[#882434] hover:bg-[#6E1B28] text-white font-bold text-[11px] rounded-lg cursor-pointer transition-colors shadow-2xs"
                >
                  Quick Sign In
                </button>
              </div>
            )}

            {/* LOGIN FORM */}
            {authMode === 'login' && (
              <form onSubmit={handleLoginSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Email Address *
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="email"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      placeholder="name@example.com"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#882434] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-700 block">
                      Password *
                    </label>
                    <a
                      href="#forgot-password"
                      onClick={(e) => { e.preventDefault(); showToast('Password reset link sent to your registered email.', 'info'); }}
                      className="text-[11px] text-[#882434] hover:underline"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="password"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#882434] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    defaultChecked
                    className="rounded border-stone-300 text-[#882434] focus:ring-[#882434]"
                  />
                  <label htmlFor="rememberMe" className="text-xs text-stone-600 cursor-pointer">
                    Remember me on this browser
                  </label>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-[#882434] hover:bg-[#6E1B28] disabled:opacity-60 text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md"
                >
                  {authLoading ? (
                    <span>Signing In...</span>
                  ) : (
                    <>
                      <span>Sign In to Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}

            {/* REGISTER FORM */}
            {authMode === 'register' && (
              <form onSubmit={handleRegisterSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-stone-700 block">
                    Full Name *
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                    <input
                      type="text"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      placeholder="e.g. Rahul Sharma"
                      required
                      className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#882434] focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">
                      Email Address *
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="email"
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="name@example.com"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#882434] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">
                      Mobile Number
                    </label>
                    <div className="relative">
                      <Phone className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="tel"
                        value={regPhone}
                        onChange={(e) => setRegPhone(e.target.value)}
                        placeholder="+91 8986613412"
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#882434] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">
                      Password (min 6 chars) *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        value={regPassword}
                        onChange={(e) => setRegPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#882434] focus:bg-white transition-all"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-stone-700 block">
                      Confirm Password *
                    </label>
                    <div className="relative">
                      <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
                      <input
                        type="password"
                        value={regConfirmPassword}
                        onChange={(e) => setRegConfirmPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-[#FAF8F5] border border-stone-200 rounded-xl text-xs font-medium focus:outline-hidden focus:border-[#882434] focus:bg-white transition-all"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={authLoading}
                  className="w-full py-3 bg-[#882434] hover:bg-[#6E1B28] disabled:opacity-60 text-white rounded-xl text-xs font-bold tracking-wider uppercase flex items-center justify-center gap-2 transition-all cursor-pointer shadow-md pt-3"
                >
                  {authLoading ? (
                    <span>Registering...</span>
                  ) : (
                    <>
                      <span>Create Customer Account</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          {/* Member Benefits Column (5 cols) */}
          <div className="lg:col-span-5 space-y-4">
            <div className="luxury-card rounded-3xl p-6 bg-linear-to-br from-[#FAF8F5] via-[#FFFDF9] to-[#FDF9EE] border border-[#EAE4DA] space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#882434] text-white flex items-center justify-center shadow-xs">
                  <Gift className="w-5 h-5 text-[#F5D061]" />
                </div>
                <div>
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Customer Privileges
                  </h3>
                  <p className="text-[11px] text-stone-500">Every personalized order made seamless</p>
                </div>
              </div>

              <div className="space-y-3.5 text-xs text-stone-700">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#882434] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">Live 7-Stage Order Tracking</strong>
                    <span className="text-stone-500">Follow your gift from engraving studio to doorstep delivery.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#882434] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">Saved Addresses & Fast Checkout</strong>
                    <span className="text-stone-500">Store multiple recipient addresses across 19,000+ Indian pincodes.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#882434] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">Milestone & Anniversary Alerts</strong>
                    <span className="text-stone-500">Never miss a birthday or love anniversary with automated concierge reminders.</span>
                  </div>
                </div>

                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-4 h-4 text-[#882434] shrink-0 mt-0.5" />
                  <div>
                    <strong className="block text-stone-900">Welcome Discount: FIRST10</strong>
                    <span className="text-stone-500">Instant 10% discount coupon automatically available in your cart.</span>
                  </div>
                </div>
              </div>

              <div className="p-3 bg-white rounded-xl border border-stone-200/80 text-[11px] text-stone-500 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Privacy: Your photos and messages are strictly confidential.</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ==========================================
  // 2. LOGGED-IN CUSTOMER DASHBOARD VIEW
  // ==========================================
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* User Greeting Header with Sign Out Button */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-linear-to-r from-[#FAF8F5] via-white to-[#FDF9EE] border border-[#EAE4DA] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#882434] text-white flex items-center justify-center font-serif text-2xl font-bold shadow-md">
            {user.name.charAt(0)}
          </div>
          <div>
            <div className="text-xs text-[#882434] font-bold uppercase tracking-wider">
              Customer Account
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              {user.name}
            </h1>
            <p className="text-xs text-stone-500">
              {user.email} • {user.phone}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Milestone Reminders badge */}
          {user.anniversary && (
            <div className="p-3 bg-white rounded-2xl border border-[#C59B27]/40 shadow-2xs flex items-center gap-3">
              <Calendar className="w-5 h-5 text-[#C59B27]" />
              <div className="text-xs">
                <span className="font-bold text-stone-900 block">Anniversary Alert</span>
                <span className="text-stone-500">25 Nov • We'll send early gift ideas</span>
              </div>
            </div>
          )}

          {/* Sign Out Button */}
          <button
            onClick={() => {
              logout();
              showToast('You have been signed out.', 'info');
            }}
            className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-rose-200 text-rose-700 bg-white hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer shadow-2xs"
            title="Sign out of customer account"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Tabs Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Navigation Sidebar */}
        <aside className="lg:col-span-3 bg-white p-2 sm:p-3 rounded-2xl sm:rounded-3xl border border-[#EAE4DA] flex lg:flex-col overflow-x-auto gap-1.5 sm:gap-2 lg:gap-1 shadow-xs scrollbar-none w-full">
          <button
            onClick={() => setActiveTab('orders')}
            className={`shrink-0 whitespace-nowrap text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 sm:gap-3 transition-colors cursor-pointer ${
              activeTab === 'orders' ? 'bg-[#882434] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Package className="w-4 h-4" />
            <span>My Orders ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('profile')}
            className={`shrink-0 whitespace-nowrap text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 sm:gap-3 transition-colors cursor-pointer ${
              activeTab === 'profile' ? 'bg-[#882434] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <User className="w-4 h-4" />
            <span>Profile & Reminders</span>
          </button>

          <button
            onClick={() => setActiveTab('addresses')}
            className={`shrink-0 whitespace-nowrap text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 sm:gap-3 transition-colors cursor-pointer ${
              activeTab === 'addresses' ? 'bg-[#882434] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <MapPin className="w-4 h-4" />
            <span>Saved Addresses</span>
          </button>

          <button
            onClick={() => setActiveTab('designs')}
            className={`shrink-0 whitespace-nowrap text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 sm:gap-3 transition-colors cursor-pointer ${
              activeTab === 'designs' ? 'bg-[#882434] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Saved Designs</span>
          </button>

          <button
            onClick={() => setActiveTab('coupons')}
            className={`shrink-0 whitespace-nowrap text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 sm:gap-3 transition-colors cursor-pointer ${
              activeTab === 'coupons' ? 'bg-[#882434] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>My Coupons</span>
          </button>

          <button
            onClick={() => setActiveTab('help')}
            className={`shrink-0 whitespace-nowrap text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-xl sm:rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 sm:gap-3 transition-colors cursor-pointer ${
              activeTab === 'help' ? 'bg-[#882434] text-white shadow-xs' : 'text-stone-700 hover:bg-stone-50'
            }`}
          >
            <HelpCircle className="w-4 h-4" />
            <span>Help & Concierge</span>
          </button>

          <div className="hidden lg:block pt-2 border-t border-stone-100 mt-2">
            <button
              onClick={() => {
                logout();
                showToast('You have been signed out.', 'info');
              }}
              className="w-full text-left px-4 py-2.5 rounded-2xl text-xs font-bold uppercase tracking-wider flex items-center gap-3 text-rose-700 hover:bg-rose-50 transition-colors cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Sign Out</span>
            </button>
          </div>
        </aside>

        {/* Content Area */}
        <main className="lg:col-span-9 bg-white p-6 sm:p-8 rounded-3xl border border-[#EAE4DA] shadow-xs min-h-[400px]">
          {/* ORDERS TAB */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Your Orders & Crafting Status
                </h3>
                <span className="text-xs text-stone-500">{orders.length} Total Orders</span>
              </div>

              {orders.length === 0 ? (
                <div className="text-center py-12 space-y-3">
                  <Package className="w-12 h-12 text-stone-300 mx-auto" />
                  <p className="text-sm font-semibold text-stone-700">No orders placed yet.</p>
                  <button
                    onClick={onExploreGifts}
                    className="px-5 py-2.5 rounded-xl bg-[#882434] text-white text-xs font-bold"
                  >
                    Start Gifting Now
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  {orders.map((ord) => (
                    <div
                      key={ord.id}
                      className="p-5 rounded-2xl border border-[#EAE4DA] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] transition-all space-y-4"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-200/60 pb-3">
                        <div>
                          <span className="text-xs font-bold text-stone-900 font-mono">
                            {ord.orderNumber}
                          </span>
                          <span className="text-stone-400 mx-2">•</span>
                          <span className="text-xs text-stone-500">{new Date(ord.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                        </div>

                        <div className="flex items-center gap-3">
                          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                            {ord.orderStatus}
                          </span>
                          <button
                            onClick={() => onTrackOrder(ord.orderNumber)}
                            className="text-xs font-bold text-[#882434] hover:underline flex items-center gap-1 cursor-pointer"
                          >
                            <span>Live Track</span>
                            <ExternalLink className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      {/* Order Items */}
                      <div className="space-y-3">
                        {ord.items.map((item) => (
                          <div key={item.id} className="flex items-center gap-4">
                            <img
                              src={item.personalization?.photoUrl || item.product.images[0]}
                              alt={item.product.name}
                              className="w-14 h-14 rounded-xl object-cover border border-stone-200"
                            />
                            <div className="flex-1 min-w-0">
                              <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                                {item.product.name}
                              </h4>
                              {item.personalization?.customTextLine1 && (
                                <p className="text-[11px] text-[#882434] font-medium truncate">
                                  "{item.personalization.customTextLine1}"
                                </p>
                              )}
                              <p className="text-[11px] text-stone-500">
                                Qty: {item.quantity} • {formatPrice(item.unitPrice)}
                              </p>
                            </div>
                            <span className="text-xs font-bold text-stone-900">
                              {formatPrice(item.totalPrice)}
                            </span>
                          </div>
                        ))}
                      </div>

                      <div className="flex items-center justify-between pt-3 border-t border-stone-200/60 text-xs">
                        <span className="text-stone-500">
                          Shipped to: {ord.shippingAddress.fullName}, {ord.shippingAddress.city}
                        </span>
                        <span className="font-bold text-stone-900">
                          Total: {formatPrice(ord.total)}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* PROFILE & REMINDERS TAB */}
          {activeTab === 'profile' && (
            <div className="space-y-6 max-w-xl">
              <h3 className="font-serif text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
                Personal Information & Milestone Dates
              </h3>

              <form onSubmit={handleProfileSave} className="space-y-4">
                <div>
                  <label className="text-xs font-bold text-stone-700 block mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={user.name}
                    className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden focus:border-[#882434]"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      disabled
                      className="w-full bg-stone-100 border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-medium text-stone-500 cursor-not-allowed"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-bold text-stone-700 block mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      defaultValue={user.phone}
                      className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2.5 text-xs font-medium focus:outline-hidden focus:border-[#882434]"
                    />
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100">
                  <h4 className="text-xs font-bold text-[#882434] uppercase tracking-wider mb-2">
                    Gifting Concierge Reminders
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">
                        Your Birthday
                      </label>
                      <input
                        type="date"
                        defaultValue={user.birthday}
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2 text-xs font-medium"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-stone-600 block mb-1">
                        Marriage / Love Anniversary
                      </label>
                      <input
                        type="date"
                        defaultValue={user.anniversary}
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-4 py-2 text-xs font-medium"
                      />
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="px-6 py-2.5 bg-[#882434] hover:bg-[#6E1B28] text-white rounded-xl text-xs font-bold transition-colors cursor-pointer"
                >
                  Save Profile Changes
                </button>
              </form>
            </div>
          )}

          {/* SAVED ADDRESSES TAB */}
          {activeTab === 'addresses' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Delivery Address Book
                </h3>
                <button
                  onClick={() => setShowAddAddressModal(true)}
                  className="flex items-center gap-1.5 px-3.5 py-2 bg-[#882434] text-white rounded-xl text-xs font-bold cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add New Address</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.savedAddresses.map((addr) => (
                  <div
                    key={addr.id}
                    className="p-5 rounded-2xl border border-[#EAE4DA] bg-[#FAF8F5]/60 hover:bg-[#FAF8F5] space-y-2 relative"
                  >
                    {addr.isDefault && (
                      <span className="text-[10px] uppercase font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full inline-block">
                        Default Delivery
                      </span>
                    )}
                    <h4 className="text-xs font-bold text-stone-900">{addr.fullName}</h4>
                    <p className="text-xs text-stone-600 leading-relaxed">
                      {addr.streetAddress}, {addr.landmark && `${addr.landmark}, `}
                      {addr.city}, {addr.state} - <strong>{addr.pincode}</strong>
                    </p>
                    <p className="text-xs text-stone-500">Phone: {addr.phone}</p>

                    <div className="pt-2 flex items-center justify-between">
                      <button
                        onClick={() => deleteAddress(addr.id)}
                        className="text-[11px] text-rose-600 hover:text-rose-800 flex items-center gap-1 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Add Address Modal */}
              {showAddAddressModal && (
                <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
                  <div className="bg-white rounded-3xl p-6 max-w-md w-full space-y-4">
                    <h4 className="font-serif text-lg font-bold text-stone-900">
                      Add New Delivery Address
                    </h4>
                    <form onSubmit={handleSaveAddress} className="space-y-3">
                      <input
                        type="text"
                        placeholder="Recipient Full Name"
                        value={newAddr.fullName}
                        onChange={(e) => setNewAddr({ ...newAddr, fullName: e.target.value })}
                        required
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                      />
                      <input
                        type="tel"
                        placeholder="Phone Number (10 digits)"
                        value={newAddr.phone}
                        onChange={(e) => setNewAddr({ ...newAddr, phone: e.target.value })}
                        required
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                      />
                      <input
                        type="text"
                        placeholder="Flat, House no., Building, Street"
                        value={newAddr.streetAddress}
                        onChange={(e) => setNewAddr({ ...newAddr, streetAddress: e.target.value })}
                        required
                        className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddr.city}
                          onChange={(e) => setNewAddr({ ...newAddr, city: e.target.value })}
                          required
                          className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                        />
                        <input
                          type="text"
                          placeholder="Pincode"
                          value={newAddr.pincode}
                          onChange={(e) => setNewAddr({ ...newAddr, pincode: e.target.value })}
                          required
                          className="w-full bg-[#FAF8F5] border border-stone-200 rounded-xl px-3 py-2 text-xs"
                        />
                      </div>
                      <div className="flex gap-2 pt-2">
                        <button
                          type="button"
                          onClick={() => setShowAddAddressModal(false)}
                          className="flex-1 py-2 rounded-xl bg-stone-100 text-stone-600 text-xs font-semibold"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="flex-1 py-2 rounded-xl bg-[#882434] text-white text-xs font-bold"
                        >
                          Save Address
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* SAVED DESIGNS TAB */}
          {activeTab === 'designs' && (
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
                Your Saved Customization Proofs
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {user.savedDesigns.map((des) => (
                  <div key={des.id} className="p-4 rounded-2xl border border-[#EAE4DA] bg-white flex gap-4 items-center">
                    <img
                      src={des.previewUrl}
                      alt={des.productTitle}
                      className="w-20 h-20 rounded-xl object-cover border border-stone-200 shrink-0"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-stone-900 line-clamp-1">{des.productTitle}</h4>
                      <p className="text-[11px] text-stone-500">Customized on {des.date}</p>
                      <button
                        onClick={onExploreGifts}
                        className="mt-2 text-xs font-bold text-[#882434] hover:underline"
                      >
                        Order Again →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* COUPONS TAB */}
          {activeTab === 'coupons' && (
            <div className="space-y-6">
              <h3 className="font-serif text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
                Your Available Promotional Vouchers
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {AVAILABLE_COUPONS.map((c) => (
                  <div
                    key={c.code}
                    className="p-5 rounded-2xl border border-dashed border-[#C59B27] bg-[#FDF9EE]/50 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-sm font-bold text-[#882434] bg-white px-2.5 py-0.5 rounded-lg border border-[#882434]/30">
                        {c.code}
                      </span>
                      <span className="text-[10px] font-semibold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Active
                      </span>
                    </div>
                    <p className="text-xs text-stone-700 font-medium">{c.description}</p>
                    <p className="text-[10px] text-stone-400">Valid until {c.expiryDate}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* HELP TAB */}
          {activeTab === 'help' && (
            <div className="space-y-4 max-w-xl">
              <h3 className="font-serif text-xl font-bold text-stone-900 pb-3 border-b border-stone-100">
                Customer Support & Gifting Concierge
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Need urgent modifications to your uploaded photo, changes in delivery address, or gift guidance?
              </p>
              <div className="p-4 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2 text-xs">
                <p><strong>WhatsApp Support:</strong> +91 8986613412 (Mon-Sat, 9:30 AM - 7:00 PM IST)</p>
                <p><strong>Email Concierge:</strong> care@impressivegifts.in</p>
                <p><strong>Replacement Assurance:</strong> 100% replacement in case of transit damage.</p>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};
