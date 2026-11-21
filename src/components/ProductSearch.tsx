import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, Globe, Flame, Search, Sparkles, X } from 'lucide-react';
import type { Product } from '../types/product';
import { fetchFromOpenFoodFacts } from '../services/openFoodFacts';

interface ProductSearchProps {
  products: Product[];
  onSelectProduct: (product: Product) => void;
  onCompareProduct: (product: Product) => void;
  searchQuery: string;
  onSearchQueryChange?: (query: string) => void;
  selectedCategory?: string;
  onSelectCategory?: (category: string) => void;
}

const CATEGORIES = [
  { id: 'all', label: 'All Items' },
  { id: 'biscuits', label: 'Biscuits & Cookies' },
  { id: 'drinks', label: 'Beverages & Drinks' },
  { id: 'noodles', label: 'Instant Noodles' },
  { id: 'snacks', label: 'Chips & Snacks' },
  { id: 'chocolates', label: 'Chocolates & Spreads' },
];

export const ProductSearch: React.FC<ProductSearchProps> = ({
  products,
  onSelectProduct,
  onCompareProduct,
  searchQuery,
  onSearchQueryChange,
  selectedCategory = 'all',
  onSelectCategory,
}) => {
  const [isSearchingOff, setIsSearchingOff] = useState(false);
  const [offProduct, setOffProduct] = useState<Product | null>(null);
  const [offError, setOffError] = useState<string | null>(null);

  const handleSearchOpenFoodFacts = async () => {
    if (!searchQuery.trim()) return;
    setIsSearchingOff(true);
    setOffError(null);
    try {
      const res = await fetchFromOpenFoodFacts(searchQuery);
      if (res) {
        setOffProduct(res);
      } else {
        setOffError(`No matching food items indexed in Open Food Facts for "${searchQuery}".`);
      }
    } catch {
      setOffError('Failed to query Open Food Facts API.');
    } finally {
      setIsSearchingOff(false);
    }
  };

  return (
    <div className="relative rounded-3xl p-4 sm:p-7 overflow-hidden border border-[#EAE7E0]/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      {/* Packaged Food & Indian FMCG Snacks Packaging Photography */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
        <img
          src="/assets/backgrounds/explore-food-bg.jpg"
          alt="Authentic packaged snacks, biscuits, and chips packaging background"
          className="w-full h-full object-cover object-center opacity-70 filter saturate-110 contrast-105"
        />
        {/* Balanced atmospheric overlay keeping the rich photography clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/80 via-[#FAF9F6]/55 to-[#FAF9F6]/75 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 space-y-6">
      {/* Header and Live Search CTA */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] border border-[#EAE5DA] text-xs font-bold text-[#111827] mb-2">
            <Sparkles className="w-3.5 h-3.5 text-[#FF5E36]" />
            <span>Verified Packaged Foods Database</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Explore Packaged Foods
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            Independent Indian packaged food analyses, hidden sugars, palm oil disclosures, and same-price smart swaps.
          </p>
        </div>

        {searchQuery && (
          <button
            onClick={handleSearchOpenFoodFacts}
            disabled={isSearchingOff}
            className="btn-secondary h-10 text-xs gap-1.5 shrink-0 self-start sm:self-auto cursor-pointer"
          >
            <Globe className="w-3.5 h-3.5 text-[#6545F5]" />
            <span>{isSearchingOff ? 'Searching Open Food Facts...' : `Search "${searchQuery}" on Open Food Facts`}</span>
          </button>
        )}
      </div>

      {/* Explore Page Search Bar */}
      {onSearchQueryChange && (
        <div className="max-w-2xl">
          <div className="flex items-center bg-white p-1.5 rounded-full border border-[#D5D1C7] shadow-sm focus-within:border-[#111827] focus-within:ring-2 focus-within:ring-slate-200 transition-all gap-2">
            <div className="pl-3.5 text-slate-400">
              <Search className="w-4 h-4 text-slate-500" />
            </div>
            <input
              id="explore-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchQueryChange(e.target.value)}
              placeholder="Search by brand, food name, or ingredient (Bournvita, Maida, Palm Oil)..."
              className="w-full text-xs sm:text-sm font-medium text-[#111827] placeholder-slate-400 focus:outline-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchQueryChange('')}
                className="text-xs font-semibold text-slate-400 hover:text-slate-700 p-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Category Pills Filter */}
      {onSelectCategory && (
        <div className="flex items-center justify-between gap-3 overflow-x-auto pb-1 scrollbar-none">
          <div className="flex items-center gap-2">
            {CATEGORIES.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => onSelectCategory(cat.id)}
                  className={`px-4 py-2 rounded-full text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-[#111827] text-white shadow-xs'
                      : 'bg-white text-[#475569] border border-[#EAE7E0] hover:bg-[#F4F1EA]'
                  }`}
                >
                  {cat.label}
                </button>
              );
            })}
          </div>

          <span className="text-xs font-bold text-[#64748B] whitespace-nowrap hidden sm:inline">
            {products.length} {products.length === 1 ? 'item' : 'items'} found
          </span>
        </div>
      )}

      {/* Open Food Facts Live Result Card (Theme C Cream Box) */}
      {offProduct && (
        <div className="p-5 rounded-3xl border border-[#EAE5DA] bg-[#F4F1EA] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-4">
            <img
              src={offProduct.image}
              alt={offProduct.name}
              className="w-16 h-16 rounded-2xl object-cover border border-[#EAE5DA] bg-white shrink-0"
            />
            <div>
              <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#6545F5] text-white text-[10px] font-bold uppercase tracking-wider mb-1">
                Live Open Food Facts API Result
              </span>
              <h4 className="text-base font-extrabold text-[#111827]">{offProduct.name}</h4>
              <p className="text-xs text-[#475569] mt-0.5">
                Score: <strong className="text-[#111827]">{offProduct.healthScore.score} / 10</strong> • {offProduct.nutritionPerServe.sugarTeaspoons} tsp sugar • {offProduct.servingSize}
              </p>
            </div>
          </div>
          <button
            onClick={() => onSelectProduct(offProduct)}
            className="btn-coral h-10 px-5 text-xs font-bold shrink-0 cursor-pointer"
          >
            Inspect in Visual Analysis ➔
          </button>
        </div>
      )}

      {offError && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-900 font-medium">
          {offError}
        </div>
      )}

      {/* Products Grid */}
      {products.length === 0 && !offProduct ? (
        <div className="rounded-3xl border border-[#EAE7E0] bg-white p-12 text-center max-w-md mx-auto my-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
          <div className="w-12 h-12 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA] flex items-center justify-center mx-auto mb-3 text-[#111827]">
            <Search className="w-5 h-5 text-[#64748B]" />
          </div>
          <h3 className="text-base font-bold text-[#111827]">No matching items found</h3>
          <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
            {searchQuery
              ? `No local matches for "${searchQuery}". You can query the global Open Food Facts database below.`
              : 'Try selecting a different category or search for staple food brands.'}
          </p>
          {searchQuery && (
            <button
              onClick={handleSearchOpenFoodFacts}
              className="mt-5 btn-dark h-10 px-5 text-xs font-bold cursor-pointer"
            >
              Search Open Food Facts API
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {products.map((p) => {
            const score = p.healthScore.score;
            const isHighConcern = score < 4.0;
            const isModerate = score >= 4.0 && score < 7.0;

            const scoreBadgeBg = isHighConcern
              ? 'bg-[#FF4D80]/15 text-[#D11A4F]'
              : isModerate
              ? 'bg-[#FFD84D]/30 text-[#8F6400]'
              : 'bg-[#10B981]/15 text-[#0A6B4A]';

            return (
              <motion.div
                key={p.id}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18 }}
                className="bg-white rounded-3xl border border-[#EAE7E0] hover:border-[#D1CABE] p-5 flex flex-col justify-between relative group cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                onClick={() => onSelectProduct(p)}
              >
                <div>
                  {/* Top Bar */}
                  <div className="flex items-center justify-between mb-3.5">
                    <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">
                      {p.brand}
                    </span>
                    <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${scoreBadgeBg}`}>
                      {score.toFixed(1)} / 10
                    </span>
                  </div>

                  {/* Image & Basic Details */}
                  <div className="flex items-center gap-3.5 mb-3.5">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 rounded-2xl object-cover border border-[#EAE7E0] bg-[#FAF9F6] shrink-0"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60';
                      }}
                    />
                    <div className="overflow-hidden">
                      <h3 className="text-sm font-extrabold text-[#111827] leading-snug group-hover:text-[#FF5E36] transition-colors truncate">
                        {p.name}
                      </h3>
                      <span className="text-xs font-semibold text-[#64748B]">
                        ₹{p.price} • {p.servingSize}
                      </span>
                    </div>
                  </div>

                  {/* Front Claim Quote (Theme C Cream Box) */}
                  <div className="p-3 bg-[#F4F1EA] rounded-2xl border border-[#EAE5DA] text-xs italic text-[#475569] font-medium mb-3.5">
                    "{p.frontClaim}"
                  </div>

                  {/* Metric Pill Badges */}
                  <div className="flex flex-wrap gap-1.5 text-[11px] mb-3">
                    {p.nutritionPerServe.sugarTeaspoons > 0 && (
                      <span className="px-2.5 py-1 rounded-full font-bold bg-[#FAF9F6] text-[#D11A4F] border border-[#F3D7DF] flex items-center gap-1">
                        <Flame className="w-3 h-3 text-[#FF4D80]" />
                        {p.nutritionPerServe.sugarTeaspoons} tsp sugar
                      </span>
                    )}
                    {p.palmOil.present && (
                      <span className="px-2.5 py-1 rounded-full font-bold bg-[#FAF9F6] text-[#8F6400] border border-[#F5E6B5]">
                        Palm Oil #{p.palmOil.rank}
                      </span>
                    )}
                    {p.nutritionPerServe.sodiumDailyPercent >= 20 && (
                      <span className="px-2.5 py-1 rounded-full font-bold bg-[#FAF9F6] text-[#1E40AF] border border-[#BFDBFE]">
                        {p.nutritionPerServe.sodiumDailyPercent}% daily salt
                      </span>
                    )}
                  </div>
                </div>

                {/* Bottom Action Footer */}
                <div className="pt-3.5 border-t border-[#F0ECE1] flex items-center justify-between">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onCompareProduct(p);
                    }}
                    className="text-xs font-bold text-[#64748B] hover:text-[#111827] flex items-center gap-1.5 cursor-pointer py-1.5"
                  >
                    <ArrowLeftRight className="w-3.5 h-3.5" />
                    <span>Compare</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onSelectProduct(p);
                    }}
                    className="btn-secondary h-8 px-3.5 text-xs font-bold cursor-pointer"
                  >
                    View Analysis ➔
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
      </div>
    </div>
  );
};
