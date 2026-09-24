import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  ShoppingBag, 
  Sparkles, 
  Upload, 
  Type, 
  Check, 
  Truck, 
  ShieldCheck, 
  Gift, 
  RotateCcw, 
  Plus, 
  Minus, 
  MapPin, 
  ChevronRight, 
  Share2, 
  Eye, 
  AlertCircle,
  HelpCircle,
  Clock
} from 'lucide-react';
import { Product, PersonalizationData } from '../types';
import { useShop } from '../context/ShopContext';
import { LivePreviewCanvas } from '../components/personalizer/LivePreviewCanvas';
import { ProductCard } from '../components/common/ProductCard';

interface ProductDetailPageProps {
  product: Product;
  allProducts: Product[];
  onSelectProduct: (product: Product) => void;
  onProceedToCheckout: () => void;
  onBackToShop: () => void;
}

export const ProductDetailPage: React.FC<ProductDetailPageProps> = ({
  product,
  allProducts,
  onSelectProduct,
  onProceedToCheckout,
  onBackToShop,
}) => {
  const { 
    addToCart, 
    formatPrice, 
    toggleWishlist, 
    isInWishlist, 
    currentPincode, 
    pincodeInfo, 
    checkPincode, 
    showToast,
    addRecentlyViewed
  } = useShop();

  // Track recently viewed
  React.useEffect(() => {
    addRecentlyViewed(product);
  }, [product]);

  // Gallery state
  const [selectedImageIdx, setSelectedImageIdx] = useState(0);

  // Quantity
  const [quantity, setQuantity] = useState(1);

  // Personalization State
  const [customText1, setCustomText1] = useState('');
  const [customText2, setCustomText2] = useState('');
  const [selectedFont, setSelectedFont] = useState(
    product.personalizationOptions?.allowedFonts?.[0]?.id || 'sans'
  );
  const [selectedColor, setSelectedColor] = useState(
    product.personalizationOptions?.allowedColors?.[0]?.id || 'gold'
  );
  const [uploadedPhoto, setUploadedPhoto] = useState<string | null>(null);

  // Gift Options
  const [isGiftWrapped, setIsGiftWrapped] = useState(false);
  const [giftMessage, setGiftMessage] = useState('');
  const [isAnonymousGift, setIsAnonymousGift] = useState(false);

  // Pincode Checker input
  const [pincodeInput, setPincodeInput] = useState(currentPincode || '400001');
  const [pincodeMessage, setPincodeMessage] = useState('');

  // Active Tab
  const [activeTab, setActiveTab] = useState<'description' | 'specs' | 'instructions' | 'reviews' | 'faq'>('description');

  const isFavorited = isInWishlist(product.id);

  // Handlers
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 8 * 1024 * 1024) {
        showToast('Photo size should be under 8MB.', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setUploadedPhoto(event.target.result as string);
          showToast('Photo uploaded and rendered on live preview! ✨', 'success');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleResetPersonalization = () => {
    setCustomText1('');
    setCustomText2('');
    setUploadedPhoto(null);
    showToast('Personalization reset', 'info');
  };

  const handlePincodeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = checkPincode(pincodeInput);
    if (!res.success) {
      setPincodeMessage(res.message || 'Please enter a valid 6-digit Indian PIN code');
    } else {
      setPincodeMessage('');
    }
  };

  const handleAddToCart = () => {
    // Validate if photo required
    if (product.personalizationOptions?.requirePhoto && !uploadedPhoto) {
      showToast('Please upload a photo for this personalized gift before adding to cart.', 'error');
      return;
    }

    const personalizationData: PersonalizationData = {
      photoUrl: uploadedPhoto || undefined,
      customTextLine1: customText1 || undefined,
      customTextLine2: customText2 || undefined,
      fontId: selectedFont,
      colorId: selectedColor,
      recipientName: customText1,
      giftMessage: giftMessage || undefined,
    };

    addToCart(
      product,
      quantity,
      personalizationData,
      isGiftWrapped,
      giftMessage,
      isAnonymousGift
    );
  };

  const handleBuyNow = () => {
    handleAddToCart();
    onProceedToCheckout();
  };

  const currentPersonalization: PersonalizationData = {
    photoUrl: uploadedPhoto || product.images[0],
    customTextLine1: customText1 || 'Your Custom Name / Text',
    customTextLine2: customText2 || (product.isPersonalizable ? 'Special Date / Quote' : ''),
    fontId: selectedFont,
    colorId: selectedColor,
  };

  // Related products
  const relatedProducts = allProducts
    .filter(p => p.id !== product.id && (p.category === product.category || p.occasions.some(o => product.occasions.includes(o))))
    .slice(0, 4);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb Bar */}
      <div className="flex items-center justify-between text-xs text-stone-500">
        <div className="flex items-center gap-1.5 font-medium truncate">
          <button onClick={onBackToShop} className="hover:text-[#882434] transition-colors cursor-pointer">
            Shop All
          </button>
          <span>/</span>
          <span className="capitalize hover:text-[#882434] cursor-pointer" onClick={onBackToShop}>
            {product.category}
          </span>
          <span>/</span>
          <span className="text-stone-900 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        <button
          onClick={() => {
            navigator.clipboard?.writeText(window.location.href);
            showToast('Product link copied to clipboard! 📋', 'success');
          }}
          className="flex items-center gap-1 hover:text-[#882434] cursor-pointer shrink-0"
        >
          <Share2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Column: Gallery & Live Personalization Preview */}
        <div className="lg:col-span-6 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-white shadow-sm border border-[#EAE4DA] p-3">
            {/* If product is personalizable and user entered text/photo, show the live canvas */}
            {product.isPersonalizable ? (
              <LivePreviewCanvas
                product={product}
                personalization={currentPersonalization}
                className="rounded-2xl"
              />
            ) : (
              <div className="aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 relative">
                <img
                  src={product.images[selectedImageIdx] || product.images[0]}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Badges */}
            <div className="absolute top-6 left-6 flex flex-col gap-1.5">
              {product.badge && (
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#882434] text-white shadow-xs">
                  {product.badge}
                </span>
              )}
              {product.isPersonalizable && (
                <span className="text-[10px] font-semibold tracking-wide px-2.5 py-0.5 rounded-full bg-[#FDF9EE] text-[#882434] border border-[#C59B27]/40 shadow-xs flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-[#C59B27]" />
                  Live Preview Active
                </span>
              )}
            </div>

            {/* Wishlist Floating Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-6 right-6 w-10 h-10 rounded-full flex items-center justify-center transition-all shadow-md cursor-pointer ${
                isFavorited
                  ? 'bg-[#882434] text-white'
                  : 'bg-white/90 backdrop-blur-md text-stone-700 hover:text-[#882434]'
              }`}
            >
              <Heart className={`w-5 h-5 ${isFavorited ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row */}
          {product.images.length > 1 && (
            <div className="flex gap-2.5 overflow-x-auto pb-1 justify-center">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIdx(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all cursor-pointer shrink-0 ${
                    selectedImageIdx === i
                      ? 'border-[#882434] ring-2 ring-[#882434]/20'
                      : 'border-transparent opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Live Viewing Counter Proof */}
          <div className="p-3 bg-[#FDF9EE] rounded-2xl border border-[#E5BE53]/30 flex items-center justify-between text-xs text-[#701825]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-rose-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#882434]" />
              </span>
              <span className="font-semibold">
                19 people are viewing this gift right now
              </span>
            </div>
            <span className="font-bold text-[11px] text-[#882434]">High Demand</span>
          </div>
        </div>

        {/* Right Column: Details, Personalization Controls & Checkout */}
        <div className="lg:col-span-6 space-y-6">
          {/* Header Info */}
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="uppercase tracking-wider font-bold text-stone-400">
                {product.category}
              </span>
              <span>•</span>
              <div className="flex items-center gap-1 text-amber-500 font-bold">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                <span>{product.rating}</span>
                <span className="text-stone-400 font-normal">({product.reviewCount} customer reviews)</span>
              </div>
            </div>

            <h1 className="font-serif text-2xl sm:text-3xl lg:text-4xl font-bold text-stone-900 leading-snug">
              {product.name}
            </h1>

            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              {product.tagline}
            </p>
          </div>

          {/* Pricing Box */}
          <div className="p-4 rounded-2xl bg-white border border-[#EAE4DA] flex items-center justify-between">
            <div className="space-y-0.5">
              <div className="flex items-baseline gap-2.5">
                <span className="text-3xl font-bold text-[#882434]">
                  {formatPrice(product.price)}
                </span>
                <span className="text-sm text-stone-400 line-through">
                  {formatPrice(product.originalPrice)}
                </span>
                <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                  {product.discountPercentage}% OFF
                </span>
              </div>
              <p className="text-[11px] text-stone-400">
                Inclusive of all taxes & GST. Customization charges: <strong className="text-emerald-700">₹0 (Free)</strong>
              </p>
            </div>

            <div className="text-right">
              {product.stock > 0 ? (
                <span className="text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                  <Check className="w-3.5 h-3.5" /> In Stock ({product.stock} units)
                </span>
              ) : (
                <span className="text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full font-bold">
                  Out of Stock
                </span>
              )}
            </div>
          </div>

          {/* PERSONALIZATION FORM (If Product Is Personalizable) */}
          {product.isPersonalizable && (
            <div className="p-5 rounded-2xl bg-[#FFFDFB] border-2 border-[#882434]/20 shadow-xs space-y-4">
              <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
                <div className="flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#C59B27]" />
                  <h3 className="font-serif text-base font-bold text-stone-900">
                    Customize Your Design
                  </h3>
                </div>

                {(customText1 || uploadedPhoto) && (
                  <button
                    onClick={handleResetPersonalization}
                    className="text-xs text-[#882434] hover:underline font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset</span>
                  </button>
                )}
              </div>

              {/* Photo Upload Input if applicable */}
              {(product.personalizationType === 'photo' || product.personalizationType === 'both') && (
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center justify-between">
                    <span>Upload Cherished Photo {product.personalizationOptions?.requirePhoto && '*'}</span>
                    {uploadedPhoto && (
                      <span className="text-emerald-600 text-[10px] font-semibold lowercase flex items-center gap-1">
                        <Check className="w-3 h-3" /> Photo Ready
                      </span>
                    )}
                  </label>

                  <label className="border-2 border-dashed border-[#882434]/40 hover:border-[#882434] bg-white rounded-2xl p-4 flex flex-col items-center justify-center text-center cursor-pointer transition-all hover:bg-[#FAF8F5]">
                    <Upload className="w-5 h-5 text-[#882434] mb-1" />
                    <span className="text-xs font-semibold text-stone-800">
                      {uploadedPhoto ? 'Click to Change Photo' : 'Click to Upload High-Res Photograph'}
                    </span>
                    <span className="text-[10px] text-stone-400">
                      Supports JPG, PNG up to 8MB • Face will be automatically centered
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handlePhotoUpload}
                      className="hidden"
                    />
                  </label>
                </div>
              )}

              {/* Text Input Fields */}
              {(product.personalizationType === 'text' || product.personalizationType === 'both') && (
                <div className="space-y-3">
                  <div className="space-y-1">
                    <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                      Primary Custom Line / Names
                    </label>
                    <input
                      type="text"
                      maxLength={product.personalizationOptions?.maxTextLength || 40}
                      value={customText1}
                      onChange={(e) => setCustomText1(e.target.value)}
                      placeholder={product.personalizationOptions?.textPlaceholder || 'Enter custom name, quote or song'}
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-[#882434] transition-all"
                    />
                  </div>

                  {product.personalizationOptions?.allowMultipleLines && (
                    <div className="space-y-1">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Secondary Date or Message (Optional)
                      </label>
                      <input
                        type="text"
                        maxLength={40}
                        value={customText2}
                        onChange={(e) => setCustomText2(e.target.value)}
                        placeholder="e.g. 14.02.2024 • Forever Yours"
                        className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-[#882434] transition-all"
                      />
                    </div>
                  )}

                  {/* Font Selector */}
                  {product.personalizationOptions?.allowedFonts && (
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                        Typography Style
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {product.personalizationOptions.allowedFonts.map((f) => (
                          <button
                            key={f.id}
                            type="button"
                            onClick={() => setSelectedFont(f.id)}
                            className={`py-2 px-2.5 rounded-xl border text-center transition-all cursor-pointer ${
                              selectedFont === f.id
                                ? 'border-[#882434] bg-[#882434] text-white shadow-xs font-bold'
                                : 'border-stone-200 bg-white text-stone-700 hover:bg-stone-50'
                            }`}
                          >
                            <span style={{ fontFamily: f.cssFamily }} className="text-xs">
                              {f.name}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Delivery & Pincode Checker */}
          <div className="p-4 rounded-2xl bg-white border border-[#EAE4DA] space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-stone-700">
              <MapPin className="w-4 h-4 text-[#882434]" />
              <span>Check Delivery Speed & COD Availability</span>
            </div>

            <form onSubmit={handlePincodeSubmit} className="flex gap-2">
              <input
                type="text"
                maxLength={6}
                value={pincodeInput}
                onChange={(e) => setPincodeInput(e.target.value.replace(/\D/g, ''))}
                placeholder="Enter 6-digit Pincode"
                className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3.5 py-2 text-xs font-semibold focus:bg-white focus:outline-hidden focus:border-[#882434]"
              />
              <button
                type="submit"
                className="px-5 py-2 bg-stone-900 hover:bg-[#882434] text-white text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer"
              >
                Verify
              </button>
            </form>

            {pincodeMessage && (
              <p className="text-xs text-rose-600 flex items-center gap-1">
                <AlertCircle className="w-3.5 h-3.5" />
                {pincodeMessage}
              </p>
            )}

            {pincodeInfo && (
              <div className="p-3 bg-stone-50 rounded-xl space-y-1.5 text-xs text-stone-700 border border-stone-200/60">
                <div className="flex items-center justify-between font-semibold">
                  <span>Delivering to {pincodeInfo.city}, {pincodeInfo.state}</span>
                  <span className="text-emerald-700 flex items-center gap-1 font-bold">
                    <Check className="w-3.5 h-3.5" /> Serviceable
                  </span>
                </div>
                <div className="flex items-center gap-2 text-stone-500 pt-0.5">
                  <Clock className="w-3.5 h-3.5 text-[#C59B27]" />
                  <span>
                    Estimated Delivery: <strong>In {pincodeInfo.standardDays} - {pincodeInfo.standardDays + 2} Business Days</strong>
                  </span>
                </div>
                {pincodeInfo.isExpressAvailable && (
                  <div className="text-[11px] text-amber-700 font-semibold">
                    ⚡ Express Next-Day Delivery available at checkout!
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Luxury Gift Wrap Add-on */}
          <div className="p-4 rounded-2xl bg-[#FDF9EE] border border-[#E5BE53]/40 space-y-3">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={isGiftWrapped}
                onChange={(e) => setIsGiftWrapped(e.target.checked)}
                className="w-4 h-4 mt-0.5 text-[#882434] focus:ring-[#882434] rounded"
              />
              <div className="text-xs">
                <span className="font-bold text-stone-900 flex items-center gap-1.5">
                  <Gift className="w-3.5 h-3.5 text-[#882434]" />
                  Add Luxury Gift Box & Satin Ribbon (+₹49)
                </span>
                <p className="text-stone-500 text-[11px] mt-0.5">
                  Hand-wrapped in royal wine textured paper with golden bow and handwritten note card.
                </p>
              </div>
            </label>

            {isGiftWrapped && (
              <div className="pt-2 space-y-2 border-t border-[#E5BE53]/30">
                <textarea
                  rows={2}
                  value={giftMessage}
                  onChange={(e) => setGiftMessage(e.target.value)}
                  placeholder="Enter custom gift message to be printed on royal greeting card..."
                  className="w-full p-2.5 bg-white border border-stone-200 rounded-xl text-xs focus:outline-hidden focus:border-[#882434]"
                />

                <label className="flex items-center gap-2 text-[11px] text-stone-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAnonymousGift}
                    onChange={(e) => setIsAnonymousGift(e.target.checked)}
                    className="w-3.5 h-3.5 text-[#882434] rounded"
                  />
                  <span>Send as Anonymous Gift (Keep sender name secret 🤫)</span>
                </label>
              </div>
            )}
          </div>

          {/* Quantity & Actions Bar */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-3">
              {/* Quantity Changer */}
              <div className="flex items-center border border-stone-200 rounded-xl bg-white p-1">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <Minus className="w-3.5 h-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="p-2 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-100 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>

              {/* Add to Cart */}
              <button
                onClick={handleAddToCart}
                className="flex-1 py-4 rounded-xl bg-white border-2 border-[#882434] text-[#882434] hover:bg-[#882434]/5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs transition-all cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>Add to Cart</span>
              </button>

              {/* Buy Now */}
              <button
                onClick={handleBuyNow}
                className="flex-1 py-4 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-[#F5D061]" />
                <span>Buy Now</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs (Description, Specs, Instructions, Reviews, FAQ) */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-[#EAE4DA] shadow-xs space-y-6">
        <div className="flex items-center gap-4 sm:gap-8 border-b border-stone-200 overflow-x-auto pb-3 text-xs sm:text-sm font-semibold text-stone-500">
          <button
            onClick={() => setActiveTab('description')}
            className={`pb-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'description' ? 'text-[#882434] border-b-2 border-[#882434] font-bold' : 'hover:text-stone-900'
            }`}
          >
            Product Overview
          </button>
          <button
            onClick={() => setActiveTab('specs')}
            className={`pb-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'specs' ? 'text-[#882434] border-b-2 border-[#882434] font-bold' : 'hover:text-stone-900'
            }`}
          >
            Specifications
          </button>
          <button
            onClick={() => setActiveTab('instructions')}
            className={`pb-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'instructions' ? 'text-[#882434] border-b-2 border-[#882434] font-bold' : 'hover:text-stone-900'
            }`}
          >
            Personalization Guide
          </button>
          <button
            onClick={() => setActiveTab('faq')}
            className={`pb-2 whitespace-nowrap cursor-pointer transition-colors ${
              activeTab === 'faq' ? 'text-[#882434] border-b-2 border-[#882434] font-bold' : 'hover:text-stone-900'
            }`}
          >
            FAQs ({product.faq?.length || 0})
          </button>
        </div>

        {/* Tab Content */}
        <div className="text-xs sm:text-sm text-stone-700 leading-relaxed">
          {activeTab === 'description' && (
            <div className="space-y-4 max-w-3xl">
              <p>{product.description}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/60 space-y-1">
                  <h4 className="font-bold text-stone-900">Why It's Special</h4>
                  <p className="text-xs text-stone-600">
                    Hand-finished by specialized artisans who inspect optical laser calibration on every unit.
                  </p>
                </div>
                <div className="p-4 rounded-xl bg-[#FAF8F5] border border-stone-200/60 space-y-1">
                  <h4 className="font-bold text-stone-900">Delivery Guarantee</h4>
                  <p className="text-xs text-stone-600">
                    Shipped with 5-layer bubble-wrap thermocol protective casing to prevent transit scratches or breakage.
                  </p>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'specs' && (
            <div className="max-w-xl">
              <table className="w-full text-left divide-y divide-stone-100">
                <tbody>
                  {Object.entries(product.specifications || {}).map(([key, val]) => (
                    <tr key={key} className="py-2.5">
                      <td className="py-2.5 font-bold text-stone-900 w-1/3">{key}</td>
                      <td className="py-2.5 text-stone-600">{val}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-3 max-w-2xl">
              <h4 className="font-bold text-stone-900">How to Prepare Your Photo & Text:</h4>
              <ul className="space-y-2 list-disc list-inside text-stone-600">
                {product.instructions.map((inst, i) => (
                  <li key={i}>{inst}</li>
                ))}
              </ul>
            </div>
          )}

          {activeTab === 'faq' && (
            <div className="space-y-3 max-w-3xl">
              {product.faq?.map((item, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-stone-50 border border-stone-200/60 space-y-1">
                  <h5 className="font-bold text-stone-900 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#882434]" />
                    <span>{item.q}</span>
                  </h5>
                  <p className="text-xs text-stone-600 pl-6">{item.a}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Related Products Carousel */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="font-serif text-2xl font-bold text-stone-900">
              You May Also Like
            </h3>
            <button
              onClick={onBackToShop}
              className="text-xs font-semibold text-[#882434] hover:underline"
            >
              Explore Collection →
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            {relatedProducts.map((p) => (
              <ProductCard
                key={p.id}
                product={p}
                onSelectProduct={onSelectProduct}
              />
            ))}
          </div>
        </section>
      )}

      {/* Sticky Bottom Bar for Mobile View */}
      <div className="lg:hidden fixed inset-x-0 bottom-0 z-40 bg-white/95 backdrop-blur-md p-3 border-t border-[#EAE4DA] shadow-[0_-4px_20px_rgba(0,0,0,0.08)] flex items-center justify-between gap-2.5 pb-[calc(0.75rem+env(safe-area-inset-bottom,0px))]">
        <div className="shrink-0">
          <span className="text-[10px] text-stone-400 uppercase font-semibold block leading-none">Total</span>
          <div className="text-base font-bold text-[#882434] leading-tight">{formatPrice(product.price * quantity)}</div>
        </div>

        <button
          onClick={handleAddToCart}
          className="flex-1 py-3 px-2 rounded-xl bg-white border border-[#882434] text-[#882434] hover:bg-[#882434]/5 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-xs cursor-pointer active:scale-95 transition-all"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Cart</span>
        </button>

        <button
          onClick={handleBuyNow}
          className="flex-1 py-3 px-2 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1 shadow-md cursor-pointer active:scale-95 transition-all"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#F5D061]" />
          <span>Buy Now</span>
        </button>
      </div>
    </div>
  );
};
