import { supabase, isSupabaseConfigured } from './supabase';
import type { UserScanRecord, UserSavedSwapRecord, UserProfile } from '../types/auth';
import type { Product, SmartSwap } from '../types/product';
import { ALLERGY_OPTIONS } from '../types/auth';

function getUserScanStorageKey(userId: string): string {
  return `packsach_user_scans_${userId}`;
}

function getUserSwapStorageKey(userId: string): string {
  return `packsach_user_swaps_${userId}`;
}

export async function fetchUserScans(userId: string): Promise<UserScanRecord[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('user_scans')
      .select('*')
      .eq('user_id', userId)
      .order('scanned_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const scans = data.map(row => ({
        id: row.id,
        userId: row.user_id,
        productId: row.product_id,
        productName: row.product_name,
        brand: row.brand,
        category: row.category,
        healthScore: Number(row.health_score),
        sugarTeaspoons: Number(row.sugar_teaspoons),
        sodiumMg: Number(row.sodium_mg),
        imageUrl: row.image_url,
        scannedAt: row.scanned_at,
        productData: row.product_data as Product
      }));
      try {
        localStorage.setItem(getUserScanStorageKey(userId), JSON.stringify(scans));
      } catch {}
      return scans;
    }
  }

  try {
    const raw = localStorage.getItem(getUserScanStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function recordUserScan(userId: string, product: Product): Promise<UserScanRecord> {
  const scanRecord: UserScanRecord = {
    id: `scan_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    productId: product.id,
    productName: product.name,
    brand: product.brand,
    category: product.category,
    healthScore: product.healthScore.score,
    sugarTeaspoons: product.nutritionPerServe.sugarTeaspoons,
    sodiumMg: product.nutritionPerServe.sodiumMg,
    imageUrl: product.image,
    scannedAt: new Date().toISOString(),
    productData: product
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('user_scans')
      .insert({
        user_id: userId,
        product_id: product.id,
        product_name: product.name,
        brand: product.brand,
        category: product.category,
        health_score: product.healthScore.score,
        sugar_teaspoons: product.nutritionPerServe.sugarTeaspoons,
        sodium_mg: product.nutritionPerServe.sodiumMg,
        image_url: product.image,
        product_data: product
      })
      .select()
      .single();

    if (!error && data) {
      scanRecord.id = data.id;
    }
  }

  // Always update user-partitioned local cache
  try {
    const raw = localStorage.getItem(getUserScanStorageKey(userId));
    const existing: UserScanRecord[] = raw ? JSON.parse(raw) : [];
    const filtered = existing.filter(s => s.productId !== product.id);
    const updated = [scanRecord, ...filtered].slice(0, 50);
    localStorage.setItem(getUserScanStorageKey(userId), JSON.stringify(updated));
  } catch (e) {
    console.warn('Error caching user scan:', e);
  }

  return scanRecord;
}

export async function deleteUserScan(userId: string, scanId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase
      .from('user_scans')
      .delete()
      .eq('id', scanId)
      .eq('user_id', userId);
  }

  try {
    const raw = localStorage.getItem(getUserScanStorageKey(userId));
    const existing: UserScanRecord[] = raw ? JSON.parse(raw) : [];
    const updated = existing.filter(s => s.id !== scanId);
    localStorage.setItem(getUserScanStorageKey(userId), JSON.stringify(updated));
  } catch (e) {
    console.warn('Error deleting user scan:', e);
  }
}

export async function clearAllUserScans(userId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase
      .from('user_scans')
      .delete()
      .eq('user_id', userId);
  }

  try {
    localStorage.removeItem(getUserScanStorageKey(userId));
  } catch (e) {
    console.warn('Error clearing user scans:', e);
  }
}

export async function fetchUserSavedSwaps(userId: string): Promise<UserSavedSwapRecord[]> {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('user_saved_swaps')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });

    if (!error && data && data.length > 0) {
      const swaps = data.map(row => ({
        id: row.id,
        userId: row.user_id,
        swapId: row.swap_id,
        swap: row.swap_data as SmartSwap,
        originalProduct: row.original_product,
        addedAt: row.created_at
      }));
      try {
        localStorage.setItem(getUserSwapStorageKey(userId), JSON.stringify(swaps));
      } catch {}
      return swaps;
    }
  }

  try {
    const raw = localStorage.getItem(getUserSwapStorageKey(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export async function recordUserSavedSwap(
  userId: string,
  swap: SmartSwap,
  currentProduct: Product
): Promise<UserSavedSwapRecord> {
  const swapRecord: UserSavedSwapRecord = {
    id: `uswap_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
    userId,
    swapId: swap.id,
    swap,
    originalProduct: {
      name: currentProduct.name,
      brand: currentProduct.brand,
      price: currentProduct.price,
      sugarTeaspoons: currentProduct.nutritionPerServe.sugarTeaspoons
    },
    addedAt: new Date().toISOString()
  };

  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('user_saved_swaps')
      .insert({
        user_id: userId,
        swap_id: swap.id,
        swap_data: swap,
        original_product: swapRecord.originalProduct
      })
      .select()
      .single();

    if (!error && data) {
      swapRecord.id = data.id;
    }
  }

  try {
    const raw = localStorage.getItem(getUserSwapStorageKey(userId));
    const existing: UserSavedSwapRecord[] = raw ? JSON.parse(raw) : [];
    const exists = existing.some(s => s.swapId === swap.id);
    if (!exists) {
      const updated = [swapRecord, ...existing];
      localStorage.setItem(getUserSwapStorageKey(userId), JSON.stringify(updated));
    }
  } catch (e) {
    console.warn('Error saving user swap:', e);
  }

  return swapRecord;
}

export async function removeUserSavedSwap(userId: string, idOrSwapId: string): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase
      .from('user_saved_swaps')
      .delete()
      .or(`id.eq.${idOrSwapId},swap_id.eq.${idOrSwapId}`)
      .eq('user_id', userId);
  }

  try {
    const raw = localStorage.getItem(getUserSwapStorageKey(userId));
    const existing: UserSavedSwapRecord[] = raw ? JSON.parse(raw) : [];
    const updated = existing.filter(s => s.id !== idOrSwapId && s.swapId !== idOrSwapId);
    localStorage.setItem(getUserSwapStorageKey(userId), JSON.stringify(updated));
  } catch (e) {
    console.warn('Error removing user swap:', e);
  }
}

/**
 * Migrates local guest history and saved swaps into the user's permanent account
 */
export async function syncGuestDataIntoUser(
  userId: string,
  guestHistory: Product[],
  guestSwaps: Array<{ swap: SmartSwap; originalProduct: any }>
): Promise<{ importedScans: number; importedSwaps: number }> {
  let importedScans = 0;
  let importedSwaps = 0;

  for (const product of guestHistory) {
    try {
      await recordUserScan(userId, product);
      importedScans++;
    } catch (e) {
      console.warn('Sync scan error:', e);
    }
  }

  for (const item of guestSwaps) {
    try {
      await recordUserSavedSwap(userId, item.swap, item.originalProduct as Product);
      importedSwaps++;
    } catch (e) {
      console.warn('Sync swap error:', e);
    }
  }

  return { importedScans, importedSwaps };
}

export interface ProductConflictAnalysis {
  hasConflict: boolean;
  conflictingAllergies: string[];
  conflictingDiets: string[];
}

/**
 * Cross-references product ingredient label and nutrition declaration against
 * user's personal dietary goals and food allergy restrictions.
 */
export function analyzeProductConflicts(
  product: Product,
  profile: UserProfile | null
): ProductConflictAnalysis {
  if (!profile) {
    return { hasConflict: false, conflictingAllergies: [], conflictingDiets: [] };
  }

  const ingText = (product.ingredientsText || '').toLowerCase();
  const conflictingAllergies: string[] = [];

  for (const allergyId of profile.allergies) {
    const option = ALLERGY_OPTIONS.find((o) => o.id === allergyId);
    if (option) {
      const matched = option.keywords.some((kw) => ingText.includes(kw.toLowerCase()));
      if (matched) {
        conflictingAllergies.push(option.label);
      }
    }
  }

  const conflictingDiets: string[] = [];
  const sugarGrams = product.nutritionPerServe?.sugarGrams || 0;
  const sodiumMg = product.nutritionPerServe?.sodiumMg || 0;

  for (const diet of profile.dietaryPreferences) {
    if (diet === 'vegan') {
      const hasDairyOrAnimal = [
        'milk',
        'dairy',
        'whey',
        'butter',
        'ghee',
        'cheese',
        'honey',
        'gelatin',
        'milk solids',
        'egg',
        'meat',
        'fish'
      ].some((kw) => ingText.includes(kw));
      if (hasDairyOrAnimal) {
        conflictingDiets.push('100% Vegan (contains animal derivatives)');
      }
    }
    if (diet === 'vegetarian') {
      const hasNonVeg = ['gelatin', 'fish', 'meat', 'chicken', 'egg'].some((kw) =>
        ingText.includes(kw)
      );
      if (hasNonVeg) {
        conflictingDiets.push('Vegetarian (contains non-veg/gelatin)');
      }
    }
    if (diet === 'jain') {
      const hasRoot = ['onion', 'garlic', 'potato', 'carrot', 'ginger', 'radish'].some((kw) =>
        ingText.includes(kw)
      );
      if (hasRoot) {
        conflictingDiets.push('Jain Diet (contains root ingredients)');
      }
    }
    if (diet === 'diabetic-friendly') {
      if (sugarGrams > 5 || ingText.includes('maltodextrin') || ingText.includes('high fructose')) {
        conflictingDiets.push('Diabetic-Friendly (High sugar/maltodextrin)');
      }
    }
    if (diet === 'low-sodium') {
      if (sodiumMg > 300) {
        conflictingDiets.push('Low Sodium (Serving exceeds 300mg sodium)');
      }
    }
    if (diet === 'gluten-free') {
      const hasGluten = ['wheat', 'maida', 'atta', 'barley', 'malt', 'rye', 'suji'].some((kw) =>
        ingText.includes(kw)
      );
      if (hasGluten) {
        conflictingDiets.push('Gluten-Free (contains wheat/gluten)');
      }
    }
  }

  return {
    hasConflict: conflictingAllergies.length > 0 || conflictingDiets.length > 0,
    conflictingAllergies,
    conflictingDiets
  };
}
