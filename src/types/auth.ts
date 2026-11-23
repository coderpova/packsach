import type { Product, SmartSwap } from './product';

export type DietaryPreference =
  | 'vegetarian'
  | 'vegan'
  | 'jain'
  | 'diabetic-friendly'
  | 'keto'
  | 'low-sodium'
  | 'gluten-free'
  | 'halal'
  | 'organic-only';

export interface DietaryPreferenceOption {
  id: DietaryPreference;
  label: string;
  description: string;
  badgeColor: string;
}

export const DIETARY_PREFERENCES: DietaryPreferenceOption[] = [
  {
    id: 'vegetarian',
    label: 'Vegetarian',
    description: 'No meat, poultry, fish, or slaughter by-products (Green Dot)',
    badgeColor: 'bg-emerald-50 text-emerald-700 border-emerald-200'
  },
  {
    id: 'vegan',
    label: '100% Vegan',
    description: 'Zero animal ingredients (no dairy, milk solids, honey, gelatin)',
    badgeColor: 'bg-green-50 text-green-700 border-green-200'
  },
  {
    id: 'jain',
    label: 'Jain Diet',
    description: 'Strict vegetarian with zero root vegetables (no onion, garlic, potatoes)',
    badgeColor: 'bg-amber-50 text-amber-800 border-amber-200'
  },
  {
    id: 'diabetic-friendly',
    label: 'Diabetic-Friendly',
    description: 'Alert on added sugars, high glycemic index syrups, and maltodextrin',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200'
  },
  {
    id: 'low-sodium',
    label: 'Low Sodium / Heart Health',
    description: 'Strict alert when single serving exceeds 15% of daily sodium limit',
    badgeColor: 'bg-rose-50 text-rose-700 border-rose-200'
  },
  {
    id: 'gluten-free',
    label: 'Gluten-Free',
    description: 'Celiac safety: flags wheat, maida, barley, malt extract, and rye',
    badgeColor: 'bg-orange-50 text-orange-700 border-orange-200'
  },
  {
    id: 'keto',
    label: 'Keto / Low Carb',
    description: 'Flags refined carbs, flour, maltodextrin, and total sugars > 5g',
    badgeColor: 'bg-purple-50 text-purple-700 border-purple-200'
  },
  {
    id: 'halal',
    label: 'Halal Certified',
    description: 'No non-halal animal fats, gelatin, or alcohol derivatives',
    badgeColor: 'bg-teal-50 text-teal-700 border-teal-200'
  }
];

export type AllergyPreference =
  | 'peanuts'
  | 'tree-nuts'
  | 'milk-dairy'
  | 'wheat-gluten'
  | 'soy'
  | 'egg'
  | 'fish-seafood'
  | 'sesame'
  | 'sulfites'
  | 'mustard';

export interface AllergyOption {
  id: AllergyPreference;
  label: string;
  keywords: string[];
}

export const ALLERGY_OPTIONS: AllergyOption[] = [
  {
    id: 'milk-dairy',
    label: 'Milk & Dairy',
    keywords: ['milk', 'dairy', 'lactose', 'whey', 'casein', 'butter', 'ghee', 'cheese', 'milk solids']
  },
  {
    id: 'wheat-gluten',
    label: 'Wheat & Gluten',
    keywords: ['wheat', 'gluten', 'maida', 'atta', 'barley', 'malt', 'rye', 'suji', 'semolina']
  },
  {
    id: 'peanuts',
    label: 'Peanuts',
    keywords: ['peanut', 'peanuts', 'groundnut', 'arachis']
  },
  {
    id: 'tree-nuts',
    label: 'Tree Nuts (Almond, Cashew, Walnut)',
    keywords: ['almond', 'cashew', 'walnut', 'pistachio', 'hazelnut', 'macadamia', 'pecan']
  },
  {
    id: 'soy',
    label: 'Soy & Soya',
    keywords: ['soy', 'soya', 'soybean', 'soy lecithin', 'ins 322', 'soya protein']
  },
  {
    id: 'egg',
    label: 'Egg Products',
    keywords: ['egg', 'albumin', 'egg yolk', 'egg white', 'lysozyme', 'lecithin (egg)']
  },
  {
    id: 'fish-seafood',
    label: 'Fish & Shellfish',
    keywords: ['fish', 'crustacean', 'shrimp', 'crab', 'prawn', 'gelatin (fish)']
  },
  {
    id: 'sesame',
    label: 'Sesame Seeds (Til)',
    keywords: ['sesame', 'til', 'tahini', 'gingelly']
  },
  {
    id: 'mustard',
    label: 'Mustard (Sarson / Rai)',
    keywords: ['mustard', 'sarson', 'rai']
  },
  {
    id: 'sulfites',
    label: 'Sulfites (INS 220–228)',
    keywords: ['sulfite', 'sulphite', 'ins 220', 'ins 221', 'ins 222', 'ins 223', 'ins 224']
  }
];

export interface User {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
  createdAt: string;
  lastSignInAt?: string;
  provider: 'email' | 'google';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  dietaryPreferences: DietaryPreference[];
  allergies: AllergyPreference[];
  dailyCalorieTarget?: number;
  maxSugarDailyGrams?: number;
  maxSodiumDailyMg?: number;
  updatedAt: string;
}

export interface UserScanRecord {
  id: string;
  userId: string;
  productId: string;
  productName: string;
  brand: string;
  category: string;
  healthScore: number;
  sugarTeaspoons: number;
  sodiumMg: number;
  imageUrl?: string;
  scannedAt: string;
  productData: Product;
}

export interface UserSavedSwapRecord {
  id: string;
  userId: string;
  swapId: string;
  swap: SmartSwap;
  originalProduct: {
    name: string;
    brand: string;
    price: number;
    sugarTeaspoons: number;
  };
  addedAt: string;
}

export interface AuthSession {
  user: User;
  token: string;
  expiresAt: number;
}
