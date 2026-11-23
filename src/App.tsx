import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lenis from 'lenis';
import { Navbar, type NavTab } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { HowItWorksSection } from './components/HowItWorksSection';
import { FeaturesSection } from './components/FeaturesSection';
import { PricingSection } from './components/PricingSection';
import { FaqSection } from './components/FaqSection';
import { CtaBanner } from './components/CtaBanner';
import { ProductSearch } from './components/ProductSearch';
import { VisualShockDashboard } from './components/VisualShockDashboard';
import { ProductComparison } from './components/ProductComparison';
import { GrocerySwapList, type SavedSwapItem } from './components/GrocerySwapList';
import { Footer } from './components/Footer';
import { PRODUCTS_DATABASE, searchProducts, findProductById } from './data/productsData';
import type { Product, SmartSwap } from './types/product';
import { ArrowLeft, Clock, Trash2, Flame } from 'lucide-react';

const ScannerModal = React.lazy(() =>
  import('./components/ScannerModal').then((m) => ({ default: m.ScannerModal }))
);
const EditableOcrModal = React.lazy(() =>
  import('./components/EditableOcrModal').then((m) => ({ default: m.EditableOcrModal }))
);

export function App() {
  const [activeTab, setActiveTab] = useState<NavTab>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product>(() => {
    return PRODUCTS_DATABASE[0];
  });
  const [compareSecondaryProduct, setCompareSecondaryProduct] = useState<Product | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [isScannerOpen, setIsScannerOpen] = useState<boolean>(false);
  const [isEditOcrOpen, setIsEditOcrOpen] = useState<boolean>(false);

  // LocalStorage persistence for Saved Smart Swaps
  const [savedSwaps, setSavedSwaps] = useState<SavedSwapItem[]>(() => {
    try {
      const stored = localStorage.getItem('packsach_saved_swaps');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // LocalStorage persistence for Recently Inspected Products
  const [history, setHistory] = useState<Product[]>(() => {
    try {
      const stored = localStorage.getItem('packsach_history');
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return [PRODUCTS_DATABASE[0], PRODUCTS_DATABASE[1]];
  });

  // Initialize Lenis smooth inertia scrolling
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    let rafId: number;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('packsach_saved_swaps', JSON.stringify(savedSwaps));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [savedSwaps]);

  useEffect(() => {
    try {
      localStorage.setItem('packsach_history', JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [history]);

  // Handler for inspecting a product
  const handleSelectProduct = (product: Product) => {
    const fresh = findProductById(product.id) || product;
    setSelectedProduct(fresh);
    setActiveTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });

    setHistory((prev) => {
      const filtered = prev.filter((p) => p.id !== fresh.id);
      return [fresh, ...filtered].slice(0, 12);
    });
  };

  // Handler for quick inspect by ID
  const handleQuickInspect = (id: string) => {
    const prod = findProductById(id);
    if (prod) {
      handleSelectProduct(prod);
    }
  };

  // Handler for opening comparison
  const handleOpenComparison = (product: Product) => {
    setSelectedProduct(product);
    const other = PRODUCTS_DATABASE.find((p) => p.id !== product.id && p.category === product.category) ||
      PRODUCTS_DATABASE.find((p) => p.id !== product.id);
    setCompareSecondaryProduct(other);
    setActiveTab('compare');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Handler for adding a smart swap to the user's grocery list
  const handleAddSwapToList = (swap: SmartSwap, currentProduct: Product) => {
    setSavedSwaps((prev) => {
      const exists = prev.some((item) => item.swap.id === swap.id);
      if (exists) return prev;
      return [
        {
          id: `swap-${Date.now()}`,
          swap,
          originalProduct: {
            name: currentProduct.name,
            brand: currentProduct.brand,
            price: currentProduct.price,
            sugarTeaspoons: currentProduct.nutritionPerServe.sugarTeaspoons,
          },
          addedAt: new Date().toLocaleDateString(),
        },
        ...prev,
      ];
    });
  };

  const handleRemoveSwapItem = (id: string) => {
    setSavedSwaps((prev) => prev.filter((item) => item.id !== id));
  };

  const handleClearAllSwaps = () => {
    setSavedSwaps([]);
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  const filteredProducts = searchProducts(searchQuery, selectedCategory);

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F6] text-[#475569]">
      {/* Top Navbar Matching Theme C Reference */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onOpenScanner={() => setIsScannerOpen(true)}
        savedSwapsCount={savedSwaps.length}
        historyCount={history.length}
      />

      {/* Main Content Body */}
      <main className="flex-1 w-full max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-10 py-6">
        <AnimatePresence mode="wait">
          {/* TAB 1: THEME C HOME PAGE (MATCHING REFERENCE MOCKUP) */}
          {activeTab === 'home' && (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6 sm:space-y-10"
            >
              {/* 1. Hero Section with 3D Phone Mockup & Floating Badges */}
              <HeroSection
                onSearch={(q) => {
                  setSearchQuery(q);
                  setActiveTab('explore');
                }}
                onOpenScanner={() => setIsScannerOpen(true)}
                onQuickInspect={handleQuickInspect}
                onExploreClick={() => setActiveTab('explore')}
              />

              {/* 2. Section: How it works ("Scan. Reveal. Swap.") */}
              <HowItWorksSection
                onAddSwapDemo={() => {
                  const bournvita = PRODUCTS_DATABASE[0];
                  if (bournvita && bournvita.swaps[0]) {
                    handleAddSwapToList(bournvita.swaps[0], bournvita);
                  }
                }}
                onExploreClick={() => setActiveTab('explore')}
              />

              {/* 3. Section: Features ("Smarter tools for smarter choices") */}
              <FeaturesSection
                onSearchProduct={(q) => {
                  setSearchQuery(q);
                  setActiveTab('explore');
                }}
                onOpenScanner={() => setIsScannerOpen(true)}
                onInspectProduct={handleQuickInspect}
              />

              {/* 4. Section: Pricing ("Start free. Go deeper when ready.") */}
              <PricingSection onStartFree={() => setIsScannerOpen(true)} />

              {/* 6. Section: FAQ ("Questions") */}
              <FaqSection />

              {/* 7. Section: Bottom CTA Banner ("The truth is printed. PackSach helps you read it.") */}
              <CtaBanner onOpenScanner={() => setIsScannerOpen(true)} />
            </motion.div>
          )}

          {/* TAB 2: EXPLORE PRODUCTS DIRECTORY */}
          {activeTab === 'explore' && (
            <motion.div
              key="explore"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              <ProductSearch
                products={filteredProducts}
                onSelectProduct={handleSelectProduct}
                onCompareProduct={handleOpenComparison}
                searchQuery={searchQuery}
                onSearchQueryChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
              />
            </motion.div>
          )}

          {/* TAB 3: VISUAL ANALYSIS DASHBOARD (MATCHING THEME C RESULT MOBILE & DESKTOP) */}
          {activeTab === 'dashboard' && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-8"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('explore')}
                  className="btn-secondary h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Directory</span>
                </button>

                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-[#64748B] hidden sm:inline">
                    Currently Inspecting:
                  </span>
                  <span className="text-xs font-black text-[#111827] bg-[#F4F1EA] px-3.5 py-1 rounded-full border border-[#EAE5DA]">
                    {selectedProduct.name}
                  </span>
                </div>
              </div>

              {/* Theme C Result Dashboard */}
              <VisualShockDashboard
                product={selectedProduct}
                onSelectSwap={handleQuickInspect}
                onCompare={handleOpenComparison}
                onOpenEditOcr={() => setIsEditOcrOpen(true)}
                onAddSwapToList={handleAddSwapToList}
                isSwapAdded={savedSwaps.some((s) => s.originalProduct.name === selectedProduct.name)}
              />
            </motion.div>
          )}

          {/* TAB 4: SIDE-BY-SIDE COMPARISON */}
          {activeTab === 'compare' && (
            <motion.div
              key="compare"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('explore')}
                  className="btn-secondary h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Directory</span>
                </button>
              </div>

              <ProductComparison
                primaryProduct={selectedProduct}
                secondaryProduct={compareSecondaryProduct}
                onInspectProduct={handleSelectProduct}
              />
            </motion.div>
          )}

          {/* TAB 5: SMART GROCERY SWAP LIST */}
          {activeTab === 'grocery-list' && (
            <motion.div
              key="grocery-list"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between">
                <button
                  onClick={() => setActiveTab('explore')}
                  className="btn-secondary h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Explore More Products</span>
                </button>
              </div>

              <GrocerySwapList
                items={savedSwaps}
                onRemoveItem={handleRemoveSwapItem}
                onClearAll={handleClearAllSwaps}
                onExploreProducts={() => setActiveTab('explore')}
              />
            </motion.div>
          )}

          {/* TAB 6: RECENT INSPECTION HISTORY (Theme C Styled) */}
          {activeTab === 'history' && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="space-y-6"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] border border-[#EAE5DA] text-xs font-bold text-[#111827] mb-2">
                    <Clock className="w-3.5 h-3.5 text-[#FF5E36]" />
                    <span>Inspection Audit Trail</span>
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
                    Recently Inspected Packets
                  </h2>
                  <p className="text-xs sm:text-sm text-[#64748B] mt-1">
                    Your local browsing history of analyzed packaged foods and OCR scans.
                  </p>
                </div>

                {history.length > 0 && (
                  <button
                    onClick={handleClearHistory}
                    className="btn-secondary h-10 px-4 text-xs font-bold gap-1.5 self-start sm:self-auto text-[#D11A4F] hover:bg-rose-50 cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Clear History</span>
                  </button>
                )}
              </div>

              {history.length === 0 ? (
                <div className="rounded-3xl border border-[#EAE7E0] bg-white p-12 text-center max-w-md mx-auto my-8 shadow-[0_4px_24px_rgba(0,0,0,0.03)]">
                  <div className="w-12 h-12 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA] flex items-center justify-center mx-auto mb-3 text-[#111827]">
                    <Clock className="w-5 h-5 text-[#64748B]" />
                  </div>
                  <h3 className="text-base font-bold text-[#111827]">No inspection history yet</h3>
                  <p className="text-xs text-[#64748B] mt-1.5 leading-relaxed">
                    Inspect food items or scan barcodes to keep a record of nutrition truths.
                  </p>
                  <button
                    onClick={() => setActiveTab('explore')}
                    className="mt-5 btn-dark h-10 px-5 text-xs font-bold cursor-pointer"
                  >
                    Browse Directory ➔
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                  {history.map((p) => {
                    const score = p.healthScore.score;
                    const isHighConcern = score < 4.0;
                    const isModerate = score >= 4.0 && score < 7.0;

                    const scoreBadgeBg = isHighConcern
                      ? 'bg-[#FF4D80]/15 text-[#D11A4F]'
                      : isModerate
                      ? 'bg-[#FFD84D]/30 text-[#8F6400]'
                      : 'bg-[#10B981]/15 text-[#0A6B4A]';

                    return (
                      <motion.div
                        key={p.id}
                        whileHover={{ y: -3 }}
                        transition={{ duration: 0.18 }}
                        className="bg-white rounded-3xl border border-[#EAE7E0] hover:border-[#D1CABE] p-5 flex flex-col justify-between relative group cursor-pointer shadow-[0_4px_24px_rgba(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
                        onClick={() => handleSelectProduct(p)}
                      >
                        <div>
                          <div className="flex items-center justify-between mb-3.5">
                            <span className="text-[10px] font-black uppercase tracking-wider text-[#64748B]">
                              {p.brand}
                            </span>
                            <span className={`text-xs font-black px-2.5 py-0.5 rounded-full ${scoreBadgeBg}`}>
                              {score.toFixed(1)} / 10
                            </span>
                          </div>

                          <div className="flex items-center gap-3.5 mb-3.5">
                            <img
                              src={p.image}
                              alt={p.name}
                              className="w-16 h-16 rounded-2xl object-cover border border-[#EAE7E0] bg-[#FAF9F6] shrink-0"
                            />
                            <div className="overflow-hidden">
                              <h3 className="text-sm font-extrabold text-[#111827] leading-snug group-hover:text-[#FF5E36] transition-colors truncate">
                                {p.name}
                              </h3>
                              <span className="text-xs font-semibold text-[#64748B]">
                                ₹{p.price} • {p.servingSize}
                              </span>
                            </div>
                          </div>

                          {/* Quick details */}
                          <div className="flex flex-wrap gap-1.5 text-[11px] mb-3">
                            <span className="px-2.5 py-1 rounded-full font-bold bg-[#FAF9F6] text-[#D11A4F] border border-[#F3D7DF] flex items-center gap-1">
                              <Flame className="w-3 h-3 text-[#FF4D80]" />
                              {p.nutritionPerServe.sugarTeaspoons} tsp sugar
                            </span>
                            {p.palmOil.present && (
                              <span className="px-2.5 py-1 rounded-full font-bold bg-[#FAF9F6] text-[#8F6400] border border-[#F5E6B5]">
                                Palm Oil #{p.palmOil.rank}
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="pt-3.5 border-t border-[#F0ECE1] flex items-center justify-between">
                          <span className="text-xs font-semibold text-[#64748B]">
                            Verified Profile
                          </span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSelectProduct(p);
                            }}
                            className="btn-secondary h-8 px-3.5 text-xs font-bold cursor-pointer"
                          >
                            Re-Inspect ➔
                          </button>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Footer Matching Reference */}
      <Footer onNavClick={(tab) => setActiveTab(tab)} />

      {/* Scanner & OCR Modal */}
      {isScannerOpen && (
        <React.Suspense fallback={null}>
          <ScannerModal
            isOpen={isScannerOpen}
            onClose={() => setIsScannerOpen(false)}
            onProductGenerated={(product) => {
              setSelectedProduct(product);
              setActiveTab('dashboard');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSearchProduct={(query) => {
              setSearchQuery(query);
              setActiveTab('explore');
              setIsScannerOpen(false);
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        </React.Suspense>
      )}

      {/* Editable OCR Text Modal */}
      {isEditOcrOpen && (
        <React.Suspense fallback={null}>
          <EditableOcrModal
            initialText={selectedProduct.ingredientsText}
            confidence={92}
            onConfirm={(updatedProduct) => {
              setSelectedProduct(updatedProduct);
              setIsEditOcrOpen(false);
            }}
            onCancel={() => setIsEditOcrOpen(false)}
          />
        </React.Suspense>
      )}
    </div>
  );
}

export default App;
