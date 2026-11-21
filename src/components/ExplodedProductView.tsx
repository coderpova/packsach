import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Layers, Sparkles, AlertTriangle, ShieldCheck, Info, Flame, Droplet, ArrowRight, Eye, RefreshCw } from 'lucide-react';
import type { Product } from '../types/product';
import { PRODUCTS_DATABASE } from '../data/productsData';

interface ExplodedLayer {
  id: string;
  name: string;
  subtitle: string;
  percentageOrAmount: string;
  category: 'packaging' | 'starch' | 'oil' | 'sugar' | 'additives' | 'sodium';
  caloriesContrib: number;
  color: string;
  borderColor: string;
  bgGradient: string;
  shockFact: string;
  regulationNote: string;
  badge: string;
}

interface ExplodedProductData {
  productId: string;
  name: string;
  brand: string;
  claim: string;
  serving: string;
  totalCalories: number;
  layers: ExplodedLayer[];
}

const EXPLODED_PRODUCTS: ExplodedProductData[] = [
  {
    productId: 'nutrichoice-digestive-biscuits',
    name: 'NutriChoice Digestive Biscuit',
    brand: 'Britannia',
    claim: '100% HEALTHY • High Fibre • Wholesome Power',
    serving: '28g (3 Biscuits)',
    totalCalories: 136,
    layers: [
      {
        id: 'layer-packaging',
        name: 'The Marketing Wrapper',
        subtitle: 'Promised: 100% Atta, High Dietary Fibre & Immunity',
        percentageOrAmount: 'Surface Claim',
        category: 'packaging',
        caloriesContrib: 0,
        color: '#6545F5',
        borderColor: '#C7D2FE',
        bgGradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
        shockFact: 'Front-of-pack displays lush golden wheat stalks and prominent "Digestive" lettering. Under Indian law, "Digestive" is a trade brand name, not a health guarantee.',
        regulationNote: 'FSSAI Ad Guidelines: Brand names cannot imply medicinal or digestive curative benefits.',
        badge: 'Marketing Illusion'
      },
      {
        id: 'layer-starch',
        name: 'Refined Wheat Flour (Maida)',
        subtitle: 'Ingredient #1 on the label: Stripped bulk cereal grain',
        percentageOrAmount: '48% by weight (13.4g)',
        category: 'starch',
        caloriesContrib: 54,
        color: '#D97706',
        borderColor: '#FDE68A',
        bgGradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
        shockFact: 'Despite "Digestive" branding, nearly half of each biscuit is stripped refined maida with the fibrous bran and germ removed during mechanical milling.',
        regulationNote: 'Wheat bran is only 8% of the formulation, subordinate to maida.',
        badge: 'Major Bulk Ingredient'
      },
      {
        id: 'layer-oil',
        name: 'Industrial Palmolein Oil',
        subtitle: 'Ingredient #2: High-temperature palm fat fraction',
        percentageOrAmount: '18% by weight (5.0g fat)',
        category: 'oil',
        caloriesContrib: 45,
        color: '#EA580C',
        borderColor: '#FDBA74',
        bgGradient: 'from-orange-500/25 via-amber-500/15 to-transparent',
        shockFact: 'Refined palmolein provides industrial shelf-life and biscuit snap at 1/4th the cost of butter or cold-pressed oils. It contains ~50% saturated palmitic acid.',
        regulationNote: 'FSSAI mandates oils to be explicitly declared by botanical source.',
        badge: 'High Saturated Fat'
      },
      {
        id: 'layer-sugar',
        name: 'Added Refined Sugars & Invert Syrup',
        subtitle: 'Ingredient #3: Fast-spiking crystalline sucrose + invert liquid',
        percentageOrAmount: '15% by weight (6.8g / 1.7 tsp)',
        category: 'sugar',
        caloriesContrib: 27,
        color: '#FF4D80',
        borderColor: '#FECDD3',
        bgGradient: 'from-rose-500/25 via-pink-500/15 to-transparent',
        shockFact: 'Three biscuits contain 1.7 teaspoons of free sugar. Paired with evening tea, it delivers over 27% of your WHO recommended daily free-sugar threshold.',
        regulationNote: 'Invert sugar syrup accelerates browning but spikes glycemic index.',
        badge: '1.7 Sugar Teaspoons'
      },
      {
        id: 'layer-additives',
        name: 'Chemical Additives & Flavorings',
        subtitle: 'INS 503(ii), INS 500(ii), INS 322, INS 471 & Synthetic Vanillin',
        percentageOrAmount: 'Emulsifiers + Stabilizers',
        category: 'additives',
        caloriesContrib: 10,
        color: '#8B5CF6',
        borderColor: '#DDD6FE',
        bgGradient: 'from-purple-600/25 via-violet-500/15 to-transparent',
        shockFact: 'Uses ammonium bicarbonate and sodium bicarbonate for artificial crispness, accompanied by synthetic mono- and diglycerides of fatty acids.',
        regulationNote: 'Classified under NOVA Level 4 (Ultra-Processed Food Formulation).',
        badge: '5 Ultra-Processed Additives'
      }
    ]
  },
  {
    productId: 'bournvita-malt-drink',
    name: 'Bournvita Chocolate Malt Drink',
    brand: 'Cadbury / Mondelez',
    claim: 'Tayaar Raho: 2x Immunity, Vitamin D & Strong Bones',
    serving: '20g powder (1 Glass)',
    totalCalories: 78,
    layers: [
      {
        id: 'layer-packaging',
        name: 'The Immunity Shield Wrapper',
        subtitle: 'Promised: Pediatric growth, bone strength & cognitive readiness',
        percentageOrAmount: 'Marketing Cover',
        category: 'packaging',
        caloriesContrib: 0,
        color: '#6545F5',
        borderColor: '#C7D2FE',
        bgGradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
        shockFact: 'Packaged in vibrant sports imagery. In April 2024, Indian Ministry of Commerce & Industry directed e-commerce platforms to remove drinks like Bournvita from the "Health Drink" category.',
        regulationNote: 'Government of India Advisory (2024): No FSSAI statutory definition exists for "Health Drink".',
        badge: 'Regulatory De-listing'
      },
      {
        id: 'layer-starch',
        name: 'Cereal Extract & Liquid Glucose',
        subtitle: 'Malted barley matrix + high-DE starch syrup',
        percentageOrAmount: '56% by weight',
        category: 'starch',
        caloriesContrib: 44,
        color: '#D97706',
        borderColor: '#FDE68A',
        bgGradient: 'from-amber-500/20 via-yellow-500/10 to-transparent',
        shockFact: 'Liquid glucose and malted barley extract are rapidly digested carbohydrates that convert into blood glucose almost as rapidly as pure dextrose.',
        regulationNote: 'Malt extract adds savory sweetness but counts towards glycemic load.',
        badge: 'Rapid Glycemic Release'
      },
      {
        id: 'layer-sugar',
        name: 'The Massive Added Sugar Core',
        subtitle: 'Pure granulated cane sucrose + invert sugars',
        percentageOrAmount: '32% formulation (14.2g / 3.6 tsp per 20g serve)',
        category: 'sugar',
        caloriesContrib: 57,
        color: '#FF4D80',
        borderColor: '#FECDD3',
        bgGradient: 'from-rose-500/25 via-pink-500/15 to-transparent',
        shockFact: 'In just 2 tablespoons (20g powder), your child consumes 3.6 teaspoons of pure sugar. 100g of Bournvita powder contains 71g total carbohydrates/sugars.',
        regulationNote: 'Single serve consumes 57% of the WHO 25g daily added-sugar allowance for children.',
        badge: '3.6 Sugar Teaspoons'
      },
      {
        id: 'layer-oil',
        name: 'Cocoa Solids & Fat Core',
        subtitle: 'Defatted cocoa powder + milk fats',
        percentageOrAmount: '1.2g fat per serve',
        category: 'oil',
        caloriesContrib: 11,
        color: '#78350F',
        borderColor: '#D79E78',
        bgGradient: 'from-amber-800/20 via-stone-700/15 to-transparent',
        shockFact: 'Provides the familiar chocolate aroma, but true cocoa solids are heavily overshadowed by the 71% sugar/extract base.',
        regulationNote: 'Low saturated fat, but high sugar cancels cardiovascular benefits.',
        badge: 'Minimal True Cocoa'
      },
      {
        id: 'layer-additives',
        name: 'Caramel Color Class IV & Emulsifiers',
        subtitle: 'INS 150d (Caramel IV), INS 322, Synthetic Vanillin',
        percentageOrAmount: 'Synthetic Color & Flavor',
        category: 'additives',
        caloriesContrib: 5,
        color: '#7C3AED',
        borderColor: '#DDD6FE',
        bgGradient: 'from-purple-600/25 via-violet-500/15 to-transparent',
        shockFact: 'INS 150d (Sulphite Ammonia Caramel) provides dark chocolate hue. It is manufactured under high-pressure ammonia catalytic processing.',
        regulationNote: 'FSSAI limits 4-MEI impurities in Class IV caramel colors.',
        badge: 'Ammonia Caramel IV'
      }
    ]
  },
  {
    productId: 'frooti-mango-drink',
    name: "Frooti Fresh 'N' Juicy",
    brand: 'Parle Agro',
    claim: 'Fresh \'N\' Juicy Real Mango Experience',
    serving: '160ml (1 Tetrapak)',
    totalCalories: 104,
    layers: [
      {
        id: 'layer-packaging',
        name: 'The Fresh Orchard Illusion',
        subtitle: 'Promised: Ripe Alphonso & Totapuri mango refreshment',
        percentageOrAmount: 'Marketing Visual',
        category: 'packaging',
        caloriesContrib: 0,
        color: '#6545F5',
        borderColor: '#C7D2FE',
        bgGradient: 'from-purple-500/20 via-indigo-500/10 to-transparent',
        shockFact: 'Shows succulent dripping mango slices. The term "Drink" indicates non-juice classification: Real fruit juice requires $\\ge$ 85% pulp, while fruit drinks require merely 10%.',
        regulationNote: 'FSSAI Food Safety Category: 14.1.4.2 Non-carbonated Water Based Flavoured Drinks.',
        badge: 'Legal "Drink" Loophole'
      },
      {
        id: 'layer-sugar',
        name: 'Sugar Water Base',
        subtitle: 'Treated water saturated with refined sucrose',
        percentageOrAmount: '65% volume (21.6g sugar / 5.4 tsp)',
        category: 'sugar',
        caloriesContrib: 86,
        color: '#FF4D80',
        borderColor: '#FECDD3',
        bgGradient: 'from-rose-500/25 via-pink-500/15 to-transparent',
        shockFact: 'One small 160ml pack delivers 5.4 full teaspoons of pure sugar (21.6g). That single juice box fulfills 86% of an adult\'s maximum daily sugar intake.',
        regulationNote: 'Contains 13.5g sugar per 100ml, exceeding UK and WHO high-sugar red traffic thresholds.',
        badge: '5.4 Sugar Teaspoons'
      },
      {
        id: 'layer-starch',
        name: 'Mango Pulp (Totapuri)',
        subtitle: 'Secondary ingredient: Concentrated pulp blend',
        percentageOrAmount: '19.5% by volume',
        category: 'starch',
        caloriesContrib: 18,
        color: '#F59E0B',
        borderColor: '#FCD34D',
        bgGradient: 'from-amber-500/25 via-yellow-500/15 to-transparent',
        shockFact: 'Less than one-fifth of the tetra pack is actual fruit pulp. The dense syrupy mouthfeel is created through sugar viscosity and food acids.',
        regulationNote: 'FSSAI minimum standard for fruit drinks is 10% pulp; Frooti meets this with 19.5%.',
        badge: 'Under 20% Fruit'
      },
      {
        id: 'layer-additives',
        name: 'Food Acids & Synthetic Dye (INS 110)',
        subtitle: 'INS 330 (Citric Acid) + Sunset Yellow FCF (INS 110)',
        percentageOrAmount: 'Chemical Preservatives & Dye',
        category: 'additives',
        caloriesContrib: 0,
        color: '#EA580C',
        borderColor: '#FDBA74',
        bgGradient: 'from-orange-500/25 via-amber-500/15 to-transparent',
        shockFact: 'Sunset Yellow FCF (INS 110) gives the iconic radiant golden tone. In the European Union, foods containing INS 110 must carry a warning regarding hyperactivity in children.',
        regulationNote: 'EU Regulation No 1333/2008 requires mandatory Southampton warning for INS 110.',
        badge: 'Synthetic Dye Alert'
      }
    ]
  }
];

interface ExplodedProductViewProps {
  onInspectProduct?: (productId: string) => void;
}

export const ExplodedProductView: React.FC<ExplodedProductViewProps> = ({ onInspectProduct }) => {
  const [selectedProductIndex, setSelectedProductIndex] = useState<number>(0);
  const [isExploded, setIsExploded] = useState<boolean>(true);
  const [explosionDistance, setExplosionDistance] = useState<number>(75);
  const [activeLayerId, setActiveLayerId] = useState<string | null>('layer-sugar');

  const currentProduct = EXPLODED_PRODUCTS[selectedProductIndex];
  const activeLayer = currentProduct.layers.find(l => l.id === activeLayerId) || currentProduct.layers[1];

  const handleProductChange = (index: number) => {
    setSelectedProductIndex(index);
    setActiveLayerId(EXPLODED_PRODUCTS[index].layers[2]?.id || EXPLODED_PRODUCTS[index].layers[1]?.id);
  };

  return (
    <section className="py-12 sm:py-16 relative overflow-hidden bg-gradient-to-b from-white via-slate-50/60 to-white border-y border-slate-200">
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-purple-200/30 via-pink-100/20 to-yellow-100/20 blur-3xl pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-50 border border-purple-200 text-xs font-semibold text-[#6545F5] mb-4">
            <Layers className="w-3.5 h-3.5 text-[#6545F5]" />
            <span>Interactive 3D Layer Dismantler</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#111827] tracking-tight leading-tight">
            Packet Ka Sach: <span className="text-[#6545F5]">The Exploded View</span>
          </h2>
          <p className="text-sm sm:text-base text-[#475569] mt-3 leading-relaxed">
            Inspired by 3D engineering blueprints. We dissect popular packaged staples into their true physiological layers — separating deceptive packaging claims from refined industrial fillers.
          </p>
        </div>

        {/* Product Selector Pills */}
        <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8">
          {EXPLODED_PRODUCTS.map((prod, idx) => (
            <button
              key={prod.productId}
              onClick={() => handleProductChange(idx)}
              className={`px-4 py-2 text-xs sm:text-sm font-bold rounded-xl transition-all cursor-pointer flex items-center gap-2 ${
                selectedProductIndex === idx
                  ? 'bg-[#111827] text-white shadow-md scale-102'
                  : 'bg-white text-[#475569] border border-slate-200 hover:border-slate-300 hover:bg-slate-50'
              }`}
            >
              <span>{prod.name}</span>
              <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-extrabold ${
                selectedProductIndex === idx ? 'bg-purple-500 text-white' : 'bg-slate-100 text-[#64748B]'
              }`}>
                {prod.brand}
              </span>
            </button>
          ))}
        </div>

        {/* Interactive Controls Bar */}
        <div className="max-w-2xl mx-auto bg-white/90 backdrop-blur-md p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-sm flex flex-col sm:flex-row items-center justify-between gap-4 mb-10">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={() => setIsExploded(!isExploded)}
              className={`flex-1 sm:flex-none px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                isExploded
                  ? 'bg-[#6545F5] text-white shadow-xs'
                  : 'bg-slate-100 text-[#475569] hover:bg-slate-200'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isExploded ? 'rotate-180' : ''} transition-transform duration-300`} />
              <span>{isExploded ? 'Exploded Layers (Active)' : 'Assembled Pack'}</span>
            </button>

            <span className="text-xs text-[#64748B] font-medium hidden md:inline">
              Serving: <strong>{currentProduct.serving}</strong>
            </span>
          </div>

          {/* Explosion Spacing Slider */}
          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <span className="text-xs font-semibold text-[#475569] whitespace-nowrap">Explode Depth:</span>
            <input
              type="range"
              min="20"
              max="100"
              value={explosionDistance}
              disabled={!isExploded}
              onChange={(e) => setExplosionDistance(Number(e.target.value))}
              className="w-32 sm:w-40 h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#6545F5] disabled:opacity-40"
            />
            <span className="text-xs font-black text-[#111827] w-8 text-right">
              {isExploded ? `${explosionDistance}%` : '0%'}
            </span>
          </div>
        </div>

        {/* Main 3D Exploded Showcase Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: 3D Exploded Layer Stack Graphic (7 cols) */}
          <div className="lg:col-span-7 relative min-h-[440px] sm:min-h-[500px] flex items-center justify-center p-4 bg-gradient-to-b from-white to-slate-100/70 border border-slate-200/90 rounded-3xl shadow-sm overflow-hidden">
            {/* Grid Floor Perspective Lines */}
            <div
              className="absolute inset-0 opacity-20 pointer-events-none"
              style={{
                backgroundImage: 'radial-gradient(#6545F5 1px, transparent 1px), radial-gradient(#111827 1px, transparent 1px)',
                backgroundSize: '24px 24px',
                backgroundPosition: '0 0, 12px 12px',
              }}
            />

            {/* Product Front Claim Callout Top Left */}
            <div className="absolute top-4 left-4 z-20 max-w-[260px] bg-white/95 backdrop-blur-md p-2.5 rounded-xl border border-slate-200 shadow-xs text-xs">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#6545F5]">Manufacturer Claim:</span>
              <p className="font-extrabold text-[#111827] text-xs leading-tight mt-0.5">"{currentProduct.claim}"</p>
            </div>

            {/* Total Calories Badge Top Right */}
            <div className="absolute top-4 right-4 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-xs flex items-center gap-1.5 text-xs font-bold text-[#111827]">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-current" />
              <span>{currentProduct.totalCalories} kcal / serve</span>
            </div>

            {/* The Layer Stack */}
            <div className="relative w-full max-w-md h-[400px] flex flex-col items-center justify-center">
              {currentProduct.layers.map((layer, index) => {
                const totalLayers = currentProduct.layers.length;
                // Compute vertical offset based on explosion level and index
                const spread = isExploded ? (explosionDistance / 100) * 62 : 12;
                const centerIndex = (totalLayers - 1) / 2;
                const offsetY = (index - centerIndex) * spread;
                const isSelected = activeLayerId === layer.id;

                return (
                  <motion.div
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    animate={{
                      y: offsetY,
                      scale: isSelected ? 1.04 : 1,
                      zIndex: isSelected ? 30 : 20 - index,
                      rotateX: isExploded ? 35 : 15,
                      rotateZ: isExploded ? -10 : -4,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 300,
                      damping: 24,
                    }}
                    whileHover={{ scale: 1.06 }}
                    style={{
                      transformStyle: 'preserve-3d',
                      perspective: 1000,
                    }}
                    className={`absolute w-[86%] sm:w-[92%] h-14 sm:h-16 rounded-2xl border-2 cursor-pointer transition-shadow shadow-md flex items-center justify-between px-4 sm:px-5 backdrop-blur-md ${
                      isSelected
                        ? 'border-[#6545F5] ring-4 ring-purple-100 bg-white shadow-lg'
                        : 'border-slate-300/80 hover:border-slate-400 bg-white/95'
                    }`}
                  >
                    {/* Layer indicator badge */}
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black text-white shrink-0 shadow-xs"
                        style={{ backgroundColor: layer.color }}
                      >
                        {index + 1}
                      </div>

                      <div className="text-left">
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs sm:text-sm font-extrabold text-[#111827]">
                            {layer.name}
                          </span>
                          {isSelected && (
                            <span className="w-2 h-2 rounded-full bg-[#6545F5] animate-ping" />
                          )}
                        </div>
                        <span className="text-[10px] sm:text-[11px] font-semibold text-[#64748B] block truncate max-w-[160px] sm:max-w-[220px]">
                          {layer.subtitle}
                        </span>
                      </div>
                    </div>

                    {/* Quantity or metric badge */}
                    <div className="text-right shrink-0">
                      <span className="px-2 py-1 rounded-md text-[10px] sm:text-xs font-extrabold bg-slate-100 text-[#111827] border border-slate-200">
                        {layer.percentageOrAmount}
                      </span>
                    </div>

                    {/* Pointer line callout when active */}
                    {isSelected && (
                      <motion.div
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="hidden sm:flex absolute -right-12 top-1/2 -translate-y-1/2 items-center text-xs font-bold text-[#6545F5]"
                      >
                        <span className="w-8 h-0.5 bg-[#6545F5]" />
                        <span className="w-2 h-2 rounded-full bg-[#6545F5] -ml-1" />
                      </motion.div>
                    )}
                  </motion.div>
                );
              })}
            </div>

            {/* Exploded View Helper Tip Bottom */}
            <div className="absolute bottom-3 text-center text-[11px] font-medium text-[#64748B] z-10 flex items-center gap-1">
              <Info className="w-3.5 h-3.5 text-[#6545F5]" />
              <span>Click any physical layer to inspect its biological impact</span>
            </div>
          </div>

          {/* Right Column: Deep Layer Inspection Card (5 cols) */}
          <div className="lg:col-span-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeLayer.id}
                initial={{ opacity: 0, x: 16 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -16 }}
                transition={{ duration: 0.22 }}
                className="ps-card p-6 sm:p-7 bg-white relative overflow-hidden"
              >
                {/* Layer Category Tag */}
                <div className="flex items-center justify-between mb-4">
                  <span
                    className="px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-xs"
                    style={{ backgroundColor: activeLayer.color }}
                  >
                    {activeLayer.badge}
                  </span>

                  <span className="text-xs font-bold text-[#64748B]">
                    Layer {currentProduct.layers.findIndex(l => l.id === activeLayer.id) + 1} of {currentProduct.layers.length}
                  </span>
                </div>

                {/* Layer Heading */}
                <h3 className="text-xl sm:text-2xl font-black text-[#111827] tracking-tight">
                  {activeLayer.name}
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#6545F5] mt-0.5">
                  {activeLayer.subtitle}
                </p>

                {/* Quantified Metrics Box */}
                <div className="grid grid-cols-2 gap-3 my-5">
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold uppercase text-[#64748B] block">Measured Formulation:</span>
                    <span className="text-sm sm:text-base font-black text-[#111827] mt-0.5 block">
                      {activeLayer.percentageOrAmount}
                    </span>
                  </div>

                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
                    <span className="text-[10px] font-bold uppercase text-[#64748B] block">Calorie Load:</span>
                    <span className="text-sm sm:text-base font-black text-rose-600 mt-0.5 block flex items-center gap-1">
                      <Flame className="w-4 h-4 fill-current text-rose-500" />
                      {activeLayer.caloriesContrib > 0 ? `${activeLayer.caloriesContrib} kcal` : '0 kcal (Marketing)'}
                    </span>
                  </div>
                </div>

                {/* Biological Shock Fact */}
                <div className="p-4 bg-amber-50/70 border border-amber-200 rounded-xl mb-4">
                  <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900 mb-1">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>The Unvarnished Truth:</span>
                  </div>
                  <p className="text-xs sm:text-sm font-medium text-[#475569] leading-relaxed">
                    {activeLayer.shockFact}
                  </p>
                </div>

                {/* FSSAI Regulatory Context */}
                <div className="p-3 bg-purple-50/60 border border-purple-200/80 rounded-xl mb-6">
                  <div className="flex items-center gap-1.5 text-[11px] font-bold text-[#6545F5] mb-0.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#6545F5] shrink-0" />
                    <span>Regulatory Context:</span>
                  </div>
                  <p className="text-xs text-[#475569]">
                    {activeLayer.regulationNote}
                  </p>
                </div>

                {/* Action CTA: Jump to Full Product Analysis */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
                  <button
                    onClick={() => onInspectProduct && onInspectProduct(currentProduct.productId)}
                    className="btn-primary w-full h-11 text-xs font-bold gap-2 cursor-pointer"
                  >
                    <span>View Complete {currentProduct.name} Analysis</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
};
