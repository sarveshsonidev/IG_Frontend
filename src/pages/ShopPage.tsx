import React, { useState, useMemo } from 'react';
import { 
  Filter, 
  Grid3X3, 
  List, 
  X, 
  ChevronDown, 
  Star, 
  Sparkles, 
  SlidersHorizontal,
  RotateCcw,
  Check
} from 'lucide-react';
import { Product, CategoryId, OccasionId, RecipientTag } from '../types';
import { CATEGORIES } from '../data/categories';
import { OCCASIONS } from '../data/occasions';
import { ProductCard } from '../components/common/ProductCard';
import { useShop } from '../context/ShopContext';

interface ShopPageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  initialCategory?: CategoryId | null;
  initialOccasion?: OccasionId | null;
}

export const ShopPage: React.FC<ShopPageProps> = ({
  products,
  onSelectProduct,
  initialCategory,
  initialOccasion,
}) => {
  const { formatPrice } = useShop();

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | 'all'>(initialCategory || 'all');
  const [selectedOccasion, setSelectedOccasion] = useState<OccasionId | 'all'>(initialOccasion || 'all');
  const [selectedRecipient, setSelectedRecipient] = useState<RecipientTag | 'all'>('all');
  const [selectedBudget, setSelectedBudget] = useState<{ min: number; max: number; label: string } | null>(null);
  const [onlyPersonalizable, setOnlyPersonalizable] = useState(false);
  const [onlyExpress, setOnlyExpress] = useState(false);
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'popular' | 'newest' | 'price-low' | 'price-high' | 'rating' | 'bestseller'>('popular');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Budget Presets
  const budgetPresets = [
    { label: 'Under ₹499', min: 0, max: 499 },
    { label: '₹499 – ₹999', min: 499, max: 999 },
    { label: '₹999 – ₹1,499', min: 999, max: 1499 },
    { label: '₹1,500 – ₹2,500', min: 1500, max: 2500 },
    { label: '₹2,500+', min: 2500, max: 99999 },
  ];

  const recipientOptions: RecipientTag[] = [
    'Wife',
    'Husband',
    'Girlfriend',
    'Boyfriend',
    'Mother',
    'Father',
    'Friend',
    'Brother',
    'Sister',
    'Colleague',
    'Client',
  ];

  // Filter and sort products
  const filteredProducts = useMemo(() => {
    return products.filter((prod) => {
      if (selectedCategory !== 'all' && prod.category !== selectedCategory) return false;
      if (selectedOccasion !== 'all' && !prod.occasions.includes(selectedOccasion)) return false;
      if (selectedRecipient !== 'all' && !prod.recipients.includes(selectedRecipient)) return false;
      if (selectedBudget && (prod.price < selectedBudget.min || prod.price > selectedBudget.max)) return false;
      if (onlyPersonalizable && !prod.isPersonalizable) return false;
      if (onlyExpress && !prod.isExpressAvailable) return false;
      if (minRating > 0 && prod.rating < minRating) return false;
      return true;
    }).sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return b.rating - a.rating;
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        case 'bestseller':
          return b.reviewCount - a.reviewCount;
        case 'popular':
        default:
          return (b.badge === 'Bestseller' ? 1 : 0) - (a.badge === 'Bestseller' ? 1 : 0);
      }
    });
  }, [
    products,
    selectedCategory,
    selectedOccasion,
    selectedRecipient,
    selectedBudget,
    onlyPersonalizable,
    onlyExpress,
    minRating,
    sortBy,
  ]);

  const handleResetFilters = () => {
    setSelectedCategory('all');
    setSelectedOccasion('all');
    setSelectedRecipient('all');
    setSelectedBudget(null);
    setOnlyPersonalizable(false);
    setOnlyExpress(false);
    setMinRating(0);
    setSortBy('popular');
  };

  const hasActiveFilters = 
    selectedCategory !== 'all' || 
    selectedOccasion !== 'all' || 
    selectedRecipient !== 'all' || 
    selectedBudget !== null || 
    onlyPersonalizable || 
    onlyExpress || 
    minRating > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Breadcrumb & Title */}
      <div className="space-y-1">
        <div className="text-xs text-stone-400 flex items-center gap-1.5 font-medium">
          <span>Home</span>
          <span>/</span>
          <span className="text-[#882434] font-semibold">Shop All Gifts</span>
          {selectedCategory !== 'all' && (
            <>
              <span>/</span>
              <span className="capitalize text-stone-700">{selectedCategory}</span>
            </>
          )}
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
          <div>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900 leading-tight">
              Personalized Gifts Collection
            </h1>
            <p className="text-xs sm:text-sm text-stone-500 pt-0.5">
              Showing {filteredProducts.length} handcrafted products with custom photo & laser engraving
            </p>
          </div>

          {/* View mode & Sort controls */}
          <div className="flex items-center gap-2.5">
            {/* Mobile Filter Trigger */}
            <button
              onClick={() => setIsMobileFilterOpen(true)}
              className="lg:hidden flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-stone-200 text-xs font-semibold text-stone-700 shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#882434]" />
              <span>Filters {hasActiveFilters && '•'}</span>
            </button>

            {/* Sort Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="appearance-none bg-white border border-stone-200 rounded-xl px-3.5 py-2 pr-8 text-xs font-semibold text-stone-700 focus:outline-hidden focus:border-[#882434] shadow-2xs cursor-pointer"
              >
                <option value="popular">Sort: Popularity</option>
                <option value="bestseller">Sort: Best Selling</option>
                <option value="rating">Sort: Customer Rating</option>
                <option value="price-low">Sort: Price: Low to High</option>
                <option value="price-high">Sort: Price: High to Low</option>
                <option value="newest">Sort: Newest First</option>
              </select>
              <ChevronDown className="w-3.5 h-3.5 text-stone-400 absolute right-2.5 top-3 pointer-events-none" />
            </div>

            {/* View Mode Toggle */}
            <div className="hidden sm:flex items-center bg-white border border-stone-200 rounded-xl p-0.5 shadow-2xs">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'grid' ? 'bg-[#882434] text-white' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="Grid View"
              >
                <Grid3X3 className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                  viewMode === 'list' ? 'bg-[#882434] text-white' : 'text-stone-400 hover:text-stone-700'
                }`}
                title="List View"
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Active Filter Pills Bar */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2 pt-2 pb-1">
          <span className="text-xs text-stone-400 font-medium">Active filters:</span>

          {selectedCategory !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#882434]/10 text-[#882434] font-semibold px-2.5 py-1 rounded-full border border-[#882434]/20">
              Category: {selectedCategory}
              <button onClick={() => setSelectedCategory('all')} className="hover:text-stone-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedOccasion !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#882434]/10 text-[#882434] font-semibold px-2.5 py-1 rounded-full border border-[#882434]/20">
              Occasion: {OCCASIONS.find(o => o.id === selectedOccasion)?.title}
              <button onClick={() => setSelectedOccasion('all')} className="hover:text-stone-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedRecipient !== 'all' && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#882434]/10 text-[#882434] font-semibold px-2.5 py-1 rounded-full border border-[#882434]/20">
              For: {selectedRecipient}
              <button onClick={() => setSelectedRecipient('all')} className="hover:text-stone-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {selectedBudget && (
            <span className="inline-flex items-center gap-1 text-xs bg-[#882434]/10 text-[#882434] font-semibold px-2.5 py-1 rounded-full border border-[#882434]/20">
              Budget: {selectedBudget.label}
              <button onClick={() => setSelectedBudget(null)} className="hover:text-stone-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {onlyPersonalizable && (
            <span className="inline-flex items-center gap-1 text-xs bg-emerald-50 text-emerald-800 font-semibold px-2.5 py-1 rounded-full border border-emerald-200">
              Customizable Only
              <button onClick={() => setOnlyPersonalizable(false)} className="hover:text-stone-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          {onlyExpress && (
            <span className="inline-flex items-center gap-1 text-xs bg-amber-50 text-amber-800 font-semibold px-2.5 py-1 rounded-full border border-amber-200">
              ⚡ 24h Express
              <button onClick={() => setOnlyExpress(false)} className="hover:text-stone-900">
                <X className="w-3 h-3" />
              </button>
            </span>
          )}

          <button
            onClick={handleResetFilters}
            className="text-xs text-stone-500 hover:text-[#882434] underline font-medium cursor-pointer ml-1"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Layout: Sidebar Filters + Products Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 items-start">
        {/* Desktop Sidebar Filters */}
        <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-3xl border border-[#EAE4DA] shadow-xs sticky top-36">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h3 className="font-serif text-base font-bold text-stone-900 flex items-center gap-2">
              <Filter className="w-4 h-4 text-[#882434]" />
              <span>Filter By</span>
            </h3>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="text-[11px] text-[#882434] hover:underline font-semibold cursor-pointer"
              >
                Reset All
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
              Categories
            </label>
            <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                  selectedCategory === 'all'
                    ? 'bg-[#882434] text-white font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>All Categories</span>
                <span className="text-[10px] opacity-75">{products.length}</span>
              </button>

              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    selectedCategory === cat.id
                      ? 'bg-[#882434] text-white font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="truncate">{cat.name}</span>
                  <span className="text-[10px] opacity-75">{cat.itemCount}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Budget Presets */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
              Gift Budget
            </label>
            <div className="space-y-1">
              {budgetPresets.map((tier, idx) => (
                <button
                  key={idx}
                  onClick={() =>
                    setSelectedBudget(selectedBudget?.label === tier.label ? null : tier)
                  }
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium flex items-center justify-between transition-colors cursor-pointer ${
                    selectedBudget?.label === tier.label
                      ? 'bg-[#882434] text-white font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span>{tier.label}</span>
                  {selectedBudget?.label === tier.label && <Check className="w-3 h-3 text-white" />}
                </button>
              ))}
            </div>
          </div>

          {/* Occasion Filter */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
              Occasion
            </label>
            <div className="space-y-1 max-h-40 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedOccasion('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedOccasion === 'all'
                    ? 'bg-[#882434] text-white font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                All Occasions
              </button>
              {OCCASIONS.map((occ) => (
                <button
                  key={occ.id}
                  onClick={() => setSelectedOccasion(occ.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium truncate transition-colors cursor-pointer ${
                    selectedOccasion === occ.id
                      ? 'bg-[#882434] text-white font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {occ.title}
                </button>
              ))}
            </div>
          </div>

          {/* Recipient Filter */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
              Recipient
            </label>
            <div className="space-y-1 max-h-36 overflow-y-auto pr-1">
              <button
                onClick={() => setSelectedRecipient('all')}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                  selectedRecipient === 'all'
                    ? 'bg-[#882434] text-white font-semibold'
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                All Recipients
              </button>
              {recipientOptions.map((rec) => (
                <button
                  key={rec}
                  onClick={() => setSelectedRecipient(rec)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium truncate transition-colors cursor-pointer ${
                    selectedRecipient === rec
                      ? 'bg-[#882434] text-white font-semibold'
                      : 'text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  {rec}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Checkbox Toggles */}
          <div className="space-y-2 pt-3 border-t border-stone-100">
            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyPersonalizable}
                onChange={(e) => setOnlyPersonalizable(e.target.checked)}
                className="w-4 h-4 rounded text-[#882434] focus:ring-[#882434] border-stone-300"
              />
              <span className="flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-[#C59B27]" />
                Personalization Available
              </span>
            </label>

            <label className="flex items-center gap-2 text-xs font-medium text-stone-700 cursor-pointer">
              <input
                type="checkbox"
                checked={onlyExpress}
                onChange={(e) => setOnlyExpress(e.target.checked)}
                className="w-4 h-4 rounded text-[#882434] focus:ring-[#882434] border-stone-300"
              />
              <span>⚡ Express 24h Dispatch</span>
            </label>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3 space-y-6">
          {filteredProducts.length === 0 ? (
            <div className="luxury-card rounded-3xl p-16 text-center space-y-4 bg-white border border-[#EAE4DA]">
              <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                <Filter className="w-8 h-8" />
              </div>
              <div className="space-y-1">
                <h3 className="font-serif text-xl font-bold text-stone-800">
                  No matching gifts found
                </h3>
                <p className="text-xs text-stone-500 max-w-sm mx-auto">
                  Try adjusting or clearing your filters to discover other memorable handcrafted gifts.
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-6 py-2.5 rounded-xl bg-[#882434] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#6E1B28] cursor-pointer"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'grid' ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={onSelectProduct}
                  layout="grid"
                />
              ))}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredProducts.map((prod) => (
                <ProductCard
                  key={prod.id}
                  product={prod}
                  onSelectProduct={onSelectProduct}
                  layout="list"
                />
              ))}
            </div>
          )}
        </main>
      </div>

      {/* Mobile Filters Drawer */}
      {isMobileFilterOpen && (
        <div className="lg:hidden fixed inset-0 z-50 overflow-hidden">
          <div
            onClick={() => setIsMobileFilterOpen(false)}
            className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs"
          />
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <div className="w-screen max-w-xs bg-white shadow-2xl p-5 flex flex-col justify-between overflow-y-auto">
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                  <h3 className="font-serif text-lg font-bold text-stone-900">
                    Filter Gifts
                  </h3>
                  <button onClick={() => setIsMobileFilterOpen(false)}>
                    <X className="w-5 h-5 text-stone-400" />
                  </button>
                </div>

                {/* Categories */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                    Category
                  </label>
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value as any)}
                    className="w-full p-2 bg-stone-50 border border-stone-200 rounded-xl text-xs"
                  >
                    <option value="all">All Categories</option>
                    {CATEGORIES.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Budget */}
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-600 block">
                    Budget Tier
                  </label>
                  <div className="space-y-1">
                    {budgetPresets.map((tier, idx) => (
                      <button
                        key={idx}
                        onClick={() =>
                          setSelectedBudget(selectedBudget?.label === tier.label ? null : tier)
                        }
                        className={`w-full text-left p-2 rounded-lg text-xs font-medium border ${
                          selectedBudget?.label === tier.label
                            ? 'bg-[#882434] text-white border-[#882434]'
                            : 'border-stone-200 bg-white'
                        }`}
                      >
                        {tier.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-stone-200">
                <button
                  onClick={() => setIsMobileFilterOpen(false)}
                  className="w-full py-3 rounded-xl bg-[#882434] text-white text-xs font-bold uppercase"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
