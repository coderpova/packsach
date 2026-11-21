import React, { useState } from 'react';
import { Search, ArrowRight, Check, Sparkles } from 'lucide-react';

interface FeaturesSectionProps {
  onSearchProduct: (query: string) => void;
  onOpenScanner: () => void;
  onInspectProduct: (productId: string) => void;
}

export const FeaturesSection: React.FC<FeaturesSectionProps> = ({
  onSearchProduct,
  onOpenScanner,
  onInspectProduct,
}) => {
  const [demoText, setDemoText] = useState('Sugar, Palm Oil, Maltodextrin ...');
  const [confirmed, setConfirmed] = useState(false);

  const handleConfirm = () => {
    setConfirmed(true);
    setTimeout(() => setConfirmed(false), 2000);
  };

  return (
    <section id="features" className="py-16 sm:py-24 border-t border-[#EAE7E0]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header (Matching Reference) */}
        <div className="text-left mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#FF5E36] block">
            Features
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight mt-1">
            Smarter tools for smarter choices
          </h2>
          <p className="text-xs sm:text-base text-[#64748B] mt-2 font-medium">
            Har score ek clear rule se trace hota hai, taaki aap result par bharosa kar sako.
          </p>
        </div>

        {/* 4 Cards Grid (Matching Reference) */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1: Transparent scoring (White Card) */}
          <div className="ps-card p-6 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#111827]">
                Transparent scoring
              </h3>
              <p className="text-xs text-[#64748B] mt-1 font-medium leading-relaxed">
                Ingredient list order dikhati hai, exact percentage nahi.
              </p>

              {/* Table Rows (Matching Reference) */}
              <div className="mt-5 space-y-2.5 text-xs font-semibold">
                <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE1]">
                  <span className="text-[#475569]">Added sugar</span>
                  <span className="text-[#C2410C] font-bold">High</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE1]">
                  <span className="text-[#475569]">Palm oil</span>
                  <span className="text-[#C2410C] font-bold">High</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE1]">
                  <span className="text-[#475569]">Trans fat</span>
                  <span className="text-[#C2410C] font-bold">High</span>
                </div>
                <div className="flex items-center justify-between py-1.5 border-b border-[#F0ECE1]">
                  <span className="text-[#475569]">Sodium</span>
                  <span className="text-amber-800 font-bold">Medium</span>
                </div>
                <div className="flex items-center justify-between py-1.5">
                  <span className="text-[#475569]">Additives</span>
                  <span className="text-amber-800 font-bold">Medium</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Search by name (White Card) */}
          <div className="ps-card p-6 bg-white flex flex-col justify-between">
            <div>
              <h3 className="text-base sm:text-lg font-black text-[#111827]">
                Search by name
              </h3>
              <p className="text-xs text-[#64748B] mt-1 font-medium leading-relaxed">
                Photo nahi hai? Product ka naam likho.
              </p>

              {/* Search Mini Input */}
              <div className="mt-4 flex items-center bg-[#FAF9F6] border border-[#E0DCD3] rounded-full p-2 gap-2">
                <Search className="w-4 h-4 text-slate-400 pl-1" />
                <input
                  id="features-product-search"
                  name="featuresSearch"
                  type="text"
                  placeholder="Search products"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      onSearchProduct((e.target as HTMLInputElement).value);
                    }
                  }}
                  className="w-full text-xs font-medium text-[#111827] bg-transparent focus:outline-none"
                />
              </div>

              {/* Items List (Matching Reference) */}
              <div className="mt-4 space-y-2 text-xs">
                <div
                  onClick={() => onInspectProduct('bournvita-malt-drink')}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F6] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#111827]">Chocolate Malt Drink</span>
                  <span className="font-bold text-[#FF5E36]">3 tsp</span>
                </div>
                <div
                  onClick={() => onInspectProduct('frooti-mango-drink')}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#FAF9F6] hover:bg-slate-100 transition-colors cursor-pointer"
                >
                  <span className="font-bold text-[#111827]">Packaged fruit drink</span>
                  <span className="font-bold text-[#FF5E36]">4 tsp</span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3: Same-price swaps (Vibrant Coral Card matching Reference) */}
          <div className="bg-[#FF5E36] text-white p-6 rounded-3xl shadow-md flex flex-col justify-between md:col-span-2 lg:col-span-1">
            <div>
              <h3 className="text-base sm:text-lg font-black text-white">
                Same-price swaps
              </h3>
              <p className="text-xs text-white/90 mt-1 font-medium leading-relaxed">
                Same category, same price, better pick.
              </p>

              {/* White Pills List (Matching Reference) */}
              <div className="mt-5 space-y-3">
                <div className="bg-white text-[#111827] p-3 rounded-2xl shadow-xs text-xs">
                  <div className="font-bold text-slate-500 text-[10px]">Chocolate Malt Drink, Rs 20</div>
                  <div className="font-black text-[#111827] mt-0.5 text-xs">
                    to Roasted ragi drink, 0 tsp
                  </div>
                </div>

                <div className="bg-white text-[#111827] p-3 rounded-2xl shadow-xs text-xs">
                  <div className="font-bold text-slate-500 text-[10px]">Packaged fruit drink, Rs 20</div>
                  <div className="font-black text-[#111827] mt-0.5 text-xs">
                    to Lemon or coconut water, 0 tsp
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Card 4: You stay in control (Dark Black Card matching Reference) */}
          <div className="bg-[#18181B] text-white p-6 rounded-3xl shadow-md flex flex-col justify-between md:col-span-2 lg:col-span-3">
            <div className="max-w-2xl">
              <h3 className="text-base sm:text-lg font-black text-white">
                You stay in control
              </h3>
              <p className="text-xs text-slate-300 mt-1 font-medium leading-relaxed">
                OCR galti kare toh text confirm ya edit karo. Hum sirf label data aur cited sources use karte hain.
              </p>

              {/* Text Input Box & Confirm Button */}
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg">
                <input
                  id="features-ocr-editor"
                  name="featuresOcrText"
                  type="text"
                  value={demoText}
                  onChange={(e) => setDemoText(e.target.value)}
                  className="bg-slate-800 border border-slate-700 text-slate-200 text-xs font-mono px-4 py-2.5 rounded-full flex-1 focus:outline-none focus:border-[#FF5E36]"
                />
                <button
                  type="button"
                  onClick={handleConfirm}
                  className="btn-coral h-10 px-5 text-xs font-bold whitespace-nowrap cursor-pointer"
                >
                  {confirmed ? 'Confirmed!' : 'Confirm text'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
