import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

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

// Rate limit: max 5 submissions per email per hour
const RATE_LIMIT_COUNT = 5;
const RATE_LIMIT_WINDOW_MINUTES = 60;

// Validation patterns
const EMAIL_REGEX = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const WHATSAPP_REGEX = /^\+62[0-9]{9,12}$/;

interface LeadRequest {
  name: string;
  email: string;
  whatsapp: string;
  birth_date: string;
  birth_place: string;
}

function validateInput(data: LeadRequest): { valid: boolean; error?: string } {
  // Name validation
  if (!data.name || typeof data.name !== 'string') {
    return { valid: false, error: 'Nama wajib diisi' };
  }
  if (data.name.length > 255) {
    return { valid: false, error: 'Nama terlalu panjang (max 255 karakter)' };
  }

  // Email validation
  if (!data.email || typeof data.email !== 'string') {
    return { valid: false, error: 'Email wajib diisi' };
  }
  if (!EMAIL_REGEX.test(data.email)) {
    return { valid: false, error: 'Format email tidak valid' };
  }
  if (data.email.length > 255) {
    return { valid: false, error: 'Email terlalu panjang (max 255 karakter)' };
  }

  // WhatsApp validation
  if (!data.whatsapp || typeof data.whatsapp !== 'string') {
    return { valid: false, error: 'Nomor WhatsApp wajib diisi' };
  }
  if (!WHATSAPP_REGEX.test(data.whatsapp)) {
    return { valid: false, error: 'Format WhatsApp tidak valid (gunakan +62...)' };
  }

  // Birth date validation
  if (!data.birth_date || typeof data.birth_date !== 'string') {
    return { valid: false, error: 'Tanggal lahir wajib diisi' };
  }
  const birthDate = new Date(data.birth_date);
  if (isNaN(birthDate.getTime())) {
    return { valid: false, error: 'Format tanggal lahir tidak valid' };
  }
  if (birthDate > new Date()) {
    return { valid: false, error: 'Tanggal lahir tidak boleh di masa depan' };
  }

  // Birth place validation
  if (!data.birth_place || typeof data.birth_place !== 'string') {
    return { valid: false, error: 'Tempat lahir wajib diisi' };
  }
  if (data.birth_place.length > 500) {
    return { valid: false, error: 'Tempat lahir terlalu panjang (max 500 karakter)' };
  }

  return { valid: true };
}

Deno.serve(async (req) => {
  const corsHeaders = getCorsHeaders(req);

  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Only allow POST
    if (req.method !== 'POST') {
      return new Response(
        JSON.stringify({ error: 'Method not allowed' }),
        { status: 405, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get client IP for rate limiting
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      req.headers.get('x-real-ip') ||
      'unknown';
    const userAgent = req.headers.get('user-agent') || 'unknown';

    console.log(`Lead submission attempt from IP: ${clientIP}`);

    // Parse and validate request body
    let body: LeadRequest;
    try {
      body = await req.json();
    } catch {
      return new Response(
        JSON.stringify({ error: 'Invalid request body' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Validate input
    const validation = validateInput(body);
    if (!validation.valid) {
      console.log(`Validation failed: ${validation.error}`);
      return new Response(
        JSON.stringify({ error: validation.error }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Rate limiting: Check recent submissions from this email
    const rateLimitTime = new Date();
    rateLimitTime.setMinutes(rateLimitTime.getMinutes() - RATE_LIMIT_WINDOW_MINUTES);

    const { count: emailCount, error: countError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('email', body.email.toLowerCase())
      .gte('created_at', rateLimitTime.toISOString());

    if (countError) {
      console.error('Error checking rate limit:', countError);
      // Continue anyway, don't block user for internal errors
    } else if (emailCount && emailCount >= RATE_LIMIT_COUNT) {
      console.log(`Rate limit exceeded for email: ${body.email}`);
      return new Response(
        JSON.stringify({ error: 'Terlalu banyak permintaan. Silakan coba lagi nanti.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Also check IP-based rate limiting (more strict: 10 per hour)
    const { count: ipCount, error: ipCountError } = await supabase
      .from('leads')
      .select('*', { count: 'exact', head: true })
      .eq('ip_address', clientIP)
      .gte('created_at', rateLimitTime.toISOString());

    if (!ipCountError && ipCount && ipCount >= 10) {
      console.log(`IP rate limit exceeded: ${clientIP}`);
      return new Response(
        JSON.stringify({ error: 'Terlalu banyak permintaan dari lokasi kamu. Silakan coba lagi nanti.' }),
        { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert lead
    const { data, error: insertError } = await supabase
      .from('leads')
      .insert({
        name: body.name.trim(),
        email: body.email.toLowerCase().trim(),
        whatsapp: body.whatsapp.trim(),
        birth_date: body.birth_date,
        birth_place: body.birth_place.trim(),
        ip_address: clientIP,
        user_agent: userAgent.substring(0, 500), // Limit user agent length
      })
      .select()
      .single();

    if (insertError) {
      console.error('Error inserting lead:', insertError);

      // Check for specific constraint violations
      if (insertError.message.includes('leads_email_format')) {
        return new Response(
          JSON.stringify({ error: 'Format email tidak valid' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (insertError.message.includes('leads_whatsapp_format')) {
        return new Response(
          JSON.stringify({ error: 'Format WhatsApp tidak valid' }),
          { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      return new Response(
        JSON.stringify({ error: 'Gagal menyimpan data. Silakan coba lagi.' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log(`Lead saved successfully: ${data.id}`);

    // Trigger n8n for lead capture
    try {
      const N8N_LEAD_WEBHOOK_URL = Deno.env.get('N8N_ORDER_PAID_WEBHOOK_URL') || 'https://flow.otomasi.click/webhook/hd-order-paid';
      await fetch(N8N_LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'lead',
          lead: data,
          email: data.email,
          whatsapp: data.whatsapp,
          name: data.name,
          birth_date: data.birth_date,
          birth_place: data.birth_place
        })
      });
      console.log('n8n lead webhook triggered');
    } catch (e) {
      console.error('Failed to trigger n8n lead webhook:', e);
    }

    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan. Silakan coba lagi.' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
