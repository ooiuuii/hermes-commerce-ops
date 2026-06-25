# Commerce Integration Model

Hermes Commerce Ops treats nopCommerce as the store system of record and Alipay as the payment evidence source.

## Scenario Mapping

| Signal | Evidence |
| --- | --- |
| Store | `ec.xingyipoxiao.cloud` |
| Order | `17` |
| Payment provider | `Payments.AliPay` |
| Amount | `¥1.00` |
| Payment state | `PaymentStatusId=30` / Paid |
| Order state | `OrderStatusId=30` / Complete |
| Notify path | `/Plugins/PaymentAliPay/Notify` |
| Return path | `/Plugins/PaymentAliPay/Return` |

## Agent Boundary

Hermes may:

- read redacted order evidence,
- verify callback and store status,
- calculate margin,
- dispatch fulfillment when policy passes,
- record rollback metadata,
- seal a proof ledger.

Hermes must not:

- store private keys,
- expose full payment identifiers,
- commit customer PII,
- dispatch fulfillment before paid evidence is present,
- accept orders that fail the margin gate.

## Production Notes

In production, the proof snapshot would be replaced by direct read access to the store, payment events, and fulfillment system. The same boundaries still apply: secrets stay in runtime configuration, proof artifacts remain redacted, and irreversible operations are driven by explicit policy.
