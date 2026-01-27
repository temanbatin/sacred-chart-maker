import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHash, createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

/**
 * Validates and sanitizes the n8n webhook URL.
 * Prevents "Url scheme 'warning' not supported" or similar errors.
 */
function getValidWebhookUrl(): string {
    const envUrl = Deno.env.get('N8N_ORDER_PAID_WEBHOOK_URL');
    const defaultUrl = 'https://flow.otomasi.click/webhook/hd-order-paid';

    if (!envUrl) return defaultUrl;
    if (!envUrl.startsWith('http')) {
        console.warn('N8N_ORDER_PAID_WEBHOOK_URL seems invalid, using default. Value:', envUrl);
        return defaultUrl;
    }
    return envUrl;
}

// Allowed origins for CORS
const ALLOWED_ORIGINS = [
    'https://temanbatin.com',
    'https://www.temanbatin.com',
    'http://localhost:5173',
    'http://localhost:5174',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://127.0.0.1:5173',
    'http://127.0.0.1:8080'
];

function getCorsHeaders(req: Request) {
    const origin = req.headers.get('origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };
}

interface MidtransNotification {
    transaction_time: string;
    transaction_status: string;
    transaction_id: string;
    status_message: string;
    status_code: string;
    signature_key: string;
    settlement_time?: string;
    payment_type: string;
    order_id: string;
    merchant_id: string;
    gross_amount: string;
    fraud_status?: string;
    currency: string;
}

// Verify Midtrans signature
function verifySignature(
    orderId: string,
    statusCode: string,
    grossAmount: string,
    serverKey: string,
    signatureKey: string
): boolean {
    const rawString = orderId + statusCode + grossAmount + serverKey;
    const hash = createHash('sha512');
    hash.update(rawString);
    const expectedSignature = hash.digest('hex');
    return expectedSignature === signatureKey;
}

serve(async (req) => {
    const corsHeaders = getCorsHeaders(req);

    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY');
        if (!MIDTRANS_SERVER_KEY) {
            throw new Error('Midtrans server key not configured');
        }

        const notification: MidtransNotification = await req.json();
        console.log('Midtrans webhook received:', JSON.stringify(notification));

        const {
            order_id, transaction_status, fraud_status, status_code,
            gross_amount, signature_key, payment_type, settlement_time, transaction_id
        } = notification;

        // Verify signature
        if (!verifySignature(order_id, status_code, gross_amount, MIDTRANS_SERVER_KEY, signature_key)) {
            console.error('Invalid signature for order:', order_id);
            return new Response(JSON.stringify({ success: false, error: 'Invalid signature' }), {
                status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
            });
        }

        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        const isSuccess = transaction_status === 'capture' || transaction_status === 'settlement';
        const isPending = transaction_status === 'pending';
        const isFailed = ['deny', 'cancel', 'expire', 'failure'].includes(transaction_status);
        const isFraud = fraud_status === 'deny';

        if (isSuccess && !isFraud) {
            console.log('Payment successful! Processing order...');

            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    status: 'PAID',
                    paid_at: settlement_time || new Date().toISOString(),
                    payment_method: payment_type,
                    updated_at: new Date().toISOString()
                })
                .eq('reference_id', order_id);

            if (!updateError) {
                console.log(`Order ${order_id} updated to PAID`);

                // Affiliate logic
                try {
                    const { data: orderData } = await supabase.from('orders').select('*').eq('reference_id', order_id).single();
                    const couponCode = orderData?.metadata?.coupon_code;
                    if (couponCode) {
                        const { data: affiliate } = await supabase.from('affiliates').select('*').eq('coupon_code', couponCode).single();
                        if (affiliate) {
                            const commissionAmount = Math.round(Number(gross_amount) * 0.15);
                            await supabase.from('commissions').insert({
                                affiliate_id: affiliate.id, order_id: orderData.id, amount: commissionAmount, status: 'paid'
                            });
                            await supabase.from('affiliates').update({
                                balance: (Number(affiliate.balance) || 0) + commissionAmount,
                                total_earnings: (Number(affiliate.total_earnings) || 0) + commissionAmount
                            }).eq('id', affiliate.id);
                        }
                    }
                } catch (e) { console.error('Affiliate error:', e); }

                // Update Whatsapp Session Logic
                try {
                    const { data: orderData } = await supabase.from('orders').select('*').eq('reference_id', order_id).single();
                    const phone = orderData?.customer_phone;

                    if (phone) {
                        let cleanPhone = phone.replace(/\D/g, '');
                        if (cleanPhone.startsWith('0')) cleanPhone = '62' + cleanPhone.slice(1);
                        if (!cleanPhone.startsWith('62')) cleanPhone = '62' + cleanPhone;

                        const chartIds = orderData?.metadata?.chart_ids || [];
                        let targetChartId = null;
                        let targetChartData = null;

                        // Priority 1: From saved_charts (if ID exists)
                        if (Array.isArray(chartIds) && chartIds.length > 0) {
                            targetChartId = chartIds[0];
                            const { data: fetchedChart } = await supabase.from('saved_charts').select('chart_data').eq('id', targetChartId).single();
                            targetChartData = fetchedChart?.chart_data;
                        }
                        // Priority 2: From metadata snapshot (Guest)
                        else if (orderData?.metadata?.chart_snapshot) {
                            targetChartData = orderData.metadata.chart_snapshot;
                        }

                        // NEW: Subscription Logic
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

                        const productIdList = (orderData?.metadata?.products as string[]) || [];
                        const productNameLower = (orderData?.product_name || '').toLowerCase();
                        let daysToAdd = 0;
                        let isLifetime = existingSession?.is_lifetime || false;

                        // Logic:
                        // 1. Full Report -> Bonus 30 Days
                        // 2. Kira Subscription -> +30 Days
                        if (productIdList.includes('full_report') || productNameLower.includes('full')) {
                            daysToAdd = 30;
                        } else if (productIdList.includes('whatsapp_kira_subscription') || productNameLower.includes('kira')) {
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
                                name: orderData?.customer_name,
                                last_active: new Date().toISOString(),
                                subscription_end_at: newEndAt.toISOString(), // Updated expiration
                                is_lifetime: isLifetime
                            }, { onConflict: 'whatsapp' });

                        if (sessionError) console.error('Error updating whatsapp_session:', sessionError);
                        else console.log('Updated whatsapp_session subscription for', cleanPhone);
                    }
                } catch (e) { console.error('Whatsapp Session Update Error:', e); }

                // Trigger n8n
                try {
                    const N8N_WEBHOOK_URL = getValidWebhookUrl();
                    const { data: orderData } = await supabase.from('orders').select('*').eq('reference_id', order_id).single();
                    const chartIds = orderData?.metadata?.chart_ids || [];
                    let chartsData: any[] = [];
                    // Priority 1: Fetch from saved_charts (Registered Users)
                    if (Array.isArray(chartIds) && chartIds.length > 0) {
                        const { data: fetchedCharts } = await supabase.from('saved_charts').select('*').in('id', chartIds);
                        chartsData = fetchedCharts || [];
                    }

                    // Priority 2: Use snapshot from metadata (Guest Users)
                    if (chartsData.length === 0 && orderData?.metadata?.chart_snapshot) {
                        console.log('Using chart_snapshot from metadata for Guest Order');
                        chartsData = [orderData.metadata.chart_snapshot];
                    }

                    let report_type = 'personal-comprehensive';
                    const productNameLower = (orderData?.product_name || '').toLowerCase();
                    const productIds = (orderData?.metadata?.products as string[]) || [];

                    // Logic Determination based on Product ID (More accurate) or Name
                    if (productIds.includes('whatsapp_kira_subscription') || productNameLower.includes('subscription')) {
                        report_type = 'kira-subscription';
                    } else if (productIds.includes('full_report') || productNameLower.includes('full')) {
                        // Full Report now implies Bundle (Bazi + Kira)
                        report_type = 'bundle-full-bazi';
                    } else if (productIds.includes('bazi_report') || productNameLower.includes('bazi')) {
                        // Check if it's explicitly Bazi ONLY
                        if (productIds.includes('bazi_only')) {
                            report_type = 'bazi-only';
                        } else {
                            report_type = 'bundle-full-bazi'; // Legacy Bazi Report was a bundle
                        }
                    } else if (productNameLower.includes('essential')) {
                        report_type = 'personal-essential';
                    }

                    let n8n_debug: any = {};
                    try {
                        const n8nResp = await fetch(N8N_WEBHOOK_URL, {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({
                                order: orderData,
                                email: orderData?.customer_email,
                                whatsapp: orderData?.customer_phone,
                                charts: chartsData,
                                report_type,
                                transaction: { transaction_id, payment_type, settlement_time, gross_amount }
                            })
                        });
                        const text = await n8nResp.text();
                        n8n_debug = { status: n8nResp.status, ok: n8nResp.ok, response: text.substring(0, 500) };
                    } catch (e: any) { n8n_debug = { error: e.message }; }

                    await supabase.from('orders').update({
                        metadata: { ...(orderData?.metadata || {}), n8n_webhook_debug: n8n_debug, triggered_url: N8N_WEBHOOK_URL }
                    }).eq('reference_id', order_id);
                } catch (e) { console.error('n8n block error:', e); }
            }
        } else if (isFailed || isFraud) {
            await supabase.from('orders').update({ status: 'FAILED', updated_at: new Date().toISOString() }).eq('reference_id', order_id);
        }

        return new Response(JSON.stringify({ success: true, message: 'Notification received', order_id, status: transaction_status }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    } catch (error) {
        console.error('Webhook processing error:', error);
        return new Response(JSON.stringify({ success: false, error: error instanceof Error ? error.message : 'Unknown error' }), {
            status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
    }
});
