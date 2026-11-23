# PACKSACH — PRODUCT STRATEGY & STARTUP ROADMAP
**Version:** 1.0.0 | **Author:** Principal Software Architect & Startup Consultant  
**Live Application:** [https://packsach-web.vercel.app](https://packsach-web.vercel.app)

---

## 1. Product Vision & Market Differentiation

PackSach ("Packet Ka Sach" — *Look Beyond the Label*) is building the default packaged food intelligence layer for 1.4 billion Indian consumers.

Unlike traditional calorie-counting apps (which demand tedious manual logging) or Western barcode apps (which lack granular context on Indian food processing, unquantified palmolein, and FSSAI loopholes), PackSach focuses on **Immediate Visual Transparency**:
1. **The Visual Shock Factor:** Translating abstract numbers into physical equivalents (3D sugar cubes, oil canisters, salt shakers).
2. **Honest Science over Dogma:** Dual-basis WHO SEARO 2023 / ICMR-NIN 2024 profiling that flags high-risk formulations without inventing fake data.
3. **Actionable Clean Swaps:** Providing realistic, category-matched, same-price alternatives in local kirana stores and quick-commerce apps (Blinkit, Zepto, Instamart).

---

## 2. Startup Feature Categorization Matrix (10 Core Candidates)

Each feature has been evaluated based on engineering feasibility, consumer utility, regulatory compliance, and operational cost:

| # | Feature Candidate | Classification | Feasibility | User Impact | Strategic Rationale |
| :-: | :--- | :---: | :---: | :---: | :--- |
| **1** | **Barcode Scanner (EAN-13 / UPC)** | **BUILD NOW** | High (1–2 days) | Very High | 90% of Indian packaged FMCG goods feature clean EAN-13 barcodes. A barcode bypasses OCR blur, takes < 300ms, and instantly resolves to Open Food Facts / PackSach verified catalog. |
| **2** | **Allergen & Dietary Safety Alerts** | **BUILD NOW** | High (2–3 days) | High | Critical consumer safety for celiac (gluten), lactose intolerance (dairy), vegan, and Jain diets (onion/garlic/root detection). Rule-based parsing from existing `ingredientParser.ts`. |
| **3** | **Feedback & "Report Wrong Label"** | **BUILD NOW** | High (1 day) | High | Establishes immediate trust and compliance. Empowers consumers to flag OCR errors or reformulations, creating an audit log for database curation. |
| **4** | **Side-by-Side Product Comparison** | **ACTIVE (ENHANCE NEXT)** | Built | High | Core comparison engine is live. Enhance next with shareable comparison URLs (e.g. `packsach.vercel.app/compare?a=bournvita&b=ragi`) and social infographic cards. |
| **5** | **Smart Grocery Checklist** | **ACTIVE (ENHANCE NEXT)** | Built | Medium | Active local checklist with 1-click swap replacement. Enhance next with WhatsApp export and Blinkit/Zepto 1-click cart prefill deep links. |
| **6** | **Personalized Health Profiles** | **BUILD NEXT** | Medium (1 week) | Very High | Tailors dashboard warnings for specific chronic conditions: Type-2 Diabetics (aggressive sugar alerts), Hypertensive (sodium > 200mg warnings), and Child Nutrition mode (no caffeine/sweeteners). |
| **7** | **Hindi & Regional Language OCR / UI** | **BUILD NEXT** | Medium (2 weeks) | Very High | Crucial for Bharat adoption across Tier-2/3 cities. Tesseract supports `hin`, `tam`, `tel`, `ben`, but requires dynamic language pack fetching to prevent bundle inflation. |
| **8** | **Crowdsourced Label Verification Pipeline** | **BUILD NEXT** | High Effort (3 weeks) | High | Backend review queue (Supabase/Firebase) where user-submitted OCR fixes from `EditableOcrModal` are validated by moderators before merging into the public catalog. |
| **9** | **User Accounts & Multi-Device Sync** | **FUTURE ROADMAP** | Medium (2 weeks) | Medium | Client-side `localStorage` works friction-free without signup gates. Add cloud accounts (Supabase Auth / Sign in with Google) once mobile app is released. |
| **10** | **Brand Transparency / Paid Clean Badges** | **NOT RECOMMENDED YET** | High Risk | High Risk | **Conflict of Interest Hazard:** Accepting fees from brands for "verified clean" badges destroys consumer trust. PackSach's integrity relies on independent scientific objectivity. |

---

## 3. Detailed Feature Breakdown & Implementation Plan

### Phase 1: Build Now (Immediate 2-Week Sprint)

#### 1. Barcode Scanner (EAN-13)
- **Technical Path:** Integrate `@zxing/browser` or native browser `BarcodeDetector` API.
- **Workflow:** When the user taps "Scan", offer a dual-mode toggle: `Barcode` (instant) vs `Photo / Label` (deep OCR).
- **Fallback:** If barcode is not in offline DB, query Open Food Facts API in real-time; if OFF returns 404, prompt user to snap the back label for auto-indexing.

#### 2. Allergen & Strict Dietary Profile Engine
- **Technical Path:** Extend `src/services/ingredientParser.ts` with comprehensive allergen regex dictionaries:
  - **Allergens:** Wheat/Gluten, Milk/Casein/Lactose, Peanuts, Tree Nuts, Soy, Egg, Fish, Sesame, Sulphites.
  - **Dietary Flags:** Vegetarian (Green dot compliance), Non-Vegetarian (gelatin, carmine INS 120), Vegan, Jain (no onion, garlic, potato).
- **UI Presentation:** High-visibility banner on the Visual Shock Dashboard with amber/red warning badges.

#### 3. Community Feedback & Label Discrepancy Reporting
- **Technical Path:** Lightweight dialog allowing users to flag "Ingredient changed", "Score too harsh/lenient", or "OCR misinterpreted".
- **Destination:** Submits to serverless webhook (Discord / Slack / GitHub Issues / Email API) with product metadata and user correction payload.

---

### Phase 2: Build Next (Next 4–8 Weeks)

#### 4. Personalized Health Filter Profiles
- **User Personas:**
  - *Diabetic / Pre-diabetic:* Free sugar threshold lowered to 2.5g/serve; highlights maltodextrin, high fructose corn syrup, and hidden glycemic index culprits.
  - *Hypertension / Heart Health:* Strict 5% daily limit per serving on sodium; flags trans fats and hydrogenated oils immediately.
  - *Parents / School Kids:* Flags artificial food colors (Tartrazine INS 102, Sunset Yellow INS 110 linked to hyperactivity in children) and synthetic sweeteners (sucralose, aspartame).
- **Storage:** Persisted locally in `localStorage` under `packsach_user_profile` without requiring account creation.

#### 5. Hindi & Regional Language Support
- **UI Localization:** English + Hindi initially (`i18next` integration).
- **OCR Engine:** Dynamic download of `tesseract-lang/hin.traineddata.gz` only when Hindi mode is selected.
- **Transliteration:** Auto-recognition of Hindi brand names and regional ingredient vernacular (e.g., *Maida*, *Taal ka Tel*, *Cheeni*, *Namak*).

---

### Phase 3: Future Roadmap (Q3–Q4 2027)

#### 6. Cross-Platform Mobile Application (Flutter or React Native)
- Native camera access with 60fps real-time on-device barcode and bounding-box OCR detection.
- Offline-first SQLite database containing the top 5,000 Indian grocery barcodes for instant retail supermarket scanning without cell reception.

#### 7. Quick-Commerce Smart Swap Extension
- Browser extension for Chrome / mobile web that inspects shopping carts on Blinkit, Zepto, and Instamart.
- Automatically suggests healthier swaps in the cart before checkout (e.g. "Replace 1x Britannia Good Day with 1x True Elements Oats Cookies to save 18g sugar").

---

### Phase 4: Non-Recommended Features (Explicit Exclusions)

#### 1. Paid "Clean Label" Brand Certification
- **Why Excluded:** Commercial monetization via brand endorsement or paid badges ruins PackSach's status as an impartial consumer advocate. PackSach will never sell score improvements, ranking boosts, or verified badges to FMCG manufacturers.

#### 2. Mandatory Account Creation / Social Login Wall
- **Why Excluded:** Forcing users to sign up before seeing a food label kills conversion by 60–70%. PackSach will remain completely open, free, and accessible without mandatory login.
