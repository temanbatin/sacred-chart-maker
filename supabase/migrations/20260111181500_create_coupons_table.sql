-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    code TEXT NOT NULL UNIQUE,
    discount_type TEXT NOT NULL DEFAULT 'full_free', -- 'full_free', 'percentage', 'fixed_amount'
    max_uses INTEGER NOT NULL DEFAULT 1,
    current_uses INTEGER NOT NULL DEFAULT 0,
    is_active BOOLEAN NOT NULL DEFAULT true,
    expires_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- RLS Policies
-- Only service role can read/write coupons (for now) to prevent users from listing codes
CREATE POLICY "Service role can do everything on coupons"
    ON public.coupons
    FOR ALL
    USING (auth.role() = 'service_role');

-- Create RPC to check coupon validity safely from frontend
CREATE OR REPLACE FUNCTION check_coupon_validity(coupon_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER -- Runs with privileges of creator (postgres) to bypass RLS on coupons table
AS $$
DECLARE
    coupon_record RECORD;
BEGIN
    SELECT * INTO coupon_record
    FROM public.coupons
    WHERE code = coupon_code
      AND is_active = true
      AND (expires_at IS NULL OR expires_at > now());

    IF coupon_record IS NULL THEN
        RETURN jsonb_build_object('valid', false, 'message', 'Kupon tidak ditemukan atau sudah kadaluarsa');
    END IF;

    IF coupon_record.current_uses >= coupon_record.max_uses THEN
        RETURN jsonb_build_object('valid', false, 'message', 'Kuota kupon sudah habis');
    END IF;

    RETURN jsonb_build_object(
        'valid', true,
        'discount_type', coupon_record.discount_type,
        'message', 'Kupon valid!'
    );
END;
$$;
