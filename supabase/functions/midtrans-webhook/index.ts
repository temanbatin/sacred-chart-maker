import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { createHash, createHmac } from "https://deno.land/std@0.168.0/node/crypto.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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
    // Signature formula: SHA512(order_id+status_code+gross_amount+ServerKey)
    const rawString = orderId + statusCode + grossAmount + serverKey;
    const hash = createHash('sha512');
    hash.update(rawString);
    const expectedSignature = hash.digest('hex');

    return expectedSignature === signatureKey;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY');

        if (!MIDTRANS_SERVER_KEY) {
            throw new Error('Midtrans server key not configured');
        }

        // Parse webhook notification from Midtrans
        const notification: MidtransNotification = await req.json();

        console.log('Midtrans webhook received:', JSON.stringify(notification));

        const {
            order_id,
            transaction_status,
            fraud_status,
            status_code,
            gross_amount,
            signature_key,
            payment_type,
            settlement_time,
            transaction_id
        } = notification;

        // Verify signature
        const isValidSignature = verifySignature(
            order_id,
            status_code,
            gross_amount,
            MIDTRANS_SERVER_KEY,
            signature_key
        );

        if (!isValidSignature) {
            console.error('Invalid signature for order:', order_id);
            return new Response(
                JSON.stringify({ success: false, error: 'Invalid signature' }),
                { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
            );
        }

        console.log(`Transaction ${order_id} status: ${transaction_status}`);
        console.log(`Payment type: ${payment_type}`);
        console.log(`Gross amount: ${gross_amount}`);

        // Initialize Supabase client
        const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
        const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Determine order status based on transaction_status
        // capture: Card payment completed
        // settlement: Non-card payment completed
        // pending: Waiting for payment
        // deny: Payment denied
        // cancel: Payment cancelled
        // expire: Payment expired
        // failure: Payment failed

        const isSuccess =
            transaction_status === 'capture' ||
            transaction_status === 'settlement';

        const isPending = transaction_status === 'pending';

        const isFailed =
            transaction_status === 'deny' ||
            transaction_status === 'cancel' ||
            transaction_status === 'expire' ||
            transaction_status === 'failure';

        // Also check fraud_status for card transactions
        const isFraud = fraud_status === 'deny';

        if (isSuccess && !isFraud) {
            console.log('Payment successful! Processing order...');

            // Update order status to PAID
            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    status: 'PAID',
                    paid_at: settlement_time || new Date().toISOString(),
                    payment_method: payment_type,
                    updated_at: new Date().toISOString()
                })
                .eq('reference_id', order_id);

            if (updateError) {
                console.error('Error updating order status:', updateError);
            } else {
                console.log(`Order ${order_id} updated to PAID`);

                // TRIGGER N8N WORKFLOW
                try {
                    const N8N_WEBHOOK_URL = 'https://n8n.indonetwork.or.id/webhook/hd-order-paid';

                    console.log(`Triggering n8n workflow at ${N8N_WEBHOOK_URL}...`);

                    // Fetch order details to send complete data to n8n
                    const { data: orderData } = await supabase
                        .from('orders')
                        .select('*')
                        .eq('reference_id', order_id)
                        .single();

                    // Fetch related charts data
                    const chartIds = orderData?.metadata?.chart_ids || [];
                    let chartsData: any[] = [];

                    if (Array.isArray(chartIds) && chartIds.length > 0) {
                        const { data: fetchedCharts } = await supabase
                            .from('saved_charts')
                            .select('*')
                            .in('id', chartIds);
                        chartsData = fetchedCharts || [];
                    }

                    const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            order: orderData,
                            charts: chartsData,
                            transaction: {
                                transaction_id,
                                payment_type,
                                settlement_time,
                                gross_amount
                            }
                        })
                    });

                    if (n8nResponse.ok) {
                        console.log('n8n workflow triggered successfully');
                    } else {
                        console.error('Failed to trigger n8n workflow:', n8nResponse.status);
                    }
                } catch (n8nError) {
                    console.error('Error calling n8n webhook:', n8nError);
                    // Don't fail the whole request just because n8n failed
                }
            }

        } else if (isPending) {
            console.log('Payment pending...');
            // Order is already in PENDING status by default

        } else if (isFailed || isFraud) {
            console.log('Payment failed or denied.');

            const { error: updateError } = await supabase
                .from('orders')
                .update({
                    status: 'FAILED',
                    updated_at: new Date().toISOString()
                })
                .eq('reference_id', order_id);

            if (updateError) {
                console.error('Error updating order status for failure:', updateError);
            }
        }

        // Return success response to Midtrans
        return new Response(JSON.stringify({
            success: true,
            message: 'Notification received',
            order_id: order_id,
            status: transaction_status
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error processing Midtrans webhook:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
