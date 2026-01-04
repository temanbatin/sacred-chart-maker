-- Create leads table for marketing purposes
CREATE TABLE public.leads (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  whatsapp TEXT NOT NULL,
  birth_date DATE,
  birth_place TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anonymous inserts (for lead capture before auth)
CREATE POLICY "Anyone can insert leads"
ON public.leads
FOR INSERT
WITH CHECK (true);

-- Create policy for admin to view all leads (you can modify this later)
CREATE POLICY "Service role can view all leads"
ON public.leads
FOR SELECT
TO service_role
USING (true);

-- Create index on email for faster lookups
CREATE INDEX idx_leads_email ON public.leads(email);

-- Create index on created_at for sorting
CREATE INDEX idx_leads_created_at ON public.leads(created_at DESC);