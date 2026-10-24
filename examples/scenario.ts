import {
  createJournalLine,
  evaluateSettlement,
  reconcileCollection,
  validateJournal,
  validateRefund,
} from "../src/index.js";

const capturedMinor = 11_500;

const journal = validateJournal([
  createJournalLine("gateway-clearing", "DEBIT", capturedMinor),
  createJournalLine("customer-receivable", "CREDIT", capturedMinor),
]);

const reconciliation = reconcileCollection({
  capturedClearingMinor: capturedMinor,
  bankDepositMinor: 11_200,
  gatewayFeeMinor: 300,
});

const settlement = evaluateSettlement({
  stages: {
    invoiceIssued: true,
    collectionCaptured: true,
    bankReconciled:
      reconciliation.accepted && reconciliation.value.status === "MATCHED",
  },
  merchantDueMinor: 9_200,
  refundState: "NONE",
  settlementState: "NOT_SETTLED",
});

const blockedRefund = validateRefund({
  invoiceTotalMinor: capturedMinor,
  previouslyRefundedMinor: 10_000,
  requestedMinor: 1_501,
});

console.log("Marketplace finance reference scenario");
console.log("--------------------------------------");
console.log("Journal:", journal.accepted ? "BALANCED" : journal.code);
console.log(
  "Reconciliation:",
  reconciliation.accepted ? reconciliation.value.status : reconciliation.code,
);
console.log(
  "Settlement:",
  settlement.accepted ? settlement.value.status : settlement.code,
);
console.log(
  "Intentional blocked case:",
  blockedRefund.accepted ? "ACCEPTED" : blockedRefund.code,
);
