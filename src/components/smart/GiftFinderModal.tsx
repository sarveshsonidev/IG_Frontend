import React, { useState } from 'react';
import { 
  X, 
  Compass, 
  Sparkles, 
  Heart, 
  Check, 
  ArrowRight, 
  RotateCcw,
  Star,
  ShoppingBag
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product, RecipientTag, OccasionId } from '../../types';
import { OCCASIONS } from '../../data/occasions';

interface GiftFinderModalProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
}

export const GiftFinderModal: React.FC<GiftFinderModalProps> = ({
  products,
  onSelectProduct,
}) => {
  const { isGiftFinderOpen, setIsGiftFinderOpen, formatPrice } = useShop();

  const [step, setStep] = useState<1 | 2 | 3 | 4>(1);
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientTag | null>(null);
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionId | null>(null);
  const [selectedBudget, setSelectedBudget] = useState<{ min: number; max: number; label: string } | null>(null);

  if (!isGiftFinderOpen) return null;

  const recipientsList: { label: RecipientTag; icon: string }[] = [
    { label: 'Wife', icon: '💍' },
    { label: 'Husband', icon: '👔' },
    { label: 'Girlfriend', icon: '🌹' },
    { label: 'Boyfriend', icon: '🎸' },
    { label: 'Mother', icon: '🌸' },
    { label: 'Father', icon: '🎩' },
    { label: 'Friend', icon: '🎉' },
    { label: 'Brother', icon: '🎮' },
    { label: 'Sister', icon: '✨' },
    { label: 'Colleague', icon: '☕' },
    { label: 'Client', icon: '💼' },
  ];

  const budgetTiers = [
    { label: 'Under ₹499', min: 0, max: 499, desc: 'Sweet & thoughtful surprises' },
    { label: '₹499 – ₹999', min: 499, max: 999, desc: 'Popular customized gifts' },
    { label: '₹999 – ₹1,499', min: 999, max: 1499, desc: 'Personalized keepsake luxury' },
    { label: '₹1,500 – ₹2,500', min: 1500, max: 2500, desc: 'Premium luxury watches & lamps' },
    { label: '₹2,500+', min: 2500, max: 99999, desc: 'Grand hampers & VIP sets' },
  ];

  // Recommendations calculation
  const recommendedProducts = products.filter(p => {
    let matches = true;
    if (selectedRecipient && !p.recipients.includes(selectedRecipient)) {
      matches = false;
    }
    if (selectedOccasion && !p.occasions.includes(selectedOccasion)) {
      // allow fallback if matching recipient
      if (!selectedRecipient) matches = false;
    }
    if (selectedBudget) {
      if (p.price < selectedBudget.min || p.price > selectedBudget.max) {
        matches = false;
      }
    }
    return matches;
  });

  // If strict filter yielded few results, fallback to products matching at least 2 criteria
  const displayResults = recommendedProducts.length > 0 
    ? recommendedProducts 
    : products.filter(p => {
        if (selectedBudget && (p.price < selectedBudget.min || p.price > selectedBudget.max)) return false;
        return true;
      }).slice(0, 6);

  const handleReset = () => {
    setStep(1);
    setSelectedRecipient(null);
    setSelectedOccasion(null);
    setSelectedBudget(null);
  };

  const handleProductClick = (prod: Product) => {
    setIsGiftFinderOpen(false);
    onSelectProduct(prod);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/65 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-[#FAF8F5] rounded-3xl shadow-2xl border border-[#EAE4DA] overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="px-6 py-4 bg-white border-b border-[#EAE4DA] flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#FDF9EE] border border-[#C59B27]/40 flex items-center justify-center text-[#882434]">
              <Compass className="w-4 h-4 text-[#C59B27]" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900 leading-tight">
                Smart Gift Finder
              </h3>
              <p className="text-[11px] text-stone-500">
                Answer 3 quick questions for tailored recommendations
              </p>
            </div>
          </div>

          <button
            onClick={() => setIsGiftFinderOpen(false)}
            className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Indicator Progress Bar */}
        <div className="bg-stone-100 h-1.5 w-full">
          <div 
            className="bg-[#882434] h-full transition-all duration-300"
            style={{ width: `${(step / 4) * 100}%` }}
          />
        </div>

        {/* Questionnaire Body */}
        <div className="p-6 overflow-y-auto flex-1">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="text-center space-y-1 mb-6">
                <span className="text-xs font-bold text-[#882434] uppercase tracking-wider">
                  Step 1 of 3
                </span>
                <h4 className="font-serif text-2xl font-bold text-stone-900">
                  Who are you buying this gift for?
                </h4>
                <p className="text-xs text-stone-500">
                  Select the person who deserves something special
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {recipientsList.map((rec) => (
                  <button
                    key={rec.label}
                    onClick={() => {
                      setSelectedRecipient(rec.label);
                      setStep(2);
                    }}
                    className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                      selectedRecipient === rec.label
                        ? 'border-[#882434] bg-white ring-2 ring-[#882434]/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-[#882434]/40 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span className="text-2xl">{rec.icon}</span>
                    <span className="text-sm font-semibold text-stone-800">
                      {rec.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="text-center space-y-1 mb-6">
                <span className="text-xs font-bold text-[#882434] uppercase tracking-wider">
                  Step 2 of 3
                </span>
                <h4 className="font-serif text-2xl font-bold text-stone-900">
                  What is the occasion?
                </h4>
                <p className="text-xs text-stone-500">
                  Buying for {selectedRecipient}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {OCCASIONS.map((occ) => (
                  <button
                    key={occ.id}
                    onClick={() => {
                      setSelectedOccasion(occ.id);
                      setStep(3);
                    }}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
                      selectedOccasion === occ.id
                        ? 'border-[#882434] bg-white ring-2 ring-[#882434]/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-[#882434]/40 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900 line-clamp-1">
                      {occ.title}
                    </div>
                    <div className="text-[11px] text-stone-500 line-clamp-1 pt-0.5">
                      {occ.badge}
                    </div>
                  </button>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium"
                >
                  ← Back to Recipient
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-200">
              <div className="text-center space-y-1 mb-6">
                <span className="text-xs font-bold text-[#882434] uppercase tracking-wider">
                  Step 3 of 3
                </span>
                <h4 className="font-serif text-2xl font-bold text-stone-900">
                  What is your gifting budget?
                </h4>
                <p className="text-xs text-stone-500">
                  For {selectedRecipient} • {OCCASIONS.find(o => o.id === selectedOccasion)?.title}
                </p>
              </div>

              <div className="space-y-2.5 max-w-md mx-auto">
                {budgetTiers.map((tier, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedBudget(tier);
                      setStep(4);
                    }}
                    className={`w-full p-4 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                      selectedBudget?.label === tier.label
                        ? 'border-[#882434] bg-white ring-2 ring-[#882434]/20 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-[#882434]/40 hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-bold text-stone-900">
                        {tier.label}
                      </div>
                      <div className="text-xs text-stone-500">
                        {tier.desc}
                      </div>
                    </div>
                    <ArrowRight className="w-4 h-4 text-stone-400 group-hover:text-[#882434]" />
                  </button>
                ))}
              </div>

              <div className="pt-2 text-center">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs text-stone-500 hover:text-stone-800 font-medium"
                >
                  ← Back to Occasion
                </button>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-5 animate-in fade-in duration-300">
              <div className="flex items-center justify-between border-b border-stone-200 pb-3">
                <div>
                  <h4 className="font-serif text-xl font-bold text-stone-900">
                    Handpicked Just For You ✨
                  </h4>
                  <p className="text-xs text-stone-500">
                    Showing gifts for <strong>{selectedRecipient}</strong> ({selectedBudget?.label})
                  </p>
                </div>

                <button
                  onClick={handleReset}
                  className="flex items-center gap-1 text-xs text-[#882434] hover:underline font-semibold cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Start Over</span>
                </button>
              </div>

              {displayResults.length === 0 ? (
                <div className="text-center py-10 space-y-3">
                  <p className="text-stone-700 text-sm font-medium">
                    No exact items found in this narrow budget range.
                  </p>
                  <button
                    onClick={handleReset}
                    className="px-4 py-2 rounded-xl bg-[#882434] text-white text-xs font-semibold"
                  >
                    Reset Questionnaire
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  {displayResults.map((prod) => (
                    <div
                      key={prod.id}
                      onClick={() => handleProductClick(prod)}
                      className="p-3 rounded-2xl bg-white border border-[#EAE4DA] hover:border-[#882434]/40 hover:shadow-md transition-all flex gap-3 cursor-pointer group"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-20 h-20 rounded-xl object-cover shrink-0 group-hover:scale-105 transition-transform"
                      />

                      <div className="flex-1 flex flex-col justify-between min-w-0">
                        <div>
                          <div className="flex items-center gap-1 text-[11px] text-amber-500 mb-0.5">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            <span className="font-bold text-stone-800">{prod.rating}</span>
                          </div>

                          <h5 className="font-serif text-xs font-bold text-stone-900 group-hover:text-[#882434] transition-colors line-clamp-2">
                            {prod.name}
                          </h5>
                        </div>

                        <div className="flex items-center justify-between pt-1">
                          <span className="text-xs font-bold text-[#882434]">
                            {formatPrice(prod.price)}
                          </span>

                          <span className="text-[11px] text-stone-500 font-medium group-hover:text-[#882434] flex items-center gap-0.5">
                            View <ArrowRight className="w-3 h-3" />
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
