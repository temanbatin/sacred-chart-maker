import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { year, month, day, hour, minute, place } = await req.json();
    
    console.log('Fetching bodygraph for:', { year, month, day, hour, minute, place });

    const HD_API_KEY = Deno.env.get('HD_API_KEY');
    if (!HD_API_KEY) {
      console.error('HD_API_KEY is not configured');
      throw new Error('HD_API_KEY is not configured');
    }

    // Build the API URL with query parameters
    const apiUrl = new URL('http://192.250.228.53:9021/bodygraph');
    apiUrl.searchParams.set('year', year.toString());
    apiUrl.searchParams.set('month', month.toString());
    apiUrl.searchParams.set('day', day.toString());
    apiUrl.searchParams.set('hour', hour.toString());
    apiUrl.searchParams.set('minute', minute.toString());
    apiUrl.searchParams.set('second', '0');
    apiUrl.searchParams.set('place', place);
    apiUrl.searchParams.set('fmt', 'svg');

    console.log('Calling Bodygraph API:', apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${HD_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Bodygraph API error:', response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    // Get the SVG as text
    const svgText = await response.text();

    console.log('Bodygraph SVG fetched successfully, size:', svgText.length);

    // Encode SVG to base64 for data URL
    const base64Svg = btoa(unescape(encodeURIComponent(svgText)));

    return new Response(JSON.stringify({ 
      image: `data:image/svg+xml;base64,${base64Svg}` 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in get-bodygraph function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
