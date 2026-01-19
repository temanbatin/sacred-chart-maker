import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

/**
 * Robust way to get the site URL.
 * Priority: Header Origin -> Environment Variable -> Default Production URL
 */
function getSiteUrl(req: Request): string {
  const origin = req.headers.get('origin');

  // If it's a valid production origin, use it
  if (origin && (origin.includes('temanbatin.com') || origin.includes('www.temanbatin.com'))) {
    return origin;
  }

  // Fallback to hardcoded production if no origin (e.g. server-to-server) or localhost
  return 'https://temanbatin.com';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();
    const siteUrl = getSiteUrl(req);

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    // 1. Create user
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    });

    if (createError) throw createError;

    // 2. Generate confirmation link
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      options: { redirectTo: `${siteUrl}/account` }
    });

    if (linkError) throw linkError;

    const url = new URL(linkData.properties.action_link);
    const tokenHash = url.searchParams.get('token');
    const customVerifyUrl = `${siteUrl}/verify?token=${tokenHash}&email=${email}`;

    // 3. Send email
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Teman Batin <noreply@temanbatin.com>',
        to: [email],
        subject: 'Konfirmasi Email - Teman Batin',
        html: `
          <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h2>Selamat Datang!</h2>
            <p>Klik tombol di bawah untuk memverifikasi email Anda:</p>
            <div style="margin: 30px 0;">
              <a href="${customVerifyUrl}" style="background: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Verifikasi Sekarang</a>
            </div>
            <p style="margin-top: 20px; font-size: 12px; color: #666;">Atau salin link ini: ${customVerifyUrl}</p>
          </div>
        `,
        text: `Selamat Datang! Silakan verifikasi email Anda dengan mengklik link berikut: ${customVerifyUrl}`,
      }),
    });

    if (!res.ok) {
      const resError = await res.json();
      throw new Error(`Resend error: ${JSON.stringify(resError)}`);
    }

    return new Response(JSON.stringify({ message: 'User created and email sent' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
