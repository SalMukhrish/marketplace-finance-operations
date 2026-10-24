import type { DomainResult, MoneyMinor, SettlementContext } from "./types.js";
import { isMoneyMinor } from "./types.js";

export type SettlementEligibility = {
  status: "ELIGIBLE";
  payableMinor: MoneyMinor;
};

export type SettlementBlock =
  | "INVOICE_NOT_ISSUED"
  | "COLLECTION_NOT_CAPTURED"
  | "BANK_RECONCILIATION_REQUIRED"
  | "MERCHANT_DUE_UNAVAILABLE"
  | "UNRESOLVED_REFUND"
  | "ALREADY_SETTLED";

export function evaluateSettlement(
  context: SettlementContext,
): DomainResult<SettlementEligibility, SettlementBlock> {
  if (context.settlementState === "SETTLED") {
    return {
      accepted: false,
      code: "ALREADY_SETTLED",
      message: "Settlement has already been completed for this transaction.",
    };
  }

  if (!context.stages.invoiceIssued) {
    return {
      accepted: false,
      code: "INVOICE_NOT_ISSUED",
      message: "An issued invoice is required before settlement.",
    };
  }

  if (!context.stages.collectionCaptured) {
    return {
      accepted: false,
      code: "COLLECTION_NOT_CAPTURED",
      message: "Captured collection is required before settlement.",
    };
  }

  if (!context.stages.bankReconciled) {
    return {
      accepted: false,
      code: "BANK_RECONCILIATION_REQUIRED",
      message: "Bank reconciliation must be matched before settlement.",
    };
  }

  if (
    context.merchantDueMinor === null ||
    !isMoneyMinor(context.merchantDueMinor) ||
    context.merchantDueMinor === 0
  ) {
    return {
      accepted: false,
      code: "MERCHANT_DUE_UNAVAILABLE",
      message: "A positive merchant due amount is required before settlement.",
    };
  }

  if (context.refundState === "UNRESOLVED") {
    return {
      accepted: false,
      code: "UNRESOLVED_REFUND",
      message: "Settlement remains blocked while a refund state is unresolved.",
    };
  }

  return {
    accepted: true,
    value: { status: "ELIGIBLE", payableMinor: context.merchantDueMinor },
  };
}
