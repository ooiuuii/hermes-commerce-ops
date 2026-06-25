type ProofTone = "payment" | "hermes" | "profit" | "risk" | "ops" | "proof";

export type ProofArtifact = {
  label: string;
  file: string;
  status: string;
  detail: string;
  tone: ProofTone;
};

export const proofArtifacts: ProofArtifact[] = [
  {
    label: "Live payment smoke",
    file: "artifacts/proof/live_nopcommerce_payment_smoke.json",
    status: "paid",
    detail:
      "Read-only server inspection confirms order 17 is Paid/Complete after real Alipay callback handling.",
    tone: "payment",
  },
  {
    label: "Payment reconciliation",
    file: "artifacts/proof/payment_reconciliation.json",
    status: "verified",
    detail:
      "Checks order id, amount, payment method, notify path, return path, redacted trade number, and callback status.",
    tone: "proof",
  },
  {
    label: "Margin gate",
    file: "artifacts/proof/margin_gate.json",
    status: "accepted",
    detail:
      "Revenue ¥1.00, estimated cost ¥0.17, gross profit ¥0.83, and 83% margin clear the policy gate.",
    tone: "profit",
  },
  {
    label: "Hermes trace",
    file: "artifacts/proof/hermes_agent_trace.json",
    status: "replay",
    detail:
      "Deterministic agent trace shows payment verification, risk screen, margin decision, and fulfillment dispatch.",
    tone: "hermes",
  },
  {
    label: "Fulfillment report",
    file: "artifacts/proof/fulfillment_report.json",
    status: "created",
    detail:
      "Operational packet is created with reversible steps while customer address and private payment data stay redacted.",
    tone: "ops",
  },
  {
    label: "Audit ledger",
    file: "artifacts/proof/commerce_audit_ledger.json",
    status: "sealed",
    detail:
      "Final ledger links live order, Alipay callback proof, margin gate, fulfillment action, and rollback metadata.",
    tone: "proof",
  },
  {
    label: "Proof manifest",
    file: "artifacts/proof/proof_manifest.generated.json",
    status: "hashed",
    detail:
      "Manifest records verifier claims, generated outputs, and input/output hashes for repeatable judging.",
    tone: "risk",
  },
];
