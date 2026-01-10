import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Midtrans API Configuration
// Sandbox: https://app.sandbox.midtrans.com/snap/v1/transactions
// Production: https://app.midtrans.com/snap/v1/transactions
const MIDTRANS_API_URL = 'https://app.sandbox.midtrans.com/snap/v1/transactions';

interface CheckoutRequest {
    referenceId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    amount: number;
    productName: string;
    chartIds?: string[];
}

// Generate reference ID
function generateReferenceId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `TB-${timestamp}-${random}`;
}

// Format phone number for Midtrans (remove +62, use 08xxx format)
function formatPhoneNumber(phone: string | undefined): string {
    if (!phone) return '08000000000';

    let digits = phone.replace(/\D/g, '');

    // If starts with 62, replace with 0
    if (digits.startsWith('62')) {
        digits = '0' + digits.substring(2);
    }

    // Ensure it starts with 0
    if (!digits.startsWith('0')) {
        digits = '0' + digits;
    }

    return digits;
}

serve(async (req) => {
    if (req.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    try {
        const MIDTRANS_SERVER_KEY = Deno.env.get('MIDTRANS_SERVER_KEY');

        if (!MIDTRANS_SERVER_KEY) {
            console.error('Midtrans credentials not configured');
            throw new Error('Payment gateway not configured');
        }

        const requestData: CheckoutRequest = await req.json();
        console.log('Checkout request received:', {
            customerName: requestData.customerName,
            customerEmail: requestData.customerEmail,
            amount: requestData.amount
        });

        const referenceId = requestData.referenceId || generateReferenceId();
        const origin = req.headers.get('origin') || 'https://temanbatin.com';

        // Hardcode the production Supabase Function URL for webhook
        const PROJECT_REF = 'ggyhinxltikifmzczuyg';
        const FINISH_URL = `${origin}/payment-result?ref=${referenceId}`;

        // Prepare Midtrans Snap request body
        const snapRequest = {
            transaction_details: {
                order_id: referenceId,
                gross_amount: requestData.amount
            },
            item_details: [
                {
                    id: 'full-report',
                    price: requestData.amount,
                    quantity: 1,
                    name: requestData.productName || 'Laporan Analisis Mendalam Human Design'
                }
            ],
            customer_details: {
                first_name: requestData.customerName,
                email: requestData.customerEmail,
                phone: formatPhoneNumber(requestData.customerPhone)
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

        return new Response(JSON.stringify({
            success: true,
            token: snapToken,
            redirectUrl: redirectUrl,
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
