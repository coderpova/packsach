import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Search, Camera, ArrowRight } from 'lucide-react';

interface HeroSectionProps {
  onSearch: (query: string) => void;
  onOpenScanner: () => void;
  onQuickInspect: (productId: string) => void;
  onExploreClick: () => void;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  onSearch,
  onOpenScanner,
  onQuickInspect,
  onExploreClick,
}) => {
  const [searchInput, setSearchInput] = useState('');
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchInput);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setMousePosition({ x, y });
  };

  const handleMouseLeave = () => {
    setMousePosition({ x: 0, y: 0 });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative pt-8 sm:pt-14 pb-16 sm:pb-24 overflow-hidden rounded-3xl"
    >
      {/* Visually Stunning Packaged Food Photography Background: Packaged snacks, chips, biscuits & FMCG staples */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
        <img
          src="/assets/backgrounds/hero-food-bg.jpg"
          alt="Authentic packaged food products, biscuit packets, snacks and confectionery packaging composition"
          className="w-full h-full object-cover object-center opacity-75 filter saturate-110 contrast-105"
        />
        {/* Soft atmospheric gradient overlay ensuring 100% text legibility and contrast while keeping the photograph clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/75 via-[#FAF9F6]/55 to-[#FAF9F6]/80 backdrop-blur-[1px]" />
      </div>
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        {/* Built for Indian Packets Badge (Matching Reference Mockup) */}
        <motion.div
          initial={{ y: -8, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-[#E0DCD3] text-xs font-bold text-[#111827] mb-6 shadow-xs"
        >
          <span>Built for Indian packets</span>
        </motion.div>

        {/* Main Headline (Matching Reference: "Packet ka sach, decoded.") */}
        <motion.h1
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.08, duration: 0.4 }}
          className="text-4xl sm:text-6xl md:text-7xl font-black text-[#111827] tracking-tight leading-[1.08] max-w-4xl mx-auto"
        >
          Packet ka sach,{' '}
          <span className="inline-block px-4 sm:px-6 py-1 rounded-2xl sm:rounded-3xl bg-[#FF5E36] text-white shadow-sm mt-1 sm:mt-0">
            decoded.
          </span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.16, duration: 0.4 }}
          className="text-sm sm:text-base md:text-lg text-[#111827] max-w-2xl mx-auto mt-5 leading-relaxed font-semibold bg-white/60 backdrop-blur-xs px-5 py-2 rounded-2xl shadow-xs"
        >
          Label ki photo lo ya product search karo. Sugar, palm oil aur E-numbers turant samajh aa jayenge.
        </motion.p>

        {/* Primary CTA Buttons (Matching Reference Black Pill) */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.22, duration: 0.4 }}
          className="mt-7 flex flex-wrap items-center justify-center gap-3.5"
        >
          <button
            onClick={onOpenScanner}
            className="btn-dark h-11 px-7 text-sm font-bold gap-2 cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Scan a packet</span>
          </button>

          <button
            onClick={onExploreClick}
            className="btn-secondary h-11 px-6 text-sm font-bold gap-2 cursor-pointer"
          >
            <span>Explore 50+ Staples</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Search Bar with Quick Staples */}
        <motion.div
          initial={{ y: 12, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.26, duration: 0.4 }}
          className="mt-6 max-w-xl mx-auto"
        >
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center bg-white p-1.5 rounded-full border border-[#D5D1C7] shadow-sm focus-within:border-[#111827] focus-within:ring-2 focus-within:ring-slate-200 transition-all gap-2"
          >
            <div className="pl-3.5 text-slate-400">
              <Search className="w-4 h-4 text-slate-500" />
            </div>
            <input
              id="hero-product-search"
              type="text"
              value={searchInput}
              onChange={(e) => {
                setSearchInput(e.target.value);
                onSearch(e.target.value);
              }}
              placeholder="Search Bournvita, Digestive Biscuits, Frooti, Maggi..."
              className="w-full text-xs sm:text-sm font-medium text-[#111827] placeholder-slate-400 focus:outline-none"
            />
            {searchInput && (
              <button
                type="button"
                onClick={() => {
                  setSearchInput('');
                  onSearch('');
                }}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 px-2 cursor-pointer"
              >
                Clear
              </button>
            )}
            <button
              type="submit"
              className="btn-dark h-9 px-4 text-xs font-bold shrink-0 cursor-pointer"
            >
              Search
            </button>
          </form>

          {/* Quick Staple Chips */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-3 text-xs">
            <span className="text-[#64748B] font-semibold">Try:</span>
            <button
              onClick={() => onQuickInspect('bournvita-malt-drink')}
              className="px-2.5 py-1 rounded-full bg-white border border-[#E0DCD3] text-[#111827] hover:bg-[#F4F1EA] font-semibold transition-colors cursor-pointer text-xs"
            >
              Bournvita
            </button>
            <button
              onClick={() => onQuickInspect('nutrichoice-digestive-biscuits')}
              className="px-2.5 py-1 rounded-full bg-white border border-[#E0DCD3] text-[#111827] hover:bg-[#F4F1EA] font-semibold transition-colors cursor-pointer text-xs"
            >
              Digestive Biscuits
            </button>
            <button
              onClick={() => onQuickInspect('frooti-mango-drink')}
              className="px-2.5 py-1 rounded-full bg-white border border-[#E0DCD3] text-[#111827] hover:bg-[#F4F1EA] font-semibold transition-colors cursor-pointer text-xs"
            >
              Frooti Mango
            </button>
          </div>
        </motion.div>

        {/* Centerpiece: The Realistic Smartphone Mockup with Floating Pill Badges */}
        <motion.div
          initial={{ y: 24, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.32, duration: 0.5 }}
          className="mt-12 sm:mt-16 max-w-lg mx-auto relative perspective-1000"
        >
          {/* Floating Pill Badge 1: Top Left "3 tsp Sugar per serving" */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 4.5, ease: 'easeInOut' }}
            className="hidden sm:flex absolute -top-4 -left-12 z-30 bg-white/98 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#EAE7E0] shadow-md flex-col text-left"
          >
            <span className="text-sm font-black text-[#111827]">3 tsp</span>
            <span className="text-[10px] font-semibold text-[#64748B]">Sugar per serving</span>
          </motion.div>

          {/* Floating Pill Badge 2: Bottom Left "3 flagged E-numbers" */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
            className="hidden sm:flex absolute bottom-24 -left-10 z-30 bg-white/98 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#EAE7E0] shadow-md flex-col text-left"
          >
            <span className="text-sm font-black text-[#111827]">3 flagged</span>
            <span className="text-[10px] font-semibold text-[#64748B]">E-numbers</span>
          </motion.div>

          {/* Floating Pill Badge 3: Top Right "Top 3 Palm oil position" */}
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 4.8, ease: 'easeInOut' }}
            className="hidden sm:flex absolute top-6 -right-12 z-30 bg-white/98 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#EAE7E0] shadow-md flex-col text-left"
          >
            <span className="text-sm font-black text-[#111827]">Top 3</span>
            <span className="text-[10px] font-semibold text-[#64748B]">Palm oil position</span>
          </motion.div>

          {/* Floating Pill Badge 4: Bottom Right "Rs 20 Same-price swap" */}
          <motion.div
            animate={{ y: [0, -6, 0] }}
            transition={{ repeat: Infinity, duration: 5.2, ease: 'easeInOut' }}
            className="hidden sm:flex absolute bottom-16 -right-10 z-30 bg-white/98 backdrop-blur-md px-3.5 py-2 rounded-2xl border border-[#EAE7E0] shadow-md flex-col text-left"
          >
            <span className="text-sm font-black text-[#10B981]">Rs 20</span>
            <span className="text-[10px] font-semibold text-[#64748B]">Same-price swap</span>
          </motion.div>

          {/* The Smartphone Frame (Matching Reference Mockup) */}
          <div
            style={{
              transform: `perspective(1000px) rotateX(${mousePosition.y * -6}deg) rotateY(${mousePosition.x * 6}deg)`,
              transition: 'transform 0.15s ease-out',
            }}
            className="w-[280px] sm:w-[310px] mx-auto bg-black rounded-[46px] p-3 shadow-2xl border-2 border-slate-700/60"
          >
            {/* Screen Area */}
            <div className="bg-[#FAF9F6] rounded-[38px] p-3.5 flex flex-col gap-3 overflow-hidden text-left border border-slate-200">
              {/* Dynamic Island / Notch */}
              <div className="w-24 h-4 bg-black rounded-full mx-auto -mt-1 mb-1" />

              {/* Cream Ingredients Box (Matching Reference) */}
              <div className="bg-[#F2EFE9] border border-[#E6E1D6] rounded-2xl p-3 text-[10px] font-mono text-slate-700 leading-relaxed">
                <span className="font-bold block text-[#111827] font-sans text-[11px] mb-1">
                  Ingredients:
                </span>
                Sugar, Palm Oil, Maltodextrin, Invert Syrup, Dextrose, Hydrogenated Vegetable Oil, E621, E330, E322 ...
              </div>

              {/* Scanned Result Card (Matching Reference) */}
              <div className="bg-white border border-[#EAE7E0] rounded-2xl p-3.5 shadow-xs">
                <span className="text-[9px] font-bold uppercase text-[#64748B] block">Scanned</span>
                <h4 className="text-xs font-black text-[#111827] mt-0.5 leading-snug">
                  Chocolate Malt Drink
                </h4>

                {/* Score & Sugar row */}
                <div className="grid grid-cols-2 gap-2 my-2.5">
                  <div className="bg-[#FFF1EE] rounded-xl p-2 text-center border border-[#FFE1DA]">
                    <span className="text-sm font-black text-[#FF5E36] block">3 tsp</span>
                    <span className="text-[9px] font-bold text-[#64748B]">Sugar</span>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-2 text-center border border-slate-200">
                    <span className="text-sm font-black text-[#111827] block">3/10</span>
                    <span className="text-[9px] font-bold text-[#64748B]">Score</span>
                  </div>
                </div>

                {/* See Swap Button */}
                <button
                  onClick={() => onQuickInspect('bournvita-malt-drink')}
                  className="w-full btn-dark h-8 text-[11px] font-bold rounded-full cursor-pointer"
                >
                  See swap
                </button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};
