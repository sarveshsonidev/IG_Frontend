import { OccasionId } from '../types';

export interface OccasionInfo {
  id: OccasionId;
  title: string;
  subtitle: string;
  tagline: string;
  imageUrl: string;
  badge: string;
}

export const OCCASIONS: OccasionInfo[] = [
  {
    id: 'birthday',
    title: 'Birthday',
    subtitle: 'Make Their Special Day Unforgettable',
    tagline: 'Custom cakes, photo lamps & personalized keepsakes that make them smile.',
    imageUrl: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?q=80&w=800&auto=format&fit=crop',
    badge: 'Popular',
  },
  {
    id: 'anniversary',
    title: 'Anniversary',
    subtitle: 'Celebrate Years of Love & Togetherness',
    tagline: 'Engraved wooden plaques, star map frames & romantic couple photo lamps.',
    imageUrl: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?q=80&w=800&auto=format&fit=crop',
    badge: 'Top Pick',
  },
  {
    id: 'wedding',
    title: 'Wedding',
    subtitle: 'Cherished Keepsakes for the Happy Couple',
    tagline: 'Premium brass engraved nameplates, luxury couple watches & framed vows.',
    imageUrl: 'https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=800&auto=format&fit=crop',
    badge: 'Luxury',
  },
  {
    id: 'valentines',
    title: "Valentine's Day",
    subtitle: 'Romantic Gifts Straight from the Heart',
    tagline: 'Spotify acrylic plaques, couple initial bracelets & memory photo rolls.',
    imageUrl: 'https://images.unsplash.com/photo-1518199266791-5375a83190b7?q=80&w=800&auto=format&fit=crop',
    badge: 'Romantic',
  },
  {
    id: 'mothers-day',
    title: "Mother's Day",
    subtitle: 'A Tribute to Pure, Unconditional Love',
    tagline: 'Personalized kitchenware, engraved wooden mom frames & custom jewelry.',
    imageUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop',
    badge: 'Heartfelt',
  },
  {
    id: 'fathers-day',
    title: "Father's Day",
    subtitle: 'Thoughtful Gifts for the Best Dad',
    tagline: 'Laser engraved leather wallets, custom whiskey glasses & smart flasks.',
    imageUrl: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?q=80&w=800&auto=format&fit=crop',
    badge: 'Classic',
  },
  {
    id: 'friendship',
    title: 'Friendship',
    subtitle: 'Celebrate Your Partner-in-Crime',
    tagline: 'Quirky caricatures, matching best-friend tees & memory collage cushions.',
    imageUrl: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?q=80&w=800&auto=format&fit=crop',
    badge: 'Fun',
  },
  {
    id: 'festivals',
    title: 'Festivals',
    subtitle: 'Diwali, Rakhi, Eid & New Year Celebrations',
    tagline: 'Illuminated festive gift hampers, customized sweets boxes & brass diyas.',
    imageUrl: 'https://images.unsplash.com/photo-1514517521153-1be72277b32f?q=80&w=800&auto=format&fit=crop',
    badge: 'Festive',
  },
  {
    id: 'corporate',
    title: 'Corporate Events',
    subtitle: 'Reward Teams & Impress Valued Clients',
    tagline: 'Logo engraved tech accessories, executive desk sets & onboarding hampers.',
    imageUrl: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?q=80&w=800&auto=format&fit=crop',
    badge: 'B2B',
  },
  {
    id: 'just-because',
    title: 'Just Because',
    subtitle: 'No Occasion Needed to Spread Happiness',
    tagline: 'Surprise mugs, mini photo magnets & comforting custom cuddly cushions.',
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
    badge: 'Trending',
  },
];
