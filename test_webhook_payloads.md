# Test Webhook Payloads for 3 Checkout Flows

## Webhook URL
```
POST https://flow.otomasi.click/webhook/hd-order-paid
Content-Type: application/json
```

## Flow 1: Guest from Homepage (WITH chart)

**Scenario**: User sudah generate chart di homepage, lalu checkout

```json
{
  "order": {
    "id": "test-flow1-uuid-123",
    "user_id": null,
    "reference_id": "TB-1737656400000-TEST1",
    "status": "PAID",
    "amount": 79900,
    "customer_name": "Budi Santoso",
    "customer_email": "budi.test@example.com",
    "customer_phone": "+628123456789",
    "product_name": "Full Report Human Design: Budi Santoso",
    "metadata": {
      "chart_ids": ["chart-flow1-uuid-456"],
      "products": ["full_report"],
      "birth_data": {
        "name": "Budi Santoso",
        "year": 1995,
        "month": 3,
        "day": 15,
        "hour": 14,
        "minute": 30,
        "place": "Jakarta, DKI Jakarta, Indonesia",
        "gender": "male"
      },
      "chart_snapshot": {
        "gates": {
          "des": {
            "Planets": [
              {"Planet": "Sun", "Gate": 35, "Line": 6, "Tone": 1, "Color": 5},
              {"Planet": "Earth", "Gate": 5, "Line": 6, "Tone": 1, "Color": 5}
            ]
          },
          "prs": {
            "Planets": [
              {"Planet": "Sun", "Gate": 64, "Line": 4, "Tone": 2, "Color": 4},
              {"Planet": "Earth", "Gate": 63, "Line": 4, "Tone": 2, "Color": 4}
            ]
          }
        },
        "general": {
          "energy_type": "Generator",
          "strategy": "Wait to Respond",
          "inner_authority": "Sacral",
          "profile": "4/6: Opportunist Role Model",
          "definition": "Single Definition",
          "inc_cross": "The Right Angle Cross of Planning (16/9 | 37/40)",
          "defined_centers": ["Throat", "Sacral", "G_Center"],
          "undefined_centers": ["Head", "Ajna", "SolarPlexus", "Heart", "Spleen", "Root"]
        },
        "channels": {
          "Channels": [
            {"channel": "35/36: Channel of Transitoriness"}
          ]
        }
      }
    },
    "payment_method": "midtrans",
    "payment_url": null,
    "created_at": "2026-01-24T00:00:00Z",
    "updated_at": "2026-01-24T00:00:00Z",
    "paid_at": "2026-01-24T00:05:00Z",
    "report_url": null
  },
  "email": "budi.test@example.com",
  "whatsapp": "+628123456789",
  "charts": [],
  "report_type": "personal-comprehensive",
  "transaction": {
    "transaction_id": "MIDTRANS-TB-1737656400000-TEST1",
    "payment_type": "credit_card",
    "settlement_time": "2026-01-24T00:05:00Z",
    "gross_amount": "79900.00"
  }
}
```

## Flow 2: Guest from Personal-Report (NO chart - N8N generates)

**Scenario**: User langsung checkout dari /personal-report tanpa generate chart dulu

```json
{
  "order": {
    "id": "test-flow2-uuid-789",
    "user_id": null,
    "reference_id": "TB-1737656500000-TEST2",
    "status": "PAID",
    "amount": 79900,
    "customer_name": "Siti Aminah",
    "customer_email": "siti.test@example.com",
    "customer_phone": "+628987654321",
    "product_name": "Human Design Full Personal Report",
    "metadata": {
      "chart_ids": [],
      "products": ["full_report"],
      "birth_data": {
        "name": "Siti Aminah",
        "year": 1992,
        "month": 7,
        "day": 22,
        "hour": 8,
        "minute": 45,
        "place": "Bandung, Jawa Barat, Indonesia",
        "gender": "female"
      }
    },
    "payment_method": "midtrans",
    "payment_url": null,
    "created_at": "2026-01-24T00:10:00Z",
    "updated_at": "2026-01-24T00:10:00Z",
    "paid_at": "2026-01-24T00:12:00Z",
    "report_url": null
  },
  "email": "siti.test@example.com",
  "whatsapp": "+628987654321",
  "charts": [],
  "report_type": "personal-comprehensive",
  "transaction": {
    "transaction_id": "MIDTRANS-TB-1737656500000-TEST2",
    "payment_type": "gopay",
    "settlement_time": "2026-01-24T00:12:00Z",
    "gross_amount": "79900.00"
  }
}
```

**⚠️ IMPORTANT for N8N**: Flow 2 tidak punya `chart_snapshot`, jadi N8N harus:
1. Check `if (!order.metadata.chart_snapshot)`
2. Call calculate-chart API dengan `order.metadata.birth_data`
3. Generate PDF dengan chart hasil dari API

## Flow 3: Logged In from Account (WITH chart from DB)

**Scenario**: User sudah login, pilih saved chart dari account, lalu checkout

```json
{
  "order": {
    "id": "test-flow3-uuid-abc",
    "user_id": "user-uuid-def-456",
    "reference_id": "TB-1737656600000-TEST3",
    "status": "PAID",
    "amount": 79900,
    "customer_name": "Ahmad Wijaya",
    "customer_email": "ahmad.test@example.com",
    "customer_phone": "+628111222333",
    "product_name": "Full Report Human Design: Ahmad Wijaya",
    "metadata": {
      "chart_ids": ["saved-chart-uuid-ghi-789"],
      "products": ["full_report"],
      "birth_data": {
        "name": "Ahmad Wijaya",
        "year": 1988,
        "month": 12,
        "day": 5,
        "hour": 16,
        "minute": 20,
        "place": "Surabaya, Jawa Timur, Indonesia",
        "gender": "male"
      },
      "chart_snapshot": {
        "gates": {
          "des": {
            "Planets": [
              {"Planet": "Sun", "Gate": 12, "Line": 3, "Tone": 2, "Color": 1},
              {"Planet": "Earth", "Gate": 11, "Line": 3, "Tone": 2, "Color": 1}
            ]
          },
          "prs": {
            "Planets": [
              {"Planet": "Sun", "Gate": 25, "Line": 5, "Tone": 4, "Color": 3},
              {"Planet": "Earth", "Gate": 46, "Line": 5, "Tone": 4, "Color": 3}
            ]
          }
        },
        "general": {
          "energy_type": "Projector",
          "strategy": "Wait for Invitation",
          "inner_authority": "Splenic",
          "profile": "3/5: Martyr Heretic",
          "definition": "No Definition",
          "inc_cross": "The Left Angle Cross of Demands (12/11 | 25/46)",
          "defined_centers": ["Spleen"],
          "undefined_centers": ["Head", "Ajna", "Throat", "G_Center", "Heart", "SolarPlexus", "Sacral", "Root"]
        },
        "channels": {
          "Channels": []
        }
      }
    },
    "payment_method": "midtrans",
    "payment_url": null,
    "created_at": "2026-01-24T00:20:00Z",
    "updated_at": "2026-01-24T00:20:00Z",
    "paid_at": "2026-01-24T00:22:00Z",
    "report_url": null
  },
  "email": "ahmad.test@example.com",
  "whatsapp": "+628111222333",
  "charts": [
    {
      "id": "saved-chart-uuid-ghi-789",
      "user_id": "user-uuid-def-456",
      "name": "Ahmad Wijaya",
      "birth_date": "1988-12-05",
      "birth_time": "16:20:00",
      "birth_place": "Surabaya, Jawa Timur, Indonesia",
      "chart_data": {
        "gates": {
          "des": {
            "Planets": [
              {"Planet": "Sun", "Gate": 12, "Line": 3, "Tone": 2, "Color": 1}
            ]
          },
          "prs": {
            "Planets": [
              {"Planet": "Sun", "Gate": 25, "Line": 5, "Tone": 4, "Color": 3}
            ]
          }
        },
        "general": {
          "energy_type": "Projector",
          "strategy": "Wait for Invitation"
        }
      },
      "created_at": "2026-01-20T10:00:00Z"
    }
  ],
  "report_type": "personal-comprehensive",
  "transaction": {
    "transaction_id": "MIDTRANS-TB-1737656600000-TEST3",
    "payment_type": "bank_transfer",
    "settlement_time": "2026-01-24T00:22:00Z",
    "gross_amount": "79900.00"
  }
}
```

## Testing N8N Workflow

### Test Flow 1 & 3 (dengan chart_snapshot):
```bash
curl -X POST https://flow.otomasi.click/webhook/hd-order-paid \
  -H "Content-Type: application/json" \
  -d @flow1_test.json
```

**Expected**: N8N langsung generate PDF dari `chart_snapshot`

### Test Flow 2 (tanpa chart_snapshot):
```bash
curl -X POST https://flow.otomasi.click/webhook/hd-order-paid \
  -H "Content-Type: application/json" \
  -d @flow2_test.json
```

**Expected**: 
1. N8N detect `chart_snapshot` tidak ada
2. N8N call calculate-chart dengan `birth_data`
3. N8N generate PDF dengan chart hasil API

## Key Differences Summary

| Field | Flow 1 | Flow 2 | Flow 3 |
|-------|--------|--------|--------|
| `chart_ids` | ✅ Array dengan ID | ❌ Empty array `[]` | ✅ Array dengan ID |
| `birth_data` | ✅ Complete | ✅ Complete | ✅ Complete |
| `birth_data` types | ✅ All numbers | ✅ All numbers | ✅ All numbers |
| `chart_snapshot` | ✅ Full chart data | ❌ **MISSING** | ✅ Full chart data |
| `charts` array | Empty | Empty | ✅ Array with saved chart |

## Save Individual Test Files

Simpan masing-masing payload ke file terpisah untuk testing:
- `flow1_test.json` - Guest dengan chart
- `flow2_test.json` - Guest tanpa chart (N8N generate)
- `flow3_test.json` - Logged in dengan chart dari DB
