-- Add database-level constraints for leads table
-- Add length limits and format validation

-- First, add a column to track IP for rate limiting
ALTER TABLE public.leads 
ADD COLUMN IF NOT EXISTS ip_address TEXT,
ADD COLUMN IF NOT EXISTS user_agent TEXT;

-- Add CHECK constraints for email format
ALTER TABLE public.leads 
ADD CONSTRAINT leads_email_format 
CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

-- Add CHECK constraint for WhatsApp format (Indonesian numbers)
ALTER TABLE public.leads 
ADD CONSTRAINT leads_whatsapp_format 
CHECK (whatsapp ~ '^\+62[0-9]{9,12}$');

-- Add length limits
ALTER TABLE public.leads 
ADD CONSTRAINT leads_name_length CHECK (char_length(name) <= 255),
ADD CONSTRAINT leads_email_length CHECK (char_length(email) <= 255),
ADD CONSTRAINT leads_whatsapp_length CHECK (char_length(whatsapp) <= 20),
ADD CONSTRAINT leads_birth_place_length CHECK (char_length(birth_place) <= 500);

-- Add constraint to prevent future birth dates
ALTER TABLE public.leads 
ADD CONSTRAINT leads_birth_date_not_future CHECK (birth_date <= CURRENT_DATE);

-- Create index for rate limiting queries
CREATE INDEX IF NOT EXISTS idx_leads_email_created ON public.leads (email, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_leads_ip_created ON public.leads (ip_address, created_at DESC);

-- Drop the overly permissive insert policy
DROP POLICY IF EXISTS "Anyone can insert leads" ON public.leads;

-- Create a more restrictive policy (requires going through edge function with service role)
-- Only service role can insert (edge function will use service role)
CREATE POLICY "Service role can insert leads"
ON public.leads
FOR INSERT
TO service_role
WITH CHECK (true);