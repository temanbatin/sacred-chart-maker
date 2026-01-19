import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// CORS Headers
const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Supabase Admin Client (needed to write orders)
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface RedeemRequest {
    couponCode: string;
    referenceId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    productName: string;
    chartIds?: string[];
    birthData?: any;
    userId?: string;
}

serve(async (req) => {
    // Handle CORS
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const { couponCode, referenceId, customerName, customerEmail, customerPhone, productName, chartIds, birthData, userId } = await req.json();

        console.log('Processing coupon redemption:', { couponCode, referenceId, customerEmail });

        // 1. Validate Coupon (Server-side check)
        const { data: coupons, error: couponError } = await supabase
            .from('coupons')
            .select('*')
            .eq('code', couponCode)
            .eq('is_active', true)
            .single();

        if (couponError || !coupons) {
            console.error('Coupon validation failed:', couponError);
            throw new Error('Kode kupon invalid');
        }

        // Check Expiry
        if (coupons.expires_at && new Date(coupons.expires_at) < new Date()) {
            throw new Error('Kupon sudah kadaluarsa');
        }

        // Usage Check (Simplified for MVP)
        if (coupons.current_uses >= coupons.max_uses) {
            throw new Error('Kuota kupon sudah habis');
        }

        if (coupons.discount_type !== 'full_free') {
            throw new Error('Tipe kupon tidak didukung untuk klaim gratis');
        }

        // 2. Create Order as PAID
        const { error: orderError } = await supabase
            .from('orders')
            .insert({
                user_id: userId || null,
                reference_id: referenceId,
                customer_name: customerName,
                customer_email: customerEmail,
                customer_phone: customerPhone,
                product_name: productName,
                amount: 0, // FREE
                status: 'PAID', // Directly PAID
                paid_at: new Date().toISOString(),
                payment_method: 'coupon',
                metadata: {
                    chart_ids: chartIds,
                    birth_data: birthData,
                    coupon_code: couponCode
                }
            });

        if (orderError) {
            console.error('Order creation error:', orderError);
            throw new Error('Gagal membuat pesanan');
        }

        // 3. Increment Coupon Usage
        const { error: updateError } = await supabase
            .from('coupons')
            .update({ current_uses: (coupons.current_uses || 0) + 1 })
            .eq('id', coupons.id);

        if (updateError) {
            console.error('Failed to increment coupon usage:', updateError);
        }

        // 4. TRIGGER N8N WORKFLOW (Simulate Paid Order)
        let n8nResponse;
        let responseText;
        let n8n_debug = {};
        const N8N_WEBHOOK_URL = Deno.env.get('N8N_ORDER_PAID_WEBHOOK_URL') || 'https://flow.otomasi.click/webhook/hd-order-paid';

        try {
            console.log(`Triggering n8n workflow at ${N8N_WEBHOOK_URL}...`);

            // Fetch created order details
            const { data: orderData } = await supabase
                .from('orders')
                .select('*')
                .eq('reference_id', referenceId)
                .single();

            // Fetch related charts data
            const chartIdsArray = orderData?.metadata?.chart_ids || [];
            let chartsData: any[] = [];

            if (Array.isArray(chartIdsArray) && chartIdsArray.length > 0) {
                const { data: fetchedCharts } = await supabase
                    .from('saved_charts')
                    .select('*')
                    .in('id', chartIdsArray);
                chartsData = fetchedCharts || [];
            }

            // Determine report_type based on product_name
            let report_type = 'personal-comprehensive'; // Default
            const productNameLower = (orderData?.product_name || '').toLowerCase();

            if (productNameLower.includes('bazi') && productNameLower.includes('human design')) {
                if (productNameLower.includes('essential')) {
                    report_type = 'bundle-essential-bazi';
                } else {
                    report_type = 'bundle-full-bazi';
                }
            } else if (productNameLower.includes('essential')) {
                report_type = 'personal-essential';
            } else if (productNameLower.includes('bazi')) {
                report_type = 'bazi';
            }

            // Send to N8N
            n8nResponse = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order: orderData,
                    charts: chartsData,
                    report_type: report_type,
                    transaction: {
                        transaction_id: `COUPON-${referenceId}`,
                        payment_type: 'coupon',
                        settlement_time: new Date().toISOString(),
                        gross_amount: "0.00",
                        coupon_code: couponCode
                    }
                })
            });

            responseText = await n8nResponse.text();
            console.log(`N8N Response Status: ${n8nResponse.status}`);

            n8n_debug = {
                status: n8nResponse.status,
                ok: n8nResponse.ok,
                response: responseText.substring(0, 500)
            };

            if (n8nResponse.ok) {
                console.log('n8n workflow triggered successfully');
            } else {
                console.error(`Failed to trigger n8n workflow: ${n8nResponse.status} - ${responseText}`);
            }
        } catch (n8nError: any) {
            console.error('Error calling n8n webhook:', n8nError);
            n8n_debug = {
                error: n8nError.message || 'Unknown network error'
            };
        }

        // Update order with n8n debug info
        await supabase
            .from('orders')
            .update({
                metadata: {
                    ...(birthData ? { birth_data: birthData } : {}),
                    chart_ids: chartIds,
                    coupon_code: couponCode,
                    n8n_webhook_debug: n8n_debug
                }
            })
            .eq('reference_id', referenceId);

        return new Response(JSON.stringify({
            success: true,
            message: 'Kupon berhasil digunakan!',
            redirect_url: `/payment-result?ref=${referenceId}&status=success`,
            order_status: 'PAID',
            debug: {
                n8n_url: N8N_WEBHOOK_URL,
                n8n_status: n8nResponse ? n8nResponse.status : 'unknown',
                n8n_body: responseText || 'no body'
            }
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
        });

    } catch (error: any) {
        console.error('Redeem function error:', error);
        return new Response(JSON.stringify({
            error: error.message || 'Terjadi kesalahan internal'
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 400,
        });
    }
});
