import { useCallback, useRef } from "react";
import { useAppDispatch } from "@/store";
import { fetchMoreTransactions } from "@/store/slices/transactionSlice";
import {
  useCalendar,
  useTransactionPagination,
  useTransactionStatus,
} from "@/hooks/useRedux";
import { PAGINATION_LIMIT } from "@/constants/appConfig";

/**
 * Encapsulates the infinite-scroll "load more" logic for the transaction list.
 *
 * Uses a `useRef` guard to prevent duplicate dispatches while a previous
 * `fetchMoreTransactions` is still in flight — even if React batches state
 * updates that haven't yet flipped `isLoadingMore` to `true`.
 */
export function useTransactionLoadMore() {
  const dispatch = useAppDispatch();
  const calendar = useCalendar();
  const pagination = useTransactionPagination();
  const { isLoadingMore } = useTransactionStatus();

  /** Ref-based guard to prevent duplicate infinite-scroll dispatches. */
  const loadMoreRef = useRef(false);

  const handleLoadMore = useCallback(
    (
      searchQuery: string = "",
      budgetId: string | null = null,
      minAmount: number | null = null,
      maxAmount: number | null = null,
    ) => {
      if (loadMoreRef.current || isLoadingMore || !pagination.hasNextPage)
        return;

      loadMoreRef.current = true;
      const nextPage = pagination.currentPage + 1;

      dispatch(
        fetchMoreTransactions({
          searchQuery,
          currentMonth: calendar.month,
          currentYear: calendar.year,
          budgetId,
          minAmount,
          maxAmount,
          page: nextPage,
          limit: PAGINATION_LIMIT,
        }),
      ).finally(() => {
        loadMoreRef.current = false;
      });
    },
    [
      isLoadingMore,
      pagination.hasNextPage,
      pagination.currentPage,
      calendar.month,
      calendar.year,
      dispatch,
    ],
  );

  return {
    handleLoadMore,
    isLoadingMore,
    hasNextPage: pagination.hasNextPage,
  };
}
