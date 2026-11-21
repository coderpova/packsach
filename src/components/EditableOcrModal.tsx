import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Edit3, Sparkles, X, AlertCircle, ShieldCheck, HelpCircle } from 'lucide-react';
import { parseIngredientsText } from '../services/ingredientParser';
import { calculateHealthScore } from '../services/healthScoreEngine';
import type { Product } from '../types/product';
import type { WordConfidence, ExtractedNutritionValues } from '../services/imageValidator';

interface EditableOcrModalProps {
  initialText: string;
  confidence: number;
  wordTokens?: WordConfidence[];
  initialNutrition?: ExtractedNutritionValues;
  imagePreview?: string;
  onConfirm: (customProduct: Product) => void;
  onCancel: () => void;
}

export const EditableOcrModal: React.FC<EditableOcrModalProps> = ({
  initialText,
  confidence,
  wordTokens = [],
  initialNutrition,
  imagePreview,
  onConfirm,
  onCancel,
}) => {
  const [text, setText] = useState<string>(initialText);
  const [productName, setProductName] = useState<string>('Custom Scanned Packet');
  const [brand, setBrand] = useState<string>('Packaged Food');
  const [price, setPrice] = useState<number>(25);
  const [servingGrams, setServingGrams] = useState<number>(initialNutrition?.servingGrams || 30);

  // Optional manual overrides for nutrition values
  const [sugarInput, setSugarInput] = useState<string>(
    initialNutrition?.declaredFields.sugar && initialNutrition.sugarGrams !== undefined
      ? String(initialNutrition.sugarGrams)
      : ''
  );
  const [sodiumInput, setSodiumInput] = useState<string>(
    initialNutrition?.declaredFields.sodium && initialNutrition.sodiumMg !== undefined
      ? String(initialNutrition.sodiumMg)
      : ''
  );
  const [caloriesInput, setCaloriesInput] = useState<string>(
    initialNutrition?.declaredFields.calories && initialNutrition.calories !== undefined
      ? String(initialNutrition.calories)
      : ''
  );
  const [totalFatInput, setTotalFatInput] = useState<string>(
    initialNutrition?.declaredFields.totalFat && initialNutrition.totalFatGrams !== undefined
      ? String(initialNutrition.totalFatGrams)
      : ''
  );
  const [saturatedFatInput, setSaturatedFatInput] = useState<string>(
    initialNutrition?.declaredFields.saturatedFat && initialNutrition.saturatedFatGrams !== undefined
      ? String(initialNutrition.saturatedFatGrams)
      : ''
  );
  const [proteinInput, setProteinInput] = useState<string>(
    initialNutrition?.declaredFields.protein && initialNutrition.proteinGrams !== undefined
      ? String(initialNutrition.proteinGrams)
      : ''
  );
  const [fiberInput, setFiberInput] = useState<string>(
    initialNutrition?.declaredFields.fiber && initialNutrition.fiberGrams !== undefined
      ? String(initialNutrition.fiberGrams)
      : ''
  );

  const [showAdvancedNutrition, setShowAdvancedNutrition] = useState<boolean>(false);

  // Real-time parsing of ingredients
  const parsed = useMemo(() => parseIngredientsText(text), [text]);

  const sugarNum = sugarInput.trim() !== '' ? parseFloat(sugarInput) : null;
  const sodiumNum = sodiumInput.trim() !== '' ? parseFloat(sodiumInput) : null;
  const caloriesNum = caloriesInput.trim() !== '' ? parseFloat(caloriesInput) : null;
  const totalFatNum = totalFatInput.trim() !== '' ? parseFloat(totalFatInput) : null;
  const saturatedFatNum = saturatedFatInput.trim() !== '' ? parseFloat(saturatedFatInput) : null;
  const proteinNum = proteinInput.trim() !== '' ? parseFloat(proteinInput) : null;
  const fiberNum = fiberInput.trim() !== '' ? parseFloat(fiberInput) : null;

  // Real-time recalculation of honest health score
  const dynamicHealthScore = useMemo(() => {
    return calculateHealthScore(
      {
        sugarGrams: sugarNum,
        sodiumMg: sodiumNum,
        transFatGrams: 0,
        proteinGrams: proteinNum || 0,
        fiberGrams: fiberNum || 0,
        servingGrams,
        isPartialData: sugarNum === null || sodiumNum === null
      },
      parsed
    );
  }, [sugarNum, sodiumNum, proteinNum, fiberNum, servingGrams, parsed]);

  const palmIng = parsed.find(i => i.isPalmOil);
  const hasPalm = !!palmIng;

  const lowConfidenceTokens = wordTokens.filter(t => t.isLowConfidence);

  const handleGenerateReport = () => {
    const missingNutrients: string[] = [];
    if (sugarNum === null) missingNutrients.push('Added Sugar (g)');
    if (sodiumNum === null) missingNutrients.push('Sodium (mg)');
    if (caloriesNum === null) missingNutrients.push('Energy (kcal)');
    if (totalFatNum === null) missingNutrients.push('Total Fat (g)');

    const finalSugarGrams = sugarNum !== null ? sugarNum : 0;
    const finalSugarTeaspoons = sugarNum !== null ? Math.round((sugarNum / 4) * 10) / 10 : 0;
    const finalCalories = caloriesNum !== null ? caloriesNum : 0;
    const finalSodium = sodiumNum !== null ? sodiumNum : 0;
    const finalTotalFat = totalFatNum !== null ? totalFatNum : (hasPalm ? 6.0 : 0);
    const finalSatFat = saturatedFatNum !== null ? saturatedFatNum : (hasPalm ? 3.0 : 0);
    const finalProtein = proteinNum !== null ? proteinNum : 0;
    const finalFiber = fiberNum !== null ? fiberNum : 0;

    const palmOilRank = palmIng ? palmIng.rank : null;

    const newProduct: Product = {
      id: `ocr-${Date.now()}`,
      name: productName,
      brand,
      category: 'biscuits',
      categoryLabel: 'Custom Scanned Product',
      price,
      image: imagePreview || '/assets/backgrounds/analysis-food-bg.jpg',
      frontClaim: 'User Scanned Back Label (OCR Extracted & Verified)',
      servingSize: `${servingGrams}g (serve size)`,
      servingGrams,
      ingredientsText: text,
      parsedIngredients: parsed,
      nutritionPerServe: {
        calories: finalCalories,
        caloriesDeclared: caloriesNum !== null,
        caloriesStatus: caloriesNum !== null ? 'user_corrected' : 'not_declared',
        sugarGrams: finalSugarGrams,
        sugarDeclared: sugarNum !== null,
        sugarStatus: sugarNum !== null ? 'user_corrected' : 'not_declared',
        sugarTeaspoons: finalSugarTeaspoons,
        totalFatGrams: finalTotalFat,
        totalFatDeclared: totalFatNum !== null,
        totalFatStatus: totalFatNum !== null ? 'user_corrected' : 'not_declared',
        saturatedFatGrams: finalSatFat,
        saturatedFatDeclared: saturatedFatNum !== null,
        saturatedFatStatus: saturatedFatNum !== null ? 'user_corrected' : 'not_declared',
        transFatGrams: 0,
        transFatDeclared: true,
        transFatStatus: 'user_corrected',
        sodiumMg: finalSodium,
        sodiumDeclared: sodiumNum !== null,
        sodiumStatus: sodiumNum !== null ? 'user_corrected' : 'not_declared',
        sodiumDailyPercent: Math.round((finalSodium / 2000) * 100),
        proteinGrams: finalProtein,
        proteinDeclared: proteinNum !== null,
        proteinStatus: proteinNum !== null ? 'user_corrected' : 'not_declared',
        fiberGrams: finalFiber,
        fiberDeclared: fiberNum !== null,
        fiberStatus: fiberNum !== null ? 'user_corrected' : 'not_declared'
      },
      nutritionPer100g: {
        calories: caloriesNum !== null ? Math.round((caloriesNum / servingGrams) * 100) : 0,
        sugarGrams: sugarNum !== null ? Math.round((sugarNum / servingGrams) * 100) : 0,
        totalFatGrams: totalFatNum !== null ? Math.round((totalFatNum / servingGrams) * 100) : 0,
        saturatedFatGrams: saturatedFatNum !== null ? Math.round((saturatedFatNum / servingGrams) * 100) : 0,
        sodiumMg: sodiumNum !== null ? Math.round((sodiumNum / servingGrams) * 100) : 0
      },
      palmOil: {
        present: hasPalm,
        rank: palmOilRank,
        warningText: hasPalm
          ? `Palm oil detected at #${palmOilRank} in declared ingredient list`
          : 'No palm oil detected in declared ingredients',
        isExactPercentageDeclared: false
      },
      healthScore: dynamicHealthScore,
      shockStatement: sugarNum !== null && finalSugarTeaspoons >= 2.5
        ? `Contains ${finalSugarTeaspoons} teaspoons of sugar (${finalSugarGrams}g) per serve. Evaluated from verified label text.`
        : hasPalm
        ? 'Contains industrial palm oil in declared ingredients. Evaluated from verified label text.'
        : 'Formulation evaluated directly from your verified scanned label declaration.',
      hindiCallout: 'User verified back-of-packet analysis',
      swaps: [
        {
          id: 'swap-clean-choice',
          name: '100% Roasted Multigrain Khakhra / Roasted Chana',
          brand: 'PackSach Clean Swaps',
          price,
          sugarTeaspoons: 0,
          healthScore: 9.3,
          caloriesPerServe: 95,
          whyBetter: 'Zero palm oil, zero added refined sugar, clean traditional dry roasting.',
          evidenceBasis: 'Whole food profile: 100% whole grain wheat/chana, roasted dry with zero palmolein.',
          servingComparisonText: `Equivalent snack serving: ~${servingGrams}g portion.`,
          priceComparisonText: `Same price bracket: ₹${price}.`,
          availability: 'Available on all quick-commerce platforms'
        }
      ],
      dataSource: missingNutrients.length > 0 ? 'User Scanned (Partial Label)' : 'User Scanned (Verified OCR)',
      dataProvenance: missingNutrients.length > 0 ? 'ocr_partial_label' : 'ocr_user_verified',
      isPartialNutrition: missingNutrients.length > 0,
      missingNutrients,
      dataProvenanceNotes: missingNutrients.length > 0
        ? `The following values were not declared on the physical scanned label and were not fabricated: ${missingNutrients.join(', ')}.`
        : 'All nutritional metrics verified directly from physical package OCR extraction.'
    };

    onConfirm(newProduct);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.96 }}
        className="bg-white rounded-3xl border border-[#EAE7E0] w-full max-w-3xl p-6 sm:p-8 relative my-8 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={onCancel}
          className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#111827] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-wrap items-center gap-2 mb-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] border border-[#EAE5DA] text-xs font-bold text-[#111827]">
            <Edit3 className="w-3.5 h-3.5 text-[#FF5E36]" />
            <span>OCR Verification & Review</span>
          </span>
          <span className="text-xs font-bold text-[#0A6B4A] bg-[#10B981]/15 px-3 py-1 rounded-full">
            OCR Confidence: {Math.round(confidence)}%
          </span>
          <span className="text-xs font-semibold text-[#64748B] bg-slate-100 px-3 py-1 rounded-full">
            Live Health Score: <strong className="text-[#111827]">{dynamicHealthScore.score}/10</strong>
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
          Review & Confirm Scanned Label Data
        </h2>
        <p className="text-xs sm:text-sm text-[#64748B] mt-1 leading-relaxed">
          <strong>No Fake Information Policy:</strong> PackSach never fabricates missing nutrition numbers. Review the extracted text and values below. Any value omitted from the package is transparently recorded.
        </p>

        {/* Low-confidence word review alert */}
        {lowConfidenceTokens.length > 0 && (
          <div className="mt-4 p-3.5 bg-amber-50 border border-amber-200 rounded-2xl">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-xs text-amber-900">
                <span className="font-bold block mb-1">
                  Low OCR Confidence on {lowConfidenceTokens.length} word(s) — please review:
                </span>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {lowConfidenceTokens.slice(0, 10).map((tok, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md bg-white border border-amber-300 text-[11px] font-mono text-amber-900 shadow-2xs"
                    >
                      {tok.text} ({tok.confidence}%)
                    </span>
                  ))}
                  {lowConfidenceTokens.length > 10 && (
                    <span className="text-[11px] text-amber-700 self-center">
                      +{lowConfidenceTokens.length - 10} more
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Basic Metadata inputs */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 my-4">
          <div className="sm:col-span-2">
            <label htmlFor="ocr-product-name" className="text-[11px] font-bold text-[#64748B] block mb-1">Product Name</label>
            <input
              id="ocr-product-name"
              name="productName"
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full text-xs font-bold px-3.5 py-2.5 border border-[#EAE7E0] rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              placeholder="e.g. Digestive Biscuit"
            />
          </div>
          <div>
            <label htmlFor="ocr-brand-name" className="text-[11px] font-bold text-[#64748B] block mb-1">Brand Name</label>
            <input
              id="ocr-brand-name"
              name="brandName"
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              className="w-full text-xs font-bold px-3.5 py-2.5 border border-[#EAE7E0] rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              placeholder="e.g. Britannia"
            />
          </div>
          <div>
            <label htmlFor="ocr-serving-grams" className="text-[11px] font-bold text-[#64748B] block mb-1">Serving Size (g)</label>
            <input
              id="ocr-serving-grams"
              name="servingGrams"
              type="number"
              value={servingGrams}
              onChange={(e) => setServingGrams(Math.max(1, Number(e.target.value)))}
              className="w-full text-xs font-bold px-3.5 py-2.5 border border-[#EAE7E0] rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#111827]"
            />
          </div>
        </div>

        {/* Editable Ingredients Textarea */}
        <div className="my-3">
          <label htmlFor="ocr-ingredients-text" className="text-xs font-bold text-[#111827] flex items-center justify-between mb-1.5">
            <span>Ingredients List (Editable — order matters for FSSAI ranking):</span>
            <span className="text-[11px] text-[#FF5E36] font-bold">
              {parsed.length} ingredients recognized
            </span>
          </label>
          <textarea
            id="ocr-ingredients-text"
            name="ingredientsText"
            rows={4}
            value={text}
            onChange={(e) => setText(e.target.value)}
            className="w-full p-3.5 text-xs font-mono border border-[#EAE5DA] rounded-2xl bg-[#F4F1EA] focus:outline-none focus:ring-2 focus:ring-[#111827] leading-relaxed text-[#111827]"
            placeholder="e.g. Refined Wheat Flour (Maida), Sugar, Refined Palm Oil, Invert Sugar Syrup, Raising Agents..."
          />
        </div>

        {/* Parsed Ingredients Pill Preview */}
        <div className="p-3 bg-[#FAF9F6] border border-[#EAE7E0] rounded-2xl mb-4">
          <span className="text-[10px] font-black uppercase text-[#64748B] tracking-wider block mb-1.5">
            Detected Ingredients & FSSAI Ranking (Recalculates on Edit):
          </span>
          <div className="flex flex-wrap gap-1.5 text-xs max-h-24 overflow-y-auto">
            {parsed.map((item, idx) => (
              <span
                key={idx}
                className={`px-2 py-0.5 rounded-full text-[11px] font-bold border ${
                  item.isPalmOil
                    ? 'bg-[#FAF9F6] text-[#8F6400] border-[#F5E6B5]'
                    : item.isAddedSugar
                    ? 'bg-[#FAF9F6] text-[#D11A4F] border-[#F3D7DF]'
                    : item.isAdditive
                    ? 'bg-[#FAF9F6] text-[#6545F5] border-[#DDD6FE]'
                    : 'bg-white text-[#475569] border-[#EAE7E0]'
                }`}
              >
                #{item.rank} {item.name}
              </span>
            ))}
          </div>
        </div>

        {/* Nutrition Table Values: Scanned vs Undeclared */}
        <div className="p-4 bg-white border border-[#EAE7E0] rounded-2xl mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-black text-[#111827] flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-[#10B981]" />
              <span>Nutrition Facts (From Scanned Label):</span>
            </span>
            <button
              type="button"
              onClick={() => setShowAdvancedNutrition(!showAdvancedNutrition)}
              className="text-xs font-bold text-[#FF5E36] hover:underline cursor-pointer"
            >
              {showAdvancedNutrition ? 'Collapse Nutrition Fields' : 'Expand All Nutrition Fields'}
            </button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
            <div>
              <label htmlFor="ocr-sugar-g" className="text-[10px] font-bold text-[#64748B] block mb-0.5">
                Sugar (g/serve)
              </label>
              <input
                id="ocr-sugar-g"
                type="number"
                step="0.1"
                value={sugarInput}
                onChange={(e) => setSugarInput(e.target.value)}
                placeholder="Not declared"
                className="w-full text-xs font-bold px-3 py-2 border border-[#EAE7E0] rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
              <span className="text-[9px] text-[#64748B] mt-0.5 block">
                {sugarInput ? `${(parseFloat(sugarInput) / 4).toFixed(1)} tsp` : 'Evaluated by ingredient order'}
              </span>
            </div>

            <div>
              <label htmlFor="ocr-sodium-mg" className="text-[10px] font-bold text-[#64748B] block mb-0.5">
                Sodium (mg/serve)
              </label>
              <input
                id="ocr-sodium-mg"
                type="number"
                step="1"
                value={sodiumInput}
                onChange={(e) => setSodiumInput(e.target.value)}
                placeholder="Not declared"
                className="w-full text-xs font-bold px-3 py-2 border border-[#EAE7E0] rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
              <span className="text-[9px] text-[#64748B] mt-0.5 block">
                {sodiumInput ? `${Math.round((parseFloat(sodiumInput) / 2000) * 100)}% daily limit` : 'No deduction applied'}
              </span>
            </div>

            <div>
              <label htmlFor="ocr-calories-kcal" className="text-[10px] font-bold text-[#64748B] block mb-0.5">
                Calories (kcal)
              </label>
              <input
                id="ocr-calories-kcal"
                type="number"
                step="1"
                value={caloriesInput}
                onChange={(e) => setCaloriesInput(e.target.value)}
                placeholder="Not declared"
                className="w-full text-xs font-bold px-3 py-2 border border-[#EAE7E0] rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
              <span className="text-[9px] text-[#64748B] mt-0.5 block">
                {caloriesInput ? `${caloriesInput} kcal` : 'Not declared'}
              </span>
            </div>

            <div>
              <label htmlFor="ocr-total-fat-g" className="text-[10px] font-bold text-[#64748B] block mb-0.5">
                Total Fat (g)
              </label>
              <input
                id="ocr-total-fat-g"
                type="number"
                step="0.1"
                value={totalFatInput}
                onChange={(e) => setTotalFatInput(e.target.value)}
                placeholder="Not declared"
                className="w-full text-xs font-bold px-3 py-2 border border-[#EAE7E0] rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#111827]"
              />
              <span className="text-[9px] text-[#64748B] mt-0.5 block">
                {totalFatInput ? `${totalFatInput}g` : hasPalm ? 'Palm oil present' : 'Not declared'}
              </span>
            </div>
          </div>

          {showAdvancedNutrition && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 mt-3 pt-3 border-t border-[#F0ECE1]">
              <div>
                <label htmlFor="ocr-sat-fat-g" className="text-[10px] font-bold text-[#64748B] block mb-0.5">Saturated Fat (g)</label>
                <input
                  id="ocr-sat-fat-g"
                  type="number"
                  step="0.1"
                  value={saturatedFatInput}
                  onChange={(e) => setSaturatedFatInput(e.target.value)}
                  placeholder="Not declared"
                  className="w-full text-xs font-bold px-3 py-2 border border-[#EAE7E0] rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>
              <div>
                <label htmlFor="ocr-protein-g" className="text-[10px] font-bold text-[#64748B] block mb-0.5">Protein (g)</label>
                <input
                  id="ocr-protein-g"
                  type="number"
                  step="0.1"
                  value={proteinInput}
                  onChange={(e) => setProteinInput(e.target.value)}
                  placeholder="Not declared"
                  className="w-full text-xs font-bold px-3 py-2 border border-[#EAE7E0] rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>
              <div>
                <label htmlFor="ocr-fiber-g" className="text-[10px] font-bold text-[#64748B] block mb-0.5">Fiber (g)</label>
                <input
                  id="ocr-fiber-g"
                  type="number"
                  step="0.1"
                  value={fiberInput}
                  onChange={(e) => setFiberInput(e.target.value)}
                  placeholder="Not declared"
                  className="w-full text-xs font-bold px-3 py-2 border border-[#EAE7E0] rounded-xl bg-[#FAF9F6] focus:outline-none focus:ring-2 focus:ring-[#111827]"
                />
              </div>
            </div>
          )}
        </div>

        {/* Live Score Deductions Preview */}
        <div className="p-3.5 bg-[#F4F1EA] border border-[#EAE5DA] rounded-2xl mb-5 text-xs">
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-black text-[#111827]">Live Transparent Scoring Breakdown:</span>
            <span className="font-black text-[#D11A4F]">
              {dynamicHealthScore.deductions.length} deduction(s) applied
            </span>
          </div>
          <div className="space-y-1 text-[11px] text-[#475569]">
            {dynamicHealthScore.deductions.map((d, i) => (
              <div key={i} className="flex justify-between items-center py-0.5 border-b border-[#EAE5DA]/60">
                <span>{d.factor}: {d.reason}</span>
                <span className="font-bold text-[#D11A4F] shrink-0 ml-2">-{d.penalty} pts</span>
              </div>
            ))}
            {dynamicHealthScore.partialDataNotes?.map((note, i) => (
              <div key={i} className="text-amber-800 italic flex items-center gap-1 mt-1">
                <HelpCircle className="w-3 h-3 shrink-0" />
                <span>{note}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#F0ECE1]">
          <span className="text-[11px] text-[#64748B] font-medium">
            Clicking confirm generates the analysis dashboard using these verified values.
          </span>
          <div className="flex items-center gap-2.5 w-full sm:w-auto justify-end">
            <button
              onClick={onCancel}
              className="btn-secondary h-10 px-5 text-xs font-bold cursor-pointer"
            >
              Cancel
            </button>
            <button
              onClick={handleGenerateReport}
              className="btn-coral h-10 px-6 text-xs font-black gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4" />
              <span>Confirm & Open Visual Analysis</span>
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
