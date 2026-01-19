import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

function getSiteUrl(req: Request): string {
  const origin = req.headers.get('origin');
  if (origin && (origin.includes('temanbatin.com') || origin.includes('www.temanbatin.com'))) {
    return origin;
  }
  return 'https://temanbatin.com';
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { email, token, type } = await req.json();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    const siteUrl = getSiteUrl(req);

    if (!RESEND_API_KEY) throw new Error('RESEND_API_KEY not configured');

    let subject = 'Konfirmasi Email - Teman Batin';
    let html = '';

    // Reconstruct verification URL
    const verificationUrl = `${siteUrl}/verify?token=${token}&email=${email}`;

    if (type === 'signup' || type === 'verification') {
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5; text-align: center;">Konfirmasi Akun Anda</h2>
          <p>Silakan klik tombol di bawah ini untuk memverifikasi email Anda:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Konfirmasi Email</a>
          </div>
          <p style="color: #666; font-size: 14px;">Atau copy link berikut ke browser Anda:</p>
          <p style="word-break: break-all; color: #4f46e5; font-size: 12px;">${verificationUrl}</p>
        </div>
      `;
    }

    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: 'Teman Batin <noreply@temanbatin.com>',
        to: [email],
        subject: subject,
        html: html,
        text: `Silakan konfirmasi email Anda dengan mengklik link berikut: ${verificationUrl}`,
      }),
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: res.status,
    });

  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 500,
    });
  }
});
