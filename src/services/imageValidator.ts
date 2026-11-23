import { createWorker } from 'tesseract.js';
import type { NutrientDeclarationStatus } from '../types/product';

export type ImageValidationStatus =
  | 'VALID_LABEL'       // Valid food packet label (either nutrition table or ingredients list)
  | 'FRONT_PACK_ONLY'   // Food packet front packaging detected, but missing nutrition/ingredients table
  | 'UNRELATED'         // Non-food image (selfie, face, pet, landscape, document, random object)
  | 'BLURRY'            // Blurry, unreadable, or out-of-focus image
  | 'BLANK'             // Blank, pure black, pure white, or zero-information image
  | 'UNSUPPORTED';      // Corrupted file, invalid MIME type, or unreadable format

export type ImageContentCategory =
  | 'NUTRITION_LABEL'       // Contains quantitative nutrition facts table (per 100g / per serve)
  | 'INGREDIENT_LABEL'      // Contains qualitative ingredient list with additives/commas
  | 'PACKAGED_FOOD_FRONT'   // Front-of-pack packaging (brand logo, marketing claims, net wt)
  | 'UNRELATED_IMAGE';      // Non-food image (portraits, landscapes, receipts, documents, code)

export interface WordConfidence {
  text: string;
  confidence: number;
  isLowConfidence: boolean;
}

export interface ExtractedNutritionValues {
  calories?: number;
  sugarGrams?: number;
  addedSugarGrams?: number;
  totalFatGrams?: number;
  saturatedFatGrams?: number;
  transFatGrams?: number;
  sodiumMg?: number;
  proteinGrams?: number;
  fiberGrams?: number;
  servingGrams?: number;
  declaredFields: {
    calories: boolean;
    sugar: boolean;
    addedSugar: boolean;
    totalFat: boolean;
    saturatedFat: boolean;
    transFat: boolean;
    sodium: boolean;
    protein: boolean;
    fiber: boolean;
    servingSize: boolean;
  };
  fieldStatuses: {
    calories: NutrientDeclarationStatus;
    sugar: NutrientDeclarationStatus;
    addedSugar: NutrientDeclarationStatus;
    totalFat: NutrientDeclarationStatus;
    saturatedFat: NutrientDeclarationStatus;
    transFat: NutrientDeclarationStatus;
    sodium: NutrientDeclarationStatus;
    protein: NutrientDeclarationStatus;
    fiber: NutrientDeclarationStatus;
  };
}

export interface ImageQualityAssessment {
  lapVariance: number;
  meanLuminance: number;
  stdDevLuminance: number;
  isBlurry: boolean;
  isBlank: boolean;
  isOverExposed: boolean;
  isUnderExposed: boolean;
  qualityIssues: string[];
}

export interface ImageValidationResult {
  status: ImageValidationStatus;
  contentCategory: ImageContentCategory;
  confidence: number;
  message: string;
  details?: string;
  extractedText?: string;
  wordTokens?: WordConfidence[];
  detectedKeywords: string[];
  detectedFoodBrand?: string;
  nutritionValues?: ExtractedNutritionValues;
  sharpnessScore?: number;
  photographyTips?: string[];
  qualityAssessment?: ImageQualityAssessment;
  classificationMechanism: string;
  classificationLimitation: string;
  hasRealVisionModel: boolean;
}

export const PHOTOGRAPHY_TIPS = [
  'Good lighting: Avoid harsh glare or shadows across glossy plastic wrappers.',
  'Flat surface: Flatten flexible pouches to prevent distorted or curved label lines.',
  'Focus on text: Tap the screen directly over the nutrition facts table or ingredient block.',
  'Square framing: Align the back panel horizontally with your camera frame.'
];

const NUTRITION_TABLE_MARKERS = [
  'nutritional information', 'nutrition facts', 'nutritional value',
  'per 100g', 'per 100 g', 'per 100ml', 'per serve', 'per serving', 'serving size',
  'energy', 'calories', 'kcal', 'total carbohydrates', 'carbohydrate',
  'total sugars', 'added sugars', 'saturated fat', 'trans fat', 'sodium', 'dietary fiber'
];

const INGREDIENT_LIST_MARKERS = [
  'ingredient', 'ingredients', 'samagri', 'contains', 'composition',
  'edible vegetable oil', 'refined wheat flour', 'maida', 'liquid glucose',
  'cocoa solids', 'milk solids', 'emulsifier', 'raising agent', 'preservative',
  'acidity regulator', 'flavor enhancer', 'synthetic food color', 'nature identical',
  'ins ', 'ins-', 'ins(', 'e150', 'e621', 'e102', 'e110', 'fssai lic'
];

const FRONT_BRANDS = [
  'cadbury', 'bournvita', 'mondelez', 'britannia', 'parle', 'nestle', 'maggi',
  'lays', "lay's", 'kurkure', 'bingo', 'haldiram', "haldiram's", 'frooti',
  'amul', 'horlicks', 'complan', 'boost', 'kellogg', "kellogg's", 'sunfeast',
  'mariegold', 'good day', 'oreo', 'tropicana', 'real', 'pepsi', 'coca cola',
  'coke', 'thums up', 'limca', 'sprite', 'mirinda', 'mountain dew', 'sting',
  'red bull', 'monster', 'kinley', 'bisleri', 'balaji', 'bikaji', 'patanjali',
  'bikanervala', 'everest', 'catch', 'mdh', 'dabur', 'itc', 'kissan', 'knorr',
  "ching's", 'top ramen', 'yippee', 'munch', 'kitkat', 'dairy milk', 'perk',
  '5 star', 'bar-one', 'snickers', 'gems', 'milkybar', 'eclairs'
];

const FRONT_FOOD_TERMS = [
  'biscuit', 'biscuits', 'cookie', 'cookies', 'chips', 'crisps', 'wafer',
  'wafers', 'noodles', 'namkeen', 'bhujia', 'sev', 'mixture', 'chocolate',
  'malt drink', 'health drink', 'energy drink', 'fruit drink', 'juice',
  'sauce', 'ketchup', 'cereal', 'corn flakes', 'muesli', 'oats', 'peanut butter',
  'spread', 'instant noodles', 'snack', 'snacks'
];

const NON_FOOD_INDICATORS = [
  'function', 'const', 'interface', 'class', 'import', 'export', 'invoice',
  'receipt', 'tax invoice', 'gstin', 'balance sheet', 'resume', 'curriculum',
  'curriculum vitae', 'agreement', 'contract', 'affidavit', 'passport',
  'driving license', 'aadhaar', 'car', 'motorcycle', 'engine', 'furniture',
  'chair', 'table', 'sofa', 'wardrobe', 'bed', 'screen', 'keyboard', 'laptop',
  'source code', 'npm install', 'git commit', 'doctor prescription', 'hospital'
];

/**
 * STEP 1: PURE IMAGE QUALITY ASSESSMENT (SEPARATED FROM CONTENT CLASSIFICATION)
 * Evaluates Laplacian edge variance, luminance, contrast, and exposure without making assumptions about food content.
 */
export function assessImageQuality(canvas: HTMLCanvasElement): ImageQualityAssessment {
  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return {
      lapVariance: 100,
      meanLuminance: 128,
      stdDevLuminance: 50,
      isBlurry: false,
      isBlank: false,
      isOverExposed: false,
      isUnderExposed: false,
      qualityIssues: []
    };
  }

  const { width, height } = canvas;
  const imgData = ctx.getImageData(0, 0, width, height).data;
  const gray = new Float32Array(width * height);

  let sumLum = 0;
  let sumLumSq = 0;
  const totalPixels = width * height;

  for (let i = 0, p = 0; i < imgData.length; i += 4, p++) {
    const lum = 0.299 * imgData[i] + 0.587 * imgData[i + 1] + 0.114 * imgData[i + 2];
    gray[p] = lum;
    sumLum += lum;
    sumLumSq += lum * lum;
  }

  const meanLum = sumLum / totalPixels;
  const varianceLum = Math.max(0, (sumLumSq / totalPixels) - (meanLum * meanLum));
  const stdDevLum = Math.sqrt(varianceLum);

  // Luminance anomaly detection
  const isBlank = meanLum < 8 || stdDevLum < 4.0;
  const isUnderExposed = meanLum < 30;
  const isOverExposed = meanLum > 235 && stdDevLum < 18;

  // Discrete Laplacian 3x3 kernel convolution for high-frequency edge variance
  let lapSum = 0;
  let lapSumSq = 0;
  let count = 0;

  for (let y = 1; y < height - 1; y++) {
    const rowOffset = y * width;
    for (let x = 1; x < width - 1; x++) {
      const p = rowOffset + x;
      const lap =
        gray[p - width] +
        gray[p + width] +
        gray[p - 1] +
        gray[p + 1] -
        4 * gray[p];

      lapSum += lap;
      lapSumSq += lap * lap;
      count++;
    }
  }

  const lapMean = count > 0 ? lapSum / count : 0;
  const lapVariance = count > 0 ? Math.max(0, (lapSumSq / count) - (lapMean * lapMean)) : 0;
  const isBlurry = lapVariance < 35;

  const qualityIssues: string[] = [];
  if (isBlank) qualityIssues.push('Blank or solid color image detected');
  if (isBlurry) qualityIssues.push(`Low high-frequency edge definition (Laplacian variance: ${Math.round(lapVariance)} < 35)`);
  if (isUnderExposed) qualityIssues.push('Image is severely underexposed (insufficient lighting)');
  if (isOverExposed) qualityIssues.push('Image is severely overexposed (harsh white glare)');

  return {
    lapVariance,
    meanLuminance: meanLum,
    stdDevLuminance: stdDevLum,
    isBlurry,
    isBlank,
    isOverExposed,
    isUnderExposed,
    qualityIssues
  };
}

/**
 * STEP 2: IMAGE CONTENT CATEGORY CLASSIFIER
 * Distinguishes: NUTRITION_LABEL, INGREDIENT_LABEL, PACKAGED_FOOD_FRONT, and UNRELATED_IMAGE.
 */
export function classifyImageContent(
  rawText: string,
  _wordTokens: WordConfidence[]
): {
  category: ImageContentCategory;
  detectedBrand?: string;
  detectedKeywords: string[];
  reasoning: string;
} {
  const normalized = rawText.toLowerCase();

  const matchedNutrition = NUTRITION_TABLE_MARKERS.filter(k => normalized.includes(k));
  const matchedIngredients = INGREDIENT_LIST_MARKERS.filter(k => normalized.includes(k));
  const matchedBrands = FRONT_BRANDS.filter(b => normalized.includes(b));
  const matchedFrontFood = FRONT_FOOD_TERMS.filter(f => normalized.includes(f));
  const matchedNonFood = NON_FOOD_INDICATORS.filter(n => normalized.includes(n));

  const detectedBrand = matchedBrands[0];

  // Check structured tabular nutrition markers (e.g., energy + protein/fat + numeric unit)
  const hasTabularNutrition = matchedNutrition.length >= 2 && /\d+\s*(?:g|mg|kcal)/i.test(rawText);
  // Check comma-separated ingredient declaration (e.g. "Ingredients: Wheat Flour, Sugar...")
  const hasStructuredIngredients = /(?:ingredients?|samagri)\s*[:-]/i.test(rawText) || (matchedIngredients.length >= 2 && rawText.includes(','));

  // 1. Unrelated Non-Food Document / Code / General Non-Food
  if (matchedNonFood.length >= 2 && matchedNutrition.length === 0 && matchedIngredients.length === 0 && matchedBrands.length === 0) {
    return {
      category: 'UNRELATED_IMAGE',
      detectedKeywords: matchedNonFood,
      reasoning: `Non-food document indicators identified (${matchedNonFood.join(', ')}). No food nutrition or ingredients present.`
    };
  }

  // 2. Nutrition Label (Quantitative Panel)
  if (hasTabularNutrition) {
    return {
      category: 'NUTRITION_LABEL',
      detectedBrand,
      detectedKeywords: matchedNutrition,
      reasoning: `Quantitative nutrition table detected with ${matchedNutrition.length} nutrient declaration markers and physical metric units.`
    };
  }

  // 3. Ingredient Label (Qualitative Component List)
  if (hasStructuredIngredients || matchedIngredients.length >= 2) {
    return {
      category: 'INGREDIENT_LABEL',
      detectedBrand,
      detectedKeywords: matchedIngredients,
      reasoning: `Ingredient declaration block detected with ${matchedIngredients.length} ingredient syntax markers and additive identifiers.`
    };
  }

  // 4. Front Packaging Only (Brand or FMCG food product title, but neither table nor ingredients)
  if (matchedBrands.length >= 1 || matchedFrontFood.length >= 1) {
    return {
      category: 'PACKAGED_FOOD_FRONT',
      detectedBrand,
      detectedKeywords: [...matchedBrands, ...matchedFrontFood],
      reasoning: `Front packaging detected for brand "${detectedBrand || matchedFrontFood[0]}", but missing back-of-pack nutrition table and ingredients list.`
    };
  }

  // 5. Unrelated (Selfies, portraits, animals, random objects, landscape)
  return {
    category: 'UNRELATED_IMAGE',
    detectedKeywords: [],
    reasoning: 'Zero packaged food markers, brand identifiers, nutrition panels, or ingredient declarations were found in the extracted text.'
  };
}

/**
 * STEP 3: NUTRITION EXTRACTION WITH HONEST DECLARATION STATUS ASSIGNMENT
 * Distinguishes declared, not declared, unreadable, and not detected states.
 */
export function extractNutritionFromText(rawText: string): ExtractedNutritionValues {
  const declaredFields = {
    calories: false,
    sugar: false,
    addedSugar: false,
    totalFat: false,
    saturatedFat: false,
    transFat: false,
    sodium: false,
    protein: false,
    fiber: false,
    servingSize: false
  };

  const fieldStatuses: ExtractedNutritionValues['fieldStatuses'] = {
    calories: 'not_declared',
    sugar: 'not_declared',
    addedSugar: 'not_declared',
    totalFat: 'not_declared',
    saturatedFat: 'not_declared',
    transFat: 'not_declared',
    sodium: 'not_declared',
    protein: 'not_declared',
    fiber: 'not_declared'
  };

  const values: Partial<ExtractedNutritionValues> = {};

  // Energy / Calories
  const calMatch = rawText.match(/(?:energy|calories|caloric\s+value|kcal)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(?:kcal|cal)?/i);
  if (calMatch) {
    values.calories = parseFloat(calMatch[1]);
    declaredFields.calories = true;
    fieldStatuses.calories = 'declared';
  } else if (/energy|calories/i.test(rawText)) {
    fieldStatuses.calories = 'unreadable';
  }

  // Added Sugars vs Total Sugars
  const addedSugarMatch = rawText.match(/(?:added\s+sugars?|of\s+which\s+added\s+sugars?)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*g?/i);
  if (addedSugarMatch) {
    values.addedSugarGrams = parseFloat(addedSugarMatch[1]);
    declaredFields.addedSugar = true;
    fieldStatuses.addedSugar = 'declared';
  }

  const sugarMatch = rawText.match(/(?:total\s+sugars?|sugars?|of\s+which\s+sugars?)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*g?/i);
  if (sugarMatch) {
    values.sugarGrams = parseFloat(sugarMatch[1]);
    declaredFields.sugar = true;
    fieldStatuses.sugar = 'declared';
  } else if (/sugar/i.test(rawText)) {
    fieldStatuses.sugar = 'unreadable';
  }

  // Total Fat
  const fatMatch = rawText.match(/(?:total\s+fat|fat)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*g?/i);
  if (fatMatch) {
    values.totalFatGrams = parseFloat(fatMatch[1]);
    declaredFields.totalFat = true;
    fieldStatuses.totalFat = 'declared';
  }

  // Saturated Fat
  const satFatMatch = rawText.match(/(?:saturated\s+fat|saturated\s+fatty\s+acids?)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*g?/i);
  if (satFatMatch) {
    values.saturatedFatGrams = parseFloat(satFatMatch[1]);
    declaredFields.saturatedFat = true;
    fieldStatuses.saturatedFat = 'declared';
  }

  // Trans Fat
  const transFatMatch = rawText.match(/(?:trans\s+fat|trans\s+fatty\s+acids?)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*g?/i);
  if (transFatMatch) {
    values.transFatGrams = parseFloat(transFatMatch[1]);
    declaredFields.transFat = true;
    fieldStatuses.transFat = 'declared';
  }

  // Sodium
  const sodiumMatch = rawText.match(/(?:sodium|salt)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(mg|g)?/i);
  if (sodiumMatch) {
    let mg = parseFloat(sodiumMatch[1]);
    if (sodiumMatch[2]?.toLowerCase() === 'g') mg = mg * 1000;
    values.sodiumMg = mg;
    declaredFields.sodium = true;
    fieldStatuses.sodium = 'declared';
  } else if (/sodium|salt/i.test(rawText)) {
    fieldStatuses.sodium = 'unreadable';
  }

  // Protein
  const proteinMatch = rawText.match(/(?:protein)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*g?/i);
  if (proteinMatch) {
    values.proteinGrams = parseFloat(proteinMatch[1]);
    declaredFields.protein = true;
    fieldStatuses.protein = 'declared';
  }

  // Fiber
  const fiberMatch = rawText.match(/(?:dietary\s+fiber|dietary\s+fibre|fiber|fibre)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*g?/i);
  if (fiberMatch) {
    values.fiberGrams = parseFloat(fiberMatch[1]);
    declaredFields.fiber = true;
    fieldStatuses.fiber = 'declared';
  }

  // Serving Size
  const serveMatch = rawText.match(/(?:serving\s+size|serve\s+size|approx\.?\s*serving)[\s:]*([0-9]+(?:\.[0-9]+)?)\s*(?:g|ml)?/i);
  if (serveMatch) {
    values.servingGrams = parseFloat(serveMatch[1]);
    declaredFields.servingSize = true;
  }

  return {
    ...values,
    declaredFields,
    fieldStatuses
  };
}

/**
 * Validates image file binary integrity (MIME, extension, size)
 */
export function validateImageFileIntegrity(file: File): { isValid: boolean; error?: string } {
  const validMimes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
  const normalizedType = file.type ? file.type.toLowerCase() : '';

  if (file.size === 0) {
    return {
      isValid: false,
      error: 'The uploaded file is empty (0 bytes). Please select a valid photo.'
    };
  }

  if (file.size > 10 * 1024 * 1024) {
    return {
      isValid: false,
      error: 'File size exceeds 10MB limit. Please upload an optimized photo.'
    };
  }

  // Check file extension if name is available to block spoofed/dangerous extensions
  if (file.name) {
    const ext = file.name.split('.').pop()?.toLowerCase();
    const dangerousExtensions = ['svg', 'html', 'htm', 'exe', 'bat', 'cmd', 'sh', 'php', 'js', 'ts', 'pdf'];
    if (ext && dangerousExtensions.includes(ext)) {
      return {
        isValid: false,
        error: 'Unsupported file format. Please upload a JPG, PNG or WebP image.'
      };
    }
    const validExtensions = ['jpg', 'jpeg', 'png', 'webp'];
    if (ext && !validExtensions.includes(ext)) {
      return {
        isValid: false,
        error: 'Unsupported file format. Please upload a JPG, PNG or WebP image.'
      };
    }
  }

  // Check browser-reported MIME type if present
  if (normalizedType && !validMimes.includes(normalizedType)) {
    return {
      isValid: false,
      error: 'Unsupported file format. Please upload a JPG, PNG or WebP image.'
    };
  }

  return { isValid: true };
}

/**
 * Validates actual binary magic bytes (file signature).
 * Protects against MIME-type spoofing (e.g. SVG or executable renamed to .jpg).
 */
export function verifyImageMagicBytes(headerBytes: Uint8Array): { isValid: boolean; format?: 'jpeg' | 'png' | 'webp'; error?: string } {
  if (headerBytes.length < 12) {
    return {
      isValid: false,
      error: 'File is too small to contain a valid image header.'
    };
  }

  // JPEG magic bytes: FF D8 FF
  if (headerBytes[0] === 0xFF && headerBytes[1] === 0xD8 && headerBytes[2] === 0xFF) {
    return { isValid: true, format: 'jpeg' };
  }

  // PNG magic bytes: 89 50 4E 47 0D 0A 1A 0A
  if (headerBytes[0] === 0x89 && headerBytes[1] === 0x50 && headerBytes[2] === 0x4E && headerBytes[3] === 0x47) {
    return { isValid: true, format: 'png' };
  }

  // WebP: RIFF (bytes 0-3) + WEBP (bytes 8-11)
  if (
    headerBytes[0] === 0x52 && headerBytes[1] === 0x49 && headerBytes[2] === 0x46 && headerBytes[3] === 0x46 &&
    headerBytes[8] === 0x57 && headerBytes[9] === 0x45 && headerBytes[10] === 0x42 && headerBytes[11] === 0x50
  ) {
    return { isValid: true, format: 'webp' };
  }

  return {
    isValid: false,
    error: 'File signature mismatch. The file content does not match a valid JPG, PNG, or WebP image header.'
  };
}

/**
 * Asynchronously verifies the file signature of a File or Blob by reading its first 16 bytes.
 */
export async function validateImageFileSignature(file: File | Blob): Promise<{ isValid: boolean; format?: 'jpeg' | 'png' | 'webp'; error?: string }> {
  try {
    const headerSlice = file.slice(0, 16);
    const arrayBuffer = await headerSlice.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    return verifyImageMagicBytes(bytes);
  } catch {
    return {
      isValid: false,
      error: 'Failed to read image binary header. The file may be unreadable or corrupted.'
    };
  }
}

/**
 * Main Smart Image Validator:
 * 1. Executes quality assessment (blur, luminance, exposure).
 * 2. Executes Tesseract OCR.
 * 3. Classifies content into 4 specific categories (NUTRITION_LABEL, INGREDIENT_LABEL, PACKAGED_FOOD_FRONT, UNRELATED_IMAGE).
 * 4. Honestly discloses limitations.
 */
export async function validateAndExtractImage(
  imageSource: string | File,
  onProgress?: (progress: number, status: string) => void
): Promise<ImageValidationResult> {
  const classificationMechanism = 'Heuristic OCR Semantic Classifier & Rule-Based Grammar (No External Vision Model Configured)';
  const classificationLimitation = 'Limitation Disclosure: PackSach operates in client-side heuristic mode without an external computer vision endpoint (e.g. Google Cloud Vision or fine-tuned CNN). Classification evaluates optical text tokens, layout grammar, and keyword lexicons. Non-food items with printed text resembling food terms may cause false acceptances; stylized artistic fonts or non-English labels may cause false rejections.';

  // 1. File verification if provided as File
  if (typeof imageSource !== 'string') {
    const check = validateImageFileIntegrity(imageSource);
    if (!check.isValid) {
      return {
        status: 'UNSUPPORTED',
        contentCategory: 'UNRELATED_IMAGE',
        confidence: 0,
        message: check.error || 'Unsupported file format. Please upload a JPG, PNG or WebP image.',
        detectedKeywords: [],
        classificationMechanism,
        classificationLimitation,
        hasRealVisionModel: false
      };
    }

    const sigCheck = await validateImageFileSignature(imageSource);
    if (!sigCheck.isValid) {
      return {
        status: 'UNSUPPORTED',
        contentCategory: 'UNRELATED_IMAGE',
        confidence: 0,
        message: sigCheck.error || 'File signature mismatch. The file content does not match a valid JPG, PNG, or WebP image header.',
        detectedKeywords: [],
        classificationMechanism,
        classificationLimitation,
        hasRealVisionModel: false
      };
    }
  }

  onProgress?.(10, 'Loading image and initializing visual analyzers...');

  // 2. Load image into memory & canvas with proper memory cleanup
  const objectUrl = typeof imageSource !== 'string' ? URL.createObjectURL(imageSource) : null;
  const imageElement = await new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      resolve(img);
    };
    img.onerror = () => {
      if (objectUrl) URL.revokeObjectURL(objectUrl);
      reject(new Error('Failed to decode image data'));
    };
    img.src = objectUrl || (imageSource as string);
  }).catch(() => null);

  if (!imageElement || imageElement.naturalWidth < 30 || imageElement.naturalHeight < 30) {
    return {
      status: 'UNSUPPORTED',
      contentCategory: 'UNRELATED_IMAGE',
      confidence: 0,
      message: 'Failed to decode image data. The file may be corrupted or truncated.',
      detectedKeywords: [],
      classificationMechanism,
      classificationLimitation,
      hasRealVisionModel: false
    };
  }

  onProgress?.(25, 'Analyzing image contrast, luminance, and edge sharpness...');

  // 3. Pixel & sharpness analysis
  const offscreenCanvas = document.createElement('canvas');
  const targetWidth = 320;
  const targetHeight = Math.max(50, Math.round((targetWidth * imageElement.naturalHeight) / imageElement.naturalWidth));
  offscreenCanvas.width = targetWidth;
  offscreenCanvas.height = targetHeight;
  const ctx = offscreenCanvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(imageElement, 0, 0, targetWidth, targetHeight);
  }

  const qualityAssessment = assessImageQuality(offscreenCanvas);

  if (qualityAssessment.isBlank) {
    return {
      status: 'BLANK',
      contentCategory: 'UNRELATED_IMAGE',
      confidence: 0,
      message: 'No image content detected. Please select a valid photo.',
      sharpnessScore: Math.round(qualityAssessment.lapVariance),
      qualityAssessment,
      detectedKeywords: [],
      classificationMechanism,
      classificationLimitation,
      hasRealVisionModel: false
    };
  }

  onProgress?.(45, 'Executing neural OCR text extraction (Tesseract.js)...');

  // 4. Run real Tesseract OCR
  let ocrText = '';
  let overallConfidence = 0;
  const wordTokens: WordConfidence[] = [];

  try {
    const worker = await createWorker('eng');
    onProgress?.(65, 'Extracting printed text lines and word tokens...');
    const ret = await worker.recognize(imageElement);
    const pageData = ret.data as any;
    ocrText = pageData.text || '';
    overallConfidence = pageData.confidence || 0;

    if (pageData.words && Array.isArray(pageData.words)) {
      for (const w of pageData.words) {
        const clean = (w.text || '').trim();
        if (clean.length > 0) {
          wordTokens.push({
            text: clean,
            confidence: Math.round(w.confidence || 0),
            isLowConfidence: (w.confidence || 0) < 60
          });
        }
      }
    }

    await worker.terminate();
  } catch (ocrErr) {
    console.warn('Tesseract OCR engine warning:', ocrErr);
  }

  onProgress?.(85, 'Evaluating semantic food tokens and classification...');

  // 5. Image Category Classification (Separated from Quality)
  const categoryResult = classifyImageContent(ocrText, wordTokens);
  const totalWordCount = (ocrText.match(/[a-zA-Z]{2,}/g) || []).length;

  // A. Blur Gate: Low sharpness score (< 35) + unreadable OCR
  if (qualityAssessment.isBlurry && (totalWordCount < 3 || overallConfidence < 42 || ocrText.trim().length < 15)) {
    return {
      status: 'BLURRY',
      contentCategory: categoryResult.category,
      confidence: Math.round(overallConfidence),
      message: 'Image is unclear. Please capture the label again with better lighting and focus.',
      details: `Edge sharpness variance score: ${Math.round(qualityAssessment.lapVariance)} (threshold: 35). Average OCR token confidence: ${Math.round(overallConfidence)}%.`,
      extractedText: ocrText.trim(),
      wordTokens,
      detectedKeywords: categoryResult.detectedKeywords,
      sharpnessScore: Math.round(qualityAssessment.lapVariance),
      photographyTips: PHOTOGRAPHY_TIPS,
      qualityAssessment,
      classificationMechanism,
      classificationLimitation,
      hasRealVisionModel: false
    };
  }

  // B. Back-of-Pack Valid Label (Nutrition Table or Ingredient Listing)
  if (categoryResult.category === 'NUTRITION_LABEL' || categoryResult.category === 'INGREDIENT_LABEL') {
    const nutritionValues = extractNutritionFromText(ocrText);

    return {
      status: 'VALID_LABEL',
      contentCategory: categoryResult.category,
      confidence: Math.max(65, Math.round(overallConfidence)),
      message: categoryResult.category === 'NUTRITION_LABEL'
        ? 'Valid food nutrition table detected.'
        : 'Valid food ingredient declaration detected.',
      details: categoryResult.reasoning,
      extractedText: ocrText.trim(),
      wordTokens,
      detectedKeywords: categoryResult.detectedKeywords,
      detectedFoodBrand: categoryResult.detectedBrand,
      nutritionValues,
      sharpnessScore: Math.round(qualityAssessment.lapVariance),
      qualityAssessment,
      classificationMechanism,
      classificationLimitation,
      hasRealVisionModel: false
    };
  }

  // C. Front-of-Pack Packaging Only
  if (categoryResult.category === 'PACKAGED_FOOD_FRONT') {
    const detectedName = categoryResult.detectedBrand
      ? `${categoryResult.detectedBrand.toUpperCase()} Packaged Product`
      : 'Packaged food product';

    return {
      status: 'FRONT_PACK_ONLY',
      contentCategory: 'PACKAGED_FOOD_FRONT',
      confidence: Math.max(60, Math.round(overallConfidence)),
      message: 'Food product detected, but its nutrition or ingredient label is not visible. Please upload a clear image of the back of the packet.',
      details: `Identified front packaging for "${detectedName}". Nutrition facts table or ingredients list was not found on this image.`,
      extractedText: ocrText.trim(),
      wordTokens,
      detectedKeywords: categoryResult.detectedKeywords,
      detectedFoodBrand: categoryResult.detectedBrand,
      sharpnessScore: Math.round(qualityAssessment.lapVariance),
      photographyTips: [
        'Flip the packet around to capture the back side.',
        'Look for the printed table titled "NUTRITIONAL INFORMATION" or "INGREDIENTS:".',
        'Hold the camera parallel to the label to avoid distorted angles.'
      ],
      qualityAssessment,
      classificationMechanism,
      classificationLimitation,
      hasRealVisionModel: false
    };
  }

  // D. Unrelated / Non-Food Image
  return {
    status: 'UNRELATED',
    contentCategory: 'UNRELATED_IMAGE',
    confidence: Math.round(overallConfidence),
    message: "Invalid image! This doesn't appear to be a packaged food product or nutrition label. Please upload a clear photo of a food packet's ingredient or nutrition label.",
    details: categoryResult.reasoning,
    extractedText: ocrText.trim(),
    wordTokens,
    detectedKeywords: categoryResult.detectedKeywords,
    sharpnessScore: Math.round(qualityAssessment.lapVariance),
    photographyTips: [
      'Take a close-up photo of the back of any biscuit, chips, noodle, or beverage packet.',
      'Ensure the words "Ingredients" or "Nutrition Facts" are clearly visible.',
      'Do not upload photos of people, animals, landscapes, or household objects.'
    ],
    qualityAssessment,
    classificationMechanism,
    classificationLimitation,
    hasRealVisionModel: false
  };
}
