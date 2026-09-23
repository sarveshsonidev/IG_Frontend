import React from 'react';
import { X, Check, Minus, ShoppingBag, Sparkles, Star } from 'lucide-react';
import { useShop } from '../../context/ShopContext';
import { Product } from '../../types';

interface CompareModalProps {
  onSelectProduct: (product: Product) => void;
}

export const CompareModal: React.FC<CompareModalProps> = ({ onSelectProduct }) => {
  const { 
    compareList, 
    toggleCompare, 
    clearCompare, 
    isCompareModalOpen, 
    setIsCompareModalOpen, 
    formatPrice,
    addToCart 
  } = useShop();

  if (!isCompareModalOpen || compareList.length === 0) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div 
        className="w-full max-w-4xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-200 flex items-center justify-between bg-[#FAF8F5]">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              Compare Gifts Side-by-Side
            </h3>
            <p className="text-xs text-stone-500">
              Comparing {compareList.length} products
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={clearCompare}
              className="text-xs text-stone-500 hover:text-stone-800 underline font-medium cursor-pointer"
            >
              Clear All
            </button>
            <button
              onClick={() => setIsCompareModalOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-200 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Comparison Table */}
        <div className="overflow-x-auto p-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-3 w-40 text-xs font-bold uppercase text-stone-400 border-b border-stone-200">
                  Feature
                </th>
                {compareList.map((prod) => (
                  <th key={prod.id} className="p-3 min-w-[200px] border-b border-stone-200">
                    <div className="relative space-y-2">
                      <button
                        onClick={() => toggleCompare(prod)}
                        className="absolute -top-1 -right-1 text-stone-400 hover:text-rose-600 p-1 cursor-pointer"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4" />
                      </button>

                      <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
                        <img src={prod.images[0]} alt={prod.name} className="w-full h-full object-cover" />
                      </div>

                      <h4 className="font-serif text-xs font-bold text-stone-900 line-clamp-2">
                        {prod.name}
                      </h4>

                      <div className="text-sm font-bold text-[#882434]">
                        {formatPrice(prod.price)}
                      </div>
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="text-xs text-stone-700 divide-y divide-stone-100">
              {/* Category */}
              <tr>
                <td className="p-3 font-semibold text-stone-500">Category</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-3 capitalize">{prod.category}</td>
                ))}
              </tr>

              {/* Rating */}
              <tr>
                <td className="p-3 font-semibold text-stone-500">Customer Rating</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-3">
                    <div className="flex items-center gap-1 font-bold text-amber-600">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{prod.rating}</span>
                      <span className="text-stone-400 font-normal">({prod.reviewCount})</span>
                    </div>
                  </td>
                ))}
              </tr>

              {/* Personalization Type */}
              <tr>
                <td className="p-3 font-semibold text-stone-500">Customization</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-3">
                    {prod.isPersonalizable ? (
                      <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold bg-emerald-50 px-2 py-0.5 rounded">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        {prod.personalizationType === 'both' ? 'Photo + Text' : prod.personalizationType === 'photo' ? 'Custom Photo' : 'Laser Text'}
                      </span>
                    ) : (
                      <span className="text-stone-400">Ready to Ship</span>
                    )}
                  </td>
                ))}
              </tr>

              {/* Express Delivery */}
              <tr>
                <td className="p-3 font-semibold text-stone-500">Express 24h Dispatch</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-3">
                    {prod.isExpressAvailable ? (
                      <Check className="w-4 h-4 text-emerald-600" />
                    ) : (
                      <Minus className="w-4 h-4 text-stone-400" />
                    )}
                  </td>
                ))}
              </tr>

              {/* Action Buttons */}
              <tr>
                <td className="p-3 font-semibold text-stone-500">Action</td>
                {compareList.map((prod) => (
                  <td key={prod.id} className="p-3">
                    <button
                      onClick={() => {
                        setIsCompareModalOpen(false);
                        onSelectProduct(prod);
                      }}
                      className="w-full py-2 px-3 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-[11px] font-bold uppercase transition-colors cursor-pointer text-center"
                    >
                      {prod.isPersonalizable ? 'Personalize' : 'View Product'}
                    </button>
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
