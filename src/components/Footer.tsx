import React from 'react';

interface FooterProps {
  onNavClick: (tab: 'home' | 'explore' | 'dashboard' | 'compare' | 'grocery-list') => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavClick }) => {
  return (
    <footer className="relative mt-20 overflow-hidden border-t border-slate-800 bg-[#0B0F19] text-white">
      {/* Chilled Packaged Beverage on Dark Slate Photography Background */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <img
          src="/assets/backgrounds/footer-food-bg.jpg"
          alt="Chilled packaged beverage on dark ice with condensation droplets"
          className="w-full h-full object-cover object-center opacity-70 filter brightness-90 contrast-120 saturate-115"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#090D16]/85 via-[#0F172A]/70 to-[#111827]/80" />
      </div>

      <div className="relative z-10 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-12 flex flex-col sm:flex-row items-center justify-between gap-6 text-xs font-semibold">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
          <span className="font-black text-white text-sm tracking-tight">PackSach</span>
          <span className="hidden sm:inline text-slate-500">•</span>
          <span className="text-slate-300">Look Beyond the Label.</span>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-4 text-xs text-slate-300">
          <button
            onClick={() => onNavClick('home')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Home
          </button>
          <button
            onClick={() => onNavClick('explore')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Explore
          </button>
          <button
            onClick={() => onNavClick('dashboard')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Visual Shock
          </button>
          <button
            onClick={() => onNavClick('compare')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Compare
          </button>
          <button
            onClick={() => onNavClick('grocery-list')}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Smart Swaps
          </button>
        </div>

        <div className="text-center sm:text-right text-slate-400 text-[11px]">
          <span>Not medical advice. Based on label data only.</span>
        </div>
      </div>
    </footer>
  );
};
