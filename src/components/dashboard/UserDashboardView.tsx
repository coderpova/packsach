import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Camera,
  ShoppingBag,
  Clock,
  Trash2,
  ArrowRight,
  AlertTriangle,
  Flame,
  Activity,
  Sparkles,
  ChevronRight,
  ShieldCheck,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import type { Product } from '../../types/product';
import { DIETARY_PREFERENCES, ALLERGY_OPTIONS } from '../../types/auth';

interface UserDashboardViewProps {
  onSelectProduct: (product: Product) => void;
  onOpenScanner: () => void;
  onNavigateTab: (tab: 'explore' | 'profile' | 'grocery-list' | 'dashboard' | 'compare') => void;
}

export const UserDashboardView: React.FC<UserDashboardViewProps> = ({
  onSelectProduct,
  onOpenScanner,
  onNavigateTab
}) => {
  const {
    user,
    profile,
    userScans,
    deleteScan,
    clearAllScans,
    userSavedSwaps,
    removeUserSwap,
    checkProductAllergies
  } = useAuth();

  const [searchFilter, setSearchFilter] = useState('');
  const [selectedCategoryFilter, setSelectedCategoryFilter] = useState('all');
  const [isDeletingId, setIsDeletingId] = useState<string | null>(null);

  // Compute summary stats
  const totalScans = userScans.length;
  const totalSwaps = userSavedSwaps.length;
  const activeDietsCount = profile?.dietaryPreferences.length || 0;
  const activeAllergiesCount = profile?.allergies.length || 0;

  const averageHealthScore =
    totalScans > 0
      ? (
          userScans.reduce((acc, curr) => acc + (curr.healthScore || 0), 0) / totalScans
        ).toFixed(1)
      : '—';

  // Conflict detection for recently scanned products
  const scansWithConflicts = userScans.filter((scan) => {
    const analysis = checkProductAllergies(scan.productData);
    return analysis.hasConflict;
  });

  // Filtered scans
  const filteredScans = userScans.filter((scan) => {
    const matchesQuery =
      searchFilter === '' ||
      scan.productName.toLowerCase().includes(searchFilter.toLowerCase()) ||
      scan.brand.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesCategory =
      selectedCategoryFilter === 'all' ||
      scan.category.toLowerCase() === selectedCategoryFilter.toLowerCase();

    return matchesQuery && matchesCategory;
  });

  const categories = Array.from(new Set(userScans.map((s) => s.category))).filter(Boolean);

  const handleDeleteScan = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    setIsDeletingId(id);
    try {
      await deleteScan(id);
    } finally {
      setIsDeletingId(null);
    }
  };

  return (
    <div className="space-y-8 pb-12">
      {/* 1. Welcome & High-Level User Header */}
      <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-bl from-[#FFF1EE] via-[#FAF9F6] to-transparent rounded-full -mr-32 -mt-32 pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-[#111827] to-[#1E293B] text-white flex items-center justify-center text-xl font-black shadow-md border-2 border-white shrink-0">
              {profile?.avatarUrl ? (
                <img
                  src={profile.avatarUrl}
                  alt={user?.name}
                  className="w-full h-full rounded-2xl object-cover"
                />
              ) : (
                <span>{(user?.name || 'User').charAt(0).toUpperCase()}</span>
              )}
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
                  Welcome back, {user?.name || 'PackSach Member'}
                </h1>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FFF1EE] text-[#FF5E36] border border-[#FFE1DA]">
                  Personal Hub
                </span>
              </div>
              <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                {user?.email} • Track your scans, health alerts, and verified food swaps.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={onOpenScanner}
              className="btn-dark h-11 px-5 text-xs font-bold gap-2 cursor-pointer shadow-sm hover:scale-[1.02] transition-transform"
            >
              <Camera className="w-4 h-4 text-[#FF5E36]" />
              <span>Scan Food Packet</span>
            </button>

            <button
              onClick={() => onNavigateTab('profile')}
              className="btn-secondary h-11 px-4 text-xs font-bold gap-2 cursor-pointer"
            >
              <SlidersHorizontal className="w-4 h-4 text-[#64748B]" />
              <span>Diet & Allergy Settings</span>
            </button>
          </div>
        </div>
      </div>

      {/* 2. Key Metrics Bar */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1 */}
        <div className="bg-white rounded-3xl border border-[#EAE7E0] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Total Scans</span>
            <div className="w-8 h-8 rounded-xl bg-[#F4F1EA] flex items-center justify-center text-[#111827]">
              <Clock className="w-4 h-4 text-[#FF5E36]" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#111827]">{totalScans}</div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">
              Packets analyzed
            </div>
          </div>
        </div>

        {/* Metric 2 */}
        <div className="bg-white rounded-3xl border border-[#EAE7E0] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Saved Swaps</span>
            <div className="w-8 h-8 rounded-xl bg-[#ECFDF5] flex items-center justify-center text-[#10B981]">
              <ShoppingBag className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#111827]">{totalSwaps}</div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">
              Better alternatives saved
            </div>
          </div>
        </div>

        {/* Metric 3 */}
        <div className="bg-white rounded-3xl border border-[#EAE7E0] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Avg Health Score</span>
            <div className="w-8 h-8 rounded-xl bg-[#EFF6FF] flex items-center justify-center text-[#2563EB]">
              <Activity className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#111827]">
              {averageHealthScore}{' '}
              {averageHealthScore !== '—' && (
                <span className="text-sm font-bold text-[#64748B]">/ 10</span>
              )}
            </div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">
              Across your scanned items
            </div>
          </div>
        </div>

        {/* Metric 4 */}
        <div className="bg-white rounded-3xl border border-[#EAE7E0] p-5 shadow-[0_4px_24px_rgba(0,0,0,0.02)] flex flex-col justify-between">
          <div className="flex items-center justify-between text-[#64748B] mb-2">
            <span className="text-xs font-bold uppercase tracking-wider">Active Filters</span>
            <div className="w-8 h-8 rounded-xl bg-[#FEF2F2] flex items-center justify-center text-[#DC2626]">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-3xl font-black text-[#111827]">
              {activeDietsCount + activeAllergiesCount}
            </div>
            <div className="text-[11px] font-semibold text-[#64748B] mt-0.5">
              {activeAllergiesCount} allergies, {activeDietsCount} diets
            </div>
          </div>
        </div>
      </div>

      {/* 3. Personalized Health & Allergen Watchlist Alert */}
      {(activeAllergiesCount > 0 || activeDietsCount > 0) && (
        <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-[#FFF1EE] border border-[#FFE1DA] flex items-center justify-center text-[#FF5E36]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-[#111827]">
                  Your Personalized Health Watchlist
                </h3>
                <p className="text-xs text-[#64748B]">
                  Every food packet you inspect is automatically checked against these rules.
                </p>
              </div>
            </div>

            <button
              onClick={() => onNavigateTab('profile')}
              className="text-xs font-bold text-[#FF5E36] hover:text-[#E04B26] flex items-center gap-1 self-start sm:self-auto cursor-pointer"
            >
              <span>Manage Preferences</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex flex-wrap gap-2">
            {profile?.allergies.map((allergyId) => {
              const opt = ALLERGY_OPTIONS.find((o) => o.id === allergyId);
              return (
                <span
                  key={allergyId}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA] flex items-center gap-1.5"
                >
                  <AlertTriangle className="w-3 h-3 text-[#DC2626]" />
                  <span>Allergy: {opt?.label || allergyId}</span>
                </span>
              );
            })}

            {profile?.dietaryPreferences.map((dietId) => {
              const opt = DIETARY_PREFERENCES.find((o) => o.id === dietId);
              return (
                <span
                  key={dietId}
                  className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${
                    opt?.badgeColor || 'bg-slate-50 text-slate-700 border-slate-200'
                  }`}
                >
                  <Sparkles className="w-3 h-3" />
                  <span>Diet: {opt?.label || dietId}</span>
                </span>
              );
            })}
          </div>

          {/* Triggered conflicts alert */}
          {scansWithConflicts.length > 0 && (
            <div className="mt-4 p-4 rounded-2xl bg-[#FFF5F5] border border-[#FED7D7] flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-[#E53E3E] shrink-0 mt-0.5" />
              <div className="flex-1 text-xs">
                <span className="font-bold text-[#9B2C2C]">
                  Safety Alert:{' '}
                </span>
                <span className="text-[#C53030]">
                  {scansWithConflicts.length}{' '}
                  {scansWithConflicts.length === 1 ? 'packet' : 'packets'} in your scan history contain
                  ingredients conflicting with your configured allergen or dietary restrictions!
                </span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 4. Scanned Products History & Management */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
              Scanned Food Packets ({userScans.length})
            </h2>
            <p className="text-xs sm:text-sm text-[#64748B] mt-0.5">
              Securely stored in your personal account history.
            </p>
          </div>

          {userScans.length > 0 && (
            <div className="flex items-center gap-2 self-start sm:self-auto">
              <button
                onClick={clearAllScans}
                className="btn-secondary h-9 px-3.5 text-xs font-bold text-[#DC2626] hover:bg-rose-50 gap-1.5 cursor-pointer"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All Scans</span>
              </button>
            </div>
          )}
        </div>

        {/* Filter & Search Bar */}
        {userScans.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Search className="w-4 h-4 text-[#94A3B8] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by product or brand name..."
                value={searchFilter}
                onChange={(e) => setSearchFilter(e.target.value)}
                className="w-full h-10 pl-10 pr-4 bg-white border border-[#E0DCD3] rounded-2xl text-xs font-semibold text-[#111827] focus:outline-none focus:border-[#FF5E36] transition-colors"
              />
            </div>

            {categories.length > 1 && (
              <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto py-1">
                <button
                  onClick={() => setSelectedCategoryFilter('all')}
                  className={`h-9 px-3.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 ${
                    selectedCategoryFilter === 'all'
                      ? 'bg-[#111827] text-white'
                      : 'bg-white border border-[#E0DCD3] text-[#64748B] hover:text-[#111827]'
                  }`}
                >
                  All
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategoryFilter(cat)}
                    className={`h-9 px-3.5 rounded-full text-xs font-bold transition-colors cursor-pointer shrink-0 capitalize ${
                      selectedCategoryFilter === cat
                        ? 'bg-[#111827] text-white'
                        : 'bg-white border border-[#E0DCD3] text-[#64748B] hover:text-[#111827]'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Scan List Cards */}
        {userScans.length === 0 ? (
          <div className="rounded-3xl border border-[#EAE7E0] bg-white p-12 text-center max-w-md mx-auto my-6 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
            <div className="w-14 h-14 rounded-2xl bg-[#FFF1EE] border border-[#FFE1DA] flex items-center justify-center mx-auto mb-3 text-[#FF5E36]">
              <Camera className="w-7 h-7" />
            </div>
            <h3 className="text-base font-bold text-[#111827]">
              No food packets scanned yet
            </h3>
            <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
              Scan front packaging or nutrition labels of biscuits, noodles, chips, or juices to instantly uncover hidden sugars and palm oil.
            </p>
            <div className="mt-5 flex items-center justify-center gap-2.5">
              <button
                onClick={onOpenScanner}
                className="btn-dark h-10 px-5 text-xs font-bold gap-2 cursor-pointer"
              >
                <Camera className="w-4 h-4 text-[#FF5E36]" />
                <span>Scan Food Packet</span>
              </button>
              <button
                onClick={() => onNavigateTab('explore')}
                className="btn-secondary h-10 px-4 text-xs font-bold cursor-pointer"
              >
                Browse Directory
              </button>
            </div>
          </div>
        ) : filteredScans.length === 0 ? (
          <div className="rounded-3xl border border-[#EAE7E0] bg-white p-8 text-center text-xs text-[#64748B]">
            No scanned packets match "{searchFilter}".
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            <AnimatePresence>
              {filteredScans.map((scan) => {
                const score = scan.healthScore || 0;
                const isHighConcern = score < 4.0;
                const isModerate = score >= 4.0 && score < 7.0;

                const scoreBadgeBg = isHighConcern
                  ? 'bg-[#FF4D80]/15 text-[#D11A4F]'
                  : isModerate
                  ? 'bg-[#FFD84D]/30 text-[#8F6400]'
                  : 'bg-[#10B981]/15 text-[#0A6B4A]';

                const conflictAnalysis = checkProductAllergies(scan.productData);

                return (
                  <motion.div
                    key={scan.id}
                    layout
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    onClick={() => {
                      onSelectProduct(scan.productData);
                      onNavigateTab('dashboard');
                    }}
                    className="bg-white rounded-3xl border border-[#EAE7E0] hover:border-[#D1CABE] p-5 flex flex-col justify-between relative group cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)] transition-all"
                  >
                    <div>
                      {/* Header with Brand and Score */}
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">
                          {scan.brand}
                        </span>
                        <span
                          className={`text-xs font-black px-2.5 py-0.5 rounded-full ${scoreBadgeBg}`}
                        >
                          {score.toFixed(1)} / 10
                        </span>
                      </div>

                      {/* Conflict Alert Tag if detected */}
                      {conflictAnalysis.hasConflict && (
                        <div className="mb-3 px-2.5 py-1 rounded-xl bg-[#FFF5F5] border border-[#FED7D7] flex items-center gap-1.5 text-[11px] font-bold text-[#E53E3E]">
                          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">
                            Contains {conflictAnalysis.conflictingAllergies.join(', ') || 'diet conflict'}
                          </span>
                        </div>
                      )}

                      {/* Product Thumbnail & Title */}
                      <div className="flex items-center gap-3.5 mb-3.5">
                        <img
                          src={scan.imageUrl || scan.productData.image}
                          alt={scan.productName}
                          className="w-16 h-16 rounded-2xl object-cover border border-[#EAE7E0] bg-[#FAF9F6] shrink-0"
                        />
                        <div className="overflow-hidden">
                          <h3 className="text-sm font-extrabold text-[#111827] leading-snug group-hover:text-[#FF5E36] transition-colors truncate">
                            {scan.productName}
                          </h3>
                          <span className="text-xs font-semibold text-[#64748B]">
                            {scan.category} • Scanned{' '}
                            {new Date(scan.scannedAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {/* Nutritional Highlights */}
                      <div className="flex flex-wrap gap-1.5 text-[11px] mb-3">
                        <span className="px-2.5 py-1 rounded-full font-bold bg-[#FAF9F6] text-[#D11A4F] border border-[#F3D7DF] flex items-center gap-1">
                          <Flame className="w-3 h-3 text-[#FF4D80]" />
                          {scan.sugarTeaspoons} tsp sugar
                        </span>
                        <span className="px-2.5 py-1 rounded-full font-bold bg-[#FAF9F6] text-[#64748B] border border-[#E2E8F0]">
                          {scan.sodiumMg} mg sodium
                        </span>
                        {scan.productData.palmOil?.present && (
                          <span className="px-2.5 py-1 rounded-full font-bold bg-[#FAF9F6] text-[#8F6400] border border-[#F5E6B5]">
                            Palm Oil #{scan.productData.palmOil.rank}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Bottom Action Footer */}
                    <div className="pt-3.5 border-t border-[#F0ECE1] flex items-center justify-between">
                      <button
                        onClick={(e) => handleDeleteScan(e, scan.id)}
                        disabled={isDeletingId === scan.id}
                        className="text-xs font-semibold text-[#94A3B8] hover:text-[#DC2626] transition-colors flex items-center gap-1 p-1"
                        title="Delete this scan record"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectProduct(scan.productData);
                          onNavigateTab('dashboard');
                        }}
                        className="btn-secondary h-8 px-3 text-xs font-bold gap-1 cursor-pointer"
                      >
                        <span>Re-Inspect</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 5. Saved Smart Swaps Section */}
      {userSavedSwaps.length > 0 && (
        <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)] space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ECFDF5] border border-[#A7F3D0] text-xs font-bold text-[#065F46] mb-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#10B981]" />
                <span>Better Food Swaps</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                Saved Smart Alternatives ({userSavedSwaps.length})
              </h2>
              <p className="text-xs text-[#64748B]">
                Healthy swaps saved to your grocery basket.
              </p>
            </div>

            <button
              onClick={() => onNavigateTab('grocery-list')}
              className="btn-secondary h-9 px-4 text-xs font-bold gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <span>View Full Grocery List</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {userSavedSwaps.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-[#EAE7E0] bg-[#FAF9F6] flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-black uppercase text-[#10B981] bg-[#ECFDF5] px-2 py-0.5 rounded-full border border-[#A7F3D0]">
                      Smart Swap
                    </span>
                    <button
                      onClick={() => removeUserSwap(item.id)}
                      className="text-xs text-[#94A3B8] hover:text-[#DC2626] transition-colors"
                      title="Remove from saved swaps"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <h4 className="text-sm font-extrabold text-[#111827]">
                    {item.swap.name}
                  </h4>
                  <p className="text-xs text-[#64748B]">
                    by {item.swap.brand} • ₹{item.swap.price}
                  </p>

                  <div className="mt-3 p-2.5 rounded-xl bg-white border border-[#EAE5DA] text-xs space-y-1">
                    <div className="flex items-center justify-between text-[#64748B]">
                      <span>Replaces:</span>
                      <span className="font-bold text-[#111827] truncate max-w-[130px]">
                        {item.originalProduct.name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#065F46] font-semibold">
                      <span>Sugar Saved:</span>
                      <span>
                        -{(item.originalProduct.sugarTeaspoons - item.swap.sugarTeaspoons).toFixed(1)} tsp
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t border-[#EAE5DA] flex items-center justify-between text-[11px] text-[#64748B]">
                  <span>Added {item.addedAt}</span>
                  <button
                    onClick={() => onNavigateTab('explore')}
                    className="font-bold text-[#FF5E36] hover:text-[#E04B26] flex items-center gap-1 cursor-pointer"
                  >
                    <span>Browse</span>
                    <ArrowRight className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
