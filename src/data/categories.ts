import { CategoryId } from '../types';

export interface CategoryInfo {
  id: CategoryId;
  name: string;
  shortDescription: string;
  itemCount: number;
  imageUrl: string;
  iconName: string;
  featured: boolean;
}

export const CATEGORIES: CategoryInfo[] = [
  {
    id: 'mugs',
    name: 'Personalized Mugs',
    shortDescription: 'Magic color-changing & customized ceramic mugs with photos',
    itemCount: 42,
    imageUrl: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=800&auto=format&fit=crop',
    iconName: 'Coffee',
    featured: true,
  },
  {
    id: 'frames',
    name: 'Photo Frames',
    shortDescription: 'Engraved wooden frames & crystal acrylic photo memories',
    itemCount: 58,
    imageUrl: 'https://images.unsplash.com/photo-1544717305-2782549b5136?q=80&w=800&auto=format&fit=crop',
    iconName: 'Frame',
    featured: true,
  },
  {
    id: 'lamps',
    name: '3D Illusion Lamps',
    shortDescription: 'Glowing custom 3D acrylic LED lamps & moon lamps',
    itemCount: 34,
    imageUrl: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=800&auto=format&fit=crop',
    iconName: 'Lamp',
    featured: true,
  },
  {
    id: 'cushions',
    name: 'Personalized Cushions',
    shortDescription: 'Reversible magic sequin & luxury velvet custom cushions',
    itemCount: 29,
    imageUrl: 'https://images.unsplash.com/photo-1584100936595-c0654b55a2e2?q=80&w=800&auto=format&fit=crop',
    iconName: 'Sparkles',
    featured: true,
  },
  {
    id: 'keychains',
    name: 'Custom Keychains',
    shortDescription: 'Stainless steel engraved Spotify code & calendar keychains',
    itemCount: 36,
    imageUrl: 'https://images.unsplash.com/photo-1622434641406-a158123450f9?q=80&w=800&auto=format&fit=crop',
    iconName: 'Key',
    featured: true,
  },
  {
    id: 'bottles',
    name: 'Engraved Bottles & Flasks',
    shortDescription: 'Temperature display stainless steel smart thermal bottles',
    itemCount: 22,
    imageUrl: 'https://images.unsplash.com/photo-1602143407151-7111542de6e8?q=80&w=800&auto=format&fit=crop',
    iconName: 'FlaskConical',
    featured: true,
  },
  {
    id: 'watches',
    name: 'Engraved Watches',
    shortDescription: 'Handcrafted wooden timepieces & personalized backplate watches',
    itemCount: 18,
    imageUrl: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=800&auto=format&fit=crop',
    iconName: 'Watch',
    featured: true,
  },
  {
    id: 'diaries',
    name: 'Executive Diaries',
    shortDescription: 'Leather embossed journals & personalized stationery combos',
    itemCount: 25,
    imageUrl: 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?q=80&w=800&auto=format&fit=crop',
    iconName: 'BookOpen',
    featured: true,
  },
  {
    id: 'tshirts',
    name: 'Custom T-Shirts',
    shortDescription: 'Premium cotton matching couple & family customized tees',
    itemCount: 40,
    imageUrl: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=800&auto=format&fit=crop',
    iconName: 'Shirt',
    featured: false,
  },
  {
    id: 'photo-gifts',
    name: 'Photo Keepsakes',
    shortDescription: 'Retro film roll keychains, custom Spotify plaques & puzzles',
    itemCount: 52,
    imageUrl: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=800&auto=format&fit=crop',
    iconName: 'Camera',
    featured: true,
  },
  {
    id: 'home-decor',
    name: 'Personalized Home Decor',
    shortDescription: 'Custom nameplates, wall clocks & illuminated tabletop art',
    itemCount: 31,
    imageUrl: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?q=80&w=800&auto=format&fit=crop',
    iconName: 'Home',
    featured: false,
  },
  {
    id: 'corporate',
    name: 'Corporate Gifts',
    shortDescription: 'Curated luxury client hampers & custom branded employee kits',
    itemCount: 45,
    imageUrl: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?q=80&w=800&auto=format&fit=crop',
    iconName: 'Briefcase',
    featured: true,
  },
];
