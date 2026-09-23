export type CategoryId = 
  | 'mugs'
  | 'frames'
  | 'cushions'
  | 'keychains'
  | 'tshirts'
  | 'bottles'
  | 'lamps'
  | 'watches'
  | 'diaries'
  | 'photo-gifts'
  | 'home-decor'
  | 'corporate';

export type OccasionId = 
  | 'birthday'
  | 'anniversary'
  | 'wedding'
  | 'valentines'
  | 'mothers-day'
  | 'fathers-day'
  | 'friendship'
  | 'festivals'
  | 'corporate'
  | 'just-because';

export type RecipientTag = 
  | 'Wife'
  | 'Husband'
  | 'Girlfriend'
  | 'Boyfriend'
  | 'Mother'
  | 'Father'
  | 'Friend'
  | 'Brother'
  | 'Sister'
  | 'Colleague'
  | 'Client';

export type PersonalizationType = 'photo' | 'text' | 'both' | 'none';

export type BadgeType = 'Bestseller' | 'Trending' | 'New' | 'Limited Stock' | 'Top Rated' | 'Luxury';

export interface Product {
  id: string;
  name: string;
  slug: string;
  tagline: string;
  category: CategoryId;
  occasions: OccasionId[];
  recipients: RecipientTag[];
  price: number;
  originalPrice: number;
  discountPercentage: number;
  rating: number;
  reviewCount: number;
  images: string[];
  badge?: BadgeType;
  stock: number;
  isPersonalizable: boolean;
  personalizationType: PersonalizationType;
  personalizationOptions?: {
    maxTextLength?: number;
    textPlaceholder?: string;
    allowMultipleLines?: boolean;
    allowedFonts?: { id: string; name: string; cssFamily: string }[];
    allowedColors?: { id: string; name: string; hex: string }[];
    designTemplates?: { id: string; name: string; preview: string }[];
    photoAspect?: 'square' | 'portrait' | 'landscape';
    requirePhoto?: boolean;
    previewOverlayType: 'mug' | 'frame' | 'cushion' | 'lamp' | 'plaque' | 'watch' | 'diary' | 'bottle' | 'general';
  };
  description: string;
  specifications: { [key: string]: string };
  instructions: string[];
  faq: { q: string; a: string }[];
  isExpressAvailable: boolean;
  createdAt: string;
}

export interface PersonalizationData {
  photoUrl?: string;
  photoFile?: string; // base64
  customTextLine1?: string;
  customTextLine2?: string;
  customTextLine3?: string;
  fontId?: string;
  colorId?: string;
  templateId?: string;
  recipientName?: string;
  giftMessage?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  personalization?: PersonalizationData;
  isGiftWrapped: boolean;
  giftMessage?: string;
  isAnonymousGift: boolean;
  unitPrice: number;
  totalPrice: number;
}

export interface UserAddress {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  streetAddress: string;
  landmark?: string;
  city: string;
  state: string;
  pincode: string;
  isDefault?: boolean;
}

export type OrderStatus = 
  | 'Order Placed'
  | 'Confirmed'
  | 'Personalization in Progress'
  | 'Processing'
  | 'Shipped'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Cancelled';

export interface OrderTimelineStep {
  status: OrderStatus;
  timestamp: string;
  description: string;
  completed: boolean;
}

export interface Order {
  id: string;
  orderNumber: string;
  items: CartItem[];
  shippingAddress: UserAddress;
  deliveryMethod: 'standard' | 'express';
  paymentMethod: 'upi' | 'card' | 'netbanking' | 'cod';
  paymentStatus: 'paid' | 'pending' | 'cod_pending';
  orderStatus: OrderStatus;
  trackingNumber: string;
  timeline: OrderTimelineStep[];
  subtotal: number;
  discount: number;
  appliedCoupon?: string;
  shippingFee: number;
  giftWrapFee: number;
  tax: number;
  total: number;
  createdAt: string;
  estimatedDeliveryDate: string;
}

export interface Coupon {
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderValue: number;
  maxDiscount?: number;
  expiryDate: string;
  description: string;
  isActive: boolean;
}

export interface CorporateEnquiry {
  id: string;
  companyName: string;
  contactPerson: string;
  email: string;
  phone: string;
  estimatedQuantity: number;
  approximateBudget: string;
  occasion: string;
  requirements: string;
  referenceFileUrl?: string;
  status: 'New' | 'Under Review' | 'Quoted' | 'Converted' | 'Closed';
  createdAt: string;
}

export interface CustomerReview {
  id: string;
  productId: string;
  productName: string;
  customerName: string;
  customerCity: string;
  avatarUrl: string;
  rating: number;
  date: string;
  reviewTitle: string;
  reviewText: string;
  customerPhotoUrl?: string;
  isVerifiedBuyer: boolean;
}

export interface UserProfile {
  name: string;
  email: string;
  phone: string;
  birthday?: string;
  anniversary?: string;
  savedAddresses: UserAddress[];
  savedDesigns: {
    id: string;
    productTitle: string;
    previewUrl: string;
    date: string;
  }[];
}
