import AsyncStorage from "@react-native-async-storage/async-storage";
import { USER_DATA_STORAGE_KEY } from "@/constants/storageKeys";
import { logger } from "@/utils/logger";

// Helper: try to read stored user id from AsyncStorage
async function getStoredUserId(): Promise<string | null> {
  try {
    const raw = await AsyncStorage.getItem(USER_DATA_STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed?.id ?? null;
  } catch (e) {
    logger.warn("cache", "getStoredUserId failed to read userData", e);
    return null;
  }
}

// Key format is transactions:<userId>:<year>-<monthIndex>
// Note: monthIndex is JavaScript month index (0-11) to match Date.getMonth().
const txKey = (userId: string, year: number, month: number) =>
  `transactions:${userId}:${year}-${month}`;
const budgetKey = (userId: string, year: number, month: number) =>
  `budgets:${userId}:${year}-${month}`;
const goalAllocationsKey = (userId: string, year: number, month: number) =>
  `goalAllocations:${userId}:${year}-${month}`;

type GoalAllocationCacheItem = {
  goalId: string;
  amount: number;
  allocatedAt: string;
};

// Cache wrapper to allow future TTL/staleness checks.
type CacheWrapper = { ts: number; data: any };

function wrap(data: any): string {
  return JSON.stringify({ ts: Date.now(), data });
}

function unwrap(raw: string | null): any | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw);
    if (parsed && typeof parsed === "object" && "data" in parsed) {
      return parsed.data;
    }
    // Backwards compatibility: raw was previously stored as the array/object
    return parsed;
  } catch (e) {
    logger.warn("cache", "Failed to parse cached value", e);
    return null;
  }
}

export async function getTransactionsCache(
  year: number,
  month: number,
  userId?: string,
) {
  try {
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return null;
    const raw = await AsyncStorage.getItem(txKey(uid, year, month));
    return unwrap(raw);
  } catch (e) {
    logger.warn("cache", "Failed reading transactions cache", e);
    return null;
  }
}

export async function setTransactionsCache(
  year: number,
  month: number,
  arr: any[],
  userId?: string,
) {
  try {
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return;
    await AsyncStorage.setItem(txKey(uid, year, month), wrap(arr));
  } catch (e) {
    logger.warn("cache", "Failed writing transactions cache", e);
  }
}

export async function appendTransactionToCache(tx: any, userId?: string) {
  try {
    const d = tx?.date ? new Date(tx.date) : new Date();
    const month = tx?.month ?? d.getMonth();
    const year = tx?.year ?? d.getFullYear();
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return;
    const key = txKey(uid, year, month);
    const raw = await AsyncStorage.getItem(key);
    const arr = unwrap(raw) ?? [];
    arr.push(tx);
    await AsyncStorage.setItem(key, wrap(arr));
  } catch (e) {
    logger.warn("cache", "Failed appending transaction to cache", e);
  }
}

export async function removeTransactionFromCacheById(
  id: string,
  year?: number,
  month?: number,
  userId?: string,
) {
  try {
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return;

    if (year !== undefined && month !== undefined) {
      const key = txKey(uid, year, month);
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return;
      const arr = (unwrap(raw) ?? []).filter((t: any) => t.id !== id);
      await AsyncStorage.setItem(key, wrap(arr));
      return;
    }

    // Best-effort: try current and previous month
    const now = new Date();
    const candidates = [
      txKey(uid, now.getFullYear(), now.getMonth()),
      txKey(uid, now.getFullYear(), Math.max(0, now.getMonth() - 1)),
    ];
    for (const key of candidates) {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) continue;
        const arr = (unwrap(raw) ?? []).filter((t: any) => t.id !== id);
        await AsyncStorage.setItem(key, wrap(arr));
      } catch (e) {
        logger.warn(
          "cache",
          `Failed processing transaction cache key: ${key}`,
          e,
        );
      }
    }
  } catch (e) {
    logger.warn("cache", "Unexpected error removing transaction from cache", e);
  }
}

// Remove a transaction id from ALL cached months for the user (best-effort)
export async function removeTransactionFromCacheByIdAcrossAllMonths(
  id: string,
  userId?: string,
) {
  try {
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return;
    const keys = await AsyncStorage.getAllKeys();
    const txKeys = keys.filter((k) => k.startsWith(`transactions:${uid}:`));
    for (const key of txKeys) {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) continue;
        const arr = (unwrap(raw) ?? []).filter((t: any) => t.id !== id);
        if (arr.length === 0) {
          await AsyncStorage.removeItem(key);
        } else {
          await AsyncStorage.setItem(key, wrap(arr));
        }
      } catch (e) {
        logger.warn(
          "cache",
          `Failed removing transaction from cache key: ${key}`,
          e,
        );
      }
    }
  } catch (e) {
    logger.warn(
      "cache",
      "Unexpected cross-month transaction cache removal error",
      e,
    );
  }
}

export async function getBudgetsCache(
  year: number,
  month: number,
  userId?: string,
) {
  try {
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return null;
    const raw = await AsyncStorage.getItem(budgetKey(uid, year, month));
    return unwrap(raw);
  } catch (e) {
    logger.warn("cache", "Failed reading budgets cache", e);
    return null;
  }
}

export async function setBudgetsCache(
  year: number,
  month: number,
  arr: any[],
  userId?: string,
) {
  try {
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return;
    await AsyncStorage.setItem(budgetKey(uid, year, month), wrap(arr));
  } catch (e) {
    logger.warn("cache", "Failed writing budgets cache", e);
  }
}

export async function appendBudgetToCache(
  b: any,
  year?: number,
  month?: number,
  userId?: string,
) {
  try {
    const monthIndex =
      month !== undefined && year !== undefined
        ? month
        : (b?.month ??
          (b?.createdAt
            ? new Date(b.createdAt).getMonth()
            : new Date().getMonth()));
    const yearIndex =
      month !== undefined && year !== undefined
        ? year
        : (b?.year ??
          (b?.createdAt
            ? new Date(b.createdAt).getFullYear()
            : new Date().getFullYear()));
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return;
    const key = budgetKey(uid, yearIndex, monthIndex);
    const raw = await AsyncStorage.getItem(key);
    const arr = unwrap(raw) ?? [];
    arr.push(b);
    await AsyncStorage.setItem(key, wrap(arr));
  } catch (e) {
    logger.warn("cache", "Failed appending budget to cache", e);
  }
}

export async function removeBudgetFromCacheById(
  id: string,
  year?: number,
  month?: number,
  userId?: string,
) {
  try {
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return;

    if (year !== undefined && month !== undefined) {
      const key = budgetKey(uid, year, month);
      const raw = await AsyncStorage.getItem(key);
      if (!raw) return;
      const arr = (unwrap(raw) ?? []).filter((b: any) => b.id !== id);
      await AsyncStorage.setItem(key, wrap(arr));
      return;
    }

    const now = new Date();
    const candidates = [
      budgetKey(uid, now.getFullYear(), now.getMonth()),
      budgetKey(uid, now.getFullYear(), Math.max(0, now.getMonth() - 1)),
    ];
    for (const key of candidates) {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) continue;
        const arr = (unwrap(raw) ?? []).filter((b: any) => b.id !== id);
        await AsyncStorage.setItem(key, wrap(arr));
      } catch (e) {
        logger.warn(
          "cache",
          `Failed removing budget from cache key: ${key}`,
          e,
        );
      }
    }
  } catch (e) {
    logger.warn("cache", "Unexpected error removing budget from cache", e);
  }
}

// Remove a budget id from ALL cached months for the user (best-effort)
export async function removeBudgetFromCacheByIdAcrossAllMonths(
  id: string,
  userId?: string,
) {
  try {
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return;
    const keys = await AsyncStorage.getAllKeys();
    const bKeys = keys.filter((k) => k.startsWith(`budgets:${uid}:`));
    for (const key of bKeys) {
      try {
        const raw = await AsyncStorage.getItem(key);
        if (!raw) continue;
        const arr = (unwrap(raw) ?? []).filter((b: any) => b.id !== id);
        if (arr.length === 0) {
          await AsyncStorage.removeItem(key);
        } else {
          await AsyncStorage.setItem(key, wrap(arr));
        }
      } catch (e) {
        logger.warn(
          "cache",
          `Failed removing budget from cache key: ${key}`,
          e,
        );
      }
    }
  } catch (e) {
    logger.warn(
      "cache",
      "Unexpected cross-month budget cache removal error",
      e,
    );
  }
}

export async function getGoalAllocationsTotalCache(
  year: number,
  month: number,
  userId?: string,
): Promise<number> {
  try {
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return 0;
    const raw = await AsyncStorage.getItem(
      goalAllocationsKey(uid, year, month),
    );
    const value = unwrap(raw);

    // Backward compatibility: old format stored just a number.
    if (typeof value === "number") {
      return Number.isFinite(value) && value > 0 ? value : 0;
    }

    const entries = Array.isArray(value)
      ? (value as GoalAllocationCacheItem[])
      : [];

    return (
      Math.round(
        entries.reduce((sum, entry) => {
          const amount = Number(entry?.amount || 0);
          return sum + (Number.isFinite(amount) && amount > 0 ? amount : 0);
        }, 0) * 100,
      ) / 100
    );
  } catch (e) {
    logger.warn("cache", "Failed reading goal allocation cache", e);
    return 0;
  }
}

export async function addGoalAllocationToCache(
  year: number,
  month: number,
  goalId: string,
  amount: number,
  allocatedAt?: string,
  userId?: string,
) {
  try {
    const incrementBy = Number(amount || 0);
    if (!goalId || !goalId.trim()) return;
    if (!Number.isFinite(incrementBy) || incrementBy <= 0) return;
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return;

    const key = goalAllocationsKey(uid, year, month);
    const raw = await AsyncStorage.getItem(key);

    // Backward compatibility: convert legacy numeric format to a synthetic entry.
    const parsed = unwrap(raw);
    let entries: GoalAllocationCacheItem[] = [];
    if (Array.isArray(parsed)) {
      entries = parsed as GoalAllocationCacheItem[];
    } else if (typeof parsed === "number" && parsed > 0) {
      entries = [
        {
          goalId: "__legacy__",
          amount: Number(parsed),
          allocatedAt: new Date(year, month, 1).toISOString(),
        },
      ];
    }

    entries.push({
      goalId: goalId.trim(),
      amount: incrementBy,
      allocatedAt: allocatedAt || new Date().toISOString(),
    });

    await AsyncStorage.setItem(key, wrap(entries));
  } catch (e) {
    logger.warn("cache", "Failed appending goal allocation cache", e);
  }
}

export async function removeGoalAllocationsForGoalFromCache(
  goalId: string,
  currentYear?: number,
  currentMonth?: number,
  userId?: string,
): Promise<number> {
  try {
    if (!goalId || !goalId.trim()) return 0;
    const uid = userId ?? (await getStoredUserId());
    if (!uid) return 0;

    const normalizedGoalId = goalId.trim();
    const keys = await AsyncStorage.getAllKeys();
    const allocationKeys = keys.filter((k) =>
      k.startsWith(`goalAllocations:${uid}:`),
    );

    let removedForCurrentMonth = 0;

    for (const key of allocationKeys) {
      const raw = await AsyncStorage.getItem(key);
      const parsed = unwrap(raw);

      // Legacy numeric format: unknown goal ownership. If caller passed current
      // month/year and key matches, clear it as safest stale-data correction.
      if (typeof parsed === "number") {
        const isCurrentMonthKey =
          currentYear != null &&
          currentMonth != null &&
          key.endsWith(`${currentYear}-${currentMonth}`);
        if (isCurrentMonthKey && parsed > 0) {
          removedForCurrentMonth += Number(parsed);
          await AsyncStorage.setItem(key, wrap(0));
        }
        continue;
      }

      const entries = Array.isArray(parsed)
        ? (parsed as GoalAllocationCacheItem[])
        : [];

      if (entries.length === 0) continue;

      const removedAmount = entries
        .filter((entry) => entry.goalId === normalizedGoalId)
        .reduce((sum, entry) => sum + Number(entry.amount || 0), 0);

      if (removedAmount <= 0) continue;

      const remaining = entries.filter(
        (entry) => entry.goalId !== normalizedGoalId,
      );

      if (remaining.length === 0) {
        await AsyncStorage.removeItem(key);
      } else {
        await AsyncStorage.setItem(key, wrap(remaining));
      }

      const isCurrentMonthKey =
        currentYear != null &&
        currentMonth != null &&
        key.endsWith(`${currentYear}-${currentMonth}`);
      if (isCurrentMonthKey) {
        removedForCurrentMonth += removedAmount;
      }
    }

    return Math.round(removedForCurrentMonth * 100) / 100;
  } catch (e) {
    logger.warn("cache", "Failed removing goal allocation cache entries", e);
    return 0;
  }
}
