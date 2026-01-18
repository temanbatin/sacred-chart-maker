import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, password } = await req.json();

    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    // 1. Create user (without auto-confirm)
    const { data: userData, error: createError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: false,
    });

    if (createError) throw createError;

    // 2. Generate confirmation link
    // We use type 'signup' which will generate a token hash
    const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
      type: 'signup',
      email,
      options: { redirectTo: `${req.headers.get('origin')}/account` }
    });

    if (linkError) throw linkError;

    // The link looks like: .../auth/v1/verify?token=HASH&type=signup&redirect_to=...
    // We want to reconstruct it for our /verify page
    const url = new URL(linkData.properties.action_link);
    const tokenHash = url.searchParams.get('token');

    const customVerifyUrl = `${req.headers.get('origin')}/verify?token=${tokenHash}&email=${email}`;

    // 3. Send email via Resend
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
            <a href="${customVerifyUrl}" style="background: #4f46e5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Verifikasi Sekarang</a>
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
