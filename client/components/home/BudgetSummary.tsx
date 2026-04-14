import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { formatCurrency, formatNumber } from "@/utils/helper";
import {
  useBudgets,
  useTheme,
  useTransactions,
  useUser,
} from "@/hooks/useRedux";
import type { IBudget } from "@/types/budget/types";
import { useBudgetDisplayAmounts } from "@/hooks/budget/useBudgetDisplayAmounts";

/**
 * Modern, professional budget summary component featuring:
 * - Visual status indicators (On Track, Warning, Over Budget)
 * - Color-coded progress bars with gradient fills
 * - Clear remaining amount display
 * - Smart sorting by spending status
 */
export default function BudgetSummary() {
  const { THEME } = useTheme();
  const budgets = useBudgets();
  const transactions = useTransactions();
  const user = useUser();
  const activeCurrency = user?.currency || "USD";
  const { displayBudgets } = useBudgetDisplayAmounts(
    budgets,
    transactions,
    activeCurrency,
  );

  // Calculate status and sort by priority (Over Budget → Warning → On Track)
  const budgetsWithStatus = displayBudgets.map((b: any) => {
    const spent = Number(b.displaySpent ?? b.spent ?? 0);
    const limit = Number(b.displayLimit ?? b.limit ?? 0);
    const ratio = limit > 0 ? Math.max(0, Math.min(1, spent / limit)) : 0;
    const remaining = Math.max(0, limit - spent);
    const pct = Math.round(ratio * 100);

    let status: "onTrack" | "warning" | "danger" = "onTrack";
    let statusLabel = "On Track";
    let statusColor = THEME.success;
    let statusIcon = "check-circle";

    if (limit > 0 && spent > limit) {
      status = "danger";
      statusLabel = "Over Budget";
      statusColor = THEME.danger;
      statusIcon = "alert-circle";
    } else if (pct >= 80) {
      status = "warning";
      statusLabel = "Caution";
      statusColor = THEME.warning;
      statusIcon = "alert-triangle";
    }

    return {
      ...b,
      spent,
      limit,
      ratio,
      remaining,
      pct,
      status,
      statusLabel,
      statusColor,
      statusIcon,
    };
  });

  // Sort by status priority
  const sortedBudgets = budgetsWithStatus.sort((a, b) => {
    const priority: Record<string, number> = {
      danger: 0,
      warning: 1,
      onTrack: 2,
    };
    return priority[a.status] - priority[b.status];
  });

  if (displayBudgets.length === 0) {
    return (
      <View style={{ marginBottom: 24 }}>
        <Text
          style={{
            color: THEME.textPrimary,
            fontSize: 16,
            fontWeight: "800",
            marginBottom: 16,
          }}
        >
          Budget Summary
        </Text>
        <View
          style={{
            backgroundColor: THEME.surface,
            borderRadius: 16,
            padding: 24,
            borderColor: THEME.border,
            borderWidth: 1,
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Feather
            name="inbox"
            size={40}
            color={THEME.textSecondary}
            style={{ marginBottom: 12 }}
          />
          <Text
            style={{
              color: THEME.textSecondary,
              fontSize: 14,
              fontWeight: "500",
            }}
          >
            No budgets for this month
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ marginBottom: 24 }}>
      <Text
        style={{
          color: THEME.textPrimary,
          fontSize: 16,
          fontWeight: "800",
          marginBottom: 16,
        }}
      >
        Budget Summary
      </Text>

      {sortedBudgets.slice(0, 3).map((b: any) => (
        <View
          key={b.id}
          style={{
            backgroundColor: THEME.surface,
            borderRadius: 16,
            padding: 16,
            marginBottom: 12,
            borderColor: THEME.border,
            borderWidth: 1,
            overflow: "hidden",
          }}
        >
          {/* Header with category and status */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                color: THEME.textPrimary,
                fontSize: 14,
                fontWeight: "700",
                flex: 1,
              }}
            >
              {b.category}
            </Text>

            {/* Status badge */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: `${b.statusColor}20`,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 20,
                marginLeft: 12,
              }}
            >
              <Feather name={b.statusIcon} size={12} color={b.statusColor} />
              <Text
                style={{
                  color: b.statusColor,
                  fontSize: 11,
                  fontWeight: "600",
                  marginLeft: 4,
                }}
              >
                {b.statusLabel}
              </Text>
            </View>
          </View>

          {/* Spent vs Limit row */}
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginBottom: 12,
            }}
          >
            <View>
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 12,
                  fontWeight: "500",
                  marginBottom: 2,
                }}
              >
                Spent
              </Text>
              <Text
                style={{
                  color: THEME.textPrimary,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {formatCurrency(b.spent, activeCurrency)}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 12,
                  fontWeight: "500",
                  marginBottom: 2,
                }}
              >
                Limit
              </Text>
              <Text
                style={{
                  color: THEME.textPrimary,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {formatCurrency(b.limit, activeCurrency)}
              </Text>
            </View>

            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: THEME.textSecondary,
                  fontSize: 12,
                  fontWeight: "500",
                  marginBottom: 2,
                }}
              >
                Remaining
              </Text>
              <Text
                style={{
                  color:
                    b.remaining <= 0
                      ? THEME.danger
                      : b.pct >= 80
                        ? THEME.warning
                        : THEME.success,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {formatCurrency(b.remaining, activeCurrency)}
              </Text>
            </View>
          </View>

          {/* Progress bar with percentage */}
          <View style={{ marginBottom: 8 }}>
            <View
              style={{
                height: 12,
                backgroundColor: THEME.border,
                borderRadius: 999,
                overflow: "hidden",
              }}
            >
              <View
                style={{ width: `${Math.min(b.pct, 100)}%`, height: "100%" }}
              >
                <LinearGradient
                  colors={
                    b.remaining <= 0
                      ? [THEME.danger, `${THEME.danger}80`]
                      : b.pct >= 80
                        ? [THEME.warning, `${THEME.warning}80`]
                        : [THEME.primary, THEME.secondary]
                  }
                  start={[0, 0]}
                  end={[1, 0]}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>

          {/* Percentage label */}
          <Text
            style={{
              color: THEME.textSecondary,
              fontSize: 12,
              fontWeight: "600",
              textAlign: "right",
            }}
          >
            {b.pct}% of budget spent
          </Text>
        </View>
      ))}
    </View>
  );
}
