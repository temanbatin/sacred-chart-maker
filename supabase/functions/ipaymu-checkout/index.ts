import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// iPaymu API Configuration
const IPAYMU_API_URL = 'https://sandbox.ipaymu.com/api/v2/payment';
// Production: 'https://my.ipaymu.com/api/v2/payment'

interface CheckoutRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  productName: string;
  referenceId?: string;
}

// Generate SHA-256 hash (lowercase)
async function sha256(message: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate HMAC-SHA256 signature
async function generateSignature(
  httpMethod: string,
  va: string,
  requestBody: string,
  apiKey: string
): Promise<string> {
  // StringToSign format: HTTPMethod:VaNumber:Lowercase(SHA-256(RequestBody)):ApiKey
  const bodyHash = await sha256(requestBody);
  const stringToSign = `${httpMethod}:${va}:${bodyHash}:${apiKey}`;

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(apiKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );

  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(stringToSign));
  const signatureArray = Array.from(new Uint8Array(signature));
  return signatureArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Generate timestamp in format YYYYMMDDhhmmss
function generateTimestamp(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  return `${year}${month}${day}${hours}${minutes}${seconds}`;
}

// Generate reference ID
function generateReferenceId(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `TB-${timestamp}-${random}`;
}

// Format phone number (remove +62, ensure starts with 08)
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
    const IPAYMU_VA = Deno.env.get('IPAYMU_VA');
    const IPAYMU_API_KEY = Deno.env.get('IPAYMU_API_KEY');

    if (!IPAYMU_VA || !IPAYMU_API_KEY) {
      console.error('iPaymu credentials not configured');
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

    // HARDCODE the production Supabase Function URL for webhook
    // This ensures iPaymu can reach it even when testing on localhost
    const PROJECT_REF = 'ggyhinxltikifmzczuyg'; // Your Supabase Project ID
    const NOTIFY_URL = `https://${PROJECT_REF}.supabase.co/functions/v1/ipaymu-webhook`;

    // Prepare iPaymu request body
    const requestBody = {
      product: [requestData.productName || 'Laporan Analisis Mendalam Human Design'],
      qty: [1],
      price: [requestData.amount],
      description: ['Full Personalized Human Design Report'],
      referenceId: referenceId,
      returnUrl: `${origin}/payment-result?ref=${referenceId}`,
      notifyUrl: NOTIFY_URL,
      cancelUrl: `${origin}/reports`,
      buyerName: requestData.customerName,
      buyerEmail: requestData.customerEmail,
      buyerPhone: formatPhoneNumber(requestData.customerPhone),
      expired: 24,
      feeDirection: 'MERCHANT',
    };

    const bodyString = JSON.stringify(requestBody);
    const timestamp = generateTimestamp();

    // Generate signature
    const signature = await generateSignature('POST', IPAYMU_VA, bodyString, IPAYMU_API_KEY);

    console.log('Calling iPaymu API with reference:', referenceId);
    console.log('Notify URL:', NOTIFY_URL);
    console.log('Request body:', bodyString);

    // Call iPaymu API
    const response = await fetch(IPAYMU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'va': IPAYMU_VA,
        'signature': signature,
        'timestamp': timestamp,
      },
      body: bodyString,
    });

    const responseText = await response.text();
    console.log('iPaymu API response status:', response.status);
    console.log('iPaymu API response:', responseText);

    let ipaymuResponse;
    try {
      ipaymuResponse = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse iPaymu response:', responseText);
      throw new Error('Invalid response from payment gateway');
    }

    if (ipaymuResponse.Status !== 200) {
      console.error('iPaymu API error:', ipaymuResponse);
      throw new Error(ipaymuResponse.Message || 'Payment gateway error');
    }

    // Extract payment URL from response
    const paymentUrl = ipaymuResponse?.Data?.Url;
    const sessionId = ipaymuResponse?.Data?.SessionID;

    if (!paymentUrl) {
      console.error('No payment URL in iPaymu response:', ipaymuResponse);
      throw new Error('Payment URL not received');
    }

    console.log('Payment URL generated successfully:', paymentUrl);

    return new Response(JSON.stringify({
      success: true,
      paymentUrl: paymentUrl,
      sessionId: sessionId,
      referenceId: referenceId,
      message: ipaymuResponse.Message || 'Payment initiated'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ipaymu-checkout function:', error);
    return new Response(
      JSON.stringify({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
