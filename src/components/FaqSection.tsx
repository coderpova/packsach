import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FaqItem {
  q: string;
  a: string;
}

const FAQS: FaqItem[] = [
  {
    q: 'How accurate is the data?',
    a: 'Hum label data ko Open Food Facts se cross-check karte hain aur sources cite karte hain. FSSAI regulatory standards ke mutabiq analysis calculate hota hai.',
  },
  {
    q: 'Agar OCR galat padh le?',
    a: 'Aap extracted text confirm ya manually edit kar sakte ho hamare built-in Editable Text tool ke through, taaki accurate analysis ho sake.',
  },
  {
    q: 'Kya ye medical advice hai?',
    a: 'Nahi. PackSach sirf label data aur nutrition science se informed consumer choice karne me madad karta hai. Kisi specific health condition ke liye licensed nutritionist ya doctor se consult karein.',
  },
];

export const FaqSection: React.FC = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section id="faq" className="py-16 sm:py-24 border-t border-[#EAE7E0]">
      <div className="w-full max-w-4xl mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <h2 className="text-3xl sm:text-4xl font-black text-[#111827] tracking-tight">
            Questions
          </h2>
        </div>

        <div className="space-y-3.5">
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              onClick={() => toggle(idx)}
              className="p-5 bg-white border border-[#E0DCD3] rounded-2xl cursor-pointer hover:border-[#CBD5E1] transition-all shadow-xs"
            >
              <div className="flex items-center justify-between gap-4">
                <h3 className="text-sm sm:text-base font-bold text-[#111827]">
                  {faq.q}
                </h3>
                <ChevronDown
                  className={`w-4 h-4 text-slate-400 transition-transform ${
                    openIndex === idx ? 'rotate-180 text-[#111827]' : ''
                  }`}
                />
              </div>

              {openIndex === idx ? (
                <p className="mt-2.5 text-xs sm:text-sm text-[#475569] leading-relaxed font-medium">
                  {faq.a}
                </p>
              ) : (
                <p className="mt-1 text-xs text-[#64748B] line-clamp-1 font-medium">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
