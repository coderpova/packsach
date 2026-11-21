import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, AlertCircle, CheckCircle2, HelpCircle } from 'lucide-react';
import type { NutrientDeclarationStatus } from '../types/product';

interface SodiumVisualizerProps {
  sodiumMg: number;
  sodiumPercentDaily: number;
  isDeclared?: boolean;
  status?: NutrientDeclarationStatus;
}

export const SodiumVisualizer: React.FC<SodiumVisualizerProps> = ({
  sodiumMg,
  sodiumPercentDaily,
  isDeclared = true,
  status = 'declared',
}) => {
  const isHigh = sodiumPercentDaily >= 25;
  const isModerate = sodiumPercentDaily >= 12 && sodiumPercentDaily < 25;
  const saltGrams = Math.round((sodiumMg * 2.54) / 100) / 10;

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
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] border border-[#EAE5DA] text-xs font-bold text-[#111827]">
              <Sparkles className="w-3.5 h-3.5 text-[#3B82F6]" />
              <span>Sodium & Salt Meter</span>
            </span>
            {getStatusBadge()}
          </div>
          <span className="text-[11px] font-bold text-[#64748B] uppercase">
            WHO Daily Limit: 2,000mg
          </span>
        </div>

        {/* Big impact punchline */}
        <div className="my-3">
          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-black text-[#111827] tracking-tight">
              {isDeclared ? sodiumMg : 'Undeclared'}
            </span>
            <span className="text-base font-bold text-[#475569]">
              {isDeclared ? 'mg sodium' : 'on scanned packaging'}
            </span>
          </div>
          <p className="text-xs sm:text-sm font-medium text-[#64748B] mt-1">
            {isDeclared
              ? `Equivalent to ~${saltGrams}g table salt per single serving.`
              : 'Missing sodium is not zero consumption. Salt is present in formulation, but manufacturer omitted milligrams. Treated as unverified.'}
          </p>
        </div>

        {/* Progress Bar in Theme C Cream Box */}
        {isDeclared ? (
          <div className="p-4 bg-[#F4F1EA] border border-[#EAE5DA] rounded-2xl my-4">
            <div className="flex justify-between items-center text-xs font-bold mb-2">
              <span className="text-[#64748B]">Contribution to WHO 2,000mg/day Guidance:</span>
              <span className={`font-black px-2.5 py-0.5 rounded-full text-xs ${
                isHigh
                  ? 'bg-[#FF4D80]/15 text-[#D11A4F]'
                  : isModerate
                  ? 'bg-[#FFD84D]/30 text-[#8F6400]'
                  : 'bg-[#10B981]/15 text-[#0A6B4A]'
              }`}>
                {sodiumPercentDaily}% of Daily Guideline
              </span>
            </div>

            <div className="w-full bg-[#E5E0D5] h-2.5 rounded-full overflow-hidden p-0.5">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, sodiumPercentDaily)}%` }}
                transition={{ duration: 0.8, ease: 'easeOut' }}
                className={`h-full rounded-full ${
                  isHigh
                    ? 'bg-[#FF4D80]'
                    : isModerate
                    ? 'bg-[#FFD84D]'
                    : 'bg-[#10B981]'
                }`}
              />
            </div>
          </div>
        ) : (
          <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl my-4 text-xs text-amber-900 font-medium space-y-1">
            <span className="font-bold flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              <span>Unverified Sodium Status</span>
            </span>
            <p className="text-[11px] leading-relaxed">
              FSSAI rules mandate sodium disclosure on nutrition tables. Because this value was omitted from the physical packaging, PackSach does not award a perfect low-sodium score.
            </p>
          </div>
        )}
      </div>

      <div className="pt-2 text-[11px] text-[#64748B] flex items-center justify-between border-t border-[#F0ECE1] mt-2">
        <span>Table salt (NaCl) is 40% sodium</span>
        <span className="font-bold">{isDeclared ? `1 serving = ~${saltGrams}g salt` : 'Data incomplete'}</span>
      </div>
    </div>
  );
};
