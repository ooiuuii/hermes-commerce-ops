# Hermes Commerce Ops

Real paid e-commerce orders should not stop at "payment succeeded." Hermes Commerce Ops turns a live nopCommerce + Alipay checkout into a controlled autonomous business loop: verify payment evidence, evaluate margin, dispatch fulfillment, and generate an audit-grade proof pack.

This is a separate Hermes Agent Accelerated Business Hackathon submission. It is related to Hermes Foundry and Hermes Sourcing Desk, but it demonstrates a different business surface: post-payment commerce operations.

## Headline Claim

```text
Store: ec.xingyipoxiao.cloud
Live order: #17
Payment: real Alipay payment
Amount: ¥1.00
Payment status: Paid
Order status: Complete
Estimated operating cost: ¥0.17
Gross profit: ¥0.83
Margin: 83%
Decision: fulfill and seal proof
```

The repo does not commit customer PII, private keys, full trade numbers, card data, or raw payment screenshots. Proof artifacts are redacted and verifier-oriented.

## What You'll See

1. A real Alipay-paid nopCommerce order enters Hermes Commerce Ops.
2. Hermes reconciles the Alipay notify and return callbacks.
3. The order is accepted only after the store shows Paid/Complete evidence.
4. A margin gate decides whether fulfillment is profitable.
5. A fulfillment packet is generated with PII redacted.
6. `npm run proof` regenerates payment reconciliation, margin gate, Hermes trace, fulfillment report, audit ledger, and manifest.

## Why This Is Different

Hermes Foundry showed enterprise approval orchestration.

Hermes Sourcing Desk showed procurement sourcing and savings proof.

Hermes Commerce Ops starts from a real e-commerce payment and asks: what should an autonomous business agent do after money arrives?

The answer is not just "mark paid." It is a controlled operating loop:

- verify signed payment evidence,
- reject mismatched or unprofitable orders,
- dispatch only margin-cleared work,
- avoid leaking customer/payment secrets,
- leave a deterministic proof trail.

## Architecture

| Layer | Role | Evidence |
| --- | --- | --- |
| nopCommerce store | Live EC order and Paid/Complete status | `artifacts/proof/live_nopcommerce_payment_smoke.json` |
| Alipay callback proof | Notify/return reconciliation with redacted trade data | `artifacts/proof/payment_reconciliation.json` |
| Hermes margin gate | Revenue, cost, gross profit, and policy decision | `artifacts/proof/margin_gate.json` |
| Hermes agent trace | Deterministic replay of the operating decision | `artifacts/proof/hermes_agent_trace.json` |
| Fulfillment worker | Dispatch packet with PII redaction and rollback metadata | `artifacts/proof/fulfillment_report.json` |
| Audit ledger | Cross-system trail from paid order to ops action | `artifacts/proof/commerce_audit_ledger.json` |
| React/Vite UI | Demo workbench and video surface | `src/App.tsx`, `src/scenarioData.ts`, `src/styles.css` |

## Run It

Requirements:

| Requirement | Notes |
| --- | --- |
| Node.js 20+ | Vite/React app and proof scripts |
| npm | Install dependencies and run scripts |
| Chrome | Needed for Playwright video recording |
| ffmpeg | Needed for MP4 recording and audio mixing |

Install and verify:

```powershell
npm install
npm run proof
npm test
npm run build
```

Start local demo:

```powershell
npm run dev -- --port 5173
```

Open:

```text
http://127.0.0.1:5173
```

Record video after the app is running:

```powershell
npm run record:demo
$env:NAS_BGM_SOURCE="\\path\to\instrumental-bgm.flac"
npm run mix:nas-voice
```

## Proof Pack

The verifier artifacts live in `artifacts/proof/`.

| File | What it proves |
| --- | --- |
| `live_nopcommerce_payment_smoke.json` | Read-only server inspection of live paid order state |
| `payment_reconciliation.json` | Redacted Alipay callback and order-status reconciliation |
| `margin_gate.json` | Revenue/cost/profit/margin decision |
| `hermes_agent_trace.json` | Agent replay from payment verification to fulfillment |
| `fulfillment_report.json` | Dispatch packet, PII redaction, and rollback metadata |
| `commerce_audit_ledger.json` | Full operating trail |
| `proof_manifest.generated.json` | Hashes and verifier claims |

Regenerate it:

```powershell
npm run proof
```

Expected test:

```powershell
npm test
```

Expected output includes:

```text
COMMERCE_OPS_PROOF_VERIFY_OK
```

## Safety Notes

- Do not commit `.env`, API keys, private keys, passwords, SSH keys, Alipay private keys, or PayPal/Alipay live credentials.
- Do not commit raw payment screenshots or customer PII.
- Keep generated videos/screenshots out of normal Git history unless intentionally publishing release assets.
- The proof pack is deterministic and redacted. It proves the commerce operating flow without exposing the live store's sensitive internals.
