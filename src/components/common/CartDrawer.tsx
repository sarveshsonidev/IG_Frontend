import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Tag, 
  Gift, 
  Sparkles, 
  Check, 
  AlertCircle 
} from 'lucide-react';
import { useShop } from '../../context/ShopContext';

interface CartDrawerProps {
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const {
    cart,
    isCartDrawerOpen,
    setIsCartDrawerOpen,
    updateQuantity,
    removeFromCart,
    subtotal,
    discount,
    shippingFee,
    giftWrapFee,
    total,
    freeShippingRemaining,
    freeShippingThreshold,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
    formatPrice,
    coupons,
    showToast,
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

  if (!isCartDrawerOpen) return null;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    const res = applyCoupon(couponInput);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
      setCouponInput('');
    }
  };

  const handleQuickCouponClick = (code: string) => {
    const res = applyCoupon(code);
    if (!res.success) {
      setCouponError(res.message);
    } else {
      setCouponError('');
    }
  };

  const freeShippingProgress = Math.min(
    100,
    Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        onClick={() => setIsCartDrawerOpen(false)}
        className="absolute inset-0 bg-stone-900/60 backdrop-blur-xs transition-opacity duration-300"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#FAF8F5] shadow-2xl flex flex-col justify-between border-l border-[#EAE4DA] animate-in slide-in-from-right duration-300">
          {/* Header */}
          <div className="p-4 sm:p-5 bg-white border-b border-[#EAE4DA] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#882434]/10 text-[#882434] flex items-center justify-center">
                <ShoppingBag className="w-4 h-4" />
              </div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                Your Shopping Cart ({cart.length})
              </h3>
            </div>

            <button
              onClick={() => setIsCartDrawerOpen(false)}
              className="p-1.5 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress Indicator */}
          <div className="bg-[#FDF9EE] px-5 py-3 border-b border-[#E5BE53]/30">
            {freeShippingRemaining > 0 ? (
              <p className="text-xs text-[#701825] font-medium leading-relaxed">
                Add <strong>{formatPrice(freeShippingRemaining)}</strong> more to get{' '}
                <strong className="text-[#882434] uppercase font-bold">FREE Express Delivery!</strong>
              </p>
            ) : (
              <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                <span>Congratulations! You have unlocked FREE Delivery! 🎉</span>
              </p>
            )}
            <div className="w-full bg-[#EAE4DA] h-1.5 rounded-full mt-2 overflow-hidden">
              <div
                className="bg-linear-to-r from-[#F5D061] to-[#882434] h-full rounded-full transition-all duration-500"
                style={{ width: `${freeShippingProgress}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-4">
                <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="font-serif text-lg font-bold text-stone-800">
                    Your cart feels empty
                  </h4>
                  <p className="text-xs text-stone-500 max-w-xs mx-auto">
                    Explore our handcrafted personalized keepsakes and make someone's day special.
                  </p>
                </div>
                <button
                  onClick={() => {
                    setIsCartDrawerOpen(false);
                    onContinueShopping();
                  }}
                  className="px-6 py-2.5 rounded-xl bg-[#882434] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#6E1B28] transition-colors cursor-pointer"
                >
                  Start Shopping
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.id}
                  className="p-3.5 rounded-2xl bg-white border border-[#EAE4DA] shadow-2xs space-y-3"
                >
                  <div className="flex gap-3">
                    {/* Item Image (uses personalized photo if uploaded, otherwise product default) */}
                    <div className="w-16 h-16 rounded-xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200 relative">
                      <img
                        src={item.personalization?.photoUrl || item.product.images[0]}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                      {item.personalization?.photoUrl && (
                        <span className="absolute bottom-0 inset-x-0 bg-[#882434] text-[8px] text-white font-bold text-center py-0.2">
                          Custom
                        </span>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <h4 className="text-xs font-bold text-stone-900 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors p-0.5 cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Personalization Details Pill */}
                      {item.personalization && (
                        <div className="mt-1 p-1.5 rounded-lg bg-[#FAF8F5] border border-stone-200/60 text-[10px] space-y-0.5">
                          {item.personalization.customTextLine1 && (
                            <p className="text-stone-700 truncate">
                              <strong>Text:</strong> "{item.personalization.customTextLine1}"
                            </p>
                          )}
                          {item.personalization.customTextLine2 && (
                            <p className="text-stone-500 truncate">
                              <strong>Note:</strong> "{item.personalization.customTextLine2}"
                            </p>
                          )}
                        </div>
                      )}

                      {/* Gift Wrap Badge if selected */}
                      {item.isGiftWrapped && (
                        <span className="inline-flex items-center gap-1 text-[10px] text-[#882434] font-medium mt-1">
                          <Gift className="w-3 h-3" />
                          <span>Luxe Gift Wrap (+₹49)</span>
                        </span>
                      )}

                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs font-bold text-[#882434]">
                          {formatPrice(item.totalPrice)}
                        </span>

                        {/* Quantity Counter */}
                        <div className="flex items-center border border-stone-200 rounded-lg bg-stone-50 p-0.5">
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            className="p-1 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-200 transition-colors"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="w-6 text-center text-xs font-bold text-stone-800">
                            {item.quantity}
                          </span>
                          <button
                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            className="p-1 text-stone-500 hover:text-stone-900 rounded hover:bg-stone-200 transition-colors"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer Summary */}
          {cart.length > 0 && (
            <div className="p-4 sm:p-5 bg-white border-t border-[#EAE4DA] space-y-3">
              {/* Coupon Applicator */}
              {appliedCoupon ? (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2 text-emerald-800">
                    <Tag className="w-3.5 h-3.5 text-emerald-600" />
                    <span>
                      Coupon <strong>{appliedCoupon.code}</strong> applied (-{formatPrice(discount)})
                    </span>
                  </div>
                  <button
                    onClick={removeCoupon}
                    className="text-emerald-700 hover:text-emerald-900 font-bold text-[11px] underline cursor-pointer"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="space-y-1.5">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="Enter promo coupon code"
                      className="flex-1 bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs uppercase font-medium focus:outline-hidden focus:border-[#882434] transition-all"
                    />
                    <button
                      type="submit"
                      className="px-4 py-2 bg-stone-800 hover:bg-[#882434] text-white text-xs font-semibold rounded-xl transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </div>
                  {couponError && (
                    <p className="text-[11px] text-rose-600 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {couponError}
                    </p>
                  )}

                  {/* Clickable Quick Coupon chips */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {coupons.slice(0, 3).map((c) => (
                      <button
                        key={c.code}
                        type="button"
                        onClick={() => handleQuickCouponClick(c.code)}
                        className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FDF9EE] text-[#882434] border border-[#C59B27]/40 hover:bg-[#F9F0D8] cursor-pointer"
                      >
                        ⚡ Use {c.code}
                      </button>
                    ))}
                  </div>
                </form>
              )}

              {/* Price Calculation Breakdown */}
              <div className="space-y-1.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between text-emerald-600 font-medium">
                    <span>Coupon Savings</span>
                    <span>-{formatPrice(discount)}</span>
                  </div>
                )}
                {giftWrapFee > 0 && (
                  <div className="flex justify-between">
                    <span>Gift Wrap</span>
                    <span>+{formatPrice(giftWrapFee)}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span>Shipping Fee</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-emerald-600 font-bold uppercase text-[11px]">
                        FREE
                      </span>
                    ) : (
                      formatPrice(shippingFee)
                    )}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-1.5 border-t border-stone-200">
                  <span>Final Total</span>
                  <span className="text-base text-[#882434]">{formatPrice(total)}</span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  setIsCartDrawerOpen(false);
                  onProceedToCheckout();
                }}
                className="w-full py-3.5 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
              >
                <span>Proceed To Secure Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
