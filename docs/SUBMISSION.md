# Submission Copy

## Project

Hermes Commerce Ops

## One-Line Description

An autonomous commerce agent that turns a real Alipay-paid nopCommerce order into payment verification, margin gating, fulfillment dispatch, and audit proof.

## X/Twitter Draft

Third submission for @NousResearch's Hermes Agent Accelerated Business Hackathon: Hermes Commerce Ops.

Hermes Foundry showed approval orchestration. Hermes Sourcing Desk showed procurement savings. This one starts from a real EC payment: a live nopCommerce + Alipay order becomes signed payment proof, an 83% margin gate, fulfillment dispatch, and a verifier proof pack.

Demo video: https://github.com/ooiuuii/hermes-commerce-ops/releases/download/v0.1-demo/hermes-commerce-ops-full-demo.en.andrew-nas-bgm.mp4

Repo: https://github.com/ooiuuii/hermes-commerce-ops

## Discord Draft

Project: Hermes Commerce Ops

Hermes Commerce Ops turns a real paid e-commerce order into a controlled autonomous business operation.

Demo scenario:

- Live store: `ec.xingyipoxiao.cloud`
- Live order: `#17`
- Payment method: Alipay through nopCommerce
- Amount: `¥1.00`
- Store result: Paid / Complete
- Margin model: revenue `¥1.00`, estimated cost `¥0.17`, gross profit `¥0.83`, margin `83%`
- Hermes decision: fulfill and seal proof

The repo uses redacted proof artifacts, not raw payment screenshots or secrets. `npm run proof` regenerates payment reconciliation, margin gate, Hermes trace, fulfillment report, audit ledger, and manifest.

Video: https://github.com/ooiuuii/hermes-commerce-ops/releases/download/v0.1-demo/hermes-commerce-ops-full-demo.en.andrew-nas-bgm.mp4

Repo: https://github.com/ooiuuii/hermes-commerce-ops

## Typeform Notes

Project name: Hermes Commerce Ops

One-line description: Autonomous commerce operations for real paid e-commerce orders.

What it demonstrates: A Hermes agent can start from a real payment event, verify Alipay/nopCommerce paid evidence, calculate margin, dispatch fulfillment only when profitable, redact sensitive customer/payment data, and regenerate a proof pack for judges.

Stack highlights: Hermes Agent workflow, nopCommerce live order, Alipay RSA2 callback path, deterministic margin gate, fulfillment report, audit ledger, React/Vite demo UI, Playwright video recorder.
