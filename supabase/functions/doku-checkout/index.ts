import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { encode as base64Encode } from "https://deno.land/std@0.168.0/encoding/base64.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// DOKU API Configuration
const DOKU_API_URL = 'https://api-sandbox.doku.com/checkout/v1/payment';
// Production: 'https://api.doku.com/checkout/v1/payment'

interface CheckoutRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  amount: number;
  invoiceNumber: string;
  productName: string;
}

// Generate SHA-256 digest from request body
async function generateDigest(body: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(body);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  return base64Encode(hashBuffer);
}

// Generate HMAC-SHA256 signature
async function generateSignature(
  clientId: string,
  requestId: string,
  timestamp: string,
  requestTarget: string,
  digest: string,
  secretKey: string
): Promise<string> {
  const signatureComponents = [
    `Client-Id:${clientId}`,
    `Request-Id:${requestId}`,
    `Request-Timestamp:${timestamp}`,
    `Request-Target:${requestTarget}`,
    `Digest:${digest}`
  ].join('\n');

  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(secretKey),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  );
  
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(signatureComponents));
  return `HMACSHA256=${base64Encode(signature)}`;
}

// Generate unique request ID
function generateRequestId(): string {
  return crypto.randomUUID();
}

// Generate invoice number
function generateInvoiceNumber(): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `INV-${timestamp}-${random}`;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const DOKU_CLIENT_ID = Deno.env.get('DOKU_CLIENT_ID');
    const DOKU_SECRET_KEY = Deno.env.get('DOKU_SECRET_KEY');

    if (!DOKU_CLIENT_ID || !DOKU_SECRET_KEY) {
      console.error('DOKU credentials not configured');
      throw new Error('Payment gateway not configured');
    }

    const requestData: CheckoutRequest = await req.json();
    console.log('Checkout request received:', { 
      customerName: requestData.customerName,
      customerEmail: requestData.customerEmail,
      amount: requestData.amount 
    });

    // Prepare DOKU request body
    const invoiceNumber = requestData.invoiceNumber || generateInvoiceNumber();
    const requestBody = {
      order: {
        amount: requestData.amount,
        invoice_number: invoiceNumber,
        currency: 'IDR',
        callback_url: `${req.headers.get('origin') || 'https://temanbatin.com'}/payment-result`,
        callback_url_cancel: `${req.headers.get('origin') || 'https://temanbatin.com'}/`,
        language: 'ID',
        auto_redirect: true,
        line_items: [
          {
            id: 'HD-REPORT-001',
            name: requestData.productName || 'Laporan Analisis Mendalam Human Design',
            quantity: 1,
            price: requestData.amount,
            category: 'digital-product'
          }
        ]
      },
      payment: {
        payment_due_date: 60, // 60 minutes
        payment_method_types: [
          'VIRTUAL_ACCOUNT_BCA',
          'VIRTUAL_ACCOUNT_BANK_MANDIRI',
          'VIRTUAL_ACCOUNT_BRI',
          'VIRTUAL_ACCOUNT_BNI',
          'VIRTUAL_ACCOUNT_BANK_PERMATA',
          'VIRTUAL_ACCOUNT_BANK_CIMB',
          'QRIS',
          'EMONEY_SHOPEEPAY',
          'EMONEY_OVO',
          'EMONEY_DANA'
        ]
      },
      customer: {
        id: `CUST-${Date.now()}`,
        name: requestData.customerName,
        email: requestData.customerEmail,
        phone: requestData.customerPhone?.replace(/^\+/, '') || '',
        country: 'ID'
      }
    };

    const bodyString = JSON.stringify(requestBody);
    const requestId = generateRequestId();
    const timestamp = new Date().toISOString().replace(/\.\d{3}Z$/, 'Z');
    const requestTarget = '/checkout/v1/payment';

    // Generate digest and signature
    const digest = await generateDigest(bodyString);
    const signature = await generateSignature(
      DOKU_CLIENT_ID,
      requestId,
      timestamp,
      requestTarget,
      digest,
      DOKU_SECRET_KEY
    );

    console.log('Calling DOKU API with invoice:', invoiceNumber);

    // Call DOKU API
    const response = await fetch(DOKU_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Client-Id': DOKU_CLIENT_ID,
        'Request-Id': requestId,
        'Request-Timestamp': timestamp,
        'Signature': signature
      },
      body: bodyString
    });

    const responseText = await response.text();
    console.log('DOKU API response status:', response.status);
    console.log('DOKU API response:', responseText);

    if (!response.ok) {
      console.error('DOKU API error:', response.status, responseText);
      throw new Error(`Payment gateway error: ${response.status}`);
    }

    let dokuResponse;
    try {
      dokuResponse = JSON.parse(responseText);
    } catch {
      console.error('Failed to parse DOKU response:', responseText);
      throw new Error('Invalid response from payment gateway');
    }

    // Extract payment URL from response
    const paymentUrl = dokuResponse?.response?.payment?.url || dokuResponse?.payment?.url;
    
    if (!paymentUrl) {
      console.error('No payment URL in DOKU response:', dokuResponse);
      throw new Error('Payment URL not received');
    }

    console.log('Payment URL generated successfully');

    return new Response(JSON.stringify({
      success: true,
      paymentUrl: paymentUrl,
      invoiceNumber: invoiceNumber,
      message: dokuResponse.message || 'Payment initiated'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in doku-checkout function:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
