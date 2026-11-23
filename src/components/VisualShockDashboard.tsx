import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { ArrowLeftRight, Sparkles, Edit3, Check, ShoppingBag, AlertTriangle, ShieldCheck } from 'lucide-react';
import type { Product, SmartSwap } from '../types/product';
import { useAuth } from '../context/AuthContext';
import { SugarCubesVisualizer } from './SugarCubesVisualizer';
import { OilMeterVisualizer } from './OilMeterVisualizer';
import { SodiumVisualizer } from './SodiumVisualizer';
import { HealthScoreGauge } from './HealthScoreGauge';
import { AdditivesBreakdown } from './AdditivesBreakdown';

interface VisualShockProps {
  product: Product;
  onSelectSwap?: (swapId: string) => void;
  onCompare?: (product: Product) => void;
  onOpenEditOcr?: () => void;
  onAddSwapToList?: (swap: SmartSwap, currentProduct: Product) => void;
  isSwapAdded?: boolean;
}

export const VisualShockDashboard: React.FC<VisualShockProps> = ({
  product,
  onSelectSwap,
  onCompare,
  onOpenEditOcr,
  onAddSwapToList,
  isSwapAdded = false,
}) => {
  const [localAdded, setLocalAdded] = useState(isSwapAdded);
  const { checkProductAllergies, isAuthenticated, profile, openAuthModal } = useAuth();
  const allergyCheck = checkProductAllergies(product);

  const bestSwap = product.swaps[0];
  const score = product.healthScore.score;

  const additivesCount = product.parsedIngredients.filter(i => i.isAdditive || !!i.eNumber).length;

  const concernLevel =
    score <= 4 ? 'High concern' : score <= 7 ? 'Moderate concern' : 'Clean choice';
  const concernBadgeColor =
    score <= 4
      ? 'bg-[#FFF1EE] text-[#C2410C] border-[#FFE1DA]'
      : score <= 7
      ? 'bg-amber-50 text-amber-900 border-amber-200'
      : 'bg-emerald-50 text-emerald-800 border-emerald-200';

  const handleAddSwap = () => {
    if (bestSwap && onAddSwapToList) {
      onAddSwapToList(bestSwap, product);
      setLocalAdded(true);
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
        colors: ['#FF5E36', '#111827', '#10B981', '#FFD84D']
      });
      setTimeout(() => setLocalAdded(false), 2500);
    }
  };

  return (
    <div className="relative rounded-3xl p-4 sm:p-8 lg:p-10 overflow-hidden border border-[#EAE7E0]/80 w-full max-w-6xl mx-auto shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      {/* Packaged Chocolate & Confectionery Nutrition Background Photography */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
        <img
          src="/assets/backgrounds/analysis-food-bg.jpg"
          alt="Authentic chocolate confectionery packaging and nutrition label background"
          className="w-full h-full object-cover object-center opacity-80 filter saturate-110 contrast-105"
        />
        {/* Balanced overlay keeping the crystalline sugar photography clearly visible behind cards */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/70 via-[#FAF9F6]/45 to-[#FAF9F6]/70 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 space-y-6">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-1">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 border border-[#EAE5DA] text-xs font-bold text-[#111827] mb-2 shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#FF5E36]" />
              <span>Nutritional Forensic Analysis</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
              Visual Shock Dashboard
            </h2>
            <p className="text-xs sm:text-sm text-[#475569] mt-1 font-medium">
              Hidden sugar cubes, industrial palm oil fractions, and food additive disclosures.
            </p>
          </div>
        </div>

        {/* Personalized Health & Allergen Warning Banner */}
        {isAuthenticated && (profile?.allergies.length || profile?.dietaryPreferences.length) ? (
          allergyCheck.hasConflict ? (
            <div className="bg-[#FFF5F5] border-2 border-[#FED7D7] rounded-3xl p-4 sm:p-5 flex items-start gap-3.5 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-[#FED7D7] flex items-center justify-center text-[#E53E3E] shrink-0 mt-0.5">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-sm font-black text-[#9B2C2C]">
                    Personalized Safety Warning: Product Conflict Detected!
                  </h3>
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-[#FED7D7] text-[#9B2C2C]">
                    Health Alert
                  </span>
                </div>
                <p className="text-xs text-[#C53030] mt-1 leading-relaxed">
                  Based on your saved health profile, this food product may not be suitable for you:
                </p>
                <div className="flex flex-wrap gap-1.5 mt-2.5">
                  {allergyCheck.conflictingAllergies.map((allergy) => (
                    <span
                      key={allergy}
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FED7D7] text-[#9B2C2C] border border-[#FEB2B2]"
                    >
                      Contains {allergy}
                    </span>
                  ))}
                  {allergyCheck.conflictingDiets.map((diet) => (
                    <span
                      key={diet}
                      className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#FED7D7] text-[#9B2C2C] border border-[#FEB2B2]"
                    >
                      Conflicts with {diet}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-[#ECFDF5] border border-[#A7F3D0] rounded-2xl px-4 py-3 flex items-center gap-2.5 text-xs text-[#065F46] font-semibold">
              <ShieldCheck className="w-4 h-4 text-[#10B981] shrink-0" />
              <span>
                Personalized Profile Check: Zero conflicts detected with your {profile?.allergies.length || 0} allergies and {profile?.dietaryPreferences.length || 0} dietary safeguards.
              </span>
            </div>
          )
        ) : !isAuthenticated ? (
          <div className="bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs text-[#64748B]">
            <span className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#FF5E36]" />
              <span>Sign in to automatically screen every scanned packet for personal food allergies & diets.</span>
            </span>
            <button
              onClick={() => openAuthModal('login')}
              className="font-bold text-[#FF5E36] hover:underline shrink-0 cursor-pointer"
            >
              Sign In ➔
            </button>
          </div>
        ) : null}
      {/* 1. Theme C Top Ingredients Box with "Edit text" (Matching Reference) */}
      <div className="bg-[#F4F1EA] border border-[#EAE5DA] rounded-3xl p-4 sm:p-5 relative">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#64748B]">
            Extracted Label Ingredients:
          </span>
          {onOpenEditOcr && (
            <button
              onClick={onOpenEditOcr}
              className="text-xs font-bold text-[#111827] hover:text-[#FF5E36] transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit text</span>
            </button>
          )}
        </div>
        <p className="text-xs sm:text-sm font-mono text-slate-800 leading-relaxed break-words">
          {product.ingredientsText}
        </p>
      </div>

      {/* 2. Theme C Primary Inspection Card (Matching Reference Result Design) */}
      <div className="ps-card p-6 sm:p-8 bg-white relative">
        {/* Top Row: Product Name & Concern Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <span className="text-xs font-bold uppercase tracking-wider text-[#64748B]">
                {product.brand} • {product.categoryLabel}
              </span>
              <span className="text-[10px] font-black uppercase text-slate-700 bg-[#F4F1EA] px-2.5 py-0.5 rounded-full border border-[#EAE5DA]">
                Source: {product.dataSource}
              </span>
              {product.isPartialNutrition && (
                <span className="text-[10px] font-bold text-amber-900 bg-amber-100 px-2.5 py-0.5 rounded-full border border-amber-300">
                  Partial Scanned Data
                </span>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-[#111827] mt-0.5 leading-snug">
              {product.name}
            </h2>
          </div>

          <span className={`px-3 py-1 rounded-full text-xs font-bold border shrink-0 ${concernBadgeColor}`}>
            {concernLevel}
          </span>
        </div>

        {/* Big Bold Score: 3 /10 */}
        <div className="flex items-baseline gap-1 my-4">
          <span className="text-5xl sm:text-6xl font-black text-[#111827] tracking-tight">
            {score}
          </span>
          <span className="text-2xl font-bold text-[#64748B]">/10</span>
        </div>

        {/* 3 Metric Pill Boxes (Matching Reference: 3 tsp Sugar | Top 3 Palm oil | 3 E-numbers) */}
        <div className="grid grid-cols-3 gap-2.5 sm:gap-3.5 my-5">
          {/* Box 1: Sugar */}
          <div className="bg-[#FAF9F6] border border-[#EAE7E0] p-3 sm:p-4 rounded-2xl text-left">
            <span className="text-base sm:text-xl font-black text-[#111827] block">
              {product.nutritionPerServe.sugarTeaspoons} tsp
            </span>
            <span className="text-[11px] font-semibold text-[#64748B] block mt-0.5">
              Sugar
            </span>
          </div>

          {/* Box 2: Palm Oil */}
          <div className="bg-[#FAF9F6] border border-[#EAE7E0] p-3 sm:p-4 rounded-2xl text-left">
            <span className="text-base sm:text-xl font-black text-[#111827] block">
              {product.palmOil.present ? `#${product.palmOil.rank || '2'}` : 'Zero'}
            </span>
            <span className="text-[11px] font-semibold text-[#64748B] block mt-0.5">
              Palm oil
            </span>
          </div>

          {/* Box 3: E-Numbers */}
          <div className="bg-[#FAF9F6] border border-[#EAE7E0] p-3 sm:p-4 rounded-2xl text-left">
            <span className="text-base sm:text-xl font-black text-[#111827] block">
              {additivesCount}
            </span>
            <span className="text-[11px] font-semibold text-[#64748B] block mt-0.5">
              E-numbers
            </span>
          </div>
        </div>

        {/* Compare & Actions Bar */}
        <div className="pt-3 border-t border-[#F0ECE1] flex flex-wrap items-center justify-between gap-3">
          <span className="text-xs font-semibold text-[#64748B]">
            Serving size: <strong>{product.servingSize}</strong> (₹{product.price})
          </span>

          {onCompare && (
            <button
              onClick={() => onCompare(product)}
              className="btn-secondary h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer"
            >
              <ArrowLeftRight className="w-3.5 h-3.5" />
              <span>Compare with other staples</span>
            </button>
          )}
        </div>
      </div>

      {/* 3. Theme C Vibrant Coral Swap Card (Matching Reference Result Design) */}
      {bestSwap && (
        <div className="bg-[#FF5E36] text-white p-6 sm:p-7 rounded-3xl shadow-md flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-black tracking-wider uppercase text-white/90 block">
              SWAP, SAME PRICE
            </span>
            <h3
              onClick={() => onSelectSwap?.(bestSwap.id)}
              className="text-xl sm:text-2xl font-black text-white mt-0.5 cursor-pointer hover:underline"
              title="Inspect swap product"
            >
              {bestSwap.name}
            </h3>
            <span className="text-xs sm:text-sm font-semibold text-white/90 block mt-1">
              ₹{bestSwap.price}, {bestSwap.sugarTeaspoons} tsp sugar • {bestSwap.brand}
            </span>
            {bestSwap.evidenceBasis && (
              <span className="text-[11px] text-white/80 block mt-1.5 leading-relaxed bg-white/10 p-2 rounded-xl">
                {bestSwap.evidenceBasis}
              </span>
            )}
          </div>

          <div className="shrink-0">
            <button
              onClick={handleAddSwap}
              className={`h-11 px-6 text-xs font-bold rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm ${
                localAdded
                  ? 'bg-[#10B981] text-white'
                  : 'btn-dark'
              }`}
            >
              {localAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Added to list!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-4 h-4" />
                  <span>Add to list</span>
                </>
              )}
            </button>
          </div>
        </div>
      )}

      {/* 4. Deep-Dive Visual Shock Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Sugar Shock Visualizer */}
        <SugarCubesVisualizer
          sugarGramsPerServe={product.nutritionPerServe.sugarGrams}
          addedSugarGrams={product.nutritionPerServe.addedSugarGrams}
          sugarTeaspoons={product.nutritionPerServe.sugarTeaspoons}
          servingSizeText={product.servingSize}
          isDeclared={product.nutritionPerServe.sugarDeclared !== false}
          status={product.nutritionPerServe.sugarStatus}
        />

        {/* Oil Meter Visualizer */}
        <OilMeterVisualizer
          palmOil={product.palmOil}
          totalFatGrams={product.nutritionPerServe.totalFatGrams}
          saturatedFatGrams={product.nutritionPerServe.saturatedFatGrams}
          transFatGrams={product.nutritionPerServe.transFatGrams}
        />

        {/* Sodium Visualizer */}
        <SodiumVisualizer
          sodiumMg={product.nutritionPerServe.sodiumMg}
          sodiumPercentDaily={product.nutritionPerServe.sodiumDailyPercent}
          isDeclared={product.nutritionPerServe.sodiumDeclared !== false}
          status={product.nutritionPerServe.sodiumStatus}
        />

        {/* Transparent Health Score Gauge */}
        <HealthScoreGauge
          scoreDetails={product.healthScore}
          productName={product.name}
        />
      </div>

      {/* 5. Complete Additives & Chemical Decoder */}
      <AdditivesBreakdown
        parsedIngredients={product.parsedIngredients}
        rawText={product.ingredientsText}
      />

      {/* Honest Transparency & Dietary Standards Disclaimer */}
      <div className="pt-4 text-center text-xs text-[#64748B] font-medium space-y-1.5 border-t border-[#EAE7E0]/60">
        <p className="font-semibold text-slate-700">
          {product.healthScore.disclaimer || 'PackSach Health Score is an informational comparison tool based on published WHO/FSSAI dietary guidelines. It is not an official FSSAI rating.'}
        </p>
        {product.dataProvenanceNotes && (
          <p className="text-[11px] text-amber-900 bg-amber-50 py-1 px-3 rounded-full inline-block border border-amber-200">
            {product.dataProvenanceNotes}
          </p>
        )}
        <p className="text-[11px] text-slate-400">
          Not medical advice. Evaluated from declared physical package declarations &amp; verified ingredient records.
        </p>
      </div>
      </div>
    </div>
  );
};
