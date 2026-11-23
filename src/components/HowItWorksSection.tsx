import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { Check, ShoppingBag, ArrowRight } from 'lucide-react';

interface HowItWorksSectionProps {
  onAddSwapDemo: () => void;
  onExploreClick: () => void;
}

export const HowItWorksSection: React.FC<HowItWorksSectionProps> = ({
  onAddSwapDemo,
  onExploreClick,
}) => {
  const [activeStep, setActiveStep] = useState<number>(1);
  const [isAdded, setIsAdded] = useState<boolean>(false);

  const handleAddClick = () => {
    setIsAdded(true);
    onAddSwapDemo();
    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF5E36', '#111827', '#10B981', '#FFD84D']
    });
    setTimeout(() => setIsAdded(false), 2500);
  };

  return (
    <section id="how-it-works" className="py-16 sm:py-24 border-t border-[#EAE7E0]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10 text-left">
          <div>
            <span className="text-xs font-black uppercase tracking-wider text-[#FF5E36] block">
              How it works
            </span>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight mt-1">
              Scan. Reveal. Swap.
            </h2>
          </div>
          <button
            onClick={onExploreClick}
            className="btn-secondary h-10 px-4 text-xs font-bold gap-1.5 self-start sm:self-auto cursor-pointer flex items-center"
          >
            <span>Explore Verified Staples</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* 2-Column Grid Matching Reference */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3 Steps (7 cols) */}
          <div className="md:col-span-6 space-y-4">
            {/* Step 1 */}
            <div
              onClick={() => setActiveStep(1)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                activeStep === 1
                  ? 'bg-white border-[#D5D1C7] shadow-sm'
                  : 'bg-white/60 border-[#EAE7E0] hover:bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    activeStep === 1
                      ? 'bg-[#FF5E36] text-white'
                      : 'bg-[#111827] text-white'
                  }`}
                >
                  1
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111827]">Scan</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed font-medium">
                    Ingredient list ki photo upload karo ya product ka naam search karo.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 2 */}
            <div
              onClick={() => setActiveStep(2)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                activeStep === 2
                  ? 'bg-white border-[#D5D1C7] shadow-sm'
                  : 'bg-white/60 border-[#EAE7E0] hover:bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    activeStep === 2
                      ? 'bg-[#FF5E36] text-white'
                      : 'bg-[#111827] text-white'
                  }`}
                >
                  2
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111827]">Reveal</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed font-medium">
                    Sugar cubes aur oil spoons ke saath Visual Shock Dashboard.
                  </p>
                </div>
              </div>
            </div>

            {/* Step 3 */}
            <div
              onClick={() => setActiveStep(3)}
              className={`p-5 rounded-3xl border transition-all cursor-pointer ${
                activeStep === 3
                  ? 'bg-white border-[#D5D1C7] shadow-sm'
                  : 'bg-white/60 border-[#EAE7E0] hover:bg-white'
              }`}
            >
              <div className="flex items-start gap-4">
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${
                    activeStep === 3
                      ? 'bg-[#FF5E36] text-white'
                      : 'bg-[#111827] text-white'
                  }`}
                >
                  3
                </div>
                <div>
                  <h3 className="text-base font-black text-[#111827]">Swap</h3>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed font-medium">
                    Same price range me 1-click healthier alternative.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Clean Result Card Matching Reference (5 cols) */}
          <div className="md:col-span-6">
            <div className="ps-card p-6 sm:p-7 bg-white relative overflow-hidden">
              {/* Top Row: Name and High Concern Badge */}
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-bold text-[#64748B]">Chocolate Malt Drink</span>
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-[#FFF1EE] text-[#C2410C] border border-[#FFE1DA]">
                  High concern
                </span>
              </div>

              {/* Big Score: 3 /10 */}
              <div className="flex items-baseline gap-1 my-3">
                <span className="text-5xl font-black text-[#111827]">3</span>
                <span className="text-xl font-bold text-[#64748B]">/10</span>
              </div>

              {/* Sugar Cubes Visualizer (Outlined squares matching Reference) */}
              <div className="flex items-center gap-2 my-3">
                {[1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-lg border-2 border-slate-700 bg-white flex items-center justify-center text-xs font-black text-[#111827] shadow-xs"
                  >
                    1
                  </div>
                ))}
              </div>

              {/* Caption */}
              <p className="text-xs sm:text-sm text-[#111827] font-semibold mt-1">
                One serving has 3 teaspoons of sugar.
              </p>

              {/* Better Choice Highlight Bar (Matching Reference) */}
              <div className="mt-5 p-3.5 bg-[#FAF9F6] border border-[#EAE7E0] rounded-2xl text-left">
                <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block">
                  Better Choice
                </span>
                <p className="text-xs sm:text-sm font-black text-[#111827] mt-0.5">
                  Roasted ragi drink (unsweetened), Rs 20, 0 tsp sugar
                </p>
              </div>

              {/* Black Pill Button: Add to list */}
              <div className="mt-5">
                <button
                  onClick={handleAddClick}
                  className={`w-full h-11 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                    isAdded
                      ? 'bg-[#10B981] text-white'
                      : 'btn-dark'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to your grocery list!</span>
                    </>
                  ) : (
                    <>
                      <ShoppingBag className="w-4 h-4" />
                      <span>Add to list</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
