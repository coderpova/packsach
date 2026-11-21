# PackSach — Look Beyond the Label 🔍
> *"Peeche ka label padho. PackSach dikhayega."*
> *"Healthy" likha ho, toh bhi label padho!*

**PackSach** is a packaged food label transparency and consumer health intelligence platform. It translates fine-print back-of-pack ingredient tables, hidden sugars, palm oil derivatives, and deceptive front-of-package marketing claims into an intuitive **Visual Shock Dashboard**, transparent science-backed health scores (0 to 10), and 1-click **Smart Swaps** in the exact same product category and price range.

---

## 🌟 Key Features

### 1. 🔍 Instant Search & Verified Indian Staples Database
- Curated database of iconic Indian packaged staples: **Bournvita**, **NutriChoice Digestive Biscuits**, **Frooti**, **Maggi 2-Minute Noodles**, **Kurkure Masala Munch**, **Kellogg's Chocos**, **Nutella**, and **Sting Energy Drink**.
- Live **Open Food Facts API integration** for global packaged food lookup with automatic nutritional parsing.

### 2. ⚡ Real OCR (Camera & Image Upload) + Editable Extracted Text
- Device camera feed snapshot or file upload (PNG/JPG/WebP).
- Client-side neural OCR via **Tesseract.js** with real-time recognition progress tracking.
- Interactive **Editable OCR Modal** allowing users to inspect and correct extracted text with instant score recalculation.
- Transparent image quality and semantic content categorization checks.

### 3. 💥 Visual Shock Dashboard
- **Sugar Cubes Visualizer:** 3D physics-inspired sugar cubes (1 cube = 4g sugar) showing exact per-serve load and distinguishing added sugars from intrinsic sugars.
- **Palm Oil Meter:** Qualitative in-going weight rank and Quantitative Ingredient Declaration (QUID) disclosure under FSSAI regulations.
- **Sodium Salt Shaker:** Translates milligram sodium values into percentage of ICMR-NIN 2,000 mg/day adult threshold.
- **Additives & Emulsifiers:** Nuanced regulatory status (FSSAI Food Additive Regulations 2011, JECFA ADI, EFSA, US FDA) explaining technological function.

### 4. ⚖️ Dual-Basis Health Scoring Engine (0 to 10)
- Combines standardized nutrient density per 100g/ml (**WHO South-East Asia Region Nutrient Profile Model 2023**) with per-serving contribution against reference diet thresholds (**WHO 2015 Guideline on Free Sugars**).
- Treats missing values as `UNKNOWN` rather than zero, capping incomplete data at a provisional score of 6.5.
- Surfaces full scientific references and assumption notes directly in an interactive drawer.

### 5. 🔄 Honest 1-Click Smart Swaps & Grocery List
- Category-matched healthier alternatives in the exact same price bracket (e.g. replacing refined palm-oil digestive biscuits with whole-grain oats & jaggery cookies).
- Verified retail pricing and evidence-basis citations for every swap.
- Local grocery checklist persistence.

---

## 🚀 Tech Stack

- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS 4
- **Icons & Animation:** Lucide React, Framer Motion, Lenis Smooth Scroll, Canvas Confetti
- **OCR Engine:** Tesseract.js (client-side WebAssembly)
- **Deployment:** Vercel

---

## 🛠️ Local Development

```bash
# Clone repository
git clone https://github.com/coderpova/packsach.git
cd packsach

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run automated tests
npx tsx scripts/runMasterAuditTests.ts

# Production build
npm run build
```

---

## 📜 Regulatory & Scientific Standards
- **WHO (2015):** Guideline: Sugars intake for adults and children.
- **WHO SEARO (2023):** Nutrient Profile Model for South-East Asia Region.
- **FSSAI (2020):** Food Safety and Standards (Labelling and Display) Regulations.
- **ICMR-NIN (2024):** Dietary Guidelines for Indians.
- **Joint FAO/WHO (JECFA):** Evaluations of the Joint FAO/WHO Expert Committee on Food Additives.
