import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, ChevronDown, ChevronUp, CheckCircle, AlertTriangle, HelpCircle } from 'lucide-react';
import type { HealthScoreDetails } from '../types/product';

interface HealthScoreGaugeProps {
  scoreDetails: HealthScoreDetails;
  productName: string;
}

export const HealthScoreGauge: React.FC<HealthScoreGaugeProps> = ({
  scoreDetails,
}) => {
  const [showCalculationModal, setShowCalculationModal] = useState<boolean>(false);
  const score = scoreDetails.score;

  const isPink = score < 4.0;
  const isYellow = score >= 4.0 && score < 7.0;

  const strokeColor = isPink ? '#FF4D80' : isYellow ? '#FFD84D' : '#10B981';
  const badgeBg = isPink
    ? 'bg-[#FF4D80]/15 text-[#D11A4F]'
    : isYellow
    ? 'bg-[#FFD84D]/30 text-[#8F6400]'
    : 'bg-[#10B981]/15 text-[#0A6B4A]';

  const radius = 64;
  const circumference = 2 * Math.PI * radius;

  return (
    <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden flex flex-col justify-between">
      <div>
        <div className="flex items-center justify-between mb-4">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] border border-[#EAE5DA] text-xs font-bold text-[#111827]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#FF5E36]" />
            <span>Health Score</span>
          </span>
          <div className="flex items-center gap-2">
            {scoreDetails.isProvisional && (
              <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                PROVISIONAL SCORE
              </span>
            )}
            <span className={`text-xs font-black px-3 py-1 rounded-full ${badgeBg}`}>
              {scoreDetails.verdict}
            </span>
          </div>
        </div>

        {/* Circular Gauge and Score Display */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 my-3">
          <div className="relative w-32 h-32 flex items-center justify-center shrink-0">
            <svg className="w-full h-full -rotate-90" viewBox="0 0 160 160">
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke="#F4F1EA"
                strokeWidth="12"
                fill="none"
              />
              <motion.circle
                cx="80"
                cy="80"
                r={radius}
                stroke={strokeColor}
                strokeWidth="12"
                fill="none"
                strokeLinecap="round"
                strokeDasharray={circumference}
                initial={{ strokeDashoffset: circumference }}
                animate={{ strokeDashoffset: circumference - (circumference * (score / 10)) }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
              />
            </svg>

            {/* Score Number in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
              <span className="text-3xl font-black text-[#111827] leading-none">
                {score.toFixed(1)}
              </span>
              <span className="text-[10px] font-bold text-[#64748B] mt-0.5">out of 10</span>
            </div>
          </div>

          {/* Verdict Description */}
          <div className="flex-1 text-center sm:text-left">
            <h4 className="text-base font-black text-[#111827]">
              {scoreDetails.verdict}
            </h4>
            <p className="text-xs sm:text-sm font-medium text-[#475569] mt-1.5 leading-relaxed">
              {scoreDetails.summary}
            </p>

            <button
              onClick={() => setShowCalculationModal(!showCalculationModal)}
              className="mt-3.5 inline-flex items-center gap-1.5 text-xs font-bold text-[#111827] hover:text-[#FF5E36] transition-colors cursor-pointer"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>{showCalculationModal ? 'Hide Calculation Breakdown' : 'View Transparent Scoring Logic'}</span>
              {showCalculationModal ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
            </button>
          </div>
        </div>

        {/* Expandable Calculation Breakdown Drawer (Theme C Cream Box) */}
        <AnimatePresence>
          {showCalculationModal && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mt-4 pt-4 border-t border-[#F0ECE1]"
            >
              <div className="bg-[#F4F1EA] p-5 rounded-2xl border border-[#EAE5DA] space-y-3">
                <div className="flex items-center justify-between text-xs font-black border-b border-[#EAE5DA] pb-2">
                  <span className="text-[#111827]">Scoring Engine (Base: 10.0 Pts):</span>
                  <span className="text-[#FF5E36]">Science-Backed Rules</span>
                </div>

                {scoreDetails.deductions.map((ded, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 text-xs">
                    <div className="flex items-start gap-2">
                      <AlertTriangle className="w-3.5 h-3.5 text-[#FF4D80] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#111827]">{ded.factor}</span>
                        <span className="text-[10px] text-[#64748B] block">{ded.reason}</span>
                      </div>
                    </div>
                    <span className="font-black text-[#D11A4F] shrink-0">
                      -{ded.penalty.toFixed(1)} pts
                    </span>
                  </div>
                ))}

                {scoreDetails.positivePoints.map((pos, i) => (
                  <div key={i} className="flex items-start justify-between gap-2 text-xs">
                    <div className="flex items-start gap-2">
                      <CheckCircle className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                      <div>
                        <span className="font-bold text-[#111827]">{pos.factor}</span>
                        <span className="text-[10px] text-[#64748B] block">{pos.reason}</span>
                      </div>
                    </div>
                    <span className="font-black text-[#0A6B4A] shrink-0">
                      +{pos.bonus.toFixed(1)} pts
                    </span>
                  </div>
                ))}

                {scoreDetails.dataCompletenessPercent !== undefined && (
                  <div className="flex items-center justify-between p-2.5 bg-white/70 rounded-xl border border-[#EAE5DA] text-xs">
                    <span className="font-bold text-[#64748B]">Nutritional Data Completeness:</span>
                    <span className="font-black text-[#111827]">
                      {scoreDetails.dataCompletenessPercent}% {scoreDetails.uncertaintyRange ? `(${scoreDetails.uncertaintyRange})` : ''}
                    </span>
                  </div>
                )}

                {scoreDetails.partialDataNotes && scoreDetails.partialDataNotes.length > 0 && (
                  <div className="p-2.5 bg-amber-100/60 rounded-xl border border-amber-200 text-[11px] text-amber-900 space-y-1">
                    <span className="font-bold block">Partial Data Transparency:</span>
                    {scoreDetails.partialDataNotes.map((note, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-amber-700">•</span>
                        <span>{note}</span>
                      </div>
                    ))}
                  </div>
                )}

                {scoreDetails.assumptionsAndLimitations && scoreDetails.assumptionsAndLimitations.length > 0 && (
                  <div className="p-2.5 bg-white/60 rounded-xl border border-[#EAE5DA] text-[10px] text-slate-600 space-y-1">
                    <span className="font-bold text-slate-800 block">Scientific Assumptions & Framework Limits:</span>
                    {scoreDetails.assumptionsAndLimitations.map((item, i) => (
                      <div key={i} className="flex items-start gap-1.5">
                        <span className="text-slate-400">›</span>
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                )}

                <div className="pt-2.5 border-t border-[#EAE5DA] flex justify-between items-center text-xs font-bold">
                  <span className="text-[#64748B]">Final Health Score:</span>
                  <span className="text-base font-black text-[#111827]">{score.toFixed(1)} / 10</span>
                </div>

                {scoreDetails.scientificReferences && scoreDetails.scientificReferences.length > 0 && (
                  <div className="pt-1 text-[9px] text-[#64748B] space-y-0.5">
                    <span className="font-bold text-slate-700 block">Scientific References:</span>
                    {scoreDetails.scientificReferences.map((ref, i) => (
                      <div key={i} className="truncate">[{i + 1}] {ref}</div>
                    ))}
                  </div>
                )}

                <p className="text-[10px] text-[#64748B] italic pt-1 leading-tight">
                  {scoreDetails.disclaimer || 'PackSach Health Score is an informational comparison tool based on published WHO/FSSAI dietary guidelines. It is not an official FSSAI rating.'}
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};
