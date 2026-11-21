import React from 'react';
import { motion } from 'framer-motion';
import { Droplet, AlertTriangle, CheckCircle2, ShieldAlert } from 'lucide-react';
import type { Product } from '../types/product';

interface OilMeterProps {
  palmOil: Product['palmOil'];
  totalFatGrams: number;
  saturatedFatGrams: number;
  transFatGrams: number;
}

export const OilMeterVisualizer: React.FC<OilMeterProps> = ({
  palmOil,
  saturatedFatGrams,
  transFatGrams,
}) => {
  const isPresent = palmOil.present;
  const rank = palmOil.rank;
  const isTopThree = rank !== null && rank <= 3;
  const hasTransFat = transFatGrams > 0.05;

  return (
    <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between relative overflow-hidden">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${
            isPresent
              ? 'bg-[#FFD84D]/30 text-[#8F6400] border border-[#F5E6B5]'
              : 'bg-[#10B981]/15 text-[#0A6B4A] border border-[#10B981]/20'
          }`}>
            <Droplet className="w-3.5 h-3.5 fill-current" />
            <span>Oil & Fat Profile</span>
          </span>
          <span className="text-[11px] font-bold text-[#64748B] uppercase tracking-wider">
            FSSAI Label Order Rule
          </span>
        </div>

        {/* Primary Palm Oil Verdict */}
        <div className="my-3">
          {isPresent ? (
            <div>
              <div className="flex items-center gap-2">
                <span className={`text-2xl sm:text-3xl font-black tracking-tight ${
                  isTopThree ? 'text-[#D11A4F]' : 'text-[#8F6400]'
                }`}>
                  {isTopThree ? 'Palm Oil in Top 3 Ingredients' : `Palm Oil at Position #${rank}`}
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
                FSSAI regulations mandate ingredients listed in <strong>descending order of weight</strong>.
              </p>
            </div>
          ) : (
            <div>
              <div className="flex items-center gap-2 text-[#0A6B4A]">
                <CheckCircle2 className="w-6 h-6 shrink-0 text-[#10B981]" />
                <span className="text-2xl sm:text-3xl font-black text-[#111827]">
                  Zero Palm Oil Detected
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
                No refined palmolein, palm kernel fat, or hydrogenated shortening listed in ingredients.
              </p>
            </div>
          )}
        </div>

        {/* Visual Measurement & Oil Drops Animation in Theme C Cream Box */}
        <div className="p-5 bg-[#F4F1EA] border border-[#EAE5DA] rounded-2xl my-4">
          <div className="flex items-center justify-around gap-5">
            {/* Measuring Cylinder Graphic */}
            <div className="flex flex-col items-center">
              <div className="relative w-14 h-22 bg-white border border-[#D5CFC2] rounded-xl overflow-hidden flex flex-col justify-end p-1 shadow-xs">
                <div className="absolute left-1 top-2 w-2 h-0.5 bg-[#D5CFC2]" />
                <div className="absolute left-1 top-6 w-3 h-0.5 bg-[#D5CFC2]" />
                <div className="absolute left-1 top-10 w-2 h-0.5 bg-[#D5CFC2]" />
                <div className="absolute left-1 top-14 w-3 h-0.5 bg-[#D5CFC2]" />

                {isPresent && (
                  <motion.div
                    initial={{ height: 0 }}
                    animate={{ height: isTopThree ? '75%' : '40%' }}
                    transition={{ duration: 1, ease: 'easeOut' }}
                    className={`w-full rounded-lg ${isTopThree ? 'bg-[#FF5E36]' : 'bg-[#FFD84D]'}`}
                  />
                )}

                {/* Animated drip */}
                {isPresent && (
                  <motion.div
                    animate={{
                      y: [0, 16, 26],
                      opacity: [0, 1, 0],
                      scale: [0.8, 1, 0.5]
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 1.5,
                      ease: 'easeInOut'
                    }}
                    className="absolute top-2 left-1/2 -translate-x-1/2 w-2.5 h-3 bg-[#FF5E36] rounded-full"
                  />
                )}
              </div>
              <span className="text-[10px] font-black uppercase tracking-wider mt-2 text-[#475569]">
                {isPresent ? 'Refined Palm Fat' : 'Clean Fat Source'}
              </span>
            </div>

            {/* Fat Stats */}
            <div className="flex-1 space-y-2.5 text-xs">
              <div className="flex items-center justify-between border-b border-[#EAE5DA] pb-2">
                <span className="text-[#64748B] font-bold">Ingredient Order:</span>
                <span className={`font-black px-2.5 py-0.5 rounded-full text-xs ${
                  isTopThree
                    ? 'bg-rose-100 text-rose-800'
                    : isPresent
                    ? 'bg-amber-100 text-amber-900'
                    : 'bg-emerald-100 text-emerald-800'
                }`}>
                  {rank ? `#${rank} on label` : 'Not Listed'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#EAE5DA] pb-2">
                <span className="text-[#64748B] font-bold">Percentage Mode:</span>
                <span className="font-bold text-slate-700 text-[11px]">
                  {palmOil.isExactPercentageDeclared ? 'QUID Declared on Pack' : 'Qualitative Rank (Undeclared %)'}
                </span>
              </div>

              <div className="flex items-center justify-between border-b border-[#EAE5DA] pb-2">
                <span className="text-[#64748B] font-bold">Saturated Fat:</span>
                <span className="font-black text-[#111827]">{saturatedFatGrams}g per serve</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-[#64748B] font-bold">Trans Fat:</span>
                <span className={`font-black ${hasTransFat ? 'text-[#D11A4F]' : 'text-[#0A6B4A]'}`}>
                  {transFatGrams > 0 ? `${transFatGrams}g` : '0g (Safe)'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Nutritional Insight Box (Theme C Styled) */}
        <div className={`p-4 rounded-2xl border flex items-start gap-3 text-xs ${
          isTopThree
            ? 'bg-rose-50 border-rose-200 text-rose-900'
            : isPresent
            ? 'bg-amber-50 border-amber-200 text-amber-900'
            : 'bg-emerald-50 border-emerald-200 text-emerald-900'
        }`}>
          {isTopThree ? (
            <ShieldAlert className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
          ) : isPresent ? (
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
          )}

          <div>
            <p className="font-black text-xs">
              {isPresent ? 'PackSach Evaluation:' : 'Clean Fat Profile:'}
            </p>
            <p className="mt-0.5 leading-relaxed text-[11px] text-[#475569]">
              {isPresent ? (
                <>
                  Ingredient lists disclose order, not hidden percentages. Since palm oil appears at{' '}
                  <strong>#{rank}</strong>, it is a primary bulk fat used by manufacturers to cut costs and extend shelf life.
                </>
              ) : (
                'Formulated without industrial palm oil or hydrogenated fats. Uses clean whole ingredients or heart-friendly natural oils.'
              )}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
