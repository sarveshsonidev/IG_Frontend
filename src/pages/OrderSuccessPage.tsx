import React from 'react';
import { 
  CheckCircle2, 
  Package, 
  Truck, 
  Printer, 
  ArrowRight, 
  MapPin, 
  Gift, 
  Calendar,
  Sparkles
} from 'lucide-react';
import { Order } from '../types';
import { useShop } from '../context/ShopContext';

interface OrderSuccessPageProps {
  order: Order;
  onTrackOrder: (orderId: string) => void;
  onContinueShopping: () => void;
}

export const OrderSuccessPage: React.FC<OrderSuccessPageProps> = ({
  order,
  onTrackOrder,
  onContinueShopping,
}) => {
  const { formatPrice } = useShop();

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
      {/* Success Hero Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-md animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <span className="text-xs font-bold text-[#882434] uppercase tracking-wider">
          Order Confirmed
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Your Gift Is On Its Way! 🎁
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          Thank you for choosing ImpressiveGifts. Our master artisans have received your customization details and will begin crafting your keepsake with love.
        </p>

        <div className="pt-1 flex items-center justify-center gap-2 text-xs font-semibold text-stone-700">
          <span>Order Number:</span>
          <span className="bg-[#FAF8F5] border border-stone-300 px-2.5 py-1 rounded-lg font-mono text-[#882434] font-bold text-sm">
            {order.orderNumber}
          </span>
        </div>
      </div>

      {/* Main Order Card */}
      <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-white border border-[#EAE4DA] shadow-lg space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#FDF9EE] border border-[#C59B27]/40 text-[#882434] flex items-center justify-center">
              <Truck className="w-5 h-5 text-[#C59B27]" />
            </div>
            <div>
              <div className="text-xs font-bold text-stone-900">Estimated Delivery:</div>
              <div className="text-sm font-semibold text-emerald-700">
                {order.estimatedDeliveryDate}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl border border-stone-200 hover:bg-stone-50 text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Download Invoice</span>
            </button>

            <button
              onClick={() => onTrackOrder(order.orderNumber)}
              className="px-5 py-2 rounded-xl bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 shadow-md transition-all cursor-pointer"
            >
              <span>Track Live Order</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Ordered Items List with Personalization Previews */}
        <div className="space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-stone-400">
            Custom Items in this Order ({order.items.length})
          </h4>

          <div className="space-y-3 divide-y divide-stone-100">
            {order.items.map((item) => (
              <div key={item.id} className="pt-3 first:pt-0 flex gap-4 items-start">
                <div className="w-20 h-20 rounded-2xl overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <img
                    src={item.personalization?.photoUrl || item.product.images[0]}
                    alt={item.product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 space-y-1">
                  <h5 className="font-serif text-sm font-bold text-stone-900">
                    {item.product.name}
                  </h5>

                  {item.personalization && (
                    <div className="p-2 rounded-xl bg-[#FAF8F5] border border-stone-200/60 text-xs space-y-0.5 max-w-md">
                      {item.personalization.customTextLine1 && (
                        <p className="text-stone-700">
                          <strong>Custom Text:</strong> "{item.personalization.customTextLine1}"
                        </p>
                      )}
                      {item.personalization.customTextLine2 && (
                        <p className="text-stone-500">
                          <strong>Date / Subtext:</strong> "{item.personalization.customTextLine2}"
                        </p>
                      )}
                    </div>
                  )}

                  <div className="text-xs text-stone-500">
                    Qty: {item.quantity} • {formatPrice(item.unitPrice)} each
                  </div>
                </div>

                <div className="text-sm font-bold text-[#882434]">
                  {formatPrice(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address & Payment Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-stone-100 text-xs">
          <div className="space-y-2">
            <h5 className="font-bold text-stone-900 uppercase tracking-wider">
              Delivery Address:
            </h5>
            <p className="text-stone-600 leading-relaxed">
              <strong>{order.shippingAddress.fullName}</strong><br />
              {order.shippingAddress.streetAddress}<br />
              {order.shippingAddress.landmark && `${order.shippingAddress.landmark}, `}
              {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}<br />
              Phone: {order.shippingAddress.phone}
            </p>
          </div>

          <div className="space-y-1.5 bg-stone-50 p-4 rounded-2xl border border-stone-200/60">
            <div className="flex justify-between text-stone-600">
              <span>Subtotal</span>
              <span>{formatPrice(order.subtotal)}</span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-emerald-600 font-semibold">
                <span>Discount</span>
                <span>-{formatPrice(order.discount)}</span>
              </div>
            )}
            <div className="flex justify-between text-stone-600">
              <span>Delivery Fee</span>
              <span>{order.shippingFee === 0 ? 'FREE' : formatPrice(order.shippingFee)}</span>
            </div>
            {order.giftWrapFee > 0 && (
              <div className="flex justify-between text-stone-600">
                <span>Luxe Gift Box</span>
                <span>+{formatPrice(order.giftWrapFee)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
              <span>Total Paid ({order.paymentMethod.toUpperCase()})</span>
              <span className="text-[#882434]">{formatPrice(order.total)}</span>
            </div>
          </div>
        </div>

        {/* Bottom CTAs */}
        <div className="pt-4 text-center">
          <button
            onClick={onContinueShopping}
            className="text-xs text-[#882434] hover:underline font-semibold cursor-pointer"
          >
            ← Continue Browsing More Gifts
          </button>
        </div>
      </div>
    </div>
  );
};
