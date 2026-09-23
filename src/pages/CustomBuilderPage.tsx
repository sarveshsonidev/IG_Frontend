import React from 'react';
import { Product } from '../types';
import { MiniGiftBuilder } from '../components/personalizer/MiniGiftBuilder';

interface CustomBuilderPageProps {
  products: Product[];
  onBackToShop: () => void;
}

export const CustomBuilderPage: React.FC<CustomBuilderPageProps> = ({ products }) => {
  return (
    <div className="py-6 space-y-6">
      <MiniGiftBuilder products={products} />
    </div>
  );
};
