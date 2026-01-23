# N8N Workflow Guide: Menggabungkan Calculate-Chart Result dengan Order

## Problem
Flow 2 tidak punya `chart_snapshot`, jadi N8N harus:
1. Call calculate-chart API
2. **Merge result** dari API ke dalam order object
3. Output final harus sama format dengan Flow 1 & 3

## Solution: N8N Workflow

### Step 1: IF Node - Check Chart Snapshot

**Node Name**: `Check Chart Snapshot`
**Type**: IF
**Condition**:
```javascript
{{ $json.order.metadata.chart_snapshot !== undefined && $json.order.metadata.chart_snapshot !== null }}
```

**Output**:
- **TRUE branch**: Flow 1 & 3 (chart exists) → Go to "Prepare Final Data"
- **FALSE branch**: Flow 2 (no chart) → Go to "Call Calculate Chart API"

---

### Step 2: HTTP Request - Call Calculate Chart API (FALSE branch)

**Node Name**: `Call Calculate Chart API`
**Type**: HTTP Request
**Method**: POST
**URL**: `https://YOUR_SUPABASE_PROJECT.supabase.co/functions/v1/calculate-chart`

**Headers**:
```json
{
  "Authorization": "Bearer YOUR_ANON_KEY",
  "Content-Type": "application/json"
}
```

**Body** (Send Query Parameters):
```javascript
{
  "year": {{ $json.order.metadata.birth_data.year }},
  "month": {{ $json.order.metadata.birth_data.month }},
  "day": {{ $json.order.metadata.birth_data.day }},
  "hour": {{ $json.order.metadata.birth_data.hour }},
  "minute": {{ $json.order.metadata.birth_data.minute }},
  "place": "{{ $json.order.metadata.birth_data.place }}",
  "gender": "{{ $json.order.metadata.birth_data.gender }}"
}
```

**Output**: Chart data dari API → akan merge di step berikutnya

---

### Step 3A: Code Node - Merge Chart with Order (FALSE branch)

**Node Name**: `Merge Chart with Order`
**Type**: Code
**Language**: JavaScript

```javascript
// Get data from previous nodes
const orderData = $('Webhook').first().json;  // Original webhook data
const chartData = $node["Call Calculate Chart API"].json;  // Chart dari API

// Create new order object with chart_snapshot
const updatedOrder = {
  ...orderData.order,
  metadata: {
    ...orderData.order.metadata,
    chart_snapshot: chartData  // ✅ Tambahkan chart_snapshot
  }
};

// Return in same format as Flow 1 & 3
return {
  order: updatedOrder,
  email: orderData.email,
  whatsapp: orderData.whatsapp,
  charts: orderData.charts || [],
  report_type: orderData.report_type,
  transaction: orderData.transaction
};
```

---

### Step 3B: Code Node - Pass Through (TRUE branch)

**Node Name**: `Pass Through Order`
**Type**: Code
**Language**: JavaScript

```javascript
// Flow 1 & 3: Chart sudah ada, just pass through
const orderData = $('Webhook').first().json;

return {
  order: orderData.order,
  email: orderData.email,
  whatsapp: orderData.whatsapp,
  charts: orderData.charts || [],
  report_type: orderData.report_type,
  transaction: orderData.transaction
};
```

---

### Step 4: Merge Node - Combine Both Branches

**Node Name**: `Combine Branches`
**Type**: Merge
**Mode**: Append

**Input 1**: Output dari "Merge Chart with Order" (Flow 2)
**Input 2**: Output dari "Pass Through Order" (Flow 1 & 3)

---

### Step 5: Split Out Node - Extract Fields

**Node Name**: `Split Out`
**Type**: Split Out
**Fields to Split Out**:
- `order` → body
- `email` → body
- `whatsapp` → body
- `charts` → body
- `report_type` → body
- `transaction` → body

**Output**: Array of 6 items (sama seperti screenshot Anda)
```json
[
  { "body": { "id": "...", "metadata": { "chart_snapshot": {...} } } },  // order
  { "body": "user@example.com" },  // email
  { "body": "+628xxx" },  // whatsapp
  { "body": [] },  // charts
  { "body": "personal-comprehensive" },  // report_type
  { "body": { "transaction_id": "..." } }  // transaction
]
```

---

## Complete Workflow Diagram

```
Webhook Trigger
      ↓
Check Chart Snapshot (IF)
      ↙         ↘
   TRUE        FALSE
(Flow 1&3)   (Flow 2)
      ↓           ↓
Pass Through  Call Calculate
   Order      Chart API
      ↓           ↓
      |      Merge Chart
      |      with Order
      ↓           ↓
      └─→ Combine ←┘
          Branches
             ↓
         Split Out
         (6 items)
             ↓
       Generate PDF
```

---

## Alternatif: Set Node (Simpler)

Kalau tidak mau pakai Code node, bisa pakai **Set node**:

**Node Name**: `Merge Chart with Order`
**Type**: Set
**Keep Only Set**: false
**Values to Set**:

| Destination | Expression |
|-------------|------------|
| `order.metadata.chart_snapshot` | `{{ $node["Call Calculate Chart API"].json }}` |

---

## Testing

### Test Flow 2 (No Chart):
1. Send `flow2_test.json` ke webhook
2. Check IF node → should go FALSE branch
3. HTTP Request should call calculate-chart API
4. Output dari Split Out harus ada 6 items
5. Item pertama (`order`) harus punya `metadata.chart_snapshot`

### Test Flow 1 & 3 (With Chart):
1. Send `flow1_test.json` atau `flow3_test.json`
2. Check IF node → should go TRUE branch
3. Langsung pass through
4. Output sama: 6 items

---

## Expected Final Output (All Flows)

Setelah Split Out, semua flow harus output **persis sama**:

```json
[
  {
    "body": {
      "id": "...",
      "metadata": {
        "chart_ids": [...],
        "birth_data": {...},
        "chart_snapshot": {  // ✅ MUST exist
          "gates": {...},
          "general": {...},
          "channels": {...}
        }
      }
    }
  },
  { "body": "email@example.com" },
  { "body": "+628xxx" },
  { "body": [] },
  { "body": "personal-comprehensive" },
  { "body": { "transaction_id": "..." } }
]
```

**Key point**: `chart_snapshot` **HARUS ADA** di semua flow setelah merge!
