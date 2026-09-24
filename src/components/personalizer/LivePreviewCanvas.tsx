import React from 'react';
import { Product, PersonalizationData } from '../../types';
import { Sparkles, Music } from 'lucide-react';

interface LivePreviewCanvasProps {
  product: Product;
  personalization: PersonalizationData;
  className?: string;
  zoom?: boolean;
}

export const LivePreviewCanvas: React.FC<LivePreviewCanvasProps> = ({
  product,
  personalization,
  className = '',
}) => {
  const overlayType = product.personalizationOptions?.previewOverlayType || 'general';
  const customPhoto = personalization.photoUrl || personalization.photoFile || product.images[0];
  const line1 = personalization.customTextLine1 || (product.isPersonalizable ? 'Your Custom Text' : '');
  const line2 = personalization.customTextLine2 || '';
  const selectedFont = personalization.fontId || 'sans';
  
  // Font styling map
  const getFontFamily = (id?: string) => {
    switch (id) {
      case 'script':
      case 'cursive':
        return "'Great Vibes', cursive";
      case 'serif':
        return "'Playfair Display', serif";
      case 'bold-sans':
        return "'Outfit', sans-serif";
      default:
        return "'Plus Jakarta Sans', sans-serif";
    }
  };

  const fontFamily = getFontFamily(selectedFont);

  return (
    <div className={`relative w-full aspect-square bg-[#F3EFEA] rounded-2xl overflow-hidden flex items-center justify-center p-4 border border-[#EAE4DA] select-none ${className}`}>
      {/* Background glow for ambient effect */}
      <div className="absolute inset-0 bg-radial from-amber-100/40 via-transparent to-stone-200/50 pointer-events-none" />

      {/* Realistic Product Mockup depending on type */}
      {overlayType === 'plaque' && (
        <div className="relative w-4/5 h-[88%] flex flex-col items-center justify-end">
          {/* Acrylic Glass Sheet with Glow */}
          <div className="relative w-5/6 h-[80%] rounded-t-xl bg-white/40 backdrop-blur-md border border-white/80 shadow-2xl p-4 flex flex-col justify-between overflow-hidden">
            {/* Ambient edge light */}
            <div className="absolute inset-x-0 bottom-0 h-10 bg-linear-to-t from-amber-200/60 to-transparent pointer-events-none" />

            {/* Custom Photo Frame in plaque */}
            <div className="relative w-full aspect-square rounded-lg overflow-hidden shadow-inner bg-stone-900 border border-white/50">
              <img
                src={customPhoto}
                alt="Personalized memory"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Song Text & Waveform / Spotify code */}
            <div className="space-y-1.5 pt-2 text-center">
              <p
                style={{ fontFamily }}
                className="text-stone-900 font-bold text-xs tracking-tight line-clamp-1"
              >
                {line1 || 'Our Special Anthem'}
              </p>
              {line2 && (
                <p className="text-[10px] text-stone-600 line-clamp-1">
                  {line2}
                </p>
              )}

              {/* Simulated Spotify Sound Wave Bar */}
              <div className="flex items-center justify-center gap-1 pt-1 opacity-80">
                <Music className="w-3 h-3 text-stone-800" />
                <div className="flex items-center gap-0.5 h-3">
                  {[4, 8, 12, 6, 14, 10, 5, 12, 16, 8, 4, 11, 7, 13, 9, 5].map((h, i) => (
                    <div
                      key={i}
                      style={{ height: `${h}px` }}
                      className="w-0.5 bg-stone-900 rounded-full"
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Wooden Illuminated Base */}
          <div className="relative w-full h-9 bg-linear-to-b from-[#C49C6B] via-[#A87B4C] to-[#8C5E32] rounded-lg shadow-xl flex items-center justify-center border-t border-amber-200/50">
            <div className="w-3/4 h-1 bg-[#FFEAA7] rounded-full blur-[2px] opacity-80" />
          </div>
        </div>
      )}

      {overlayType === 'mug' && (
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 flex items-center justify-center">
          {/* Ceramic Mug Body Shape */}
          <div className="relative w-40 h-48 sm:w-48 sm:h-56 rounded-b-[40px] rounded-t-lg bg-linear-to-r from-stone-900 via-stone-800 to-stone-900 shadow-2xl p-3 sm:p-4 flex flex-col items-center justify-center border-t-2 border-stone-700 overflow-hidden">
            {/* Handle on the right */}
            <div className="absolute -right-7 sm:-right-8 top-10 sm:top-12 w-10 sm:w-12 h-24 sm:h-28 border-[8px] sm:border-[10px] border-stone-800 rounded-r-3xl shadow-md pointer-events-none" />

            {/* Custom Photo Print on Mug */}
            <div className="w-full h-32 rounded-lg overflow-hidden border border-white/20 shadow-md relative group">
              <img
                src={customPhoto}
                alt="Printed photo on mug"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/50 via-transparent to-transparent" />
            </div>

            {/* Mug Custom Text */}
            <div className="pt-2 text-center w-full px-2">
              <p
                style={{ fontFamily }}
                className="text-[#F5D061] text-xs font-semibold drop-shadow-md line-clamp-1"
              >
                {line1 || 'Good Morning Sunshine'}
              </p>
              {line2 && (
                <p className="text-[10px] text-stone-300 line-clamp-1 pt-0.5">
                  {line2}
                </p>
              )}
            </div>

            {/* Mug Ceramic Glaze Sheen */}
            <div className="absolute inset-y-0 left-3 w-4 bg-white/10 blur-xs rounded-full pointer-events-none" />
          </div>
        </div>
      )}

      {overlayType === 'frame' && (
        <div className="relative w-4/5 h-4/5 p-4 rounded-xl bg-linear-to-br from-[#8B5A2B] via-[#75471E] to-[#5C3412] shadow-2xl flex flex-col border-4 border-[#A87442]">
          {/* Inner Bevel */}
          <div className="relative w-full h-full bg-[#FFFDFB] rounded p-3 flex flex-col justify-between shadow-inner">
            {/* Top Engraved text on wood inner */}
            {line1 && (
              <p
                style={{ fontFamily }}
                className="text-center text-[#5C3412] font-bold text-xs uppercase tracking-wider pb-1 border-b border-[#5C3412]/20"
              >
                {line1}
              </p>
            )}

            {/* Photo Inset */}
            <div className="flex-1 w-full rounded overflow-hidden shadow-inner my-1">
              <img
                src={customPhoto}
                alt="Framed Memory"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Bottom Engraved date / note */}
            {line2 && (
              <p className="text-center text-[10px] text-[#75471E] font-medium pt-1">
                {line2}
              </p>
            )}
          </div>
        </div>
      )}

      {overlayType === 'cushion' && (
        <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-3xl bg-linear-to-br from-amber-100 via-white to-amber-200 shadow-2xl p-4 sm:p-5 flex flex-col items-center justify-center border-4 border-[#C59B27]/40 overflow-hidden">
          {/* Plush Wrinkle / Pillowed shadow effect */}
          <div className="absolute inset-0 bg-radial from-transparent to-black/10 pointer-events-none" />
          
          <div className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl overflow-hidden shadow-lg border-2 border-white relative">
            <img
              src={customPhoto}
              alt="Cushion photo"
              className="w-full h-full object-cover"
            />
            {line1 && (
              <div className="absolute inset-x-0 bottom-0 bg-black/60 backdrop-blur-xs p-2 text-center">
                <p style={{ fontFamily }} className="text-white text-xs font-semibold drop-shadow-md">
                  {line1}
                </p>
              </div>
            )}
          </div>
        </div>
      )}

      {overlayType === 'bottle' && (
        <div className="relative w-40 h-56 sm:w-48 sm:h-64 flex flex-col items-center justify-center">
          {/* Smart Flask Silhouette */}
          <div className="relative w-24 h-48 sm:w-28 sm:h-56 rounded-t-3xl rounded-b-2xl bg-linear-to-r from-stone-900 via-stone-800 to-stone-950 shadow-2xl flex flex-col items-center justify-between p-3 border-t border-stone-600">
            {/* LED Top Screen */}
            <div className="w-14 h-4 rounded-full bg-black border border-stone-700 flex items-center justify-center">
              <span className="text-[10px] text-cyan-400 font-mono font-bold tracking-wider">
                24°C
              </span>
            </div>

            {/* Vertical Laser Engraved Text on Flask */}
            <div className="my-auto py-2 text-center">
              <p
                style={{ fontFamily }}
                className="text-[#D8D0C5] text-xs font-bold tracking-widest uppercase drop-shadow-sm rotate-90 my-6"
              >
                {line1 || 'RAHUL SHARMA'}
              </p>
            </div>

            <div className="w-full text-center">
              <span className="text-[8px] uppercase tracking-widest text-stone-500 font-bold">
                IMPRESSIVE
              </span>
            </div>
          </div>
        </div>
      )}

      {overlayType === 'lamp' && (
        <div className="relative w-64 h-64 flex flex-col items-center justify-end">
          {/* Glowing 3D Moon / Orb */}
          <div className="relative w-44 h-44 rounded-full bg-linear-to-tr from-amber-200 via-yellow-100 to-white shadow-[0_0_50px_rgba(251,191,36,0.6)] p-3 flex flex-col items-center justify-center border border-amber-300/40 overflow-hidden">
            <img
              src={customPhoto}
              alt="Illuminated memory"
              className="w-full h-full object-cover rounded-full mix-blend-multiply opacity-85"
            />
            {line1 && (
              <div className="absolute inset-x-0 bottom-6 px-2 text-center">
                <span
                  style={{ fontFamily }}
                  className="text-stone-900 text-[11px] font-bold drop-shadow-sm bg-white/70 px-2 py-0.5 rounded-full"
                >
                  {line1}
                </span>
              </div>
            )}
          </div>

          {/* Wooden Tripod Stand */}
          <div className="w-24 h-6 flex justify-between items-center px-2 mt-2">
            <div className="w-2.5 h-6 bg-[#8B5A2B] rounded-b rotate-12" />
            <div className="w-2.5 h-5 bg-[#704214] rounded-b" />
            <div className="w-2.5 h-6 bg-[#8B5A2B] rounded-b -rotate-12" />
          </div>
        </div>
      )}

      {overlayType === 'general' && (
        <div className="relative w-4/5 h-4/5 rounded-2xl overflow-hidden shadow-2xl bg-white border-4 border-white flex flex-col">
          <img
            src={customPhoto}
            alt="Personalized product"
            className="w-full flex-1 object-cover"
          />
          {line1 && (
            <div className="p-3 bg-white text-center border-t border-stone-100">
              <p style={{ fontFamily }} className="text-sm font-bold text-[#882434]">
                {line1}
              </p>
              {line2 && <p className="text-xs text-stone-500">{line2}</p>}
            </div>
          )}
        </div>
      )}

      {/* Floating Live Preview Watermark Badge */}
      <div className="absolute bottom-2.5 right-2.5 bg-black/65 backdrop-blur-md text-white text-[10px] font-medium px-2 py-1 rounded-md flex items-center gap-1 shadow-xs pointer-events-none">
        <Sparkles className="w-2.5 h-2.5 text-[#F5D061]" />
        <span>Live Craft Preview</span>
      </div>
    </div>
  );
};
