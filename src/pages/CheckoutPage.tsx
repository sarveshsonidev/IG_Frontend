import React, { useState } from 'react';
import { 
  ShieldCheck, 
  MapPin, 
  Truck, 
  CreditCard, 
  CheckCircle2, 
  ArrowLeft, 
  Lock, 
  QrCode, 
  Smartphone, 
  Banknote, 
  Sparkles,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { useShop } from '../context/ShopContext';
import { useAdmin } from '../context/AdminContext';
import { useAuth } from '../context/AuthContext';
import { UserAddress, Order } from '../types';

interface CheckoutPageProps {
  onOrderSuccess: (order: Order) => void;
  onBackToCart: () => void;
}

export const CheckoutPage: React.FC<CheckoutPageProps> = ({
  onOrderSuccess,
  onBackToCart,
}) => {
  const { 
    cart, 
    clearCart, 
    subtotal, 
    discount, 
    appliedCoupon, 
    giftWrapFee, 
    formatPrice, 
    showToast 
  } = useShop();

  const { createOrder } = useAdmin();
  const { user, saveAddress } = useAuth();

  // 3-step state
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);

  // Step 1: Address Form
  const [address, setAddress] = useState<Omit<UserAddress, 'id'>>({
    fullName: user.name || 'Rahul Sharma',
    phone: user.phone || '+91 9820123456',
    email: user.email || 'rahul.sharma@example.com',
    streetAddress: 'Flat 402, Sea Green Heights, Bandra West',
    landmark: 'Near Carter Road Promenade',
    city: 'Mumbai',
    state: 'Maharashtra',
    pincode: '400050',
    isDefault: true,
  });

  // Step 2: Delivery Option
  const [deliveryMethod, setDeliveryMethod] = useState<'standard' | 'express'>('standard');

  // Step 3: Payment Method
  const [paymentMethod, setPaymentMethod] = useState<'upi' | 'card' | 'netbanking' | 'cod'>('upi');
  const [upiId, setUpiId] = useState('rahul@okhdfcbank');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('888');
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

  // Delivery costs
  const shippingFee = deliveryMethod === 'express' ? 149 : (subtotal >= 999 ? 0 : 99);
  const finalTotal = Math.max(0, subtotal - discount + shippingFee + giftWrapFee);

  const handleStep1Submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.streetAddress || !address.pincode) {
      showToast('Please fill all required address details.', 'error');
      return;
    }
    setCurrentStep(2);
  };

  const handleStep2Submit = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentStep(3);
  };

  const handlePlaceOrder = () => {
    setIsProcessingPayment(true);

    // Simulate bank authorization & Razorpay gateway
    setTimeout(() => {
      setIsProcessingPayment(false);

      // Trigger Confetti!
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#882434', '#C59B27', '#F5D061', '#10B981'],
        });
      } catch (e) {
        // ignore if canvas-confetti unsupported
      }

      // Create Order
      const newOrder = createOrder({
        items: [...cart],
        shippingAddress: {
          ...address,
          id: `addr-${Date.now().toString(36)}`,
        },
        deliveryMethod,
        paymentMethod,
        paymentStatus: paymentMethod === 'cod' ? 'cod_pending' : 'paid',
        orderStatus: 'Order Placed',
        subtotal,
        discount,
        appliedCoupon: appliedCoupon?.code,
        shippingFee,
        giftWrapFee,
        tax: 0,
        total: finalTotal,
        estimatedDeliveryDate: deliveryMethod === 'express' ? 'Tomorrow, Guaranteed' : 'In 3-4 Business Days',
      });

      // Clear cart
      clearCart();
      showToast('Order placed successfully! 🎉', 'success');
      onOrderSuccess(newOrder);
    }, 1200);
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-20 px-4 text-center space-y-4">
        <h2 className="font-serif text-2xl font-bold text-stone-900">Your cart is empty</h2>
        <p className="text-xs text-stone-500">Please add items to cart before proceeding to checkout.</p>
        <button
          onClick={onBackToCart}
          className="px-6 py-2.5 rounded-xl bg-[#882434] text-white text-xs font-bold"
        >
          Return to Shop
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Header */}
      <div className="flex items-center justify-between border-b border-stone-200 pb-4">
        <button
          onClick={onBackToCart}
          className="flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-[#882434] transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Cart</span>
        </button>

        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>256-Bit Bank Grade SSL Encrypted Checkout</span>
        </div>
      </div>

      {/* 3-Step Wizard Navigation */}
      <div className="max-w-xl mx-auto">
        <div className="flex items-center justify-between relative">
          <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-stone-200 -z-10" />
          
          {/* Step 1 Pill */}
          <button
            onClick={() => setCurrentStep(1)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              currentStep >= 1
                ? 'bg-[#882434] text-white ring-4 ring-[#882434]/20'
                : 'bg-stone-200 text-stone-600'
            }`}
          >
            1
          </button>

          {/* Step 2 Pill */}
          <button
            onClick={() => currentStep > 2 && setCurrentStep(2)}
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              currentStep >= 2
                ? 'bg-[#882434] text-white ring-4 ring-[#882434]/20'
                : 'bg-white border-2 border-stone-300 text-stone-600'
            }`}
          >
            2
          </button>

          {/* Step 3 Pill */}
          <button
            className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-xs transition-all ${
              currentStep === 3
                ? 'bg-[#882434] text-white ring-4 ring-[#882434]/20'
                : 'bg-white border-2 border-stone-300 text-stone-600'
            }`}
          >
            3
          </button>
        </div>

        <div className="flex justify-between text-[11px] font-bold uppercase tracking-wider text-stone-500 pt-2 text-center">
          <span className={currentStep >= 1 ? 'text-[#882434]' : ''}>1. Shipping Address</span>
          <span className={currentStep >= 2 ? 'text-[#882434]' : ''}>2. Delivery Speed</span>
          <span className={currentStep === 3 ? 'text-[#882434]' : ''}>3. Secure Payment</span>
        </div>
      </div>

      {/* Main Checkout Layout: Form + Order Summary Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Left Steps Column */}
        <div className="lg:col-span-7 space-y-6">
          {/* STEP 1: ADDRESS */}
          {currentStep === 1 && (
            <form onSubmit={handleStep1Submit} className="luxury-card rounded-3xl p-6 sm:p-8 bg-white border border-[#EAE4DA] space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <MapPin className="w-5 h-5 text-[#882434]" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Where should we send your gift?
                </h3>
              </div>

              {/* Saved Address presets */}
              {user.savedAddresses.length > 0 && (
                <div className="p-3 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 space-y-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-stone-500">
                    Use Saved Address:
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {user.savedAddresses.map((addr) => (
                      <button
                        key={addr.id}
                        type="button"
                        onClick={() => setAddress(addr)}
                        className={`text-xs p-2 rounded-xl border text-left cursor-pointer ${
                          address.streetAddress === addr.streetAddress
                            ? 'border-[#882434] bg-white font-semibold text-[#882434]'
                            : 'border-stone-200 bg-white text-stone-700'
                        }`}
                      >
                        {addr.fullName} ({addr.city})
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Recipient Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Mobile Number (For Courier SMS Updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434]"
                  />
                </div>

                <div className="sm:col-span-2 space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Flat / House No. / Building / Street Address *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.streetAddress}
                    onChange={(e) => setAddress({ ...address, streetAddress: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    value={address.landmark || ''}
                    onChange={(e) => setAddress({ ...address, landmark: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    PIN Code (6 Digits) *
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={6}
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value.replace(/\D/g, '') })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold focus:bg-white focus:outline-hidden focus:border-[#882434]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    City *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434]"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs font-bold uppercase tracking-wider text-stone-700">
                    State *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:bg-white focus:outline-hidden focus:border-[#882434]"
                  />
                </div>
              </div>

              <div className="pt-3">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-md cursor-pointer"
                >
                  <span>Continue to Delivery Options</span>
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: DELIVERY OPTIONS */}
          {currentStep === 2 && (
            <form onSubmit={handleStep2Submit} className="luxury-card rounded-3xl p-6 sm:p-8 bg-white border border-[#EAE4DA] space-y-5 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <Truck className="w-5 h-5 text-[#882434]" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Select Delivery Speed
                </h3>
              </div>

              <div className="space-y-3">
                {/* Standard Shipping */}
                <label className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  deliveryMethod === 'standard' ? 'border-[#882434] bg-[#882434]/5' : 'border-stone-200 hover:border-stone-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'standard'}
                      onChange={() => setDeliveryMethod('standard')}
                      className="w-4 h-4 text-[#882434]"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900">Standard Surface Shipping</div>
                      <div className="text-[11px] text-stone-500">Delivered in 3 to 4 business days</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-stone-900">
                    {subtotal >= 999 ? <span className="text-emerald-700">FREE</span> : '₹99'}
                  </span>
                </label>

                {/* Express Shipping */}
                <label className={`p-4 rounded-2xl border-2 flex items-center justify-between cursor-pointer transition-all ${
                  deliveryMethod === 'express' ? 'border-[#882434] bg-[#882434]/5' : 'border-stone-200 hover:border-stone-300'
                }`}>
                  <div className="flex items-center gap-3">
                    <input
                      type="radio"
                      name="delivery"
                      checked={deliveryMethod === 'express'}
                      onChange={() => setDeliveryMethod('express')}
                      className="w-4 h-4 text-[#882434]"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                        <span>⚡ Premium Air Express Dispatch</span>
                        <span className="text-[9px] bg-amber-100 text-amber-900 font-bold px-1.5 py-0.2 rounded">Fastest</span>
                      </div>
                      <div className="text-[11px] text-stone-500">Priority crafting + BlueDart Next-Day Air delivery</div>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-[#882434]">₹149</span>
                </label>
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setCurrentStep(1)}
                  className="px-5 py-3 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-600"
                >
                  Back
                </button>
                <button
                  type="submit"
                  className="flex-1 py-3.5 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider shadow-md"
                >
                  Proceed to Payment
                </button>
              </div>
            </form>
          )}

          {/* STEP 3: PAYMENT */}
          {currentStep === 3 && (
            <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-white border border-[#EAE4DA] space-y-6 animate-in fade-in duration-200">
              <div className="flex items-center gap-2.5 pb-3 border-b border-stone-100">
                <CreditCard className="w-5 h-5 text-[#882434]" />
                <h3 className="font-serif text-xl font-bold text-stone-900">
                  Select Payment Method
                </h3>
              </div>

              {/* Payment Methods Tabs */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('upi')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'upi' ? 'border-[#882434] bg-[#882434]/10 text-[#882434] font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Smartphone className="w-5 h-5 mx-auto mb-1 text-[#882434]" />
                  <span className="text-xs">UPI / GPay / QR</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'card' ? 'border-[#882434] bg-[#882434]/10 text-[#882434] font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <CreditCard className="w-5 h-5 mx-auto mb-1 text-[#882434]" />
                  <span className="text-xs">Credit / Debit</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('netbanking')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'netbanking' ? 'border-[#882434] bg-[#882434]/10 text-[#882434] font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Lock className="w-5 h-5 mx-auto mb-1 text-[#882434]" />
                  <span className="text-xs">Net Banking</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cod')}
                  className={`p-3 rounded-2xl border text-center transition-all cursor-pointer ${
                    paymentMethod === 'cod' ? 'border-[#882434] bg-[#882434]/10 text-[#882434] font-bold' : 'border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  <Banknote className="w-5 h-5 mx-auto mb-1 text-[#882434]" />
                  <span className="text-xs">Cash on Delivery</span>
                </button>
              </div>

              {/* Payment Details Container */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200">
                {paymentMethod === 'upi' && (
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-xs font-semibold text-stone-800">
                      <QrCode className="w-4 h-4 text-[#882434]" />
                      <span>Instant UPI Payment (PhonePe, GPay, Paytm)</span>
                    </div>

                    <input
                      type="text"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="username@upi"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium"
                    />
                    <p className="text-[11px] text-stone-500">
                      A payment request will be sent to your UPI app, or scan the on-screen QR code on desktop.
                    </p>
                  </div>
                )}

                {paymentMethod === 'card' && (
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      placeholder="Card Number"
                      className="w-full px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="text"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        placeholder="MM/YY"
                        className="px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium"
                      />
                      <input
                        type="password"
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        placeholder="CVV"
                        className="px-3.5 py-2.5 bg-white border border-stone-200 rounded-xl text-xs font-medium"
                      />
                    </div>
                  </div>
                )}

                {paymentMethod === 'netbanking' && (
                  <div className="space-y-2 text-xs text-stone-700">
                    <p className="font-semibold">Select your Bank:</p>
                    <div className="grid grid-cols-2 gap-2">
                      {['HDFC Bank', 'ICICI Bank', 'State Bank of India', 'Axis Bank'].map((b) => (
                        <div key={b} className="p-2 bg-white rounded-lg border border-stone-200 font-medium">
                          {b}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {paymentMethod === 'cod' && (
                  <div className="text-xs text-stone-700 space-y-1">
                    <p className="font-bold text-amber-900">Cash on Delivery Available</p>
                    <p className="text-stone-500 text-[11px]">
                      Please keep exact cash ready at the time of delivery. A verification code will be sent to your phone.
                    </p>
                  </div>
                )}
              </div>

              {/* Pay Now Button */}
              <div className="pt-2">
                <button
                  type="button"
                  disabled={isProcessingPayment}
                  onClick={handlePlaceOrder}
                  className="w-full py-4 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all cursor-pointer disabled:opacity-50"
                >
                  {isProcessingPayment ? (
                    <span>Securing Order with Bank...</span>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>Pay & Place Order ({formatPrice(finalTotal)})</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Order Items & Price Summary Sidebar */}
        <div className="lg:col-span-5 space-y-4">
          <div className="luxury-card rounded-3xl p-6 bg-white border border-[#EAE4DA] space-y-4">
            <h3 className="font-serif text-lg font-bold text-stone-900 border-b border-stone-100 pb-3">
              Order Items ({cart.length})
            </h3>

            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {cart.map((item) => (
                <div key={item.id} className="flex gap-3 text-xs">
                  <img
                    src={item.personalization?.photoUrl || item.product.images[0]}
                    alt={item.product.name}
                    className="w-14 h-14 rounded-xl object-cover shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-bold text-stone-900 line-clamp-1">{item.product.name}</h4>
                    <p className="text-stone-500 text-[11px]">Qty: {item.quantity}</p>
                    {item.personalization?.customTextLine1 && (
                      <p className="text-[#882434] text-[10px] truncate">
                        Custom: "{item.personalization.customTextLine1}"
                      </p>
                    )}
                  </div>
                  <span className="font-bold text-stone-900">{formatPrice(item.totalPrice)}</span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 pt-3 border-t border-stone-100 text-xs text-stone-600">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-stone-900">{formatPrice(subtotal)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Coupon Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
              {giftWrapFee > 0 && (
                <div className="flex justify-between">
                  <span>Gift Box & Ribbon</span>
                  <span>+{formatPrice(giftWrapFee)}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping ({deliveryMethod})</span>
                <span>{shippingFee === 0 ? <strong className="text-emerald-700">FREE</strong> : formatPrice(shippingFee)}</span>
              </div>
              <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="text-lg text-[#882434]">{formatPrice(finalTotal)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
