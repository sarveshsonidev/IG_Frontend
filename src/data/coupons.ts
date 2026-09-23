import { Coupon } from '../types';

export const AVAILABLE_COUPONS: Coupon[] = [
  {
    code: 'FIRST10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 499,
    maxDiscount: 250,
    expiryDate: '2026-12-31',
    description: '10% OFF on your very first order (Min order ₹499)',
    isActive: true,
  },
  {
    code: 'CELEBRATE500',
    discountType: 'fixed',
    discountValue: 500,
    minOrderValue: 2499,
    expiryDate: '2026-12-31',
    description: 'Flat ₹500 OFF on orders above ₹2,499',
    isActive: true,
  },
  {
    code: 'FESTIVE20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderValue: 1499,
    maxDiscount: 600,
    expiryDate: '2026-12-31',
    description: 'Special 20% festive celebration discount (Max ₹600)',
    isActive: true,
  },
  {
    code: 'LOVEGIFTS',
    discountType: 'fixed',
    discountValue: 150,
    minOrderValue: 999,
    expiryDate: '2026-12-31',
    description: 'Flat ₹150 OFF on couple & anniversary gifts',
    isActive: true,
  },
];
