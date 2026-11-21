import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Camera, Sparkles, Flame, Droplet, ShieldCheck, ArrowRight, CheckCircle2, ChevronRight, Zap } from 'lucide-react';

interface StoryStep {
  id: string;
  stepNumber: string;
  badge: string;
  title: string;
  headline: string;
  description: string;
  stats: { label: string; value: string; color: string }[];
  phoneScreen: 'scan' | 'shock' | 'swap';
}

const STORY_STEPS: StoryStep[] = [
  {
    id: 'step-scan',
    stepNumber: '01',
    badge: 'Optical Character Recognition',
    title: 'Scan Any Food Packet in 1.2 Seconds',
    headline: 'Point your camera or upload a photo of any grocery packet.',
    description:
      'Our AI OCR engine scans through microscopic fine print on the back of the packet, instantly isolating the ingredients list and the nutritional table to extract factual formulation data.',
    stats: [
      { label: 'Recognition Speed', value: '1.2s', color: '#6545F5' },
      { label: 'Deception Detection', value: '100%', color: '#10B981' },
      { label: 'FSSAI Regulation Check', value: 'Instant', color: '#FFD84D' },
    ],
    phoneScreen: 'scan',
  },
  {
    id: 'step-shock',
    stepNumber: '02',
    badge: 'Visual Shock Engine',
    title: 'Grams Converted Into Physical Sugar Cubes',
    headline: 'See the true physical scale of sugar, palm oil, and hidden sodium.',
    description:
      'Instead of confusing percentages and gram labels, PackSach converts hidden sugar into physical kitchen teaspoons (1 tsp ≈ 4.0g), renders animated sugar cubes, and flags industrial palmolein oil rank.',
    stats: [
      { label: 'Standard Spoon Scale', value: '1 tsp = 4.0g', color: '#FF4D80' },
      { label: 'WHO Daily Ceiling', value: '25g Cap', color: '#F59E0B' },
      { label: 'Palm Oil Rank', value: '#2 on Label', color: '#EA580C' },
    ],
    phoneScreen: 'shock',
  },
  {
    id: 'step-swap',
    stepNumber: '03',
    badge: 'Price-Matched Alternatives',
    title: '1-Tap Clean Swaps in the Same Price Bracket',
    headline: 'Upgrade your diet without spending a single extra rupee.',
    description:
      'PackSach cross-references our verified database to recommend healthier swaps in the exact same product category that match or beat retail pricing, with zero industrial palm oil.',
    stats: [
      { label: 'Price Parity', value: '₹20 vs ₹20', color: '#10B981' },
      { label: 'Sugar Avoided', value: '3.6 tsp', color: '#10B981' },
      { label: 'Score Improvement', value: '+6.2 / 10', color: '#6545F5' },
    ],
    phoneScreen: 'swap',
  },
];

interface StickyScrollStoryProps {
  onOpenScanner: () => void;
  onExploreProducts: () => void;
}

export const StickyScrollStory: React.FC<StickyScrollStoryProps> = ({
  onOpenScanner,
  onExploreProducts,
}) => {
  const [activeStepIndex, setActiveStepIndex] = useState<number>(0);
  const activeStep = STORY_STEPS[activeStepIndex];

  return (
    <section className="py-16 sm:py-24 relative overflow-hidden bg-gradient-to-b from-white via-purple-50/20 to-white border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-[#6545F5] mb-4">
            <Zap className="w-3.5 h-3.5 text-[#6545F5]" />
            <span>Progressive Visual Storytelling</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-tight">
            How PackSach Works: <span className="text-[#6545F5]">From Deception to Truth</span>
          </h2>
          <p className="text-sm sm:text-base text-[#475569] mt-3 leading-relaxed">
            Follow the 3-step journey of how PackSach demystifies ultra-processed grocery packaging into actionable health decisions.
          </p>

          {/* Interactive Step Switcher Tabs */}
          <div className="flex items-center justify-center gap-2 mt-6 p-1.5 bg-slate-100/80 backdrop-blur-md rounded-2xl max-w-md mx-auto border border-slate-200">
            {STORY_STEPS.map((step, idx) => (
              <button
                key={step.id}
                onClick={() => setActiveStepIndex(idx)}
                className={`flex-1 py-2 px-3 text-xs font-bold rounded-xl transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                  activeStepIndex === idx
                    ? 'bg-white text-[#111827] shadow-sm'
                    : 'text-[#64748B] hover:text-[#111827]'
                }`}
              >
                <span className="w-4 h-4 rounded-full bg-[#6545F5]/10 text-[#6545F5] text-[10px] flex items-center justify-center font-black">
                  {idx + 1}
                </span>
                <span className="hidden sm:inline">{step.badge.split(' ')[0]}</span>
                <span className="sm:hidden">Step {idx + 1}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 2-Column Sticky Layout: Phone Mockup (Left) & Story Content (Right) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
          {/* Left Column: 3D Smartphone Device Mockup (5 cols) */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-[300px] sm:w-[320px] h-[580px] sm:h-[620px] bg-slate-900 rounded-[44px] p-3.5 border-4 border-slate-800 shadow-2xl ring-1 ring-slate-700/60 flex flex-col justify-between overflow-hidden">
              {/* Dynamic Island / Speaker Notch */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-5 bg-black rounded-full z-30 flex items-center justify-between px-3">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-900" />
                <span className="w-2 h-2 rounded-full bg-slate-800" />
              </div>

              {/* Top Status Bar Inside Screen */}
              <div className="pt-2 px-4 flex justify-between items-center text-[10px] font-bold text-slate-400 z-20">
                <span>9:41</span>
                <div className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>5G</span>
                </div>
              </div>

              {/* Inner Smartphone Screen Content */}
              <div className="relative flex-1 bg-slate-950 rounded-[34px] overflow-hidden my-2 flex flex-col justify-between p-4 text-white">
                <AnimatePresence mode="wait">
                  {/* SCREEN 1: OPTICAL SCANNER HUD */}
                  {activeStep.phoneScreen === 'scan' && (
                    <motion.div
                      key="screen-scan"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      <div>
                        {/* Top App Header */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                          <span className="text-[11px] font-bold text-purple-400">PackSach Camera</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                            Live Lens
                          </span>
                        </div>

                        {/* Scanner Frame Viewfinder */}
                        <div className="relative h-44 rounded-2xl bg-slate-900 border border-slate-700 overflow-hidden flex items-center justify-center">
                          {/* Animated Scan Line */}
                          <motion.div
                            animate={{ y: [0, 160, 0] }}
                            transition={{ repeat: Infinity, duration: 2.4, ease: 'easeInOut' }}
                            className="absolute inset-x-0 h-0.5 bg-[#FF4D80] shadow-[0_0_12px_#FF4D80] z-20"
                          />

                          <img
                            src="https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60"
                            alt="Packet Scanner"
                            className="w-full h-full object-cover opacity-60"
                          />

                          {/* Bounding box over deceptive label text */}
                          <div className="absolute top-10 left-6 right-6 p-1.5 rounded-lg border-2 border-dashed border-[#FFD84D] bg-yellow-500/10 text-center">
                            <span className="text-[10px] font-black text-[#FFD84D]">
                              Claim: "2x Immunity Booster"
                            </span>
                          </div>
                        </div>

                        {/* Extracted Text Box */}
                        <div className="mt-3 p-2.5 rounded-xl bg-slate-900/90 border border-slate-800 text-left">
                          <span className="text-[9px] font-bold uppercase text-slate-400 block">OCR Extracted:</span>
                          <p className="text-[10px] text-slate-300 font-mono mt-0.5 leading-snug">
                            Cereal Extract (56%), Sugar (32%), INS 150d...
                          </p>
                        </div>
                      </div>

                      {/* Screen Action Button */}
                      <button
                        onClick={onOpenScanner}
                        className="btn-primary w-full h-9 text-[11px] font-bold gap-1.5"
                      >
                        <Camera className="w-3.5 h-3.5" />
                        <span>Tap to Capture Any Label</span>
                      </button>
                    </motion.div>
                  )}

                  {/* SCREEN 2: VISUAL SUGAR SHOCK & PALM OIL */}
                  {activeStep.phoneScreen === 'shock' && (
                    <motion.div
                      key="screen-shock"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                          <span className="text-[11px] font-bold text-amber-400">Nutritional Reality</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-400 font-bold">
                            High Sugar
                          </span>
                        </div>

                        {/* Big Sugar Count */}
                        <div className="text-center my-2 p-3 rounded-2xl bg-slate-900 border border-slate-800">
                          <div className="flex items-baseline justify-center gap-1.5">
                            <span className="text-4xl font-black text-white">3.6</span>
                            <span className="text-xs font-bold text-slate-400">teaspoons</span>
                          </div>
                          <span className="text-[10px] text-rose-400 font-semibold block mt-0.5">
                            14.2g sugar per 20g serve
                          </span>

                          {/* Sugar cubes mini grid */}
                          <div className="flex justify-center gap-1.5 mt-2.5">
                            {[1, 2, 3, 4].map((i) => (
                              <div
                                key={i}
                                className="w-6 h-6 rounded bg-slate-200 text-[#111827] text-[10px] font-black flex items-center justify-center shadow-xs"
                              >
                                {i === 4 ? '½' : '1'}
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Palm Oil Order Banner */}
                        <div className="mt-2.5 p-2.5 rounded-xl bg-rose-500/10 border border-rose-500/20 flex items-center gap-2 text-left">
                          <Droplet className="w-4 h-4 text-rose-400 shrink-0 fill-current" />
                          <div>
                            <span className="text-[10px] font-black text-rose-300 block">Palm Oil #2 on Label</span>
                            <span className="text-[9px] text-slate-400">Refined Palmolein Bulk Ingredient</span>
                          </div>
                        </div>
                      </div>

                      {/* Screen Action */}
                      <button
                        onClick={() => setActiveStepIndex(2)}
                        className="btn-primary w-full h-9 text-[11px] font-bold gap-1.5"
                      >
                        <span>Find Price-Matched Swap</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </motion.div>
                  )}

                  {/* SCREEN 3: SMART SWAP RECOMMENDATION */}
                  {activeStep.phoneScreen === 'swap' && (
                    <motion.div
                      key="screen-swap"
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 1.04 }}
                      transition={{ duration: 0.25 }}
                      className="flex-1 flex flex-col justify-between"
                    >
                      <div>
                        {/* Header */}
                        <div className="flex items-center justify-between mb-3 pb-2 border-b border-slate-800">
                          <span className="text-[11px] font-bold text-emerald-400">PackSach Smart Swap</span>
                          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold">
                            Score 9.4/10
                          </span>
                        </div>

                        {/* Swap Card */}
                        <div className="p-3 rounded-2xl bg-slate-900 border border-emerald-500/30 text-left">
                          <span className="text-[9px] font-bold uppercase text-emerald-400">Clean Alternative:</span>
                          <h4 className="text-xs font-black text-white mt-0.5">
                            Roasted Ragi Sattu Drink
                          </h4>
                          <span className="text-[10px] text-slate-400">Same Price: ₹20 • 0g Added Sugar</span>

                          <div className="mt-3 space-y-1.5 text-[10px]">
                            <div className="flex justify-between text-slate-300 border-b border-slate-800 pb-1">
                              <span>Sugar per serve:</span>
                              <strong className="text-emerald-400 font-black">0 tsp (Save 3.6 tsp)</strong>
                            </div>
                            <div className="flex justify-between text-slate-300 border-b border-slate-800 pb-1">
                              <span>Industrial Palm Oil:</span>
                              <strong className="text-emerald-400 font-black">Zero Palm Fat</strong>
                            </div>
                            <div className="flex justify-between text-slate-300">
                              <span>Chemical Additives:</span>
                              <strong className="text-emerald-400 font-black">0 E-Numbers</strong>
                            </div>
                          </div>
                        </div>

                        <div className="mt-2.5 p-2 rounded-xl bg-purple-500/10 border border-purple-500/20 text-center">
                          <span className="text-[10px] font-bold text-purple-300">
                            Available on Blinkit, Zepto & Local Kiranas
                          </span>
                        </div>
                      </div>

                      {/* Screen Action */}
                      <button
                        onClick={onExploreProducts}
                        className="btn-primary w-full h-9 text-[11px] font-bold gap-1.5"
                      >
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Explore Full Directory</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Bottom Home Indicator Bar */}
              <div className="w-28 h-1 bg-slate-600 rounded-full mx-auto" />
            </div>
          </div>

          {/* Right Column: Narrative Storytelling Details (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeStep.id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -16 }}
                transition={{ duration: 0.25 }}
                className="ps-card p-6 sm:p-8 bg-white border border-slate-200"
              >
                {/* Step indicator badge */}
                <div className="flex items-center gap-2 mb-3">
                  <span className="w-8 h-8 rounded-xl bg-[#6545F5] text-white flex items-center justify-center font-black text-xs shadow-xs">
                    {activeStep.stepNumber}
                  </span>
                  <span className="badge-pill bg-purple-50 text-[#6545F5] border border-purple-200 font-bold text-xs">
                    {activeStep.badge}
                  </span>
                </div>

                <h3 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
                  {activeStep.title}
                </h3>
                <p className="text-sm sm:text-base font-bold text-[#6545F5] mt-1">
                  {activeStep.headline}
                </p>

                <p className="text-xs sm:text-sm text-[#475569] mt-3 leading-relaxed">
                  {activeStep.description}
                </p>

                {/* 3 Metric Stats */}
                <div className="grid grid-cols-3 gap-3 my-6">
                  {activeStep.stats.map((stat, i) => (
                    <div key={i} className="p-3 bg-slate-50 border border-slate-200 rounded-xl text-center">
                      <span className="text-[10px] font-bold uppercase text-[#64748B] block truncate">
                        {stat.label}
                      </span>
                      <span
                        className="text-sm sm:text-base font-black mt-0.5 block"
                        style={{ color: stat.color }}
                      >
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Next Step / Action CTA */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100">
                  <div className="flex items-center gap-1.5 text-xs text-[#64748B]">
                    <span>Step {activeStepIndex + 1} of {STORY_STEPS.length}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {activeStepIndex > 0 && (
                      <button
                        onClick={() => setActiveStepIndex(activeStepIndex - 1)}
                        className="btn-secondary h-9 px-3 text-xs font-bold cursor-pointer"
                      >
                        Previous
                      </button>
                    )}

                    {activeStepIndex < STORY_STEPS.length - 1 ? (
                      <button
                        onClick={() => setActiveStepIndex(activeStepIndex + 1)}
                        className="btn-primary h-9 px-4 text-xs font-bold gap-1 cursor-pointer"
                      >
                        <span>Next: {STORY_STEPS[activeStepIndex + 1].badge.split(' ')[0]}</span>
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={onExploreProducts}
                        className="btn-primary h-9 px-4 text-xs font-bold gap-1 cursor-pointer"
                      >
                        <span>Explore Directory</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
