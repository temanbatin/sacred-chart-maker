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
    const { year, month, day, hour, minute, place, gender } = await req.json();
    
    console.log('Calculating chart for:', { year, month, day, hour, minute, place, gender });

    const HD_API_KEY = Deno.env.get('HD_API_KEY');
    if (!HD_API_KEY) {
      console.error('HD_API_KEY is not configured');
      throw new Error('HD_API_KEY is not configured');
    }

    // Build the API URL with query parameters
    const apiUrl = new URL('http://192.250.228.53:9021/calculate');
    apiUrl.searchParams.set('year', year.toString());
    apiUrl.searchParams.set('month', month.toString());
    apiUrl.searchParams.set('day', day.toString());
    apiUrl.searchParams.set('hour', hour.toString());
    apiUrl.searchParams.set('minute', minute.toString());
    apiUrl.searchParams.set('second', '0');
    apiUrl.searchParams.set('place', place);
    apiUrl.searchParams.set('gender', gender);
    apiUrl.searchParams.set('islive', 'true'); // Always send islive=true as default

    console.log('Calling Human Design API:', apiUrl.toString());

    const response = await fetch(apiUrl.toString(), {
      method: 'GET',
      headers: {
        'accept': 'application/json',
        'Authorization': `Bearer ${HD_API_KEY}`,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Human Design API error:', response.status, errorText);
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Human Design API response:', JSON.stringify(data));

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in calculate-chart function:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
