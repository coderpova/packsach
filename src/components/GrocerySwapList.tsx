import React from 'react';
import { motion } from 'framer-motion';
import { Trash2, ShoppingBag, Sparkles, Share2, Check } from 'lucide-react';
import type { SmartSwap } from '../types/product';

export interface SavedSwapItem {
  id: string;
  swap: SmartSwap;
  originalProduct: {
    name: string;
    brand: string;
    price: number;
    sugarTeaspoons: number;
  };
  addedAt: string;
}

interface GrocerySwapListProps {
  items: SavedSwapItem[];
  onRemoveItem: (id: string) => void;
  onClearAll: () => void;
  onExploreProducts: () => void;
}

export const GrocerySwapList: React.FC<GrocerySwapListProps> = ({
  items,
  onRemoveItem,
  onClearAll,
  onExploreProducts,
}) => {
  const [copied, setCopied] = React.useState(false);

  const totalSugarAvoidedTeaspoons = items.reduce(
    (acc, cur) => acc + Math.max(0, cur.originalProduct.sugarTeaspoons - cur.swap.sugarTeaspoons),
    0
  );
  const totalSugarAvoidedGrams = Math.round(totalSugarAvoidedTeaspoons * 4);

  const handleCopyList = () => {
    const text = items
      .map(
        (i, idx) =>
          `${idx + 1}. ${i.swap.name} (₹${i.swap.price}) [Swapped from ${i.originalProduct.name} - Saved ${(i.originalProduct.sugarTeaspoons - i.swap.sugarTeaspoons).toFixed(1)} tsp sugar]`
      )
      .join('\n');

    const summary = `PackSach Smart Grocery Swap List:\n${text}\n\nTotal Sugar Avoided: ${totalSugarAvoidedTeaspoons.toFixed(1)} teaspoons (${totalSugarAvoidedGrams}g)\nLook Beyond the Label.`;

    if (navigator?.clipboard?.writeText) {
      navigator.clipboard.writeText(summary).then(() => {
        setCopied(true);
        setTimeout(() => setCopied(false), 2500);
      }).catch(() => {
        fallbackCopyText(summary);
      });
    } else {
      fallbackCopyText(summary);
    }
  };

  const fallbackCopyText = (text: string) => {
    try {
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // ignore
    }
  };

  if (items.length === 0) {
    return (
      <div className="relative rounded-3xl p-6 sm:p-12 overflow-hidden border border-[#EAE7E0]/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        {/* Packaged Wholesome Muesli & Clean Health Bars Background Photography */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
          <img
            src="/assets/backgrounds/swaps-food-bg.jpg"
            alt="Authentic packaged wholesome muesli, cereals and clean health snack bars background"
            className="w-full h-full object-cover object-center opacity-75 filter saturate-110 contrast-105"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/80 via-[#FAF9F6]/50 to-[#FAF9F6]/75 backdrop-blur-[1px]" />
        </div>

        <div className="relative z-10 rounded-3xl border border-[#EAE7E0] bg-white/95 backdrop-blur-xs p-10 sm:p-12 text-center max-w-lg mx-auto my-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="w-14 h-14 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA] flex items-center justify-center mx-auto mb-4 text-[#111827]">
            <ShoppingBag className="w-6 h-6 text-[#FF5E36]" />
          </div>
          <h3 className="text-2xl font-black text-[#111827] tracking-tight">
            Your Smart Grocery Swap List is Empty
          </h3>
          <p className="text-xs sm:text-sm text-[#64748B] mt-2 max-w-sm mx-auto leading-relaxed">
            Inspect products in the directory and click "1-Tap Swap: Add to Smart Grocery List" to compile your cleaner everyday shopping plan.
          </p>
          <button
            onClick={onExploreProducts}
            className="mt-6 btn-coral h-11 px-6 text-xs font-bold gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Explore Packaged Foods & Find Swaps</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative rounded-3xl p-4 sm:p-7 overflow-hidden border border-[#EAE7E0]/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      {/* Packaged Wholesome Muesli & Clean Health Bars Background Photography */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
        <img
          src="/assets/backgrounds/swaps-food-bg.jpg"
          alt="Authentic packaged wholesome muesli, cereals and clean health snack bars background"
          className="w-full h-full object-cover object-center opacity-75 filter saturate-110 contrast-105"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/80 via-[#FAF9F6]/50 to-[#FAF9F6]/75 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 space-y-6">
      {/* Impact Counter Banner (Theme C Warm Green / Cream) */}
      <div className="p-6 sm:p-7 rounded-3xl bg-[#EAF8F1] border border-[#CDEEDF] relative overflow-hidden shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5">
          <div>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#10B981]/15 text-[#0A6B4A] border border-[#10B981]/20 text-xs font-bold mb-2">
              <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
              Health Impact Counter
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
              You avoided <span className="text-[#0A6B4A]">{totalSugarAvoidedTeaspoons.toFixed(1)} teaspoons</span> ({totalSugarAvoidedGrams}g) of hidden sugar!
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-1">
              By replacing {items.length} ultra-processed packaged items with clean alternatives in the same price range.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              onClick={handleCopyList}
              className="btn-secondary h-10 px-4 text-xs font-bold gap-2 cursor-pointer"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-[#10B981]" />
                  <span>List Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-4 h-4 text-[#111827]" />
                  <span>Copy Grocery List</span>
                </>
              )}
            </button>
            <button
              onClick={onClearAll}
              className="btn-secondary h-10 px-3.5 text-xs text-[#D11A4F] hover:bg-rose-50 cursor-pointer"
              title="Clear all swaps"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Swapped Items List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {items.map((item) => {
          const sugarSaved = Math.max(0, item.originalProduct.sugarTeaspoons - item.swap.sugarTeaspoons);

          return (
            <motion.div
              key={item.id}
              layout
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              className="bg-white rounded-3xl border border-[#EAE7E0] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-2.5">
                  <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">
                    {item.swap.brand}
                  </span>
                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 rounded-full text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Remove from list"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h4 className="text-lg font-black text-[#111827]">
                  {item.swap.name}
                </h4>

                <div className="p-3 bg-[#EAF8F1] rounded-2xl border border-[#CDEEDF] my-3 text-xs text-[#0A6B4A] font-bold flex items-center justify-between">
                  <span>Replaced: {item.originalProduct.name}</span>
                  <span className="font-black text-[#0A6B4A]">Save {sugarSaved.toFixed(1)} tsp sugar</span>
                </div>

                <p className="text-xs text-[#64748B] leading-relaxed">
                  {item.swap.whyBetter}
                </p>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-[#F0ECE1] text-xs">
                <span className="font-bold text-[#111827]">Price: ₹{item.swap.price}</span>
                <span className="font-black text-[#111827] bg-[#F4F1EA] px-3 py-1 rounded-full border border-[#EAE5DA]">
                  Score: {item.swap.healthScore} / 10
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
      </div>
    </div>
  );
};
