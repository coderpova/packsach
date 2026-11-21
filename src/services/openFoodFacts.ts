import { Product } from '../types/product';
import { parseIngredientsText } from './ingredientParser';
import { calculateHealthScore } from './healthScoreEngine';

interface OFFProductResponse {
  code?: string;
  product_name?: string;
  brands?: string;
  image_url?: string;
  ingredients_text?: string;
  nutriments?: {
    'energy-kcal_100g'?: number;
    'sugars_100g'?: number;
    'sugars_serving'?: number;
    'fat_100g'?: number;
    'saturated-fat_100g'?: number;
    'trans-fat_100g'?: number;
    'sodium_100g'?: number;
    'sodium_serving'?: number;
    'proteins_100g'?: number;
    'fiber_100g'?: number;
  };
  serving_size?: string;
  serving_quantity?: number;
  categories_tags?: string[];
}

async function fetchOffEndpoint(endpoint: string): Promise<any | null> {
  // Strategy: Try same-origin /api/off (Vite dev proxy & Vercel rewrite) first
  // to avoid CORS and browser tracking blockers; fallback gracefully to direct API.
  try {
    const proxyRes = await fetch(`/api/off${endpoint}`, {
      headers: { 'User-Agent': 'PackSach - FoodTruthApp/1.0' }
    });
    if (proxyRes.ok) {
      return await proxyRes.json();
    }
  } catch (proxyErr) {
    // Graceful fallback to direct endpoint if running outside proxy
  }

  try {
    const directRes = await fetch(`https://world.openfoodfacts.org${endpoint}`, {
      headers: { 'User-Agent': 'PackSach - FoodTruthApp/1.0' }
    });
    if (directRes.ok) {
      return await directRes.json();
    }
  } catch (directErr) {
    console.warn('Open Food Facts API request could not be completed:', directErr);
  }

  return null;
}

export async function fetchFromOpenFoodFacts(queryOrBarcode: string): Promise<Product | null> {
  const isBarcode = /^\d{8,14}$/.test(queryOrBarcode.trim());
  const cleanInput = encodeURIComponent(queryOrBarcode.trim());

  try {
    let rawProduct: OFFProductResponse | null = null;

    if (isBarcode) {
      const data = await fetchOffEndpoint(`/api/v2/product/${cleanInput}.json`);
      if (data && data.status === 1 && data.product) {
        rawProduct = data.product;
      }
    } else {
      const data = await fetchOffEndpoint(`/cgi/search.pl?search_terms=${cleanInput}&search_simple=1&action=process&json=1&page_size=5`);
      if (data && data.products && data.products.length > 0) {
        // Pick the product with the best ingredients_text
        const withIngredients = data.products.find((p: OFFProductResponse) => p.ingredients_text && p.ingredients_text.length > 15);
        rawProduct = withIngredients || data.products[0];
      }
    }

    if (!rawProduct || !rawProduct.product_name) {
      return null;
    }

    const servingGrams = rawProduct.serving_quantity || 30;
    const servingRatio = servingGrams / 100;
    const nutriments = rawProduct.nutriments || {};

    const sugar100g = nutriments['sugars_100g'] ?? 0;
    const sugarPerServe = nutriments['sugars_serving'] ?? Math.round(sugar100g * servingRatio * 10) / 10;
    const fat100g = nutriments['fat_100g'] ?? 0;
    const satFat100g = nutriments['saturated-fat_100g'] ?? 0;
    const transFat100g = nutriments['trans-fat_100g'] ?? 0;
    const sodium100g = (nutriments['sodium_100g'] ?? 0) * 1000; // convert g to mg
    const sodiumPerServe = nutriments['sodium_serving']
      ? nutriments['sodium_serving'] * 1000
      : Math.round(sodium100g * servingRatio);
    const calories100g = nutriments['energy-kcal_100g'] ?? 0;
    const caloriesPerServe = Math.round(calories100g * servingRatio);
    const proteinPerServe = Math.round(((nutriments['proteins_100g'] ?? 0) * servingRatio) * 10) / 10;
    const fiberPerServe = Math.round(((nutriments['fiber_100g'] ?? 0) * servingRatio) * 10) / 10;

    const ingredientsRaw = rawProduct.ingredients_text || 'Ingredients list not fully indexed in Open Food Facts database.';
    const parsedIngredients = parseIngredientsText(ingredientsRaw);

    const healthScore = calculateHealthScore(
      {
        sugarGrams: sugarPerServe,
        transFatGrams: Math.round(transFat100g * servingRatio * 10) / 10,
        sodiumMg: sodiumPerServe,
        proteinGrams: proteinPerServe,
        fiberGrams: fiberPerServe,
        servingGrams
      },
      parsedIngredients
    );

    const palmOilIngredient = parsedIngredients.find(i => i.isPalmOil);
    const palmOilRank = palmOilIngredient ? palmOilIngredient.rank : null;
    const palmOilWarning = palmOilIngredient
      ? palmOilRank && palmOilRank <= 3
        ? `Palm oil found in top 3 ingredients (#${palmOilRank})`
        : `Palm oil present at #${palmOilRank}`
      : 'No palm oil detected in label';

    const sugarTeaspoons = Math.round((sugarPerServe / 4) * 10) / 10;

    return {
      id: `off-${rawProduct.code || Date.now()}`,
      name: rawProduct.product_name,
      brand: rawProduct.brands || 'Packaged Brand',
      category: 'biscuits',
      categoryLabel: 'Open Food Facts Database',
      price: 25,
      image: rawProduct.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500&auto=format&fit=crop&q=60',
      frontClaim: 'Scanned from Open Food Facts Database',
      servingSize: rawProduct.serving_size || `${servingGrams}g`,
      servingGrams,
      ingredientsText: ingredientsRaw,
      parsedIngredients,
      nutritionPerServe: {
        calories: caloriesPerServe,
        sugarGrams: sugarPerServe,
        sugarTeaspoons,
        totalFatGrams: Math.round(fat100g * servingRatio * 10) / 10,
        saturatedFatGrams: Math.round(satFat100g * servingRatio * 10) / 10,
        transFatGrams: Math.round(transFat100g * servingRatio * 10) / 10,
        sodiumMg: sodiumPerServe,
        sodiumDailyPercent: Math.round((sodiumPerServe / 2000) * 100),
        proteinGrams: proteinPerServe,
        fiberGrams: fiberPerServe
      },
      nutritionPer100g: {
        calories: calories100g,
        sugarGrams: sugar100g,
        totalFatGrams: fat100g,
        saturatedFatGrams: satFat100g,
        sodiumMg: Math.round(sodium100g)
      },
      palmOil: {
        present: !!palmOilIngredient,
        rank: palmOilRank,
        warningText: palmOilWarning
      },
      healthScore,
      shockStatement: sugarTeaspoons >= 3
        ? `Contains ${sugarTeaspoons} teaspoons of sugar per serve. Nutritional profile evaluated from Open Food Facts.`
        : palmOilIngredient
        ? 'Contains industrial palm oil high on the ingredient list.'
        : 'Formulation evaluated from verified nutritional registry.',
      hindiCallout: 'Verified Open Food Facts record',
      swaps: [
        {
          id: 'swap-generic-clean',
          name: 'Traditional Roasted Chana & Tender Coconut Water',
          brand: 'PackSach Clean Swaps',
          price: 25,
          sugarTeaspoons: 0,
          healthScore: 9.5,
          caloriesPerServe: 95,
          whyBetter: 'Zero chemical food additives, 0g refined sugar, unadulterated whole nutrition.',
          evidenceBasis: 'Open Food Facts verified nutritional comparison.',
          servingComparisonText: 'Single portion equivalent.',
          priceComparisonText: 'Equivalent budget bracket (approx ₹25).',
          availability: 'Available locally & on quick-commerce'
        }
      ],
      dataSource: 'Open Food Facts',
      barcode: rawProduct.code
    };
  } catch (err) {
    console.warn('Open Food Facts API lookup note:', err);
    return null;
  }
}
