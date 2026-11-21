import React from 'react';
import { Camera } from 'lucide-react';

interface CtaBannerProps {
  onOpenScanner: () => void;
}

export const CtaBanner: React.FC<CtaBannerProps> = ({ onOpenScanner }) => {
  return (
    <section className="py-12 sm:py-16">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#111827] text-white p-10 sm:p-16 rounded-[36px] text-center shadow-xl relative overflow-hidden">
          <h2 className="text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight leading-tight">
            The truth is printed.<br />
            PackSach helps you read it.
          </h2>

          <div className="mt-8">
            <button
              onClick={onOpenScanner}
              className="btn-coral h-12 px-8 text-sm sm:text-base font-bold gap-2 cursor-pointer shadow-lg"
            >
              <Camera className="w-5 h-5" />
              <span>Scan your first packet</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};
