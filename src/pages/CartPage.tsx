import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  ArrowRight, 
  Gift, 
  Sparkles, 
  Check, 
  Tag, 
  AlertCircle 
} from 'lucide-react';
import { useShop } from '../context/ShopContext';

interface CartPageProps {
  onProceedToCheckout: () => void;
  onContinueShopping: () => void;
  onSelectProduct: (product: any) => void;
}

export const CartPage: React.FC<CartPageProps> = ({
  onProceedToCheckout,
  onContinueShopping,
}) => {
  const {
    cart,
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
  } = useShop();

  const [couponInput, setCouponInput] = useState('');
  const [couponError, setCouponError] = useState('');

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

  const freeShippingProgress = Math.min(
    100,
    Math.round(((freeShippingThreshold - freeShippingRemaining) / freeShippingThreshold) * 100)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <div>
        <h1 className="font-serif text-3xl font-bold text-stone-900 flex items-center gap-2.5">
          <ShoppingBag className="w-7 h-7 text-[#882434]" />
          <span>Shopping Cart ({cart.length} items)</span>
        </h1>
      </div>

      {cart.length === 0 ? (
        <div className="luxury-card rounded-3xl p-16 text-center space-y-4 bg-white border border-[#EAE4DA]">
          <div className="w-16 h-16 rounded-full bg-stone-100 flex items-center justify-center mx-auto text-stone-400">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-serif text-xl font-bold text-stone-900">Your cart is empty</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Explore our personalized collection to craft something special today.
            </p>
          </div>
          <button
            onClick={onContinueShopping}
            className="px-6 py-2.5 rounded-xl bg-[#882434] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#6E1B28] cursor-pointer"
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Items Table */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free shipping bar */}
            <div className="p-4 rounded-2xl bg-[#FDF9EE] border border-[#E5BE53]/30">
              {freeShippingRemaining > 0 ? (
                <p className="text-xs text-[#701825] font-medium">
                  Add <strong>{formatPrice(freeShippingRemaining)}</strong> more for <strong>FREE Express Shipping</strong>!
                </p>
              ) : (
                <p className="text-xs text-emerald-800 font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-600" />
                  <span>You've unlocked FREE Shipping across India!</span>
                </p>
              )}
              <div className="w-full bg-[#EAE4DA] h-1.5 rounded-full mt-2 overflow-hidden">
                <div
                  className="bg-linear-to-r from-[#F5D061] to-[#882434] h-full rounded-full transition-all duration-500"
                  style={{ width: `${freeShippingProgress}%` }}
                />
              </div>
            </div>

            <div className="bg-white rounded-3xl border border-[#EAE4DA] shadow-xs divide-y divide-stone-100 overflow-hidden">
              {cart.map((item) => (
                <div key={item.id} className="p-5 flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.personalization?.photoUrl || item.product.images[0]}
                      alt={item.product.name}
                      className="w-20 h-20 rounded-2xl object-cover border border-stone-200 shrink-0"
                    />

                    <div className="space-y-1">
                      <h4 className="font-serif text-sm font-bold text-stone-900">{item.product.name}</h4>
                      {item.personalization?.customTextLine1 && (
                        <p className="text-xs text-[#882434] font-medium">
                          Custom: "{item.personalization.customTextLine1}"
                        </p>
                      )}
                      {item.isGiftWrapped && (
                        <span className="text-[11px] text-[#882434] flex items-center gap-1 font-semibold">
                          <Gift className="w-3 h-3" /> Luxe Gift Wrapped (+₹49)
                        </span>
                      )}
                      <div className="text-xs font-semibold text-stone-500">
                        {formatPrice(item.unitPrice)} each
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Quantity */}
                    <div className="flex items-center border border-stone-200 rounded-xl bg-stone-50 p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="w-8 text-center text-xs font-bold">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="p-1.5 text-stone-500 hover:text-stone-900 rounded-lg hover:bg-stone-200"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <div className="text-sm font-bold text-[#882434]">{formatPrice(item.totalPrice)}</div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="text-[11px] text-stone-400 hover:text-rose-600 underline font-medium cursor-pointer"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-4 luxury-card rounded-3xl p-6 bg-white border border-[#EAE4DA] shadow-xs space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Summary
            </h3>

            {/* Coupons */}
            {appliedCoupon ? (
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-300 text-xs flex items-center justify-between">
                <span>Coupon <strong>{appliedCoupon.code}</strong> (-{formatPrice(discount)})</span>
                <button onClick={removeCoupon} className="text-emerald-800 font-bold underline">Remove</button>
              </div>
            ) : (
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="Enter coupon"
                    className="flex-1 p-2 bg-stone-50 border rounded-xl text-xs uppercase"
                  />
                  <button type="submit" className="px-4 py-2 bg-stone-800 text-white rounded-xl text-xs font-bold">
                    Apply
                  </button>
                </div>
                {couponError && <p className="text-[11px] text-rose-600">{couponError}</p>}
              </form>
            )}

            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="font-bold text-stone-900">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Savings</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              {giftWrapFee > 0 && (
                <div className="flex justify-between">
                  <span>Gift Box</span>
                  <span>+{formatPrice(giftWrapFee)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Delivery</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total</span>
                <span className="text-lg text-[#882434]">{formatPrice(total)}</span>
              </div>
            </div>

            <button
              onClick={onProceedToCheckout}
              className="w-full py-4 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
            >
              <span>Proceed to Checkout</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
