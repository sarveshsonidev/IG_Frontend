import React from 'react';
import { Tag, Sparkles, Copy, Check, Percent } from 'lucide-react';
import { AVAILABLE_COUPONS } from '../data/coupons';
import { useShop } from '../context/ShopContext';

interface OffersPageProps {
  onExploreGifts: () => void;
}

export const OffersPage: React.FC<OffersPageProps> = ({ onExploreGifts }) => {
  const { applyCoupon, showToast } = useShop();

  const handleCopyCode = (code: string) => {
    navigator.clipboard?.writeText(code);
    applyCoupon(code);
    showToast(`Coupon ${code} copied & applied to your cart! 🎉`, 'success');
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      <div className="text-center max-w-xl mx-auto space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF9EE] border border-[#C59B27]/40 text-[#882434] text-xs font-semibold uppercase tracking-wider">
          <Percent className="w-3.5 h-3.5 text-[#C59B27]" />
          <span>Exclusive Offers</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Coupons & Festive Discounts
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Save on your personalized gifts. Apply coupon with one click!
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {AVAILABLE_COUPONS.map((c) => (
          <div
            key={c.code}
            className="luxury-card rounded-3xl p-6 bg-white border border-[#EAE4DA] shadow-sm flex flex-col justify-between space-y-4 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-24 h-24 bg-[#FDF9EE] rounded-bl-full -z-0 pointer-events-none" />

            <div className="space-y-2 relative z-10">
              <div className="flex items-center justify-between">
                <span className="font-mono text-base font-bold text-[#882434] bg-[#FAF8F5] border border-[#882434]/20 px-3 py-1 rounded-xl">
                  {c.code}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                  Verified Offer
                </span>
              </div>

              <h3 className="font-serif text-lg font-bold text-stone-900 pt-2">
                {c.description}
              </h3>
              <p className="text-xs text-stone-500">
                Minimum cart value: ₹{c.minOrderValue} • Valid till {c.expiryDate}
              </p>
            </div>

            <div className="pt-2 flex items-center justify-between border-t border-stone-100 relative z-10">
              <button
                onClick={() => handleCopyCode(c.code)}
                className="px-4 py-2 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Apply Code</span>
              </button>

              <button
                onClick={onExploreGifts}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 underline"
              >
                Shop Qualifying Gifts
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
