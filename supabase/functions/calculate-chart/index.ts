import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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

const N8N_WEBHOOK_URL = Deno.env.get('N8N_CALCULATE_WEBHOOK_URL') || 'https://n8n.indonetwork.or.id/webhook/hd-calculate';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { year, month, day, hour, minute, place, gender } = await req.json();

    console.log('Calculating chart via n8n:', { year, month, day, hour, minute, place, gender });

    const response = await fetch(N8N_WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        year, month, day, hour, minute,
        second: 0,
        place,
        gender,
        islive: true
      }),
    });

    const responseText = await response.text();
    console.log('n8n response status:', response.status);
    console.log('n8n response text:', responseText);

    if (!response.ok) {
      console.error('n8n webhook error:', response.status, responseText);
      throw new Error(`n8n error: ${response.status} - ${responseText}`);
    }

    // Handle empty response
    if (!responseText || responseText.trim() === '') {
      console.error('n8n returned empty response');
      throw new Error('n8n webhook returned empty response');
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error('Failed to parse n8n response as JSON:', responseText);
      throw new Error(`Invalid JSON from n8n: ${responseText.substring(0, 100)}`);
    }

    console.log('Chart data received from n8n');

    // n8n returns array, extract first element
    const chartData = Array.isArray(data) ? data[0] : data;

    return new Response(JSON.stringify(chartData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in calculate-chart function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
