# Architectural Decisions

## ADR-001: Separate operational and accounting state

### Context

Transaction progression and accounting effects have different review and correction needs.

### Decision

Maintain operational finance stages separately from journal and ledger records, with explicit links between them.

### Consequence

Operators can trace an accounting effect back to its finance stage while preserving a clear boundary between workflow state and accounting state.

## ADR-002: Use compensating entries for refunds and reversals

### Context

Refunds and reversals must correct prior financial effects without rewriting the original event.

### Decision

Represent refunds through new compensating accounting events, including a controlled adjustment path after settlement.

### Consequence

The accounting history remains traceable and the correction is visible as a distinct finance event.

## ADR-003: Require balanced and linked accounting records

### Context

A finance event is only useful operationally when its journal and ledger representation is internally consistent.

### Decision

Generate balanced journal records and retain linkage to the ledger and invoice impact context.

### Consequence

Posting can be blocked when balance, identity, or linkage validation fails, and review can follow the event across finance surfaces.

© 2026 Saleh Mukhrish. All rights reserved.
