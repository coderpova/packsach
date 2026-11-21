import React from 'react';
import { Check } from 'lucide-react';

interface PricingSectionProps {
  onStartFree: () => void;
}

export const PricingSection: React.FC<PricingSectionProps> = ({ onStartFree }) => {
  return (
    <section id="pricing" className="py-16 sm:py-24 border-t border-[#EAE7E0]">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-left mb-10">
          <span className="text-xs font-black uppercase tracking-wider text-[#FF5E36] block">
            Pricing
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight mt-1">
            Start free. Go deeper when ready.
          </h2>
        </div>

        {/* 3 Pricing Cards Grid Matching Reference */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-stretch">
          {/* Card 1: Free (White Card) */}
          <div className="ps-card p-6 sm:p-7 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#64748B] block">Free</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-[#111827]">Rs 0</span>
              </div>

              <div className="mt-6 space-y-3 text-xs text-[#475569] font-semibold">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Basic scans</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Health score</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Visual Shock Dashboard</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={onStartFree}
                className="w-full btn-secondary h-10 text-xs font-bold rounded-full cursor-pointer"
              >
                Start free
              </button>
            </div>
          </div>

          {/* Card 2: Plus (Dark Black Card matching Reference) */}
          <div className="bg-[#18181B] text-white p-6 sm:p-7 rounded-3xl shadow-xl flex flex-col justify-between border border-slate-700 relative overflow-hidden">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-400">Plus</span>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#FF5E36] text-white">
                  Popular
                </span>
              </div>

              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white">Rs 49</span>
                <span className="text-xs font-bold text-slate-400">/month</span>
              </div>

              <div className="mt-6 space-y-3 text-xs text-slate-200 font-semibold">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF5E36] shrink-0" />
                  <span>Everything in Free</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF5E36] shrink-0" />
                  <span>Detailed reports</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-[#FF5E36] shrink-0" />
                  <span>Swap lists</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={onStartFree}
                className="w-full btn-coral h-10 text-xs font-bold rounded-full cursor-pointer shadow-sm"
              >
                Get Plus
              </button>
            </div>
          </div>

          {/* Card 3: For brands and apps (White Card) */}
          <div className="ps-card p-6 sm:p-7 bg-white flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-[#64748B] block">For brands and apps</span>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-[#111827]">Custom</span>
              </div>

              <div className="mt-6 space-y-3 text-xs text-[#475569] font-semibold">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>B2B API for nutrition apps, gyms, insurers</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Clean-label verified badge</span>
                </div>
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={() => alert('B2B integrations: contact b2b@packsach.in')}
                className="w-full btn-secondary h-10 text-xs font-bold rounded-full cursor-pointer"
              >
                Talk to us
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
