# Architecture

Hermes Commerce Ops is built around one product assumption: once a real customer pays, an autonomous business agent should verify evidence, decide whether the order is worth fulfilling, dispatch work, and leave a proof trail.

## Flow

```text
Live nopCommerce order
  -> Alipay notify / return callback reconciliation
  -> Paid / Complete store-state check
  -> Hermes margin gate
  -> risk and duplicate screen
  -> fulfillment packet with PII redacted
  -> commerce audit ledger
  -> proof manifest
```

## Responsibilities

| Component | Responsibility |
| --- | --- |
| `artifacts/input/live-commerce-order.json` | Redacted live-order input used by the proof generator |
| `artifacts/proof/live_nopcommerce_payment_smoke.json` | Read-only proof that the real order reached Paid/Complete state |
| `artifacts/proof/payment_reconciliation.json` | Alipay callback and order-status reconciliation |
| `artifacts/proof/margin_gate.json` | Revenue/cost/profit policy decision |
| `artifacts/proof/hermes_agent_trace.json` | Deterministic agent replay |
| `artifacts/proof/fulfillment_report.json` | Fulfillment packet, redaction rules, and rollback metadata |
| `artifacts/proof/commerce_audit_ledger.json` | Cross-system operating trail |
| `scripts/generate-proof-pack.mjs` | Deterministically regenerates verifier artifacts |
| `scripts/verify-proof-pack.mjs` | Checks paid status, callback paths, margin, redaction, and generated outputs |
| `src/App.tsx` | Shows the commerce ops workbench |
| `scripts/record-full-demo.mjs` | Records the demo video from the app |

## Trust Boundary

Committed artifacts may include:

- order id,
- order total,
- payment method name,
- Paid/Complete status,
- redacted trade number,
- callback path and HTTP status,
- hash of trade evidence,
- margin model,
- fulfillment state.

Committed artifacts must not include:

- Alipay private key,
- app private key,
- full trade number,
- card information,
- customer address,
- customer phone number,
- raw payment screenshots,
- server passwords or tokens.

## Runtime Boundary

The real store and Alipay merchant setup are external runtime systems. The repo contains a redacted proof snapshot and deterministic replay, so a judge can inspect the operating logic without needing production credentials.
