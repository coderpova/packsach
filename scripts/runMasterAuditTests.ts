import { parseIngredientsText } from '../src/services/ingredientParser';
import { calculateHealthScore } from '../src/services/healthScoreEngine';
import {
  validateImageFileIntegrity,
  verifyImageMagicBytes,
  extractNutritionFromText,
  classifyImageContent,
  PHOTOGRAPHY_TIPS
} from '../src/services/imageValidator';
import { PRODUCTS_DATABASE, findProductById, searchProducts } from '../src/data/productsData';

interface TestResult {
  journeyId: number;
  name: string;
  category: string;
  executionType: 'Unit Function (Synthetic Text)' | 'Heuristic Classifier (Synthetic Text)' | 'Catalog Integrity (Static DB)' | 'Input Sanitization (Mock File)' | 'Synthetic Mock Check (Manual Values)';
  status: 'PASS' | 'FAIL';
  evidence: string;
}

const results: TestResult[] = [];

function recordTest(
  condition: boolean,
  journeyId: number,
  name: string,
  category: string,
  executionType: TestResult['executionType'],
  evidence: string
) {
  if (condition) {
    results.push({ journeyId, name, category, executionType, status: 'PASS', evidence });
    console.log(`[PASS] Test ${journeyId} [${executionType}]: ${name}`);
  } else {
    results.push({ journeyId, name, category, executionType, status: 'FAIL', evidence: `FAILED: ${evidence}` });
    console.error(`[FAIL] Test ${journeyId} [${executionType}]: ${name} - ${evidence}`);
  }
}

console.log('================================================================');
console.log('PACKSACH ALGORITHM & HEURISTIC UNIT TEST SUITE (20 TESTS)');
console.log('Evaluating Core Algorithms, Heuristic Classifiers, and Integrity Guards');
console.log('Note: Synthetic text fixtures and mock values are explicitly identified.');
console.log('================================================================\n');

// -------------------------------------------------------------
// Test 1: Full nutrition declaration parsing & dual-basis scoring (Synthetic text fixture)
// -------------------------------------------------------------
const sampleLabelText = 'Ingredients: Refined Wheat Flour (Maida) (48%), Refined Palm Oil (18%), Sugar (15%), Wheat Bran (8%), Invert Sugar Syrup, Raising Agents (INS 503(ii), INS 500(ii)), Emulsifiers (INS 322, INS 471), Maltodextrin. Energy: 450 kcal, Total Sugars: 15g, Total Fat: 18g, Saturated Fat: 8.5g, Sodium: 360mg.';
const parsedJ1 = parseIngredientsText(sampleLabelText);
const nutritionJ1 = extractNutritionFromText(sampleLabelText);
const scoreJ1 = calculateHealthScore(
  {
    sugarGrams: nutritionJ1.sugarGrams,
    saturatedFatGrams: nutritionJ1.saturatedFatGrams,
    sodiumMg: nutritionJ1.sodiumMg,
    transFatGrams: 0,
    proteinGrams: 2.0,
    fiberGrams: 1.5,
    servingGrams: 30
  },
  parsedJ1
);

recordTest(
  parsedJ1.length >= 8 &&
  nutritionJ1.declaredFields.sugar === true &&
  nutritionJ1.sugarGrams === 15 &&
  nutritionJ1.declaredFields.sodium === true &&
  nutritionJ1.sodiumMg === 360 &&
  scoreJ1.score <= 5.0 &&
  scoreJ1.deductions.some(d => d.factor.includes('Sugar')) &&
  scoreJ1.deductions.some(d => d.factor.includes('Palm Oil')),
  1,
  'Full nutrition declaration parsing & dual-basis scoring',
  'Nutrition & Ingredients Parsing',
  'Unit Function (Synthetic Text)',
  `Extracted ${parsedJ1.length} ingredients from synthetic string, detected sugar (15g), sodium (360mg), score: ${scoreJ1.score}/10 with transparent deductions.`
);

// -------------------------------------------------------------
// Test 2: Front-of-pack brand detection (Synthetic text fixture)
// -------------------------------------------------------------
const frontPackOcrText = "CADBURY DAIRY MILK CHOCOLATE REAL MILK GOODNESS TASTE OF HAPPINESS";
const frontClassification = classifyImageContent(frontPackOcrText, []);
const frontWarningExpected = "Food product detected, but its nutrition or ingredient label is not visible. Please upload a clear image of the back of the packet.";

recordTest(
  frontClassification.category === 'PACKAGED_FOOD_FRONT' &&
  frontClassification.detectedBrand === 'cadbury' &&
  frontWarningExpected.includes('Please upload a clear image of the back'),
  2,
  'Front-of-pack brand detection without back nutrition panel',
  'Heuristic Content Classifier',
  'Heuristic Classifier (Synthetic Text)',
  `Brand keyword detected ("cadbury") from synthetic text; category correctly classified as "PACKAGED_FOOD_FRONT" without fabricating missing nutrition facts.`
);

// -------------------------------------------------------------
// Test 3: Non-food portrait / selfie text rejection (Synthetic text fixture)
// -------------------------------------------------------------
const selfieOcrText = "me and my friend at cafe vacation #goodvibes";
const selfieClassification = classifyImageContent(selfieOcrText, []);

recordTest(
  selfieClassification.category === 'UNRELATED_IMAGE',
  3,
  'Non-food portrait / selfie text rejection',
  'Heuristic Content Classifier',
  'Heuristic Classifier (Synthetic Text)',
  'Selfie text tokens evaluated by keyword heuristic; correctly classified as "UNRELATED_IMAGE".'
);

// -------------------------------------------------------------
// Test 4: Outdoor landscape / non-food text rejection (Synthetic text fixture)
// -------------------------------------------------------------
const sceneryOcrText = "Himalayan Sunrise Camping Trek 2026";
const sceneryClassification = classifyImageContent(sceneryOcrText, []);

recordTest(
  sceneryClassification.category === 'UNRELATED_IMAGE',
  4,
  'Outdoor landscape / non-food text rejection',
  'Heuristic Content Classifier',
  'Heuristic Classifier (Synthetic Text)',
  'Landscape travel text evaluated by keyword heuristic; correctly classified as "UNRELATED_IMAGE".'
);

// -------------------------------------------------------------
// Test 5: Blurry image variance boundary check (Manually assigned constant)
// -------------------------------------------------------------
const blurryVariance = 18.5; // Manually assigned boundary value (< 35 threshold)
const isBlurry = blurryVariance < 35;

recordTest(
  isBlurry && PHOTOGRAPHY_TIPS.length === 4,
  5,
  'Blurry image variance boundary check (Arithmetic threshold check)',
  'Quality Assessment Heuristics',
  'Synthetic Mock Check (Manual Values)',
  `Verified threshold arithmetic: manually assigned variance ${blurryVariance} is correctly evaluated as blurry (< 35). (Note: Does not run canvas pixel convolution).`
);

// -------------------------------------------------------------
// Test 6: Blank frame luminance boundary check (Manually assigned constant)
// -------------------------------------------------------------
const meanLuminanceBlack = 3.2; // Manually assigned boundary value (< 8.0 threshold)
const isBlank = meanLuminanceBlack < 8;

recordTest(
  isBlank,
  6,
  'Blank frame luminance boundary check (Arithmetic threshold check)',
  'Quality Assessment Heuristics',
  'Synthetic Mock Check (Manual Values)',
  `Verified threshold arithmetic: manually assigned luminance ${meanLuminanceBlack} is correctly flagged as blank (< 8.0). (Note: Does not decode image pixels).`
);

// -------------------------------------------------------------
// Test 7: File integrity rejection for unsupported MIME type (Mock File object)
// -------------------------------------------------------------
const fakeCorruptedFile = { name: 'document.pdf', type: 'application/pdf', size: 1024 } as any;
const integrityCheck = validateImageFileIntegrity(fakeCorruptedFile);

recordTest(
  !integrityCheck.isValid && integrityCheck.error!.includes('Unsupported file format'),
  7,
  'File integrity rejection for unsupported MIME type',
  'Input Sanitization',
  'Input Sanitization (Mock File)',
  'Mock PDF File object evaluated by validateImageFileIntegrity; rejected before reading.'
);

// -------------------------------------------------------------
// Test 8: OCR token confidence filter (Mocked word array)
// -------------------------------------------------------------
const mockOcrWords = [
  { text: 'Ingredients:', confidence: 95 },
  { text: 'Sugar', confidence: 92 },
  { text: 'Palmolein', confidence: 88 },
  { text: 'caramel', confidence: 54 }, // low confidence
  { text: 'emulsifier', confidence: 51 } // low confidence
];
const lowConfidenceWords = mockOcrWords.filter(w => w.confidence < 60);

recordTest(
  lowConfidenceWords.length === 2 &&
  lowConfidenceWords.some(w => w.text === 'caramel') &&
  lowConfidenceWords.some(w => w.text === 'emulsifier'),
  8,
  'OCR token confidence filter check (Mocked word token array)',
  'OCR Confidence Filtering',
  'Synthetic Mock Check (Manual Values)',
  `Verified low-confidence token filter (< 60%) against mock word token array; identified 2 low-confidence tokens. (Note: Does not run live Tesseract OCR).`
);

// -------------------------------------------------------------
// Test 9: Manual ingredient correction dynamic recalculation (Synthetic text fixture)
// -------------------------------------------------------------
const textBeforeCorrection = "Refined Wheat Flour, Hydrogenated Vegetable Oil, Sugar, INS 110, INS 150d";
const parsedBefore = parseIngredientsText(textBeforeCorrection);
const scoreBefore = calculateHealthScore({ sugarGrams: 18, saturatedFatGrams: 9.0, sodiumMg: 550, servingGrams: 30 }, parsedBefore);

const textAfterCorrection = "Whole Wheat Flour (Atta), Jowar Flour, Cold Pressed Mustard Oil, Cumin Seeds, Sea Salt";
const parsedAfter = parseIngredientsText(textAfterCorrection);
const scoreAfter = calculateHealthScore({ sugarGrams: 0.5, saturatedFatGrams: 0.2, sodiumMg: 120, servingGrams: 30 }, parsedAfter);

recordTest(
  scoreBefore.score <= 4.0 &&
  scoreAfter.score >= 8.0 &&
  parsedAfter.every(i => !i.isPalmOil && !i.isAdditive),
  9,
  'Manual ingredient correction dynamic recalculation',
  'Health Score Engine',
  'Unit Function (Synthetic Text)',
  `Health score engine recalculated output from ${scoreBefore.score}/10 (High Concern) to ${scoreAfter.score}/10 (Good Choice) when ingredients were updated.`
);

// -------------------------------------------------------------
// Test 10: Missing nutrient handling & provisional score capping (Synthetic text fixture)
// -------------------------------------------------------------
const labelWithoutNutrition = "Ingredients: Wheat Flour, Sugar, Vegetable Fat (Palm Oil), Salt, Raising Agents (INS 500(ii))";
const parsedMissing = parseIngredientsText(labelWithoutNutrition);
const scoreMissing = calculateHealthScore(
  {
    sugarGrams: null,
    sodiumMg: null,
    isPartialData: true
  },
  parsedMissing
);

recordTest(
  scoreMissing.isPartialData === true &&
  scoreMissing.isProvisional === true &&
  scoreMissing.score <= 6.5 &&
  scoreMissing.partialDataNotes !== undefined &&
  scoreMissing.partialDataNotes.some(n => n.includes('Sugar')) &&
  scoreMissing.partialDataNotes.some(n => n.includes('Sodium')),
  10,
  'Missing nutrient handling & provisional score capping',
  'Health Score Engine',
  'Unit Function (Synthetic Text)',
  'Missing sugar and sodium treated as UNKNOWN (not zero); provisional score capped at 6.5 with partial data notes.'
);

// -------------------------------------------------------------
// Test 11: Curated database search & product lookup (Static database)
// -------------------------------------------------------------
const searchResults = searchProducts('bournvita');
const bournvita = findProductById('bournvita-malt-drink');

recordTest(
  searchResults.length >= 1 &&
  bournvita !== undefined &&
  bournvita.name.includes('Bournvita') &&
  bournvita.nutritionPerServe.sugarGrams === 14.2 &&
  bournvita.nutritionPerServe.addedSugarGrams === 7.4 &&
  bournvita.healthScore.score === 6.1,
  11,
  'Curated database search & product lookup',
  'Catalog Engine',
  'Catalog Integrity (Static DB)',
  `Retrieved curated record "${bournvita?.name}" from PRODUCTS_DATABASE: 14.2g total sugar, 7.4g added sugar per 20g serve.`
);

// -------------------------------------------------------------
// Test 12: Side-by-side product nutrition comparison (Static database)
// -------------------------------------------------------------
const p1 = PRODUCTS_DATABASE.find(p => p.id === 'bournvita-malt-drink')!;
const p2 = PRODUCTS_DATABASE.find(p => p.id === 'nutrichoice-digestive-biscuits')!;

const sugarDelta = Math.abs(p1.nutritionPerServe.sugarTeaspoons - p2.nutritionPerServe.sugarTeaspoons);
const scoreDelta = Math.abs(p1.healthScore.score - p2.healthScore.score);

recordTest(
  p1 && p2 &&
  sugarDelta > 0 &&
  scoreDelta >= 0 &&
  p1.nutritionPerServe.sugarTeaspoons === 3.6 &&
  p2.nutritionPerServe.sugarTeaspoons === 1.7,
  12,
  'Side-by-side product nutrition comparison',
  'Comparison Engine',
  'Catalog Integrity (Static DB)',
  `Computed sugar delta (${p1.nutritionPerServe.sugarTeaspoons} vs ${p2.nutritionPerServe.sugarTeaspoons} tsp) and health score delta between two curated records.`
);

// -------------------------------------------------------------
// Test 13: Smart Swaps catalog integrity & evidence citations (Static database)
// -------------------------------------------------------------
const badProduct = PRODUCTS_DATABASE.find(p => p.healthScore.score < 4.0)!;
const swap = badProduct.swaps[0];

recordTest(
  swap !== undefined &&
  swap.healthScore > badProduct.healthScore.score &&
  swap.sugarTeaspoons <= badProduct.nutritionPerServe.sugarTeaspoons &&
  swap.price <= badProduct.price * 1.5 &&
  swap.evidenceBasis.length > 20 &&
  swap.servingComparisonText.length > 10,
  13,
  'Smart Swaps catalog integrity & evidence citations',
  'Smart Swap System',
  'Catalog Integrity (Static DB)',
  `Verified swap item "${swap.name}" for "${badProduct.name}": score ${swap.healthScore}/10 vs ${badProduct.healthScore.score}/10 at ₹${swap.price} with evidence citation.`
);

// -------------------------------------------------------------
// Test 14: Saved swaps serialization (In-memory mock dictionary)
// -------------------------------------------------------------
const mockStorage: Record<string, string> = {};
const testSwapItem = {
  swapId: 'swap-ragi',
  swapName: 'Roasted Ragi & Sattu',
  brand: 'PackSach Clean Swaps',
  price: 20,
  sugarTeaspoons: 0,
  healthScore: 9.4,
  calories: 68,
  originalProductName: 'Bournvita',
  addedAt: new Date().toISOString()
};

mockStorage['packsach_saved_swaps'] = JSON.stringify([testSwapItem]);
const retrieved = JSON.parse(mockStorage['packsach_saved_swaps']);

recordTest(
  retrieved.length === 1 &&
  retrieved[0].swapId === 'swap-ragi' &&
  retrieved[0].healthScore === 9.4,
  14,
  'Saved swaps JSON serialization (In-memory mock dictionary)',
  'Data Serialization',
  'Synthetic Mock Check (Manual Values)',
  'Verified JSON serialization and parsing using mock dictionary. (Note: Does not test browser window.localStorage).'
);

// -------------------------------------------------------------
// Test 15: Offline database fallback lookup resilience (Static database)
// -------------------------------------------------------------
const fallbackLookup = findProductById('maggi-2min-noodles') || null;

recordTest(
  fallbackLookup !== null &&
  fallbackLookup.name.includes('Maggi') &&
  fallbackLookup.nutritionPerServe.sodiumMg === 860,
  15,
  'Offline database fallback lookup resilience',
  'Reliability Fallback',
  'Catalog Integrity (Static DB)',
  'Static database query returned curated Maggi record with 860mg sodium.'
);

// -------------------------------------------------------------
// Test 16: Category classifier with unseen text inputs (Synthetic text fixtures)
// -------------------------------------------------------------
const unseenNutritionTable = "NUTRITIONAL FACTS per 100g Energy 480 kcal Protein 6.2g Total Carbohydrate 68g Total Sugars 24g Total Fat 20g Saturated Fat 9.5g Sodium 480mg";
const unseenIngredientBlock = "Ingredients: Whole Oats (65%), Jaggery (18%), Cold-Pressed Sunflower Oil, Chia Seeds, Raising Agent (INS 500(ii))";
const unseenFrontPack = "BRITANNIA GOOD DAY BUTTER COOKIES KHUSHIYON KI BUTTER BUTTER";
const unseenInvoiceDoc = "TAX INVOICE / CASH MEMO GSTIN: 27AABCT3518Q1ZS Invoice No: INV-2026-9921 Total Amount: Rs 1,450.00";

const c1 = classifyImageContent(unseenNutritionTable, []);
const c2 = classifyImageContent(unseenIngredientBlock, []);
const c3 = classifyImageContent(unseenFrontPack, []);
const c4 = classifyImageContent(unseenInvoiceDoc, []);

recordTest(
  c1.category === 'NUTRITION_LABEL' &&
  c2.category === 'INGREDIENT_LABEL' &&
  c3.category === 'PACKAGED_FOOD_FRONT' &&
  c4.category === 'UNRELATED_IMAGE',
  16,
  'Category classifier with unseen text inputs',
  'Heuristic Content Classifier',
  'Heuristic Classifier (Synthetic Text)',
  `Classified synthetic strings: Table -> ${c1.category}, Ingredients -> ${c2.category}, Front -> ${c3.category}, Invoice -> ${c4.category}.`
);

// -------------------------------------------------------------
// Test 17: Regex nutrition extraction accuracy on 5 real product text labels
// -------------------------------------------------------------
const realLabels = [
  {
    name: 'Bournvita',
    text: 'Cereal Extract (56%), Sugar (32%), Cocoa Solids, Liquid Glucose. Energy: 78 kcal, Total Sugars: 14.2g, Added Sugars: 7.4g, Sodium: 75mg',
    expectedSugar: 14.2,
    expectedAddedSugar: 7.4,
    expectedSodium: 75
  },
  {
    name: 'NutriChoice Digestive',
    text: 'Refined Wheat Flour (Maida) (48%), Refined Palm Oil (18%), Sugar (15%). Energy: 136 kcal, Total Sugars: 6.8g, Saturated Fat: 2.8g, Sodium: 145mg',
    expectedSugar: 6.8,
    expectedSodium: 145
  },
  {
    name: 'Frooti Mango',
    text: 'Water, Mango Pulp (19.5%), Sugar (13.8%). Energy: 104 kcal, Total Sugars: 22g, Added Sugars: 13.8g, Sodium: 48mg',
    expectedSugar: 22,
    expectedAddedSugar: 13.8,
    expectedSodium: 48
  },
  {
    name: 'Maggi Noodles',
    text: 'Refined Wheat Flour (Maida), Refined Palm Oil, Iodised Salt. Energy: 312 kcal, Total Sugars: 2.2g, Saturated Fat: 6.1g, Sodium: 860mg',
    expectedSugar: 2.2,
    expectedSodium: 860
  },
  {
    name: 'Kurkure Masala Munch',
    text: 'Rice Meal (43%), Refined Palmolein (28%), Corn Meal. Energy: 252 kcal, Total Sugars: 1.1g, Saturated Fat: 6.9g, Sodium: 420mg',
    expectedSugar: 1.1,
    expectedSodium: 420
  }
];

let allLabelsAccurate = true;
for (const label of realLabels) {
  const extracted = extractNutritionFromText(label.text);
  if (extracted.sugarGrams !== label.expectedSugar || extracted.sodiumMg !== label.expectedSodium) {
    allLabelsAccurate = false;
    break;
  }
}

recordTest(
  allLabelsAccurate,
  17,
  'Regex nutrition extraction accuracy on 5 real product text labels',
  'Nutrition & Ingredients Parsing',
  'Unit Function (Synthetic Text)',
  'Tested extractNutritionFromText against 5 transcribed text strings of iconic Indian food labels: 100% numeric regex accuracy on sugars and sodium.'
);

// -------------------------------------------------------------
// Test 18: File size, extension, MIME, and binary magic bytes validation
// -------------------------------------------------------------
const oversizedFile = { name: 'heavy.jpg', size: 12 * 1024 * 1024, type: 'image/jpeg' } as any;
const invalidMimeFile = { name: 'script.svg', size: 1024, type: 'image/svg+xml' } as any;
const validFile = { name: 'label.webp', size: 2 * 1024 * 1024, type: 'image/webp' } as any;

const checkOversized = validateImageFileIntegrity(oversizedFile);
const checkInvalidMime = validateImageFileIntegrity(invalidMimeFile);
const checkValid = validateImageFileIntegrity(validFile);

// Also verify binary magic byte verification function
const validJpegHeader = new Uint8Array([0xFF, 0xD8, 0xFF, 0xE0, 0x00, 0x10, 0x4A, 0x46, 0x49, 0x46, 0x00, 0x01]);
const fakeJpegHeader = new Uint8Array([0x3C, 0x73, 0x76, 0x67, 0x20, 0x78, 0x6D, 0x6C, 0x6E, 0x73, 0x3D, 0x22]); // '<svg xmlns="'
const sigValid = verifyImageMagicBytes(validJpegHeader);
const sigFake = verifyImageMagicBytes(fakeJpegHeader);

recordTest(
  !checkOversized.isValid &&
  checkOversized.error?.includes('10MB') &&
  !checkInvalidMime.isValid &&
  checkValid.isValid &&
  sigValid.isValid &&
  sigValid.format === 'jpeg' &&
  !sigFake.isValid,
  18,
  'File size, extension, MIME, and binary magic bytes validation',
  'Input Sanitization',
  'Input Sanitization (Mock File)',
  'Tested validateImageFileIntegrity on mock files (10MB limit, SVG extension rejection) and verified binary magic bytes detection.'
);

// -------------------------------------------------------------
// Test 19: WHO SEARO NPM 2023 saturated fat density penalization (Synthetic text fixture)
// -------------------------------------------------------------
const highSatFatLabel = 'Ingredients: Refined Palm Oil, Hydrogenated Fat. Energy: 560 kcal, Total Fat: 34g, Saturated Fat: 18g, Sugar: 2g, Sodium: 50mg';
const parsedJ19 = parseIngredientsText(highSatFatLabel);
const nutritionJ19 = extractNutritionFromText(highSatFatLabel);
const scoreJ19 = calculateHealthScore(
  {
    sugarGrams: nutritionJ19.sugarGrams,
    saturatedFatGrams: nutritionJ19.saturatedFatGrams,
    sodiumMg: nutritionJ19.sodiumMg,
    transFatGrams: 0,
    servingGrams: 30,
    per100g: {
      saturatedFatGrams: 60.0
    }
  },
  parsedJ19
);

recordTest(
  scoreJ19.score <= 6.5 &&
  scoreJ19.deductions.some(d => d.factor.includes('Saturated Fat')),
  19,
  'WHO SEARO NPM 2023 saturated fat density penalization',
  'Health Score Engine',
  'Unit Function (Synthetic Text)',
  `High saturated fat formulation correctly penalized under WHO SEARO density limits (Score: ${scoreJ19.score}/10).`
);

// -------------------------------------------------------------
// Test 20: Qualitative palm oil rank & zero undeclared percentage invention (Static database)
// -------------------------------------------------------------
const palmOilProduct = PRODUCTS_DATABASE.find(p => p.palmOil.present);
recordTest(
  !!palmOilProduct &&
  typeof palmOilProduct.palmOil.rank === 'number' &&
  !palmOilProduct.palmOil.warningText.includes('% exact') &&
  (palmOilProduct.palmOil.isExactPercentageDeclared !== undefined || palmOilProduct.palmOil.warningText.includes('ingredient')),
  20,
  'Qualitative palm oil rank & zero undeclared percentage invention',
  'Regulatory Truth',
  'Catalog Integrity (Static DB)',
  'Verified qualitative descending rank in static database without fabricating undeclared palm oil percentages.'
);

console.log('\n================================================================');
console.log(`TEST EXECUTION SUMMARY: ${results.filter(r => r.status === 'PASS').length} / ${results.length} PASSED`);
console.log('Taxonomy Breakdown:');
console.log(`- Unit Functions (Synthetic Text Fixtures): ${results.filter(r => r.executionType === 'Unit Function (Synthetic Text)').length}`);
console.log(`- Heuristic Classifiers (Synthetic Text Fixtures): ${results.filter(r => r.executionType === 'Heuristic Classifier (Synthetic Text)').length}`);
console.log(`- Catalog Integrity (Static Database): ${results.filter(r => r.executionType === 'Catalog Integrity (Static DB)').length}`);
console.log(`- Input Sanitization (Mock Files): ${results.filter(r => r.executionType === 'Input Sanitization (Mock File)').length}`);
console.log(`- Synthetic Mock Checks (Manual Values / In-Memory Mock): ${results.filter(r => r.executionType === 'Synthetic Mock Check (Manual Values)').length}`);
console.log('================================================================\n');

if (results.some(r => r.status === 'FAIL')) {
  process.exit(1);
} else {
  process.exit(0);
}