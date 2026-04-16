import { useEffect, useState } from "react";
import type { ITransaction } from "@/types/transaction/types";

/**
 * Computes transaction display amounts in the active user currency while
 * preserving persisted base/original snapshot values.
 */
export function useTransactionDisplayAmounts(
  transactions: ITransaction[],
  _activeCurrency: string,
) {
  const [displayTransactions, setDisplayTransactions] =
    useState<ITransaction[]>(transactions);

  useEffect(() => {
    const mapped = transactions.map((tx) => ({
      ...tx,
      // Use persisted values from the backend snapshot; no runtime conversion.
      displayAmount: Number(tx.amount || 0),
      displayCurrency: (tx.baseCurrency || "USD").toUpperCase(),
    }));
    setDisplayTransactions(mapped);
  }, [transactions]);

  return { displayTransactions };
}
