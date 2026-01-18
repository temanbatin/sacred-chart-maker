# Admin Dashboard Roadmap

## 1. Architecture & Security
- **Route:** `/admin/*` (Protected Route).
- **Auth:** Supabase Auth with RLS (Row Level Security).
  - Add `role: 'admin'` to `profiles` table.
  - Create a middleware/check to ensure only admins can access these routes.

## 2. Modules

### A. Dashboard Home (`/admin`)
- **Metrics Cards:** Total Revenue, Total Orders, Active Users, Total Affiliates.
- **Charts:** Sales trend (Last 30 days), User growth.
- **Recent Activity:** Feed of latest signups and purchases.

### B. Sales Monitoring (`/admin/orders`)
- **Table:** Order ID, Customer Name, Product (Essential/Full/Bazi), Amount, Status (Pending/Paid), Date.
- **Actions:** View Detail, Manual Status Update (if needed), Export CSV.

### C. User Management (`/admin/users`)
- **Table:** User ID, Name, Email, Charts Created, Last Login.
- **Detail View:** See their Saved Charts and Order History.

### D. Affiliate System (`/admin/affiliates`)
- **Logic:** Track `ref_code` usage in `orders` metadata.
- **Table:** Affiliate Name, Total Referrals, Total Commission (e.g., 10-20%), Status.

### E. CMS (Article Manager) (`/admin/articles`)
- **List:** View all articles in `src/config/learn-content.ts` (Note: Since we use a config file currently, we should migrate this to a Supabase table `articles` for dynamic editing).
- **Editor:**
  - Title, Slug, Category, Content (Markdown/Rich Text).
  - **AI Magic Button:**
    - "Generate Content": Uses Gemini to write based on title.
    - "Generate Image": Uses Gemini/Imagen to create illustration.
- **Storage:** Save images to Supabase Storage bucket `article-images`.

## 3. Database Updates (Supabase)
1.  **Table `articles`:**
    - `id` (uuid)
    - `slug` (text, unique)
    - `title` (text)
    - `content` (text)
    - `image_url` (text)
    - `category` (text)
    - `is_published` (boolean)
    - `created_at` (timestamp)
2.  **Table `profiles`:** Ensure `role` column exists (default 'user').

## 4. Implementation Steps
1.  Setup Admin Layout & Auth Guard.
2.  Create Dashboard Overview (Stats).
3.  Build Order Table.
4.  Build Article Manager + Gemini Integration.
