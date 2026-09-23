import React from 'react';
import { 
  Building2, 
  Sparkles, 
  CheckCircle2, 
  ShieldCheck, 
  Users, 
  Award, 
  Truck, 
  ArrowRight,
  Briefcase,
  FileSpreadsheet
} from 'lucide-react';
import { Product } from '../types';
import { ProductCard } from '../components/common/ProductCard';

interface CorporatePageProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onOpenQuoteModal: () => void;
}

export const CorporatePage: React.FC<CorporatePageProps> = ({
  products,
  onSelectProduct,
  onOpenQuoteModal,
}) => {
  const corporateProducts = products.filter(
    p => p.category === 'corporate' || p.category === 'diaries' || p.category === 'bottles'
  );

  const perks = [
    { title: 'Custom Laser Logo Engraving', desc: 'Precision metallic & wooden branding with zero fading.' },
    { title: 'Individual Employee Names', desc: 'Personalize each unit with recipient full name & team role.' },
    { title: 'Tiered Bulk Pricing Discounts', desc: 'Attractive price brackets for 25, 100, 500, or 2000+ units.' },
    { title: 'Pan-India Multi-Address Dropship', desc: 'Direct delivery to remote employee homes across 19,000+ pins.' },
    { title: 'GST Invoicing & Input Credits', desc: '100% tax compliant GST B2B invoice supplied immediately.' },
    { title: 'Luxury Custom Packaging', desc: 'Matte black & golden foiled magnetic flip boxes with satin ribbons.' },
  ];

  return (
    <div className="space-y-16 py-8">
      {/* Corporate Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="luxury-card rounded-3xl bg-linear-to-br from-[#1C1819] via-[#2A1D20] to-[#1C1819] text-white p-8 sm:p-14 overflow-hidden relative shadow-2xl">
          <div className="max-w-2xl space-y-5 relative z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-[#F5D061] text-xs font-semibold uppercase tracking-wider">
              <Building2 className="w-3.5 h-3.5" />
              <span>ImpressiveGifts For Business</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl font-bold leading-tight">
              Premium Corporate Gifting & <br />
              <span className="text-[#F5D061]">Custom Merchandise</span>
            </h1>

            <p className="text-stone-300 text-xs sm:text-sm leading-relaxed">
              Reward peak performance, welcome new hires with pride, and thank valued enterprise clients with luxury custom-branded gift hampers crafted to leave a lasting impression.
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={onOpenQuoteModal}
                className="px-8 py-3.5 rounded-xl bg-[#F5D061] hover:bg-[#E5BE53] text-stone-900 text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-lg transition-all cursor-pointer"
              >
                <span>Request Custom Quote</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Perks Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold text-[#882434] uppercase tracking-wider">
            Why Enterprise Leaders Choose Us
          </span>
          <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
            End-to-End Turnkey Corporate Solutions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {perks.map((p, idx) => (
            <div key={idx} className="luxury-card rounded-2xl p-6 bg-white border border-[#EAE4DA] space-y-2">
              <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-stone-200 flex items-center justify-center text-[#882434]">
                <CheckCircle2 className="w-5 h-5 text-[#882434]" />
              </div>
              <h3 className="font-serif text-base font-bold text-stone-900">{p.title}</h3>
              <p className="text-xs text-stone-600 leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Corporate Products Showcase */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-[#882434] uppercase tracking-wider">Catalogue</span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-stone-900">
              Popular Corporate Gifts
            </h2>
          </div>
          <button
            onClick={onOpenQuoteModal}
            className="text-xs font-bold text-[#882434] hover:underline"
          >
            Get Custom Catalog PDF →
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
          {corporateProducts.map((prod) => (
            <ProductCard
              key={prod.id}
              product={prod}
              onSelectProduct={onSelectProduct}
            />
          ))}
        </div>
      </section>
    </div>
  );
};
