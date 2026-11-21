import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Flame, Info, CheckCircle2, HelpCircle } from 'lucide-react';
import type { NutrientDeclarationStatus } from '../types/product';

interface SugarCubesProps {
  sugarGramsPerServe: number;
  addedSugarGrams?: number | null;
  sugarTeaspoons: number;
  servingSizeText: string;
  isDeclared?: boolean;
  status?: NutrientDeclarationStatus;
}

export const SugarCubesVisualizer: React.FC<SugarCubesProps> = ({
  sugarGramsPerServe,
  addedSugarGrams,
  sugarTeaspoons,
  servingSizeText,
  isDeclared = true,
  status = 'declared',
}) => {
  const [multiplier, setMultiplier] = useState<number>(1);

  const activeTeaspoons = Math.round(sugarTeaspoons * multiplier * 10) / 10;
  const activeGrams = Math.round(sugarGramsPerServe * multiplier * 10) / 10;
  const activeAddedGrams = addedSugarGrams !== undefined && addedSugarGrams !== null 
    ? Math.round(addedSugarGrams * multiplier * 10) / 10 
    : null;

  const wholeCubes = Math.floor(activeTeaspoons);
  const hasPartialCube = activeTeaspoons - wholeCubes > 0.15;
  const totalCubesToRender = Math.min(24, Math.max(1, wholeCubes + (hasPartialCube ? 1 : 0)));

  // WHO Guideline conditional benchmark: 25g/day ≈ 5% total energy for 2,000 kcal diet
  const whoDailyLimitGrams = 25;
  const percentOfWhoLimit = Math.min(250, Math.round(((activeAddedGrams ?? activeGrams) / whoDailyLimitGrams) * 100));

  const handleMultiplierChange = (val: number) => {
    setMultiplier(val);
  };

  const getStatusBadge = () => {
    switch (status) {
      case 'declared':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>Declared on Pack</span>
          </span>
        );
      case 'not_declared':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 border border-amber-200 text-[10px] font-bold">
            <AlertCircle className="w-3 h-3" />
            <span>Not Declared on Pack</span>
          </span>
        );
      case 'not_detected_by_ocr':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200 text-[10px] font-bold">
            <HelpCircle className="w-3 h-3" />
            <span>Not Detected by OCR</span>
          </span>
        );
      case 'unreadable':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 text-[10px] font-bold">
            <AlertCircle className="w-3 h-3" />
            <span>Unreadable Label Region</span>
          </span>
        );
      case 'user_corrected':
        return (
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-purple-50 text-purple-800 border border-purple-200 text-[10px] font-bold">
            <CheckCircle2 className="w-3 h-3" />
            <span>User Verified / Corrected</span>
          </span>
        );
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF5F2] border border-[#FFD8CC] text-xs font-bold text-[#D11A4F]">
              <Flame className="w-3.5 h-3.5 text-[#FF5E36] fill-current" />
              <span>Sugar Shock Analysis</span>
            </span>
            {getStatusBadge()}
          </div>

          {/* Multiplier buttons (Theme C Pill Selector) */}
          <div className="flex items-center bg-[#F4F1EA] p-1 rounded-full border border-[#EAE5DA]">
            {[1, 2, 3].map((val) => (
              <button
                key={val}
                onClick={() => handleMultiplierChange(val)}
                className={`px-3 py-1 text-xs font-bold rounded-full transition-all cursor-pointer ${
                  multiplier === val
                    ? 'bg-[#111827] text-white shadow-xs'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                {val === 1 ? '1x Serve' : val === 2 ? '2x Serve' : 'Full Pack'}
              </button>
            ))}
          </div>
        </div>

        {/* Big impact punchline */}
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#111827] tracking-tight">
              {isDeclared ? activeTeaspoons : 'Undeclared'}
            </span>
            <span className="text-base font-bold text-[#475569]">
              {isDeclared ? 'teaspoons of sugar' : 'sugar grams on label'}
            </span>
          </div>

          <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
            {isDeclared ? (
              <>
                Delivers <strong className="text-[#D11A4F] font-bold">{activeGrams}g</strong> total sugars in {multiplier === 1 ? servingSizeText : `${multiplier}x servings`}.
                {activeAddedGrams !== null && (
                  <span className="block mt-0.5 text-slate-500 font-semibold">
                    (Includes <strong className="text-slate-800">{activeAddedGrams}g added sugar</strong>; remainder represents intrinsic milk/grain/fruit sugars).
                  </span>
                )}
              </>
            ) : (
              'Exact sugar weight was not printed on this scanned packaging. Evaluated qualitatively via mandatory FSSAI descending ingredient order.'
            )}
          </p>
        </div>

        {/* Animated Sugar Cubes Container in Theme C Cream Box */}
        {isDeclared && (
          <div className="p-5 bg-[#F4F1EA] border border-[#EAE5DA] rounded-2xl my-4">
            <div className="text-xs font-bold text-[#475569] mb-3.5 flex items-center justify-between">
              <span>Physical Sugar Units (Interactive):</span>
              <span className="text-[#111827] font-black">{totalCubesToRender} Cubes</span>
            </div>

            <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 gap-2.5 min-h-[80px] items-center justify-items-center">
              {Array.from({ length: totalCubesToRender }).map((_, index) => {
                const isFractional = hasPartialCube && index === totalCubesToRender - 1;
                return (
                  <motion.div
                    key={`${multiplier}-${index}`}
                    initial={{ y: -16, opacity: 0, scale: 0.7 }}
                    animate={{ y: 0, opacity: 1, scale: 1 }}
                    transition={{
                      type: 'spring',
                      stiffness: 400,
                      damping: 20,
                      delay: index * 0.04
                    }}
                    className={`relative w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center font-bold text-xs select-none shadow-sm ${
                      isFractional
                        ? 'bg-gradient-to-br from-white to-[#F4F1EA] border-2 border-dashed border-[#D11A4F] text-[#D11A4F]'
                        : 'bg-white border border-[#EAE7E0] text-[#111827]'
                    }`}
                  >
                    <span className="relative z-10">{isFractional ? '½' : '1'}</span>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-3 text-center text-[11px] text-[#64748B] font-semibold">
              Each cube represents 1 standard kitchen teaspoon (≈ 4.0g sugar)
            </div>
          </div>
        )}

        {/* WHO Guidelines comparison meter */}
        {isDeclared && (
          <div className="mt-4">
            <div className="flex justify-between text-xs font-bold mb-2">
              <span className="text-[#475569] flex items-center gap-1.5">
                <span>WHO Reference Guidance Benchmark (25g/day free sugars)</span>
                <Info className="w-3.5 h-3.5 text-[#64748B]" />
              </span>
              <span className={`font-black ${percentOfWhoLimit > 60 ? 'text-[#D11A4F]' : 'text-[#0A6B4A]'}`}>
                {percentOfWhoLimit}% of daily benchmark
              </span>
            </div>

            <div className="w-full bg-[#E5E0D5] h-2.5 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, percentOfWhoLimit)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  percentOfWhoLimit > 80
                    ? 'bg-[#FF4D80]'
                    : percentOfWhoLimit > 40
                    ? 'bg-[#FFD84D]'
                    : 'bg-[#10B981]'
                }`}
              />
            </div>

            {percentOfWhoLimit > 50 && (
              <div className="mt-4 p-4 bg-rose-50 border border-rose-200 rounded-2xl flex items-start gap-3 text-xs text-rose-900 font-medium">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>
                  <strong>High Contribution:</strong> A single portion contributes over half of the WHO recommended daily guidance benchmark for free sugars (based on 5% energy intake for a 2,000 kcal diet).
                </span>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
