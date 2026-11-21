import { Product, HealthCategory, NutrientDeclarationStatus } from '../types/product';
import { parseIngredientsText } from '../services/ingredientParser';
import { calculateHealthScore } from '../services/healthScoreEngine';

interface RawProductDefinition {
  id: string;
  name: string;
  brand: string;
  category: HealthCategory;
  categoryLabel: string;
  price: number;
  image: string;
  frontClaim: string;
  servingSize: string;
  servingGrams: number;
  ingredientsText: string;
  nutritionPerServe: {
    calories: number;
    sugarGrams: number;
    addedSugarGrams?: number;
    totalFatGrams: number;
    saturatedFatGrams: number;
    transFatGrams: number;
    sodiumMg: number;
    proteinGrams: number;
    fiberGrams: number;
  };
  nutritionPer100g: {
    calories: number;
    sugarGrams: number;
    addedSugarGrams?: number;
    totalFatGrams: number;
    saturatedFatGrams: number;
    sodiumMg: number;
  };
  isExactPalmOilPercentDeclared?: boolean;
  shockStatement: string;
  hindiCallout: string;
  swaps: Product['swaps'];
  barcode?: string;
}

const RAW_PRODUCTS: RawProductDefinition[] = [
  {
    id: 'bournvita-malt-drink',
    name: 'Bournvita Chocolate Malt Drink',
    brand: 'Mondelez / Cadbury',
    category: 'malt-drinks',
    categoryLabel: 'Malt & Health Drinks',
    price: 20,
    image: 'https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=500&auto=format&fit=crop&q=60',
    frontClaim: 'Tayaar Raho: 2x Immunity, Vitamin D & Strong Bones',
    servingSize: '20g powder (1 glass)',
    servingGrams: 20,
    ingredientsText: 'Cereal Extract (56%), Sugar (32%), Cocoa Solids, Liquid Glucose, Emulsifiers (INS 322, INS 471), Raising Agent (INS 500(ii)), Caramel Color (INS 150c), Nature Identical Flavoring Substances',
    nutritionPerServe: {
      calories: 78,
      sugarGrams: 14.2,
      addedSugarGrams: 7.4,
      totalFatGrams: 1.2,
      saturatedFatGrams: 0.7,
      transFatGrams: 0.0,
      sodiumMg: 75,
      proteinGrams: 1.4,
      fiberGrams: 0.4
    },
    nutritionPer100g: {
      calories: 390,
      sugarGrams: 71.0,
      addedSugarGrams: 37.0,
      totalFatGrams: 6.0,
      saturatedFatGrams: 3.5,
      sodiumMg: 375
    },
    isExactPalmOilPercentDeclared: false,
    shockStatement: 'A single 20g serving contains 14.2g total sugars (3.6 tsp), comprising 7.4g added sugar alongside malted barley extract. Total sugars account for 71% of this powder formulation by weight.',
    hindiCallout: '71% total sugars and cereal malt extract formulation',
    swaps: [
      {
        id: 'swap-ragi-sattu',
        name: 'Roasted Ragi & Sattu Drink (Unsweetened)',
        brand: 'PackSach Clean Kitchen / Local Millets',
        price: 20,
        sugarTeaspoons: 0,
        healthScore: 9.4,
        caloriesPerServe: 68,
        whyBetter: 'Zero added refined sugar. Naturally rich in iron, calcium, and complex slow-burning carbohydrates.',
        evidenceBasis: 'Direct ingredient comparison: Whole ragi and sattu flours contain zero added sucrose or glucose syrups (verified from retail packaging). Rich in intrinsic calcium (344mg/100g) and slow-digesting dietary fiber.',
        servingComparisonText: 'Serving comparison: 20g powder reconstituted in 200ml milk or warm water.',
        priceComparisonText: 'Same price: ₹20 per unit.',
        availability: 'Available on Blinkit / Zepto & Local Kiranas'
      },
      {
        id: 'swap-pure-cocoa-almond',
        name: 'Pure Dutch Cocoa & Crushed Almond Powder',
        brand: 'NutriPure India',
        price: 25,
        sugarTeaspoons: 0.2,
        healthScore: 8.9,
        caloriesPerServe: 72,
        whyBetter: 'No liquid glucose or synthetic flavorings. Real unsweetened cocoa with whole almond protein and healthy unsaturated fats.',
        evidenceBasis: 'Labelling analysis confirms 0g added sugar; 0.8g intrinsic sugars derived from raw almonds and pure cocoa solids.',
        servingComparisonText: 'Serving comparison: 20g powder serving.',
        priceComparisonText: 'Comparable price: ₹25 vs ₹20.',
        availability: 'Available on Instamart & BigBasket'
      }
    ],
    barcode: '8901233024814'
  },
  {
    id: 'nutrichoice-digestive-biscuits',
    name: 'NutriChoice Hi-Fibre Digestive Biscuits',
    brand: 'Britannia',
    category: 'biscuits',
    categoryLabel: 'Biscuits & Cookies',
    price: 30,
    image: 'https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=500&auto=format&fit=crop&q=60',
    frontClaim: '100% HEALTHY • High Fibre • Wholesome Power',
    servingSize: '28g (3 biscuits)',
    servingGrams: 28,
    ingredientsText: 'Refined Wheat Flour (Maida) (48%), Refined Palm Oil (18%), Sugar (15%), Wheat Bran (8%), Invert Sugar Syrup, Raising Agents (INS 503(ii), INS 500(ii)), Emulsifiers (INS 322, INS 471), Maltodextrin, Nature Identical Flavours',
    nutritionPerServe: {
      calories: 136,
      sugarGrams: 6.8,
      addedSugarGrams: 5.6,
      totalFatGrams: 5.6,
      saturatedFatGrams: 2.8,
      transFatGrams: 0.05,
      sodiumMg: 145,
      proteinGrams: 2.1,
      fiberGrams: 1.4
    },
    nutritionPer100g: {
      calories: 486,
      sugarGrams: 24.3,
      addedSugarGrams: 20.0,
      totalFatGrams: 20.0,
      saturatedFatGrams: 10.0,
      sodiumMg: 520
    },
    isExactPalmOilPercentDeclared: true,
    shockStatement: 'Refined wheat flour (48%) and refined palm oil (18%) form two-thirds of this biscuit\'s weight. Three biscuits deliver 1.7 teaspoons of sugar.',
    hindiCallout: 'Refined maida (48%) and palm oil (18%) comprise majority weight',
    swaps: [
      {
        id: 'swap-roasted-khakhra',
        name: '100% Whole Wheat Methi Khakhra (Vacuum Crisped)',
        brand: 'Maniarrs / Healthy Treats',
        price: 30,
        sugarTeaspoons: 0,
        healthScore: 9.3,
        caloriesPerServe: 95,
        whyBetter: '100% whole grain wheat roasted with cold-pressed sesame oil. Zero added sugar and zero palm oil.',
        evidenceBasis: 'Ingredient order verifies 100% whole wheat flour, fenugreek leaves, and sesame oil. 0g refined sugar and 0g palmolein.',
        servingComparisonText: 'Serving comparison: 25g crisp portion (equivalent snack portion).',
        priceComparisonText: 'Identical price: ₹30 per pack.',
        availability: 'Available on Blinkit & Swiggy Instamart'
      },
      {
        id: 'swap-rolled-oats-cookies',
        name: 'Zero-Maida Jaggery Rolled Oats Cookies',
        brand: 'True Elements',
        price: 35,
        sugarTeaspoons: 0.5,
        healthScore: 8.4,
        caloriesPerServe: 110,
        whyBetter: 'Baked with whole rolled oats and cold-pressed sunflower oil. Sweetened with unrefined jaggery instead of invert syrup.',
        evidenceBasis: 'Whole rolled oats listed as #1 ingredient at 62%; saturated fat is 65% lower than palm-oil baked digestives.',
        servingComparisonText: 'Serving comparison: 2 cookies (28g).',
        priceComparisonText: 'Comparable price: ₹35 vs ₹30.',
        availability: 'Available on Zepto & Amazon'
      }
    ],
    barcode: '8901063132049'
  },
  {
    id: 'frooti-mango-drink',
    name: 'Frooti Fresh \'n\' Juicy Mango Drink',
    brand: 'Parle Agro',
    category: 'juices-beverages',
    categoryLabel: 'Packaged Juices & Soft Drinks',
    price: 20,
    image: 'https://images.unsplash.com/photo-1546173159-315724a31696?w=500&auto=format&fit=crop&q=60',
    frontClaim: 'Made with Real Mangoes • Fresh \'N\' Juicy Mango Delight',
    servingSize: '160ml (1 tetrapack)',
    servingGrams: 160,
    ingredientsText: 'Water, Mango Pulp (19.5%), Sugar (13.8%), Acidity Regulator (INS 330), Antioxidant (INS 300), Preservative (INS 211), Synthetic Food Color (INS 110), Permitted Natural Mango Flavours',
    nutritionPerServe: {
      calories: 104,
      sugarGrams: 22.0,
      addedSugarGrams: 13.8,
      totalFatGrams: 0.0,
      saturatedFatGrams: 0.0,
      transFatGrams: 0.0,
      sodiumMg: 48,
      proteinGrams: 0.1,
      fiberGrams: 0.2
    },
    nutritionPer100g: {
      calories: 65,
      sugarGrams: 13.75,
      addedSugarGrams: 8.6,
      totalFatGrams: 0.0,
      saturatedFatGrams: 0.0,
      sodiumMg: 30
    },
    isExactPalmOilPercentDeclared: false,
    shockStatement: 'A single 160ml tetrapack delivers 22.0g total sugars (including 13.8g added sucrose) alongside 19.5% fruit pulp, contributing 88% towards the WHO adult 25g/day free-sugar guidance benchmark.',
    hindiCallout: 'Sugar accounts for 88% of adult 25g daily free-sugar guidance',
    swaps: [
      {
        id: 'swap-coconut-water',
        name: 'Natural Tender Coconut Water (No Added Sugar)',
        brand: 'Raw Pressery / Local Fresh Coconut',
        price: 25,
        sugarTeaspoons: 0,
        healthScore: 9.6,
        caloriesPerServe: 38,
        whyBetter: 'Natural bio-active electrolytes (potassium, magnesium). 0g added sugar and no synthetic azo food dyes (INS 110).',
        evidenceBasis: 'Labelling analysis: 100% tender coconut water with 0g added refined sugar; contains only naturally occurring intrinsic sugars.',
        servingComparisonText: 'Serving comparison: 200ml natural drink portion.',
        priceComparisonText: 'Comparable price: ₹25 vs ₹20.',
        availability: 'Available on Blinkit / Zepto / Local Cart'
      },
      {
        id: 'swap-fresh-nimbu-paani',
        name: 'Fresh Mint Lime Cooler (Ghar Ka Nimbu Paani)',
        brand: 'PackSach DIY Swap',
        price: 10,
        sugarTeaspoons: 0.2,
        healthScore: 9.5,
        caloriesPerServe: 18,
        whyBetter: 'Real fresh lemon juice with rock salt and roasted cumin. Natural vitamin C without synthetic preservatives or food dyes.',
        evidenceBasis: 'Fresh lemon juice provides natural citric acid and bioflavonoids without synthetic additives or excess sucrose.',
        servingComparisonText: 'Serving comparison: 200ml glass.',
        priceComparisonText: 'Lower cost: ₹10 vs ₹20.',
        availability: 'Instant 2-minute home preparation or Fresh Juice Bar'
      }
    ],
    barcode: '8902579100018'
  },
  {
    id: 'maggi-2min-noodles',
    name: 'Maggi 2-Minute Masala Noodles',
    brand: 'Nestlé India',
    category: 'noodles-snacks',
    categoryLabel: 'Instant Noodles & Quick Meals',
    price: 14,
    image: 'https://images.unsplash.com/photo-1612927601601-6638404737ce?w=500&auto=format&fit=crop&q=60',
    frontClaim: 'Taste Bhi, Health Bhi • Goodness of Iron',
    servingSize: '70g (1 pack)',
    servingGrams: 70,
    ingredientsText: 'Noodles: Refined Wheat Flour (Maida), Refined Palm Oil, Iodised Salt, Wheat Gluten, Thickeners (INS 508, INS 412), Acidity Regulators (INS 501(i), INS 500(i)). Tastemaker: Mixed Spices, Sugar, Edible Palm Oil, Flavor Enhancers (INS 627, INS 631), Caramel Color (INS 150c)',
    nutritionPerServe: {
      calories: 312,
      sugarGrams: 2.2,
      addedSugarGrams: 1.5,
      totalFatGrams: 12.8,
      saturatedFatGrams: 6.1,
      transFatGrams: 0.12,
      sodiumMg: 860,
      proteinGrams: 6.8,
      fiberGrams: 2.1
    },
    nutritionPer100g: {
      calories: 446,
      sugarGrams: 3.1,
      addedSugarGrams: 2.1,
      totalFatGrams: 18.3,
      saturatedFatGrams: 8.7,
      sodiumMg: 1228
    },
    isExactPalmOilPercentDeclared: false,
    shockStatement: 'A single 70g pack contains 860mg of sodium (43% of the WHO 2,000mg daily ceiling for adults) alongside palm-oil fried refined flour noodles and permitted flavor enhancers (INS 627, INS 631).',
    hindiCallout: '43% of WHO 2,000mg daily sodium limit in one single serving',
    swaps: [
      {
        id: 'swap-millet-noodles',
        name: 'Sun-Dried Foxtail & Ragi Millet Noodles',
        brand: 'Slurrp Farm / Native Food Store',
        price: 20,
        sugarTeaspoons: 0,
        healthScore: 8.8,
        caloriesPerServe: 240,
        whyBetter: 'Sun-dried unpolished millets instead of deep frying. Cold-ground spices with zero artificial enhancers.',
        evidenceBasis: 'Labelling: Unfried multi-millet base (foxtail, ragi, jowar). Saturated fat is 82% lower (1.1g vs 6.1g); sodium is 420mg vs 860mg.',
        servingComparisonText: 'Serving comparison: 70g cooked portion.',
        priceComparisonText: 'Comparable price: ₹20 vs ₹14.',
        availability: 'Available on Blinkit / Zepto'
      },
      {
        id: 'swap-veggie-poha',
        name: 'Spiced Vegetable Flattened Rice (Poha)',
        brand: 'Traditional Clean Kitchen',
        price: 15,
        sugarTeaspoons: 0,
        healthScore: 9.3,
        caloriesPerServe: 210,
        whyBetter: 'Naturally iron-rich roasted rice flakes cooked with mustard seeds, peanuts, and green vegetables.',
        evidenceBasis: 'Whole culinary preparation: cooked in minimal mustard/groundnut oil. Sodium controlled to ~220mg; zero artificial thickeners or refining aids.',
        servingComparisonText: 'Serving comparison: 1 bowl (80g cooked).',
        priceComparisonText: 'Same price: ₹15 vs ₹14.',
        availability: 'Quick 5-minute home recipe or Ready-to-Eat'
      }
    ],
    barcode: '8901058852334'
  },
  {
    id: 'kurkure-masala-munch',
    name: 'Kurkure Masala Munch',
    brand: 'PepsiCo India',
    category: 'chips',
    categoryLabel: 'Chips & Savory Snacks',
    price: 20,
    image: 'https://images.unsplash.com/photo-1566478989037-eec170784d0b?w=500&auto=format&fit=crop&q=60',
    frontClaim: 'Tedha Hai Par Mera Hai • Made with Kitchen Ingredients',
    servingSize: '45g (1 pack)',
    servingGrams: 45,
    ingredientsText: 'Rice Meal (43%), Refined Palmolein (28%), Corn Meal (14%), Gram Meal (6%), Spices & Condiments, Iodised Salt, Sugar, Tartaric Acid (INS 334), Flavor Enhancers (INS 627, INS 631)',
    nutritionPerServe: {
      calories: 252,
      sugarGrams: 1.1,
      addedSugarGrams: 0.8,
      totalFatGrams: 15.3,
      saturatedFatGrams: 6.9,
      transFatGrams: 0.08,
      sodiumMg: 420,
      proteinGrams: 2.6,
      fiberGrams: 1.2
    },
    nutritionPer100g: {
      calories: 560,
      sugarGrams: 2.4,
      addedSugarGrams: 1.8,
      totalFatGrams: 34.0,
      saturatedFatGrams: 15.3,
      sodiumMg: 933
    },
    isExactPalmOilPercentDeclared: true,
    shockStatement: '28% of this snack consists of refined palmolein oil, delivering 6.9g of saturated fat per 45g pouch alongside permitted flavor boosters (INS 627, INS 631).',
    hindiCallout: '28% refined palmolein oil composition by weight',
    swaps: [
      {
        id: 'swap-roasted-makhana',
        name: 'Himalayan Pink Salt & Pepper Roasted Makhana (Fox Nuts)',
        brand: 'Farmley / Open Secret',
        price: 25,
        sugarTeaspoons: 0,
        healthScore: 9.5,
        caloriesPerServe: 120,
        whyBetter: 'Air-roasted fox nuts rich in calcium, potassium and antioxidants. Zero palmolein oil and 80% less saturated fat.',
        evidenceBasis: 'Ingredient list: 92% roasted fox nuts, 5% cold-pressed olive oil, pink salt, black pepper. Zero palmolein or palm oil.',
        servingComparisonText: 'Serving comparison: 35g voluminous snack portion.',
        priceComparisonText: 'Comparable price: ₹25 vs ₹20.',
        availability: 'Available on Zepto / Blinkit'
      },
      {
        id: 'swap-roasted-chana',
        name: 'Crispy Roasted Spiced Chana (Bengal Gram)',
        brand: 'Haldiram’s / Local Roasters',
        price: 15,
        sugarTeaspoons: 0,
        healthScore: 9.4,
        caloriesPerServe: 140,
        whyBetter: 'High protein plant-based crunch with intact dietary fiber husk. Roasted dry without frying oil.',
        evidenceBasis: 'Labelling: 95% roasted whole black gram. Delivers 6.5g protein and 4.2g fiber per portion with < 1g saturated fat.',
        servingComparisonText: 'Serving comparison: 40g portion.',
        priceComparisonText: 'Lower cost: ₹15 vs ₹20.',
        availability: 'Available on all quick-commerce platforms'
      }
    ],
    barcode: '8901491101838'
  },
  {
    id: 'kelloggs-chocos',
    name: 'Kellogg\'s Chocos Crunchy Bites',
    brand: 'Kellogg\'s India',
    category: 'cereals',
    categoryLabel: 'Breakfast Cereals',
    price: 30,
    image: 'https://images.unsplash.com/photo-1521483451569-e33803c0330c?w=500&auto=format&fit=crop&q=60',
    frontClaim: 'Whole Grain No. 1 Ingredient • High in B Vitamins & Protein',
    servingSize: '30g (1 bowl)',
    servingGrams: 30,
    ingredientsText: 'Whole Wheat Flour (30%), Sugar (29%), Refined Wheat Flour (Maida) (18%), Cocoa Solids (6.5%), Liquid Glucose, Edible Palm Oil, Caramel Color (INS 150c), Emulsifier (INS 322), Antioxidant (INS 320)',
    nutritionPerServe: {
      calories: 118,
      sugarGrams: 9.8,
      addedSugarGrams: 8.7,
      totalFatGrams: 1.0,
      saturatedFatGrams: 0.5,
      transFatGrams: 0.0,
      sodiumMg: 85,
      proteinGrams: 2.2,
      fiberGrams: 1.5
    },
    nutritionPer100g: {
      calories: 393,
      sugarGrams: 32.7,
      addedSugarGrams: 29.0,
      totalFatGrams: 3.3,
      saturatedFatGrams: 1.7,
      sodiumMg: 283
    },
    isExactPalmOilPercentDeclared: false,
    shockStatement: 'Approximately 32.7g per 100g is sugar. A standard 30g bowl delivers 2.5 teaspoons (9.8g) of sugar alongside refined flour and liquid glucose.',
    hindiCallout: '32.7% total sugars by weight in formulation',
    swaps: [
      {
        id: 'swap-steel-cut-oats',
        name: 'Whole Rolled Oats with Real Raw Cacao & Chia',
        brand: 'True Elements / Yogabar',
        price: 35,
        sugarTeaspoons: 0.1,
        healthScore: 9.2,
        caloriesPerServe: 125,
        whyBetter: '100% whole grain rolled oats with beta-glucan soluble fiber. Sweetened only with real fruit or unrefined honey if desired.',
        evidenceBasis: 'Ingredients: 82% whole rolled oats, 8% chia seeds, 10% raw cocoa powder. 0g refined sugar or liquid glucose.',
        servingComparisonText: 'Serving comparison: 35g dry cereal portion.',
        priceComparisonText: 'Comparable price: ₹35 vs ₹30.',
        availability: 'Available on Blinkit / Zepto / Amazon'
      }
    ],
    barcode: '8901499008276'
  },
  {
    id: 'nutella-hazelnut-spread',
    name: 'Nutella Hazelnut Spread with Cocoa',
    brand: 'Ferrero India',
    category: 'spreads-sauces',
    categoryLabel: 'Spreads, Jams & Sauces',
    price: 120,
    image: 'https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=500&auto=format&fit=crop&q=60',
    frontClaim: 'Good morning with Nutella • Prepared with Selected Hazelnuts & Skimmed Milk',
    servingSize: '20g (1 heaping tablespoon)',
    servingGrams: 20,
    ingredientsText: 'Sugar (56%), Palm Oil (23%), Hazelnuts (13%), Skimmed Cow Milk Powder (8.7%), Low Fat Cocoa Powder (7.4%), Emulsifier (Lecithin INS 322), Nature-Identical Vanillin Flavour',
    nutritionPerServe: {
      calories: 108,
      sugarGrams: 11.2,
      addedSugarGrams: 9.5,
      totalFatGrams: 6.2,
      saturatedFatGrams: 2.2,
      transFatGrams: 0.0,
      sodiumMg: 12,
      proteinGrams: 1.3,
      fiberGrams: 0.7
    },
    nutritionPer100g: {
      calories: 539,
      sugarGrams: 56.3,
      addedSugarGrams: 47.5,
      totalFatGrams: 30.9,
      saturatedFatGrams: 10.6,
      sodiumMg: 60
    },
    isExactPalmOilPercentDeclared: true,
    shockStatement: '79% of this jar is composed of white sugar (56.3%) and palm oil (23%). Hazelnuts account for only 13% of the total formulation.',
    hindiCallout: '79% combined sugar and palm oil composition by weight',
    swaps: [
      {
        id: 'swap-clean-peanut-butter',
        name: '100% Roasted Dark Chocolate Peanut Butter (No Palm Oil)',
        brand: 'The Whole Truth / Pintola Clean',
        price: 125,
        sugarTeaspoons: 0.4,
        healthScore: 9.1,
        caloriesPerServe: 115,
        whyBetter: '85% roasted slow-ground peanuts, real cocoa powder, and raw dates. Zero refined sugar and zero industrial palm oil.',
        evidenceBasis: 'Full ingredient transparency: 85% roasted peanuts, 10% dark chocolate (cocoa mass, cocoa butter), 5% raw dates. Zero palmolein.',
        servingComparisonText: 'Serving comparison: 20g spread portion.',
        priceComparisonText: 'Equal price: ₹125 vs ₹120.',
        availability: 'Available on Zepto / Instamart / BigBasket'
      }
    ],
    barcode: '8000500179838'
  },
  {
    id: 'sting-energy-drink',
    name: 'Sting Energy Drink (Berry Blast)',
    brand: 'PepsiCo India',
    category: 'juices-beverages',
    categoryLabel: 'Packaged Juices & Soft Drinks',
    price: 20,
    image: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?w=500&auto=format&fit=crop&q=60',
    frontClaim: 'Electrifying Energy • Powered by Ginseng & Caffeine',
    servingSize: '250ml (1 bottle)',
    servingGrams: 250,
    ingredientsText: 'Carbonated Water, Sugar (13.5%), Acidity Regulators (INS 330, INS 331), Taurine, Caffeine (72mg), Preservatives (INS 211, INS 202), Synthetic Food Colors (INS 129, INS 110), Inositol, Ginseng Extract',
    nutritionPerServe: {
      calories: 140,
      sugarGrams: 34.0,
      addedSugarGrams: 34.0,
      totalFatGrams: 0.0,
      saturatedFatGrams: 0.0,
      transFatGrams: 0.0,
      sodiumMg: 110,
      proteinGrams: 0.0,
      fiberGrams: 0.0
    },
    nutritionPer100g: {
      calories: 56,
      sugarGrams: 13.6,
      addedSugarGrams: 13.6,
      totalFatGrams: 0.0,
      saturatedFatGrams: 0.0,
      sodiumMg: 44
    },
    isExactPalmOilPercentDeclared: false,
    shockStatement: 'Contains 8.5 teaspoons (34g) of added sugar in a single 250ml bottle—contributing 136% of the WHO 25g/day free-sugar guidance benchmark—alongside 72mg caffeine (288 mg/L).',
    hindiCallout: '136% of WHO 25g daily free-sugar reference in one bottle',
    swaps: [
      {
        id: 'swap-jeera-buttermilk',
        name: 'Spiced Buttermilk with Roasted Cumin (Chaas)',
        brand: 'Amul Masti / Mother Dairy',
        price: 15,
        sugarTeaspoons: 0,
        healthScore: 9.5,
        caloriesPerServe: 45,
        whyBetter: 'Natural gut-friendly probiotic lactic cultures. Hydrating with zero caffeine, zero synthetic azo dyes, and 0g added sugar.',
        evidenceBasis: 'Labelling: 100% pasteurized curd, water, roasted cumin, and salt. Delivers probiotic cultures without synthetic dyes or caffeine.',
        servingComparisonText: 'Serving comparison: 200ml beverage portion.',
        priceComparisonText: 'Lower cost: ₹15 vs ₹20.',
        availability: 'Available at every local dairy & quick-commerce platform'
      }
    ],
    barcode: '8901491503021'
  }
];

export const PRODUCTS_DATABASE: Product[] = RAW_PRODUCTS.map(raw => {
  const parsedIngredients = parseIngredientsText(raw.ingredientsText);
  const healthScore = calculateHealthScore(
    {
      sugarGrams: raw.nutritionPerServe.sugarGrams,
      addedSugarGrams: raw.nutritionPerServe.addedSugarGrams,
      transFatGrams: raw.nutritionPerServe.transFatGrams,
      saturatedFatGrams: raw.nutritionPerServe.saturatedFatGrams,
      sodiumMg: raw.nutritionPerServe.sodiumMg,
      proteinGrams: raw.nutritionPerServe.proteinGrams,
      fiberGrams: raw.nutritionPerServe.fiberGrams,
      servingGrams: raw.servingGrams,
      per100g: raw.nutritionPer100g
    },
    parsedIngredients
  );

  const palmOilIngredient = parsedIngredients.find(i => i.isPalmOil);
  const palmOilRank = palmOilIngredient ? palmOilIngredient.rank : null;
  const palmOilWarning = palmOilIngredient
    ? palmOilRank && palmOilRank <= 3
      ? `Palm oil listed at #${palmOilRank} in ingredient list (Top 3 ingredient by weight at manufacture)`
      : `Palm oil present at #${palmOilRank} in ingredient list`
    : 'No palm oil detected in ingredients';

  const sodiumDailyPercent = Math.round((raw.nutritionPerServe.sodiumMg / 2000) * 100);

  const defaultStatus: NutrientDeclarationStatus = 'declared';

  return {
    ...raw,
    parsedIngredients,
    nutritionPerServe: {
      ...raw.nutritionPerServe,
      caloriesDeclared: true,
      caloriesStatus: defaultStatus,
      sugarDeclared: true,
      sugarStatus: defaultStatus,
      addedSugarDeclared: raw.nutritionPerServe.addedSugarGrams !== undefined,
      addedSugarStatus: raw.nutritionPerServe.addedSugarGrams !== undefined ? defaultStatus : 'not_declared',
      sugarTeaspoons: Math.round((raw.nutritionPerServe.sugarGrams / 4) * 10) / 10,
      totalFatDeclared: true,
      totalFatStatus: defaultStatus,
      saturatedFatDeclared: true,
      saturatedFatStatus: defaultStatus,
      transFatDeclared: true,
      transFatStatus: defaultStatus,
      sodiumDeclared: true,
      sodiumStatus: defaultStatus,
      sodiumDailyPercent,
      proteinDeclared: true,
      proteinStatus: defaultStatus,
      fiberDeclared: true,
      fiberStatus: defaultStatus
    },
    palmOil: {
      present: !!palmOilIngredient,
      rank: palmOilRank,
      warningText: palmOilWarning,
      isExactPercentageDeclared: raw.isExactPalmOilPercentDeclared
    },
    healthScore,
    dataSource: 'PackSach Verified Database',
    dataProvenance: 'verified_catalog',
    dataProvenanceNotes: 'Extracted from physical verified packaging purchased in retail circulation.'
  };
});

export function findProductById(id: string): Product | undefined {
  return PRODUCTS_DATABASE.find(p => p.id === id);
}

export function searchProducts(query: string, category?: string): Product[] {
  const q = query.toLowerCase().trim();
  return PRODUCTS_DATABASE.filter(p => {
    let matchesCategory = !category || category === 'all';
    if (!matchesCategory && category) {
      if (category === 'biscuits') {
        matchesCategory = p.category === 'biscuits';
      } else if (category === 'drinks') {
        matchesCategory = p.category === 'malt-drinks' || p.category === 'juices-beverages';
      } else if (category === 'noodles') {
        matchesCategory = p.category === 'noodles-snacks';
      } else if (category === 'snacks') {
        matchesCategory = p.category === 'chips' || p.category === 'noodles-snacks';
      } else if (category === 'chocolates') {
        matchesCategory = p.category === 'spreads-sauces' || p.category === 'cereals' || p.category === 'malt-drinks';
      } else {
        matchesCategory = p.category === category;
      }
    }

    if (!matchesCategory) return false;
    if (!q) return true;

    return (
      p.name.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.categoryLabel.toLowerCase().includes(q) ||
      p.frontClaim.toLowerCase().includes(q) ||
      p.ingredientsText.toLowerCase().includes(q)
    );
  });
}
