import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { formatCurrency } from "@/utils/helper";
import {
  useBudgets,
  useTheme,
  useTransactions,
  useUser,
} from "@/hooks/useRedux";
import { useBudgetDisplayAmounts } from "@/hooks/budget/useBudgetDisplayAmounts";

/**
 * Beautiful budget overview header featuring:
 * - Total budget limit across all categories
 * - Total spent this month
 * - Remaining budget available
 * - Budget utilization stats
 */
export default function BudgetOverviewHeader() {
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

  // Calculate totals
  const stats = useMemo(() => {
    let totalLimit = 0;
    let totalSpent = 0;
    let onTrack = 0;
    let warning = 0;
    let danger = 0;

    displayBudgets.forEach((b: any) => {
      const limit = Number(b.displayLimit ?? b.limit ?? 0);
      const spent = Number(b.displaySpent ?? b.spent ?? 0);
      totalLimit += limit;
      totalSpent += spent;

      if (limit <= 0) return;
      const ratio = spent / limit;
      if (ratio <= 0.8) onTrack++;
      else if (ratio <= 1.0) warning++;
      else danger++;
    });

    const remaining = Math.max(0, totalLimit - totalSpent);
    const utilizationPct =
      totalLimit > 0 ? Math.min(100, (totalSpent / totalLimit) * 100) : 0;

    return {
      totalLimit,
      totalSpent,
      remaining,
      utilizationPct,
      onTrack,
      warning,
      danger,
      budgetCount: displayBudgets.length,
    };
  }, [displayBudgets]);

  const getUtilizationStatus = () => {
    if (stats.utilizationPct <= 50)
      return { label: "Excellent", color: THEME.success, icon: "trending-up" };
    if (stats.utilizationPct <= 75)
      return { label: "Good", color: THEME.primary, icon: "minus" };
    if (stats.utilizationPct <= 100)
      return { label: "Caution", color: THEME.warning, icon: "alert-circle" };
    return { label: "Over Budget", color: THEME.danger, icon: "trending-down" };
  };

  const status = getUtilizationStatus();

  if (stats.budgetCount === 0) return null;

  return (
    <View style={{ marginBottom: 24 }}>
      {/* Main gradient card */}
      <LinearGradient
        colors={[THEME.primary, THEME.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 24,
          overflow: "hidden",
          marginBottom: 16,
        }}
      >
        {/* Decorative elements */}
        <View
          style={{
            position: "absolute",
            width: 200,
            height: 200,
            borderRadius: 100,
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            top: -50,
            right: -50,
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 150,
            height: 150,
            borderRadius: 75,
            backgroundColor: "rgba(255, 255, 255, 0.05)",
            bottom: -30,
            left: -40,
          }}
        />

        {/* Header */}
        <View style={{ zIndex: 1, marginBottom: 24 }}>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 12,
              fontWeight: "600",
              marginBottom: 8,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Monthly Budget Overview
          </Text>

          {/* Main metrics row */}
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <View>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: 12,
                  fontWeight: "500",
                  marginBottom: 4,
                }}
              >
                Total Limit
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 32,
                  fontWeight: "900",
                  letterSpacing: -1,
                }}
              >
                $
                {formatCurrency(stats.totalLimit, activeCurrency).replace(
                  "$",
                  "",
                )}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: 12,
                  fontWeight: "500",
                  marginBottom: 4,
                }}
              >
                Remaining
              </Text>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.95)",
                  fontSize: 28,
                  fontWeight: "700",
                }}
              >
                $
                {formatCurrency(stats.remaining, activeCurrency).replace(
                  "$",
                  "",
                )}
              </Text>
            </View>
          </View>
        </View>

        {/* Divider */}
        <View
          style={{
            height: 1,
            backgroundColor: "rgba(255, 255, 255, 0.2)",
            marginBottom: 16,
            zIndex: 1,
          }}
        />

        {/* Spent amount */}
        <View style={{ zIndex: 1 }}>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 12,
              fontWeight: "500",
              marginBottom: 4,
            }}
          >
            Total Spent
          </Text>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 24,
              fontWeight: "700",
            }}
          >
            ${formatCurrency(stats.totalSpent, activeCurrency).replace("$", "")}
          </Text>
        </View>
      </LinearGradient>

      {/* Utilization and stats section */}
      {/*<View*/}
      {/*  style={{*/}
      {/*    backgroundColor: THEME.surface,*/}
      {/*    borderRadius: 20,*/}
      {/*    padding: 20,*/}
      {/*    borderColor: THEME.border,*/}
      {/*    borderWidth: 1,*/}
      {/*  }}*/}
      {/*>*/}
      {/*  /!* Progress bar *!/*/}
      {/*  <View style={{ marginBottom: 20 }}>*/}
      {/*    <View*/}
      {/*      style={{*/}
      {/*        flexDirection: "row",*/}
      {/*        justifyContent: "space-between",*/}
      {/*        marginBottom: 10,*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <Text*/}
      {/*        style={{*/}
      {/*          color: THEME.textPrimary,*/}
      {/*          fontWeight: "700",*/}
      {/*          fontSize: 14,*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        Budget Utilization*/}
      {/*      </Text>*/}
      {/*      <Text*/}
      {/*        style={{*/}
      {/*          color: THEME.textSecondary,*/}
      {/*          fontWeight: "600",*/}
      {/*          fontSize: 13,*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        {Math.round(stats.utilizationPct)}%*/}
      {/*      </Text>*/}
      {/*    </View>*/}

      {/*    <View*/}
      {/*      style={{*/}
      {/*        height: 10,*/}
      {/*        backgroundColor: THEME.border,*/}
      {/*        borderRadius: 999,*/}
      {/*        overflow: "hidden",*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      <LinearGradient*/}
      {/*        colors={*/}
      {/*          stats.utilizationPct > 100*/}
      {/*            ? [THEME.danger, THEME.warning]*/}
      {/*            : stats.utilizationPct > 75*/}
      {/*              ? [THEME.warning, THEME.primary]*/}
      {/*              : [THEME.primary, THEME.secondary]*/}
      {/*        }*/}
      {/*        start={{ x: 0, y: 0 }}*/}
      {/*        end={{ x: 1, y: 0 }}*/}
      {/*        style={{*/}
      {/*          width: `${Math.min(stats.utilizationPct, 100)}%`,*/}
      {/*          height: "100%",*/}
      {/*        }}*/}
      {/*      />*/}
      {/*    </View>*/}
      {/*  </View>*/}

      {/*  /!* Status row *!/*/}
      {/*  <View*/}
      {/*    style={{*/}
      {/*      flexDirection: "row",*/}
      {/*      alignItems: "center",*/}
      {/*      justifyContent: "space-between",*/}
      {/*      paddingTop: 16,*/}
      {/*      borderTopColor: THEME.border,*/}
      {/*      borderTopWidth: 1,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <View style={{ flexDirection: "row", alignItems: "center" }}>*/}
      {/*      <View*/}
      {/*        style={{*/}
      {/*          width: 12,*/}
      {/*          height: 12,*/}
      {/*          borderRadius: 6,*/}
      {/*          backgroundColor: status.color,*/}
      {/*          marginRight: 10,*/}
      {/*        }}*/}
      {/*      />*/}
      {/*      <Text*/}
      {/*        style={{*/}
      {/*          color: THEME.textPrimary,*/}
      {/*          fontWeight: "700",*/}
      {/*          fontSize: 14,*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        Status: {status.label}*/}
      {/*      </Text>*/}
      {/*    </View>*/}
      {/*    <Feather name={status.icon as any} size={18} color={status.color} />*/}
      {/*  </View>*/}
      {/*</View>*/}

      {/*/!* Category breakdown stats *!/*/}
      {/*{stats.budgetCount > 0 && (*/}
      {/*  <View*/}
      {/*    style={{*/}
      {/*      backgroundColor: THEME.surface,*/}
      {/*      borderRadius: 20,*/}
      {/*      padding: 20,*/}
      {/*      borderColor: THEME.border,*/}
      {/*      borderWidth: 1,*/}
      {/*      marginTop: 16,*/}
      {/*    }}*/}
      {/*  >*/}
      {/*    <Text*/}
      {/*      style={{*/}
      {/*        color: THEME.textPrimary,*/}
      {/*        fontWeight: "700",*/}
      {/*        fontSize: 14,*/}
      {/*        marginBottom: 16,*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      Category Status ({stats.budgetCount})*/}
      {/*    </Text>*/}

      {/*    <View*/}
      {/*      style={{ flexDirection: "row", justifyContent: "space-around" }}*/}
      {/*    >*/}
      {/*      /!* On Track *!/*/}
      {/*      <View style={{ alignItems: "center" }}>*/}
      {/*        <View*/}
      {/*          style={{*/}
      {/*            width: 60,*/}
      {/*            height: 60,*/}
      {/*            borderRadius: 12,*/}
      {/*            backgroundColor: `${THEME.success}20`,*/}
      {/*            justifyContent: "center",*/}
      {/*            alignItems: "center",*/}
      {/*            marginBottom: 8,*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <Text*/}
      {/*            style={{*/}
      {/*              color: THEME.success,*/}
      {/*              fontSize: 24,*/}
      {/*              fontWeight: "700",*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            {stats.onTrack}*/}
      {/*          </Text>*/}
      {/*        </View>*/}
      {/*        <Text*/}
      {/*          style={{*/}
      {/*            color: THEME.textSecondary,*/}
      {/*            fontSize: 12,*/}
      {/*            fontWeight: "500",*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          On Track*/}
      {/*        </Text>*/}
      {/*      </View>*/}

      {/*      /!* Warning *!/*/}
      {/*      <View style={{ alignItems: "center" }}>*/}
      {/*        <View*/}
      {/*          style={{*/}
      {/*            width: 60,*/}
      {/*            height: 60,*/}
      {/*            borderRadius: 12,*/}
      {/*            backgroundColor: `${THEME.warning}20`,*/}
      {/*            justifyContent: "center",*/}
      {/*            alignItems: "center",*/}
      {/*            marginBottom: 8,*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <Text*/}
      {/*            style={{*/}
      {/*              color: THEME.warning,*/}
      {/*              fontSize: 24,*/}
      {/*              fontWeight: "700",*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            {stats.warning}*/}
      {/*          </Text>*/}
      {/*        </View>*/}
      {/*        <Text*/}
      {/*          style={{*/}
      {/*            color: THEME.textSecondary,*/}
      {/*            fontSize: 12,*/}
      {/*            fontWeight: "500",*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          Warning*/}
      {/*        </Text>*/}
      {/*      </View>*/}

      {/*      /!* Danger *!/*/}
      {/*      <View style={{ alignItems: "center" }}>*/}
      {/*        <View*/}
      {/*          style={{*/}
      {/*            width: 60,*/}
      {/*            height: 60,*/}
      {/*            borderRadius: 12,*/}
      {/*            backgroundColor: `${THEME.danger}20`,*/}
      {/*            justifyContent: "center",*/}
      {/*            alignItems: "center",*/}
      {/*            marginBottom: 8,*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <Text*/}
      {/*            style={{*/}
      {/*              color: THEME.danger,*/}
      {/*              fontSize: 24,*/}
      {/*              fontWeight: "700",*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            {stats.danger}*/}
      {/*          </Text>*/}
      {/*        </View>*/}
      {/*        <Text*/}
      {/*          style={{*/}
      {/*            color: THEME.textSecondary,*/}
      {/*            fontSize: 12,*/}
      {/*            fontWeight: "500",*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          Over Budget*/}
      {/*        </Text>*/}
      {/*      </View>*/}
      {/*    </View>
        </View>
      )} */}
    </View>
  );
}
