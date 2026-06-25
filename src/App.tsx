import {
  ArrowRight,
  BadgeCheck,
  Check,
  CircleDollarSign,
  CreditCard,
  FileText,
  LockKeyhole,
  PackageCheck,
  Play,
  Receipt,
  RefreshCcw,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import { useMemo, useRef, useState } from "react";
import type { CSSProperties } from "react";
import { proofArtifacts } from "./proofData";
import {
  agentEvents,
  commerceOrder,
  defaultTaskPrompt,
  demoTabs,
  goalText,
  ledgerByStep,
  metricCards,
  sidecarCopy,
  stages,
} from "./scenarioData";
import type { DemoTab, DemoViewId, LedgerEntry, StageStatus } from "./scenarioData";

function getStageStatus(index: number, currentStep: number): StageStatus {
  if (index < currentStep) return "complete";
  if (index === currentStep) return "active";
  return "idle";
}

function flattenLedger(step: number): LedgerEntry[] {
  return ledgerByStep.slice(0, step + 1).flat();
}

function tabIcon(id: DemoViewId) {
  switch (id) {
    case "order":
      return <Receipt size={16} />;
    case "verify":
      return <ShieldCheck size={16} />;
    case "margin":
      return <CircleDollarSign size={16} />;
    case "fulfill":
      return <PackageCheck size={16} />;
    case "proof":
      return <TerminalSquare size={16} />;
    case "ledger":
      return <FileText size={16} />;
  }
}

function getTabState(tab: DemoTab, activeView: DemoViewId, step: number) {
  if (tab.id === activeView) return "active";
  if (tab.stageIndex < step) return "complete";
  return "idle";
}

function ProofPackPanel({ compact = false }: { compact?: boolean }) {
  const visibleArtifacts = compact ? proofArtifacts.slice(0, 4) : proofArtifacts;

  return (
    <div className={`proof-pack ${compact ? "compact" : ""}`}>
      {visibleArtifacts.map((artifact) => (
        <article className={`proof-artifact ${artifact.tone}`} key={artifact.file}>
          <FileText size={16} />
          <div>
            <span>{artifact.label}</span>
            <strong>{artifact.file}</strong>
            {!compact && <p>{artifact.detail}</p>}
          </div>
          <em>{artifact.status}</em>
        </article>
      ))}
    </div>
  );
}

function LiveOrderView() {
  const fields = [
    ["Store", commerceOrder.store],
    ["Merchant", commerceOrder.merchantCn],
    ["Order", `#${commerceOrder.orderId}`],
    ["GUID", commerceOrder.orderGuid],
    ["Payment", commerceOrder.paymentMethod],
    ["Paid At", commerceOrder.paidAt],
  ];

  return (
    <section className="view-stack">
      <div className="order-ledger-card">
        <div className="receipt-head">
          <Receipt size={24} />
          <div>
            <span>Live paid EC order</span>
            <strong>{commerceOrder.amount}</strong>
          </div>
          <BadgeCheck size={22} />
        </div>
        <div className="field-grid">
          {fields.map(([label, value]) => (
            <div key={label}>
              <span>{label}</span>
              <strong>{value}</strong>
            </div>
          ))}
        </div>
        <div className="redaction-bar">
          <LockKeyhole size={15} />
          customer address, full trade number, card data, and secrets are not committed
        </div>
      </div>

      <div className="callback-lane">
        <div className="callback-node complete">
          <CreditCard size={18} />
          <strong>Alipay checkout</strong>
          <span>real mobile payment completed</span>
        </div>
        <ArrowRight size={22} />
        <div className="callback-node complete">
          <TerminalSquare size={18} />
          <strong>nopCommerce</strong>
          <span>order marked Paid / Complete</span>
        </div>
        <ArrowRight size={22} />
        <div className="callback-node active">
          <Sparkles size={18} />
          <strong>Hermes</strong>
          <span>commerce ops agent starts</span>
        </div>
      </div>
    </section>
  );
}

function VerifyView() {
  const checks = [
    ["notify callback", commerceOrder.notifyPath, "HTTP 200"],
    ["browser return", commerceOrder.returnPath, "HTTP 302"],
    ["trade number", commerceOrder.tradeNoRedacted, "redacted"],
    ["trade hash", commerceOrder.tradeHash, "sha256"],
    ["store status", commerceOrder.paymentStatus, "paid"],
    ["order status", commerceOrder.orderStatus, "complete"],
  ];

  return (
    <section className="verify-view">
      <div className="verify-panel">
        <div className="panel-title">
          <ShieldCheck size={22} />
          <div>
            <span>Payment reconciliation</span>
            <strong>Act only after signed paid evidence</strong>
          </div>
        </div>
        <div className="check-list">
          {checks.map(([label, value, status], index) => (
            <article style={{ "--row-index": index } as CSSProperties} key={label}>
              <Check size={16} />
              <div>
                <span>{label}</span>
                <strong>{value}</strong>
              </div>
              <em>{status}</em>
            </article>
          ))}
        </div>
      </div>

      <div className="signature-box">
        <span>RSA2 verifier boundary</span>
        <strong>App ID + Seller ID + Amount + Signature</strong>
        <p>
          The project keeps the operational proof inspectable while avoiding private keys, customer PII, and
          unredacted payment screenshots in Git history.
        </p>
        <code>result: order 17 = Paid / Complete</code>
      </div>
    </section>
  );
}

function MarginView() {
  const marginRows = [
    ["Revenue", "¥1.00", "customer paid through Alipay"],
    ["Estimated cost", "¥0.17", "ops + fulfillment overhead"],
    ["Gross profit", "¥0.83", "revenue minus estimated cost"],
    ["Decision", "ACCEPT", "83% margin clears 35% policy"],
  ];

  return (
    <section className="margin-view">
      <div className="margin-meter">
        <span>Hermes profit gate</span>
        <strong>{commerceOrder.margin}</strong>
        <p>minimum required margin: {commerceOrder.minimumMargin}</p>
        <div className="meter-track">
          <i />
        </div>
      </div>
      <div className="margin-table">
        {marginRows.map(([label, value, detail]) => (
          <article key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <p>{detail}</p>
          </article>
        ))}
      </div>
      <div className="policy-card">
        <ShieldCheck size={20} />
        <div>
          <span>Autonomous business rule</span>
          <strong>Do not fulfill losing work.</strong>
          <p>Hermes can reject or hold an order if callback proof, amount match, or margin policy fails.</p>
        </div>
      </div>
    </section>
  );
}

function FulfillmentView() {
  const steps = [
    ["Create packet", "order id, amount, SKU class, paid evidence"],
    ["Redact customer data", "no full address, full trade number, or card data in artifacts"],
    ["Assign worker", "profitable paid order enters fulfillment queue"],
    ["Add rollback", "refund/retry path recorded before external work"],
  ];

  return (
    <section className="fulfillment-view">
      <div className="worker-card">
        <PackageCheck size={26} />
        <div>
          <span>Ops dispatch</span>
          <strong>Fulfillment packet created</strong>
          <p>
            The useful part for the hackathon: Hermes is not only a checkout integration. It turns a paid
            order into an autonomous business operation with cost control.
          </p>
        </div>
      </div>
      <div className="dispatch-steps">
        {steps.map(([title, detail], index) => (
          <article style={{ "--step-index": index } as CSSProperties} key={title}>
            <span>{String(index + 1).padStart(2, "0")}</span>
            <strong>{title}</strong>
            <p>{detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function ProofRunView() {
  const proofSteps = [
    ["read", "artifacts/input/live-commerce-order.json"],
    ["verify", "payment_reconciliation.json"],
    ["decide", "margin_gate.json"],
    ["trace", "hermes_agent_trace.json"],
    ["dispatch", "fulfillment_report.json"],
    ["seal", "commerce_audit_ledger.json"],
    ["hash", "proof_manifest.generated.json"],
  ];

  return (
    <section className="proof-run-view">
      <div className="proof-terminal-panel">
        <div className="panel-title">
          <TerminalSquare size={22} />
          <div>
            <span>Reproducible proof command</span>
            <strong>npm run proof</strong>
          </div>
        </div>
        <div className="proof-terminal-lines">
          {proofSteps.map(([state, file], index) => (
            <div style={{ "--proof-index": index } as CSSProperties} key={file}>
              <Check size={15} />
              <span>{state}</span>
              <code>{file}</code>
            </div>
          ))}
        </div>
      </div>
      <ProofPackPanel />
    </section>
  );
}

function LedgerView({ ledger }: { ledger: LedgerEntry[] }) {
  return (
    <section className="ledger-view">
      <div className="ledger-summary">
        <div>
          <span>Closed-loop claim</span>
          <strong>Real payment to autonomous commerce operation</strong>
        </div>
        <div>
          <span>Verifier status</span>
          <strong>Payment, margin, trace, fulfillment, ledger</strong>
        </div>
      </div>
      <div className="ledger-list">
        {ledger.map((entry) => (
          <article className={`ledger-entry ${entry.tone}`} key={`${entry.time}-${entry.action}`}>
            <time>{entry.time}</time>
            <div>
              <span>{entry.actor}</span>
              <strong>{entry.action}</strong>
              <p>{entry.result}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function App() {
  const [step, setStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [eventCursor, setEventCursor] = useState(2);
  const [activeView, setActiveView] = useState<DemoViewId>("order");
  const [taskPrompt, setTaskPrompt] = useState(defaultTaskPrompt);
  const timers = useRef<number[]>([]);

  const ledger = useMemo(() => flattenLedger(step), [step]);
  const visibleAgentEvents = useMemo(() => agentEvents.slice(0, eventCursor), [eventCursor]);
  const consoleEvents = visibleAgentEvents.slice(-6);
  const sidecar = sidecarCopy[Math.min(step, sidecarCopy.length - 1)];
  const progress = Math.round(((step + 1) / stages.length) * 100);
  const currentTab = demoTabs.find((tab) => tab.id === activeView) ?? demoTabs[0];
  const slowReplay = new URLSearchParams(window.location.search).get("pace") === "slow";

  function schedule(callback: () => void, delay: number) {
    const timer = window.setTimeout(callback, delay);
    timers.current.push(timer);
  }

  function clearTimers() {
    timers.current.forEach((timer) => window.clearTimeout(timer));
    timers.current = [];
  }

  function revealEvents(from: number, target: number, startDelay = 120, interval = 340) {
    for (let index = from; index <= target; index += 1) {
      schedule(() => {
        setEventCursor((current) => Math.max(current, index));
      }, startDelay + (index - from + 1) * interval);
    }
  }

  function runReplay() {
    if (isRunning) return;
    clearTimers();
    setIsRunning(true);
    setStep(0);
    setActiveView("order");
    setEventCursor(2);
    revealEvents(3, agentEvents.length, slowReplay ? 500 : 90, slowReplay ? 1850 : 340);

    const timeline: Array<[number, DemoViewId, number, boolean?]> = slowReplay
      ? [
          [800, "order", 0],
          [5600, "verify", 1],
          [15400, "margin", 2],
          [25000, "fulfill", 3],
          [33600, "proof", 4],
          [42600, "ledger", 5, true],
        ]
      : [
          [200, "order", 0],
          [900, "verify", 1],
          [1700, "margin", 2],
          [2600, "fulfill", 3],
          [3500, "proof", 4],
          [4400, "ledger", 5, true],
        ];

    timeline.forEach(([delay, view, nextStep, done]) => {
      schedule(() => {
        setActiveView(view);
        setStep(nextStep);
        if (done) setIsRunning(false);
      }, delay);
    });
  }

  function reset() {
    clearTimers();
    setStep(0);
    setIsRunning(false);
    setEventCursor(2);
    setActiveView("order");
  }

  function renderActiveView() {
    switch (activeView) {
      case "order":
        return <LiveOrderView />;
      case "verify":
        return <VerifyView />;
      case "margin":
        return <MarginView />;
      case "fulfill":
        return <FulfillmentView />;
      case "proof":
        return <ProofRunView />;
      case "ledger":
        return <LedgerView ledger={ledger} />;
    }
  }

  return (
    <main className="app-shell">
      <section className="workbench" aria-label="Hermes Commerce Ops workbench">
        <header className="topbar">
          <div className="brand-lockup">
            <div className="brand-mark">
              <Sparkles size={21} />
            </div>
            <div>
              <h1>Hermes Commerce Ops</h1>
              <p>Real paid order to autonomous fulfillment proof</p>
            </div>
          </div>
          <div className="system-strip">
            <span>
              <Receipt size={15} /> nopCommerce
            </span>
            <span>
              <CreditCard size={15} /> Alipay live payment
            </span>
            <span>
              <ShieldCheck size={15} /> RSA2 callback proof
            </span>
            <span>
              <TerminalSquare size={15} /> npm run proof
            </span>
          </div>
        </header>

        <section className="hero-grid">
          <aside className="control-panel">
            <div className="demo-rail-copy">
              <span>Commerce ops no. 001</span>
              <strong>Real payment should become auditable autonomous work.</strong>
              <p>{goalText}</p>
            </div>
            <div className="task-composer">
              <label htmlFor="task-input">Hermes operating instruction</label>
              <textarea id="task-input" value={taskPrompt} onChange={(event) => setTaskPrompt(event.target.value)} />
            </div>
            <div className="demo-tabs" role="tablist" aria-label="Commerce demo views">
              {demoTabs.map((tab) => {
                const state = getTabState(tab, activeView, step);
                return (
                  <button
                    className={`demo-tab ${state}`}
                    key={tab.id}
                    role="tab"
                    aria-selected={tab.id === activeView}
                    onClick={() => setActiveView(tab.id)}
                  >
                    <span className="tab-icon">{tabIcon(tab.id)}</span>
                    <span>
                      <em>{tab.eyebrow}</em>
                      <strong>{tab.label}</strong>
                    </span>
                    <i>{state === "complete" ? <Check size={14} /> : String(tab.stageIndex + 1).padStart(2, "0")}</i>
                  </button>
                );
              })}
            </div>
            <div className="demo-actions">
              <button className="primary-action" onClick={runReplay} disabled={isRunning}>
                <Play size={17} />
                Run agent
              </button>
              <button className="icon-action" onClick={reset} aria-label="Reset replay">
                <RefreshCcw size={17} />
              </button>
            </div>
          </aside>

          <section className="stage-panel" aria-live="polite">
            <div className="stage-heading">
              <span>{currentTab.eyebrow}</span>
              <h2>{currentTab.headline}</h2>
              <p>{currentTab.detail}</p>
            </div>
            <div className="metric-row">
              {metricCards.map((metric) => (
                <article className={`metric-card ${metric.tone}`} key={metric.label}>
                  <span>{metric.label}</span>
                  <strong>{metric.value}</strong>
                  <p>{metric.detail}</p>
                </article>
              ))}
            </div>
            <div className="view-body">{renderActiveView()}</div>
          </section>

          <aside className="agent-console-panel" aria-label="Hermes commerce event stream">
            <div className="terminal-chrome">
              <div className="terminal-dots" aria-hidden="true">
                <span />
                <span />
                <span />
              </div>
              <strong>Hermes Commerce Event Stream</strong>
              <em>
                {isRunning ? "RUNNING" : step >= 5 ? "SEALED" : "READY"} / {visibleAgentEvents.length}/{agentEvents.length}
              </em>
            </div>
            <div className="terminal-body">
              {consoleEvents.map((event, index) => (
                <article className={`terminal-line ${event.tone} ${index === consoleEvents.length - 1 ? "latest" : ""}`} key={event.id}>
                  <time>{event.time}</time>
                  <div>
                    <span>{event.actor}</span>
                    <code>$ {event.command}</code>
                    <p>{event.result}</p>
                  </div>
                </article>
              ))}
              <div className="terminal-prompt">
                <span>hermes-commerce$</span>
                <strong />
              </div>
            </div>
          </aside>
        </section>

        <section className="stage-row" aria-label="commerce operating pipeline">
          <div className="progress-rail" style={{ "--progress": `${progress}%` } as CSSProperties} />
          {stages.map((stage, index) => {
            const status = getStageStatus(index, step);
            return (
              <article className={`stage-tile ${status}`} key={stage.id}>
                <em>{String(index + 1).padStart(2, "0")}</em>
                <div className="stage-icon">
                  {status === "complete" ? <Check size={16} /> : <ArrowRight size={16} />}
                </div>
                <span>{stage.eyebrow}</span>
                <h2>{stage.label}</h2>
                <p>{stage.detail}</p>
              </article>
            );
          })}
        </section>

        <section className="detail-grid">
          <article className="sidecar-panel">
            <div className="panel-heading">
              <div>
                <span>Hermes sidecar</span>
                <h2>{sidecar.title}</h2>
              </div>
              <BadgeCheck size={22} />
            </div>
            <p>{sidecar.body}</p>
            <div className="sidecar-meta">
              <span>Risk: {sidecar.risk}</span>
              <span>{sidecar.callout}</span>
            </div>
          </article>

          <article className="report-panel">
            <div className="panel-heading">
              <div>
                <span>Verifier report</span>
                <h2>Order #{commerceOrder.orderId} commerce proof</h2>
              </div>
              <FileText size={22} />
            </div>
            <div className="report-metrics">
              <div>
                <span>Revenue</span>
                <strong>¥1.00</strong>
              </div>
              <div>
                <span>Gross profit</span>
                <strong>¥0.83</strong>
              </div>
              <div>
                <span>Status</span>
                <strong>Paid</strong>
              </div>
            </div>
            <ProofPackPanel compact />
          </article>
        </section>

        <section className="ledger-section">
          <div className="ledger-header">
            <div>
              <span>Audit ledger</span>
              <h2>Live commerce trail</h2>
            </div>
            <div className="ledger-badges">
              <span>
                <Receipt size={15} /> paid order
              </span>
              <span>
                <CircleDollarSign size={15} /> margin gate
              </span>
              <span>
                <ShieldCheck size={15} /> proof pack
              </span>
            </div>
          </div>
          <div className="ledger-list">
            {ledger.map((entry) => (
              <article className={`ledger-entry ${entry.tone}`} key={`${entry.time}-${entry.action}`}>
                <time>{entry.time}</time>
                <div>
                  <span>{entry.actor}</span>
                  <strong>{entry.action}</strong>
                  <p>{entry.result}</p>
                </div>
              </article>
            ))}
          </div>
        </section>
      </section>
    </main>
  );
}
