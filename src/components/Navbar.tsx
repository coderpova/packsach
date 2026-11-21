import React, { useState } from 'react';
import { Camera, Menu, X, ShoppingBag, Clock } from 'lucide-react';

export type NavTab = 'home' | 'explore' | 'dashboard' | 'compare' | 'grocery-list' | 'history';

interface NavbarProps {
  activeTab: NavTab;
  setActiveTab: (tab: NavTab) => void;
  onOpenScanner: () => void;
  savedSwapsCount: number;
  historyCount?: number;
  onScrollToSection?: (sectionId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  onOpenScanner,
  savedSwapsCount,
  historyCount = 0,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (tab: NavTab, sectionId?: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    if (sectionId && tab === 'home') {
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) {
          el.scrollIntoView({ behavior: 'smooth' });
        }
      }, 50);
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-[#FAF9F6]/90 backdrop-blur-md border-b border-[#EAE7E0]">
      <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 h-18 flex items-center justify-between">
        {/* Brand Logo & Tagline (Left) */}
        <div
          onClick={() => handleNavClick('home')}
          className="flex items-center gap-3 cursor-pointer select-none group shrink-0"
        >
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-black text-[#111827] tracking-tight">
                PackSach
              </span>
            </div>
            <span className="hidden sm:block text-[11px] font-semibold text-[#64748B]">
              Look Beyond the Label.
            </span>
          </div>
        </div>

        {/* Floating Pill Center Navigation Bar (Matching Reference Mockup) */}
        <nav className="hidden lg:flex items-center bg-white/95 border border-[#E0DCD3] rounded-full p-1 shadow-xs gap-0.5">
          <button
            onClick={() => handleNavClick('home', 'how-it-works')}
            className="px-3.5 py-1.5 text-xs font-bold text-[#475569] hover:text-[#111827] rounded-full transition-colors cursor-pointer hover:bg-slate-50"
          >
            How it works
          </button>

          <button
            onClick={() => handleNavClick('home', 'features')}
            className="px-3.5 py-1.5 text-xs font-bold text-[#475569] hover:text-[#111827] rounded-full transition-colors cursor-pointer hover:bg-slate-50"
          >
            Features
          </button>

          <button
            onClick={() => handleNavClick('explore')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${
              activeTab === 'explore'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#111827] hover:bg-slate-50'
            }`}
          >
            Explore
          </button>

          <button
            onClick={() => handleNavClick('dashboard')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${
              activeTab === 'dashboard'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#111827] hover:bg-slate-50'
            }`}
          >
            Visual Shock
          </button>

          <button
            onClick={() => handleNavClick('compare')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${
              activeTab === 'compare'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#111827] hover:bg-slate-50'
            }`}
          >
            Compare
          </button>

          <button
            onClick={() => handleNavClick('home', 'pricing')}
            className="px-3 py-1.5 text-xs font-bold text-[#475569] hover:text-[#111827] rounded-full transition-colors cursor-pointer hover:bg-slate-50"
          >
            Pricing
          </button>

          <button
            onClick={() => handleNavClick('home', 'faq')}
            className="px-3 py-1.5 text-xs font-bold text-[#475569] hover:text-[#111827] rounded-full transition-colors cursor-pointer hover:bg-slate-50"
          >
            FAQ
          </button>

          <button
            onClick={() => handleNavClick('history')}
            className={`px-3 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'history'
                ? 'bg-[#111827] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#111827] hover:bg-slate-50'
            }`}
            title="Recently Inspected Packets"
          >
            <Clock className="w-3.5 h-3.5" />
            <span>History</span>
          </button>

          <button
            onClick={() => handleNavClick('grocery-list')}
            className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'grocery-list'
                ? 'bg-[#10B981] text-white shadow-xs'
                : 'text-[#475569] hover:text-[#111827] hover:bg-slate-50'
            }`}
          >
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Swaps</span>
            {savedSwapsCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#FF5E36] text-white">
                {savedSwapsCount}
              </span>
            )}
          </button>
        </nav>

        {/* Primary Action Button (Black Pill matching Reference "Try PackSach") */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={onOpenScanner}
            className="btn-dark h-10 px-5 text-xs font-bold gap-2 cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4" />
            <span>Try PackSach</span>
          </button>

          {/* Mobile Menu Hamburger Toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-[#475569] hover:text-[#111827] rounded-full hover:bg-[#F4F1EA] transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-[#EAE7E0] bg-[#FAF9F6] px-4 pt-3 pb-6 space-y-1 shadow-xl">
          <button
            onClick={() => handleNavClick('home', 'how-it-works')}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#475569] hover:bg-white rounded-2xl"
          >
            How it works
          </button>
          <button
            onClick={() => handleNavClick('home', 'features')}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#475569] hover:bg-white rounded-2xl"
          >
            Features
          </button>
          <button
            onClick={() => handleNavClick('explore')}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#475569] hover:bg-white rounded-2xl"
          >
            Explore Products
          </button>
          <button
            onClick={() => handleNavClick('dashboard')}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#475569] hover:bg-white rounded-2xl"
          >
            Visual Shock Dashboard
          </button>
          <button
            onClick={() => handleNavClick('compare')}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#475569] hover:bg-white rounded-2xl"
          >
            Side-by-Side Compare
          </button>
          <button
            onClick={() => handleNavClick('history')}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#475569] hover:bg-white rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4" />
              <span>Inspection History</span>
            </div>
            {historyCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-[#F4F1EA] text-[#111827]">
                {historyCount}
              </span>
            )}
          </button>
          <button
            onClick={() => handleNavClick('home', 'pricing')}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#475569] hover:bg-white rounded-2xl"
          >
            Pricing
          </button>
          <button
            onClick={() => handleNavClick('home', 'faq')}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#475569] hover:bg-white rounded-2xl"
          >
            FAQ
          </button>
          <button
            onClick={() => handleNavClick('grocery-list')}
            className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#10B981] hover:bg-white rounded-2xl flex items-center justify-between"
          >
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-4 h-4" />
              <span>Smart Swaps List</span>
            </div>
            {savedSwapsCount > 0 && (
              <span className="px-2 py-0.5 rounded-full text-xs font-black bg-[#FF5E36] text-white">
                {savedSwapsCount}
              </span>
            )}
          </button>
        </div>
      )}
    </header>
  );
};
