# PACKSACH — COMPREHENSIVE SECURITY AUDIT & THREAT MODEL
**Audit Executed:** November 2026 | **Role:** Application Security & Infrastructure Engineer  
**Status:** ALL CRITICAL & HIGH SECURITY CONTROLS VERIFIED

---

## 1. Threat Modeling & Scope

PackSach processes user-uploaded photographs of packaged food products, executes client-side OCR via WebAssembly workers, and retrieves public food registries (Open Food Facts). The threat surface is focused on client-side vectors, file upload handling, data integrity, and denial of service.

```
+-------------------------------------------------------------------------+
|                              USER BROWSER                               |
|                                                                         |
|  [ File Upload / Camera ] ---> [ Pre-Flight Integrity Check ]           |
|                                         | (MIME whitelist, <=10MB)      |
|                                         v                               |
|                         [ Memory-Safe Canvas Loader ]                   |
|                               (URL.revokeObjectURL)                     |
|                                         |                               |
|                                         v                               |
|                          [ Client-Side Tesseract OCR ]                  |
|                               (Isolated Web Worker)                     |
|                                         |                               |
|                                         v                               |
|                         [ Pure Sanitized Domain Model ]                 |
+-------------------------------------------------------------------------+
                                          |
                                          v  (HTTPS GET)
                    +------------------------------------------+
                    |        EDGE PROXY & PUBLIC API           |
                    |   https://world.openfoodfacts.org        |
                    +------------------------------------------+
```

---

## 2. Security Controls & Audit Findings

### A. API Key, Secret & Credential Exposure
- **Finding:** Inspected the entire Git commit tree (`coderpova/packsach`) and current working directory.
- **Result:** **ZERO SECRETS EXPOSED**.
- **Architecture Validation:** PackSach is engineered as a zero-backend, client-side privacy-first web application. Core functionality runs with zero database passwords, zero proprietary cloud credentials, and zero private API tokens.
- **Environment Management:** Comprehensive `.gitignore` ignores `.env`, `.env.*`, `*.pem`, and `*.local`. Documented placeholder template provided in `.env.example`.

### B. File Upload Restrictions & Malicious Vector Mitigation
- **File Size Ceiling:** Upload file size is strictly capped at **10 MB** (reduced from 20 MB) via `validateImageFileIntegrity`. This prevents client memory exhaustion and Denial-of-Service (DoS) on mobile devices.
- **MIME Whitelist:** Strictly restricted to raster photographic formats:
  - Allowed: `image/jpeg`, `image/jpg`, `image/png`, `image/webp`, `image/bmp`, `image/avif`.
  - Disallowed: `image/svg+xml`, `application/pdf`, `.html`, `.exe`, `.sh`.
  - *SVG Vector Defense:* SVGs are explicitly rejected to prevent Cross-Site Scripting (XSS) via embedded `<script>` or `onload` XML tags.
- **Pre-Flight Validation:** File size and MIME checks run *prior* to `FileReader.readAsDataURL` execution, preventing unvalidated binary buffering in memory.
- **Memory Leak Protection:** All object URLs allocated via `URL.createObjectURL(imageSource)` are explicitly revoked via `URL.revokeObjectURL(objectUrl)` on both image load and error events.

### C. Injection & Cross-Site Scripting (XSS)
- **Zero Raw HTML Injection:** Audited all `.tsx` components for `dangerouslySetInnerHTML`, `eval()`, `document.write()`, and dynamic string-to-DOM assignments. Result: **0 occurrences found**.
- **React Escaping:** All user-edited product names, ingredients, and nutrient values are escaped by React's virtual DOM before rendering.
- **URL Parameter Sanitization:** All Open Food Facts queries and barcode lookups pass through `encodeURIComponent()`.

### D. HTTP Security Headers (`vercel.json`)
The production edge deployment on Vercel is hardened with standard HTTP security headers:
```json
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "X-XSS-Protection", "value": "1; mode=block" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(self), microphone=(), geolocation=()" }
      ]
    }
  ]
}
```
- **Clickjacking Defense:** `X-Frame-Options: DENY` prevents framing of PackSach inside malicious iframes.
- **MIME Sniffing Defense:** `X-Content-Type-Options: nosniff` forces browsers to adhere to declared Content-Types.
- **Hardware Sensor Scoping:** `Permissions-Policy` restricts camera access to `self` and permanently disables microphone and geolocation requests.

### E. Client Storage & Privacy
- **Audit:** Data stored in browser `localStorage` includes only non-sensitive user preferences:
  - `packsach_saved_swaps`: Saved Smart Swaps in grocery checklist.
  - `packsach_history`: Locally inspected products audit trail (capped at 12 recent items).
- **Safety:** All `localStorage` interactions are guarded by `try/catch` blocks, preventing application crashes in private/incognito browsing modes.

---

## 3. Dependency Vulnerability Audit

- Production dependencies: `canvas-confetti`, `framer-motion`, `lenis`, `lucide-react`, `react`, `react-dom`, `tesseract.js`.
- Build-time dependencies: `@tailwindcss/vite`, `oxlint`, `typescript`, `vite`.
- All dependencies use current semver versions without known CVE advisories in standard registries.

---

## 4. Unresolved Risks & Mitigations

| Risk | Description | Residual Impact | Mitigation Applied |
| :--- | :--- | :--- | :--- |
| **External Vision Model Credentials Unavailable** | External cloud vision APIs (e.g. Google Cloud Vision) require private billing credentials not configured in the repository. | Image classification uses client-side OCR semantic token heuristics. | Transparent disclosure surfaced in UI: `hasRealVisionModel: false`. Users can review and correct extracted text prior to analysis. |
| **Third-Party API Rate Limiting** | Open Food Facts is a public community API subject to occasional upstream rate limits. | Barcode lookup may delay under heavy continuous usage. | Fallback to built-in verified Indian staple dataset (`PRODUCTS_DATABASE`) + offline-capable cached records. |
