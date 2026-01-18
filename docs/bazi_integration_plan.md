# Bazi Report Integration Plan

## 1. Product & Order Architecture (Completed)
- **Product Definition:** Defined in `src/config/pricing.ts` with ID `bazi_addon` (50,000 IDR).
- **Frontend Selection:** `ProductPreviewModal` now allows users to select "Add Bazi Report".
- **Order Metadata:** When purchased, the `orders` table `metadata` JSON now includes:
  ```json
  {
    "products": ["essential_report", "bazi_addon"],
    "tier": "essential" // or "full"
  }
  ```

## 2. Fulfillment Workflow (n8n / Backend)
Since the system seems to rely on n8n or an external worker to generate and email reports (based on codebase comments), the workflow needs to be updated to handle the new addon.

**Current Workflow (Assumed):**
1.  Order Status -> `PAID`.
2.  Trigger -> Generate Human Design PDF.
3.  Trigger -> Send Email.

**New Workflow:**
1.  **Check Metadata:** Upon payment success, check `order.metadata.products`.
2.  **Conditional Branch:**
    - If `products` includes `bazi_addon`:
        a.  **Calculate Bazi:** Invoke Bazi Calculation Engine (see below).
        b.  **Generate Content:** Create Bazi specific content (Day Master, Elements, Strength/Weakness).
        c.  **Append/Attach:** Either append to the main PDF (if generating fresh) or create a separate attachment "Bazi_Analysis.pdf".
3.  **Send Email:** Update email template to mention "Here is your Human Design Report + Bazi Analysis".

## 3. Bazi Calculation Engine (New Requirement)
We need a logic layer to calculate the Bazi chart.

**Option A: Supabase Edge Function (`calculate-bazi`)**
- **Input:** `{ year, month, day, hour }`
- **Logic:**
    - Convert Gregorian to Chinese Lunar/Solar date.
    - Calculate 4 Pillars (Year, Month, Day, Hour).
    - Determine Day Master (The element of the Day Stem).
    - Calculate Element Strength (Wood, Fire, Earth, Metal, Water).
- **Output:** JSON object with chart data.

**Option B: LLM Generation (Simplified)**
- If strict astronomical accuracy is not critical for the "Addon" level, use an LLM (GPT-4o) to generate the reading based on the birth data.
- **Prompt:** "Calculate the Bazi Day Master for [Date] and provide a 1-page analysis of the person's element strength and lucky colors."
- *Note:* This is less accurate than algorithmic calculation but faster to implement for an MVP.

## 4. Upsell Strategy
- **Checkout:** Already implemented in the modal.
- **Post-Purchase:** If a user buys *only* the Human Design report, send a follow-up email 3 days later: "Want to know your Luck Cycle? Add a Bazi Report for only 50k."

## 5. Development Checklist
- [x] Update Pricing Config
- [x] Update Frontend Checkout UI
- [ ] Create `calculate-bazi` Edge Function (or verify existing library).
- [ ] Update Email/PDF Generation Worker to handle `bazi_addon` flag.
- [ ] Test end-to-end purchase flow with Addon.
