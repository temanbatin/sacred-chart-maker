
import { createHash } from "https://deno.land/std@0.168.0/node/crypto.ts";

const SERVER_KEY = Deno.env.get("MIDTRANS_SERVER_KEY");
const FUNCTION_URL = "https://ggyhinxltikifmzczuyg.supabase.co/functions/v1/midtrans-webhook";

if (!SERVER_KEY) {
    console.error("❌ Error: Please provide MIDTRANS_SERVER_KEY environment variable.");
    console.error("Usage: MIDTRANS_SERVER_KEY=your-server-key deno run --allow-net --allow-env scripts/test_webhook_session.ts");
    Deno.exit(1);
}

const ORDER_ID = "TB-TEST-WEBHOOK-SESSION";
const AMOUNT = "79900"; // Must match DB amount exactly if string, or formatting matters. DB is numeric? midtrans sends string usually ".00"
const AMOUNT_PAYLOAD = "79900.00"; // Midtrans usually sends with 2 decimals
const STATUS_CODE = "200";

console.log(`Preparing test for Order ID: ${ORDER_ID}`);
console.log(`Target URL: ${FUNCTION_URL}`);

// 1. Create Signature
// Signature = SHA512(order_id + status_code + gross_amount + ServerKey)
const signatureInput = ORDER_ID + STATUS_CODE + AMOUNT_PAYLOAD + SERVER_KEY;
const hash = createHash("sha512");
hash.update(signatureInput);
const signature = hash.digest("hex");

// 2. Construct Payload
const payload = {
    transaction_time: new Date().toISOString(),
    transaction_status: "settlement",
    transaction_id: "TEST-TRANS-" + Date.now(),
    status_message: "midtrans payment notification",
    status_code: STATUS_CODE,
    signature_key: signature,
    payment_type: "credit_card",
    order_id: ORDER_ID,
    merchant_id: "TEST-MERCHANT",
    gross_amount: AMOUNT_PAYLOAD,
    fraud_status: "accept",
    currency: "IDR"
};

// 3. Send Request
try {
    console.log("\nSending webhook request...");
    const response = await fetch(FUNCTION_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    const responseText = await response.text();
    console.log(`\nResponse Status: ${response.status}`);
    console.log(`Response Body: ${responseText}`);

    if (response.ok) {
        console.log("\n✅ Webhook request successful!");
        console.log("Now check the 'whatsapp_sessions' table to see if the session for '6281299988888' was created/updated.");
    } else {
        console.error("\n❌ Webhook request failed.");
    }

} catch (error) {
    console.error("\n❌ Error sending request:", error);
}
