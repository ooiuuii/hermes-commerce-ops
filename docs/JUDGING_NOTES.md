# Judging Notes

## One Sentence

Hermes Commerce Ops turns a real Alipay-paid nopCommerce order into an autonomous commerce operation: verify payment, check margin, dispatch fulfillment, and generate proof.

## Why It Is Useful

Many demos stop at checkout success. A business agent should answer the next question: after money arrives, what work should happen, and can we prove the decision?

This project demonstrates that Hermes can:

- ingest a real paid order,
- reconcile payment callback evidence,
- refuse to act before Paid/Complete status,
- decide whether fulfillment clears a profit gate,
- create an operational packet without leaking customer PII,
- regenerate evidence for judges and auditors.

## What To Inspect

1. Run `npm run proof`.
2. Run `npm test`.
3. Open `artifacts/proof/live_nopcommerce_payment_smoke.json`.
4. Confirm order `17`, amount `¥1.00`, `Payments.AliPay`, `PaymentStatusId=30`, and `OrderStatusId=30`.
5. Open `artifacts/proof/margin_gate.json` and confirm the 83% margin decision.
6. Open `artifacts/proof/commerce_audit_ledger.json` to see the full operating trail.

## Strongest Claim

This is not only a payment plugin. It is a small autonomous business operating loop backed by a real payment event.

## Boundary

The repo is intentionally redacted:

- no Alipay private key,
- no PayPal/Alipay live secret,
- no customer PII,
- no raw payment screenshots,
- no full trade number,
- no server password.

The proof pack gives judges the operational evidence without exposing sensitive production data.
