import React from 'react';
import { 
  Home, 
  ShoppingBag, 
  Sparkles, 
  Heart, 
  User, 
  Compass 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { useAuth } from '../../context/AuthContext';

interface MobileBottomNavProps {
  currentView: string;
  setCurrentView: (view: string) => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  setCurrentView,
}) => {
  const { cartCount, wishlistCount, setIsCartDrawerOpen } = useShop();
  const { isLoggedIn, user } = useAuth();

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Do not render bottom bar if in admin dashboard or on product detail page
  if (currentView === 'admin' || currentView === 'product') return null;

  return (
    <aside 
      aria-label="Mobile Navigation"
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 bg-white/95 backdrop-blur-md border-t border-[#EAE4DA] shadow-[0_-4px_20px_rgba(0,0,0,0.06)] pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 items-center h-16 max-w-md mx-auto px-2">
        {/* 1. Home */}
        <button
          onClick={() => handleNavigate('home')}
          className={`flex flex-col items-center justify-center gap-1 py-1.5 transition-colors cursor-pointer ${
            currentView === 'home' ? 'text-[#882434]' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Home"
        >
          <Home className={`w-5 h-5 ${currentView === 'home' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] tracking-tight ${currentView === 'home' ? 'font-bold' : 'font-medium'}`}>
            Home
          </span>
        </button>

        {/* 2. Shop */}
        <button
          onClick={() => handleNavigate('shop')}
          className={`flex flex-col items-center justify-center gap-1 py-1.5 transition-colors cursor-pointer ${
            currentView === 'shop' || currentView === 'product' ? 'text-[#882434]' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Shop Gifts"
        >
          <Compass className={`w-5 h-5 ${currentView === 'shop' ? 'stroke-[2.5]' : 'stroke-2'}`} />
          <span className={`text-[10px] tracking-tight ${currentView === 'shop' ? 'font-bold' : 'font-medium'}`}>
            Shop
          </span>
        </button>

        {/* 3. Custom Studio (Center Featured Button) */}
        <button
          onClick={() => handleNavigate('custom-builder')}
          className="flex flex-col items-center justify-center relative -top-3 cursor-pointer group"
          aria-label="Custom Gift Studio"
        >
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-[#9E2A3C] via-[#882434] to-[#6E1B28] text-white flex items-center justify-center shadow-lg shadow-[#882434]/30 ring-4 ring-white group-active:scale-95 transition-transform">
            <Sparkles className="w-5 h-5 text-[#F5D061] group-hover:rotate-12 transition-transform" />
          </div>
          <span className="text-[10px] font-bold text-[#882434] tracking-tight mt-0.5">
            Studio
          </span>
        </button>

        {/* 4. Wishlist */}
        <button
          onClick={() => handleNavigate('wishlist')}
          className={`flex flex-col items-center justify-center gap-1 py-1.5 transition-colors cursor-pointer relative ${
            currentView === 'wishlist' ? 'text-[#882434]' : 'text-stone-500 hover:text-stone-800'
          }`}
          aria-label="Wishlist"
        >
          <div className="relative">
            <Heart className={`w-5 h-5 ${currentView === 'wishlist' ? 'fill-[#882434] stroke-[#882434]' : 'stroke-2'}`} />
            {wishlistCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#882434] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {wishlistCount}
              </span>
            )}
          </div>
          <span className={`text-[10px] tracking-tight ${currentView === 'wishlist' ? 'font-bold' : 'font-medium'}`}>
            Wishlist
          </span>
        </button>

        {/* 5. Cart (Opens Cart Drawer) */}
        <button
          onClick={() => setIsCartDrawerOpen(true)}
          className="flex flex-col items-center justify-center gap-1 py-1.5 transition-colors cursor-pointer relative text-stone-500 hover:text-[#882434]"
          aria-label="Cart"
        >
          <div className="relative">
            <ShoppingBag className="w-5 h-5 stroke-2" />
            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-2 bg-[#F5D061] text-[#701825] text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center ring-2 ring-white">
                {cartCount}
              </span>
            )}
          </div>
          <span className="text-[10px] font-medium tracking-tight">
            Cart
          </span>
        </button>
      </div>
    </aside>
  );
};
