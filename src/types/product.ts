export type HealthCategory = 'malt-drinks' | 'biscuits' | 'cereals' | 'noodles-snacks' | 'chips' | 'chocolates' | 'juices-beverages' | 'spreads-sauces';

export type NutrientDeclarationStatus =
  | 'declared'               // Explicitly declared on packaging with clear numeric value
  | 'not_declared'           // Packaging is visible, but manufacturer omitted the nutrient field
  | 'not_detected_by_ocr'    // OCR completed, but failed to locate this specific nutrient
  | 'unreadable'             // Label text in this region is blurred, degraded, or low confidence
  | 'user_corrected';        // Manually verified or entered by the user

export interface ParsedIngredient {
  name: string;
  originalText: string;
  isPalmOil: boolean;
  isAddedSugar: boolean;
  isTransFat: boolean;
  isAdditive: boolean;
  eNumber?: string;
  riskLevel: 'safe' | 'moderate' | 'high';
  explanation?: string;
  regulatoryStatus?: string;   // e.g. "FSSAI Permitted / US FDA GRAS / Codex Alimentarius"
  functionalClass?: string;    // e.g. "Flavor Enhancer", "Synthetic Food Color", "Antioxidant"
  scientificEvidence?: string; // Nuanced toxicological context (JECFA / EFSA / WHO)
  rank: number;
}

export interface ScoreDeduction {
  factor: string;
  penalty: number;
  reason: string;
  weight: 'High' | 'Medium' | 'Low';
  standard: string;
  scientificReference?: string;
}

export interface HealthScoreDetails {
  score: number; // 0 to 10
  verdict: 'High Concern' | 'Moderate Concern' | 'Good Choice';
  color: 'pink' | 'yellow' | 'mint';
  deductions: ScoreDeduction[];
  positivePoints: { factor: string; bonus: number; reason: string }[];
  summary: string;
  isPartialData?: boolean;
  isProvisional?: boolean;
  dataCompletenessPercent?: number; // 0 to 100%
  uncertaintyRange?: string; // e.g. "±1.5 pts due to undeclared sodium & saturated fat"
  partialDataNotes?: string[];
  disclaimer: string;
  scientificReferences?: string[];
  assumptionsAndLimitations?: string[];
}

export interface SmartSwap {
  id: string;
  name: string;
  brand: string;
  price: number;
  sugarTeaspoons: number;
  healthScore: number;
  caloriesPerServe: number;
  image?: string;
  whyBetter: string;
  evidenceBasis: string;
  servingComparisonText: string;
  priceComparisonText: string;
  availability: string; // e.g., "Available on Blinkit / Zepto / Local kirana"
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: HealthCategory;
  categoryLabel: string;
  price: number; // in INR
  image: string;
  frontClaim: string; // "100% HEALTHY", "Real Fruit Power", etc.
  servingSize: string; // e.g. "30g" or "1 pack (70g)"
  servingGrams: number;
  
  // Back label ingredients
  ingredientsText: string;
  parsedIngredients: ParsedIngredient[];
  
  // Nutrition facts per serving
  nutritionPerServe: {
    calories: number;
    caloriesDeclared?: boolean;
    caloriesStatus?: NutrientDeclarationStatus;
    sugarGrams: number;
    sugarDeclared?: boolean;
    sugarStatus?: NutrientDeclarationStatus;
    addedSugarGrams?: number | null;
    addedSugarDeclared?: boolean;
    addedSugarStatus?: NutrientDeclarationStatus;
    sugarTeaspoons: number; // sugarGrams / 4
    totalFatGrams: number;
    totalFatDeclared?: boolean;
    totalFatStatus?: NutrientDeclarationStatus;
    saturatedFatGrams: number;
    saturatedFatDeclared?: boolean;
    saturatedFatStatus?: NutrientDeclarationStatus;
    transFatGrams: number;
    transFatDeclared?: boolean;
    transFatStatus?: NutrientDeclarationStatus;
    sodiumMg: number;
    sodiumDeclared?: boolean;
    sodiumStatus?: NutrientDeclarationStatus;
    sodiumDailyPercent: number; // based on 2000mg WHO limit
    proteinGrams: number;
    proteinDeclared?: boolean;
    proteinStatus?: NutrientDeclarationStatus;
    fiberGrams: number;
    fiberDeclared?: boolean;
    fiberStatus?: NutrientDeclarationStatus;
  };

  // Nutrition per 100g
  nutritionPer100g: {
    calories: number;
    sugarGrams: number;
    addedSugarGrams?: number | null;
    totalFatGrams: number;
    saturatedFatGrams: number;
    sodiumMg: number;
  };

  // Palm oil detection
  palmOil: {
    present: boolean;
    rank: number | null; // 1-based order in ingredient list
    warningText: string;
    isExactPercentageDeclared?: boolean;
  };

  // Health score out of 10
  healthScore: HealthScoreDetails;

  // Punchy visual shock callout
  shockStatement: string;
  hindiCallout: string;

  // Actionable swaps
  swaps: SmartSwap[];

  // Source & verification
  dataSource: 'PackSach Verified Database' | 'Open Food Facts' | 'OCR User Extracted' | 'User Scanned (Verified OCR)' | 'User Scanned (Partial Label)';
  barcode?: string;
  dataProvenance?: 'verified_catalog' | 'open_food_facts' | 'ocr_user_verified' | 'ocr_partial_label';
  dataProvenanceNotes?: string;
  isPartialNutrition?: boolean;
  missingNutrients?: string[];
}

export interface ScanResult {
  rawText: string;
  cleanedText: string;
  confidence: number;
  detectedIngredients: string[];
  derivedProduct?: Product;
}
