import React, { useState } from 'react';
import { 
  Search, 
  Package, 
  CheckCircle2, 
  Clock, 
  Truck, 
  MapPin, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle
} from 'lucide-react';
import { useAdmin } from '../context/AdminContext';
import { useShop } from '../context/ShopContext';
import { Order, OrderStatus } from '../types';
import { API_BASE_URL } from '../services/api';

interface TrackOrderPageProps {
  initialOrderId?: string;
  onSelectProduct: (product: any) => void;
}

export const TrackOrderPage: React.FC<TrackOrderPageProps> = ({ initialOrderId }) => {
  const { getOrderById } = useAdmin();
  const { formatPrice } = useShop();

  const [orderQuery, setOrderQuery] = useState(initialOrderId || 'IG-894102');
  const [searchedOrder, setSearchedOrder] = useState<Order | null>(() => {
    return getOrderById(initialOrderId || 'IG-894102') || null;
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTrackSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderQuery.trim()) return;

    setIsLoading(true);
    setErrorMessage('');

    try {
      const res = await fetch(`${API_BASE_URL}/orders/track/${encodeURIComponent(orderQuery.trim())}`);
      if (res.ok) {
        const backendOrder = await res.json();
        // Parse shipping address JSON
        let parsedAddress: any = {
          fullName: 'Customer',
          phone: '',
          streetAddress: '',
          city: '',
          state: '',
          pincode: '',
        };
        try {
          if (backendOrder.shippingAddressJson) {
            const addr = JSON.parse(backendOrder.shippingAddressJson);
            parsedAddress = {
              fullName: addr.name || 'Valued Customer',
              phone: addr.phone || '',
              streetAddress: addr.addressLine1 || '',
              city: addr.city || '',
              state: addr.state || '',
              pincode: addr.pincode || '',
            };
          }
        } catch (e) {
          // ignore
        }

        const adaptedOrder: Order = {
          id: backendOrder.id,
          orderNumber: backendOrder.orderNumber,
          trackingNumber: backendOrder.trackingNumber || 'TRK-IN',
          orderStatus: backendOrder.orderStatus as OrderStatus,
          deliveryMethod: (backendOrder.deliveryMethod || 'standard') as any,
          paymentMethod: (backendOrder.paymentMethod || 'upi') as any,
          paymentStatus: (backendOrder.paymentStatus || 'paid') as any,
          subtotal: backendOrder.subtotal || 0,
          discount: backendOrder.discount || 0,
          appliedCoupon: backendOrder.appliedCoupon,
          shippingFee: backendOrder.shippingFee || 0,
          giftWrapFee: backendOrder.giftWrapFee || 0,
          tax: backendOrder.tax || 0,
          total: backendOrder.total || 0,
          createdAt: backendOrder.createdAt || new Date().toISOString(),
          estimatedDeliveryDate: backendOrder.estimatedDeliveryDate || '3-5 business days',
          shippingAddress: parsedAddress,
          items: (backendOrder.items || []).map((it: any) => ({
            id: `item-${it.id}`,
            product: {
              id: it.productId,
              name: it.productTitle,
              price: it.unitPrice,
              images: [it.productImage],
              category: 'gifts',
            } as any,
            quantity: it.quantity,
            unitPrice: it.unitPrice,
            totalPrice: it.unitPrice * it.quantity,
            personalization: it.customText ? {
              customTextLine1: it.customText,
              fontId: it.customFont,
              colorId: it.customColor,
            } : undefined,
            isGiftWrapped: it.giftWrap,
            giftMessage: it.giftMessage,
          })),
          timeline: (backendOrder.timeline || []).map((tl: any) => ({
            status: tl.status as OrderStatus,
            description: tl.description,
            timestamp: new Date(tl.timestamp).toLocaleString('en-IN', { dateStyle: 'medium', timeStyle: 'short' }),
            completed: tl.completed,
          })),
        };

        setSearchedOrder(adaptedOrder);
        setIsLoading(false);
        return;
      }
    } catch {
      // Fallback to local context
    }

    const found = getOrderById(orderQuery.trim());
    if (found) {
      setSearchedOrder(found);
      setErrorMessage('');
    } else {
      setSearchedOrder(null);
      setErrorMessage(`No order found matching "${orderQuery}". Try "IG-26825" or "IG-894102".`);
    }
    setIsLoading(false);
  };

  const stages: { label: OrderStatus; desc: string; icon: string }[] = [
    { label: 'Order Placed', desc: 'Order received and logged', icon: '📝' },
    { label: 'Confirmed', desc: 'Payment authorized & verified', icon: '💳' },
    { label: 'Personalization in Progress', desc: 'Craftsman laser engraving / UV printing', icon: '✨' },
    { label: 'Processing', desc: 'Quality inspection & luxury gift packaging', icon: '🎁' },
    { label: 'Shipped', desc: 'Dispatched with BlueDart / Express Air', icon: '✈️' },
    { label: 'Out for Delivery', desc: 'Courier on the way to your door', icon: '🚚' },
    { label: 'Delivered', desc: 'Delivered with love & smiles', icon: '🎉' },
  ];

  const currentStageIndex = searchedOrder
    ? stages.findIndex(s => s.label === searchedOrder.orderStatus)
    : -1;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      {/* Search Header */}
      <div className="text-center max-w-xl mx-auto space-y-3">
        <span className="text-xs font-bold text-[#882434] uppercase tracking-wider">
          Real-Time Tracking
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-stone-900">
          Track Your Personalized Gift
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Follow your custom gift’s journey from artisan workbench to recipient doorstep
        </p>

        <form onSubmit={handleTrackSubmit} className="pt-3 max-w-md mx-auto flex gap-2">
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder="Enter Order ID (e.g. IG-894102)"
            className="flex-1 bg-white border border-stone-200 rounded-xl px-4 py-3 text-xs font-semibold focus:outline-hidden focus:border-[#882434] shadow-xs"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-[#882434] hover:bg-[#6E1B28] text-white text-xs font-bold uppercase rounded-xl transition-colors cursor-pointer shadow-md"
          >
            Track
          </button>
        </form>

        {errorMessage && (
          <p className="text-xs text-rose-600 flex items-center justify-center gap-1">
            <AlertCircle className="w-3.5 h-3.5" />
            {errorMessage}
          </p>
        )}
      </div>

      {/* Tracking Card */}
      {searchedOrder && (
        <div className="luxury-card rounded-3xl p-6 sm:p-8 bg-white border border-[#EAE4DA] shadow-lg space-y-8 animate-in fade-in duration-300">
          {/* Header metadata */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-100 pb-5">
            <div>
              <div className="text-xs text-stone-400 font-bold uppercase">Order Reference</div>
              <div className="text-xl font-serif font-bold text-stone-900 flex items-center gap-2">
                <span>{searchedOrder.orderNumber}</span>
                <span className="text-xs font-sans font-bold px-2.5 py-0.5 rounded-full bg-[#882434]/10 text-[#882434]">
                  {searchedOrder.orderStatus}
                </span>
              </div>
            </div>

            <div className="text-left sm:text-right space-y-0.5">
              <div className="text-xs text-stone-400 font-bold uppercase">Carrier Tracking</div>
              <div className="text-xs font-mono font-bold text-stone-800">
                {searchedOrder.trackingNumber}
              </div>
              <div className="text-[11px] text-emerald-700 font-semibold">
                Est. Delivery: {searchedOrder.estimatedDeliveryDate}
              </div>
            </div>
          </div>

          {/* Interactive Visual Timeline */}
          <div className="space-y-4">
            <h3 className="font-serif text-base font-bold text-stone-900">
              Live Production & Delivery Journey
            </h3>

            <div className="relative pl-6 sm:pl-8 border-l-2 border-stone-200 space-y-8 py-2">
              {stages.map((stg, idx) => {
                const isPassed = idx <= currentStageIndex;
                const isCurrent = idx === currentStageIndex;
                const timelineStep = searchedOrder.timeline.find(t => t.status === stg.label);

                return (
                  <div key={stg.label} className="relative group">
                    {/* Circle Node on Timeline */}
                    <div
                      className={`absolute -left-[31px] sm:-left-[39px] top-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all shadow-xs ${
                        isCurrent
                          ? 'bg-[#882434] text-white ring-4 ring-[#882434]/20 animate-pulse-subtle'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-white border-2 border-stone-300 text-stone-400'
                      }`}
                    >
                      {isPassed ? <CheckCircle2 className="w-4 h-4" /> : idx + 1}
                    </div>

                    <div className="space-y-1">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                        <h4 className={`text-sm font-bold ${isCurrent ? 'text-[#882434]' : isPassed ? 'text-stone-900' : 'text-stone-400'}`}>
                          {stg.icon} {stg.label}
                        </h4>
                        {timelineStep?.timestamp && (
                          <span className="text-[11px] text-stone-400 font-medium">
                            {timelineStep.timestamp}
                          </span>
                        )}
                      </div>

                      <p className="text-xs text-stone-500">
                        {timelineStep?.description || stg.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order Details & Customized Previews */}
          <div className="pt-6 border-t border-stone-100 space-y-4">
            <h4 className="font-serif text-sm font-bold text-stone-900">
              Items in this Package
            </h4>

            <div className="space-y-3">
              {searchedOrder.items.map((item) => (
                <div key={item.id} className="p-3.5 rounded-2xl bg-[#FAF8F5] border border-stone-200/80 flex gap-4 items-center">
                  <img
                    src={item.personalization?.photoUrl || item.product.images[0]}
                    alt={item.product.name}
                    className="w-16 h-16 rounded-xl object-cover shrink-0 border border-stone-200"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="font-serif text-xs font-bold text-stone-900 truncate">
                      {item.product.name}
                    </h5>
                    {item.personalization?.customTextLine1 && (
                      <p className="text-[11px] text-[#882434] font-medium truncate">
                        Custom: "{item.personalization.customTextLine1}"
                      </p>
                    )}
                    <span className="text-[11px] text-stone-500">
                      Qty: {item.quantity} • Total: {formatPrice(item.totalPrice)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Destination */}
          <div className="p-4 bg-stone-50 rounded-2xl text-xs text-stone-600 flex items-start gap-3">
            <MapPin className="w-4 h-4 text-[#882434] shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-stone-900">Delivery Address: </span>
              <span>
                {searchedOrder.shippingAddress.fullName}, {searchedOrder.shippingAddress.streetAddress}, {searchedOrder.shippingAddress.city}, {searchedOrder.shippingAddress.state} - {searchedOrder.shippingAddress.pincode}
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
