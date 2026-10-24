import type {
  DomainResult,
  JournalLine,
  JournalSide,
  MoneyMinor,
} from "./types.js";
import { isMoneyMinor } from "./types.js";

export type JournalValidation = {
  totalDebitsMinor: MoneyMinor;
  totalCreditsMinor: MoneyMinor;
  lineCount: number;
};

export type JournalError =
  | "EMPTY_JOURNAL"
  | "MALFORMED_JOURNAL_LINE"
  | "UNBALANCED_JOURNAL";

export function createJournalLine(
  account: string,
  side: JournalSide,
  amountMinor: MoneyMinor,
): JournalLine {
  if (!account.trim() || !isMoneyMinor(amountMinor) || amountMinor === 0) {
    throw new TypeError(
      "A journal line requires an account and a positive integer amount in minor units.",
    );
  }

  return side === "DEBIT"
    ? { account, debitMinor: amountMinor, creditMinor: 0 }
    : { account, debitMinor: 0, creditMinor: amountMinor };
}

export function validateJournal(
  lines: readonly JournalLine[],
): DomainResult<JournalValidation, JournalError> {
  if (lines.length === 0) {
    return {
      accepted: false,
      code: "EMPTY_JOURNAL",
      message: "A journal event must contain at least one line.",
    };
  }

  for (const line of lines) {
    const amountIsValid =
      isMoneyMinor(line.debitMinor) && isMoneyMinor(line.creditMinor);
    const exactlyOneSide =
      (line.debitMinor > 0 && line.creditMinor === 0) ||
      (line.creditMinor > 0 && line.debitMinor === 0);

    if (!line.account.trim() || !amountIsValid || !exactlyOneSide) {
      return {
        accepted: false,
        code: "MALFORMED_JOURNAL_LINE",
        message:
          "Each journal line requires an account and one positive minor-unit amount on exactly one side.",
      };
    }
  }

  const totalDebitsMinor = lines.reduce(
    (sum, line) => sum + line.debitMinor,
    0,
  );
  const totalCreditsMinor = lines.reduce(
    (sum, line) => sum + line.creditMinor,
    0,
  );

  if (totalDebitsMinor !== totalCreditsMinor) {
    return {
      accepted: false,
      code: "UNBALANCED_JOURNAL",
      message: `Journal debits (${totalDebitsMinor}) do not equal credits (${totalCreditsMinor}).`,
    };
  }

  return {
    accepted: true,
    value: { totalDebitsMinor, totalCreditsMinor, lineCount: lines.length },
  };
}
