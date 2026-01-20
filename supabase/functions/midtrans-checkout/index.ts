import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Supabase Admin Client (needed to read/write coupons)
const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

// Midtrans API Configuration
// Sandbox: https://app.sandbox.midtrans.com/snap/v1/transactions
// Production: https://app.midtrans.com/snap/v1/transactions
// function to get isProduction
// Hardcoded for Production
const isProduction = true;
const MIDTRANS_API_URL = 'https://app.midtrans.com/snap/v1/transactions';

// ... interface ...

// ... generateReferenceId ...
// ... formatPhoneNumber ...

serve(async (req) => {
    // ... cors ...

    try {
        const MIDTRANS_SERVER_KEY = (Deno.env.get('MIDTRANS_SERVER_KEY') || '').trim();

        if (!MIDTRANS_SERVER_KEY) {
            console.error('Midtrans credentials not configured');
            throw new Error('Payment gateway not configured (Missing Server Key)');
        }

        // Check environment state
        // const isProduction = true; // Already defined globally
        // const MIDTRANS_API_URL = ... // Already defined globally

        // Validate Key Prefix - Ensure we are NOT using a Sandbox key
        if (MIDTRANS_SERVER_KEY.startsWith('SB-')) {
            const msg = 'CRITICAL ERROR: Production mode is hardcoded, but Server Key appears to be Sandbox (starts with SB-). Please update Supabase Secrets with the Production Server Key.';
            console.error(msg);
            throw new Error(msg);
        }


        const {
            referenceId,
            customerName,
            customerEmail,
            customerPhone,
            amount,
            productName,
            chartIds,
            couponCode
        }: CheckoutRequest & { couponCode?: string } = await req.json();

        // ... discount code omitted for brevity as it is unchanged ...

        // Debug Environment
        console.log('Environment Config:', {
            isProductionVar: Deno.env.get('MIDTRANS_IS_PRODUCTION'),
            calculatedIsProduction: isProduction,
            apiUrl: MIDTRANS_API_URL,
            serverKeyLength: MIDTRANS_SERVER_KEY?.length,
            serverKeyPrefix: MIDTRANS_SERVER_KEY?.substring(0, 5) + '...'
        });

        const refId = referenceId || generateReferenceId();
        const origin = req.headers.get('origin') || 'https://temanbatin.com';

        // Hardcode the production Supabase Function URL for webhook
        const PROJECT_REF = 'ggyhinxltikifmzczuyg';
        const FINISH_URL = `${origin}/payment-result?ref=${refId}`;

        // Prepare Midtrans Snap request body
        // Midtrans has a 50-char limit for item name
        const truncatedProductName = (productName || 'Laporan Analisis Human Design').substring(0, 50);

        const snapRequest = {
            transaction_details: {
                order_id: refId,
                gross_amount: finalAmount  // Use Final Discounted Amount
            },
            item_details: [
                {
                    id: 'full-report',
                    price: finalAmount, // Use Final Discounted Amount
                    quantity: 1,
                    name: truncatedProductName
                }
            ],
            customer_details: {
                first_name: customerName,
                email: customerEmail,
                phone: formatPhoneNumber(customerPhone)
            },
            callbacks: {
                finish: FINISH_URL
            },
            expiry: {
                unit: 'hours',
                duration: 24
            }
        };

        const bodyString = JSON.stringify(snapRequest);

        // Base64 encode server key for Basic Auth
        const authString = btoa(MIDTRANS_SERVER_KEY + ':');

        console.log('Calling Midtrans Snap API with reference:', referenceId);
        console.log('Request body:', bodyString);

        // Call Midtrans Snap API
        const response = await fetch(MIDTRANS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authString}`,
                'Accept': 'application/json'
            },
            body: bodyString,
        });

        const responseText = await response.text();
        console.log('Midtrans API response status:', response.status);
        console.log('Midtrans API response:', responseText);

        let midtransResponse;
        try {
            midtransResponse = JSON.parse(responseText);
        } catch {
            console.error('Failed to parse Midtrans response:', responseText);
            throw new Error('Invalid response from payment gateway');
        }

        if (!response.ok) {
            console.error('Midtrans API error:', midtransResponse);
            throw new Error(midtransResponse.error_messages?.join(', ') || 'Payment gateway error');
        }

        // Extract Snap token from response
        const snapToken = midtransResponse.token;
        const redirectUrl = midtransResponse.redirect_url;

        if (!snapToken) {
            console.error('No Snap token in Midtrans response:', midtransResponse);
            throw new Error('Snap token not received');
        }

        console.log('Snap token generated successfully');

        // Save payment_url to database
        if (redirectUrl && referenceId) {
            const { error: updateError } = await supabase
                .from('orders')
                .update({ payment_url: redirectUrl })
                .eq('reference_id', referenceId);

            if (updateError) {
                console.error('Error saving payment_url:', updateError);
            } else {
                console.log('Payment URL saved to order:', referenceId);
            }
        }

        return new Response(JSON.stringify({
            success: true,
            token: snapToken,
            redirect_url: redirectUrl,
            paymentUrl: redirectUrl,
            referenceId: referenceId
        }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });

    } catch (error) {
        console.error('Error in midtrans-checkout function:', error);
        return new Response(
            JSON.stringify({
                success: false,
                error: error instanceof Error ? error.message : 'Unknown error'
            }),
            { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
    }
});
