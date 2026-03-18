import { useCallback, useState } from "react";

/**
 * Generic hook for pull-to-refresh logic.
 * Accepts a refresh function and returns refreshing state and handler.
 */
export function useRefresh(refreshFn: () => Promise<unknown>) {
  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await refreshFn();
    } finally {
      setRefreshing(false);
    }
  }, [refreshFn]);
  return { refreshing, onRefresh };
}
