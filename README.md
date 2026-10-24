# Marketplace Finance Operations

A finance operations system for managing marketplace transaction states, accounting events, merchant obligations, settlement, reconciliation, and operational review.

## System Overview

The system connects operational transaction records with finance-specific stages and accounting records. It separates transaction progression from journal and ledger records while providing review surfaces for exceptions, settlement readiness, reconciliation, and traceability.

## Transaction Lifecycle

Order → Invoice → Collection → Bank Reconciliation → Merchant Due → Fees / Commission / VAT → Refunds & Reversals → Settlement → Reconciliation & Reporting

The lifecycle is represented through explicit finance stages. Each stage has entry conditions, accounting effects, and review outcomes. See [the lifecycle model](docs/transaction-lifecycle.md).

## Core Finance Capabilities

- Invoice creation and collection tracking
- Merchant due and payable calculation
- Commission, VAT, and gateway-fee handling
- Journal generation and ledger linkage
- Refunds and compensating reversals
- Settlement eligibility and payout status
- Bank reconciliation and exception review
- Operational reporting and traceability

## Architecture

The application layer presents finance operations and review views. The finance workflow layer records stage transitions and accounting events. A relational data layer stores transactional state, finance records, journal lines, settlement records, reconciliation results, and review history.

See [Architecture](docs/architecture.md).

## Controls and Validation

The implementation validates invoice and collection integrity, balanced journal construction, journal-to-ledger linkage, duplicate-event protection, refund limits, settlement eligibility, and reconciliation conditions. See [Controls and Validation](docs/controls-and-validation.md).

## Validation Evidence

The implementation includes validation coverage for:

- balanced journal construction
- journal-to-ledger integrity
- duplicate-event protection
- refund limit validation
- settlement eligibility controls
- reconciliation validation
- lifecycle and accounting scenario coverage

## A Look Inside

| Finance Overview | Invoice Lifecycle |
|---|---|
| ![Finance overview](assets/finance-overview.png)<br>Track finance stages, exceptions, and operational status. | ![Invoice lifecycle](assets/invoice-lifecycle.png)<br>Follow a transaction from invoice and collection through merchant due. |

| Journal & Ledger | Settlement & Reconciliation |
|---|---|
| ![Journal and ledger](assets/journal-ledger.png)<br>Review balanced accounting records with linked ledger traceability. | ![Settlement and reconciliation](assets/settlement-reconciliation.png)<br>Review settlement readiness, payout state, and reconciliation outcomes. |

## Supplemental Finance Evidence

| Invoice Accounting Progress | Finance Operations Summary |
|---|---|
| ![Invoice accounting progress](assets/invoice-accounting-inv-000439.jpg)<br>Follow a posted invoice through a ready capture stage with journal detail and operating context. | ![Finance operations summary](assets/finance-operations-summary.jpg)<br>Review invoice coverage and finance progression across capture, reconciliation, merchant due, settlement, and refunds. |

## Technology

- TypeScript
- Node.js
- Next.js
- React
- PostgreSQL
- Supabase
- SQLite for local transactional operation
- SQL migrations
- HeroUI
- ECharts

## Working Reference Implementation

The [`src`](src) directory contains executable, runtime dependency-free finance-domain controls for balanced journal validation, refund limits, settlement eligibility, and collection reconciliation. Each control returns an explicit accepted or blocked outcome.

## Run Locally

```bash
npm ci
npm test
npm run demo
```

## What the Code Demonstrates

- [Journal balance and line validation](src/journal.ts)
- [Remaining-refundable-amount validation](src/refund.ts)
- [Settlement eligibility and blocking reasons](src/settlement.ts)
- [Collection, bank, and gateway-fee reconciliation](src/reconciliation.ts)
- [Deterministic accepted and blocked test cases](test/finance-controls.test.ts)

## Reference Schema

[`schema/reference-schema.sql`](schema/reference-schema.sql) is a simplified relational reference for the documented transaction, accounting, refund, settlement, and reconciliation model.

## Scope and Boundary

This repository contains a public reference implementation of selected marketplace-finance controls. It is not the complete production application and contains no customer credentials, proprietary production data, or production secrets.

## License

Source code in this repository is licensed under the [MIT License](LICENSE).

Documentation, screenshots, diagrams, and other non-code assets are © 2026 Saleh Mukhrish. All rights reserved.
