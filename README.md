# PackSach — Look Beyond the Label 🔍
> *"Peeche ka label padho. PackSach dikhayega."*  
> *"Healthy" likha ho, toh bhi label padho!*

**PackSach** is a packaged food label transparency and consumer health intelligence platform. It translates fine-print back-of-pack ingredient tables, hidden sugars, palm oil derivatives, and deceptive front-of-package marketing claims into an intuitive **Visual Shock Dashboard**, transparent science-backed health scores (0 to 10), and 1-click **Smart Swaps** in the exact same product category and price range.

🌐 **Live Production Application:** [https://packsach-web.vercel.app](https://packsach-web.vercel.app)  
📦 **GitHub Repository:** [https://github.com/coderpova/packsach](https://github.com/coderpova/packsach)

---

## 🌟 Key Features

### 1. 🔍 Instant Search & Verified Indian Staples Database
- Curated database of iconic Indian packaged staples: **Bournvita**, **NutriChoice Digestive Biscuits**, **Frooti**, **Maggi 2-Minute Noodles**, **Kurkure Masala Munch**, **Kellogg's Chocos**, **Nutella**, and **Sting Energy Drink**.
- Live **Open Food Facts API integration** for global packaged food lookup with automatic nutritional parsing and offline fallback resilience.

### 2. ⚡ Real OCR (Camera & Image Upload) + Editable Extracted Text
- Device camera feed snapshot or file upload (PNG/JPG/WebP) with pre-flight file size and MIME validation (capped at 10MB).
- Client-side neural OCR via **Tesseract.js** in isolated Web Workers with real-time recognition progress tracking.
- Interactive **Editable OCR Modal** allowing users to inspect and correct extracted text with instant score recalculation.
- Transparent image quality checks (Laplacian blur variance, Rec. 601 luminance) and semantic content classification (`NUTRITION_LABEL`, `INGREDIENT_LABEL`, `PACKAGED_FOOD_FRONT`, `UNRELATED_IMAGE`).

### 3. 💥 Visual Shock Dashboard
- **Sugar Cubes Visualizer:** 3D physics-inspired sugar cubes (1 cube = 4g sugar) showing exact per-serve load and distinguishing added sugars from intrinsic sugars.
- **Palm Oil Meter:** Qualitative in-going weight rank and Quantitative Ingredient Declaration (QUID) disclosure under FSSAI regulations.
- **Sodium Salt Shaker:** Translates milligram sodium values into percentage of ICMR-NIN 2,000 mg/day adult threshold.
- **Additives & Emulsifiers:** Nuanced regulatory status (FSSAI Food Additive Regulations 2011, JECFA ADI, EFSA, US FDA) explaining technological function.

### 4. ⚖️ Dual-Basis Health Scoring Engine (0 to 10)
- Combines standardized nutrient density per 100g/ml (**WHO South-East Asia Region Nutrient Profile Model 2023**) with per-serving contribution against reference diet thresholds (**WHO 2015 Guideline on Free Sugars** and **ICMR-NIN 2024 Dietary Guidelines**).
- Treats missing values as `UNKNOWN` rather than zero, capping incomplete data at a provisional score of 6.5.
- Surfaces full scientific references and assumption notes directly in an interactive drawer.

### 5. 🔄 Honest 1-Click Smart Swaps & Grocery List
- Category-matched healthier alternatives in the exact same price bracket (e.g. replacing refined palm-oil digestive biscuits with whole-grain oats & jaggery cookies).
- Verified retail pricing and evidence-basis citations for every swap.
- Local grocery checklist persistence.

### 6. 👤 Phase 2: User Authentication, Profiles & Personal Safeguards
- **Authentication Engine:** Email registration with strict password validation (min 8 chars, number/symbol required), secure login, Google OAuth integration, password recovery request flow, and active session management.
- **Dual-Mode Persistence Architecture:** Production-grade Supabase PostgreSQL integration with Row-Level Security (RLS) policies, paired with an offline-first **Web Crypto SHA-256 salted hash engine** for zero-plaintext local authentication.
- **Personal Health Profile:** Configurable dietary preferences (Vegetarian, 100% Vegan, Jain, Diabetic-Friendly, Low-Sodium, Gluten-Free, Keto, Halal) and 10 tracked food allergens (Milk & Dairy, Wheat & Gluten, Peanuts, Tree Nuts, Soy, Egg, Fish/Seafood, Sesame, Mustard, Sulfites).
- **Automated Conflict Detection:** Real-time cross-referencing of every scanned packet's ingredients and nutrition values against user's health profile, displaying high-visibility warning banners on conflicting foods.
- **Personal Dashboard:** Real-time metrics (Total Scans, Saved Swaps, Average Health Score, Active Safeguards), searchable scan history, one-click re-inspection into Visual Shock Dashboard, individual scan record deletion, and saved swap management.
- **Seamless Guest-to-Account Migration:** Guests can browse and scan freely; upon signing up or logging in, local scan history and smart swaps automatically migrate into their permanent account.

---

## 🛡️ Engineering, Quality & Security Audit

This repository has completed a comprehensive production-grade architectural and security audit. Detailed documentation is available in the audit reports:

- [AUDIT_REPORT.md](file:///c:/Users/acer/OneDrive/study/project/expora%20project%20hackton/packsach-web/AUDIT_REPORT.md) — Architectural overview, code quality, severity-ranked findings, and resolved technical debt.
- [SECURITY_AUDIT.md](file:///c:/Users/acer/OneDrive/study/project/expora%20project%20hackton/packsach-web/SECURITY_AUDIT.md) — Threat model, file upload security guardrails, XSS defenses, HTTP security headers, and dependency vulnerability assessment.
- [TEST_REPORT.md](file:///c:/Users/acer/OneDrive/study/project/expora%20project%20hackton/packsach-web/TEST_REPORT.md) — 20/20 automated end-to-end journey tests, OCR extraction benchmarks, and edge cases.
- [PERFORMANCE_REPORT.md](file:///c:/Users/acer/OneDrive/study/project/expora%20project%20hackton/packsach-web/PERFORMANCE_REPORT.md) — Rollup bundle splitting (68.9% initial bundle reduction), lazy loading, and Core Web Vitals optimization.
- [PRODUCT_ROADMAP.md](file:///c:/Users/acer/OneDrive/study/project/expora%20project%20hackton/packsach-web/PRODUCT_ROADMAP.md) — Startup roadmap categorizing 10 strategic consumer features (Build now, Build next, Future, Excluded).

---

## 🚀 Tech Stack

- **Framework:** React 19 + TypeScript + Vite 8
- **Styling:** Tailwind CSS 4 (Theme C: Editorial Cream `#FAF9F6`, Charcoal `#111827`, Coral `#FF5E36`)
- **Icons & Animation:** Lucide React, Framer Motion, Lenis Smooth Scroll, Canvas Confetti
- **OCR Engine:** Tesseract.js (client-side WebAssembly)
- **Deployment:** Vercel with HTTP Security Headers

---

## 🛠️ Local Development & Testing

```bash
# Clone repository
git clone https://github.com/coderpova/packsach.git
cd packsach

# Install dependencies
npm install

# Start Vite development server
npm run dev

# Run all test suites (57 automated tests: genuine binaries, master audit, phase 2 auth)
npm run test:all

# Run individual test suites
npm test         # Genuine file binaries, magic bytes & Tesseract OCR (19 tests)
npm run test:unit # Algorithm unit & heuristic classification tests (20 tests)
npm run test:auth # Phase 2 authentication, crypto, profile & persistence tests (18 tests)

# Run linter
npm run lint

# Production build
npm run build
```

### Database & Environment Setup (Supabase PostgreSQL)
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. In your Supabase dashboard SQL editor, execute the schema provided in:
   [`supabase/schema.sql`](file:///c:/Users/acer/OneDrive/study/project/expora%20project%20hackton/packsach-web/supabase/schema.sql)
3. Set `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` in `.env`.
> Note: If Supabase credentials are not provided, PackSach automatically activates its built-in Web Crypto SHA-256 salted hash engine, allowing full functionality and all 57 tests to execute offline without external dependencies.

---

## 📜 Regulatory & Scientific Standards
- **WHO (2015):** Guideline: Sugars intake for adults and children.
- **WHO SEARO (2023):** Nutrient Profile Model for South-East Asia Region.
- **FSSAI (2020):** Food Safety and Standards (Labelling and Display) Regulations.
- **ICMR-NIN (2024):** Dietary Guidelines for Indians.
- **Joint FAO/WHO (JECFA):** Evaluations of the Joint FAO/WHO Expert Committee on Food Additives.
