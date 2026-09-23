import React, { useState } from 'react';
import { X, Star, Sparkles, ShoppingBag, ArrowRight, ShieldCheck, Truck, Check } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

interface QuickViewModalProps {
  onSelectProduct: (product: Product) => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({ onSelectProduct }) => {
  const { 
    quickViewProduct, 
    setQuickViewProduct, 
    addToCart, 
    formatPrice, 
    toggleWishlist, 
    isInWishlist 
  } = useShop();

  const [activeImageIdx, setActiveImageIdx] = useState(0);

  if (!quickViewProduct) return null;

  const product = quickViewProduct;
  const isFavorited = isInWishlist(product.id);

  const handleFullDetails = () => {
    setQuickViewProduct(null);
    onSelectProduct(product);
  };

  const handleAddToCart = () => {
    if (product.isPersonalizable) {
      handleFullDetails();
    } else {
      addToCart(product, 1);
      setQuickViewProduct(null);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-3xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden relative flex flex-col md:flex-row max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={() => setQuickViewProduct(null)}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-white/90 backdrop-blur-xs hover:bg-stone-100 flex items-center justify-center text-stone-500 hover:text-stone-900 transition-colors shadow-xs cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Left Side: Images */}
        <div className="w-full md:w-1/2 p-6 bg-[#FAF8F5] flex flex-col justify-between">
          <div className="aspect-square rounded-2xl overflow-hidden bg-white shadow-inner border border-stone-200/60 relative">
            <img
              src={product.images[activeImageIdx] || product.images[0]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {product.badge && (
              <span className="absolute top-3 left-3 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#882434] text-white shadow-xs">
                {product.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-2 pt-3 justify-center">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImageIdx(i)}
                  className={`w-12 h-12 rounded-xl overflow-hidden border-2 transition-all cursor-pointer ${
                    activeImageIdx === i ? 'border-[#882434] ring-2 ring-[#882434]/20' : 'border-transparent opacity-70'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Side: Product Details */}
        <div className="w-full md:w-1/2 p-6 flex flex-col justify-between overflow-y-auto space-y-4">
          <div className="space-y-3">
            {/* Category & Rating */}
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase tracking-wider font-semibold text-stone-400">
                {product.category}
              </span>
              <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400 font-normal">({product.reviewCount} reviews)</span>
              </div>
            </div>

            {/* Title */}
            <h3 className="font-serif text-xl sm:text-2xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h3>

            {/* Price Box */}
            <div className="flex items-baseline gap-2.5 py-1">
              <span className="text-2xl font-bold text-[#882434]">
                {formatPrice(product.price)}
              </span>
              <span className="text-sm text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                {product.discountPercentage}% OFF
              </span>
            </div>

            {/* Short Tagline */}
            <p className="text-xs text-stone-600 leading-relaxed">
              {product.tagline || product.description}
            </p>

            {/* Key Micro Perks */}
            <div className="space-y-1.5 py-2 border-y border-stone-100 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span>Zero extra charge for custom name/photo print</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>Express dispatch in 24-48 hours across India</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#882434]" />
                <span>100% Transit Safe Packaging Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-2 pt-2">
            <button
              onClick={handleAddToCart}
              className="w-full py-3.5 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              {product.isPersonalizable ? (
                <>
                  <Sparkles className="w-4 h-4 text-[#F5D061]" />
                  <span>Customize & Personalize Design</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleFullDetails}
              className="w-full py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>View Full Details & Reviews</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
