import React, { useState } from 'react';
import { 
  Sparkles, 
  ArrowRight, 
  Star, 
  ShieldCheck, 
  Truck, 
  Clock, 
  Heart, 
  Gift, 
  Building2, 
  Upload, 
  CheckCircle2, 
  Eye, 
  ChevronRight,
  Camera,
  ShoppingBag,
  Award
} from 'lucide-react';

import { Product, OccasionId, CategoryId } from '../types';
import { CATEGORIES } from '../data/categories';
import { OCCASIONS } from '../data/occasions';
import { CUSTOMER_REVIEWS } from '../data/reviews';
import { ProductCard } from '../components/common/ProductCard';
import { MiniGiftBuilder } from '../components/personalizer/MiniGiftBuilder';
import { useShop } from '../context/ShopContext';

interface HomePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateCategory: (catId: CategoryId) => void;
  onNavigateOccasion: (occId: OccasionId) => void;
  onExploreAll: () => void;
  onOpenCorporateQuote: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({
  products,
  onSelectProduct,
  onNavigateCategory,
  onNavigateOccasion,
  onExploreAll,
  onOpenCorporateQuote,
}) => {
  const { showToast } = useShop();

  const [activeTrendingTab, setActiveTrendingTab] = useState<'all' | 'couples' | 'bestsellers' | 'express'>('all');
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  // Filter trending products by tab
  const filteredTrending = products.filter(p => {
    if (activeTrendingTab === 'couples') {
      return p.occasions.includes('anniversary') || p.occasions.includes('valentines');
    }
    if (activeTrendingTab === 'bestsellers') {
      return p.badge === 'Bestseller';
    }
    if (activeTrendingTab === 'express') {
      return p.isExpressAvailable;
    }
    return true;
  }).slice(0, 8);

  const bestsellers = products.filter(p => p.badge === 'Bestseller' || p.rating >= 4.9).slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail || !newsletterEmail.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Congratulations! Coupon FIRST10 applied to your account.', 'success');
  };

  const instagramPosts = [
    {
      img: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop',
      user: '@ananya_lifestyle',
      caption: 'The acrylic Spotify lamp turned out better than I dreamed! ✨ #ImpressiveGiftsMoments',
    },
    {
      img: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=600&auto=format&fit=crop',
      user: '@rohan_explore',
      caption: 'Surprised mom with the magic mug on her 50th birthday! ☕❤️',
    },
    {
      img: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=600&auto=format&fit=crop',
      user: '@kavya_interiors',
      caption: 'Our wedding photo engraved in natural teakwood. Pure craftsmanship.',
    },
    {
      img: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=600&auto=format&fit=crop',
      user: '@dev_fitness',
      caption: 'Smart temperature flask with my name laser etched. In love!',
    },
  ];

  return (
    <div className="space-y-16 sm:space-y-20 pb-16 w-full max-w-full overflow-x-hidden">
      {/* 1. HERO SECTION */}
      <section className="relative overflow-hidden bg-linear-to-b from-[#FAF8F5] via-[#FFFDFB] to-[#F3EFEA] pt-8 pb-16 sm:py-20 lg:py-24 border-b border-[#EAE4DA]">
        {/* Subtle Decorative Elements */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-[#882434]/5 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#C59B27]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              {/* Luxury Badge */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#FDF9EE] border border-[#C59B27]/40 shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
                <span className="text-xs font-semibold text-[#882434] tracking-wide uppercase">
                  India’s #1 Personalized Gifting Studio
                </span>
              </div>

              {/* Main Headline */}
              <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#1E1E1E] leading-[1.12] tracking-tight">
                Make Every Gift <br className="hidden sm:inline" />
                <span className="text-[#882434] relative inline-block">
                  Unforgettable
                  <svg className="absolute -bottom-2 inset-x-0 w-full text-[#C59B27]/40" height="8" viewBox="0 0 200 8" fill="none">
                    <path d="M1 5.5C40 2.5 120 1.5 199 5.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round"/>
                  </svg>
                </span>
              </h1>

              {/* Subheadline */}
              <p className="text-base sm:text-lg text-stone-600 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Personalized gifts made specially for the people who matter. Upload your moments, customize heartfelt notes, and create laser-crafted keepsakes that spark tears of joy.
              </p>

              {/* Primary & Secondary CTAs */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
                <button
                  onClick={onExploreAll}
                  className="w-full sm:w-auto px-8 py-4 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-sm font-bold uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg hover:shadow-xl transition-all cursor-pointer group"
                >
                  <Sparkles className="w-4 h-4 text-[#F5D061] group-hover:rotate-12 transition-transform" />
                  <span>Shop Personalized Gifts</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => {
                    const el = document.getElementById('bestsellers-section');
                    el?.scrollIntoView({ behavior: 'smooth' });
                  }}
                  className="w-full sm:w-auto px-7 py-4 rounded-xl border border-stone-300 hover:border-stone-800 bg-white/80 hover:bg-white text-stone-800 text-sm font-semibold transition-all cursor-pointer shadow-2xs"
                >
                  Explore Bestsellers
                </button>
              </div>

              {/* Micro Trust Proofs */}
              <div className="pt-6 grid grid-cols-3 gap-2 sm:gap-4 border-t border-stone-200/80 max-w-lg mx-auto lg:mx-0 text-left">
                <div className="space-y-0.5">
                  <div className="text-lg sm:text-2xl font-bold font-serif text-stone-900">
                    50,000+
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium">Happy Smiles Delivered</div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-lg sm:text-2xl font-bold font-serif text-stone-900 flex items-center gap-1">
                    4.9 <Star className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-amber-400 text-amber-400 inline" />
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium">Customer Rating</div>
                </div>

                <div className="space-y-0.5">
                  <div className="text-lg sm:text-2xl font-bold font-serif text-stone-900">
                    24h
                  </div>
                  <div className="text-[10px] sm:text-[11px] text-stone-500 font-medium">Fast Dispatch Promise</div>
                </div>
              </div>
            </div>

            {/* Right Lifestyle Visual Banner */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md lg:max-w-none">
                {/* Main Hero Card */}
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-stone-100">
                  <img
                    src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"
                    alt="ImpressiveGifts personalized gifting experience"
                    className="w-full aspect-4/5 object-cover hover:scale-103 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-linear-to-t from-stone-900/70 via-transparent to-transparent" />

                  {/* Floating Product Spotlight on Hero */}
                  <div className="absolute bottom-5 inset-x-5 p-4 rounded-2xl bg-white/95 backdrop-blur-md shadow-xl border border-white/60 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <img
                        src="https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=200&auto=format&fit=crop"
                        alt="Spotify Plaque"
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                      <div>
                        <div className="text-xs font-bold text-stone-900 line-clamp-1">
                          Custom Spotify LED Plaque
                        </div>
                        <div className="text-[11px] text-emerald-700 font-semibold">
                          ₹999 • 50% OFF Today
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={() => onSelectProduct(products[0])}
                      className="px-3 py-1.5 rounded-lg bg-[#882434] text-white text-[11px] font-bold uppercase tracking-wider hover:bg-[#6E1B28] cursor-pointer"
                    >
                      Personalize
                    </button>
                  </div>
                </div>

                {/* Floating Heartfelt Testimonial Badge */}
                <div className="absolute top-2 left-2 sm:-top-4 sm:-left-6 bg-white p-2.5 sm:p-3 rounded-2xl shadow-xl border border-stone-200/80 flex items-center gap-2 sm:gap-2.5 max-w-[190px] sm:max-w-[200px] animate-pulse-subtle">
                  <div className="w-8 h-8 rounded-full bg-[#882434]/10 text-[#882434] flex items-center justify-center shrink-0">
                    <Heart className="w-4 h-4 fill-[#882434]" />
                  </div>
                  <div className="text-[10px] text-stone-700 font-medium leading-tight">
                    "My husband loved the engraved watch!"
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SHOP BY OCCASION */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-[#882434] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Gift className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Memorable Milestones</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
              Shop by Occasion
            </h2>
          </div>
          <button
            onClick={onExploreAll}
            className="text-xs sm:text-sm font-semibold text-[#882434] hover:text-[#6E1B28] flex items-center gap-1 group cursor-pointer"
          >
            <span>View All Occasions</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* 10 Occasions Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-4">
          {OCCASIONS.map((occ) => (
            <div
              key={occ.id}
              onClick={() => onNavigateOccasion(occ.id)}
              className="luxury-card rounded-2xl overflow-hidden cursor-pointer group relative aspect-3/4 flex flex-col justify-end p-4 border border-[#EAE4DA]"
            >
              <img
                src={occ.imageUrl}
                alt={occ.title}
                loading="lazy"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?q=80&w=800&auto=format&fit=crop';
                }}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-linear-to-t from-stone-950/85 via-stone-900/30 to-transparent" />

              <div className="relative z-10 space-y-1">
                <span className="text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#C59B27] text-stone-900 inline-block">
                  {occ.badge}
                </span>
                <h3 className="font-serif text-sm sm:text-base font-bold text-white leading-tight">
                  {occ.title}
                </h3>
                <p className="text-[10px] text-stone-300 line-clamp-1 opacity-90 hidden sm:block">
                  {occ.subtitle}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. SHOP BY CATEGORY */}
      <section className="bg-[#FAF8F5] py-14 border-y border-[#EAE4DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
              Curated Gift Categories
            </h2>
            <p className="text-xs sm:text-sm text-stone-500">
              From color-changing magic mugs to solid teakwood photo frames
            </p>
          </div>

          {/* 12 Categories Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 sm:gap-4">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.id}
                onClick={() => onNavigateCategory(cat.id)}
                className="luxury-card rounded-2xl p-3 flex flex-col items-center text-center group cursor-pointer border border-[#EAE4DA] hover:border-[#882434]/40"
              >
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden mb-2.5 bg-stone-100 shadow-inner">
                  <img
                    src={cat.imageUrl}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                </div>
                <h4 className="text-xs font-bold text-stone-900 group-hover:text-[#882434] transition-colors line-clamp-1">
                  {cat.name}
                </h4>
                <span className="text-[10px] text-stone-400 font-medium">
                  {cat.itemCount}+ Designs
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* 4. TRENDING PRODUCTS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <div className="text-xs font-bold text-[#882434] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Most Loved</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
              Trending Personalized Gifts
            </h2>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            <button
              onClick={() => setActiveTrendingTab('all')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTrendingTab === 'all'
                  ? 'bg-[#882434] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              All Trending
            </button>
            <button
              onClick={() => setActiveTrendingTab('couples')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTrendingTab === 'couples'
                  ? 'bg-[#882434] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Couple Keepsakes
            </button>
            <button
              onClick={() => setActiveTrendingTab('bestsellers')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTrendingTab === 'bestsellers'
                  ? 'bg-[#882434] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              Top Rated 5★
            </button>
            <button
              onClick={() => setActiveTrendingTab('express')}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                activeTrendingTab === 'express'
                  ? 'bg-[#882434] text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              ⚡ 24h Express
            </button>
          </div>
        </div>

        {/* Product Cards Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {filteredTrending.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 5. "MADE JUST FOR YOU" - HOW PERSONALIZATION WORKS */}
      <section className="bg-linear-to-r from-[#1C1819] via-[#2A1D20] to-[#1C1819] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
            <span className="text-xs font-bold text-[#F5D061] uppercase tracking-widest">
              Simple 4-Step Journey
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-bold">
              Made Just For You
            </h2>
            <p className="text-xs sm:text-sm text-stone-400">
              We turn your candid snapshots and heartfelt feelings into everlasting tangible artwork.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative">
              <span className="text-4xl font-serif font-black text-[#F5D061]/30">01</span>
              <h3 className="font-serif text-lg font-bold text-white">Upload Your Photo</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Choose any high-resolution photo from your phone or camera roll. Our AI checks resolution for crystal clarity.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative">
              <span className="text-4xl font-serif font-black text-[#F5D061]/30">02</span>
              <h3 className="font-serif text-lg font-bold text-white">Add Your Message</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Enter your special date, loved one's name, or romantic soundtrack. Select from luxury fonts and finishes.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative">
              <span className="text-4xl font-serif font-black text-[#F5D061]/30">03</span>
              <h3 className="font-serif text-lg font-bold text-white">Preview Your Design</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Inspect your live custom preview on our real-time interactive canvas before checkout. Exactly what you see is what we make.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 space-y-3 relative">
              <span className="text-4xl font-serif font-black text-[#F5D061]/30">04</span>
              <h3 className="font-serif text-lg font-bold text-white">Place Your Order</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Handcrafted by master artisans, packed with bubble-shield protection and dispatched to your doorstep across 19,000+ pincodes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 6. BEST SELLERS SHOWCASE */}
      <section id="bestsellers-section" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="text-xs font-bold text-[#882434] uppercase tracking-wider mb-1 flex items-center gap-1.5">
              <Award className="w-3.5 h-3.5 text-[#C59B27]" />
              <span>Customer Favorites</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
              All-Time Best Sellers
            </h2>
          </div>
          <button
            onClick={onExploreAll}
            className="text-xs sm:text-sm font-semibold text-[#882434] hover:text-[#6E1B28] flex items-center gap-1 cursor-pointer"
          >
            <span>View All</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {bestsellers.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>

      {/* 7. INTERACTIVE PERSONALIZED GIFT BUILDER CTA */}
      <MiniGiftBuilder products={products} />

      {/* 8. CORPORATE GIFTING SHOWCASE */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="luxury-card rounded-3xl bg-linear-to-br from-[#1C1819] via-[#2A1D20] to-[#1C1819] text-white p-8 sm:p-12 overflow-hidden relative shadow-2xl">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#882434]/20 rounded-full blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
            <div className="lg:col-span-7 space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F5D061] text-xs font-semibold tracking-wider uppercase">
                <Building2 className="w-3.5 h-3.5" />
                <span>B2B & Bulk Solutions</span>
              </div>

              <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight">
                Make Your Brand <br />
                <span className="text-[#F5D061]">Unforgettable</span>
              </h2>

              <p className="text-xs sm:text-sm text-stone-300 leading-relaxed max-w-xl">
                Elevate your client relationships and inspire your teams. We provide turnkey customized gifting solutions for companies of all sizes — with laser engraved company logos, individual recipient name customization, and luxury magnetic gift boxes.
              </p>

              {/* Feature Points */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs text-stone-300 pt-2">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5D061] shrink-0" />
                  <span>Bulk Order Discounts</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5D061] shrink-0" />
                  <span>Custom Logo Engraving</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5D061] shrink-0" />
                  <span>Employee Welcome Kits</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5D061] shrink-0" />
                  <span>Client VIP Hampers</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5D061] shrink-0" />
                  <span>Pan-India Direct Shipping</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-[#F5D061] shrink-0" />
                  <span>GST Invoice & Tax Credits</span>
                </div>
              </div>

              <div className="pt-4">
                <button
                  onClick={onOpenCorporateQuote}
                  className="px-8 py-3.5 rounded-xl bg-[#F5D061] hover:bg-[#E5BE53] text-stone-900 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer"
                >
                  <Building2 className="w-4 h-4" />
                  <span>Request Corporate Quote</span>
                </button>
              </div>
            </div>

            <div className="lg:col-span-5">
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-white/20 bg-stone-900">
                <img
                  src="https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop"
                  alt="Corporate Gifting Hamper"
                  className="w-full aspect-4/3 object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. CUSTOMER REVIEWS & SOCIAL PROOF */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-[#882434] uppercase tracking-wider">
            Verified Buyers
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900">
            Real Stories, Real Tears of Joy
          </h2>
          <p className="text-xs sm:text-sm text-stone-500">
            Rated 4.9/5 stars by over 50,000 happy gift givers across India
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {CUSTOMER_REVIEWS.map((rev) => (
            <div
              key={rev.id}
              className="luxury-card rounded-2xl p-5 flex flex-col justify-between space-y-4 border border-[#EAE4DA]"
            >
              <div className="space-y-3">
                {/* Stars & Verified */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-0.5 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  {rev.isVerifiedBuyer && (
                    <span className="text-[10px] text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Verified
                    </span>
                  )}
                </div>

                <h4 className="font-serif text-sm font-bold text-stone-900 leading-snug">
                  "{rev.reviewTitle}"
                </h4>

                <p className="text-xs text-stone-600 leading-relaxed">
                  {rev.reviewText}
                </p>

                {/* Optional Customer Uploaded Photo */}
                {rev.customerPhotoUrl && (
                  <div className="aspect-video w-full rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                    <img src={rev.customerPhotoUrl} alt="Review product" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>

              {/* Customer Avatar & City */}
              <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
                <img
                  src={rev.avatarUrl}
                  alt={rev.customerName}
                  className="w-9 h-9 rounded-full object-cover"
                />
                <div>
                  <div className="text-xs font-bold text-stone-900">{rev.customerName}</div>
                  <div className="text-[10px] text-stone-400">{rev.customerCity}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. INSTAGRAM UGC GALLERY (#ImpressiveGiftsMoments) */}
      <section className="bg-[#FAF8F5] py-14 border-y border-[#EAE4DA]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-1.5">
            <div className="inline-flex items-center gap-1.5 text-xs font-bold text-[#882434] uppercase tracking-wider">
              <Camera className="w-4 h-4" />
              <span>#ImpressiveGiftsMoments</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Tagged By You On Instagram
            </h2>
            <p className="text-xs text-stone-500">
              Share your unboxing smiles on Instagram with @ImpressiveGifts to be featured!
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {instagramPosts.map((post, idx) => (
              <div
                key={idx}
                className="luxury-card rounded-2xl overflow-hidden aspect-square relative group cursor-pointer"
              >
                <img src={post.img} alt="UGC gifting post" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className="absolute inset-0 bg-stone-950/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4 text-white text-xs">
                  <span className="font-bold text-[#F5D061] text-[11px] mb-1">{post.user}</span>
                  <p className="line-clamp-2 text-[11px] text-stone-200">{post.caption}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 11. NEWSLETTER & WELCOME DISCOUNT */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="luxury-card rounded-3xl p-8 sm:p-12 text-center bg-linear-to-br from-[#FFFDFB] via-[#FAF8F5] to-[#F3EFEA] border border-[#C59B27]/40 shadow-lg space-y-4">
          <div className="w-12 h-12 rounded-2xl bg-[#882434] text-white flex items-center justify-center mx-auto shadow-md">
            <Gift className="w-6 h-6 text-[#F5D061]" />
          </div>

          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            Get 10% OFF Your First Order
          </h2>

          <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto leading-relaxed">
            Join the ImpressiveGifts VIP circle for occasion reminders, secret festival discounts, and unique gift inspirations.
          </p>

          {isSubscribed ? (
            <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-xl text-emerald-800 text-xs font-semibold inline-block">
              🎉 Welcome! Your coupon code is: <strong>FIRST10</strong>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address"
                className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs text-stone-900 focus:outline-hidden focus:border-[#882434] transition-all"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider shadow-md hover:shadow-lg transition-all cursor-pointer whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </section>
    </div>
  );
};
