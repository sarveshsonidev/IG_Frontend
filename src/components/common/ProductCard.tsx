import React from 'react';
import { Heart, Eye, Sparkles, Star, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';

interface ProductCardProps {
  product: Product;
  onSelectProduct: (product: Product) => void;
  layout?: 'grid' | 'list';
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelectProduct,
  layout = 'grid',
}) => {
  const { 
    isInWishlist, 
    toggleWishlist, 
    setQuickViewProduct, 
    addToCart, 
    formatPrice 
  } = useShop();

  const isFavorited = isInWishlist(product.id);

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (product.isPersonalizable) {
      // If it requires personalization, take them to the detail / personalization view
      onSelectProduct(product);
    } else {
      addToCart(product, 1);
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setQuickViewProduct(product);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  if (layout === 'list') {
    return (
      <div 
        onClick={() => onSelectProduct(product)}
        className="luxury-card rounded-2xl p-4 flex flex-col sm:flex-row gap-5 items-center cursor-pointer group hover:border-[#882434]/40"
      >
        <div className="relative w-full sm:w-48 h-48 rounded-xl overflow-hidden shrink-0 bg-stone-100">
          <img
            src={product.images[0]}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            loading="lazy"
          />
          {product.badge && (
            <span className="absolute top-2 left-2 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#882434] text-white shadow-xs">
              {product.badge}
            </span>
          )}
        </div>

        <div className="flex-1 w-full space-y-2">
          <div className="flex items-center gap-1.5 text-xs text-amber-500 font-medium">
            <div className="flex items-center">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            </div>
            <span className="font-bold text-stone-800">{product.rating}</span>
            <span className="text-stone-400">({product.reviewCount} reviews)</span>
          </div>

          <h3 className="font-serif text-lg font-bold text-stone-900 group-hover:text-[#882434] transition-colors leading-snug">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 leading-relaxed">
            {product.tagline || product.description}
          </p>

          <div className="flex items-baseline gap-2 pt-1">
            <span className="text-lg font-bold text-[#882434]">
              {formatPrice(product.price)}
            </span>
            <span className="text-xs text-stone-400 line-through">
              {formatPrice(product.originalPrice)}
            </span>
            <span className="text-xs font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
              {product.discountPercentage}% OFF
            </span>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <button
              onClick={handleQuickAdd}
              className="px-4 py-2 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer shadow-xs"
            >
              {product.isPersonalizable ? (
                <>
                  <Sparkles className="w-3.5 h-3.5 text-[#F5D061]" />
                  <span>Personalize Design</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </>
              )}
            </button>

            <button
              onClick={handleQuickView}
              className="px-3 py-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50 text-xs font-medium flex items-center gap-1 transition-colors cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Quick View</span>
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={() => onSelectProduct(product)}
      className="luxury-card rounded-2xl overflow-hidden flex flex-col group cursor-pointer relative bg-white"
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-square w-full overflow-hidden bg-stone-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Hover image preview switch if available */}
        {product.images[1] && (
          <img
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            className="w-full h-full object-cover absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
            loading="lazy"
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.badge && (
            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#882434] text-white shadow-xs">
              {product.badge}
            </span>
          )}
          {product.isPersonalizable && (
            <span className="text-[10px] font-semibold tracking-wide px-2 py-0.5 rounded-full bg-[#FDF9EE] text-[#882434] border border-[#C59B27]/40 shadow-xs flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5 text-[#C59B27]" />
              Customizable
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlist}
          aria-label={isFavorited ? 'Remove from Wishlist' : 'Add to Wishlist'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full flex items-center justify-center transition-all z-10 shadow-xs cursor-pointer ${
            isFavorited
              ? 'bg-[#882434] text-white'
              : 'bg-white/90 backdrop-blur-xs text-stone-600 hover:text-[#882434] hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-white' : ''}`} />
        </button>

        {/* Floating Quick View button on hover */}
        <div className="absolute inset-x-3 bottom-3 opacity-0 group-hover:opacity-100 transition-all duration-300 z-10 hidden sm:flex gap-2">
          <button
            onClick={handleQuickView}
            className="flex-1 py-2 rounded-xl bg-white/95 backdrop-blur-md hover:bg-white text-stone-800 text-xs font-semibold shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <Eye className="w-3.5 h-3.5 text-stone-500" />
            <span>Quick View</span>
          </button>
        </div>
      </div>

      {/* Product Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Rating */}
          <div className="flex items-center gap-1 text-xs text-amber-500 font-medium mb-1">
            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            <span className="font-bold text-stone-800">{product.rating}</span>
            <span className="text-stone-400 text-[11px]">({product.reviewCount})</span>
          </div>

          {/* Product Name */}
          <h3 className="font-serif text-[15px] font-bold text-stone-900 group-hover:text-[#882434] transition-colors line-clamp-2 leading-snug">
            {product.name}
          </h3>
        </div>

        {/* Price & Action */}
        <div className="pt-1 border-t border-stone-100 flex items-center justify-between">
          <div>
            <div className="flex items-baseline gap-1.5">
              <span className="text-base font-bold text-[#882434]">
                {formatPrice(product.price)}
              </span>
              <span className="text-[11px] text-stone-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
            </div>
            <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1 py-0.2 rounded">
              Save {product.discountPercentage}%
            </span>
          </div>

          {/* CTA Action button */}
          <button
            onClick={handleQuickAdd}
            className="w-8 h-8 rounded-full bg-[#FAF8F5] group-hover:bg-[#882434] text-stone-700 group-hover:text-white border border-[#EAE4DA] flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            title={product.isPersonalizable ? 'Personalize this gift' : 'Add to Cart'}
          >
            {product.isPersonalizable ? (
              <Sparkles className="w-3.5 h-3.5 text-[#C59B27] group-hover:text-[#F5D061]" />
            ) : (
              <ShoppingBag className="w-3.5 h-3.5" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
