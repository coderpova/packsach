import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  User as UserIcon,
  Shield,
  Heart,
  AlertTriangle,
  Save,
  CheckCircle2,
  Trash2,
  LogOut,
  Calendar,
  Lock,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import {
  DIETARY_PREFERENCES,
  ALLERGY_OPTIONS,
  type DietaryPreference,
  type AllergyPreference
} from '../../types/auth';

interface UserProfileViewProps {
  onBackToExplore?: () => void;
  onOpenDashboard?: () => void;
}

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  onBackToExplore,
  onOpenDashboard
}) => {
  const { user, profile, updateProfile, logout, deleteAccount } = useAuth();

  const [activeTab, setActiveTab] = useState<'profile' | 'diet' | 'allergies' | 'security'>('diet');
  const [name, setName] = useState(profile?.name || user?.name || '');
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatarUrl || user?.avatarUrl || '');
  const [dietaryPrefs, setDietaryPrefs] = useState<DietaryPreference[]>(profile?.dietaryPreferences || []);
  const [allergies, setAllergies] = useState<AllergyPreference[]>(profile?.allergies || []);

  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  if (!user) {
    return (
      <div className="rounded-3xl border border-[#EAE7E0] bg-white p-12 text-center max-w-md mx-auto my-12 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-[#FFF1EE] border border-[#FFE1DA] flex items-center justify-center mx-auto mb-3 text-[#FF5E36]">
          <Lock className="w-6 h-6" />
        </div>
        <h3 className="text-base font-black text-[#111827]">Authentication Required</h3>
        <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
          Please sign in to view and customize your health profile, allergies, and dietary preferences.
        </p>
      </div>
    );
  }

  const handleToggleDiet = (id: DietaryPreference) => {
    setDietaryPrefs(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    setSaveSuccess(false);
  };

  const handleToggleAllergy = (id: AllergyPreference) => {
    setAllergies(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
    setSaveSuccess(false);
  };

  const handleSaveProfile = async () => {
    setErrorMessage(null);
    setIsSaving(true);
    try {
      await updateProfile({
        name: name.trim(),
        avatarUrl: avatarUrl.trim(),
        dietaryPreferences: dietaryPrefs,
        allergies: allergies
      });
      setSaveSuccess(true);
      setTimeout(() => setSaveSuccess(false), 3000);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to save health profile.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount();
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to delete account.');
    }
  };

  return (
    <div className="space-y-6 text-left">
      {/* Top Profile Hero Card */}
      <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-8 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-[#F4F1EA] border border-[#EAE5DA] overflow-hidden flex items-center justify-center shrink-0 text-[#111827] shadow-xs">
              {avatarUrl ? (
                <img src={avatarUrl} alt={name} className="w-full h-full object-cover" />
              ) : (
                <UserIcon className="w-8 h-8 text-[#64748B]" />
              )}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                  {name || user.email.split('@')[0]}
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {user.provider === 'google' ? 'Google Account' : 'Verified Member'}
                </span>
              </div>
              <p className="text-xs text-[#64748B] mt-0.5 font-medium">{user.email}</p>
              <div className="flex items-center gap-3 mt-2 text-[11px] text-[#94A3B8]">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" />
                  Joined {new Date(user.createdAt).toLocaleDateString()}
                </span>
                <span>•</span>
                <span>{dietaryPrefs.length} Diets configured</span>
                <span>•</span>
                <span>{allergies.length} Allergens tracked</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-center flex-wrap">
            {onBackToExplore && (
              <button
                onClick={onBackToExplore}
                className="btn-secondary h-10 px-3.5 text-xs font-bold gap-1.5 cursor-pointer"
              >
                <span>Directory</span>
              </button>
            )}
            {onOpenDashboard && (
              <button
                onClick={onOpenDashboard}
                className="btn-secondary h-10 px-4 text-xs font-bold gap-1.5 cursor-pointer"
              >
                <span>My Dashboard</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="btn-coral h-10 px-5 text-xs font-bold gap-2 cursor-pointer shadow-xs disabled:opacity-50"
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Saving...</span>
                </>
              ) : saveSuccess ? (
                <>
                  <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                  <span>Preferences Saved!</span>
                </>
              ) : (
                <>
                  <Save className="w-3.5 h-3.5" />
                  <span>Save All Changes</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Profile Section Tabs */}
      <div className="flex overflow-x-auto no-scrollbar gap-2 p-1 bg-[#F4F1EA] rounded-full border border-[#EAE5DA] max-w-xl">
        <button
          onClick={() => setActiveTab('diet')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'diet'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#111827]'
          }`}
        >
          <Heart className="w-3.5 h-3.5" />
          <span>Dietary Goals</span>
        </button>

        <button
          onClick={() => setActiveTab('allergies')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'allergies'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#111827]'
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Allergies</span>
        </button>

        <button
          onClick={() => setActiveTab('profile')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'profile'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#111827]'
          }`}
        >
          <UserIcon className="w-3.5 h-3.5" />
          <span>Account Info</span>
        </button>

        <button
          onClick={() => setActiveTab('security')}
          className={`flex-1 min-w-[120px] py-2 px-3 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
            activeTab === 'security'
              ? 'bg-[#111827] text-white shadow-xs'
              : 'text-[#64748B] hover:text-[#111827]'
          }`}
        >
          <Shield className="w-3.5 h-3.5" />
          <span>Settings</span>
        </button>
      </div>

      {/* Notifications */}
      {errorMessage && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2.5">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {saveSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-bold">Preferences updated! PackSach will automatically alert you when scanned food items conflict with your choices.</span>
        </div>
      )}

      {/* TAB 1: DIETARY GOALS */}
      {activeTab === 'diet' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FFF1EE] text-[#FF5E36] text-[11px] font-black uppercase tracking-wider mb-2">
              Personalized Intelligence
            </div>
            <h3 className="text-xl font-black text-[#111827]">Dietary Preferences & Lifestyle</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
              Select the diets that match your household. PackSach will instantly flag animal by-products, high glycemic sugars, or gluten when analyzing packages.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
            {DIETARY_PREFERENCES.map(option => {
              const isSelected = dietaryPrefs.includes(option.id);
              return (
                <div
                  key={option.id}
                  onClick={() => handleToggleDiet(option.id)}
                  className={`p-4 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between select-none ${
                    isSelected
                      ? 'border-[#111827] bg-[#FAF9F6] shadow-xs'
                      : 'border-[#EAE7E0] bg-white hover:border-[#D1CABE]'
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-black text-[#111827]">{option.label}</span>
                      <div
                        className={`w-5 h-5 rounded-full flex items-center justify-center border transition-all ${
                          isSelected
                            ? 'bg-[#111827] border-[#111827] text-white'
                            : 'border-[#D1CABE] bg-white'
                        }`}
                      >
                        {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                    <p className="text-[11px] text-[#64748B] leading-relaxed">
                      {option.description}
                    </p>
                  </div>
                  <div className="mt-3 pt-2 border-t border-[#F0ECE1]">
                    <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${option.badgeColor}`}>
                      {isSelected ? 'Active Filter' : 'Click to enable'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* TAB 2: FOOD ALLERGIES & INTOLERANCES */}
      {activeTab === 'allergies' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-8 space-y-6 shadow-xs"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-50 text-rose-700 text-[11px] font-black uppercase tracking-wider mb-2">
              Critical Safety Filters
            </div>
            <h3 className="text-xl font-black text-[#111827]">Food Allergies & Intolerances</h3>
            <p className="text-xs text-[#64748B] mt-1 max-w-2xl leading-relaxed">
              Tag any allergens you must avoid. If a scanned label or fine-print ingredient list mentions these compounds, PackSach sounds a high-visibility amber warning.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {ALLERGY_OPTIONS.map(option => {
              const isSelected = allergies.includes(option.id);
              return (
                <button
                  key={option.id}
                  type="button"
                  onClick={() => handleToggleAllergy(option.id)}
                  className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex items-center justify-between ${
                    isSelected
                      ? 'border-rose-400 bg-rose-50/50 shadow-xs'
                      : 'border-[#EAE7E0] bg-white hover:border-[#D1CABE]'
                  }`}
                >
                  <div>
                    <span className={`text-xs font-extrabold block ${isSelected ? 'text-rose-950' : 'text-[#111827]'}`}>
                      {option.label}
                    </span>
                    <span className="text-[10px] text-[#64748B] font-medium block mt-0.5">
                      Checks: {option.keywords.slice(0, 3).join(', ')}...
                    </span>
                  </div>
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center border shrink-0 transition-all ${
                      isSelected
                        ? 'bg-rose-600 border-rose-600 text-white'
                        : 'border-[#D1CABE] bg-white'
                    }`}
                  >
                    {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* TAB 3: ACCOUNT INFO */}
      {activeTab === 'profile' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-8 space-y-6 shadow-xs max-w-2xl"
        >
          <div>
            <h3 className="text-xl font-black text-[#111827]">Account Information</h3>
            <p className="text-xs text-[#64748B] mt-1">
              Manage your display name, email, and profile avatar.
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111827] mb-1">
                Display Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                  setSaveSuccess(false);
                }}
                className="w-full h-11 px-4 text-xs font-semibold rounded-2xl border border-[#D1CABE] bg-[#FAF9F6] focus:bg-white focus:border-[#111827] focus:outline-hidden transition-all text-[#111827]"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111827] mb-1">
                Email Address
              </label>
              <input
                type="email"
                disabled
                value={user.email}
                className="w-full h-11 px-4 text-xs font-semibold rounded-2xl border border-[#EAE7E0] bg-[#F4F1EA] text-[#64748B] cursor-not-allowed"
              />
              <span className="text-[10px] text-[#94A3B8] mt-1 block">
                Email address is linked to your authentication provider ({user.provider}).
              </span>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#111827] mb-1">
                Avatar Photo URL
              </label>
              <input
                type="url"
                placeholder="https://example.com/avatar.jpg"
                value={avatarUrl}
                onChange={(e) => {
                  setAvatarUrl(e.target.value);
                  setSaveSuccess(false);
                }}
                className="w-full h-11 px-4 text-xs font-semibold rounded-2xl border border-[#D1CABE] bg-[#FAF9F6] focus:bg-white focus:border-[#111827] focus:outline-hidden transition-all text-[#111827]"
              />
            </div>
          </div>
        </motion.div>
      )}

      {/* TAB 4: SETTINGS & DANGER ZONE */}
      {activeTab === 'security' && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 max-w-2xl"
        >
          <div className="bg-white rounded-3xl border border-[#EAE7E0] p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-xl font-black text-[#111827]">Account Actions</h3>
            <p className="text-xs text-[#64748B]">
              Sign out from this session or securely clear your browser state.
            </p>

            <button
              onClick={() => logout()}
              className="btn-secondary h-10 px-5 text-xs font-bold gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out of PackSach</span>
            </button>
          </div>

          <div className="bg-white rounded-3xl border border-rose-200 p-6 sm:p-8 space-y-4 shadow-xs">
            <div className="flex items-center gap-2 text-rose-600">
              <Trash2 className="w-5 h-5" />
              <h4 className="text-base font-black text-rose-950">Danger Zone</h4>
            </div>
            <p className="text-xs text-rose-800 leading-relaxed">
              Permanently delete your PackSach account and all associated scan history, dietary preferences, and saved Smart Swaps. This action cannot be undone.
            </p>

            {showDeleteConfirm ? (
              <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
                <p className="text-xs font-bold text-rose-900">
                  Are you absolutely certain? All your personalized allergen alerts and history records will be wiped immediately.
                </p>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleDeleteAccount}
                    className="h-9 px-4 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold cursor-pointer"
                  >
                    Yes, Permanently Delete My Account
                  </button>
                  <button
                    onClick={() => setShowDeleteConfirm(false)}
                    className="h-9 px-4 rounded-full bg-white border border-rose-200 text-rose-700 text-xs font-bold cursor-pointer hover:bg-slate-50"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="h-10 px-4 rounded-full border border-rose-300 text-rose-700 hover:bg-rose-50 text-xs font-bold cursor-pointer transition-colors"
              >
                Delete My PackSach Account
              </button>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};
