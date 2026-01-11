-- 1. Add discount_value column
ALTER TABLE public.coupons 
ADD COLUMN IF NOT EXISTS discount_value NUMERIC DEFAULT 0;

-- 2. Update check_coupon_validity RPC to return discount_value
CREATE OR REPLACE FUNCTION check_coupon_validity(coupon_code TEXT)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
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
        'discount_value', coupon_record.discount_value,
        'message', 'Kupon valid!'
    );
END;
$$;
