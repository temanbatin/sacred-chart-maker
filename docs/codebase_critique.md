# Codebase Critique & Improvement Plan

## Analysis of Current State

### 1. Pricing Architecture
**Current State:**
- Pricing is hardcoded in `src/config/pricing.ts` with a single `REPORT_PRICE` (199,000 IDR).
- `ORIGINAL_PRICE` is also hardcoded (500,000 IDR).
- There is no data structure to support multiple product tiers (e.g., Basic vs. Premium) or addons.

**Critique:**
- **Rigidity:** Adding a new product currently requires refactoring every component that imports `PRICING_CONFIG`.
- **Scalability:** The system cannot handle dynamic pricing, discounts per product, or bundles without significant code duplication.

### 2. Checkout Flow (ProductPreviewModal & Reports)
**Current State:**
- `ProductPreviewModal.tsx` assumes a single product ("Full Report Human Design").
- The payment logic in `handleBuy` and `handleConfirmPayment` directly uses `PRICING_CONFIG.REPORT_PRICE`.
- Order metadata structure (`chart_ids`, `birth_data`) doesn't explicitly list *what* products were bought, implying "Full Report" by default.

**Critique:**
- **Coupling:** The UI is tightly coupled to the specific features of the "Full Report".
- **Metadata Ambiguity:** Future orders won't distinguish between a 199k report and an 89k report unless the schema changes.

### 3. Component Reusability
**Current State:**
- `ChartResult.tsx` has a large chunk of hardcoded "Upsell" UI (`cta-section`) that is specific to the Full Report.
- Text content (benefits, testimonials) is scattered across components rather than centralized in a content config.

## Improvement Plan

### 1. Refactor Pricing Configuration
**Action:** Update `src/config/pricing.ts` to support a product catalog.
```typescript
export const PRODUCTS = {
  FULL_REPORT: {
    id: 'full_report',
    name: 'Full Report Human Design',
    price: 199000,
    original_price: 500000,
    features: [...]
  },
  ESSENTIAL_REPORT: { // The new 89k package
    id: 'essential_report',
    name: 'Essential Human Design + Synthesis',
    price: 89000,
    original_price: 250000,
    features: ['Type', 'Strategy', 'Authority', 'Profile', 'Signature', 'Not-Self', 'LLM Synthesis']
  },
  BAZI_ADDON: { // The upsell
    id: 'bazi_addon',
    name: 'Bazi Report Add-on',
    price: 50000,
    original_price: 100000,
  }
}
```

### 2. Update Checkout Logic
**Action:**
- Modify `ProductPreviewModal` to accept a `selectedProduct` or allow selection within the modal.
- Add an "Add-on" section for the Bazi Report (Checkbox).
- Calculate `totalAmount` dynamically: `Base Price + (Addon ? Addon Price : 0)`.
- Update Supabase `orders` table insertion to include `items` or `products` array in `metadata`.

### 3. Bazi Integration Plan
**Plan:**
1.  **Frontend:** Add "Bazi Report" as a toggle in the checkout modal.
2.  **Backend (Edge Function):** Update `midtrans-checkout` to validate the amount matches the selected products.
3.  **Fulfillment:** Ensure the system knows to generate the Bazi report (or include it in the email) when the flag is present. *Note: Actual Bazi calculation logic needs to be verified if it exists.*

### 4. Implementation of 89k Package
**Plan:**
- Create a clear visual distinction between "Essential" (89k) and "Full" (199k) in the UI.
- The 89k package includes: Type, Profile, Strategy, Authority, Signature, Not Self, and **LLM Synthesis**.
- **LLM Synthesis:** Ensure there is a prompt/function to generate a summary paragraph combining these elements.

## Recommendations
- **Refactor `pricing.ts` immediately** to be the single source of truth for products.
- **Abstract Product Cards:** Create a reusable `ProductCard` component to display the 89k vs 199k options side-by-side.
- **Centralize Copy:** Move product descriptions and benefit lists to a config file to avoid cluttering components.
