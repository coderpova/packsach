import React, { useState } from 'react';
import {
  Camera,
  Menu,
  X,
  ShoppingBag,
  Clock,
  LogIn,
  LogOut,
  SlidersHorizontal,
  LayoutDashboard,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export type NavTab =
  | 'home'
  | 'explore'
  | 'dashboard'
  | 'compare'
  | 'grocery-list'
  | 'history'
  | 'user-dashboard'
  | 'profile';

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
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const { user, profile, isAuthenticated, openAuthModal, logout } = useAuth();

  const handleNavClick = (tab: NavTab, sectionId?: string) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);
    setUserDropdownOpen(false);
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

          {isAuthenticated && (
            <button
              onClick={() => handleNavClick('user-dashboard')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-full transition-colors cursor-pointer ${
                activeTab === 'user-dashboard'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#111827] hover:bg-slate-50'
              }`}
            >
              Dashboard
            </button>
          )}

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

        {/* Right Navigation & Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Guest Sign In vs Authenticated User Pill */}
          {!isAuthenticated ? (
            <button
              onClick={() => openAuthModal('login')}
              className="btn-secondary h-10 px-3.5 text-xs font-bold gap-1.5 cursor-pointer shadow-2xs"
            >
              <LogIn className="w-3.5 h-3.5 text-[#FF5E36]" />
              <span className="hidden sm:inline">Sign In</span>
            </button>
          ) : (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 bg-white hover:bg-[#F4F1EA] border border-[#E0DCD3] rounded-full transition-all cursor-pointer shadow-2xs"
                aria-expanded={userDropdownOpen}
                aria-label="User account menu"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-br from-[#111827] to-[#1E293B] text-white flex items-center justify-center text-xs font-black overflow-hidden shrink-0">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={user?.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <span>{(user?.name || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <span className="text-xs font-bold text-[#111827] max-w-[90px] truncate hidden sm:inline">
                  {user?.name?.split(' ')[0] || 'Account'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-[#64748B]" />
              </button>

              {/* Dropdown Menu */}
              {userDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-56 bg-white border border-[#EAE7E0] rounded-2xl shadow-xl p-2 z-50 text-left">
                    <div className="px-3 py-2 border-b border-[#F0ECE1] mb-1">
                      <p className="text-xs font-extrabold text-[#111827] truncate">
                        {user?.name}
                      </p>
                      <p className="text-[11px] text-[#64748B] truncate">{user?.email}</p>
                    </div>

                    <button
                      onClick={() => handleNavClick('user-dashboard')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#475569] hover:text-[#111827] hover:bg-[#F4F1EA] rounded-xl transition-colors cursor-pointer"
                    >
                      <LayoutDashboard className="w-4 h-4 text-[#FF5E36]" />
                      <span>My Dashboard</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('profile')}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#475569] hover:text-[#111827] hover:bg-[#F4F1EA] rounded-xl transition-colors cursor-pointer"
                    >
                      <SlidersHorizontal className="w-4 h-4 text-[#10B981]" />
                      <span>Diet & Allergies</span>
                    </button>

                    <button
                      onClick={() => handleNavClick('grocery-list')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-[#475569] hover:text-[#111827] hover:bg-[#F4F1EA] rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <ShoppingBag className="w-4 h-4 text-[#6366F1]" />
                        <span>Saved Swaps</span>
                      </div>
                      {savedSwapsCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-black bg-[#FF5E36] text-white">
                          {savedSwapsCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => handleNavClick('history')}
                      className="w-full flex items-center justify-between px-3 py-2 text-xs font-bold text-[#475569] hover:text-[#111827] hover:bg-[#F4F1EA] rounded-xl transition-colors cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <Clock className="w-4 h-4 text-[#F59E0B]" />
                        <span>Inspection History</span>
                      </div>
                      {historyCount > 0 && (
                        <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#F4F1EA] text-[#64748B]">
                          {historyCount}
                        </span>
                      )}
                    </button>

                    <div className="border-t border-[#F0ECE1] my-1" />

                    <button
                      onClick={async () => {
                        setUserDropdownOpen(false);
                        await logout();
                        setActiveTab('home');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-bold text-[#DC2626] hover:bg-rose-50 rounded-xl transition-colors cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* Primary Action Button (Black Pill matching Reference "Try PackSach") */}
          <button
            onClick={onOpenScanner}
            className="btn-dark h-10 px-5 text-xs font-bold gap-2 cursor-pointer shadow-sm"
          >
            <Camera className="w-4 h-4 text-[#FF5E36]" />
            <span className="hidden sm:inline">Try PackSach</span>
            <span className="sm:hidden">Scan</span>
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
          {isAuthenticated ? (
            <div className="p-3 mb-2 rounded-2xl bg-white border border-[#EAE5DA] flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-hidden">
                <div className="w-9 h-9 rounded-xl bg-[#111827] text-white flex items-center justify-center text-sm font-black shrink-0">
                  {profile?.avatarUrl ? (
                    <img
                      src={profile.avatarUrl}
                      alt={user?.name}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  ) : (
                    <span>{(user?.name || 'U').charAt(0).toUpperCase()}</span>
                  )}
                </div>
                <div className="truncate">
                  <div className="text-xs font-extrabold text-[#111827] truncate">
                    {user?.name}
                  </div>
                  <div className="text-[11px] text-[#64748B] truncate">{user?.email}</div>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                openAuthModal('login');
              }}
              className="w-full mb-3 btn-coral h-10 px-4 text-xs font-bold gap-2 cursor-pointer shadow-2xs justify-center"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In / Create Account</span>
            </button>
          )}

          {isAuthenticated && (
            <>
              <button
                onClick={() => handleNavClick('user-dashboard')}
                className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-2xl flex items-center gap-2 ${
                  activeTab === 'user-dashboard'
                    ? 'bg-[#111827] text-white'
                    : 'text-[#475569] hover:bg-white'
                }`}
              >
                <LayoutDashboard className="w-4 h-4 text-[#FF5E36]" />
                <span>My Personal Dashboard</span>
              </button>

              <button
                onClick={() => handleNavClick('profile')}
                className={`w-full text-left px-4 py-2.5 text-sm font-bold rounded-2xl flex items-center gap-2 ${
                  activeTab === 'profile'
                    ? 'bg-[#111827] text-white'
                    : 'text-[#475569] hover:bg-white'
                }`}
              >
                <SlidersHorizontal className="w-4 h-4 text-[#10B981]" />
                <span>Diet & Allergy Safeguards</span>
              </button>
            </>
          )}

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

          {isAuthenticated && (
            <div className="pt-2 border-t border-[#EAE7E0]">
              <button
                onClick={async () => {
                  setMobileMenuOpen(false);
                  await logout();
                  setActiveTab('home');
                }}
                className="w-full text-left px-4 py-2.5 text-sm font-bold text-[#DC2626] hover:bg-rose-50 rounded-2xl flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
