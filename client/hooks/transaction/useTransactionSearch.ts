import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch } from "@/store";
import { fetchTransaction } from "@/store/slices/transactionSlice";

type UseTransactionSearchParams = {
  currentMonth: number;
  currentYear: number;
  limit: number;
  budgetId?: string | null;
  minAmount?: number | null;
  maxAmount?: number | null;
};

/**
 * Manages transaction search state and backend querying.
 *
 * - Debounces user input to avoid flooding the backend
 * - Fetches page 1 for each query change
 * - Exposes `refreshTransactions` that respects the active query
 */
export function useTransactionSearch({
  currentMonth,
  currentYear,
  limit,
  budgetId,
  minAmount,
  maxAmount,
}: UseTransactionSearchParams) {
  const dispatch = useAppDispatch();
  const [searchQuery, setSearchQuery] = useState("");

  const normalizedQuery = useMemo(() => searchQuery.trim(), [searchQuery]);
  const didInitRef = useRef(false);

  const fetchFirstPage = useCallback(
    (query: string) => {
      return dispatch(
        fetchTransaction({
          searchQuery: query,
          currentMonth,
          currentYear,
          budgetId,
          minAmount,
          maxAmount,
          page: 1,
          limit,
          useCache: false,
        }),
      );
    },
    [
      dispatch,
      currentMonth,
      currentYear,
      budgetId,
      minAmount,
      maxAmount,
      limit,
    ],
  );

  useEffect(() => {
    // Skip the initial empty-query run; Tabs layout already performs initial load.
    if (!didInitRef.current) {
      didInitRef.current = true;
      if (!normalizedQuery) return;
    }

    const timer = setTimeout(() => {
      fetchFirstPage(normalizedQuery);
    }, 350);

    return () => clearTimeout(timer);
  }, [normalizedQuery, fetchFirstPage]);

  const refreshTransactions = useCallback(() => {
    return fetchFirstPage(normalizedQuery);
  }, [fetchFirstPage, normalizedQuery]);

  return {
    searchQuery,
    setSearchQuery,
    normalizedQuery,
    refreshTransactions,
  };
}
