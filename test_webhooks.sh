#!/bin/bash

# Test script untuk kirim webhook ke N8N untuk ketiga flow
# Webhook URL dari orderpaid_webhook.json
WEBHOOK_URL="https://flow.otomasi.click/webhook/hd-order-paid"

echo "========================================="
echo "Testing Webhook Payloads untuk 3 Flow"
echo "========================================="
echo ""

# Test Flow 1: Guest dengan chart
echo "📤 Test 1: Flow 1 - Guest from Homepage (WITH chart_snapshot)"
echo "-----------------------------------------------------------"
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @flow1_test.json \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "✅ Flow 1 test sent"
echo ""
sleep 2

# Test Flow 2: Guest tanpa chart (N8N generate)
echo "📤 Test 2: Flow 2 - Guest from Personal-Report (NO chart - N8N generates)"
echo "--------------------------------------------------------------------------"
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @flow2_test.json \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "⚡ Flow 2 test sent - N8N should call calculate-chart API"
echo ""
sleep 2

# Test Flow 3: Logged in dengan chart dari DB
echo "📤 Test 3: Flow 3 - Logged In from Account (WITH chart_snapshot from DB)"
echo "-------------------------------------------------------------------------"
curl -X POST "$WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d @flow3_test.json \
  -w "\nStatus: %{http_code}\n" \
  -s
echo ""
echo "✅ Flow 3 test sent"
echo ""

echo "========================================="
echo "✅ All 3 tests sent to webhook!"
echo "========================================="
echo ""
echo "Check N8N workflow execution:"
echo "1. Flow 1 & 3 should use chart_snapshot directly"
echo "2. Flow 2 should detect missing chart_snapshot and call calculate-chart API"
echo ""
echo "Verify birth_data format:"
echo "- year, month, day, hour, minute are NUMBERS (not strings)"
echo "- field is 'place' (not 'city')"
echo ""
