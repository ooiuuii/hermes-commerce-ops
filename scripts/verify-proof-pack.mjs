import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const proofDir = path.join(root, "artifacts", "proof");
const inputDir = path.join(root, "artifacts", "input");

async function readJson(filePath) {
  return JSON.parse(await readFile(filePath, "utf8"));
}

async function readProof(name) {
  return readJson(path.join(proofDir, name));
}

const input = await readJson(path.join(inputDir, "live-commerce-order.json"));
const liveSmoke = await readProof("live_nopcommerce_payment_smoke.json");
const reconciliation = await readProof("payment_reconciliation.json");
const marginGate = await readProof("margin_gate.json");
const trace = await readProof("hermes_agent_trace.json");
const fulfillment = await readProof("fulfillment_report.json");
const ledger = await readProof("commerce_audit_ledger.json");
const manifest = await readProof("proof_manifest.generated.json");

const generatedPaths = new Set(manifest.generated_outputs.map((output) => output.path));
const staticPaths = new Set(manifest.static_evidence.map((output) => output.path));

assert.equal(input.order.id, 17);
assert.equal(input.order.payment_status_id, 30);
assert.equal(input.order.order_status_id, 30);
assert.equal(input.order.payment_method, "Payments.AliPay");
assert.equal(input.payment_evidence.notify.path, "/Plugins/PaymentAliPay/Notify");
assert.equal(input.payment_evidence.return.path, "/Plugins/PaymentAliPay/Return");
assert.match(input.payment_evidence.trade_no_redacted, /\*\*\*\*/);
assert.equal(input.payment_evidence.trade_no_sha256.length, 64);

assert.equal(liveSmoke.database_result.status_interpretation, "paid_and_completed");
assert.equal(liveSmoke.safety.contains_private_key, false);
assert.equal(liveSmoke.safety.contains_bank_card, false);
assert.match(liveSmoke.http_log_result.notify, /POST \/Plugins\/PaymentAliPay\/Notify -> 200/);

assert.equal(reconciliation.decision, "payment_verified");
assert.equal(reconciliation.checks.every((check) => check.result === true), true);
assert.equal(reconciliation.alipay.notify_status, 200);
assert.equal(reconciliation.alipay.return_status, 302);

assert.equal(marginGate.economics.revenue, 1);
assert.equal(marginGate.economics.estimated_costs.total, 0.17);
assert.equal(marginGate.economics.gross_profit, 0.83);
assert.equal(marginGate.decision, "dispatch_fulfillment_agent");

assert.equal(trace.trace_mode, "deterministic_replay_from_live_payment");
assert.match(trace.boundary, /does not handle card data/);
assert.equal(trace.events.length >= 4, true);

assert.equal(fulfillment.status, "fulfilled");
assert.equal(fulfillment.deliverable_sha256.length, 64);
assert.match(fulfillment.customer_visible_result, /real paid order/i);

assert.match(ledger.conclusion, /real company EC payment/i);
assert.match(JSON.stringify(ledger), /Payment verified/);
assert.match(JSON.stringify(ledger), /Economic precheck/);

assert.equal(generatedPaths.has("artifacts/proof/payment_reconciliation.json"), true);
assert.equal(generatedPaths.has("artifacts/proof/margin_gate.json"), true);
assert.equal(generatedPaths.has("artifacts/proof/hermes_agent_trace.json"), true);
assert.equal(generatedPaths.has("artifacts/proof/fulfillment_report.json"), true);
assert.equal(generatedPaths.has("artifacts/proof/commerce_audit_ledger.json"), true);
assert.equal(staticPaths.has("artifacts/input/live-commerce-order.json"), true);
assert.equal(staticPaths.has("artifacts/proof/live_nopcommerce_payment_smoke.json"), true);
assert.deepEqual(manifest.commands, {
  regenerate: "npm run proof",
  verify: "npm test",
  run_demo: "npm run dev"
});

console.log("COMMERCE_OPS_PROOF_VERIFY_OK");
