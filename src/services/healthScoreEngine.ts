import { HealthScoreDetails, ParsedIngredient, ScoreDeduction } from '../types/product';

export interface NutritionInput {
  sugarGrams?: number | null; // Total sugar declared
  addedSugarGrams?: number | null; // Added sugar declared if separated
  transFatGrams?: number | null;
  saturatedFatGrams?: number | null;
  sodiumMg?: number | null;
  proteinGrams?: number | null;
  fiberGrams?: number | null;
  calories?: number | null;
  servingGrams?: number;
  per100g?: {
    sugarGrams?: number | null;
    addedSugarGrams?: number | null;
    saturatedFatGrams?: number | null;
    sodiumMg?: number | null;
    calories?: number | null;
  };
  isPartialData?: boolean;
}

export function calculateHealthScore(
  nutrition: NutritionInput,
  parsedIngredients: ParsedIngredient[]
): HealthScoreDetails {
  let currentScore = 10.0;
  const deductions: ScoreDeduction[] = [];
  const positivePoints: { factor: string; bonus: number; reason: string }[] = [];
  const partialDataNotes: string[] = [];
  const assumptionsAndLimitations: string[] = [
    'Reference diet: 2,000 kcal/day for adults per ICMR-NIN & WHO dietary reference frameworks.',
    'WHO 2015 Sugar Guideline distinguishes "free sugars" (added sugars + honey/syrups/juice concentrates) from intrinsic sugars in milk (lactose) and whole fruit.',
    'WHO 2023 Sodium Guideline recommends < 2,000 mg sodium/day (< 5g salt/day) across the total daily diet.',
    'FSSAI ingredient declarations list ingredients in descending order by weight at the time of manufacture (Chapter 2, 2020 Regulations); rank is a qualitative indicator and does not specify exact percentages without QUID.',
    'Nutrient Profiling Model: Evaluates both standardized density per 100g/ml (WHO SEARO NPM) and portion load relative to daily reference intake.',
    'Food additives are evaluated by JECFA/FSSAI within Acceptable Daily Intakes (ADI). Presence indicates processed formulation or potential consumer sensitivity, not an acute poison.'
  ];
  const scientificReferences: string[] = [
    'WHO (2015). Guideline: Sugars intake for adults and children. Geneva: World Health Organization.',
    'WHO (2023). Guideline: Sodium intake for adults and children. Geneva: World Health Organization.',
    'WHO Regional Office for South-East Asia (2023). Nutrient Profile Model for SEARO.',
    'FSSAI (2020). Food Safety and Standards (Labelling and Display) Regulations, 2020. Gazette of India.',
    'JECFA / FAO-WHO (2023). Evaluations of the Joint FAO/WHO Expert Committee on Food Additives.'
  ];

  // 1. DATA COMPLETENESS AUDIT
  const isSugarDeclared = nutrition.sugarGrams !== undefined && nutrition.sugarGrams !== null;
  const isAddedSugarDeclared = nutrition.addedSugarGrams !== undefined && nutrition.addedSugarGrams !== null;
  const isSodiumDeclared = nutrition.sodiumMg !== undefined && nutrition.sodiumMg !== null;
  const isSatFatDeclared = nutrition.saturatedFatGrams !== undefined && nutrition.saturatedFatGrams !== null;
  const isTransFatDeclared = nutrition.transFatGrams !== undefined && nutrition.transFatGrams !== null;
  const isProteinDeclared = nutrition.proteinGrams !== undefined && nutrition.proteinGrams !== null;

  const servingGrams = nutrition.servingGrams || 30;
  const isLiquid = servingGrams >= 150 || parsedIngredients.some(i => /water|juice|syrup|beverage|carbonated/i.test(i.name));

  const essentialFields = [isSugarDeclared, isSodiumDeclared, isSatFatDeclared, isTransFatDeclared, isProteinDeclared];
  const declaredEssentialCount = essentialFields.filter(Boolean).length;
  const dataCompletenessPercent = Math.round((declaredEssentialCount / essentialFields.length) * 100);

  const missingFields: string[] = [];
  if (!isSugarDeclared) missingFields.push('Sugar');
  if (!isSodiumDeclared) missingFields.push('Sodium');
  if (!isSatFatDeclared) missingFields.push('Saturated Fat');
  if (!isTransFatDeclared) missingFields.push('Trans Fat');
  if (!isProteinDeclared) missingFields.push('Protein');

  const isPartial = missingFields.length > 0 || !!nutrition.isPartialData;
  const isProvisional = missingFields.includes('Sugar') || missingFields.includes('Sodium') || missingFields.includes('Saturated Fat');

  let uncertaintyRange: string | undefined = undefined;
  if (isProvisional) {
    uncertaintyRange = `±${(missingFields.length * 0.8).toFixed(1)} pts uncertainty due to undeclared ${missingFields.join(', ')}`;
    partialDataNotes.push(
      `Incomplete nutritional disclosure: ${missingFields.join(', ')} undeclared on packaging. Score is provisional and cannot be certified as clean.`
    );
  }

  // Determine per 100g values
  const sugarPerServe = isSugarDeclared ? Number(nutrition.sugarGrams) : null;
  const addedSugarPerServe = isAddedSugarDeclared ? Number(nutrition.addedSugarGrams) : null;
  const sugarPer100g = nutrition.per100g?.sugarGrams !== undefined && nutrition.per100g?.sugarGrams !== null
    ? Number(nutrition.per100g.sugarGrams)
    : (sugarPerServe !== null ? (sugarPerServe / servingGrams) * 100 : null);

  const satFatPerServe = isSatFatDeclared ? Number(nutrition.saturatedFatGrams) : null;
  const satFatPer100g = nutrition.per100g?.saturatedFatGrams !== undefined && nutrition.per100g?.saturatedFatGrams !== null
    ? Number(nutrition.per100g.saturatedFatGrams)
    : (satFatPerServe !== null ? (satFatPerServe / servingGrams) * 100 : null);

  const sodiumPerServe = isSodiumDeclared ? Number(nutrition.sodiumMg) : null;
  const sodiumPer100g = nutrition.per100g?.sodiumMg !== undefined && nutrition.per100g?.sodiumMg !== null
    ? Number(nutrition.per100g.sodiumMg)
    : (sodiumPerServe !== null ? (sodiumPerServe / servingGrams) * 100 : null);

  // 2. SUGAR ASSESSMENT (DUAL-BASIS: DENSITY PER 100G/ML + PER-SERVING LOAD)
  const hasDairyIntrinsics = parsedIngredients.some(i => 
    /milk\s*solids|skimmed\s*milk|whey|lactose|condensed\s*milk/i.test(i.name)
  );
  const hasFruitIntrinsics = parsedIngredients.some(i => 
    /fruit\s*pulp|fruit\s*juice|concentrate|mango\s*pulp|apple\s*puree/i.test(i.name)
  );
  const isOnlyTotalSugar = addedSugarPerServe === null && (hasDairyIntrinsics || hasFruitIntrinsics);

  let sugarPenalty = 0;
  if (sugarPerServe !== null && sugarPer100g !== null) {
    // A. Density per 100g (WHO SEARO NPM Standard)
    if (isLiquid) {
      if (sugarPer100g >= 10.0) sugarPenalty += 2.4;
      else if (sugarPer100g >= 5.0) sugarPenalty += 1.4;
    } else {
      if (sugarPer100g >= 25.0) sugarPenalty += 2.4;
      else if (sugarPer100g >= 12.0) sugarPenalty += 1.5;
      else if (sugarPer100g >= 6.0) sugarPenalty += 0.8;
    }

    // B. Per-serving contribution to WHO 25g/day free-sugar guidance benchmark
    const evaluatedServeSugar = addedSugarPerServe !== null ? addedSugarPerServe : (isOnlyTotalSugar ? sugarPerServe * 0.7 : sugarPerServe);
    if (evaluatedServeSugar >= 25.0) sugarPenalty += 1.6;
    else if (evaluatedServeSugar >= 12.0) sugarPenalty += 1.0;
    else if (evaluatedServeSugar >= 6.0) sugarPenalty += 0.5;

    sugarPenalty = Math.min(4.0, sugarPenalty);
    currentScore -= sugarPenalty;

    deductions.push({
      factor: isOnlyTotalSugar ? 'High Total Sugar Density' : (sugarPenalty >= 2.5 ? 'Excessive Added Sugar' : 'Moderate Sugar Content'),
      penalty: Math.round(sugarPenalty * 10) / 10,
      weight: sugarPenalty >= 2.0 ? 'High' : 'Medium',
      standard: 'WHO 2015 Guideline & SEARO NPM',
      scientificReference: 'WHO (2015). Sugars intake for adults and children; WHO SEARO NPM (2023).',
      reason: isOnlyTotalSugar
        ? `Contains ${sugarPerServe.toFixed(1)}g total sugar per serve (${sugarPer100g.toFixed(1)}g/100g). Formulation includes intrinsic lactose/fructose alongside added sweeteners.`
        : `Contains ${sugarPerServe.toFixed(1)}g sugar per serve (${sugarPer100g.toFixed(1)}g/100g), contributing ${(evaluatedServeSugar / 25 * 100).toFixed(0)}% of the adult 25g daily free-sugar reference benchmark in one portion.`
    });
  } else {
    // Sugar quantity missing from label
    const sugarIngredient = parsedIngredients.find(i => i.isAddedSugar);
    if (sugarIngredient) {
      const penalty = sugarIngredient.rank <= 3 ? 2.2 : 1.0;
      currentScore -= penalty;
      deductions.push({
        factor: `Added Sugar at Position #${sugarIngredient.rank} (Weight Undeclared)`,
        penalty,
        weight: 'High',
        standard: 'FSSAI Mandatory Descending Ingredient Order Rule',
        scientificReference: 'FSSAI Labelling Regulations (2020), Chapter 2.',
        reason: `Added sweetener (${sugarIngredient.name}) ranked #${sugarIngredient.rank} by weight at batch formulation. Gram quantity was not declared on the packaging.`
      });
      partialDataNotes.push('Sugar gram weight was not declared; evaluated qualitatively via descending ingredient list.');
    } else {
      partialDataNotes.push('Sugar quantity undeclared; no added sugars identified in primary ingredient positions.');
    }
  }

  // 3. SATURATED FAT & PALM OIL (QUALITATIVE RANKING ONLY, NEVER INFERRING EXACT PERCENTAGE)
  let fatPenalty = 0;
  if (satFatPer100g !== null) {
    if (satFatPer100g >= 8.0) fatPenalty += 1.8;
    else if (satFatPer100g >= 4.0) fatPenalty += 1.0;
  }

  const palmOilIngredient = parsedIngredients.find(i => i.isPalmOil);
  if (palmOilIngredient) {
    if (palmOilIngredient.rank <= 3) {
      fatPenalty += 1.5;
      deductions.push({
        factor: 'Palm Oil in Top 3 Ingredients',
        penalty: 1.5,
        weight: 'High',
        standard: 'FSSAI Ingredient List Order Rule',
        scientificReference: 'FSSAI Labelling Regulations (2020), Chapter 2.',
        reason: `Palm oil / palmolein is listed at rank #${palmOilIngredient.rank} by weight at manufacture. Palm oil comprises approx 45–50% saturated palmitic acid. Exact percentage is undeclared without QUID.`
      });
    } else {
      fatPenalty += 0.8;
      deductions.push({
        factor: 'Contains Refined Palm Oil',
        penalty: 0.8,
        weight: 'Medium',
        standard: 'Dietary Fatty Acid Composition',
        reason: `Refined palm oil listed at position #${palmOilIngredient.rank} in descending ingredient order. Secondary fat source; exact percentage undeclared.`
      });
    }
  }

  fatPenalty = Math.min(3.0, fatPenalty);
  currentScore -= fatPenalty;

  // 4. TRANS FAT / PARTIALLY HYDROGENATED OILS
  const transFat = nutrition.transFatGrams || 0;
  const hasTransFat = transFat > 0.05 || parsedIngredients.some(i => i.isTransFat);
  if (hasTransFat) {
    const penalty = 2.2;
    currentScore -= penalty;
    deductions.push({
      factor: 'Industrial Trans Fat / Hydrogenated Oil',
      penalty,
      weight: 'High',
      standard: 'WHO REPLACE Global Action Framework & FSSAI 2% Trans Fat Ceiling',
      scientificReference: 'WHO (2018). REPLACE trans fat action package.',
      reason: 'Contains partially hydrogenated oils or detectable industrial trans fats (> 0.05g/serve). Associated with elevated atherogenic LDL and coronary risk.'
    });
  }

  // 5. SODIUM (TREATING MISSING AS UNKNOWN, NOT ZERO)
  let sodiumPenalty = 0;
  if (sodiumPer100g !== null || sodiumPerServe !== null) {
    const s100 = sodiumPer100g || 0;
    const sServe = sodiumPerServe || 0;

    if (s100 >= 800 || sServe >= 600) {
      sodiumPenalty = 2.2;
    } else if (s100 >= 400 || sServe >= 300) {
      sodiumPenalty = 1.2;
    } else if (s100 >= 200 || sServe >= 150) {
      sodiumPenalty = 0.6;
    }

    if (sodiumPenalty > 0) {
      currentScore -= sodiumPenalty;
      deductions.push({
        factor: sodiumPenalty >= 2.0 ? 'High Sodium Content' : 'Elevated Sodium',
        penalty: sodiumPenalty,
        weight: sodiumPenalty >= 2.0 ? 'High' : 'Medium',
        standard: 'WHO 2,000 mg/day Sodium Guideline',
        scientificReference: 'WHO (2023). Guideline: Sodium intake for adults and children.',
        reason: `Supplies ${sServe}mg sodium per serving (${s100.toFixed(0)}mg/100g), contributing ${(sServe / 2000 * 100).toFixed(0)}% of the WHO 2,000 mg/day adult reference benchmark.`
      });
    }
  } else {
    // Sodium is missing: do NOT treat as zero consumption!
    const isSavoryFood = parsedIngredients.some(i => /salt|iodised\s*salt|kala\s*namak|rock\s*salt|spices|masala/i.test(i.name));
    if (isSavoryFood) {
      const penalty = 0.8;
      currentScore -= penalty;
      deductions.push({
        factor: 'Sodium Undeclared (Savory Formulation)',
        penalty,
        weight: 'Medium',
        standard: 'Data Transparency Guard',
        reason: 'Salt is present in the ingredients, but the manufacturer omitted quantitative sodium milligrams on the label. Provisional adjustment applied.'
      });
      partialDataNotes.push('Sodium quantity was omitted from the nutritional table by the brand. Evaluated as unverified.');
    } else {
      partialDataNotes.push('Sodium declaration was absent from packaging; low-sodium status cannot be certified.');
    }
  }

  // 6. FOOD ADDITIVES & CAFFEINE
  const syntheticColors = parsedIngredients.filter(i => i.isAdditive && /color|dye|tartrazine|sunset\s*yellow|allura|caramel\s*class\s*iv|ins\s*150d|e102|e110|e129/i.test(i.name));
  const syntheticAntioxidants = parsedIngredients.filter(i => i.isAdditive && /tbhq|bha|ins\s*319|ins\s*320/i.test(i.name));
  const artificialSweeteners = parsedIngredients.filter(i => i.isAdditive && /aspartame|acesulfame|sucralose|e951|e950|e955/i.test(i.name));
  const hasCaffeine = parsedIngredients.some(i => /caffeine/i.test(i.name));

  let additivePenalty = 0;
  if (syntheticColors.length > 0) {
    additivePenalty += Math.min(0.8, syntheticColors.length * 0.4);
    deductions.push({
      factor: 'Synthetic Colors (Regulatory Caution)',
      penalty: Math.min(0.8, syntheticColors.length * 0.4),
      weight: 'Medium',
      standard: 'EU Regulation (EC) No 1333/2008 & FSSAI Standards',
      reason: `Contains synthetic colors (${syntheticColors.map(c => c.eNumber || c.name).join(', ')}). Subject to mandatory EU advisory warnings for childhood attention or strict limits on trace byproducts.`
    });
  }

  if (syntheticAntioxidants.length > 0) {
    additivePenalty += 0.4;
    deductions.push({
      factor: 'Synthetic Lipid Antioxidants (TBHQ / BHA)',
      penalty: 0.4,
      weight: 'Low',
      standard: 'JECFA Acceptable Daily Intake (ADI)',
      reason: `Contains synthetic antioxidant(s) (${syntheticAntioxidants.map(a => a.eNumber || a.name).join(', ')}) formulated to retard lipid peroxidation in commercial frying fats.`
    });
  }

  if (artificialSweeteners.length > 0) {
    additivePenalty += 0.5;
    deductions.push({
      factor: 'Non-Nutritive Intense Sweeteners',
      penalty: 0.5,
      weight: 'Low',
      standard: 'JECFA 2023 Safety Evaluation',
      reason: `Contains artificial intense sweetener(s) (${artificialSweeteners.map(s => s.eNumber || s.name).join(', ')}). Permitted within safe daily allowances; contraindicated for PKU patients if aspartame is present.`
    });
  }

  if (hasCaffeine && isLiquid) {
    additivePenalty += 0.8;
    deductions.push({
      factor: 'Added Stimulant (Caffeine)',
      penalty: 0.8,
      weight: 'Medium',
      standard: 'FSSAI Caffeinated Beverage Standard',
      reason: 'Contains added synthetic/isolated caffeine. Caution recommended for children, pregnant women, and caffeine-sensitive individuals.'
    });
  }

  currentScore -= Math.min(1.8, additivePenalty);

  // 7. POSITIVE NUTRITIONAL OFFSETS (WHOLE FOOD DENSITY)
  const fiber = Number(nutrition.fiberGrams) || 0;
  const protein = Number(nutrition.proteinGrams) || 0;

  if (fiber >= 3.0) {
    const bonus = 0.5;
    currentScore += bonus;
    positivePoints.push({
      factor: 'Dietary Fiber Source',
      bonus,
      reason: `Provides ${fiber.toFixed(1)}g dietary fiber per portion, contributing towards the 25–30g daily fiber recommendation and moderating postprandial glucose absorption.`
    });
  }

  const isLowSugar = (sugarPerServe !== null && sugarPerServe <= 6) || (addedSugarPerServe !== null && addedSugarPerServe <= 3);
  if (protein >= 5.0 && isLowSugar) {
    const bonus = 0.5;
    currentScore += bonus;
    positivePoints.push({
      factor: 'Wholesome Protein Balance',
      bonus,
      reason: `Provides ${protein.toFixed(1)}g protein without excessive sugar coating or unwholesome bulking agents.`
    });
  }

  // 8. SCORE CLAMPING & VERDICT ASSIGNMENT
  let finalScore = Math.max(0.5, Math.min(10.0, Math.round(currentScore * 10) / 10));
  if (isProvisional && finalScore > 6.5) {
    finalScore = 6.5;
    partialDataNotes.push('Score capped at 6.5 provisional maximum due to missing essential nutrient declarations.');
  }

  let verdict: 'High Concern' | 'Moderate Concern' | 'Good Choice' = 'Moderate Concern';
  let color: 'pink' | 'yellow' | 'mint' = 'yellow';

  if (finalScore < 4.0) {
    verdict = 'High Concern';
    color = 'pink';
  } else if (finalScore >= 7.0) {
    verdict = 'Good Choice';
    color = 'mint';
  }

  const summary = verdict === 'High Concern'
    ? 'High concern: Substantial added sugar, heavy palm oil ranking, or high sodium content relative to dietary guidelines. Frequent daily consumption not recommended.'
    : verdict === 'Moderate Concern'
    ? (isProvisional
        ? 'Provisional score: Moderate concern based on available declarations. Certain essential nutrient disclosures are missing from the packaging.'
        : 'Moderate concern: Contains processed additives, refined fats, or moderate sugar. Consume mindfully as part of a balanced diet.')
    : 'Clean choice: Balanced nutritional profile with low added sugar, absence of trans fats, and transparent whole-food ingredients.';

  const disclaimer = 'PackSach Health Score is an independent informational reference tool based on published WHO guidelines and FSSAI labelling rules. It is not an official medical endorsement or FSSAI regulatory rating.';

  return {
    score: finalScore,
    verdict,
    color,
    deductions,
    positivePoints,
    summary,
    isPartialData: isPartial,
    isProvisional,
    dataCompletenessPercent,
    uncertaintyRange,
    partialDataNotes,
    disclaimer,
    scientificReferences,
    assumptionsAndLimitations
  };
}
