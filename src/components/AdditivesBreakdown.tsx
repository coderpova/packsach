import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, Info, Sparkles, X } from 'lucide-react';
import type { ParsedIngredient } from '../types/product';

interface AdditivesProps {
  parsedIngredients: ParsedIngredient[];
  rawText: string;
}

export const AdditivesBreakdown: React.FC<AdditivesProps> = ({
  parsedIngredients,
  rawText,
}) => {
  const [selectedIngredient, setSelectedIngredient] = useState<ParsedIngredient | null>(null);
  const [activeFilter, setActiveFilter] = useState<'all' | 'sugar' | 'palm' | 'additives'>('all');

  const filteredIngredients = parsedIngredients.filter((item) => {
    if (activeFilter === 'sugar') return item.isAddedSugar;
    if (activeFilter === 'palm') return item.isPalmOil;
    if (activeFilter === 'additives') return item.isAdditive;
    return true;
  });

  const sugarCount = parsedIngredients.filter(i => i.isAddedSugar).length;
  const palmCount = parsedIngredients.filter(i => i.isPalmOil).length;
  const additiveCount = parsedIngredients.filter(i => i.isAdditive).length;

  return (
    <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] border border-[#EAE5DA] text-xs font-bold text-[#111827]">
              <AlertCircle className="w-3.5 h-3.5 text-[#FF5E36]" />
              <span>Ingredient Decoder</span>
            </span>
            <span className="text-xs font-semibold text-[#64748B]">
              {parsedIngredients.length} ingredients analyzed
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
            Back Label Transparency
          </h3>
        </div>

        {/* Filter Pills (Theme C Style) */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs">
          <button
            onClick={() => setActiveFilter('all')}
            className={`px-3.5 py-1.5 font-bold rounded-full transition-colors cursor-pointer ${
              activeFilter === 'all'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'bg-[#FAF9F6] text-[#475569] border border-[#EAE7E0] hover:bg-[#F4F1EA]'
            }`}
          >
            All ({parsedIngredients.length})
          </button>
          <button
            onClick={() => setActiveFilter('sugar')}
            className={`px-3.5 py-1.5 font-bold rounded-full transition-colors cursor-pointer ${
              activeFilter === 'sugar'
                ? 'bg-[#FFD84D] text-[#8F6400] shadow-xs'
                : 'bg-[#FAF9F6] text-[#8F6400] border border-[#F5E6B5] hover:bg-[#FEF9EE]'
            }`}
          >
            Sugars ({sugarCount})
          </button>
          <button
            onClick={() => setActiveFilter('palm')}
            className={`px-3.5 py-1.5 font-bold rounded-full transition-colors cursor-pointer ${
              activeFilter === 'palm'
                ? 'bg-[#FF5E36] text-white shadow-xs'
                : 'bg-[#FAF9F6] text-[#FF5E36] border border-[#FFD8CC] hover:bg-[#FFF5F2]'
            }`}
          >
            Palm Oil ({palmCount})
          </button>
          <button
            onClick={() => setActiveFilter('additives')}
            className={`px-3.5 py-1.5 font-bold rounded-full transition-colors cursor-pointer ${
              activeFilter === 'additives'
                ? 'bg-[#6545F5] text-white shadow-xs'
                : 'bg-[#FAF9F6] text-[#6545F5] border border-[#DDD6FE] hover:bg-[#F5F3FF]'
            }`}
          >
            E-Numbers ({additiveCount})
          </button>
        </div>
      </div>

      <p className="text-xs sm:text-sm text-[#64748B] mb-4">
        Click any highlighted ingredient below to inspect functional roles, industrial aliases, or regulatory health flags:
      </p>

      {/* Interactive Ingredient Chips */}
      <div className="flex flex-wrap gap-2 min-h-[70px]">
        {filteredIngredients.map((ing, idx) => {
          const isSelected = selectedIngredient?.name === ing.name;

          let chipBg = 'bg-[#FAF9F6] border-[#EAE7E0] text-[#475569] hover:bg-[#F4F1EA]';
          if (ing.isPalmOil) chipBg = 'bg-[#FFF9EC] border-[#F5E6B5] text-[#8F6400] font-bold';
          else if (ing.isAddedSugar) chipBg = 'bg-[#FFF5F2] border-[#FFD8CC] text-[#D11A4F] font-bold';
          else if (ing.isTransFat) chipBg = 'bg-rose-50 border-rose-300 text-rose-950 font-black';
          else if (ing.isAdditive && ing.riskLevel === 'high') chipBg = 'bg-rose-50 border-rose-300 text-rose-950 font-bold';
          else if (ing.isAdditive) chipBg = 'bg-[#F5F3FF] border-[#DDD6FE] text-[#5538EE] font-bold';

          return (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedIngredient(isSelected ? null : ing)}
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs border transition-all cursor-pointer ${chipBg} ${
                isSelected ? 'ring-2 ring-[#111827] shadow-sm' : ''
              }`}
            >
              <span className="text-[10px] text-[#64748B] font-bold mr-0.5">#{ing.rank}</span>
              <span>{ing.name}</span>
              {ing.isPalmOil && <span className="text-[9px] px-1.5 py-0.2 bg-[#F5E6B5] text-[#8F6400] rounded-full font-black">PALM</span>}
              {ing.isAddedSugar && <span className="text-[9px] px-1.5 py-0.2 bg-[#FFD8CC] text-[#D11A4F] rounded-full font-black">SUGAR</span>}
              {ing.eNumber && <span className="text-[9px] px-1.5 py-0.2 bg-[#DDD6FE] text-[#5538EE] rounded-full font-black">{ing.eNumber}</span>}
            </motion.button>
          );
        })}
      </div>

      {/* Selected Ingredient Detail Card in Theme C Cream Box */}
      <AnimatePresence>
        {selectedIngredient && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 4 }}
            className="mt-5 p-5 rounded-2xl border border-[#EAE5DA] bg-[#F4F1EA] relative"
          >
            <button
              onClick={() => setSelectedIngredient(null)}
              className="absolute top-4 right-4 p-1.5 rounded-full text-slate-400 hover:text-[#111827] hover:bg-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-bold px-3 py-0.5 rounded-full bg-[#111827] text-white">
                Position #{selectedIngredient.rank} on label
              </span>
              <span className={`text-xs font-bold px-3 py-0.5 rounded-full ${
                selectedIngredient.riskLevel === 'high'
                  ? 'bg-rose-100 text-rose-800'
                  : selectedIngredient.riskLevel === 'moderate'
                  ? 'bg-amber-100 text-amber-900'
                  : 'bg-emerald-100 text-emerald-800'
              }`}>
                {selectedIngredient.riskLevel.toUpperCase()} CONCERN
              </span>
            </div>

            <h4 className="text-base font-black text-[#111827]">
              {selectedIngredient.name}
              {selectedIngredient.eNumber ? ` (${selectedIngredient.eNumber})` : ''}
            </h4>

            {selectedIngredient.functionalClass && (
              <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] font-bold text-slate-600">
                <span className="px-2 py-0.5 rounded-md bg-white border border-[#EAE5DA]">
                  Class: {selectedIngredient.functionalClass}
                </span>
                {selectedIngredient.regulatoryStatus && (
                  <span className="px-2 py-0.5 rounded-md bg-white border border-[#EAE5DA] text-slate-700">
                    Status: {selectedIngredient.regulatoryStatus}
                  </span>
                )}
              </div>
            )}

            <p className="text-xs sm:text-sm text-[#475569] mt-2 leading-relaxed">
              {selectedIngredient.explanation ||
                'Standard culinary or food base ingredient. Permitted under applicable food standards.'}
            </p>

            {selectedIngredient.scientificEvidence && (
              <div className="mt-2.5 p-2.5 bg-white/80 rounded-xl border border-[#EAE5DA] text-[11px] text-slate-600 leading-relaxed">
                <span className="font-bold text-slate-800 block mb-0.5">Scientific & Toxicological Context:</span>
                {selectedIngredient.scientificEvidence}
              </div>
            )}

            {selectedIngredient.isAddedSugar && (
              <div className="mt-3 text-xs text-amber-950 bg-amber-100/70 p-3 rounded-xl border border-amber-200 flex items-center gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>Sugar Masking Alert:</strong> Manufacturers often distribute sugar across multiple aliases (invert syrup, dextrose, maltodextrin) to prevent single "sugar" from appearing at position #1.
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Raw Ingredients Text accordion toggle */}
      <details className="mt-5 pt-3.5 border-t border-[#F0ECE1]">
        <summary className="text-xs font-bold text-[#64748B] hover:text-[#111827] cursor-pointer flex items-center gap-1.5">
          <Info className="w-3.5 h-3.5" />
          <span>View Verbatim Back Label Text</span>
        </summary>
        <p className="text-xs text-[#475569] font-mono mt-2.5 p-4 bg-[#F4F1EA] rounded-2xl border border-[#EAE5DA] leading-relaxed break-words">
          {rawText}
        </p>
      </details>
    </div>
  );
};
