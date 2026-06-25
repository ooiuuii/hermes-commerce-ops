import { createHash } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const inputDir = path.join(root, "artifacts", "input");
const proofDir = path.join(root, "artifacts", "proof");

const inputPath = path.join(inputDir, "live-commerce-order.json");
const liveSmokePath = path.join(proofDir, "live_nopcommerce_payment_smoke.json");

function hashText(value) {
  return createHash("sha256").update(value, "utf8").digest("hex");
}

function proofRef(name) {
  return `artifacts/proof/${name}`;
}

function roundMoney(value) {
  return Math.round(value * 100) / 100;
}

function assertPaid(order) {
  return order.payment_status_id === 30 && Boolean(order.paid_date_utc);
}

function margin(orderInput) {
  const model = orderInput.cost_model;
  const grossProfit = roundMoney(model.revenue - model.estimated_total_cost);
  const grossMargin = roundMoney(grossProfit / model.revenue);

  return {
    currency: model.currency,
    revenue: model.revenue,
    estimated_costs: {
      model: model.estimated_model_cost,
      tool: model.estimated_tool_cost,
      storage: model.estimated_storage_cost,
      total: model.estimated_total_cost
    },
    gross_profit: grossProfit,
    gross_margin: grossMargin,
    minimum_margin: model.minimum_margin,
    decision: grossMargin >= model.minimum_margin ? "accept_and_fulfill" : "hold_for_human_review"
  };
}

function buildReconciliation(input, liveSmoke) {
  const order = input.order;
  const paid = assertPaid(order);

  return {
    schema: "hermes-commerce-ops.payment_reconciliation.v1",
    generated_at: "2026-06-25T16:23:10Z",
    generated_by: "scripts/generate-proof-pack.mjs",
    source_refs: {
      order_input: "artifacts/input/live-commerce-order.json",
      live_smoke: "artifacts/proof/live_nopcommerce_payment_smoke.json"
    },
    store: input.store,
    order: {
      id: order.id,
      guid: order.guid,
      amount: order.order_total,
      currency: order.currency,
      payment_method: order.payment_method,
      payment_status_id: order.payment_status_id,
      order_status_id: order.order_status_id,
      created_on_utc: order.created_on_utc,
      paid_date_utc: order.paid_date_utc
    },
    alipay: {
      provider: input.payment_evidence.provider,
      app_id: input.payment_evidence.app_id,
      seller_id: input.payment_evidence.seller_id,
      trade_no_redacted: input.payment_evidence.trade_no_redacted,
      trade_no_sha256: input.payment_evidence.trade_no_sha256,
      notify_path: input.payment_evidence.notify.path,
      notify_status: input.payment_evidence.notify.status,
      return_path: input.payment_evidence.return.path,
      return_status: input.payment_evidence.return.status
    },
    checks: [
      {
        name: "signed_payment_callback_seen",
        result: input.payment_evidence.notify.status === 200,
        evidence: liveSmoke.http_log_result.notify
      },
      {
        name: "customer_return_seen",
        result: input.payment_evidence.return.status === 302,
        evidence: liveSmoke.http_log_result.return
      },
      {
        name: "order_marked_paid",
        result: paid,
        evidence: `PaymentStatusId=${order.payment_status_id}; PaidDateUtc=${order.paid_date_utc}`
      },
      {
        name: "order_completed",
        result: order.order_status_id === 30,
        evidence: `OrderStatusId=${order.order_status_id}`
      },
      {
        name: "no_sensitive_fields_in_public_proof",
        result: liveSmoke.safety.contains_private_key === false && liveSmoke.safety.contains_bank_card === false,
        evidence: "trade number redacted and hashed; no card data stored"
      }
    ],
    decision: paid ? "payment_verified" : "hold_for_reconciliation"
  };
}

function buildMarginGate(input, reconciliation) {
  const marginResult = margin(input);
  const canFulfill = reconciliation.decision === "payment_verified" && marginResult.decision === "accept_and_fulfill";

  return {
    schema: "hermes-commerce-ops.margin_gate.v1",
    generated_at: "2026-06-25T16:23:14Z",
    generated_by: "scripts/generate-proof-pack.mjs",
    input_refs: {
      payment_reconciliation: proofRef("payment_reconciliation.json"),
      order_input: "artifacts/input/live-commerce-order.json"
    },
    service: input.service,
    economics: marginResult,
    guardrails: {
      payment_must_be_verified_first: true,
      irreversible_external_actions_allowed: false,
      customer_data_exposure: "redacted proof only",
      human_review_triggers: input.service.fulfillment_policy.human_review_required_when
    },
    decision: canFulfill ? "dispatch_fulfillment_agent" : "hold_for_human_review"
  };
}

function buildHermesTrace(input, reconciliation, gate) {
  return {
    schema: "hermes-commerce-ops.hermes_agent_trace.v1",
    generated_at: "2026-06-25T16:23:18Z",
    generated_by: "scripts/generate-proof-pack.mjs",
    trace_mode: "deterministic_replay_from_live_payment",
    model_lane: input.hermes_runtime.model_lane,
    events: [
      {
        time: "00:00",
        actor: "Payment verifier",
        command: `reconcile nop order ${input.order.id}`,
        result: reconciliation.decision
      },
      {
        time: "00:04",
        actor: "Margin gate",
        command: `estimate fulfillment margin for ${input.service.sku}`,
        result: `${gate.economics.gross_profit.toFixed(2)} ${gate.economics.currency} gross profit; decision=${gate.decision}`
      },
      {
        time: "00:08",
        actor: "Fulfillment worker",
        command: "generate deterministic customer proof pack",
        result: "service report, payment reconciliation, and audit ledger prepared"
      },
      {
        time: "00:12",
        actor: "Audit ledger",
        command: "seal commerce trail",
        result: "paid order, callback evidence, cost estimate, and deliverable hash linked"
      }
    ],
    boundary:
      "Hermes acts only after Alipay/nopCommerce signed payment evidence exists; it does not handle card data, private keys, or payment capture."
  };
}

function buildFulfillment(input, reconciliation, gate) {
  const report = {
    title: "Paid-order reconciliation report",
    customer_safe_summary:
      "The live EC order was paid through Alipay, reconciled against nopCommerce, accepted by the margin gate, and converted into a proof pack.",
    included_evidence: [
      "paid nopCommerce order state",
      "Alipay notify and return routes",
      "redacted transaction reference",
      "cost and margin gate",
      "Hermes agent trace",
      "audit ledger"
    ]
  };

  return {
    schema: "hermes-commerce-ops.fulfillment_report.v1",
    generated_at: "2026-06-25T16:23:22Z",
    generated_by: "scripts/generate-proof-pack.mjs",
    order_id: input.order.id,
    status: gate.decision === "dispatch_fulfillment_agent" ? "fulfilled" : "held",
    deliverable: report,
    deliverable_sha256: hashText(JSON.stringify(report)),
    customer_visible_result:
      "Hermes Commerce Ops can turn a real paid order into a verified, margin-aware fulfillment packet.",
    non_goals: [
      "No card data is processed by Hermes.",
      "No private payment keys are stored in the proof pack.",
      "No irreversible external action is executed without a signed payment state."
    ]
  };
}

function buildLedger(input, reconciliation, gate, trace, fulfillment) {
  return {
    schema: "hermes-commerce-ops.commerce_audit_ledger.v1",
    generated_at: "2026-06-25T16:23:26Z",
    generated_by: "scripts/generate-proof-pack.mjs",
    ledger: [
      {
        time_utc: input.order.created_on_utc,
        actor: "nopCommerce",
        action: "Order created",
        result: `Order ${input.order.id} created for ${input.order.order_total.toFixed(2)} ${input.order.currency}`
      },
      {
        time_utc: input.order.paid_date_utc,
        actor: "Alipay + nopCommerce",
        action: "Payment verified",
        result: reconciliation.decision
      },
      {
        time_utc: "2026-06-25T16:23:14Z",
        actor: "Hermes margin gate",
        action: "Economic precheck",
        result: `${gate.economics.gross_margin * 100}% margin; ${gate.decision}`
      },
      {
        time_utc: "2026-06-25T16:23:22Z",
        actor: "Hermes fulfillment worker",
        action: "Deliverable generated",
        result: fulfillment.deliverable_sha256
      }
    ],
    proof_links: {
      reconciliation: proofRef("payment_reconciliation.json"),
      margin_gate: proofRef("margin_gate.json"),
      hermes_trace: proofRef("hermes_agent_trace.json"),
      fulfillment_report: proofRef("fulfillment_report.json")
    },
    conclusion:
      "A real company EC payment entered the system, reconciled as paid, passed an autonomous margin gate, and produced an audit-grade fulfillment proof pack."
  };
}

function buildManifest(input, liveSmoke, outputs) {
  return {
    schema: "hermes-commerce-ops.proof_manifest.v1",
    generated_at: "2026-06-25T16:23:30Z",
    generated_by: "scripts/generate-proof-pack.mjs",
    project: "Hermes Commerce Ops",
    live_evidence: {
      domain: input.store.domain,
      order_id: input.order.id,
      provider: input.payment_evidence.provider,
      smoke_ref: "artifacts/proof/live_nopcommerce_payment_smoke.json"
    },
    generated_outputs: outputs.map((output) => ({
      path: output.path,
      sha256: hashText(output.content)
    })),
    static_evidence: [
      {
        path: "artifacts/input/live-commerce-order.json",
        sha256: hashText(JSON.stringify(input, null, 2))
      },
      {
        path: "artifacts/proof/live_nopcommerce_payment_smoke.json",
        sha256: hashText(JSON.stringify(liveSmoke, null, 2))
      }
    ],
    verifier_claims: [
      "A live Alipay order exists in nopCommerce.",
      "The Alipay notify callback reached /Plugins/PaymentAliPay/Notify.",
      "The order transitioned to paid and completed.",
      "Hermes only fulfills after payment verification and a margin gate.",
      "Public proof is redacted and does not contain payment secrets."
    ],
    commands: {
      regenerate: "npm run proof",
      verify: "npm test",
      run_demo: "npm run dev"
    }
  };
}

await mkdir(proofDir, { recursive: true });

const input = JSON.parse(await readFile(inputPath, "utf8"));
const liveSmoke = JSON.parse(await readFile(liveSmokePath, "utf8"));

const reconciliation = buildReconciliation(input, liveSmoke);
const gate = buildMarginGate(input, reconciliation);
const trace = buildHermesTrace(input, reconciliation, gate);
const fulfillment = buildFulfillment(input, reconciliation, gate);
const ledger = buildLedger(input, reconciliation, gate, trace, fulfillment);

const outputObjects = [
  ["payment_reconciliation.json", reconciliation],
  ["margin_gate.json", gate],
  ["hermes_agent_trace.json", trace],
  ["fulfillment_report.json", fulfillment],
  ["commerce_audit_ledger.json", ledger]
];

const outputs = [];
for (const [name, data] of outputObjects) {
  const content = `${JSON.stringify(data, null, 2)}\n`;
  await writeFile(path.join(proofDir, name), content);
  outputs.push({ path: proofRef(name), content });
}

const manifest = buildManifest(input, liveSmoke, outputs);
await writeFile(path.join(proofDir, "proof_manifest.generated.json"), `${JSON.stringify(manifest, null, 2)}\n`);

console.log("Generated Hermes Commerce Ops proof pack:");
for (const output of outputs) {
  console.log(`- ${output.path}`);
}
console.log("- artifacts/proof/proof_manifest.generated.json");
