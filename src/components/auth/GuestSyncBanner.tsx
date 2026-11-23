import React, { useState } from 'react';
import { ShieldCheck, ArrowRight, X } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface GuestSyncBannerProps {
  guestScanCount: number;
  guestSwapCount: number;
}

export const GuestSyncBanner: React.FC<GuestSyncBannerProps> = ({
  guestScanCount,
  guestSwapCount
}) => {
  const { isAuthenticated, openAuthModal } = useAuth();
  const [dismissed, setDismissed] = useState(false);

  if (isAuthenticated || dismissed || (guestScanCount === 0 && guestSwapCount === 0)) {
    return null;
  }

  const totalItems = guestScanCount + guestSwapCount;

  return (
    <div className="bg-white rounded-3xl border border-[#FFE1DA] p-4 sm:p-5 shadow-xs relative overflow-hidden my-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-2xl bg-[#FFF1EE] border border-[#FFE1DA] flex items-center justify-center shrink-0 text-[#FF5E36]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-[#111827]">
                Save your {totalItems} guest {totalItems === 1 ? 'item' : 'items'} permanently
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-[#FF5E36] text-white">
                Free
              </span>
            </div>
            <p className="text-xs text-[#64748B] mt-0.5 leading-relaxed max-w-xl">
              You are browsing in guest mode. Create a free PackSach account to sync your {guestScanCount} scans and {guestSwapCount} saved swaps across all your devices and unlock customized allergen alerts.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
          <button
            onClick={() => setDismissed(true)}
            className="p-2 text-[#64748B] hover:text-[#111827] rounded-full hover:bg-[#F4F1EA] transition-colors cursor-pointer"
            aria-label="Dismiss banner"
          >
            <X className="w-4 h-4" />
          </button>
          <button
            onClick={() => openAuthModal('register')}
            className="btn-coral h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer shadow-xs"
          >
            <span>Sync to Account</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
