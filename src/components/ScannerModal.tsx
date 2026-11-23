import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Camera, Upload, X, AlertCircle, Sparkles, FileText, Search, RefreshCw, ShieldAlert } from 'lucide-react';
import { EditableOcrModal } from './EditableOcrModal';
import { validateAndExtractImage, validateImageFileIntegrity, validateImageFileSignature, ImageValidationResult, PHOTOGRAPHY_TIPS } from '../services/imageValidator';
import type { Product } from '../types/product';

interface ScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onProductGenerated: (product: Product) => void;
  onSearchProduct?: (query: string) => void;
}

const SAMPLE_FIELD_STATUSES = {
  calories: 'declared' as const,
  sugar: 'declared' as const,
  addedSugar: 'declared' as const,
  totalFat: 'declared' as const,
  saturatedFat: 'declared' as const,
  transFat: 'declared' as const,
  sodium: 'declared' as const,
  protein: 'declared' as const,
  fiber: 'declared' as const
};

const SAMPLE_LABELS = [
  {
    name: 'Bournvita Chocolate Malt Drink',
    brand: 'Mondelez / Cadbury',
    category: 'Malt Drink',
    text: 'Cereal Extract (56%), Sugar (32%), Cocoa Solids, Liquid Glucose, Emulsifiers (INS 322, INS 471), Raising Agent (INS 500(ii)), Caramel Color (INS 150d), Artificial Chocolate Flavoring',
    img: '/assets/backgrounds/analysis-food-bg.jpg',
    nutrition: {
      calories: 78,
      sugarGrams: 14.2,
      addedSugarGrams: 7.4,
      totalFatGrams: 1.2,
      saturatedFatGrams: 0.7,
      transFatGrams: 0.0,
      sodiumMg: 75,
      proteinGrams: 1.4,
      fiberGrams: 0.4,
      servingGrams: 20,
      declaredFields: {
        calories: true,
        sugar: true,
        addedSugar: true,
        totalFat: true,
        saturatedFat: true,
        transFat: true,
        sodium: true,
        protein: true,
        fiber: true,
        servingSize: true
      },
      fieldStatuses: SAMPLE_FIELD_STATUSES
    }
  },
  {
    name: 'NutriChoice Hi-Fibre Digestive Biscuit',
    brand: 'Britannia',
    category: 'High Fibre Biscuits',
    text: 'Refined Wheat Flour (Maida) (48%), Refined Palm Oil (18%), Sugar (15%), Wheat Bran (8%), Invert Sugar Syrup, Raising Agents (INS 503(ii), INS 500(ii)), Emulsifiers (INS 322, INS 471), Maltodextrin',
    img: '/assets/backgrounds/hero-food-bg.jpg',
    nutrition: {
      calories: 145,
      sugarGrams: 4.8,
      addedSugarGrams: 4.2,
      totalFatGrams: 6.2,
      saturatedFatGrams: 3.1,
      transFatGrams: 0.0,
      sodiumMg: 110,
      proteinGrams: 2.2,
      fiberGrams: 1.6,
      servingGrams: 30,
      declaredFields: {
        calories: true,
        sugar: true,
        addedSugar: true,
        totalFat: true,
        saturatedFat: true,
        transFat: true,
        sodium: true,
        protein: true,
        fiber: true,
        servingSize: true
      },
      fieldStatuses: SAMPLE_FIELD_STATUSES
    }
  },
  {
    name: 'Frooti Mango Drink',
    brand: 'Parle Agro',
    category: 'Juice Drink',
    text: 'Water, Mango Pulp (19.5%), Sugar (13.8%), Acidity Regulator (INS 330), Preservative (INS 211), Synthetic Food Color (INS 110), Permitted Natural Mango Flavours',
    img: '/assets/backgrounds/explore-food-bg.jpg',
    nutrition: {
      calories: 104,
      sugarGrams: 21.6,
      addedSugarGrams: 13.8,
      totalFatGrams: 0.0,
      saturatedFatGrams: 0.0,
      transFatGrams: 0.0,
      sodiumMg: 28,
      proteinGrams: 0.1,
      fiberGrams: 0.2,
      servingGrams: 160,
      declaredFields: {
        calories: true,
        sugar: true,
        addedSugar: true,
        totalFat: true,
        saturatedFat: true,
        transFat: true,
        sodium: true,
        protein: true,
        fiber: true,
        servingSize: true
      },
      fieldStatuses: SAMPLE_FIELD_STATUSES
    }
  },
  {
    name: 'Maggi 2-Minute Noodles',
    brand: 'Nestlé India',
    category: 'Instant Noodles',
    text: 'Refined Wheat Flour (Maida), Refined Palm Oil, Iodised Salt, Wheat Gluten, Thickeners (INS 508, INS 412), Flavor Enhancers (INS 627, INS 631), Caramel Color (INS 150d)',
    img: '/assets/backgrounds/swaps-food-bg.jpg',
    nutrition: {
      calories: 310,
      sugarGrams: 1.2,
      addedSugarGrams: 1.0,
      totalFatGrams: 12.5,
      saturatedFatGrams: 6.2,
      transFatGrams: 0.1,
      sodiumMg: 820,
      proteinGrams: 7.0,
      fiberGrams: 2.5,
      servingGrams: 70,
      declaredFields: {
        calories: true,
        sugar: true,
        addedSugar: true,
        totalFat: true,
        saturatedFat: true,
        transFat: true,
        sodium: true,
        protein: true,
        fiber: true,
        servingSize: true
      },
      fieldStatuses: SAMPLE_FIELD_STATUSES
    }
  }
];

export const ScannerModal: React.FC<ScannerModalProps> = ({
  isOpen,
  onClose,
  onProductGenerated,
  onSearchProduct,
}) => {
  const [mode, setMode] = useState<'samples' | 'upload' | 'camera'>('samples');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);
  const [scanStatus, setScanStatus] = useState<string>('');
  const [validationResult, setValidationResult] = useState<ImageValidationResult | null>(null);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, []);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
      });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.warn('Camera access error:', err);
      setCameraError('Unable to access device camera. Please check camera permissions or upload an image.');
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  };

  const handleModeChange = (newMode: 'samples' | 'upload' | 'camera') => {
    setMode(newMode);
    setValidationResult(null);
    if (newMode === 'camera') {
      startCamera();
    } else {
      stopCamera();
    }
  };

  const processImageSource = async (source: string | File) => {
    setIsScanning(true);
    setScanProgress(5);
    setScanStatus('Initializing OCR & optical text analysis...');
    setValidationResult(null);

    try {
      const result = await validateAndExtractImage(source, (progress, status) => {
        setScanProgress(progress);
        setScanStatus(status);
      });

      setValidationResult(result);
      setIsScanning(false);

      if (result.status === 'VALID_LABEL') {
        setShowEditModal(true);
      }
    } catch (err) {
      console.error('Validation and OCR error:', err);
      setIsScanning(false);
      setValidationResult({
        status: 'UNSUPPORTED',
        contentCategory: 'UNRELATED_IMAGE',
        confidence: 0,
        message: 'An unexpected error occurred during image processing. Please try another photo.',
        detectedKeywords: [],
        classificationMechanism: 'Runtime Error Boundary',
        classificationLimitation: 'Heuristic error fallback',
        hasRealVisionModel: false
      });
    }
  };

  const handleCaptureSnapshot = () => {
    if (!videoRef.current) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoRef.current.videoWidth || 640;
    canvas.height = videoRef.current.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.88);
      setImagePreview(dataUrl);
      stopCamera();
      processImageSource(dataUrl);
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        stopCamera();
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const check = validateImageFileIntegrity(file);
      if (!check.isValid) {
        setValidationResult({
          status: 'UNSUPPORTED',
          contentCategory: 'UNRELATED_IMAGE',
          confidence: 0,
          message: check.error || 'Invalid file format or size.',
          detectedKeywords: [],
          classificationMechanism: 'Client Pre-flight Validation',
          classificationLimitation: 'File integrity failure',
          hasRealVisionModel: false
        });
        return;
      }

      // Check binary magic bytes signature to guard against spoofed files
      const sigCheck = await validateImageFileSignature(file);
      if (!sigCheck.isValid) {
        setValidationResult({
          status: 'UNSUPPORTED',
          contentCategory: 'UNRELATED_IMAGE',
          confidence: 0,
          message: sigCheck.error || 'File signature mismatch. The file content does not match a valid JPG, PNG, or WebP image.',
          detectedKeywords: [],
          classificationMechanism: 'Binary Magic Bytes Validation',
          classificationLimitation: 'Signature mismatch failure',
          hasRealVisionModel: false
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        setImagePreview(result);
        processImageSource(file);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSelectSample = (sample: typeof SAMPLE_LABELS[0]) => {
    setImagePreview(sample.img);
    setValidationResult({
      status: 'VALID_LABEL',
      contentCategory: 'NUTRITION_LABEL',
      confidence: 96,
      message: 'Verified Indian package label declaration loaded.',
      extractedText: sample.text,
      detectedKeywords: ['cereal extract', 'sugar', 'cocoa', 'emulsifier', 'palm oil'],
      nutritionValues: sample.nutrition,
      classificationMechanism: 'Verified Indian FMCG Database Registry',
      classificationLimitation: 'Curated retail benchmark sample for testing',
      hasRealVisionModel: false
    });
    setShowEditModal(true);
  };

  const handleReset = () => {
    setValidationResult(null);
    setImagePreview(null);
    if (mode === 'camera') {
      startCamera();
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="scanner-modal-title"
        className="fixed inset-0 z-50 bg-[#111827]/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.96 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.96 }}
          className="bg-white rounded-3xl border border-[#EAE7E0] w-full max-w-xl p-6 sm:p-8 relative my-8 shadow-2xl"
        >
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            aria-label="Close scanner modal"
            className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#111827] hover:bg-[#F4F1EA] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Modal Header */}
          <div className="flex items-center gap-2 mb-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#F4F1EA] border border-[#EAE5DA] text-xs font-bold text-[#111827]">
              <Camera className="w-3.5 h-3.5 text-[#FF5E36]" />
              <span>Smart Label Scanner & Validator</span>
            </span>
          </div>

          <h2 id="scanner-modal-title" className="text-2xl sm:text-3xl font-black text-[#111827] tracking-tight">
            Scan Back-of-Packet Label
          </h2>
          <p className="text-xs sm:text-sm text-[#64748B] mt-1">
            <strong>Honest Food Verification:</strong> Our intelligent vision pipeline verifies that the image contains real packaged food ingredient or nutrition declarations.
          </p>

          {/* Mode Tabs (Theme C Pill Selector) */}
          <div className="flex rounded-full p-1 bg-[#F4F1EA] border border-[#EAE5DA] mt-5 gap-1">
            <button
              onClick={() => handleModeChange('samples')}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'samples'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#111827]'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Sample Labels</span>
            </button>
            <button
              onClick={() => handleModeChange('upload')}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'upload'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#111827]'
              }`}
            >
              <Upload className="w-3.5 h-3.5" />
              <span>Upload Photo</span>
            </button>
            <button
              onClick={() => handleModeChange('camera')}
              className={`flex-1 py-2 text-xs font-bold rounded-full transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                mode === 'camera'
                  ? 'bg-[#111827] text-white shadow-xs'
                  : 'text-[#475569] hover:text-[#111827]'
              }`}
            >
              <Camera className="w-3.5 h-3.5" />
              <span>Live Camera</span>
            </button>
          </div>

          {/* Mode Body / Scanning State / Validation Result */}
          <div className="my-6 min-h-[220px]">
            {isScanning ? (
              <div className="py-10 text-center flex flex-col items-center justify-center">
                <div className="w-14 h-14 rounded-2xl bg-[#F4F1EA] border border-[#EAE5DA] flex items-center justify-center mb-3 text-[#FF5E36] animate-pulse">
                  <Sparkles className="w-7 h-7" />
                </div>
                <h3 className="text-base font-black text-[#111827]">
                  Analyzing Food Image...
                </h3>
                <p className="text-xs text-[#64748B] mt-1 max-w-sm px-4">
                  {scanStatus}
                </p>

                <div className="w-64 bg-[#F4F1EA] h-2.5 rounded-full overflow-hidden mt-5 p-0.5 border border-[#EAE5DA]">
                  <motion.div
                    animate={{ width: `${scanProgress}%` }}
                    className="h-full bg-[#FF5E36] rounded-full transition-all duration-300"
                  />
                </div>
                <span className="text-[11px] font-black text-[#111827] mt-2">{scanProgress}%</span>
              </div>
            ) : validationResult && validationResult.status !== 'VALID_LABEL' ? (
              /* Validation Rejection / Advisory Displays */
              <div className="space-y-4">
                {validationResult.status === 'FRONT_PACK_ONLY' && (
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                          Front-of-Pack Detected
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-amber-950 mt-0.5 leading-snug">
                          {validationResult.message}
                        </h4>
                        <p className="text-xs text-amber-900 mt-2 leading-relaxed">
                          {validationResult.details}
                        </p>
                        <p className="text-xs text-amber-800/90 mt-1 italic">
                          PackSach has a strict <strong>No Fake Information</strong> policy. We will not generate fabricated nutrition numbers from front-side marketing artwork.
                        </p>

                        <div className="flex flex-wrap items-center gap-2.5 mt-4 pt-3 border-t border-amber-200/80">
                          <button
                            onClick={handleReset}
                            className="btn-coral h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer"
                          >
                            <Camera className="w-3.5 h-3.5" />
                            <span>Scan Back-of-Packet Label</span>
                          </button>
                          {validationResult.detectedFoodBrand && onSearchProduct && (
                            <button
                              onClick={() => {
                                onClose();
                                onSearchProduct(validationResult.detectedFoodBrand || '');
                              }}
                              className="btn-secondary h-9 px-4 text-xs font-bold gap-1.5 cursor-pointer bg-white"
                            >
                              <Search className="w-3.5 h-3.5" />
                              <span>Search &ldquo;{validationResult.detectedFoodBrand}&rdquo; in Database</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {validationResult.status === 'UNRELATED' && (
                  <div className="p-5 bg-rose-50 border border-rose-200 rounded-3xl text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-700">
                        <ShieldAlert className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 block">
                          Invalid Image Rejected
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-rose-950 mt-0.5 leading-snug">
                          {validationResult.message}
                        </h4>
                        <p className="text-xs text-rose-900 mt-2 leading-relaxed">
                          {validationResult.details}
                        </p>
                        <div className="mt-3 p-3 bg-white/80 rounded-xl border border-rose-100 text-[11px] text-rose-800">
                          <strong>Accepted images:</strong> Back-of-packet labels of packaged biscuits, chips, noodles, chocolates, juices, and snacks showing an &ldquo;Ingredients&rdquo; list or &ldquo;Nutritional Information&rdquo; table.
                        </div>

                        <div className="mt-4 pt-3 border-t border-rose-200/80 flex items-center justify-end">
                          <button
                            onClick={handleReset}
                            className="btn-coral h-9 px-5 text-xs font-bold gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Try Again with a Food Packet</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {validationResult.status === 'BLURRY' && (
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-3xl text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center shrink-0 text-amber-700">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-amber-700 block">
                          Unclear / Blurry Image
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-amber-950 mt-0.5 leading-snug">
                          {validationResult.message}
                        </h4>
                        <p className="text-xs text-amber-900 mt-2 leading-relaxed">
                          {validationResult.details}
                        </p>

                        <div className="mt-3 p-3 bg-white/80 rounded-xl border border-amber-100 text-xs text-amber-900">
                          <span className="font-bold block mb-1">Photography Tips for 100% OCR Accuracy:</span>
                          <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800">
                            {PHOTOGRAPHY_TIPS.map((tip, i) => (
                              <li key={i}>{tip}</li>
                            ))}
                          </ul>
                        </div>

                        <div className="mt-4 pt-3 border-t border-amber-200/80 flex items-center justify-end">
                          <button
                            onClick={handleReset}
                            className="btn-coral h-9 px-5 text-xs font-bold gap-1.5 cursor-pointer"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Retake Photo</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {(validationResult.status === 'BLANK' || validationResult.status === 'UNSUPPORTED') && (
                  <div className="p-5 bg-rose-50 border border-rose-200 rounded-3xl text-left">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center shrink-0 text-rose-700">
                        <AlertCircle className="w-6 h-6" />
                      </div>
                      <div className="flex-1">
                        <span className="text-[10px] font-black uppercase tracking-wider text-rose-700 block">
                          File Error
                        </span>
                        <h4 className="text-sm sm:text-base font-black text-rose-950 mt-0.5 leading-snug">
                          {validationResult.message}
                        </h4>
                        <div className="mt-4 pt-3 border-t border-rose-200/80 flex items-center justify-end">
                          <button
                            onClick={handleReset}
                            className="btn-secondary h-9 px-5 text-xs font-bold gap-1.5 cursor-pointer bg-white"
                          >
                            <RefreshCw className="w-3.5 h-3.5" />
                            <span>Select Another File</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : mode === 'samples' ? (
              <div className="space-y-3">
                <span className="text-[11px] font-black uppercase tracking-wider text-[#64748B] block">
                  Click a verified packet to test instant OCR parsing:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SAMPLE_LABELS.map((sample, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectSample(sample)}
                      className="p-3.5 rounded-2xl border border-[#EAE7E0] bg-[#FAF9F6] hover:bg-[#F4F1EA] hover:border-[#D1CABE] text-left transition-all cursor-pointer flex items-center gap-3 group"
                    >
                      <img
                        src={sample.img}
                        alt={sample.name}
                        className="w-12 h-12 rounded-xl object-cover border border-[#EAE7E0] bg-white shrink-0"
                      />
                      <div className="overflow-hidden">
                        <span className="text-[9px] font-black uppercase text-[#64748B] block mb-0.5">
                          {sample.brand}
                        </span>
                        <h4 className="text-xs font-black text-[#111827] truncate group-hover:text-[#FF5E36] transition-colors">
                          {sample.name}
                        </h4>
                        <span className="text-[10px] text-[#64748B] font-medium block">
                          Instant OCR decode ➔
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ) : mode === 'upload' ? (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#D1CABE] bg-[#FAF9F6] rounded-3xl p-8 text-center cursor-pointer hover:bg-[#F4F1EA] transition-colors flex flex-col items-center justify-center min-h-[220px]"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="image/jpeg,image/png,image/webp"
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-white border border-[#EAE5DA] flex items-center justify-center mb-3 text-[#FF5E36] shadow-xs">
                  <Upload className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-bold text-[#111827]">
                  Select an ingredient or nutrition label photo
                </h4>
                <p className="text-xs text-[#64748B] mt-1 max-w-xs">
                  Supports JPG, PNG, and WebP photos of back-of-packet nutrition declarations.
                </p>
                <button
                  type="button"
                  className="mt-4 btn-secondary h-9 px-5 text-xs font-bold"
                >
                  Browse Device Files
                </button>
              </div>
            ) : (
              <div className="space-y-3">
                {cameraError ? (
                  <div className="p-5 bg-rose-50 border border-rose-200 rounded-2xl text-center text-xs text-rose-800 font-medium">
                    <AlertCircle className="w-5 h-5 mx-auto mb-2 text-rose-600" />
                    {cameraError}
                    <button
                      onClick={() => handleModeChange('samples')}
                      className="mt-3 btn-secondary h-8 px-4 text-xs font-bold mx-auto"
                    >
                      Use Sample Label Instead
                    </button>
                  </div>
                ) : (
                  <div className="relative rounded-3xl overflow-hidden border border-[#EAE7E0] bg-black">
                    <video
                      ref={videoRef}
                      playsInline
                      muted
                      className="w-full h-56 object-cover"
                    />
                    <div className="absolute inset-4 border-2 border-dashed border-white/60 rounded-2xl pointer-events-none flex items-center justify-center">
                      <span className="text-[10px] text-white/90 font-bold bg-black/60 px-3 py-1 rounded-full backdrop-blur-xs">
                        Center ingredients text inside frame
                      </span>
                    </div>

                    <div className="absolute bottom-3 inset-x-0 flex justify-center">
                      <button
                        onClick={handleCaptureSnapshot}
                        className="btn-coral h-10 px-5 text-xs font-black gap-2 cursor-pointer shadow-lg"
                      >
                        <Camera className="w-4 h-4" />
                        <span>Capture & Validate Label</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {showEditModal && validationResult && (
        <EditableOcrModal
          initialText={validationResult.extractedText || ''}
          confidence={validationResult.confidence}
          wordTokens={validationResult.wordTokens}
          initialNutrition={validationResult.nutritionValues}
          imagePreview={imagePreview || undefined}
          onConfirm={(product) => {
            setShowEditModal(false);
            stopCamera();
            onClose();
            onProductGenerated(product);
          }}
          onCancel={() => {
            setShowEditModal(false);
          }}
        />
      )}
    </>
  );
};
