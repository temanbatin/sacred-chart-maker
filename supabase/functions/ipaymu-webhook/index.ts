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

      // Update order status to PAID
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'PAID',
          paid_at: new Date().toISOString(),
          payment_method: `${via} - ${channel}`,
          updated_at: new Date().toISOString()
        })
        .eq('reference_id', reference_id);

      if (updateError) {
        console.error('Error updating order status:', updateError);
      } else {
        console.log(`Order ${reference_id} updated to PAID`);

        // TRIGGER N8N WORKFLOW
        try {
          // Replace this with your actual n8n webhook URL
          const N8N_WEBHOOK_URL = 'https://n8n.indonetwork.or.id/webhook/hd-order-paid';

          console.log(`Triggering n8n workflow at ${N8N_WEBHOOK_URL}...`);

          // Fetch order details to send complete data to n8n
          const { data: orderData } = await supabase
            .from('orders')
            .select('*')
            .eq('reference_id', reference_id)
            .single();

          // Fetch related charts data to include in payload
          const chartIds = orderData?.metadata?.chart_ids || [];
          let chartsData: any[] = [];

          if (Array.isArray(chartIds) && chartIds.length > 0) {
            const { data: fetchedCharts } = await supabase
              .from('saved_charts')
              .select('*')
              .in('id', chartIds);
            chartsData = fetchedCharts || [];
          }

          const n8nResponse = await fetch(N8N_WEBHOOK_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              order: orderData,
              charts: chartsData, // Contains full chart details including IDs
              transaction: {
                trx_id,
                sid,
                via,
                channel,
                paid_at
              }
            })
          });

          if (n8nResponse.ok) {
            console.log('n8n workflow triggered successfully');
          } else {
            console.error('Failed to trigger n8n workflow:', n8nResponse.status);
          }
        } catch (n8nError) {
          console.error('Error calling n8n webhook:', n8nError);
          // Don't fail the whole request just because n8n failed
        }
      }

    } else if (isPending) {
      console.log('Payment pending...');
      // Optional: Update to PENDING if not already (default is PENDING)
    } else if (isFailed) {
      console.log('Payment failed.');
      // Update order status to FAILED
      const { error: updateError } = await supabase
        .from('orders')
        .update({
          status: 'FAILED',
          updated_at: new Date().toISOString()
        })
        .eq('reference_id', reference_id);

      if (updateError) {
        console.error('Error updating order status for failure:', updateError);
      }
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
