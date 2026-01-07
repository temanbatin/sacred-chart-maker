import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface IPaymuCallback {
  trx_id: string;
  sid: string;
  reference_id: string;
  status: string;
  status_code: string;
  sub_total: string;
  total: string;
  amount: string;
  fee: string;
  paid_off: string;
  created_at: string;
  expired_at: string;
  paid_at: string;
  settlement_status: string;
  transaction_status_code: string;
  is_escrow: string;
  system_notes: string;
  via: string;
  channel: string;
  payment_no: string;
  buyer_name: string;
  buyer_email: string;
  buyer_phone: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse webhook data from iPaymu
    const formData = await req.formData();
    const callbackData: Partial<IPaymuCallback> = {};
    
    for (const [key, value] of formData.entries()) {
      callbackData[key as keyof IPaymuCallback] = value as string;
    }

    console.log('iPaymu webhook received:', JSON.stringify(callbackData));

    const {
      trx_id,
      sid,
      reference_id,
      status,
      status_code,
      amount,
      buyer_name,
      buyer_email,
      via,
      channel,
      paid_at,
    } = callbackData;

    // status_code: 1 = berhasil, 0 = pending, -1 = gagal
    const isSuccess = status_code === '1' || status === 'berhasil';
    const isPending = status_code === '0' || status === 'pending';
    const isFailed = status_code === '-1' || status === 'gagal';

    console.log(`Transaction ${trx_id} status: ${status} (code: ${status_code})`);
    console.log(`Reference ID: ${reference_id}`);
    console.log(`Amount: ${amount}`);
    console.log(`Buyer: ${buyer_name} (${buyer_email})`);
    console.log(`Via: ${via} - ${channel}`);

    // Initialize Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    if (isSuccess) {
      console.log('Payment successful! Processing order...');
      
      // TODO: Add your business logic here
      // For example:
      // 1. Update order status in database
      // 2. Send confirmation email
      // 3. Generate and send report
      
      // Example: Log successful payment
      // await supabase.from('payments').insert({
      //   transaction_id: trx_id,
      //   session_id: sid,
      //   reference_id: reference_id,
      //   amount: parseInt(amount || '0'),
      //   status: 'success',
      //   buyer_name: buyer_name,
      //   buyer_email: buyer_email,
      //   payment_method: `${via} - ${channel}`,
      //   paid_at: paid_at,
      // });
    } else if (isPending) {
      console.log('Payment pending...');
    } else if (isFailed) {
      console.log('Payment failed.');
    }

    // Return success response to iPaymu
    return new Response(JSON.stringify({ 
      success: true,
      message: 'Webhook received successfully',
      trx_id: trx_id,
      status: status
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error processing iPaymu webhook:', error);
    return new Response(
      JSON.stringify({ 
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error' 
      }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
