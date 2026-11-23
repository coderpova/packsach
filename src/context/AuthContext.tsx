import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, UserProfile, UserScanRecord, UserSavedSwapRecord } from '../types/auth';
import type { Product, SmartSwap } from '../types/product';
import { supabase, isSupabaseConfigured } from '../services/supabase';
import {
  registerWithEmail,
  loginWithEmail,
  loginWithGoogleOAuth,
  requestPasswordReset,
  saveProfileUpdates,
  deleteUserAccount,
  logoutUser,
  getCurrentUserAndProfile,
  getProfileForSupabaseUser
} from '../services/authService';
import {
  fetchUserScans,
  recordUserScan,
  deleteUserScan,
  clearAllUserScans,
  fetchUserSavedSwaps,
  recordUserSavedSwap,
  removeUserSavedSwap,
  syncGuestDataIntoUser
} from '../services/userDataService';
import { ALLERGY_OPTIONS } from '../types/auth';

interface ProductConflictAnalysis {
  hasConflict: boolean;
  conflictingAllergies: string[];
  conflictingDiets: string[];
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAuthModalOpen: boolean;
  authModalMode: 'login' | 'register' | 'forgot';
  openAuthModal: (mode?: 'login' | 'register' | 'forgot') => void;
  closeAuthModal: () => void;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => Promise<void>;
  forgotPassword: (email: string) => Promise<{ success: boolean; message: string }>;
  updateProfile: (updates: Partial<UserProfile>) => Promise<void>;
  deleteAccount: () => Promise<void>;
  userScans: UserScanRecord[];
  saveScan: (product: Product) => Promise<void>;
  deleteScan: (scanId: string) => Promise<void>;
  clearAllScans: () => Promise<void>;
  userSavedSwaps: UserSavedSwapRecord[];
  saveUserSwap: (swap: SmartSwap, currentProduct: Product) => Promise<void>;
  removeUserSwap: (idOrSwapId: string) => Promise<void>;
  syncGuestHistory: (guestHistory: Product[], guestSwaps: any[]) => Promise<{ importedScans: number; importedSwaps: number }>;
  checkProductAllergies: (product: Product) => ProductConflictAnalysis;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authModalMode, setAuthModalMode] = useState<'login' | 'register' | 'forgot'>('login');

  const [userScans, setUserScans] = useState<UserScanRecord[]>([]);
  const [userSavedSwaps, setUserSavedSwaps] = useState<UserSavedSwapRecord[]>([]);

  // Load existing session on mount and subscribe to Supabase auth events
  useEffect(() => {
    let isMounted = true;

    if (!isSupabaseConfigured || !supabase) {
      setIsLoading(false);
      return;
    }

    // 1. Initial user check via supabase.auth.getUser()
    (async () => {
      try {
        const authData = await getCurrentUserAndProfile();
        if (authData && isMounted) {
          setUser(authData.user);
          setProfile(authData.profile);
        }
      } catch (e) {
        console.warn('Initial session check error:', e);
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    })();

    // 2. Real-time auth listener (vital for Google OAuth callback & token refreshes)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!isMounted) return;

        if (session?.user) {
          try {
            const authData = await getProfileForSupabaseUser(session.user);
            if (isMounted) {
              setUser(authData.user);
              setProfile(authData.profile);
            }
          } catch (err) {
            console.warn('Auth sync error on state change:', err);
          }
        } else if (event === 'SIGNED_OUT') {
          if (isMounted) {
            setUser(null);
            setProfile(null);
            setUserScans([]);
            setUserSavedSwaps([]);
          }
        }

        if (isMounted) {
          setIsLoading(false);
        }
      }
    );

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  // Fetch user data whenever user ID changes
  useEffect(() => {
    if (!user) {
      setUserScans([]);
      setUserSavedSwaps([]);
      return;
    }

    let isMounted = true;
    (async () => {
      try {
        const [scans, swaps] = await Promise.all([
          fetchUserScans(user.id),
          fetchUserSavedSwaps(user.id)
        ]);
        if (isMounted) {
          setUserScans(scans);
          setUserSavedSwaps(swaps);
        }
      } catch (e) {
        console.warn('Failed to fetch user cloud data:', e);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [user]);

  const openAuthModal = useCallback((mode: 'login' | 'register' | 'forgot' = 'login') => {
    setAuthModalMode(mode);
    setIsAuthModalOpen(true);
  }, []);

  const closeAuthModal = useCallback(() => {
    setIsAuthModalOpen(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: loggedInUser, profile: loadedProfile } = await loginWithEmail(email, password);
      setUser(loggedInUser);
      setProfile(loadedProfile);
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const { user: registeredUser, profile: createdProfile } = await registerWithEmail(name, email, password);
      setUser(registeredUser);
      setProfile(createdProfile);
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setIsLoading(true);
    try {
      await loginWithGoogleOAuth();
      closeAuthModal();
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      await logoutUser();
      setUser(null);
      setProfile(null);
      setUserScans([]);
      setUserSavedSwaps([]);
    } finally {
      setIsLoading(false);
    }
  };

  const forgotPassword = async (email: string) => {
    return await requestPasswordReset(email);
  };

  const updateProfile = async (updates: Partial<UserProfile>) => {
    if (!user) throw new Error('You must be signed in to update your profile.');
    const updated = await saveProfileUpdates(user.id, updates);
    setProfile(updated);
    if (updates.name) {
      setUser(prev => prev ? { ...prev, name: updates.name!.trim() } : null);
    }
  };

  const deleteAccount = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      await deleteUserAccount(user.id);
      setUser(null);
      setProfile(null);
      setUserScans([]);
      setUserSavedSwaps([]);
    } finally {
      setIsLoading(false);
    }
  };

  const saveScan = async (product: Product) => {
    if (!user) return;
    try {
      const newScan = await recordUserScan(user.id, product);
      setUserScans(prev => [newScan, ...prev.filter(s => s.productId !== product.id)]);
    } catch (e) {
      console.warn('Failed to save user scan record:', e);
    }
  };

  const deleteScan = async (scanId: string) => {
    if (!user) return;
    try {
      await deleteUserScan(user.id, scanId);
      setUserScans(prev => prev.filter(s => s.id !== scanId));
    } catch (e) {
      console.warn('Failed to delete scan record:', e);
    }
  };

  const clearAllScans = async () => {
    if (!user) return;
    try {
      await clearAllUserScans(user.id);
      setUserScans([]);
    } catch (e) {
      console.warn('Failed to clear scans:', e);
    }
  };

  const saveUserSwap = async (swap: SmartSwap, currentProduct: Product) => {
    if (!user) return;
    try {
      const record = await recordUserSavedSwap(user.id, swap, currentProduct);
      setUserSavedSwaps(prev => {
        if (prev.some(s => s.swapId === swap.id)) return prev;
        return [record, ...prev];
      });
    } catch (e) {
      console.warn('Failed to save user swap:', e);
    }
  };

  const removeUserSwap = async (idOrSwapId: string) => {
    if (!user) return;
    try {
      await removeUserSavedSwap(user.id, idOrSwapId);
      setUserSavedSwaps(prev => prev.filter(s => s.id !== idOrSwapId && s.swapId !== idOrSwapId));
    } catch (e) {
      console.warn('Failed to remove user swap:', e);
    }
  };

  const syncGuestHistory = async (guestHistory: Product[], guestSwaps: any[]) => {
    if (!user) return { importedScans: 0, importedSwaps: 0 };
    const result = await syncGuestDataIntoUser(user.id, guestHistory, guestSwaps);
    const [freshScans, freshSwaps] = await Promise.all([
      fetchUserScans(user.id),
      fetchUserSavedSwaps(user.id)
    ]);
    setUserScans(freshScans);
    setUserSavedSwaps(freshSwaps);
    return result;
  };

  /**
   * Evaluates if a given product conflicts with user's saved dietary preferences or allergies
   */
  const checkProductAllergies = (product: Product): ProductConflictAnalysis => {
    if (!profile) {
      return { hasConflict: false, conflictingAllergies: [], conflictingDiets: [] };
    }

    const textToSearch = `${product.name} ${product.ingredientsText} ${product.brand} ${product.categoryLabel}`.toLowerCase();
    const conflictingAllergies: string[] = [];
    const conflictingDiets: string[] = [];

    // 1. Check Allergies
    for (const allergyId of profile.allergies) {
      const option = ALLERGY_OPTIONS.find(o => o.id === allergyId);
      if (option) {
        const matches = option.keywords.some(kw => textToSearch.includes(kw.toLowerCase()));
        if (matches) {
          conflictingAllergies.push(option.label);
        }
      }
    }

    // 2. Check Dietary Preferences
    if (profile.dietaryPreferences.includes('vegetarian')) {
      if (/gelatin|carmine|ins 120|chicken|meat|fish|bone|rennet/i.test(textToSearch)) {
        conflictingDiets.push('Contains non-vegetarian animal derivatives');
      }
    }

    if (profile.dietaryPreferences.includes('vegan')) {
      if (/milk|dairy|whey|casein|butter|ghee|cheese|honey|gelatin/i.test(textToSearch)) {
        conflictingDiets.push('Contains animal / dairy ingredients (Not 100% Vegan)');
      }
    }

    if (profile.dietaryPreferences.includes('jain')) {
      if (/onion|garlic|potato|carrot|radish|beetroot/i.test(textToSearch)) {
        conflictingDiets.push('Contains root ingredients (onion, garlic, or root vegetables)');
      }
    }

    if (profile.dietaryPreferences.includes('gluten-free')) {
      if (/wheat|maida|atta|barley|malt|rye|semolina|suji/i.test(textToSearch)) {
        conflictingDiets.push('Contains gluten / wheat grains');
      }
    }

    if (profile.dietaryPreferences.includes('diabetic-friendly')) {
      if (product.nutritionPerServe.sugarGrams > 5.0 || /liquid glucose|corn syrup|maltodextrin|invert sugar/i.test(textToSearch)) {
        conflictingDiets.push(`High glycemic load: ${product.nutritionPerServe.sugarGrams}g sugars per serve`);
      }
    }

    if (profile.dietaryPreferences.includes('low-sodium')) {
      if (product.nutritionPerServe.sodiumMg > 300) {
        conflictingDiets.push(`High sodium: ${product.nutritionPerServe.sodiumMg}mg per serve`);
      }
    }

    return {
      hasConflict: conflictingAllergies.length > 0 || conflictingDiets.length > 0,
      conflictingAllergies,
      conflictingDiets
    };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        isLoading,
        isAuthenticated: Boolean(user),
        isAuthModalOpen,
        authModalMode,
        openAuthModal,
        closeAuthModal,
        login,
        register,
        loginWithGoogle,
        logout,
        forgotPassword,
        updateProfile,
        deleteAccount,
        userScans,
        saveScan,
        deleteScan,
        clearAllScans,
        userSavedSwaps,
        saveUserSwap,
        removeUserSwap,
        syncGuestHistory,
        checkProductAllergies
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
