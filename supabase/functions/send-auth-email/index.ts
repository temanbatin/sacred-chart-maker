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
    const { email, token, type } = await req.json();
    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

    if (!RESEND_API_KEY) {
      throw new Error('RESEND_API_KEY not configured');
    }

    let subject = 'Konfirmasi Email - Teman Batin';
    let html = '';

    if (type === 'signup') {
      const verificationUrl = `${req.headers.get('origin')}/verify?token=${token}&email=${email}`;
      html = `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
          <h2 style="color: #4f46e5; text-align: center;">Selamat Datang di Teman Batin!</h2>
          <p>Terima kasih telah mendaftar. Silakan konfirmasi email Anda dengan mengklik tombol di bawah ini:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verificationUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Konfirmasi Email</a>
          </div>
          <p style="color: #666; font-size: 14px;">Atau copy link berikut ke browser Anda:</p>
          <p style="word-break: break-all; color: #4f46e5; font-size: 12px;">${verificationUrl}</p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="font-size: 12px; color: #999; text-align: center;">&copy; 2026 Teman Batin. All rights reserved.</p>
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
        from: 'Teman Batin <noreply@temanbatin.com>', // User needs to verify domain in Resend
        to: [email],
        subject: subject,
        html: html,
        text: `Selamat Datang di Teman Batin! Silakan konfirmasi email Anda dengan mengklik link berikut: ${email ? `${req.headers.get('origin')}/verify?token=${token}&email=${email}` : ''}`,
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
