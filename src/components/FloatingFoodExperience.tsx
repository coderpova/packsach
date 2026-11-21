import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingObjectProps {
  id: string;
  name: string;
  subtitle: string;
  stat: string;
  color: string;
  initialX: number | string;
  initialY: number | string;
  size: number;
  floatDuration: number;
  floatDelay: number;
  rotationRange: number;
  svgContent: React.ReactNode;
  cursorOffset?: { x: number; y: number };
  parallaxFactor?: number;
}

const FloatingItem: React.FC<FloatingObjectProps> = ({
  id,
  name,
  subtitle,
  stat,
  color,
  initialX,
  initialY,
  size,
  floatDuration,
  floatDelay,
  rotationRange,
  svgContent,
  cursorOffset = { x: 0, y: 0 },
  parallaxFactor = 15,
}) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.div
      style={{
        position: 'absolute',
        left: initialX,
        top: initialY,
        x: cursorOffset.x * parallaxFactor,
        y: cursorOffset.y * parallaxFactor,
        zIndex: isHovered ? 40 : 15,
      }}
      animate={{
        y: [0, -14, 0],
        rotate: [0, rotationRange, -rotationRange, 0],
      }}
      transition={{
        repeat: Infinity,
        duration: floatDuration,
        delay: floatDelay,
        ease: 'easeInOut',
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="cursor-pointer select-none group"
    >
      {/* 3D Floating Graphical Representation */}
      <motion.div
        animate={{
          scale: isHovered ? 1.18 : 1,
          filter: isHovered
            ? 'drop-shadow(0 14px 24px rgba(17, 24, 39, 0.22))'
            : 'drop-shadow(0 6px 14px rgba(17, 24, 39, 0.08))',
        }}
        transition={{ type: 'spring', stiffness: 350, damping: 20 }}
        style={{ width: size, height: size }}
        className="flex items-center justify-center relative"
      >
        {svgContent}
      </motion.div>

      {/* Interactive Tooltip Card on Hover */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 4, scale: 0.95 }}
            transition={{ duration: 0.16 }}
            className="absolute left-1/2 -translate-x-1/2 -bottom-16 w-52 bg-white/98 backdrop-blur-md p-2.5 rounded-xl border border-slate-200/90 shadow-xl z-50 pointer-events-none text-left"
          >
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider" style={{ color }}>
                {name}
              </span>
              <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-slate-100 text-[#111827]">
                {stat}
              </span>
            </div>
            <p className="text-[11px] font-semibold text-[#111827] mt-0.5 leading-tight">
              {subtitle}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

interface FloatingFoodExperienceProps {
  cursorOffset?: { x: number; y: number };
}

export const FloatingFoodExperience: React.FC<FloatingFoodExperienceProps> = ({
  cursorOffset = { x: 0, y: 0 },
}) => {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none -z-5">
      {/* 1. 3D Digestive Biscuit (Left Top) */}
      <div className="pointer-events-auto">
        <FloatingItem
          id="item-biscuit"
          name="Digestive Biscuit"
          subtitle="48% Refined Maida & 18% Palm Fat"
          stat="1.7 tsp Sugar"
          color="#D97706"
          initialX="3%"
          initialY="14%"
          size={68}
          floatDuration={5.2}
          floatDelay={0.2}
          rotationRange={3}
          cursorOffset={cursorOffset}
          parallaxFactor={-20}
          svgContent={
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <radialGradient id="biscuitGrad" cx="40%" cy="35%" r="65%">
                  <stop offset="0%" stopColor="#FDE68A" />
                  <stop offset="60%" stopColor="#D97706" />
                  <stop offset="100%" stopColor="#92400E" />
                </radialGradient>
                <filter id="biscuitShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="0" dy="5" stdDeviation="4" floodOpacity="0.25" />
                </filter>
              </defs>
              {/* Main Cookie Disc */}
              <circle cx="50" cy="50" r="42" fill="url(#biscuitGrad)" filter="url(#biscuitShadow)" />
              {/* Outer Rim Pattern */}
              <circle cx="50" cy="50" r="38" fill="none" stroke="#78350F" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.6" />
              {/* Wheat Perforations */}
              <circle cx="50" cy="35" r="2" fill="#78350F" opacity="0.7" />
              <circle cx="38" cy="45" r="2" fill="#78350F" opacity="0.7" />
              <circle cx="62" cy="45" r="2" fill="#78350F" opacity="0.7" />
              <circle cx="44" cy="58" r="2" fill="#78350F" opacity="0.7" />
              <circle cx="56" cy="58" r="2" fill="#78350F" opacity="0.7" />
              <circle cx="50" cy="50" r="2" fill="#78350F" opacity="0.8" />
              {/* Wheat Stalk Center Outline */}
              <path d="M50 40 Q51 48 50 60 M46 45 Q50 48 50 48 M54 45 Q50 48 50 48 M45 52 Q50 55 50 55 M55 52 Q50 55 50 55" stroke="#78350F" strokeWidth="1.5" strokeLinecap="round" opacity="0.6" fill="none" />
            </svg>
          }
        />
      </div>

      {/* 2. 3D Sugar Cube (Right Top) */}
      <div className="pointer-events-auto">
        <FloatingItem
          id="item-sugar-cube-1"
          name="Standard Sugar Cube"
          subtitle="4.0g Sucrose = 1 Kitchen Teaspoon"
          stat="WHO Cap: 6/day"
          color="#EC4899"
          initialX="91%"
          initialY="18%"
          size={58}
          floatDuration={4.4}
          floatDelay={0.5}
          rotationRange={4}
          cursorOffset={cursorOffset}
          parallaxFactor={24}
          svgContent={
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="cubeTop" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FFFFFF" />
                  <stop offset="100%" stopColor="#F1F5F9" />
                </linearGradient>
                <linearGradient id="cubeLeft" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#E2E8F0" />
                  <stop offset="100%" stopColor="#CBD5E1" />
                </linearGradient>
                <linearGradient id="cubeRight" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#CBD5E1" />
                  <stop offset="100%" stopColor="#94A3B8" />
                </linearGradient>
              </defs>
              {/* Isometric Top Face */}
              <polygon points="50,15 80,32 50,49 20,32" fill="url(#cubeTop)" stroke="#94A3B8" strokeWidth="1" />
              {/* Isometric Left Face */}
              <polygon points="20,32 50,49 50,85 20,68" fill="url(#cubeLeft)" stroke="#94A3B8" strokeWidth="1" />
              {/* Isometric Right Face */}
              <polygon points="50,49 80,32 80,68 50,85" fill="url(#cubeRight)" stroke="#64748B" strokeWidth="1" />
              {/* Specular Glistening Highlights */}
              <circle cx="50" cy="28" r="2.5" fill="#FFFFFF" opacity="0.9" />
              <circle cx="36" cy="46" r="2" fill="#FFFFFF" opacity="0.6" />
            </svg>
          }
        />
      </div>

      {/* 3. 3D Palm Oil Droplet (Left Middle) */}
      <div className="pointer-events-auto">
        <FloatingItem
          id="item-oil-drop"
          name="Refined Palmolein Fat"
          subtitle="#2 Ingredient by Weight in Most Snacks"
          stat="50% Saturated"
          color="#EA580C"
          initialX="5%"
          initialY="62%"
          size={54}
          floatDuration={4.8}
          floatDelay={1.1}
          rotationRange={-3}
          cursorOffset={cursorOffset}
          parallaxFactor={-16}
          svgContent={
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <radialGradient id="oilGrad" cx="35%" cy="30%" r="70%">
                  <stop offset="0%" stopColor="#FEF08A" />
                  <stop offset="45%" stopColor="#F59E0B" />
                  <stop offset="90%" stopColor="#B45309" />
                  <stop offset="100%" stopColor="#78350F" />
                </radialGradient>
              </defs>
              {/* Liquid Droplet Path */}
              <path
                d="M50 15 C50 15 22 55 22 72 A28 28 0 0 0 78 72 C78 55 50 15 50 15 Z"
                fill="url(#oilGrad)"
                stroke="#B45309"
                strokeWidth="1.5"
              />
              {/* High-Gloss Highlight Reflection */}
              <ellipse cx="38" cy="58" rx="6" ry="12" transform="rotate(-25 38 58)" fill="#FFFFFF" opacity="0.6" />
              <circle cx="48" cy="74" r="3" fill="#FFFFFF" opacity="0.4" />
            </svg>
          }
        />
      </div>

      {/* 4. 3D Chips Packet (Right Middle) */}
      <div className="pointer-events-auto">
        <FloatingItem
          id="item-chips-pack"
          name="Fried Potato Chips"
          subtitle="Deep-fried in Palmolein with Flavour Enhancers"
          stat="34% Fat Content"
          color="#E11D48"
          initialX="88%"
          initialY="66%"
          size={64}
          floatDuration={5.6}
          floatDelay={0.8}
          rotationRange={-4}
          cursorOffset={cursorOffset}
          parallaxFactor={18}
          svgContent={
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="chipsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#FB7185" />
                  <stop offset="40%" stopColor="#E11D48" />
                  <stop offset="100%" stopColor="#9F1239" />
                </linearGradient>
                <linearGradient id="foilSheen" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0" />
                  <stop offset="50%" stopColor="#FFFFFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#FFFFFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              {/* Crimped Bag Body */}
              <rect x="25" y="20" width="50" height="60" rx="6" fill="url(#chipsGrad)" stroke="#881337" strokeWidth="1.5" />
              {/* Metallic Foil Sheen */}
              <rect x="25" y="20" width="50" height="60" rx="6" fill="url(#foilSheen)" />
              {/* Crimped Top Edge */}
              <path d="M25 24 L29 20 L33 24 L37 20 L41 24 L45 20 L49 24 L53 20 L57 24 L61 20 L65 24 L69 20 L75 24" stroke="#881337" strokeWidth="1.5" fill="none" />
              {/* Crimped Bottom Edge */}
              <path d="M25 76 L29 80 L33 76 L37 80 L41 76 L45 80 L49 76 L53 80 L57 76 L61 80 L65 76 L69 80 L75 76" stroke="#881337" strokeWidth="1.5" fill="none" />
              {/* Center Crisp Graphic */}
              <ellipse cx="50" cy="50" rx="14" ry="9" fill="#FDE047" stroke="#CA8A04" strokeWidth="1" transform="rotate(-15 50 50)" />
            </svg>
          }
        />
      </div>

      {/* 5. 3D Whole Grain Leaf / Ragi Stalk (Bottom Center-Left) */}
      <div className="pointer-events-auto">
        <FloatingItem
          id="item-whole-grain"
          name="Wholesome Millets & Ragi"
          subtitle="Clean Complex Carbs with 0g Added Sugar"
          stat="Clean Smart Swap"
          color="#059669"
          initialX="18%"
          initialY="86%"
          size={56}
          floatDuration={5.0}
          floatDelay={1.5}
          rotationRange={3}
          cursorOffset={cursorOffset}
          parallaxFactor={-12}
          svgContent={
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="leafGrad" x1="0%" y1="100%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#047857" />
                  <stop offset="60%" stopColor="#10B981" />
                  <stop offset="100%" stopColor="#6EE7B7" />
                </linearGradient>
              </defs>
              {/* Organic Leaf Vector */}
              <path
                d="M50 15 C75 35 75 75 50 85 C25 75 25 35 50 15 Z"
                fill="url(#leafGrad)"
                stroke="#047857"
                strokeWidth="1.5"
              />
              {/* Center Leaf Rib */}
              <path d="M50 15 L50 85" stroke="#ECFDF5" strokeWidth="2" strokeLinecap="round" opacity="0.8" />
              <path d="M50 35 Q60 40 65 42 M50 48 Q60 53 66 56 M50 62 Q58 66 64 69" stroke="#ECFDF5" strokeWidth="1.5" opacity="0.6" />
              <path d="M50 35 Q40 40 35 42 M50 48 Q40 53 34 56 M50 62 Q42 66 36 69" stroke="#ECFDF5" strokeWidth="1.5" opacity="0.6" />
            </svg>
          }
        />
      </div>

      {/* 6. 3D Malt Chocolate Drink Bottle (Bottom Center-Right) */}
      <div className="pointer-events-auto">
        <FloatingItem
          id="item-choco-drink"
          name="Chocolate Malt Drink"
          subtitle="71% Sugar & Cereal Malt Matrix"
          stat="3.6 tsp Sugar/Serve"
          color="#7C3AED"
          initialX="80%"
          initialY="84%"
          size={60}
          floatDuration={4.6}
          floatDelay={0.4}
          rotationRange={-2}
          cursorOffset={cursorOffset}
          parallaxFactor={14}
          svgContent={
            <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
              <defs>
                <linearGradient id="bottleGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#6D28D9" />
                  <stop offset="50%" stopColor="#8B5CF6" />
                  <stop offset="100%" stopColor="#5B21B6" />
                </linearGradient>
              </defs>
              {/* Bottle Cap */}
              <rect x="42" y="15" width="16" height="8" rx="2" fill="#FBBF24" stroke="#D97706" strokeWidth="1" />
              {/* Bottle Neck */}
              <rect x="44" y="23" width="12" height="12" fill="#8B5CF6" />
              {/* Bottle Body */}
              <path d="M32 35 C32 35 30 82 30 84 A6 6 0 0 0 36 90 L64 90 A6 6 0 0 0 70 84 C70 82 68 35 68 35 Z" fill="url(#bottleGrad)" stroke="#4C1D95" strokeWidth="1.5" />
              {/* Product Label Wrap */}
              <rect x="33" y="48" width="34" height="26" fill="#FFFFFF" rx="2" opacity="0.95" />
              <rect x="37" y="52" width="26" height="4" rx="1" fill="#FF4D80" />
              <rect x="37" y="59" width="18" height="3" rx="1" fill="#6545F5" />
              <circle cx="56" cy="65" r="3" fill="#F59E0B" />
            </svg>
          }
        />
      </div>
    </div>
  );
};
