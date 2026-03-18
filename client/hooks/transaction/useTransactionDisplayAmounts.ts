import { useEffect, useMemo, useState } from "react";
import { convertCurrency } from "@/utils/currencyConverter";
import type { ITransaction } from "@/types/transaction/types";

/**
 * Computes transaction display amounts in the active user currency while
 * preserving persisted base/original snapshot values.
 */
export function useTransactionDisplayAmounts(
  transactions: ITransaction[],
  activeCurrency: string,
) {
  const [displayTransactions, setDisplayTransactions] =
    useState<ITransaction[]>(transactions);

  const normalizedActiveCurrency = useMemo(
    () => (activeCurrency || "USD").toUpperCase(),
    [activeCurrency],
  );

  useEffect(() => {
    let cancelled = false;

    const run = async () => {
      const mapped = await Promise.all(
        transactions.map(async (tx) => {
          const originalAmount =
            tx.originalAmount != null ? Number(tx.originalAmount) : null;
          const originalCurrency = tx.originalCurrency
            ? tx.originalCurrency.toUpperCase()
            : null;
          const baseCurrency = tx.baseCurrency
            ? tx.baseCurrency.toUpperCase()
            : normalizedActiveCurrency;

          let displayAmount = Number(tx.amount || 0);

          try {
            if (originalAmount != null && originalCurrency) {
              if (originalCurrency === normalizedActiveCurrency) {
                displayAmount = originalAmount;
              } else {
                displayAmount = await convertCurrency(
                  originalAmount,
                  originalCurrency,
                  normalizedActiveCurrency,
                );
              }
            } else if (baseCurrency !== normalizedActiveCurrency) {
              displayAmount = await convertCurrency(
                Number(tx.amount || 0),
                baseCurrency,
                normalizedActiveCurrency,
              );
            }
          } catch {
            // Keep persisted `amount` as fallback when conversion service fails.
          }

          return {
            ...tx,
            displayAmount,
            displayCurrency: normalizedActiveCurrency,
          };
        }),
      );

      if (!cancelled) {
        setDisplayTransactions(mapped);
      }
    };

    run();

    return () => {
      cancelled = true;
    };
  }, [transactions, normalizedActiveCurrency]);

  return { displayTransactions };
}
