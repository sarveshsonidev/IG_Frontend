import React, { useState } from 'react';
import { 
  Gift, 
  Mail, 
  Phone, 
  MapPin, 
  ShieldCheck, 
  Truck, 
  RotateCcw, 
  Heart, 
  Send,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

import { useShop } from '../../context/ShopContext';

interface FooterProps {
  setCurrentView: (view: string) => void;
  onSelectCategory?: (catId: string) => void;
  onSelectOccasion?: (occId: string) => void;
}

export const Footer: React.FC<FooterProps> = ({
  setCurrentView,
  onSelectCategory,
  onSelectOccasion,
}) => {
  const { showToast } = useShop();
  const [emailInput, setEmailInput] = useState('');
  const [isSubscribed, setIsSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput || !emailInput.includes('@')) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    setIsSubscribed(true);
    showToast('Subscribed! Use code FIRST10 for 10% OFF your first order. 🎉', 'success');
  };

  const navigateTo = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-[#1C1819] text-[#FAF8F5] pt-16 pb-12 border-t border-[#332A2C]">
      {/* Trust Badges Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 border-b border-white/10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F5D061] shrink-0">
              <Sparkles className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">100% Handcrafted</h4>
              <p className="text-xs text-stone-400">Master artisans laser engraved</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F5D061] shrink-0">
              <Truck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Express 24-48h Dispatch</h4>
              <p className="text-xs text-stone-400">19,000+ Indian Pincodes</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F5D061] shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Razorpay Secure Checkout</h4>
              <p className="text-xs text-stone-400">256-bit Bank Grade SSL</p>
            </div>
          </div>

          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-[#F5D061] shrink-0">
              <RotateCcw className="w-6 h-6" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Guaranteed Safe Delivery</h4>
              <p className="text-xs text-stone-400">Zero transit damage promise</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-linear-to-br from-[#9E2A3C] to-[#6E1B28] flex items-center justify-center border border-[#D4AF37]/40 shadow-sm">
                <Gift className="w-5 h-5 text-white" />
              </div>
              <span className="font-serif text-2xl font-bold tracking-tight text-white">
                Impressive<span className="text-[#F5D061]">Gifts</span>
              </span>
            </div>

            <p className="text-stone-300 text-sm leading-relaxed max-w-sm">
              We craft emotional personalized memories into high-quality tangible keepsakes. Every custom mug, acrylic lamp, engraved wooden clock and corporate hamper is crafted with boundless care and precision.
            </p>

            <div className="pt-2 text-xs text-stone-400 space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#C59B27]" />
                <span>ImpressiveGifts Studio, Birsa Nagar, Birsa Chowk, Ranchi, Jharkhand - 834003</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-[#C59B27]" />
                <span>+91 8986613412 (Mon - Sat, 9:30 AM - 7:00 PM IST)</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-[#C59B27]" />
                <span>care@impressivegifts.in</span>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-3">
              <a href="#instagram" aria-label="Instagram" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#882434] transition-colors flex items-center justify-center text-white">
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
              </a>
              <a href="#facebook" aria-label="Facebook" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#882434] transition-colors flex items-center justify-center text-white">
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
              </a>
              <a href="#twitter" aria-label="Twitter" className="w-8 h-8 rounded-full bg-white/10 hover:bg-[#882434] transition-colors flex items-center justify-center text-white">
                <svg className="w-4 h-4 fill-currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white/90">
              Explore
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <button onClick={() => navigateTo('shop')} className="hover:text-[#F5D061] transition-colors cursor-pointer">
                  All Personalized Gifts
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('custom-builder')} className="hover:text-[#F5D061] transition-colors cursor-pointer text-[#F5D061]">
                  Live 3D Gift Builder ✨
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('corporate')} className="hover:text-[#F5D061] transition-colors cursor-pointer">
                  Corporate Gifting & Bulk
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('offers')} className="hover:text-[#F5D061] transition-colors cursor-pointer">
                  Festive Deals & Coupons
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('track-order')} className="hover:text-[#F5D061] transition-colors cursor-pointer">
                  Track Live Order Status
                </button>
              </li>
              <li>
                <button onClick={() => navigateTo('account')} className="hover:text-[#F5D061] transition-colors cursor-pointer">
                  Customer Sign In / Register
                </button>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-white/90">
              Customer Care
            </h4>
            <ul className="space-y-2 text-xs text-stone-400">
              <li>
                <a href="#shipping-policy" onClick={(e) => { e.preventDefault(); showToast('Free express shipping on all orders over ₹999 across India.', 'info'); }} className="hover:text-[#F5D061] transition-colors">
                  Shipping & Dispatch Policy
                </a>
              </li>
              <li>
                <a href="#returns" onClick={(e) => { e.preventDefault(); showToast('100% Replacement Guarantee if received damaged in transit.', 'info'); }} className="hover:text-[#F5D061] transition-colors">
                  Replacement & Refunds
                </a>
              </li>
              <li>
                <a href="#faq" onClick={() => navigateTo('account')} className="hover:text-[#F5D061] transition-colors">
                  Frequently Asked Questions
                </a>
              </li>
              <li>
                <a href="#terms" onClick={(e) => { e.preventDefault(); showToast('Terms of Service: All personalized orders are custom made upon order placement.', 'info'); }} className="hover:text-[#F5D061] transition-colors">
                  Terms & Conditions
                </a>
              </li>
              <li>
                <a href="#privacy" onClick={(e) => { e.preventDefault(); showToast('Your photos and personal messages are strictly confidential and deleted post-delivery.', 'info'); }} className="hover:text-[#F5D061] transition-colors">
                  Privacy & Photo Security
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="space-y-3">
            <h4 className="text-sm font-semibold tracking-wider uppercase text-[#F5D061]">
              Get 10% OFF
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Subscribe to unlock our exclusive VIP gift catalogue, anniversary reminders and your 10% welcome coupon.
            </p>

            {isSubscribed ? (
              <div className="p-3 bg-emerald-900/30 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>You are subscribed! Use coupon code: <strong>FIRST10</strong></span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="Enter your email"
                    className="w-full bg-white/5 border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-stone-500 focus:outline-hidden focus:border-[#C59B27] transition-all"
                  />
                  <button
                    type="submit"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-[#882434] hover:bg-[#9E2A3C] text-white rounded-lg text-xs font-medium flex items-center justify-center transition-colors cursor-pointer"
                  >
                    <Send className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[10px] text-stone-500">
                  Instant coupon generated upon sign up. No spam ever.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Legal & Payment Brands Strip */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-stone-500">
        <p className="text-center md:text-left">
          © {new Date().getFullYear()} ImpressiveGifts India Pvt. Ltd. All rights reserved. Made with ❤️ for memorable gifting.
        </p>

        {/* Payment Icons */}
        <div className="flex items-center gap-3 text-stone-400 font-medium">
          <span className="text-[11px] text-stone-400">Accepted:</span>
          <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 text-[11px] text-white">UPI / GPay / PhonePe</span>
          <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 text-[11px] text-white">Cards & Netbanking</span>
          <span className="px-2 py-0.5 bg-white/5 rounded border border-white/10 text-[11px] text-amber-200">Cash on Delivery</span>
        </div>
      </div>
    </footer>
  );
};
