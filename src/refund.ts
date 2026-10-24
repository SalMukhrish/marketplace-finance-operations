import type { DomainResult, MoneyMinor } from "./types.js";
import { isMoneyMinor } from "./types.js";

export type RefundValidation = {
  requestedMinor: MoneyMinor;
  remainingBeforeMinor: MoneyMinor;
  remainingAfterMinor: MoneyMinor;
};

export type RefundError =
  | "INVALID_REFUND_AMOUNT"
  | "INVALID_REFUND_STATE"
  | "REFUND_EXCEEDS_REMAINING";

export function validateRefund(input: {
  invoiceTotalMinor: MoneyMinor;
  previouslyRefundedMinor: MoneyMinor;
  requestedMinor: MoneyMinor;
}): DomainResult<RefundValidation, RefundError> {
  if (!isMoneyMinor(input.requestedMinor) || input.requestedMinor === 0) {
    return {
      accepted: false,
      code: "INVALID_REFUND_AMOUNT",
      message: "A refund must be a positive integer amount in minor units.",
    };
  }

  if (
    !isMoneyMinor(input.invoiceTotalMinor) ||
    input.invoiceTotalMinor === 0 ||
    !isMoneyMinor(input.previouslyRefundedMinor) ||
    input.previouslyRefundedMinor > input.invoiceTotalMinor
  ) {
    return {
      accepted: false,
      code: "INVALID_REFUND_STATE",
      message: "Invoice and prior-refund amounts do not form a valid refund state.",
    };
  }

  const remainingBeforeMinor =
    input.invoiceTotalMinor - input.previouslyRefundedMinor;

  if (input.requestedMinor > remainingBeforeMinor) {
    return {
      accepted: false,
      code: "REFUND_EXCEEDS_REMAINING",
      message: `Requested refund (${input.requestedMinor}) exceeds the remaining refundable amount (${remainingBeforeMinor}).`,
    };
  }

  return {
    accepted: true,
    value: {
      requestedMinor: input.requestedMinor,
      remainingBeforeMinor,
      remainingAfterMinor: remainingBeforeMinor - input.requestedMinor,
    },
  };
}
