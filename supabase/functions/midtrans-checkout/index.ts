import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

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

const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getCorsHeaders(req: Request) {
    const origin = req.headers.get('origin') || '';
    const allowedOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0];
    return {
        'Access-Control-Allow-Origin': allowedOrigin,
        'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
    };
}

function generateReferenceId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `TB-${timestamp}-${random}`;
}

function formatPhoneNumber(phone: string): string {
    // Handle null, undefined, or empty string
    if (!phone || typeof phone !== 'string') {
        throw new Error('Nomor WhatsApp wajib diisi');
    }

    let p = phone.replace(/[^\d+]/g, ''); // Keep digits and +
    if (p.startsWith('0')) {
        p = '62' + p.substring(1);
    } else if (p.startsWith('+')) {
        p = p.substring(1);
    }
    // If no prefix and likely ID, add 62 (simple heuristic)
    if (p.startsWith('8')) {
        p = '62' + p;
    }

    // Validate minimum length (62 + at least 9 digits)
    if (p.length < 11) {
        throw new Error('Nomor WhatsApp tidak valid. Gunakan format: 08123456789 atau +628123456789');
    }

    return p;
}

interface CheckoutRequest {
    referenceId?: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    amount: number;
    productName: string;
    chartIds?: string[];
    birthData?: any;
    couponCode?: string;
    products?: string[];
}

// ===== RATE LIMITING =====
const rateLimitStore = new Map<string, { count: number; resetTime: number }>();
const RATE_LIMIT_MAX = 10; // Max checkout attempts per window
const RATE_LIMIT_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(clientIP: string): { allowed: boolean; remaining: number } {
    const now = Date.now();
    const record = rateLimitStore.get(clientIP);

    if (!record || now > record.resetTime) {
        rateLimitStore.set(clientIP, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
        return { allowed: true, remaining: RATE_LIMIT_MAX - 1 };
    }

    if (record.count >= RATE_LIMIT_MAX) {
        return { allowed: false, remaining: 0 };
    }

    record.count++;
    return { allowed: true, remaining: RATE_LIMIT_MAX - record.count };
}

serve(async (req) => {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        return new Response('ok', { headers: getCorsHeaders(req) });
    }

    const currentCorsHeaders = getCorsHeaders(req);

    // Rate limiting check
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
        req.headers.get('x-real-ip') || 'unknown';

    const rateLimit = checkRateLimit(clientIP);
    if (!rateLimit.allowed) {
        console.log(`Checkout rate limit exceeded for IP: ${clientIP}`);
        return new Response(
            JSON.stringify({
                success: false,
                error: 'Terlalu banyak percobaan checkout. Silakan coba lagi dalam 1 jam.'
            }),
            {
                status: 429,
                headers: {
                    ...currentCorsHeaders,
                    'Content-Type': 'application/json',
                    'Retry-After': '3600'
                }
            }
        );
    }

    try {
        const MIDTRANS_SERVER_KEY = (Deno.env.get('MIDTRANS_SERVER_KEY') || '').trim();

        if (!MIDTRANS_SERVER_KEY) {
            throw new Error('Payment gateway not configured (Missing Server Key)');
        }

        // Auto-detect environment based on Server Key Custom Prefix (SB- for sandbox)
        // This makes the system robust against missing MIDTRANS_IS_PRODUCTION secrets
        const isSandboxKey = MIDTRANS_SERVER_KEY.startsWith('SB-');
        const isProduction = !isSandboxKey;

        // Optionally check the explicit secret if desired, but reliance on Key is safer for consistency
        // const explicitEnv = Deno.env.get('MIDTRANS_IS_PRODUCTION');
        // if (explicitEnv !== undefined) { ... warn if mismatch ... }

        const MIDTRANS_API_URL = isProduction
            ? 'https://app.midtrans.com/snap/v1/transactions'
            : 'https://app.sandbox.midtrans.com/snap/v1/transactions';

        console.log(`Using Midtrans Env in: ${isProduction ? 'PRODUCTION' : 'SANDBOX'} mode`);

        const body: CheckoutRequest = await req.json();

        const {
            referenceId,
            customerName,
            customerEmail,
            customerPhone,
            amount,
            productName,
            chartIds,
            // birthData, // stored in metadata/DB, not sent to midtrans specifically except maybe custom fields if needed
            // products
        } = body;

        const refId = referenceId || generateReferenceId();
        const origin = req.headers.get('origin') || 'https://temanbatin.com';

        // Ensure FINISH_URL points to the frontend
        const FINISH_URL = `${origin}/payment-result?ref=${refId}`;

        // Midtrans limit: 50 chars for item name
        const truncatedProductName = (productName || 'Laporan Human Design').substring(0, 50);

        // Round amount to integer (IDR doesn't support decimals in most gateways)
        const finalAmount = Math.round(amount);

        const snapRequest = {
            transaction_details: {
                order_id: refId,
                gross_amount: finalAmount
            },
            item_details: [
                {
                    id: 'human-design-report', // Generic ID for the combined line item
                    price: finalAmount,
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

        console.log('Calling Midtrans Snap API:', MIDTRANS_API_URL);

        const authString = btoa(MIDTRANS_SERVER_KEY + ':');

        const response = await fetch(MIDTRANS_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authString}`,
                'Accept': 'application/json'
            },
            body: JSON.stringify(snapRequest),
        });

        const responseText = await response.text();
        let midtransResponse;
        try {
            midtransResponse = JSON.parse(responseText);
        } catch {
            console.error('Midtrans Parse Error:', responseText);
            throw new Error('Invalid response from payment gateway');
        }

        if (!response.ok) {
            console.error('Midtrans Error:', midtransResponse);
            const debugMode = isProduction ? 'PROD' : 'SANDBOX';
            const debugKey = MIDTRANS_SERVER_KEY.substring(0, 10) + '...';
            const errorDetails = midtransResponse.error_messages?.join(', ') || 'Payment gateway error';
            throw new Error(`${errorDetails} [Mode: ${debugMode}, KeyPrefix: ${debugKey}]`);
        }

        const snapToken = midtransResponse.token;
        const redirectUrl = midtransResponse.redirect_url;

        if (!snapToken) {
            throw new Error('Snap token not received');
        }

        // Update Order in DB with Redirect URL if existing
        if (referenceId) {
            // We don't await this to keep response fast, or we can await to ensure it's saved.
            // Awaiting is safer for consistency.
            await supabase
                .from('orders')
                .update({ payment_url: redirectUrl })
                .eq('reference_id', referenceId);
        }

        return new Response(JSON.stringify({
            success: true,
            token: snapToken,
            redirect_url: redirectUrl,
            referenceId: refId
        }), {
            headers: { ...currentCorsHeaders, 'Content-Type': 'application/json' },
            status: 200
        });

    } catch (error: any) {
        console.error('Checkout Function Error:', error);
        return new Response(JSON.stringify({
            success: false,
            error: error.message || 'Internal Server Error'
        }), {
            headers: { ...getCorsHeaders(req), 'Content-Type': 'application/json' },
            status: 400
        });
    }
});
