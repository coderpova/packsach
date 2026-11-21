import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftRight, CheckCircle2, XCircle, Trophy } from 'lucide-react';
import type { Product } from '../types/product';
import { PRODUCTS_DATABASE } from '../data/productsData';

interface ProductComparisonProps {
  primaryProduct: Product;
  secondaryProduct?: Product;
  onInspectProduct?: (product: Product) => void;
}

export const ProductComparison: React.FC<ProductComparisonProps> = ({
  primaryProduct,
  secondaryProduct: initialSecondary,
  onInspectProduct,
}) => {
  const [productB, setProductB] = useState<Product>(() => {
    if (initialSecondary) return initialSecondary;
    const sameCategory = PRODUCTS_DATABASE.find(
      p => p.id !== primaryProduct.id && p.category === primaryProduct.category
    );
    return sameCategory || PRODUCTS_DATABASE.find(p => p.id !== primaryProduct.id) || primaryProduct;
  });

  const productA = primaryProduct;

  const scoreA = productA.healthScore.score;
  const scoreB = productB.healthScore.score;

  const sugarA = productA.nutritionPerServe.sugarTeaspoons;
  const sugarB = productB.nutritionPerServe.sugarTeaspoons;

  const sodiumA = productA.nutritionPerServe.sodiumMg;
  const sodiumB = productB.nutritionPerServe.sodiumMg;

  const palmA = productA.palmOil.present;
  const palmB = productB.palmOil.present;

  const winner = scoreA >= scoreB ? productA : productB;
  const scoreDiff = Math.abs(Math.round((scoreA - scoreB) * 10) / 10);
  const sugarDiff = Math.abs(Math.round((sugarA - sugarB) * 10) / 10);

  return (
    <div className="relative rounded-3xl p-4 sm:p-8 overflow-hidden border border-[#EAE7E0]/80 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
      {/* Packaged Canned Drinks & Beverages Shelf Background Photography */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden rounded-3xl">
        <img
          src="/assets/backgrounds/compare-food-bg.jpg"
          alt="Authentic packaged beverages and canned drinks shelf background"
          className="w-full h-full object-cover object-center opacity-75 filter saturate-110 contrast-105"
        />
        {/* Balanced overlay keeping food photography clearly visible */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#FAF9F6]/70 via-[#FAF9F6]/45 to-[#FAF9F6]/70 backdrop-blur-[1px]" />
      </div>

      <div className="relative z-10 space-y-6">
      {/* Header bar */}
      <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-7 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] border border-[#EAE5DA] text-xs font-bold text-[#111827]">
              <ArrowLeftRight className="w-3.5 h-3.5 text-[#FF5E36]" />
              <span>Side-by-Side Comparison</span>
            </span>
            <span className="text-xs font-semibold text-[#64748B]">
              Direct Nutritional Face-off
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            {productA.name} <span className="text-[#94A3B8] font-normal">vs</span> {productB.name}
          </h2>
        </div>

        {/* Product B Selector Dropdown */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 self-stretch sm:self-auto w-full sm:w-auto">
          <label htmlFor="compare-select" className="text-xs font-bold text-[#64748B] whitespace-nowrap">Compare with:</label>
          <select
            id="compare-select"
            value={productB.id}
            onChange={(e) => {
              const selected = PRODUCTS_DATABASE.find(p => p.id === e.target.value);
              if (selected) setProductB(selected);
            }}
            className="text-xs font-bold px-4 py-2.5 border border-[#EAE7E0] rounded-full bg-[#FAF9F6] text-[#111827] cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#111827] w-full sm:w-64 max-w-full truncate"
          >
            {PRODUCTS_DATABASE.filter(p => p.id !== productA.id).map(p => (
              <option key={p.id} value={p.id}>
                {p.name} (Score: {p.healthScore.score}) - ₹{p.price}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Winner Spotlight Banner (Theme C Warm Cream / Gold) */}
      <div className="p-5 sm:p-6 rounded-3xl border border-[#F0D597] bg-[#FEF9EE] flex items-center gap-4 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#FBECC8] border border-[#F0D597] flex items-center justify-center shrink-0 text-[#946200]">
          <Trophy className="w-6 h-6 text-[#946200]" />
        </div>
        <div className="flex-1 text-xs">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span className="font-black text-sm sm:text-base text-[#111827]">
              Clear Winner: {winner.name}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-[#10B981]/15 text-[#0A6B4A] font-black text-[11px]">
              +{scoreDiff} Higher Health Score
            </span>
          </div>
          <p className="text-[#475569] font-medium leading-relaxed">
            {winner.id === productB.id
              ? `Choosing ${productB.name} avoids ${sugarDiff} teaspoons of sugar and eliminates chemical food additives.`
              : `${productA.name} provides a cleaner formulation profile with significantly less industrial processing.`}
          </p>
        </div>
      </div>

      {/* Side-by-Side Product Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Product A */}
        <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <img
                src={productA.image}
                alt={productA.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#EAE7E0] bg-[#FAF9F6] shrink-0"
              />
              <div className="overflow-hidden">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] block mb-0.5">
                  {productA.brand}
                </span>
                <h3 className="text-base font-black text-[#111827] leading-snug truncate">
                  {productA.name}
                </h3>
                <span className="text-xs font-semibold text-[#64748B]">₹{productA.price} • {productA.servingSize}</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Health Score */}
              <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA]">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-[#64748B]">Health Score</span>
                  <span className="font-black text-sm text-[#111827]">{scoreA} / 10</span>
                </div>
                <div className="w-full bg-[#E5E0D5] h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scoreA * 10}%` }}
                    className={`h-full rounded-full ${scoreA < 4 ? 'bg-[#FF4D80]' : scoreA < 7 ? 'bg-[#FFD84D]' : 'bg-[#10B981]'}`}
                  />
                </div>
              </div>

              {/* Sugar Comparison */}
              <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA]">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-[#64748B]">Sugar Teaspoons</span>
                  <span className="font-black text-[#D11A4F]">{sugarA} tsp ({productA.nutritionPerServe.sugarGrams}g)</span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {Array.from({ length: Math.min(12, Math.ceil(sugarA)) }).map((_, i) => (
                    <div
                      key={i}
                      className="w-6 h-6 bg-white border border-[#D5CFC2] rounded-lg shadow-xs flex items-center justify-center text-[10px] font-black text-[#111827]"
                    >
                      1
                    </div>
                  ))}
                </div>
              </div>

              {/* Palm Oil */}
              <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA] flex items-center justify-between text-xs">
                <span className="font-bold text-[#64748B]">Palm Oil Status:</span>
                <span className={`font-black flex items-center gap-1.5 ${palmA ? 'text-[#D11A4F]' : 'text-[#0A6B4A]'}`}>
                  {palmA ? <XCircle className="w-4 h-4 text-[#FF4D80]" /> : <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                  {palmA ? `Present (#${productA.palmOil.rank})` : 'Zero Palm Oil'}
                </span>
              </div>

              {/* Sodium */}
              <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA] flex items-center justify-between text-xs">
                <span className="font-bold text-[#64748B]">Sodium:</span>
                <span className="font-black text-[#111827]">
                  {sodiumA}mg ({productA.nutritionPerServe.sodiumDailyPercent}% cap)
                </span>
              </div>
            </div>
          </div>

          {onInspectProduct && (
            <button
              onClick={() => onInspectProduct(productA)}
              className="btn-secondary w-full h-10 text-xs font-bold mt-5 cursor-pointer"
            >
              Inspect {productA.name} ➔
            </button>
          )}
        </div>

        {/* Product B */}
        <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-7 shadow-[0_4px_24px_rgba(0,0,0,0.03)] flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-4 mb-5">
              <img
                src={productB.image}
                alt={productB.name}
                className="w-16 h-16 rounded-2xl object-cover border border-[#EAE7E0] bg-[#FAF9F6] shrink-0"
              />
              <div className="overflow-hidden">
                <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B] block mb-0.5">
                  {productB.brand}
                </span>
                <h3 className="text-base font-black text-[#111827] leading-snug truncate">
                  {productB.name}
                </h3>
                <span className="text-xs font-semibold text-[#64748B]">₹{productB.price} • {productB.servingSize}</span>
              </div>
            </div>

            <div className="space-y-3.5">
              {/* Health Score */}
              <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA]">
                <div className="flex justify-between items-center text-xs font-bold mb-1.5">
                  <span className="text-[#64748B]">Health Score</span>
                  <span className="font-black text-sm text-[#111827]">{scoreB} / 10</span>
                </div>
                <div className="w-full bg-[#E5E0D5] h-2.5 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${scoreB * 10}%` }}
                    className={`h-full rounded-full ${scoreB < 4 ? 'bg-[#FF4D80]' : scoreB < 7 ? 'bg-[#FFD84D]' : 'bg-[#10B981]'}`}
                  />
                </div>
              </div>

              {/* Sugar Comparison */}
              <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA]">
                <div className="flex justify-between items-center text-xs font-bold mb-2">
                  <span className="text-[#64748B]">Sugar Teaspoons</span>
                  <span className={`font-black ${sugarB < sugarA ? 'text-[#0A6B4A]' : 'text-[#D11A4F]'}`}>
                    {sugarB} tsp ({productB.nutritionPerServe.sugarGrams}g)
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {sugarB === 0 ? (
                    <span className="text-xs font-black text-[#0A6B4A]">Zero added sugar</span>
                  ) : (
                    Array.from({ length: Math.min(12, Math.ceil(sugarB)) }).map((_, i) => (
                      <div
                        key={i}
                        className="w-6 h-6 bg-white border border-[#D5CFC2] rounded-lg shadow-xs flex items-center justify-center text-[10px] font-black text-[#111827]"
                      >
                        1
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Palm Oil */}
              <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA] flex items-center justify-between text-xs">
                <span className="font-bold text-[#64748B]">Palm Oil Status:</span>
                <span className={`font-black flex items-center gap-1.5 ${palmB ? 'text-[#D11A4F]' : 'text-[#0A6B4A]'}`}>
                  {palmB ? <XCircle className="w-4 h-4 text-[#FF4D80]" /> : <CheckCircle2 className="w-4 h-4 text-[#10B981]" />}
                  {palmB ? `Present (#${productB.palmOil.rank})` : 'Zero Palm Oil'}
                </span>
              </div>

              {/* Sodium */}
              <div className="p-4 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA] flex items-center justify-between text-xs">
                <span className="font-bold text-[#64748B]">Sodium:</span>
                <span className="font-black text-[#111827]">
                  {sodiumB}mg ({productB.nutritionPerServe.sodiumDailyPercent}% cap)
                </span>
              </div>
            </div>
          </div>

          {onInspectProduct && (
            <button
              onClick={() => onInspectProduct(productB)}
              className="btn-secondary w-full h-10 text-xs font-bold mt-5 cursor-pointer"
            >
              Inspect {productB.name} ➔
            </button>
          )}
        </div>
      </div>
      </div>
    </div>
  );
};
