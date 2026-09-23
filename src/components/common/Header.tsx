import React, { useState } from 'react';
import { 
  Search, 
  Heart, 
  ShoppingBag, 
  User, 
  Gift, 
  Menu, 
  X, 
  ChevronDown, 
  ShieldCheck, 
  Sparkles,
  LayoutDashboard,
  Percent,
  Compass,
  PhoneCall
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';
import { CATEGORIES } from '../../data/categories';
import { OCCASIONS } from '../../data/occasions';

interface HeaderProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  onSelectCategory?: (catId: string) => void;
  onSelectOccasion?: (occId: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  onSelectCategory,
  onSelectOccasion,
}) => {
  const { 
    cartCount, 
    wishlistCount, 
    setIsCartDrawerOpen, 
    setIsSearchOpen, 
    setIsGiftFinderOpen 
  } = useShop();
  const { user, isLoggedIn } = useAuth();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<'categories' | 'occasions' | null>(null);

  const handleNavClick = (view: string) => {
    setCurrentView(view);
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCategoryClick = (catId: string) => {
    if (onSelectCategory) onSelectCategory(catId);
    setCurrentView('shop');
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOccasionClick = (occId: string) => {
    if (onSelectOccasion) onSelectOccasion(occId);
    setCurrentView('shop');
    setIsMobileMenuOpen(false);
    setActiveDropdown(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-[#FAF8F5]/95 backdrop-blur-md border-b border-[#EAE4DA] shadow-xs">
      {/* 1. Top Announcement Bar */}
      <div className="bg-[#882434] text-[#FAF8F5] text-xs py-2 px-4 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between font-medium">
          <div className="hidden md:flex items-center gap-2 opacity-90 text-[11px] tracking-wider uppercase font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-[#F5D061]" />
            <span>Handcrafted In India</span>
            <span className="mx-2">•</span>
            <span>Express Dispatch In 24h</span>
          </div>

          <div className="w-full md:w-auto text-center flex items-center justify-center gap-2">
            <span>Make Every Gift Personal ❤️</span>
            <span className="hidden sm:inline">|</span>
            <span className="text-[#F5D061] font-semibold">Free Shipping on Orders over ₹999</span>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:inline opacity-85">Use Code <strong className="underline decoration-[#F5D061] tracking-wide">FIRST10</strong></span>
          </div>

          <div className="hidden lg:flex items-center gap-4 text-[11px]">
            {isLoggedIn ? (
              <button 
                onClick={() => handleNavClick('account')}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-[#F5D061] font-medium"
              >
                <User className="w-3 h-3" />
                <span>Hi, {user.name.split(' ')[0]}</span>
              </button>
            ) : (
              <button 
                onClick={() => handleNavClick('account')}
                className="flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-white/10 hover:bg-white/20 transition-colors cursor-pointer text-[#F5D061] font-semibold"
              >
                <User className="w-3 h-3" />
                <span>Customer Sign In / Register</span>
              </button>
            )}
            <button 
              onClick={() => handleNavClick('track-order')}
              className="hover:text-[#F5D061] transition-colors cursor-pointer"
            >
              Track Order
            </button>
          </div>
        </div>
      </div>

      {/* 2. Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Mobile menu trigger */}
          <div className="flex items-center lg:hidden">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 -ml-2 text-stone-700 hover:text-[#882434] transition-colors focus:outline-hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-2 text-stone-700 hover:text-[#882434] ml-1"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo & Wordmark */}
          <div className="flex-1 lg:flex-initial flex items-center justify-center lg:justify-start">
            <button
              onClick={() => handleNavClick('home')}
              className="group flex items-center gap-3 text-left cursor-pointer focus:outline-hidden"
            >
              {/* Luxury Gift Icon Emblem */}
              <div className="w-11 h-11 rounded-xl bg-linear-to-br from-[#9E2A3C] via-[#882434] to-[#6E1B28] p-0.5 shadow-md flex items-center justify-center group-hover:scale-105 transition-transform duration-300">
                <div className="w-full h-full rounded-[10px] bg-linear-to-br from-[#882434] to-[#5C1622] flex items-center justify-center relative overflow-hidden border border-[#D4AF37]/30">
                  <Gift className="w-5 h-5 text-[#FAF8F5] drop-shadow-sm group-hover:rotate-6 transition-transform" />
                  <div className="absolute -top-3 -right-3 w-6 h-6 bg-[#F5D061]/20 rounded-full blur-xs" />
                </div>
              </div>

              <div>
                <div className="flex items-center gap-1.5">
                  <span className="font-serif text-2xl sm:text-[26px] font-bold tracking-tight text-[#1E1E1E] group-hover:text-[#882434] transition-colors">
                    Impressive<span className="text-[#882434]">Gifts</span>
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-widest text-[#C59B27] bg-[#FDF9EE] px-1.5 py-0.5 rounded border border-[#E5BE53]/40">
                    Luxe
                  </span>
                </div>
                <p className="text-[10px] tracking-widest uppercase font-medium text-stone-500 hidden sm:block">
                  Personalized • Handcrafted • Emotional
                </p>
              </div>
            </button>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden lg:flex flex-1 max-w-md mx-8">
            <div 
              onClick={() => setIsSearchOpen(true)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-white border border-[#EAE4DA] rounded-full text-stone-400 hover:border-[#882434]/40 hover:shadow-xs transition-all cursor-pointer group"
            >
              <div className="flex items-center gap-3">
                <Search className="w-4 h-4 text-stone-400 group-hover:text-[#882434] transition-colors" />
                <span className="text-xs text-stone-500 font-normal">
                  Search personalized mugs, frames, lamps, occasions...
                </span>
              </div>
              <kbd className="hidden xl:inline-block text-[10px] bg-stone-100 text-stone-500 px-2 py-0.5 rounded border border-stone-200">
                ⌘K
              </kbd>
            </div>
          </div>

          {/* Action Icons */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Interactive Gift Finder Button */}
            <button
              onClick={() => setIsGiftFinderOpen(true)}
              className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#FDF9EE] border border-[#C59B27]/40 text-[#882434] hover:bg-[#F9F0D8] transition-all text-xs font-semibold shadow-2xs group cursor-pointer"
            >
              <Compass className="w-3.5 h-3.5 text-[#C59B27] group-hover:rotate-45 transition-transform" />
              <span>Gift Finder</span>
            </button>

            {/* Wishlist */}
            <button
              onClick={() => handleNavClick('wishlist')}
              className="relative p-2.5 text-stone-700 hover:text-[#882434] hover:bg-stone-100/70 rounded-full transition-all cursor-pointer"
              aria-label="Wishlist"
            >
              <Heart className="w-5 h-5" />
              {wishlistCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-[#882434] text-white text-[10px] font-bold rounded-full flex items-center justify-center ring-2 ring-white animate-pulse-subtle">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Customer Account / Sign In */}
            <button
              onClick={() => handleNavClick('account')}
              className="relative flex items-center gap-1.5 p-2 text-stone-700 hover:text-[#882434] hover:bg-stone-100/70 rounded-full transition-all cursor-pointer"
              aria-label="Customer Account"
              title={isLoggedIn ? `Customer Account: ${user.name}` : 'Customer Sign In / Register'}
            >
              <User className="w-5 h-5" />
              <span className="text-xs font-semibold hidden md:inline text-stone-700">
                {isLoggedIn ? user.name.split(' ')[0] : 'Sign In'}
              </span>
            </button>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartDrawerOpen(true)}
              className="relative flex items-center gap-2 py-2 px-3 bg-[#882434] hover:bg-[#701825] text-white rounded-full shadow-xs hover:shadow-md transition-all cursor-pointer group"
              aria-label="Shopping Cart"
            >
              <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform" />
              <span className="text-xs font-semibold hidden sm:inline">Cart</span>
              <span className="w-5 h-5 bg-[#F5D061] text-[#701825] text-[11px] font-bold rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>
          </div>
        </div>

        {/* 3. Desktop Navigation Bar with Mega-Menus */}
        <nav className="hidden lg:flex items-center justify-between border-t border-[#EAE4DA]/60 py-3 text-sm font-medium text-stone-700">
          <div className="flex items-center gap-7">
            <button
              onClick={() => handleNavClick('home')}
              className={`hover:text-[#882434] transition-colors cursor-pointer ${
                currentView === 'home' ? 'text-[#882434] font-semibold' : ''
              }`}
            >
              Home
            </button>

            <button
              onClick={() => handleNavClick('shop')}
              className={`hover:text-[#882434] transition-colors cursor-pointer ${
                currentView === 'shop' ? 'text-[#882434] font-semibold' : ''
              }`}
            >
              Shop All Gifts
            </button>

            {/* Categories Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('categories')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('shop')}
                className="flex items-center gap-1 hover:text-[#882434] transition-colors cursor-pointer py-1"
              >
                <span>Categories</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'categories' ? 'rotate-180 text-[#882434]' : ''}`} />
              </button>

              {activeDropdown === 'categories' && (
                <div className="absolute top-full left-0 w-[580px] bg-white rounded-2xl shadow-xl border border-[#EAE4DA] p-5 grid grid-cols-3 gap-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {CATEGORIES.map(cat => (
                    <button
                      key={cat.id}
                      onClick={() => handleCategoryClick(cat.id)}
                      className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#FAF8F5] transition-all text-left group cursor-pointer"
                    >
                      <img 
                        src={cat.imageUrl} 
                        alt={cat.name} 
                        className="w-10 h-10 rounded-lg object-cover group-hover:scale-105 transition-transform" 
                      />
                      <div>
                        <div className="text-xs font-semibold text-stone-800 group-hover:text-[#882434] transition-colors">
                          {cat.name}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          {cat.itemCount}+ gifts
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Occasions Dropdown */}
            <div 
              className="relative"
              onMouseEnter={() => setActiveDropdown('occasions')}
              onMouseLeave={() => setActiveDropdown(null)}
            >
              <button
                onClick={() => handleNavClick('shop')}
                className="flex items-center gap-1 hover:text-[#882434] transition-colors cursor-pointer py-1"
              >
                <span>Occasions</span>
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${activeDropdown === 'occasions' ? 'rotate-180 text-[#882434]' : ''}`} />
              </button>

              {activeDropdown === 'occasions' && (
                <div className="absolute top-full left-0 w-[520px] bg-white rounded-2xl shadow-xl border border-[#EAE4DA] p-5 grid grid-cols-2 gap-3 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                  {OCCASIONS.map(occ => (
                    <button
                      key={occ.id}
                      onClick={() => handleOccasionClick(occ.id)}
                      className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-[#FAF8F5] transition-all text-left group cursor-pointer"
                    >
                      <img 
                        src={occ.imageUrl} 
                        alt={occ.title} 
                        className="w-11 h-11 rounded-lg object-cover group-hover:scale-105 transition-transform" 
                      />
                      <div>
                        <div className="text-xs font-semibold text-stone-800 group-hover:text-[#882434] transition-colors">
                          {occ.title}
                        </div>
                        <div className="text-[10px] text-stone-500 line-clamp-1">
                          {occ.subtitle}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button
              onClick={() => handleNavClick('custom-builder')}
              className="flex items-center gap-1.5 text-[#882434] font-semibold hover:text-[#6E1B28] transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Personalized Gift Studio</span>
            </button>

            <button
              onClick={() => handleNavClick('corporate')}
              className="hover:text-[#882434] transition-colors cursor-pointer"
            >
              Corporate Gifting
            </button>

            <button
              onClick={() => handleNavClick('offers')}
              className="flex items-center gap-1 text-amber-700 hover:text-amber-800 transition-colors cursor-pointer font-medium"
            >
              <Percent className="w-3.5 h-3.5" />
              <span>Offers & Deals</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs font-medium text-stone-500">
            <span className="flex items-center gap-1 text-emerald-700">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              100% Satisfaction Guarantee
            </span>
          </div>
        </nav>
      </div>

      {/* 4. Mobile Navigation Drawer */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-full bg-white border-b border-[#EAE4DA] shadow-xl max-h-[80vh] overflow-y-auto z-50 animate-in slide-in-from-top-4 duration-200">
          <div className="p-4 space-y-4">
            <div className="grid grid-cols-2 gap-2 pb-2">
              <button
                onClick={() => {
                  setIsGiftFinderOpen(true);
                  setIsMobileMenuOpen(false);
                }}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#FDF9EE] border border-[#C59B27]/40 text-[#882434] font-medium text-xs"
              >
                <Compass className="w-4 h-4 text-[#C59B27]" />
                <span>Gift Finder</span>
              </button>

              <button
                onClick={() => handleNavClick('custom-builder')}
                className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-[#882434]/10 border border-[#882434]/30 text-[#882434] font-medium text-xs"
              >
                <Sparkles className="w-4 h-4 text-[#882434]" />
                <span>Custom Studio</span>
              </button>
            </div>

            <div className="border-t border-stone-100 pt-3 space-y-1">
              <button
                onClick={() => handleNavClick('home')}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-stone-50"
              >
                Home
              </button>
              <button
                onClick={() => handleNavClick('shop')}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-stone-50"
              >
                All Products
              </button>
              <button
                onClick={() => handleNavClick('corporate')}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-stone-50"
              >
                Corporate Gifting
              </button>
              <button
                onClick={() => handleNavClick('offers')}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-stone-50"
              >
                Exclusive Offers
              </button>
              <button
                onClick={() => handleNavClick('track-order')}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-medium hover:bg-stone-50 text-[#882434]"
              >
                Track Your Order
              </button>
              <button
                onClick={() => handleNavClick('account')}
                className="w-full text-left py-2 px-3 rounded-lg text-sm font-semibold hover:bg-stone-50 text-[#882434] flex items-center justify-between"
              >
                <span>{isLoggedIn ? `My Account (${user.name.split(' ')[0]})` : 'Customer Sign In / Register'}</span>
                <User className="w-4 h-4 text-[#882434]" />
              </button>
            </div>

            <div className="border-t border-stone-100 pt-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400 mb-2 px-3">
                Popular Categories
              </h4>
              <div className="grid grid-cols-2 gap-2">
                {CATEGORIES.slice(0, 8).map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => handleCategoryClick(cat.id)}
                    className="flex items-center gap-2 p-2 rounded-lg bg-stone-50 hover:bg-stone-100 text-left text-xs"
                  >
                    <img src={cat.imageUrl} alt={cat.name} className="w-7 h-7 rounded object-cover" />
                    <span className="font-medium text-stone-800 line-clamp-1">{cat.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
