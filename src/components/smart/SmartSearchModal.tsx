import React, { useState, useEffect, useRef } from 'react';
import { Search, X, TrendingUp, Sparkles, Star, ArrowRight, CornerDownLeft } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

interface SmartSearchModalProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onNavigateCategory: (catId: string) => void;
}

export const SmartSearchModal: React.FC<SmartSearchModalProps> = ({
  products,
  onSelectProduct,
  onNavigateCategory,
}) => {
  const { isSearchOpen, setIsSearchOpen, formatPrice } = useShop();
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      setQuery('');
    }
  }, [isSearchOpen]);

  if (!isSearchOpen) return null;

  const popularSearches = [
    'Spotify plaque',
    'Magic mug',
    'Anniversary',
    '3D Moon lamp',
    'Engraved watch',
    'Corporate hampers',
    'Wooden frame',
    'Couple t-shirts',
  ];

  const filteredProducts = query.trim()
    ? products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.tagline.toLowerCase().includes(q) ||
          p.occasions.some(occ => occ.toLowerCase().includes(q)) ||
          p.recipients.some(rec => rec.toLowerCase().includes(q))
        );
      })
    : [];

  const handleSelect = (product: Product) => {
    setIsSearchOpen(false);
    onSelectProduct(product);
  };

  const handlePopularClick = (term: string) => {
    setQuery(term);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-2xl bg-white rounded-2xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[80vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Box */}
        <div className="flex items-center px-4 py-3.5 border-b border-stone-100 bg-[#FAF8F5]">
          <Search className="w-5 h-5 text-stone-400 mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search personalized mugs, frames, occasions, anniversary gifts..."
            className="w-full bg-transparent text-sm sm:text-base text-stone-900 placeholder-stone-400 focus:outline-hidden font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-stone-400 hover:text-stone-600 mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => setIsSearchOpen(false)}
            className="text-xs bg-stone-200 hover:bg-stone-300 text-stone-700 px-2 py-1 rounded cursor-pointer font-medium"
          >
            ESC
          </button>
        </div>

        {/* Content body */}
        <div className="p-4 overflow-y-auto space-y-5">
          {/* If query entered -> show live results */}
          {query.trim() ? (
            <div>
              <div className="flex items-center justify-between text-xs text-stone-500 font-semibold mb-3">
                <span>Matching Gifts ({filteredProducts.length})</span>
                <span className="text-[11px] text-[#882434]">Instant Search</span>
              </div>

              {filteredProducts.length === 0 ? (
                <div className="text-center py-10 space-y-2">
                  <p className="text-stone-700 text-sm font-medium">
                    No exact gifts found for "{query}"
                  </p>
                  <p className="text-xs text-stone-400">
                    Try searching for "Mug", "Lamp", "Spotify", "Frame" or "Anniversary"
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {filteredProducts.map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => handleSelect(prod)}
                      className="w-full flex items-center justify-between p-2.5 rounded-xl hover:bg-[#FAF8F5] transition-all text-left group border border-transparent hover:border-stone-200 cursor-pointer"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={prod.images[0]}
                          alt={prod.name}
                          className="w-12 h-12 rounded-lg object-cover group-hover:scale-105 transition-transform"
                        />
                        <div>
                          <h4 className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-[#882434] transition-colors line-clamp-1">
                            {prod.name}
                          </h4>
                          <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-0.5">
                            <span className="capitalize">{prod.category}</span>
                            <span>•</span>
                            <span className="text-amber-600 flex items-center gap-0.5">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              {prod.rating}
                            </span>
                            {prod.isPersonalizable && (
                              <>
                                <span>•</span>
                                <span className="text-[#882434] font-medium flex items-center gap-0.5">
                                  <Sparkles className="w-2.5 h-2.5 text-[#C59B27]" />
                                  Customizable
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0 pl-2">
                        <div className="text-xs sm:text-sm font-bold text-[#882434]">
                          {formatPrice(prod.price)}
                        </div>
                        <div className="text-[10px] text-stone-400 line-through">
                          {formatPrice(prod.originalPrice)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <>
              {/* Popular Searches */}
              <div className="space-y-2">
                <div className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-stone-400">
                  <TrendingUp className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>Popular Searches</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term, i) => (
                    <button
                      key={i}
                      onClick={() => handlePopularClick(term)}
                      className="px-3 py-1.5 rounded-full bg-stone-100 hover:bg-[#882434]/10 text-stone-700 hover:text-[#882434] text-xs font-medium transition-colors cursor-pointer border border-stone-200/60"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Trending Bestsellers */}
              <div className="space-y-2 pt-2 border-t border-stone-100">
                <div className="text-xs font-bold uppercase tracking-wider text-stone-400">
                  Trending Gifts Right Now
                </div>
                <div className="grid grid-cols-2 gap-2">
                  {products.slice(0, 4).map((prod) => (
                    <button
                      key={prod.id}
                      onClick={() => handleSelect(prod)}
                      className="flex items-center gap-2.5 p-2 rounded-xl bg-stone-50 hover:bg-[#FAF8F5] text-left transition-all group border border-stone-200/50 cursor-pointer"
                    >
                      <img
                        src={prod.images[0]}
                        alt={prod.name}
                        className="w-10 h-10 rounded-lg object-cover"
                      />
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-stone-800 group-hover:text-[#882434] truncate">
                          {prod.name}
                        </div>
                        <div className="text-[11px] font-bold text-[#882434]">
                          {formatPrice(prod.price)}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer shortcuts hint */}
        <div className="px-4 py-2 bg-stone-50 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400">
          <span>Search by recipient, emotion, occasion, or item type</span>
          <div className="flex items-center gap-1">
            <span>Press</span>
            <kbd className="px-1.5 py-0.5 bg-white border border-stone-200 rounded text-stone-600 font-mono">
              ESC
            </kbd>
            <span>to close</span>
          </div>
        </div>
      </div>
    </div>
  );
};
