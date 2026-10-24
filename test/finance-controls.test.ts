import assert from "node:assert/strict";
import test from "node:test";

import {
  createJournalLine,
  evaluateSettlement,
  reconcileCollection,
  validateJournal,
  validateRefund,
  type SettlementContext,
} from "../src/index.js";

test("balanced journal is accepted", () => {
  const result = validateJournal([
    createJournalLine("gateway-clearing", "DEBIT", 11_500),
    createJournalLine("customer-receivable", "CREDIT", 11_500),
  ]);

  assert.deepEqual(result, {
    accepted: true,
    value: {
      totalDebitsMinor: 11_500,
      totalCreditsMinor: 11_500,
      lineCount: 2,
    },
  });
});

test("unbalanced journal is blocked", () => {
  const result = validateJournal([
    { account: "bank", debitMinor: 11_200, creditMinor: 0 },
    { account: "gateway-clearing", debitMinor: 0, creditMinor: 11_500 },
  ]);

  assert.equal(result.accepted, false);
  if (!result.accepted) assert.equal(result.code, "UNBALANCED_JOURNAL");
});

test("malformed journal line is blocked", () => {
  const result = validateJournal([
    { account: "bank", debitMinor: 100, creditMinor: 100 },
  ]);

  assert.equal(result.accepted, false);
  if (!result.accepted) assert.equal(result.code, "MALFORMED_JOURNAL_LINE");
});

test("valid partial refund is accepted", () => {
  const result = validateRefund({
    invoiceTotalMinor: 20_000,
    previouslyRefundedMinor: 2_000,
    requestedMinor: 3_000,
  });

  assert.deepEqual(result, {
    accepted: true,
    value: {
      requestedMinor: 3_000,
      remainingBeforeMinor: 18_000,
      remainingAfterMinor: 15_000,
    },
  });
});

test("refund above remaining refundable amount is blocked", () => {
  const result = validateRefund({
    invoiceTotalMinor: 20_000,
    previouslyRefundedMinor: 18_000,
    requestedMinor: 2_001,
  });

  assert.equal(result.accepted, false);
  if (!result.accepted) assert.equal(result.code, "REFUND_EXCEEDS_REMAINING");
});

const eligibleContext: SettlementContext = {
  stages: {
    invoiceIssued: true,
    collectionCaptured: true,
    bankReconciled: true,
  },
  merchantDueMinor: 9_200,
  refundState: "NONE",
  settlementState: "NOT_SETTLED",
};

test("eligible settlement is accepted", () => {
  const result = evaluateSettlement(eligibleContext);

  assert.deepEqual(result, {
    accepted: true,
    value: { status: "ELIGIBLE", payableMinor: 9_200 },
  });
});

test("unresolved refund blocks settlement", () => {
  const result = evaluateSettlement({
    ...eligibleContext,
    refundState: "UNRESOLVED",
  });

  assert.equal(result.accepted, false);
  if (!result.accepted) assert.equal(result.code, "UNRESOLVED_REFUND");
});

test("incomplete preceding stages block settlement", () => {
  const result = evaluateSettlement({
    ...eligibleContext,
    stages: { ...eligibleContext.stages, bankReconciled: false },
  });

  assert.equal(result.accepted, false);
  if (!result.accepted) {
    assert.equal(result.code, "BANK_RECONCILIATION_REQUIRED");
  }
});

test("already-settled transaction blocks duplicate settlement", () => {
  const result = evaluateSettlement({
    ...eligibleContext,
    settlementState: "SETTLED",
  });

  assert.equal(result.accepted, false);
  if (!result.accepted) assert.equal(result.code, "ALREADY_SETTLED");
});

test("matched reconciliation is reported", () => {
  const result = reconcileCollection({
    capturedClearingMinor: 11_500,
    bankDepositMinor: 11_200,
    gatewayFeeMinor: 300,
  });

  assert.equal(result.accepted, true);
  if (result.accepted) {
    assert.equal(result.value.status, "MATCHED");
    assert.equal(result.value.differenceMinor, 0);
  }
});

test("reconciliation difference is reported as an exception", () => {
  const result = reconcileCollection({
    capturedClearingMinor: 11_500,
    bankDepositMinor: 11_100,
    gatewayFeeMinor: 300,
  });

  assert.equal(result.accepted, true);
  if (result.accepted) {
    assert.equal(result.value.status, "EXCEPTION");
    assert.equal(result.value.differenceMinor, -100);
  }
});
