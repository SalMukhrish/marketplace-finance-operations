export type MoneyMinor = number;

export type JournalSide = "DEBIT" | "CREDIT";

export type JournalLine = {
  account: string;
  debitMinor: MoneyMinor;
  creditMinor: MoneyMinor;
};

export type DomainAccepted<T> = {
  accepted: true;
  value: T;
};

export type DomainBlocked<Code extends string> = {
  accepted: false;
  code: Code;
  message: string;
};

export type DomainResult<T, Code extends string> =
  | DomainAccepted<T>
  | DomainBlocked<Code>;

export type RefundState = "NONE" | "RESOLVED" | "UNRESOLVED";

export type FinanceStageState = {
  invoiceIssued: boolean;
  collectionCaptured: boolean;
  bankReconciled: boolean;
};

export type SettlementContext = {
  stages: FinanceStageState;
  merchantDueMinor: MoneyMinor | null;
  refundState: RefundState;
  settlementState: "NOT_SETTLED" | "SETTLED";
};

export type ReconciliationInput = {
  capturedClearingMinor: MoneyMinor;
  bankDepositMinor: MoneyMinor;
  gatewayFeeMinor: MoneyMinor;
};

export function isMoneyMinor(value: number): value is MoneyMinor {
  return Number.isSafeInteger(value) && value >= 0;
}
