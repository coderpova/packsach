import { supabase, isSupabaseConfigured } from './supabase';
import type { User, UserProfile } from '../types/auth';

export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

export function validatePassword(password: string): { isValid: boolean; message?: string } {
  if (password.length < 8) {
    return { isValid: false, message: 'Password must be at least 8 characters long.' };
  }
  if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return { isValid: false, message: 'Password must contain at least one number or special symbol.' };
  }
  return { isValid: true };
}

/**
 * Maps a Supabase Auth User object to PackSach User and UserProfile models.
 * Fetches the existing profile from `public.profiles` or creates one if not present.
 */
export async function getProfileForSupabaseUser(sbUser: any): Promise<{ user: User; profile: UserProfile }> {
  if (!supabase) {
    throw new Error('Supabase client is not initialized.');
  }

  const name =
    sbUser.user_metadata?.full_name ||
    sbUser.user_metadata?.name ||
    sbUser.email?.split('@')[0] ||
    'PackSach Member';

  const avatarUrl =
    sbUser.user_metadata?.avatar_url ||
    sbUser.user_metadata?.picture ||
    undefined;

  const appUser: User = {
    id: sbUser.id,
    email: sbUser.email || '',
    name,
    avatarUrl,
    createdAt: sbUser.created_at,
    lastSignInAt: sbUser.last_sign_in_at || new Date().toISOString(),
    provider: (sbUser.app_metadata?.provider as 'email' | 'google') || 'email'
  };

  // Attempt to load existing profile from Supabase database
  const { data: profileData, error: fetchError } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', sbUser.id)
    .single();

  if (profileData && !fetchError) {
    return {
      user: appUser,
      profile: {
        id: profileData.id,
        name: profileData.name || appUser.name,
        email: profileData.email || appUser.email,
        avatarUrl: profileData.avatar_url || appUser.avatarUrl,
        dietaryPreferences: profileData.dietary_preferences || [],
        allergies: profileData.allergies || [],
        dailyCalorieTarget: profileData.daily_calorie_target,
        maxSugarDailyGrams: profileData.max_sugar_daily_grams,
        maxSodiumDailyMg: profileData.max_sodium_daily_mg,
        updatedAt: profileData.updated_at
      }
    };
  }

  // If no profile found in database (e.g. trigger didn't fire), create real profile record
  const initialProfile: UserProfile = {
    id: appUser.id,
    name: appUser.name,
    email: appUser.email,
    avatarUrl: appUser.avatarUrl,
    dietaryPreferences: [],
    allergies: [],
    updatedAt: new Date().toISOString()
  };

  await supabase.from('profiles').upsert({
    id: appUser.id,
    name: appUser.name,
    email: appUser.email,
    avatar_url: appUser.avatarUrl,
    dietary_preferences: [],
    allergies: [],
    updated_at: new Date().toISOString()
  });

  return { user: appUser, profile: initialProfile };
}

/**
 * Retrieves the current authenticated user and profile directly from Supabase.
 */
export async function getCurrentUserAndProfile(): Promise<{ user: User; profile: UserProfile } | null> {
  if (!isSupabaseConfigured || !supabase) {
    return null;
  }

  try {
    const { data: { user: sbUser }, error } = await supabase.auth.getUser();
    if (error || !sbUser) {
      return null;
    }
    return await getProfileForSupabaseUser(sbUser);
  } catch (err) {
    console.warn('getCurrentUserAndProfile error:', err);
    return null;
  }
}

/**
 * Register a new user with real Supabase Auth.
 * Never creates fake or local accounts.
 */
export async function registerWithEmail(
  name: string,
  email: string,
  password: string
): Promise<{ user: User; profile: UserProfile }> {
  const cleanName = name.trim();
  const cleanEmail = email.trim().toLowerCase();

  if (cleanName.length < 2) {
    throw new Error('Please enter a valid name (at least 2 characters).');
  }
  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }
  const pwdCheck = validatePassword(password);
  if (!pwdCheck.isValid) {
    throw new Error(pwdCheck.message);
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Registration is unavailable: Supabase configuration is missing or inactive. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    );
  }

  const { data, error } = await supabase.auth.signUp({
    email: cleanEmail,
    password,
    options: {
      data: {
        name: cleanName,
        full_name: cleanName
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }
  if (!data.user) {
    throw new Error('User registration failed. Please try again.');
  }

  return await getProfileForSupabaseUser(data.user);
}

/**
 * Log in with real Supabase Auth credentials.
 * Never creates fake or local accounts.
 */
export async function loginWithEmail(
  email: string,
  password: string
): Promise<{ user: User; profile: UserProfile }> {
  const cleanEmail = email.trim().toLowerCase();

  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }
  if (!password) {
    throw new Error('Please enter your password.');
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Authentication is unavailable: Supabase configuration is missing or inactive. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    );
  }

  const { data, error } = await supabase.auth.signInWithPassword({
    email: cleanEmail,
    password
  });

  if (error) {
    throw new Error(error.message);
  }
  if (!data.user) {
    throw new Error('Invalid email or password.');
  }

  return await getProfileForSupabaseUser(data.user);
}

/**
 * Initiates genuine Google OAuth sign-in via Supabase signInWithOAuth.
 * Directs browser to Google's consent screen. Never generates fake/demo accounts.
 */
export async function loginWithGoogleOAuth(): Promise<{ url?: string }> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Google Authentication is unavailable: Supabase configuration is missing or inactive. Please verify VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment.'
    );
  }

  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}/`
    : undefined;

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  if (error) {
    throw new Error(error.message);
  }

  if (data?.url && typeof window !== 'undefined') {
    window.location.assign(data.url);
  }

  return { url: data?.url ?? undefined };
}

/**
 * Send password reset instructions to user's real email via Supabase Auth.
 */
export async function requestPasswordReset(email: string): Promise<{ success: boolean; message: string }> {
  const cleanEmail = email.trim().toLowerCase();
  if (!validateEmail(cleanEmail)) {
    throw new Error('Please enter a valid email address.');
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error(
      'Password reset is unavailable: Supabase configuration is missing or inactive.'
    );
  }

  const redirectTo = typeof window !== 'undefined'
    ? `${window.location.origin}/`
    : undefined;

  const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
    redirectTo
  });

  if (error) {
    throw new Error(error.message);
  }

  return {
    success: true,
    message: `Password reset instructions have been sent to ${cleanEmail}.`
  };
}

/**
 * Updates user password in Supabase Auth.
 */
export async function updatePassword(newPassword: string): Promise<{ success: boolean; message: string }> {
  const pwdCheck = validatePassword(newPassword);
  if (!pwdCheck.isValid) {
    throw new Error(pwdCheck.message);
  }

  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Password update is unavailable: Supabase configuration is missing.');
  }

  const { error } = await supabase.auth.updateUser({ password: newPassword });
  if (error) throw new Error(error.message);
  return { success: true, message: 'Password updated successfully. You can now sign in.' };
}

/**
 * Save user profile updates to Supabase PostgreSQL `profiles` table.
 */
export async function saveProfileUpdates(userId: string, updates: Partial<UserProfile>): Promise<UserProfile> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Profile update is unavailable: Supabase configuration is missing.');
  }

  const payload: any = {
    updated_at: new Date().toISOString()
  };
  if (updates.name !== undefined) payload.name = updates.name.trim();
  if (updates.avatarUrl !== undefined) payload.avatar_url = updates.avatarUrl;
  if (updates.dietaryPreferences !== undefined) payload.dietary_preferences = updates.dietaryPreferences;
  if (updates.allergies !== undefined) payload.allergies = updates.allergies;
  if (updates.dailyCalorieTarget !== undefined) payload.daily_calorie_target = updates.dailyCalorieTarget;
  if (updates.maxSugarDailyGrams !== undefined) payload.max_sugar_daily_grams = updates.maxSugarDailyGrams;
  if (updates.maxSodiumDailyMg !== undefined) payload.max_sodium_daily_mg = updates.maxSodiumDailyMg;

  const { data, error } = await supabase
    .from('profiles')
    .update(payload)
    .eq('id', userId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    avatarUrl: data.avatar_url,
    dietaryPreferences: data.dietary_preferences || [],
    allergies: data.allergies || [],
    dailyCalorieTarget: data.daily_calorie_target,
    maxSugarDailyGrams: data.max_sugar_daily_grams,
    maxSodiumDailyMg: data.max_sodium_daily_mg,
    updatedAt: data.updated_at
  };
}

/**
 * Permanently delete user account and associated profile and records.
 */
export async function deleteUserAccount(userId: string): Promise<void> {
  if (!isSupabaseConfigured || !supabase) {
    throw new Error('Account deletion is unavailable: Supabase configuration is missing.');
  }

  await supabase.from('profiles').delete().eq('id', userId);
  await supabase.from('user_scans').delete().eq('user_id', userId);
  await supabase.from('user_saved_swaps').delete().eq('user_id', userId);
  await supabase.auth.signOut();
}

/**
 * Log out user from Supabase Auth session.
 */
export async function logoutUser(): Promise<void> {
  if (isSupabaseConfigured && supabase) {
    await supabase.auth.signOut();
  }
}

/**
 * Restores session from Supabase Auth.
 */
export async function restoreSession(): Promise<{ user: User; profile: UserProfile } | null> {
  return await getCurrentUserAndProfile();
}
