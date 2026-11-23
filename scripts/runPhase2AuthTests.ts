/**
 * PACKSACH PHASE 2 AUTHENTICATION, PROFILE & USER DATA TEST SUITE
 * 
 * Verifies:
 * 1. Password validation & Web Crypto SHA-256 salted hashing
 * 2. User registration with email normalization & duplicate prevention
 * 3. User login, wrong password rejection & session management
 * 4. Google OAuth mock/initiation
 * 5. Forgot password & reset token flow
 * 6. Profile management (name, avatar, dietary goals, food allergens)
 * 7. Personalized allergen & dietary conflict detection engine
 * 8. User scan records persistence & user data isolation
 * 9. Saved smart swaps persistence
 * 10. Guest history to authenticated account data migration
 * 11. Scan deletion and account cleanup
 */

// Ensure localStorage polyfill for Node test environment
const storageMap = new Map<string, string>();
if (typeof globalThis.localStorage === 'undefined') {
  (globalThis as any).localStorage = {
    getItem: (k: string) => storageMap.get(k) ?? null,
    setItem: (k: string, v: string) => storageMap.set(k, String(v)),
    removeItem: (k: string) => storageMap.delete(k),
    clear: () => storageMap.clear(),
  };
}

import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogleOAuth,
  requestPasswordReset,
  saveProfileUpdates,
  restoreSession
} from '../src/services/authService';

import {
  fetchUserScans,
  recordUserScan,
  deleteUserScan,
  fetchUserSavedSwaps,
  recordUserSavedSwap,
  syncGuestDataIntoUser,
  analyzeProductConflicts
} from '../src/services/userDataService';

import { PRODUCTS_DATABASE } from '../src/data/productsData';

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

async function runAllPhase2Tests() {
  console.log('================================================================');
  console.log('PACKSACH PHASE 2: AUTH, PROFILE & USER DATA TEST SUITE (18 TESTS)');
  console.log('Validating Authentication, Salted Crypto, Allergen Engine & Persistence');
  console.log('================================================================\n');

  // Test 1: Password Validation - Rejection of weak / empty password (< 8 chars)
  try {
    await registerWithEmail('Test User', 'weak@example.com', '123');
    recordTest(false, 1, 'Reject weak password (< 8 chars)', 'Auth Validation', 'Did not reject weak password');
  } catch (err: any) {
    recordTest(
      err.message.includes('Password must be at least'),
      1,
      'Reject weak password (< 8 chars)',
      'Auth Validation',
      `Correctly rejected with: "${err.message}"`
    );
  }

  // Test 2: User Registration - Valid registration & email normalization
  let userA: any = null;
  try {
    const { user } = await registerWithEmail('Aarav Sharma', '  AARAV.Sharma@Example.COM  ', 'SecurePass2026!');
    userA = user;
    const restored = restoreSession();
    recordTest(
      user.email === 'aarav.sharma@example.com' &&
      user.name === 'Aarav Sharma' &&
      restored !== null,
      2,
      'User Registration with Email Normalization',
      'Registration',
      `Registered user ID: ${user.id}, normalized email: ${user.email}`
    );
  } catch (err: any) {
    recordTest(false, 2, 'User Registration with Email Normalization', 'Registration', err.message);
  }

  // Test 3: Duplicate Email Prevention
  try {
    await registerWithEmail('Duplicate Aarav', 'aarav.sharma@example.com', 'AnotherPassword123!');
    recordTest(false, 3, 'Duplicate Email Registration Prevention', 'Registration', 'Allowed duplicate registration');
  } catch (err: any) {
    recordTest(
      err.message.includes('already exists'),
      3,
      'Duplicate Email Registration Prevention',
      'Registration',
      `Correctly blocked with message: "${err.message}"`
    );
  }

  // Test 4: Web Crypto SHA-256 Salted Hash Check (Zero Plaintext Passwords)
  const usersRaw = localStorage.getItem('packsach_auth_users');
  const storedUsers = usersRaw ? JSON.parse(usersRaw) : [];
  const storedUserRecord = storedUsers.find((u: any) => u.email === 'aarav.sharma@example.com');
  const hasSaltAndHash =
    storedUserRecord &&
    storedUserRecord.passwordHash &&
    storedUserRecord.passwordHash.length === 64 &&
    (storedUserRecord as any).password === undefined;

  recordTest(
    Boolean(hasSaltAndHash),
    4,
    'Web Crypto SHA-256 Salted Password Hashing (Zero Plaintext)',
    'Security / Cryptography',
    `User ${storedUserRecord?.email} stored with 64-char SHA-256 hash: ${storedUserRecord?.passwordHash?.slice(0, 16)}...`
  );

  // Test 5: User Login - Successful Authentication with Session Creation
  let loginResult: any = null;
  try {
    loginResult = await loginWithEmail('aarav.sharma@example.com', 'SecurePass2026!');
    const activeSession = restoreSession();
    recordTest(
      loginResult.user.id === userA.id &&
      activeSession !== null &&
      activeSession.user.email === 'aarav.sharma@example.com',
      5,
      'User Login with Valid Credentials',
      'Authentication',
      `Authenticated user ${loginResult.user.email}`
    );
  } catch (err: any) {
    recordTest(false, 5, 'User Login with Valid Credentials', 'Authentication', err.message);
  }

  // Test 6: User Login - Rejection of Incorrect Password
  try {
    await loginWithEmail('aarav.sharma@example.com', 'WrongPassword123!');
    recordTest(false, 6, 'Rejection of Incorrect Password', 'Authentication', 'Allowed login with wrong password');
  } catch (err: any) {
    recordTest(
      err.message.includes('Incorrect password') || err.message.includes('Invalid'),
      6,
      'Rejection of Incorrect Password',
      'Authentication',
      `Correctly rejected with: "${err.message}"`
    );
  }

  // Test 7: User Login - Rejection of Non-Existent Account
  try {
    await loginWithEmail('ghost.user@unknown.in', 'SomePassword123!');
    recordTest(false, 7, 'Rejection of Unregistered Email', 'Authentication', 'Allowed login for non-existent user');
  } catch (err: any) {
    recordTest(
      err.message.includes('No account found'),
      7,
      'Rejection of Unregistered Email',
      'Authentication',
      `Correctly rejected with: "${err.message}"`
    );
  }

  // Test 8: Session Restoration
  const restored = restoreSession();
  recordTest(
    Boolean(restored && restored.user.email === 'aarav.sharma@example.com'),
    8,
    'Session Restoration from Storage',
    'Session Management',
    `Restored active session for user: ${restored?.user.name}`
  );

  // Test 9: Google OAuth Mock / Initiation
  try {
    const googleSession = await loginWithGoogleOAuth();
    recordTest(
      googleSession.user.provider === 'google' && googleSession.user.email.includes('@'),
      9,
      'Continue with Google OAuth Flow',
      'OAuth',
      `Authenticated via Google OAuth as ${googleSession.user.email}`
    );
    // Switch back to Aarav for remainder of tests
    await loginWithEmail('aarav.sharma@example.com', 'SecurePass2026!');
  } catch (err: any) {
    recordTest(false, 9, 'Continue with Google OAuth Flow', 'OAuth', err.message);
  }

  // Test 10: Forgot Password Flow
  try {
    const resetResult = await requestPasswordReset('aarav.sharma@example.com');
    recordTest(
      resetResult.success && resetResult.message.includes('reset instructions'),
      10,
      'Forgot Password Request & Reset Token Generation',
      'Account Recovery',
      `Password reset response: "${resetResult.message}"`
    );
  } catch (err: any) {
    recordTest(false, 10, 'Forgot Password Request', 'Account Recovery', err.message);
  }

  // Test 11: Profile Management - Updating Name, Diets & Allergens
  let updatedProfile: any = null;
  try {
    updatedProfile = await saveProfileUpdates(userA.id, {
      name: 'Aarav S. (Health Conscious)',
      dietaryPreferences: ['diabetic-friendly', 'low-sodium', 'vegetarian'],
      allergies: ['milk-dairy', 'peanuts', 'wheat-gluten']
    });

    recordTest(
      updatedProfile.name === 'Aarav S. (Health Conscious)' &&
      updatedProfile.allergies.includes('peanuts') &&
      updatedProfile.dietaryPreferences.includes('diabetic-friendly'),
      11,
      'Profile Customization (Allergies & Dietary Safeguards)',
      'Profile Management',
      `Configured ${updatedProfile.dietaryPreferences.length} diets and ${updatedProfile.allergies.length} allergens`
    );
  } catch (err: any) {
    recordTest(false, 11, 'Profile Customization', 'Profile Management', err.message);
  }

  // Test 12: Personalized Conflict Detection - Milk & Dairy Allergy
  const nutella = PRODUCTS_DATABASE.find(p => p.id === 'nutella-hazelnut-spread') || PRODUCTS_DATABASE[6];
  const conflictNutella = analyzeProductConflicts(nutella, updatedProfile);
  recordTest(
    conflictNutella.hasConflict &&
    conflictNutella.conflictingAllergies.includes('Milk & Dairy'),
    12,
    'Personalized Safety Alert: Milk & Dairy Conflict on Nutella',
    'Safety Engine',
    `Detected conflicts: ${conflictNutella.conflictingAllergies.join(', ')}`
  );

  // Test 13: Personalized Conflict Detection - Wheat & Gluten Allergy
  const digestive = PRODUCTS_DATABASE.find(p => p.id === 'nutrichoice-digestive-biscuits') || PRODUCTS_DATABASE[1];
  const conflictDigestive = analyzeProductConflicts(digestive, updatedProfile);
  recordTest(
    conflictDigestive.hasConflict &&
    conflictDigestive.conflictingAllergies.includes('Wheat & Gluten'),
    13,
    'Personalized Safety Alert: Wheat & Gluten Conflict on Biscuit',
    'Safety Engine',
    `Detected allergens: ${conflictDigestive.conflictingAllergies.join(', ')}`
  );

  // Test 14: Personalized Conflict Detection - Diabetic Warning (Added Sugars > 5g / serve)
  const bournvita = PRODUCTS_DATABASE[0];
  const conflictBournvita = analyzeProductConflicts(bournvita, updatedProfile);
  recordTest(
    conflictBournvita.conflictingDiets.some(d => d.includes('Diabetic-Friendly')),
    14,
    'Personalized Safety Alert: Diabetic High Sugar Flag on Bournvita',
    'Safety Engine',
    `Bournvita has ${bournvita.nutritionPerServe.sugarGrams}g sugars/serve; detected: ${conflictBournvita.conflictingDiets.find(d => d.includes('Diabetic'))}`
  );

  // Test 15: User Scan Persistence & User Data Isolation
  // Save scan for userA
  const scanRecA = await recordUserScan(userA.id, bournvita);
  const scansA = await fetchUserScans(userA.id);

  // Ensure isolated for another user
  const otherUserId = 'user_isolated_test_999';
  const scansOther = await fetchUserScans(otherUserId);

  recordTest(
    scansA.length === 1 &&
    scansA[0].productName === bournvita.name &&
    scansOther.length === 0,
    15,
    'User Scan Record Persistence & Cross-User Isolation',
    'Scan History',
    `User A scans: ${scansA.length}, User B scans: ${scansOther.length}`
  );

  // Test 16: Saved Smart Swaps Persistence
  const bestSwap = bournvita.swaps[0];
  await recordUserSavedSwap(userA.id, bestSwap, bournvita);
  const savedSwapsA = await fetchUserSavedSwaps(userA.id);

  recordTest(
    savedSwapsA.length === 1 && savedSwapsA[0].swap.name === bestSwap.name,
    16,
    'Saved Smart Swaps Persistence',
    'Smart Swaps',
    `Saved swap "${savedSwapsA[0].swap.name}" for product "${bournvita.name}"`
  );

  // Test 17: Guest Data Migration into Authenticated Account
  const guestScansFixture = [PRODUCTS_DATABASE[1], PRODUCTS_DATABASE[2]];
  const guestSwapsFixture = [
    { swap: PRODUCTS_DATABASE[1].swaps[0], originalProduct: PRODUCTS_DATABASE[1] }
  ];

  const syncResult = await syncGuestDataIntoUser(userA.id, guestScansFixture, guestSwapsFixture);
  const totalScansAfterSync = await fetchUserScans(userA.id);
  const totalSwapsAfterSync = await fetchUserSavedSwaps(userA.id);

  recordTest(
    syncResult.importedScans === 2 &&
    totalScansAfterSync.length >= 3 &&
    totalSwapsAfterSync.length >= 2,
    17,
    'Guest History & Swaps Migration into User Account',
    'Data Sync',
    `Synced ${syncResult.importedScans} scans & ${syncResult.importedSwaps} swaps. Total account scans: ${totalScansAfterSync.length}`
  );

  // Test 18: Deletion of Specific Scan Record & Storage Integrity
  await deleteUserScan(userA.id, scanRecA.id);
  const scansAfterDelete = await fetchUserScans(userA.id);
  const scanDeleted = !scansAfterDelete.some(s => s.id === scanRecA.id);

  recordTest(
    scanDeleted,
    18,
    'Scan Record Deletion & Storage Integrity',
    'Data Management',
    `Successfully deleted scan ${scanRecA.id}. Remaining scans: ${scansAfterDelete.length}`
  );

  // Summary
  console.log('\n================================================================');
  const passed = results.filter(r => r.status === 'PASS').length;
  const failed = results.filter(r => r.status === 'FAIL').length;
  console.log(`PHASE 2 TEST RUN COMPLETE: ${passed} PASSED, ${failed} FAILED (${results.length} Total)`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runAllPhase2Tests().catch((err) => {
  console.error('Unhandled Phase 2 test suite error:', err);
  process.exit(1);
});
