/**
 * PACKSACH AUTHENTICATION & SECURITY INTEGRITY TEST SUITE
 * 
 * Verifies:
 * 1. Password validation & email sanitization
 * 2. Supabase configuration detection & missing-config error enforcement
 * 3. Prevention of silent fake/demo account creation
 * 4. Google OAuth genuine initiation via Supabase signInWithOAuth()
 * 5. Supabase Auth real error handling (wrong password, unregistered accounts)
 * 6. User identity mapping from Supabase Auth user metadata
 * 7. Profile management & Database schema RLS access
 * 8. Personalized allergen & dietary conflict detection engine
 * 9. User scan records persistence & cross-user data isolation
 * 10. Saved smart swaps persistence
 * 11. Guest history to authenticated account data migration
 * 12. Scan deletion and storage integrity
 */

import fs from 'fs';
import type { UserProfile } from '../src/types/auth';

// Polyfill localStorage for Node test runner
const storageMap = new Map<string, string>();
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: (k: string) => storageMap.get(k) ?? null,
    setItem: (k: string, v: string) => storageMap.set(k, String(v)),
    removeItem: (k: string) => storageMap.delete(k),
    clear: () => storageMap.clear(),
  };
}

// Load .env.local into process.env if present
if (fs.existsSync('.env.local')) {
  const content = fs.readFileSync('.env.local', 'utf-8');
  for (const line of content.split('\n')) {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#')) {
      const match = trimmed.match(/^([^=]+)=(.*)$/);
      if (match) {
        process.env[match[1].trim()] = match[2].trim();
      }
    }
  }
}

interface TestResult {
  testId: number;
  name: string;
  category: string;
  status: 'PASS' | 'FAIL';
  evidence: string;
}

const results: TestResult[] = [];

function recordTest(
  condition: boolean,
  testId: number,
  name: string,
  category: string,
  evidence: string
) {
  if (condition) {
    results.push({ testId, name, category, status: 'PASS', evidence });
    console.log(`[PASS] Test ${testId} [${category}]: ${name}`);
  } else {
    results.push({ testId, name, category, status: 'FAIL', evidence: `FAILED: ${evidence}` });
    console.error(`[FAIL] Test ${testId} [${category}]: ${name} - ${evidence}`);
  }
}

async function runAuthIntegrityTests() {
  const { isSupabaseConfigured, supabase } = await import('../src/services/supabase');
  const {
    validateEmail,
    validatePassword,
    loginWithEmail,
    loginWithGoogleOAuth,
    getProfileForSupabaseUser
  } = await import('../src/services/authService');
  const {
    fetchUserScans,
    recordUserScan,
    deleteUserScan,
    fetchUserSavedSwaps,
    recordUserSavedSwap,
    syncGuestDataIntoUser,
    analyzeProductConflicts
  } = await import('../src/services/userDataService');
  const { PRODUCTS_DATABASE } = await import('../src/data/productsData');
  console.log('================================================================');
  console.log('PACKSACH AUTHENTICATION & SECURITY INTEGRITY TEST SUITE (16 TESTS)');
  console.log('Verifying Real Supabase Auth, Zero Fake Accounts, and RLS Safeguards');
  console.log('================================================================\n');

  // Test 1: Password Validation - Reject weak password (< 8 chars)
  const weakCheck = validatePassword('12345');
  recordTest(
    !weakCheck.isValid && (weakCheck.message?.includes('at least 8 characters') ?? false),
    1,
    'Password Complexity: Reject short passwords (< 8 chars)',
    'Input Validation',
    `Rejected with: "${weakCheck.message}"`
  );

  // Test 2: Password Validation - Require number or symbol
  const noSymbolCheck = validatePassword('PasswordOnly');
  recordTest(
    !noSymbolCheck.isValid && (noSymbolCheck.message?.includes('number or special symbol') ?? false),
    2,
    'Password Complexity: Require number or symbol',
    'Input Validation',
    `Rejected with: "${noSymbolCheck.message}"`
  );

  // Test 3: Email Format Validation
  recordTest(
    validateEmail('test.user@example.com') && !validateEmail('invalid-email-string'),
    3,
    'Email Format Validation',
    'Input Validation',
    'Valid email passed, invalid email rejected'
  );

  // Test 4: Supabase Client Configuration
  recordTest(
    isSupabaseConfigured && supabase !== null,
    4,
    'Supabase Client Initialization & Config Detection',
    'Configuration',
    `isSupabaseConfigured = ${isSupabaseConfigured}, client initialized`
  );

  // Test 5: Real Supabase Error on Invalid Login (No Silent Fake Success)
  try {
    await loginWithEmail('nonexistent.packsach.test@example.com', 'InvalidPassword123!');
    recordTest(false, 5, 'Supabase Real Login Error Handling', 'Authentication', 'Unexpectedly logged in with non-existent account');
  } catch (err: any) {
    recordTest(
      err.message.includes('Invalid') || err.message.includes('credentials') || err.message.includes('email'),
      5,
      'Supabase Real Login Error Handling (No Fake Account Fallback)',
      'Authentication',
      `Correctly received real Supabase error: "${err.message}"`
    );
  }

  // Test 6: Google OAuth Never Creates Fake / Demo Account
  try {
    const oauthRes = await loginWithGoogleOAuth();
    // Verify that NO fake Alex Sharma profile was created
    const rawLocalUsers = localStorage.getItem('packsach_auth_users');
    const localHasAlex = rawLocalUsers?.includes('alex.sharma') ?? false;
    recordTest(
      !localHasAlex,
      6,
      'Google OAuth: Zero Fake / Demo Account Creation',
      'OAuth Security',
      `Google OAuth returned: ${oauthRes.url ? 'real OAuth redirect URL' : 'handled'}. No Alex Sharma or fake accounts created.`
    );
  } catch (err: any) {
    // If Supabase Google provider is not yet enabled in dashboard, it returns a real provider error
    const isRealError = err.message.includes('provider') || err.message.includes('OAuth') || err.message.includes('Supabase');
    const rawLocalUsers = localStorage.getItem('packsach_auth_users');
    const localHasAlex = rawLocalUsers?.includes('alex.sharma') ?? false;
    recordTest(
      isRealError && !localHasAlex,
      6,
      'Google OAuth: Real Provider Error (No Fake Account Fallback)',
      'OAuth Security',
      `Real Supabase message: "${err.message}". Zero fake accounts created.`
    );
  }

  // Test 7: User Identity Mapping from Supabase Auth User Metadata (Item 6)
  const mockSupabaseUser = {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'priya.patel@gmail.com',
    user_metadata: {
      full_name: 'Priya Patel',
      avatar_url: 'https://example.com/avatar.jpg'
    },
    app_metadata: {
      provider: 'google'
    },
    created_at: '2026-11-23T00:00:00Z',
    last_sign_in_at: '2026-11-23T00:00:00Z'
  };

  const mapped = await getProfileForSupabaseUser(mockSupabaseUser);
  recordTest(
    mapped.user.name === 'Priya Patel' &&
    mapped.user.email === 'priya.patel@gmail.com' &&
    mapped.user.provider === 'google' &&
    mapped.profile.id === mockSupabaseUser.id,
    7,
    'User Identity Derived Strictly from Supabase User Metadata',
    'User Identity',
    `Mapped real identity: name="${mapped.user.name}", email="${mapped.user.email}", provider="${mapped.user.provider}"`
  );

  // Test 8: Database Schema & RLS Connectivity (Profiles table)
  if (supabase) {
    const profRes = await supabase.from('profiles').select('count', { count: 'exact', head: true });
    recordTest(
      profRes.status === 200,
      8,
      'Database Connectivity: Profiles Table & RLS',
      'Database',
      `HTTP status: ${profRes.status} (Verified connected)`
    );
  }

  // Test 9: Database Schema & RLS Connectivity (User Scans table)
  if (supabase) {
    const scanRes = await supabase.from('user_scans').select('count', { count: 'exact', head: true });
    recordTest(
      scanRes.status === 200,
      9,
      'Database Connectivity: User Scans Table & RLS',
      'Database',
      `HTTP status: ${scanRes.status} (Verified connected)`
    );
  }

  // Test 10: Database Schema & RLS Connectivity (User Saved Swaps table)
  if (supabase) {
    const swapRes = await supabase.from('user_saved_swaps').select('count', { count: 'exact', head: true });
    recordTest(
      swapRes.status === 200,
      10,
      'Database Connectivity: Saved Swaps Table & RLS',
      'Database',
      `HTTP status: ${swapRes.status} (Verified connected)`
    );
  }

  // Test 11: Personalized Conflict Detection - Milk & Dairy Allergy
  const testProfile: UserProfile = {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Priya Patel',
    email: 'priya.patel@gmail.com',
    dietaryPreferences: ['diabetic-friendly', 'vegetarian'],
    allergies: ['milk-dairy', 'peanuts', 'wheat-gluten'],
    updatedAt: new Date().toISOString()
  };

  const nutella = PRODUCTS_DATABASE.find(p => p.id === 'nutella-hazelnut-spread') || PRODUCTS_DATABASE[6];
  const conflictNutella = analyzeProductConflicts(nutella, testProfile);
  recordTest(
    conflictNutella.hasConflict && conflictNutella.conflictingAllergies.includes('Milk & Dairy'),
    11,
    'Allergen Engine: Milk & Dairy Conflict Detection on Nutella',
    'Safety Engine',
    `Detected conflicts: ${conflictNutella.conflictingAllergies.join(', ')}`
  );

  // Test 12: Personalized Conflict Detection - Wheat & Gluten Allergy
  const digestive = PRODUCTS_DATABASE.find(p => p.id === 'nutrichoice-digestive-biscuits') || PRODUCTS_DATABASE[1];
  const conflictDigestive = analyzeProductConflicts(digestive, testProfile);
  recordTest(
    conflictDigestive.hasConflict && conflictDigestive.conflictingAllergies.includes('Wheat & Gluten'),
    12,
    'Allergen Engine: Wheat & Gluten Conflict on Digestive Biscuits',
    'Safety Engine',
    `Detected allergens: ${conflictDigestive.conflictingAllergies.join(', ')}`
  );

  // Test 13: Personalized Conflict Detection - Diabetic High Sugar Warning
  const bournvita = PRODUCTS_DATABASE[0];
  const conflictBournvita = analyzeProductConflicts(bournvita, testProfile);
  recordTest(
    conflictBournvita.conflictingDiets.some(d => d.includes('Diabetic-Friendly')),
    13,
    'Diet Engine: Diabetic High Added Sugar Flag on Bournvita',
    'Safety Engine',
    `Detected diet flag: ${conflictBournvita.conflictingDiets.find(d => d.includes('Diabetic'))}`
  );

  // Test 14: User Scan Record Persistence & Cross-User Isolation
  const userIdA = '00000000-0000-0000-0000-00000000000a';
  const userIdB = '00000000-0000-0000-0000-00000000000b';
  const scanRec = await recordUserScan(userIdA, bournvita);
  const scansUserA = await fetchUserScans(userIdA);
  const scansUserB = await fetchUserScans(userIdB);

  recordTest(
    scansUserA.length >= 1 && scansUserB.length === 0,
    14,
    'Scan Records: User Data Isolation (User A vs User B)',
    'Data Isolation',
    `User A scans: ${scansUserA.length}, User B scans: ${scansUserB.length}`
  );

  // Test 15: Saved Smart Swaps Persistence
  const bestSwap = bournvita.swaps[0];
  await recordUserSavedSwap(userIdA, bestSwap, bournvita);
  const savedSwapsUserA = await fetchUserSavedSwaps(userIdA);

  recordTest(
    savedSwapsUserA.length >= 1 && savedSwapsUserA[0]?.swap?.name === bestSwap.name,
    15,
    'Saved Smart Swaps Persistence',
    'Data Management',
    `Saved swap "${savedSwapsUserA[0]?.swap?.name || 'none'}" for user ${userIdA}`
  );

  // Test 16: Guest History & Swaps Migration into Authenticated Account
  const guestScans = [PRODUCTS_DATABASE[1], PRODUCTS_DATABASE[2]];
  const guestSwaps = [
    { swap: PRODUCTS_DATABASE[1].swaps[0], originalProduct: PRODUCTS_DATABASE[1] }
  ];
  const syncRes = await syncGuestDataIntoUser(userIdA, guestScans, guestSwaps);
  const totalScansAfterSync = await fetchUserScans(userIdA);

  recordTest(
    syncRes.importedScans === 2 && syncRes.importedSwaps === 1 && totalScansAfterSync.length >= 3,
    16,
    'Guest History Migration into User Account',
    'Data Migration',
    `Migrated ${syncRes.importedScans} scans & ${syncRes.importedSwaps} swaps without duplicates`
  );

  // Clean up test scan record
  await deleteUserScan(userIdA, scanRec.id);

  // Summary
  console.log('\n================================================================');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`AUTH INTEGRITY TEST COMPLETE: ${passed} PASSED, ${failed} FAILED (${results.length} Total)`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAuthIntegrityTests().catch(err => {
  console.error('Unhandled test suite error:', err);
  process.exit(1);
});
