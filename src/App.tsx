import React, { useState, useEffect } from 'react';
import { 
  MessageCircle, 
  ArrowUp, 
  Sparkles, 
  Heart, 
  ShoppingBag, 
  HelpCircle 
} from 'lucide-react';
import { ShopProvider, useShop } from './context/ShopContext';
import { AdminProvider, useAdmin } from './context/AdminContext';
import { AuthProvider } from './context/AuthContext';

import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { ToastContainer } from './components/common/ToastContainer';
import { CartDrawer } from './components/common/CartDrawer';
import { QuickViewModal } from './components/common/QuickViewModal';
import { CompareModal } from './components/common/CompareModal';
import { SmartSearchModal } from './components/smart/SmartSearchModal';
import { GiftFinderModal } from './components/smart/GiftFinderModal';
import { CorporateQuoteModal } from './components/corporate/CorporateQuoteModal';
import { MobileBottomNav } from './components/common/MobileBottomNav';

import { HomePage } from './pages/HomePage';
import { ShopPage } from './pages/ShopPage';
import { ProductDetailPage } from './pages/ProductDetailPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { OrderSuccessPage } from './pages/OrderSuccessPage';
import { TrackOrderPage } from './pages/TrackOrderPage';
import { AccountPage } from './pages/AccountPage';
import { WishlistPage } from './pages/WishlistPage';
import { CustomBuilderPage } from './pages/CustomBuilderPage';
import { CorporatePage } from './pages/CorporatePage';
import { OffersPage } from './pages/OffersPage';
import { AdminDashboard } from './pages/admin/AdminDashboard';

import { Product, Order, CategoryId, OccasionId } from './types';

const MainAppContent: React.FC = () => {
  const { products } = useAdmin();
  const { showToast } = useShop();

  // Helper to detect admin route
  const checkIsAdminRoute = () => {
    const cleanPath = window.location.pathname.toLowerCase().replace(/\/+$/, '');
    const cleanHash = window.location.hash.toLowerCase();
    return cleanHash === '#admin' || cleanPath === '/admin';
  };

  // Navigation State
  const [currentView, setCurrentView] = useState<string>(() => {
    if (checkIsAdminRoute()) {
      return 'admin';
    }
    return 'home';
  });
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(products[0] || null);
  const [activeCategoryFilter, setActiveCategoryFilter] = useState<CategoryId | null>(null);
  const [activeOccasionFilter, setActiveOccasionFilter] = useState<OccasionId | null>(null);
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [trackOrderId, setTrackOrderId] = useState<string>('');

  // Modals
  const [isCorporateQuoteOpen, setIsCorporateQuoteOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  // Sync hash and pathname changes (e.g., direct navigation to /admin or #admin)
  useEffect(() => {
    const handleRouteChange = () => {
      if (checkIsAdminRoute()) {
        setCurrentView('admin');
      }
    };
    window.addEventListener('hashchange', handleRouteChange);
    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('hashchange', handleRouteChange);
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  // Monitor scroll for back-to-top button
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    setCurrentView('product');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateCategory = (catId: CategoryId) => {
    setActiveCategoryFilter(catId);
    setActiveOccasionFilter(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNavigateOccasion = (occId: OccasionId) => {
    setActiveOccasionFilter(occId);
    setActiveCategoryFilter(null);
    setCurrentView('shop');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOrderSuccess = (order: Order) => {
    setCompletedOrder(order);
    setCurrentView('order-success');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleTrackOrderFromAnywhere = (orderId: string) => {
    setTrackOrderId(orderId);
    setCurrentView('track-order');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openWhatsAppSupport = () => {
    const message = encodeURIComponent(
      "Hello ImpressiveGifts concierge! ❤️ I'm browsing your personalized gifts collection and would love assistance with my order."
    );
    window.open(`https://wa.me/918986613412?text=${message}`, '_blank');
  };

  // Keyboard shortcut: Cmd+K / Ctrl+K opens search
  const { setIsSearchOpen } = useShop();
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setIsSearchOpen]);

  // If in Admin Console
  if (currentView === 'admin') {
    return (
      <AdminDashboard onBackToStore={() => {
        window.history.pushState(null, '', '/');
        window.location.hash = '';
        setCurrentView('home');
      }} />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF8F5] text-[#1E1E1E] w-full max-w-full overflow-x-hidden">
      {/* 1. Header */}
      <Header
        currentView={currentView}
        setCurrentView={setCurrentView}
        onSelectCategory={(catId) => handleNavigateCategory(catId as CategoryId)}
        onSelectOccasion={(occId) => handleNavigateOccasion(occId as OccasionId)}
      />

      {/* 2. Main Page Views */}
      <main className="flex-1 pb-20 lg:pb-0 w-full max-w-full overflow-x-hidden">
        {currentView === 'home' && (
          <HomePage
            products={products}
            onSelectProduct={handleSelectProduct}
            onNavigateCategory={handleNavigateCategory}
            onNavigateOccasion={handleNavigateOccasion}
            onExploreAll={() => {
              setActiveCategoryFilter(null);
              setActiveOccasionFilter(null);
              setCurrentView('shop');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenCorporateQuote={() => setIsCorporateQuoteOpen(true)}
          />
        )}

        {currentView === 'shop' && (
          <ShopPage
            products={products}
            onSelectProduct={handleSelectProduct}
            initialCategory={activeCategoryFilter}
            initialOccasion={activeOccasionFilter}
          />
        )}

        {currentView === 'product' && selectedProduct && (
          <ProductDetailPage
            product={selectedProduct}
            allProducts={products}
            onSelectProduct={handleSelectProduct}
            onProceedToCheckout={() => setCurrentView('checkout')}
            onBackToShop={() => setCurrentView('shop')}
          />
        )}

        {currentView === 'cart' && (
          <CartPage
            onProceedToCheckout={() => setCurrentView('checkout')}
            onContinueShopping={() => setCurrentView('shop')}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutPage
            onOrderSuccess={handleOrderSuccess}
            onBackToCart={() => setCurrentView('cart')}
          />
        )}

        {currentView === 'order-success' && completedOrder && (
          <OrderSuccessPage
            order={completedOrder}
            onTrackOrder={handleTrackOrderFromAnywhere}
            onContinueShopping={() => setCurrentView('shop')}
          />
        )}

        {currentView === 'track-order' && (
          <TrackOrderPage
            initialOrderId={trackOrderId}
            onSelectProduct={handleSelectProduct}
          />
        )}

        {currentView === 'account' && (
          <AccountPage
            onTrackOrder={handleTrackOrderFromAnywhere}
            onSelectProduct={handleSelectProduct}
            onExploreGifts={() => setCurrentView('shop')}
          />
        )}

        {currentView === 'wishlist' && (
          <WishlistPage
            products={products}
            onSelectProduct={handleSelectProduct}
            onExploreGifts={() => setCurrentView('shop')}
          />
        )}

        {currentView === 'custom-builder' && (
          <CustomBuilderPage
            products={products}
            onBackToShop={() => setCurrentView('shop')}
          />
        )}

        {currentView === 'corporate' && (
          <CorporatePage
            products={products}
            onSelectProduct={handleSelectProduct}
            onOpenQuoteModal={() => setIsCorporateQuoteOpen(true)}
          />
        )}

        {currentView === 'offers' && (
          <OffersPage
            onExploreGifts={() => setCurrentView('shop')}
          />
        )}
      </main>

      {/* 3. Footer */}
      <Footer
        setCurrentView={setCurrentView}
        onSelectCategory={(catId) => handleNavigateCategory(catId as CategoryId)}
        onSelectOccasion={(occId) => handleNavigateOccasion(occId as OccasionId)}
      />

      {/* 4. Global Modals & Drawers */}
      <CartDrawer
        onProceedToCheckout={() => setCurrentView('checkout')}
        onContinueShopping={() => setCurrentView('shop')}
      />

      <QuickViewModal
        onSelectProduct={handleSelectProduct}
      />

      <CompareModal
        onSelectProduct={handleSelectProduct}
      />

      <SmartSearchModal
        products={products}
        onSelectProduct={handleSelectProduct}
        onNavigateCategory={(catId) => handleNavigateCategory(catId as CategoryId)}
      />

      <GiftFinderModal
        products={products}
        onSelectProduct={handleSelectProduct}
      />

      <CorporateQuoteModal
        isOpen={isCorporateQuoteOpen}
        onClose={() => setIsCorporateQuoteOpen(false)}
      />

      <ToastContainer />

      {/* 5. Mobile & Tablet Bottom Navigation Bar */}
      <MobileBottomNav
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      {/* 6. Floating Action Buttons (WhatsApp Concierge + Back to Top) */}
      <div className="fixed bottom-20 sm:bottom-22 lg:bottom-6 left-4 sm:left-6 z-40 flex flex-col gap-3">
        <button
          onClick={openWhatsAppSupport}
          className="w-12 h-12 rounded-full bg-[#25D366] hover:bg-[#1EBE5D] text-white flex items-center justify-center shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer group"
          title="Chat with Personal Gifting Concierge on WhatsApp"
        >
          <MessageCircle className="w-6 h-6 fill-white" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap text-xs font-bold px-0 group-hover:px-2">
            Chat on WhatsApp
          </span>
        </button>
      </div>

      {showBackToTop && (
        <div className="fixed bottom-20 sm:bottom-22 lg:bottom-6 right-4 sm:right-6 z-40">
          <button
            onClick={scrollToTop}
            className="w-10 h-10 rounded-full bg-stone-900/80 hover:bg-[#882434] text-white backdrop-blur-xs flex items-center justify-center shadow-md transition-all cursor-pointer"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export function App() {
  return (
    <AuthProvider>
      <AdminProvider>
        <ShopProvider>
          <MainAppContent />
        </ShopProvider>
      </AdminProvider>
    </AuthProvider>
  );
}

export default App;
