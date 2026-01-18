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

const N8N_WEBHOOK_URL = Deno.env.get('N8N_BODYGRAPH_WEBHOOK_URL') || 'https://flow.otomasi.click/webhook/hd-bodygraph';

serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { year, month, day, hour, minute, place } = await req.json();

    console.log('Fetching bodygraph via n8n:', { year, month, day, hour, minute, place });

    // Retry logic configuration
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 1000;

    let lastError;
    let response;

    for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
      try {
        if (attempt > 1) {
          console.log(`Attempt ${attempt} of ${MAX_RETRIES} to fetch bodygraph...`);
          await new Promise(resolve => setTimeout(resolve, RETRY_DELAY_MS * attempt));
        }

        // Add 15s timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 15000);

        response = await fetch(N8N_WEBHOOK_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            year, month, day, hour, minute,
            second: 0,
            place,
            fmt: 'svg'
          }),
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          // Success!
          break;
        } else {
          // Server error, might be transient
          const errorText = await response.text();
          throw new Error(`n8n error: ${response.status} - ${errorText}`);
        }
      } catch (err) {
        lastError = err;
        console.error(`Attempt ${attempt} failed:`, err);
        // If it's the last attempt, don't swallow the error
        if (attempt === MAX_RETRIES) break;
      }
    }

    if (!response || !response.ok) {
      throw lastError || new Error('Failed to fetch bodygraph after multiple attempts');
    }

    const data = await response.json();
    console.log('Bodygraph received from n8n');

    // n8n returns array, extract first element
    const bodygraphData = Array.isArray(data) ? data[0] : data;

    return new Response(JSON.stringify(bodygraphData), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-bodygraph function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
