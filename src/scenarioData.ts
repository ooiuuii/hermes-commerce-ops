export type StageStatus = "idle" | "active" | "complete" | "blocked";
export type DemoViewId = "order" | "verify" | "margin" | "fulfill" | "proof" | "ledger";
export type Tone = "payment" | "hermes" | "profit" | "risk" | "ops" | "proof";

export type FoundryStage = {
  id: string;
  label: string;
  eyebrow: string;
  detail: string;
};

export type DemoTab = {
  id: DemoViewId;
  label: string;
  eyebrow: string;
  headline: string;
  detail: string;
  stageIndex: number;
};

export type AgentEvent = {
  id: string;
  time: string;
  actor: string;
  command: string;
  result: string;
  tone: Tone;
};

export type LedgerEntry = {
  time: string;
  actor: string;
  action: string;
  result: string;
  tone: Tone;
};

export type MetricCard = {
  label: string;
  value: string;
  detail: string;
  tone: Tone;
};

export const commerceOrder = {
  store: "ec.xingyipoxiao.cloud",
  merchant: "Deqing Qiance Technology Co., Ltd.",
  merchantCn: "德清乾策科技有限公司",
  orderId: "17",
  orderGuid: "C71031DD-CB23-4035-A370-BA578932D966",
  currency: "CNY",
  amount: "¥1.00",
  revenue: 1,
  estimatedCost: 0.17,
  grossProfit: 0.83,
  margin: "83%",
  minimumMargin: "35%",
  paymentMethod: "Payments.AliPay",
  paymentStatus: "Paid / PaymentStatusId 30",
  orderStatus: "Complete / OrderStatusId 30",
  paidAt: "2026-06-25 16:19:40 UTC",
  notifyPath: "/Plugins/PaymentAliPay/Notify",
  returnPath: "/Plugins/PaymentAliPay/Return",
  tradeNoRedacted: "2026062623001481061459****02",
  tradeHash: "4fd89184...d908d62d",
};

export const metricCards: MetricCard[] = [
  {
    label: "Live paid order",
    value: commerceOrder.amount,
    detail: "Real Alipay payment reached nopCommerce order 17.",
    tone: "payment",
  },
  {
    label: "Estimated ops cost",
    value: "¥0.17",
    detail: "Packaging, callback processing, and fulfillment overhead.",
    tone: "ops",
  },
  {
    label: "Gross margin",
    value: commerceOrder.margin,
    detail: "Accepted because margin clears the 35% profit gate.",
    tone: "profit",
  },
  {
    label: "Callback proof",
    value: "200 + 302",
    detail: "Alipay notify returned 200; browser return reached the store.",
    tone: "proof",
  },
];

export const stages: FoundryStage[] = [
  {
    id: "order",
    label: "Paid Order",
    eyebrow: "nopCommerce",
    detail: "A real EC checkout lands in the store.",
  },
  {
    id: "verify",
    label: "Payment Verify",
    eyebrow: "Alipay RSA2",
    detail: "Signed callback evidence is reconciled.",
  },
  {
    id: "margin",
    label: "Profit Gate",
    eyebrow: "Hermes",
    detail: "The agent decides if fulfillment is worth doing.",
  },
  {
    id: "fulfill",
    label: "Fulfillment",
    eyebrow: "Ops Worker",
    detail: "Only profitable paid orders are dispatched.",
  },
  {
    id: "proof",
    label: "Proof Pack",
    eyebrow: "npm run proof",
    detail: "Evidence is regenerated for judges.",
  },
  {
    id: "ledger",
    label: "Audit Ledger",
    eyebrow: "Verifier",
    detail: "Payment, margin, and ops actions are sealed.",
  },
];

export const demoTabs: DemoTab[] = [
  {
    id: "order",
    label: "Live Order",
    eyebrow: "EC checkout",
    headline: "A real Alipay payment enters a live nopCommerce store.",
    detail:
      "The order comes from ec.xingyipoxiao.cloud and is represented only with redacted verifier evidence in this repo.",
    stageIndex: 0,
  },
  {
    id: "verify",
    label: "Payment Verify",
    eyebrow: "RSA2 callback",
    headline: "Hermes does not act until paid evidence is reconciled.",
    detail:
      "Notify and return callbacks are checked against order total, app id, seller id, and RSA2 signature boundaries.",
    stageIndex: 1,
  },
  {
    id: "margin",
    label: "Margin Gate",
    eyebrow: "Business agent",
    headline: "The agent asks the business question before spending effort.",
    detail:
      "Revenue, estimated fulfillment cost, fraud/risk signals, and minimum margin decide whether the order proceeds.",
    stageIndex: 2,
  },
  {
    id: "fulfill",
    label: "Fulfillment",
    eyebrow: "Ops dispatch",
    headline: "A profitable paid order becomes operational work.",
    detail:
      "Hermes creates a fulfillment packet, assigns a worker, keeps customer details redacted, and records rollback metadata.",
    stageIndex: 3,
  },
  {
    id: "proof",
    label: "Proof Pack",
    eyebrow: "Verifier evidence",
    headline: "The demo claim can be regenerated from local artifacts.",
    detail:
      "`npm run proof` rebuilds reconciliation, margin gate, agent trace, fulfillment report, ledger, and manifest.",
    stageIndex: 4,
  },
  {
    id: "ledger",
    label: "Audit Trail",
    eyebrow: "Closed loop",
    headline: "The final product is a commerce operating trail, not a screenshot.",
    detail:
      "Judges can inspect how real payment evidence became a business decision and an auditable fulfillment action.",
    stageIndex: 5,
  },
];

export const agentEvents: AgentEvent[] = [
  {
    id: "boot",
    time: "00:00",
    actor: "Hermes Commerce Ops",
    command: "boot --mode live-commerce --guarded",
    result: "agent online; store, payment, margin, and fulfillment gates loaded",
    tone: "hermes",
  },
  {
    id: "ingest",
    time: "00:04",
    actor: "nopCommerce",
    command: "read order --id 17 --domain ec.xingyipoxiao.cloud",
    result: "order total ¥1.00; payment method Payments.AliPay",
    tone: "payment",
  },
  {
    id: "notify",
    time: "00:08",
    actor: "Alipay Callback",
    command: "POST /Plugins/PaymentAliPay/Notify",
    result: "HTTP 200; paid notification accepted",
    tone: "payment",
  },
  {
    id: "return",
    time: "00:12",
    actor: "Browser Return",
    command: "GET /Plugins/PaymentAliPay/Return",
    result: "HTTP 302; customer returned to merchant site",
    tone: "payment",
  },
  {
    id: "reconcile",
    time: "00:16",
    actor: "Payment Verifier",
    command: "verify rsa2 --amount 1.00 --seller 2088780278049755",
    result: "order marked Paid and Complete in nopCommerce",
    tone: "proof",
  },
  {
    id: "gate",
    time: "00:22",
    actor: "Hermes Profit Gate",
    command: "evaluate revenue=1.00 cost=0.17 min_margin=0.35",
    result: "accepted; projected gross profit ¥0.83 and margin 83%",
    tone: "profit",
  },
  {
    id: "risk",
    time: "00:27",
    actor: "Risk Sidecar",
    command: "screen payment --redacted-trade-no 2026062623001481061459****02",
    result: "no refund, duplicate, or mismatched amount flag found",
    tone: "risk",
  },
  {
    id: "fulfillment",
    time: "00:33",
    actor: "Ops Worker",
    command: "dispatch fulfillment --order 17 --pii redacted",
    result: "fulfillment packet created with reversible steps",
    tone: "ops",
  },
  {
    id: "proof",
    time: "00:39",
    actor: "Proof Runner",
    command: "npm run proof",
    result: "reconciliation, margin, trace, fulfillment, ledger, and manifest regenerated",
    tone: "proof",
  },
  {
    id: "ledger",
    time: "00:45",
    actor: "Audit Ledger",
    command: "seal commerce-trail --order 17",
    result: "closed loop: paid order -> verified margin -> fulfillment -> proof",
    tone: "proof",
  },
];

export const ledgerByStep: LedgerEntry[][] = [
  [
    {
      time: "00:04",
      actor: "nopCommerce",
      action: "Loaded live paid order",
      result: "Order 17 from ec.xingyipoxiao.cloud was read with total ¥1.00 and Alipay payment method.",
      tone: "payment",
    },
  ],
  [
    {
      time: "00:16",
      actor: "Payment verifier",
      action: "Reconciled Alipay callbacks",
      result: "Notify returned 200, return reached the store, and order status is Paid/Complete.",
      tone: "proof",
    },
  ],
  [
    {
      time: "00:22",
      actor: "Hermes profit gate",
      action: "Accepted profitable fulfillment",
      result: "Revenue ¥1.00 minus estimated cost ¥0.17 produces ¥0.83 gross profit.",
      tone: "profit",
    },
  ],
  [
    {
      time: "00:33",
      actor: "Ops worker",
      action: "Dispatched fulfillment packet",
      result: "Worker receives order id, SKU class, amount, and callback proof while customer PII stays redacted.",
      tone: "ops",
    },
  ],
  [
    {
      time: "00:39",
      actor: "Proof runner",
      action: "Regenerated verifier pack",
      result: "Local proof artifacts rebuild payment reconciliation, margin gate, agent trace, and fulfillment report.",
      tone: "proof",
    },
  ],
  [
    {
      time: "00:45",
      actor: "Audit ledger",
      action: "Sealed commerce operating trail",
      result: "The project proves a real payment can trigger a controlled autonomous business workflow.",
      tone: "proof",
    },
  ],
];

export const sidecarCopy = [
  {
    title: "Live commerce intake",
    body: "Hermes starts from a paid nopCommerce order instead of a mock invoice. The repo stores redacted proof, not screenshots or private checkout details.",
    risk: "Medium",
    callout: "real payment",
  },
  {
    title: "Signed payment evidence",
    body: "The agent waits for Alipay callback evidence and the store's Paid/Complete status before it can dispatch work.",
    risk: "Low",
    callout: "RSA2 boundary",
  },
  {
    title: "Autonomous profit gate",
    body: "Hermes evaluates whether the order creates margin. Losing work can be rejected before fulfillment costs are incurred.",
    risk: "Low",
    callout: "83% margin",
  },
  {
    title: "Fulfillment dispatch",
    body: "The worker gets the minimum operational packet and rollback metadata. Customer PII stays outside committed artifacts.",
    risk: "Low",
    callout: "PII redacted",
  },
  {
    title: "Proof regenerated",
    body: "The verifier pack rebuilds reconciliation, margin, trace, fulfillment, ledger, and manifest from local input.",
    risk: "Low",
    callout: "npm run proof",
  },
  {
    title: "Commerce loop sealed",
    body: "The final trail connects a real checkout to an auditable autonomous business operation.",
    risk: "Low",
    callout: "closed loop",
  },
];

export const defaultTaskPrompt =
  "When a real Alipay-paid nopCommerce order arrives, verify signed payment evidence, evaluate margin, dispatch fulfillment only if profitable, and generate a proof pack.";

export const goalText =
  "Hermes Commerce Ops turns a real paid EC order into a controlled autonomous business loop: payment verification, margin gate, fulfillment dispatch, and audit proof.";
