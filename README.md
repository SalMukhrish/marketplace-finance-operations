# Marketplace Finance Operations

A finance operations system for managing marketplace transaction states, accounting events, merchant obligations, settlement, reconciliation, and operational review.

## System Overview

The system connects operational transaction records with finance-specific stages and accounting records. It separates transaction progression from journal and ledger records while providing review surfaces for exceptions, settlement readiness, reconciliation, and traceability.

## Transaction Lifecycle

Order → Invoice → Collection → Merchant Due → Fees & VAT → Refunds → Settlement → Reconciliation

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

Local snapshot record counts are not used as public evidence.

## A Look Inside

The public repository is structured around the finance overview, invoice lifecycle, journal and ledger, and settlement and reconciliation surfaces described by the system model.

## Technology

- TypeScript
- Node.js
- Next.js
- React
- SQLite for local transactional operation
- Supabase / PostgreSQL integration boundaries
- SQL migrations
- HeroUI
- ECharts

© 2026 Saleh Mukhrish. All rights reserved.
