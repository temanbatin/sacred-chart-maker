-- Create orders table to track payments and fulfillment
CREATE TABLE public.orders (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL, -- Can be null for guest checkout
  reference_id TEXT NOT NULL UNIQUE, -- Matches iPaymu referenceId
  status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, FAILED, EXPIRED
  amount NUMERIC NOT NULL,
  customer_name TEXT NOT NULL,
  customer_email TEXT NOT NULL,
  customer_phone TEXT,
  product_name TEXT NOT NULL,
  metadata JSONB DEFAULT '{}'::jsonb, -- Store chart_ids, etc.
  payment_method TEXT,
  payment_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on orders
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Orders policies
-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
ON public.orders FOR SELECT
USING (auth.uid() = user_id);

-- Anyone can insert orders (for public checkout)
-- Ideally, this should be more restricted, but for guest checkout we allow it.
-- We can rely on the edge function to handle the secure processing.
CREATE POLICY "Service role can manage all orders"
ON public.orders
TO service_role
USING (true)
WITH CHECK (true);

-- Allow authenticated users to insert their own orders
CREATE POLICY "Users can insert their own orders"
ON public.orders FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- Allow anon to insert orders (guest checkout)
CREATE POLICY "Anon can insert orders"
ON public.orders FOR INSERT
WITH CHECK (user_id IS NULL);

-- Create index on reference_id for faster webhook lookups
CREATE INDEX idx_orders_reference_id ON public.orders(reference_id);
CREATE INDEX idx_orders_customer_email ON public.orders(customer_email);

-- Create trigger for updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
