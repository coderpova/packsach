import React from 'react';
import confetti from 'canvas-confetti';
import { Check, Sparkles, ShoppingBag, ShieldCheck } from 'lucide-react';
import type { Product, SmartSwap } from '../types/product';

interface SmartSwapProps {
  currentProduct: Product;
  swap: SmartSwap;
  onAddToList: (swap: SmartSwap, currentProduct: Product) => void;
  isAddedToList: boolean;
}

export const SmartSwapCard: React.FC<SmartSwapProps> = ({
  currentProduct,
  swap,
  onAddToList,
  isAddedToList,
}) => {
  const sugarSavedTeaspoons = Math.max(0, currentProduct.nutritionPerServe.sugarTeaspoons - swap.sugarTeaspoons);
  const scoreImprovement = Math.max(0, Math.round((swap.healthScore - currentProduct.healthScore.score) * 10) / 10);

  const handleCelebrateSwap = () => {
    onAddToList(swap, currentProduct);

    confetti({
      particleCount: 50,
      spread: 60,
      origin: { y: 0.7 },
      colors: ['#FF5E36', '#111827', '#10B981', '#6545F5']
    });
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden">
      {/* Top Banner Tag */}
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#0A6B4A] border border-[#10B981]/20 text-xs font-bold">
          <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
          Healthier Smart Swap
        </span>
        <span className="text-xs font-black px-3 py-1 rounded-full bg-[#F4F1EA] text-[#111827] border border-[#EAE5DA]">
          Same Price: ₹{swap.price}
        </span>
      </div>

      <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-6">
        <div className="w-full">
          <h3 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
            {swap.name}
          </h3>
          <p className="text-xs font-semibold text-[#64748B] mt-1">
            By {swap.brand} • {swap.availability}
          </p>

          {/* Metric Badges (Theme C Cream Boxes) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-5">
            {/* Price */}
            <div className="p-3.5 rounded-2xl border border-[#EAE5DA] bg-[#F4F1EA] text-center">
              <span className="text-[10px] font-bold text-[#64748B] uppercase block">Price</span>
              <span className="text-lg font-black text-[#111827]">₹{swap.price}</span>
              <span className="text-[10px] text-[#64748B] font-medium block">Matches ₹{currentProduct.price}</span>
            </div>

            {/* Sugar Difference */}
            <div className="p-3.5 rounded-2xl border border-[#CDEEDF] bg-[#EAF8F1] text-center">
              <span className="text-[10px] font-bold text-[#0A6B4A] uppercase block">Sugar</span>
              <span className="text-lg font-black text-[#0A6B4A]">{swap.sugarTeaspoons} tsp</span>
              <span className="text-[10px] text-[#0A6B4A] font-bold block">
                Save {sugarSavedTeaspoons.toFixed(1)} tsp
              </span>
            </div>

            {/* Health Score */}
            <div className="p-3.5 rounded-2xl border border-[#EAE5DA] bg-[#F4F1EA] text-center">
              <span className="text-[10px] font-bold text-[#111827] uppercase block">Health Score</span>
              <span className="text-lg font-black text-[#111827]">{swap.healthScore} / 10</span>
              <span className="text-[10px] text-[#10B981] font-bold block">
                +{scoreImprovement} jump
              </span>
            </div>

            {/* Palm Oil Status */}
            <div className="p-3.5 rounded-2xl border border-[#CDEEDF] bg-[#EAF8F1] text-center">
              <span className="text-[10px] font-bold text-[#0A6B4A] uppercase block">Oil Quality</span>
              <span className="text-xs font-black text-[#0A6B4A] mt-1 block">Zero Palm Oil</span>
              <span className="text-[10px] text-[#0A6B4A] font-medium block">Clean & unrefined</span>
            </div>
          </div>

          {/* Why it's better explanation (Theme C Cream Highlight) */}
          <div className="p-4 bg-[#F4F1EA] border border-[#EAE5DA] rounded-2xl flex items-start gap-3 text-xs text-[#475569]">
            <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              <strong className="text-[#111827]">Why PackSach Recommends This:</strong> {swap.whyBetter}
            </p>
          </div>

          {/* Action Button: Add to List */}
          <div className="mt-5 flex flex-wrap items-center gap-3">
            <button
              onClick={handleCelebrateSwap}
              className={`h-11 px-6 text-xs font-black rounded-full transition-all flex items-center gap-2 cursor-pointer ${
                isAddedToList
                  ? 'bg-[#10B981] text-white shadow-xs'
                  : 'btn-coral'
              }`}
            >
              {isAddedToList ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to Your Smart Grocery List</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>1-Tap Swap: Add to Smart Grocery List</span>
                </>
              )}
            </button>

            <span className="text-xs text-[#64748B] font-medium">
              Synced with your saved swaps list
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
