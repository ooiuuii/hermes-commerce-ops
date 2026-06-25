import {
  BadgeCheck,
  CircleDollarSign,
  CreditCard,
  FileText,
  PackageCheck,
  Receipt,
  ShieldCheck,
  Sparkles,
  TerminalSquare,
} from "lucide-react";
import type { CSSProperties } from "react";

const introEvents = [
  "$ nop read order --id 17 --domain ec.xingyipoxiao.cloud",
  "$ alipay verify-callback --rsa2 --amount 1.00",
  "$ hermes margin-gate --revenue 1.00 --cost 0.17",
  "$ hermes dispatch fulfillment --pii redacted",
  "$ npm run proof",
  "SEALED: paid order -> margin -> fulfillment -> audit ledger",
];

const introFlowItems = [
  ["Live EC order", "nopCommerce"],
  ["Alipay proof", "RSA2 callback"],
  ["Profit gate", "83% margin"],
  ["Ops dispatch", "PII redacted"],
  ["Proof pack", "verifier ready"],
];

const compareInputs = ["checkout", "callback", "store status", "margin", "worker", "ledger"];
const compareOutputs = ["paid proof", "accept/reject", "fulfillment packet", "audit trail"];

function CinematicIntro() {
  return (
    <main className="cinema-shell cinema-intro-scene">
      <header className="cinema-topline">
        <span>Hermes Commerce Ops</span>
        <strong>Live paid order to autonomous business operation</strong>
      </header>

      <section className="cinema-hero-copy">
        <p>HERMES COMMERCE OPS</p>
        <h1>
          Real payment in.
          <br />
          Margin checked.
          <br />
          Fulfillment out.
          <br />
          Proof sealed.
        </h1>
      </section>

      <section className="cinema-stage">
        <div className="hermes-agent-avatar" aria-label="Hermes agent avatar">
          <div className="avatar-ring ring-a" />
          <div className="avatar-ring ring-b" />
          <div className="avatar-core">
            <Sparkles size={42} />
            <strong>Hermes</strong>
            <span>commerce ops</span>
          </div>
          <div className="avatar-status">
            <ShieldCheck size={15} />
            paid proof armed
          </div>
        </div>

        <div className="cinema-query-card">
          <span>Live nopCommerce order</span>
          <strong>Order #17 paid ¥1.00 through Alipay.</strong>
          <em>Hermes verifies callback evidence, clears margin, dispatches fulfillment, and regenerates proof.</em>
        </div>

        <div className="cinema-process-chain" aria-label="commerce ops flow">
          {introFlowItems.map(([title, detail], index) => (
            <div className="process-node" style={{ "--process-index": index } as CSSProperties} key={title}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{title}</strong>
              <em>{detail}</em>
            </div>
          ))}
        </div>

        <div className="cinema-agent-map" aria-label="agent execution map">
          <div className="map-center">
            <Sparkles size={30} />
            <strong>Hermes</strong>
            <span>operates</span>
          </div>
          <div className="map-node node-nop">
            <Receipt size={18} />
            nopCommerce
          </div>
          <div className="map-node node-alipay">
            <CreditCard size={18} />
            Alipay
          </div>
          <div className="map-node node-margin">
            <CircleDollarSign size={18} />
            Margin
          </div>
          <div className="map-node node-ops">
            <PackageCheck size={18} />
            Ops
          </div>
          <div className="signal-ring ring-one" />
          <div className="signal-ring ring-two" />
          <div className="signal-ring ring-three" />
          <div className="map-callout callout-precheck">83% margin clears gate</div>
          <div className="map-callout callout-reroute">proof pack, no secrets</div>
        </div>

        <div className="cinema-terminal-card">
          <div className="cinema-terminal-header">
            <TerminalSquare size={16} />
            Hermes Commerce Event Stream
          </div>
          <div className="cinema-terminal-lines">
            {introEvents.map((event, index) => (
              <code style={{ "--line-index": index } as CSSProperties} key={event}>
                {event}
              </code>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}

function ComparisonScene() {
  return (
    <main className="cinema-shell compare-scene">
      <header className="cinema-topline">
        <span>Workflow comparison</span>
        <strong>Checkout integration vs autonomous commerce operations</strong>
      </header>

      <section className="compare-title">
        <p>same paid order</p>
        <h1>A payment page proves money moved. Hermes proves what the business did next.</h1>
      </section>

      <section className="compare-routing-layer" aria-label="checkout signals converge into Hermes ops">
        <div className="pipeline-column pipeline-sources">
          <span>Raw signals</span>
          <div>
            {compareInputs.map((item, index) => (
              <em style={{ "--packet-index": index } as CSSProperties} key={item}>
                {item}
              </em>
            ))}
          </div>
        </div>
        <div className="pipeline-rail source-rail" />
        <div className="pipeline-hub">
          <Sparkles size={24} />
          <strong>Hermes</strong>
          <span>business agent</span>
        </div>
        <div className="pipeline-rail output-rail" />
        <div className="pipeline-column pipeline-outputs">
          <span>Operating outputs</span>
          <div>
            {compareOutputs.map((item, index) => (
              <em style={{ "--packet-index": index } as CSSProperties} key={item}>
                {item}
              </em>
            ))}
          </div>
        </div>
      </section>

      <section className="compare-grid">
        <article className="compare-panel manual-panel">
          <span>Payment integration only</span>
          <h2>Paid status exists, but ops and profit proof live somewhere else.</h2>
          <div className="chaos-stack">
            {compareInputs.map((item, index) => (
              <em style={{ "--chaos-index": index } as CSSProperties} key={item}>
                {item}
              </em>
            ))}
          </div>
          <div className="compare-meter">
            <strong>Paid</strong>
            <span>but not operationally closed</span>
          </div>
        </article>

        <article className="compare-panel guarded-panel">
          <span>Hermes Commerce Ops</span>
          <h2>Paid evidence becomes a margin-gated fulfillment trail.</h2>
          <div className="guarded-steps">
            {compareOutputs.map((item, index) => (
              <div style={{ "--step-index": index } as CSSProperties} key={item}>
                <BadgeCheck size={16} />
                <strong>{item}</strong>
              </div>
            ))}
          </div>
          <div className="compare-meter">
            <strong>¥0.83 profit</strong>
            <span>payment, margin, worker, ledger</span>
          </div>
        </article>
      </section>

      <section className="compare-proof-row">
        <div>
          <CreditCard size={18} />
          real Alipay payment
        </div>
        <div>
          <CircleDollarSign size={18} />
          margin gate
        </div>
        <div>
          <PackageCheck size={18} />
          fulfillment packet
        </div>
        <div>
          <FileText size={18} />
          proof ledger
        </div>
      </section>
    </main>
  );
}

function AdminEvidenceScene() {
  const orderRows = [
    ["Order ID", "#17"],
    ["Payment", "Payments.AliPay"],
    ["Payment status", "Paid"],
    ["Order status", "Complete"],
    ["Total", "¥1.00"],
    ["Paid date", "2026-06-25 16:19 UTC"],
  ];
  const notes = [
    "Order placed",
    "Order has been marked as paid",
    "Order status has been changed to completed",
  ];

  return (
    <main className="cinema-shell admin-proof-scene">
      <header className="cinema-topline">
        <span>Merchant backend evidence</span>
        <strong>Redacted nopCommerce order proof</strong>
      </header>

      <section className="admin-proof-layout">
        <div className="admin-proof-copy">
          <p>BACK OFFICE CHECK</p>
          <h1>
            The storefront paid.
            <br />
            The backend closed.
            <br />
            Hermes can operate.
          </h1>
          <div className="admin-proof-warning">
            <ShieldCheck size={18} />
            no admin password, customer address, card data, or full trade number is shown
          </div>
        </div>

        <div className="admin-browser-frame">
          <div className="admin-browser-top">
            <div className="terminal-dots" aria-hidden="true">
              <span />
              <span />
              <span />
            </div>
            <strong>nopCommerce Administration / Orders / Edit #17</strong>
            <em>read-only proof</em>
          </div>
          <div className="admin-order-shell">
            <div className="admin-order-title">
              <Receipt size={22} />
              <div>
                <span>Order #17</span>
                <strong>Paid and completed</strong>
              </div>
              <BadgeCheck size={24} />
            </div>
            <div className="admin-order-grid">
              {orderRows.map(([label, value], index) => (
                <div className="admin-order-field" style={{ "--admin-index": index } as CSSProperties} key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </div>
              ))}
            </div>
            <div className="admin-notes">
              <span>Order notes</span>
              {notes.map((note, index) => (
                <div className="admin-note" style={{ "--admin-index": index } as CSSProperties} key={note}>
                  <CheckIcon />
                  <strong>{note}</strong>
                </div>
              ))}
            </div>
            <div className="admin-callback-row">
              <div>
                <span>Notify</span>
                <strong>POST /Plugins/PaymentAliPay/Notify {"->"} 200</strong>
              </div>
              <div>
                <span>Return</span>
                <strong>GET /Plugins/PaymentAliPay/Return {"->"} 302</strong>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}

function CheckIcon() {
  return <BadgeCheck size={16} />;
}

export function CinematicTrailer() {
  const scene = new URLSearchParams(window.location.search).get("scene");
  if (scene === "compare") return <ComparisonScene />;
  if (scene === "admin") return <AdminEvidenceScene />;
  return <CinematicIntro />;
}
