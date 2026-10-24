import type { DomainResult, MoneyMinor, ReconciliationInput } from "./types.js";
import { isMoneyMinor } from "./types.js";

export type ReconciliationMatch = {
  status: "MATCHED";
  capturedClearingMinor: MoneyMinor;
  accountedMinor: MoneyMinor;
  differenceMinor: 0;
};

export type ReconciliationException = {
  status: "EXCEPTION";
  capturedClearingMinor: MoneyMinor;
  accountedMinor: MoneyMinor;
  differenceMinor: number;
};

export type ReconciliationError = "INVALID_RECONCILIATION_INPUT";

export function reconcileCollection(
  input: ReconciliationInput,
): DomainResult<ReconciliationMatch | ReconciliationException, ReconciliationError> {
  if (
    !isMoneyMinor(input.capturedClearingMinor) ||
    !isMoneyMinor(input.bankDepositMinor) ||
    !isMoneyMinor(input.gatewayFeeMinor)
  ) {
    return {
      accepted: false,
      code: "INVALID_RECONCILIATION_INPUT",
      message: "Reconciliation amounts must be non-negative integer minor units.",
    };
  }

  const accountedMinor = input.bankDepositMinor + input.gatewayFeeMinor;
  const differenceMinor = accountedMinor - input.capturedClearingMinor;

  if (differenceMinor === 0) {
    return {
      accepted: true,
      value: {
        status: "MATCHED",
        capturedClearingMinor: input.capturedClearingMinor,
        accountedMinor,
        differenceMinor: 0,
      },
    };
  }

  return {
    accepted: true,
    value: {
      status: "EXCEPTION",
      capturedClearingMinor: input.capturedClearingMinor,
      accountedMinor,
      differenceMinor,
    },
  };
}
