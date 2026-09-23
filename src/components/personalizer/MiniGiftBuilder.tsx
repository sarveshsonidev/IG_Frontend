import React, { useState } from 'react';
import { Product, PersonalizationData } from '../../types';
import { useShop } from '../../context/ShopContext';
import { LivePreviewCanvas } from './LivePreviewCanvas';
import { 
  Sparkles, 
  Upload, 
  Type, 
  Palette, 
  ShoppingBag, 
  RotateCcw, 
  Check, 
  Plus, 
  Minus 
} from 'lucide-react';

interface MiniGiftBuilderProps {
  products: Product[];
  onOpenFullStudio?: () => void;
}

export const MiniGiftBuilder: React.FC<MiniGiftBuilderProps> = ({ products }) => {
  const { addToCart, formatPrice, showToast } = useShop();

  // Filter only personalizable products
  const customizableProducts = products.filter(p => p.isPersonalizable);
  const [selectedProduct, setSelectedProduct] = useState<Product>(customizableProducts[0] || products[0]);

  // Form states
  const [customText, setCustomText] = useState('Aarav & Meera ❤️');
  const [customSubtext, setCustomSubtext] = useState('Our Forever Song - 2024');
  const [selectedFont, setSelectedFont] = useState('script');
  const [selectedColor, setSelectedColor] = useState('gold');
  const [photoPreview, setPhotoPreview] = useState<string>(
    'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop'
  );
  const [quantity, setQuantity] = useState(1);

  // Sample quick photos to pick
  const samplePhotos = [
    { label: 'Couple', url: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=600&auto=format&fit=crop' },
    { label: 'Family', url: 'https://images.unsplash.com/photo-1511895426328-dc8714191300?q=80&w=600&auto=format&fit=crop' },
    { label: 'Solo Portrait', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=600&auto=format&fit=crop' },
    { label: 'Friends', url: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=600&auto=format&fit=crop' },
  ];

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Photo size should be under 5MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setPhotoPreview(event.target.result as string);
          showToast('Custom photo uploaded successfully!', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleReset = () => {
    setCustomText('Aarav & Meera ❤️');
    setCustomSubtext('Our Forever Song - 2024');
    setSelectedFont('script');
    setPhotoPreview(samplePhotos[0].url);
    showToast('Customization reset to default', 'info');
  };

  const handleAddToCart = () => {
    const personalizationData: PersonalizationData = {
      photoUrl: photoPreview,
      customTextLine1: customText,
      customTextLine2: customSubtext,
      fontId: selectedFont,
      colorId: selectedColor,
      recipientName: customText,
    };

    addToCart(selectedProduct, quantity, personalizationData);
  };

  const currentPersonalization: PersonalizationData = {
    photoUrl: photoPreview,
    customTextLine1: customText,
    customTextLine2: customSubtext,
    fontId: selectedFont,
    colorId: selectedColor,
  };

  return (
    <section className="py-20 bg-linear-to-b from-[#FAF8F5] via-[#FFFDFB] to-[#F3EFEA] border-y border-[#EAE4DA]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FDF9EE] border border-[#C59B27]/40 text-[#882434] text-xs font-semibold uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-3.5 h-3.5 text-[#C59B27]" />
            <span>Interactive Customizer</span>
          </div>

          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-900 tracking-tight">
            Create Your Own Gift in <span className="text-[#882434]">Real-Time</span>
          </h2>

          <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
            Choose your product, upload your cherished photo, customize words and fonts, and watch your unique design come to life before ordering!
          </p>
        </div>

        {/* Builder Studio Grid */}
        <div className="luxury-card rounded-3xl p-6 sm:p-8 lg:p-10 shadow-xl grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Live Canvas Preview */}
          <div className="lg:col-span-6 flex flex-col items-center space-y-4">
            <div className="w-full max-w-md mx-auto">
              <LivePreviewCanvas
                product={selectedProduct}
                personalization={currentPersonalization}
                className="shadow-md"
              />
            </div>

            {/* Quick Sample Photo selector */}
            <div className="w-full max-w-md space-y-2">
              <div className="flex items-center justify-between text-xs text-stone-500 font-medium">
                <span>Quick Photo Switch:</span>
                <label className="text-[#882434] hover:underline cursor-pointer flex items-center gap-1 font-semibold">
                  <Upload className="w-3.5 h-3.5" />
                  <span>Upload Your Own</span>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </label>
              </div>

              <div className="grid grid-cols-4 gap-2">
                {samplePhotos.map((s, idx) => (
                  <button
                    key={idx}
                    onClick={() => setPhotoPreview(s.url)}
                    className={`relative rounded-xl overflow-hidden aspect-video border-2 transition-all cursor-pointer ${
                      photoPreview === s.url
                        ? 'border-[#882434] ring-2 ring-[#882434]/20 scale-102'
                        : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={s.url} alt={s.label} className="w-full h-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-black/60 text-[9px] text-white py-0.5 text-center font-medium">
                      {s.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Interactive Controls */}
          <div className="lg:col-span-6 space-y-6">
            {/* Step 1: Select Product */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                <span>1. Select Product to Personalize</span>
                <span className="text-[11px] text-[#882434] font-medium lowercase">
                  {customizableProducts.length} items available
                </span>
              </label>

              <div className="grid grid-cols-3 gap-2.5">
                {customizableProducts.slice(0, 6).map(prod => (
                  <button
                    key={prod.id}
                    onClick={() => setSelectedProduct(prod)}
                    className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      selectedProduct.id === prod.id
                        ? 'border-[#882434] bg-[#882434]/5 ring-1 ring-[#882434]'
                        : 'border-stone-200 hover:border-stone-300 bg-white'
                    }`}
                  >
                    <div className="text-xs font-bold text-stone-900 line-clamp-1">
                      {prod.name}
                    </div>
                    <div className="text-xs font-semibold text-[#882434] mt-1">
                      {formatPrice(prod.price)}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Step 2: Custom Text Lines */}
            <div className="space-y-3">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Type className="w-3.5 h-3.5 text-[#C59B27]" />
                <span>2. Custom Names, Message or Song</span>
              </label>

              <div className="space-y-2">
                <input
                  type="text"
                  maxLength={40}
                  value={customText}
                  onChange={(e) => setCustomText(e.target.value)}
                  placeholder="Primary Text (e.g. Song Title, Names, Couple Monogram)"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#882434] transition-all"
                />

                <input
                  type="text"
                  maxLength={40}
                  value={customSubtext}
                  onChange={(e) => setCustomSubtext(e.target.value)}
                  placeholder="Secondary Line (e.g. Anniversary Date, Heartfelt Note)"
                  className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs text-stone-900 focus:bg-white focus:outline-hidden focus:border-[#882434] transition-all"
                />
              </div>
            </div>

            {/* Step 3: Choose Font */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                3. Choose Typography Style
              </label>

              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedFont('script')}
                  className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedFont === 'script'
                      ? 'border-[#882434] bg-[#882434] text-white shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="font-script text-base">Romantic Script</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFont('serif')}
                  className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedFont === 'serif'
                      ? 'border-[#882434] bg-[#882434] text-white shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="font-serif text-xs font-bold">Classic Serif</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSelectedFont('sans')}
                  className={`py-2 px-3 rounded-xl border text-center transition-all cursor-pointer ${
                    selectedFont === 'sans'
                      ? 'border-[#882434] bg-[#882434] text-white shadow-xs'
                      : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                  }`}
                >
                  <span className="font-sans text-xs font-semibold">Clean Modern</span>
                </button>
              </div>
            </div>

            {/* Pricing & Add to Cart Action */}
            <div className="pt-4 border-t border-stone-200 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-bold text-[#882434]">
                    {formatPrice(selectedProduct.price * quantity)}
                  </span>
                  <span className="text-xs text-stone-400 line-through">
                    {formatPrice(selectedProduct.originalPrice * quantity)}
                  </span>
                </div>
                <p className="text-[11px] text-emerald-700 font-semibold flex items-center gap-1">
                  <Check className="w-3 h-3" />
                  Free Personalization Included (₹0 extra fee)
                </p>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                {/* Quantity */}
                <div className="flex items-center border border-stone-200 rounded-xl bg-white p-1">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="w-8 text-center text-xs font-bold">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>

                <button
                  onClick={handleAddToCart}
                  className="flex-1 sm:flex-initial px-6 py-3 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add To Cart</span>
                </button>

                <button
                  onClick={handleReset}
                  title="Reset to default design"
                  className="p-3 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-500 transition-colors cursor-pointer"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
