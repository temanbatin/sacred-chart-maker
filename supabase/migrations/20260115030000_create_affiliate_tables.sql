-- Create Affiliates Table
CREATE TABLE public.affiliates (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    coupon_code TEXT REFERENCES public.coupons(code) ON DELETE SET NULL,
    bank_info JSONB DEFAULT '{}'::JSONB, -- { bank_name, account_number, account_holder }
    balance NUMERIC DEFAULT 0,
    total_earnings NUMERIC DEFAULT 0,
    status TEXT DEFAULT 'active' CHECK (status IN ('active', 'suspended')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id),
    UNIQUE(coupon_code)
);

-- Create Commissions Table
CREATE TABLE public.commissions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    affiliate_id UUID REFERENCES public.affiliates(id) ON DELETE CASCADE NOT NULL,
    order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
    amount NUMERIC NOT NULL,
    status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'paid', 'cancelled')),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_affiliates_user_id ON public.affiliates(user_id);
CREATE INDEX idx_affiliates_coupon_code ON public.affiliates(coupon_code);
CREATE INDEX idx_commissions_affiliate_id ON public.commissions(affiliate_id);

-- RLS Policies
ALTER TABLE public.affiliates ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.commissions ENABLE ROW LEVEL SECURITY;

-- Affiliates can view their own profile
CREATE POLICY "Users can view own affiliate profile" ON public.affiliates
    FOR SELECT USING (auth.uid() = user_id);

-- Affiliates can update their own bank info
CREATE POLICY "Users can update own bank info" ON public.affiliates
    FOR UPDATE USING (auth.uid() = user_id);

-- Affiliates can view their own commissions
CREATE POLICY "Users can view own commissions" ON public.commissions
    FOR SELECT USING (
        affiliate_id IN (
            SELECT id FROM public.affiliates WHERE user_id = auth.uid()
        )
    );

-- Service Role (Server-side) can do anything
CREATE POLICY "Service role full access affiliates" ON public.affiliates
    FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "Service role full access commissions" ON public.commissions
    FOR ALL USING (auth.role() = 'service_role');
