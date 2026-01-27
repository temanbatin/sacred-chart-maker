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

/**
 * Validates and sanitizes the n8n webhook URL.
 * Prevents "Url scheme 'warning' not supported" or similar errors.
 */
function getValidWebhookUrl(): string {
    const envUrl = Deno.env.get('N8N_ORDER_PAID_WEBHOOK_URL');
    const defaultUrl = 'https://flow.otomasi.click/webhook/hd-order-paid';

    if (!envUrl) return defaultUrl;

    // If it doesn't start with http, it's likely corrupted (e.g. contains a CLI warning)
    if (!envUrl.startsWith('http')) {
        console.warn('N8N_ORDER_PAID_WEBHOOK_URL seems invalid, using default. Value:', envUrl);
        return defaultUrl;
    }

    return envUrl;
}

interface RedeemRequest {
    couponCode: string;
    referenceId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    productName: string;
    reportType?: string; // Explicit report type from frontend
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
        const { couponCode, referenceId, customerName, customerEmail, customerPhone, productName, reportType, chartIds, birthData, userId } = await req.json();

        console.log('Processing coupon redemption:', { couponCode, referenceId, customerEmail, reportType });

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
                    coupon_code: couponCode,
                    report_type: reportType // Store explicit report_type
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

        // 4. UPDATE WHATSAPP_SESSIONS (Same logic as midtrans-webhook)
        try {
            if (customerPhone) {
                // Clean phone number
                let cleanPhone = customerPhone.replace(/[^\d]/g, '');
                if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.substring(1);
                if (!cleanPhone.startsWith('62') && cleanPhone.startsWith('8')) cleanPhone = '62' + cleanPhone;

                console.log(`Updating whatsapp_session for FREE order: ${cleanPhone}`);

                // Get chart data from birthData if available
                let targetChartId: string | null = null;
                let targetChartData: any = null;

                // Priority 1: From saved_charts (if chartIds provided)
                if (Array.isArray(chartIds) && chartIds.length > 0) {
                    const { data: chartRecord } = await supabase
                        .from('saved_charts')
                        .select('id, chart_data')
                        .eq('id', chartIds[0])
                        .maybeSingle();
                    if (chartRecord) {
                        targetChartId = chartRecord.id;
                        targetChartData = chartRecord.chart_data;
                    }
                }
                // Priority 2: From birthData (Guest checkout)
                else if (birthData) {
                    targetChartData = birthData;
                }

                // Fetch existing session to check current expiration
                const { data: existingSession } = await supabase
                    .from('whatsapp_sessions')
                    .select('subscription_end_at, is_lifetime')
                    .eq('whatsapp', cleanPhone)
                    .maybeSingle();

                const now = new Date();
                let newEndAt = existingSession?.subscription_end_at ? new Date(existingSession.subscription_end_at) : now;
                // If expired (date in past), reset to now
                if (newEndAt < now) newEndAt = now;

                const productNameLower = (productName || '').toLowerCase();
                let daysToAdd = 0;
                const isLifetime = existingSession?.is_lifetime || false;

                // Logic: Full Report/Bundle -> Bonus 30 Days
                if (productNameLower.includes('full') || productNameLower.includes('bundle')) {
                    daysToAdd = 30;
                }

                if (daysToAdd > 0) {
                    newEndAt.setDate(newEndAt.getDate() + daysToAdd);
                    console.log(`Adding ${daysToAdd} days to subscription for ${cleanPhone}. New End: ${newEndAt.toISOString()}`);
                }

                // Upsert into whatsapp_sessions
                const { error: sessionError } = await supabase.from('whatsapp_sessions')
                    .upsert({
                        whatsapp: cleanPhone,
                        chart_id: targetChartId,
                        json_chart: targetChartData,
                        name: customerName,
                        last_active: new Date().toISOString(),
                        subscription_end_at: newEndAt.toISOString(),
                        is_lifetime: isLifetime
                    }, { onConflict: 'whatsapp' });

                if (sessionError) console.error('Error updating whatsapp_session:', sessionError);
                else console.log('Updated whatsapp_session subscription for', cleanPhone);
            }
        } catch (e) {
            console.error('Whatsapp Session Update Error:', e);
        }

        // 5. TRIGGER N8N WORKFLOW (Simulate Paid Order)
        let n8nResponse;
        let responseText;
        let n8n_debug: any = {};
        const N8N_WEBHOOK_URL = getValidWebhookUrl();

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

            // Use explicit reportType from request, fallback to inference from product_name
            let report_type = reportType || orderData?.metadata?.report_type;

            if (!report_type) {
                // Fallback: Determine report_type based on product_name (legacy support)
                report_type = 'bundle-full-bazi'; // Default to bundle
                const productNameLower = (orderData?.product_name || '').toLowerCase();

                if (productNameLower.includes('bazi only') || (productNameLower.includes('bazi') && !productNameLower.includes('human design') && !productNameLower.includes('bundle'))) {
                    report_type = 'bazi';
                } else if (productNameLower.includes('essential')) {
                    report_type = 'personal-essential';
                }
            }

            console.log('Using report_type:', report_type);

            // Send to N8N
            n8nResponse = await fetch(N8N_WEBHOOK_URL, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    order: orderData,
                    email: orderData?.customer_email,
                    whatsapp: orderData?.customer_phone,
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
                    n8n_webhook_debug: n8n_debug,
                    triggered_url: N8N_WEBHOOK_URL
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
