import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: corsHeaders });
    }

    try {
        // 1. Verify User from Token (Manual Check)
        const authHeader = req.headers.get('Authorization');
        if (!authHeader) {
            throw new Error('Missing Authorization header');
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            console.error('Auth verification failed:', authError);
            throw new Error('Unauthorized: Invalid or expired token');
        }

        const user_id = user.id;
        console.log(`Processing affiliate join for user: ${user_id}`);

        // 2. Parse Body
        const { bank_info, custom_code } = await req.json();

        // 3. Check if already affiliate
        const { data: existingAffiliate } = await supabase
            .from('affiliates')
            .select('*')
            .eq('user_id', user_id)
            .single();

        if (existingAffiliate) {
            return new Response(JSON.stringify({
                success: true,
                message: 'Already an affiliate',
                data: existingAffiliate
            }), {
                headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        // 4. Generate Coupon Code
        let couponCode = custom_code;

        // If no custom code, generate based on user email/name
        if (!couponCode) {
            const emailPart = user.email?.split('@')[0].toUpperCase().substring(0, 5) || 'USER';
            const randomSuffix = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
            couponCode = `${emailPart}${randomSuffix}`;
        }

        couponCode = couponCode.toUpperCase().replace(/[^A-Z0-9]/g, '');

        // Check if coupon exists
        const { data: existingCoupon } = await supabase
            .from('coupons')
            .select('code')
            .eq('code', couponCode)
            .single();

        if (existingCoupon) {
            throw new Error(`Kode kupon ${couponCode} sudah dipakai. Silakan pilih yang lain.`);
        }

        // 5. Create Coupon (10% OFF Default)
        const { error: couponError } = await supabase
            .from('coupons')
            .insert({
                code: couponCode,
                discount_type: 'percentage',
                discount_value: 10, // 10% Discount for user
                max_uses: 999999, // Unlimited
                is_active: true
            });

        if (couponError) throw couponError;

        // 6. Create Affiliate
        const { data: newAffiliate, error: affiliateError } = await supabase
            .from('affiliates')
            .insert({
                user_id: user_id,
                coupon_code: couponCode,
                bank_info: bank_info || {},
                status: 'active'
            })
            .select()
            .single();

        if (affiliateError) {
            console.error('Affiliate creation error:', affiliateError);
            throw affiliateError;
        }

        return new Response(JSON.stringify({
            success: true,
            data: newAffiliate
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });

    } catch (error) {
        console.error('Join Affiliate Error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error instanceof Error ? error.message : 'Unknown error'
        }), {
            status: 400,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
