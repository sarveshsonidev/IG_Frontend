import React from 'react';
import { Heart, ShoppingBag, ArrowRight } from 'lucide-react';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/common/ProductCard';

interface WishlistPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onExploreGifts: () => void;
}

export const WishlistPage: React.FC<WishlistPageProps> = ({
  products,
  onSelectProduct,
  onExploreGifts,
}) => {
  const { wishlist } = useShop();

  const savedProducts = products.filter(p => wishlist.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-stone-900 flex items-center gap-2.5">
            <Heart className="w-6 h-6 text-[#882434] fill-[#882434]" />
            <span>My Saved Wishlist</span>
          </h1>
          <p className="text-xs text-stone-500 pt-0.5">
            {savedProducts.length} memorable personalized gifts saved for upcoming occasions
          </p>
        </div>

        <button
          onClick={onExploreGifts}
          className="text-xs font-semibold text-[#882434] hover:underline"
        >
          Explore More Gifts →
        </button>
      </div>

      {savedProducts.length === 0 ? (
        <div className="luxury-card rounded-3xl p-16 text-center space-y-4 bg-white border border-[#EAE4DA]">
          <div className="w-16 h-16 rounded-full bg-rose-50 text-rose-400 flex items-center justify-center mx-auto">
            <Heart className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-stone-900">Your wishlist is empty</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Tap the heart icon on any personalized mug, photo frame or acrylic lamp to save it for later.
            </p>
          </div>
          <button
            onClick={onExploreGifts}
            className="px-6 py-2.5 rounded-xl bg-[#882434] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#6E1B28] cursor-pointer"
          >
            Start Exploring Gifts
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {savedProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      )}
    </div>
  );
};
