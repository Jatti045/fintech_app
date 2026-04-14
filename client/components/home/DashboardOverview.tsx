import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { formatNumber, formatCurrency } from "@/utils/helper";
import { useBudgets, useTheme, useUser } from "@/hooks/useRedux";

type Props = {
  monthlyIncome: number;
  totalSpent: number;
  monthLabel: string;
};

/**
 * Beautiful modern dashboard overview component featuring:
 * - Monthly income display with gradient background
 * - Amount spent with visual feedback
 * - Remaining budget calculation
 * - Budget health indicator
 */
export default function DashboardOverview({
  monthlyIncome,
  totalSpent,
  monthLabel,
}: Props) {
  const { THEME } = useTheme();
  const user = useUser();
  const budgets = useBudgets();
  const currency = user?.currency || "USD";
  const screenWidth = Dimensions.get("window").width;

  // Calculate remaining budget
  const remaining = monthlyIncome - totalSpent;
  const spendPercentage =
    monthlyIncome > 0 ? Math.min(100, (totalSpent / monthlyIncome) * 100) : 0;

  // Determine health status
  const getHealthStatus = () => {
    if (spendPercentage <= 50) return { label: "Excellent", color: THEME.success };
    if (spendPercentage <= 75) return { label: "Good", color: THEME.primary };
    if (spendPercentage <= 100) return { label: "Caution", color: THEME.warning };
    return { label: "Over Budget", color: THEME.danger };
  };

  const healthStatus = getHealthStatus();

  // Calculate budget summary stats
  const budgetStats = useMemo(() => {
    if (budgets.length === 0) return { onTrack: 0, warning: 0, danger: 0 };
    
    let onTrack = 0;
    let warning = 0;
    let danger = 0;

    budgets.forEach((b) => {
      const spent = Number(b.spent || 0);
      const limit = Number(b.limit || 0);
      if (limit <= 0) return;
      
      const ratio = spent / limit;
      if (ratio <= 0.8) onTrack++;
      else if (ratio <= 1.0) warning++;
      else danger++;
    });

    return { onTrack, warning, danger };
  }, [budgets]);

  return (
    <View style={{ marginBottom: 24 }}>
      {/* Main gradient hero card */}
      <LinearGradient
        colors={[THEME.primary, THEME.secondary]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 24,
          padding: 24,
          marginBottom: 16,
          overflow: "hidden",
        }}
      >
        {/* Decorative blur elements */}
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

        {/* Month label */}
        <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 13, fontWeight: "600", marginBottom: 8 }}>
          {monthLabel.toUpperCase()}
        </Text>

        {/* Main content */}
        <View style={{ zIndex: 1 }}>
          {/* Income section */}
          <View style={{ marginBottom: 24 }}>
            <Text style={{ color: "rgba(255, 255, 255, 0.8)", fontSize: 13, fontWeight: "500", marginBottom: 6 }}>
              Monthly Income
            </Text>
            <Text
              style={{
                color: "white",
                fontSize: 42,
                fontWeight: "900",
                letterSpacing: -1,
              }}
            >
              ${formatNumber(monthlyIncome)}
            </Text>
          </View>

          {/* Divider */}
          <View
            style={{
              height: 1,
              backgroundColor: "rgba(255, 255, 255, 0.2)",
              marginBottom: 24,
            }}
          />

          {/* Spent vs Remaining */}
          <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
            <View>
              <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 12, fontWeight: "500", marginBottom: 4 }}>
                Spent This Month
              </Text>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.95)",
                  fontSize: 24,
                  fontWeight: "700",
                }}
              >
                ${formatNumber(totalSpent)}
              </Text>
            </View>
            <View style={{ alignItems: "flex-end" }}>
              <Text style={{ color: "rgba(255, 255, 255, 0.7)", fontSize: 12, fontWeight: "500", marginBottom: 4 }}>
                Remaining
              </Text>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.95)",
                  fontSize: 24,
                  fontWeight: "700",
                }}
              >
                ${formatNumber(Math.max(0, remaining))}
              </Text>
            </View>
          </View>
        </View>
      </LinearGradient>

      {/* Progress bar section */}
      <View
        style={{
          backgroundColor: THEME.surface,
          borderRadius: 20,
          padding: 20,
          borderColor: THEME.border,
          borderWidth: 1,
          marginBottom: 16,
        }}
      >
        {/* Spending progress */}
        <View style={{ marginBottom: 20 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 10 }}>
            <Text style={{ color: THEME.textPrimary, fontWeight: "700", fontSize: 14 }}>
              Spending Progress
            </Text>
            <Text style={{ color: THEME.textSecondary, fontWeight: "600", fontSize: 13 }}>
              {Math.round(spendPercentage)}%
            </Text>
          </View>

          {/* Animated progress bar */}
          <View
            style={{
              height: 10,
              backgroundColor: THEME.border,
              borderRadius: 999,
              overflow: "hidden",
            }}
          >
            <LinearGradient
              colors={
                spendPercentage > 100
                  ? [THEME.danger, THEME.warning]
                  : spendPercentage > 75
                  ? [THEME.warning, THEME.primary]
                  : [THEME.primary, THEME.secondary]
              }
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{
                width: `${Math.min(spendPercentage, 100)}%`,
                height: "100%",
              }}
            />
          </View>
        </View>

        {/* Health status */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            paddingTop: 16,
            borderTopColor: THEME.border,
            borderTopWidth: 1,
          }}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <View
              style={{
                width: 12,
                height: 12,
                borderRadius: 6,
                backgroundColor: healthStatus.color,
                marginRight: 10,
              }}
            />
            <Text style={{ color: THEME.textPrimary, fontWeight: "700", fontSize: 14 }}>
              Status: {healthStatus.label}
            </Text>
          </View>
          <Feather
            name={
              spendPercentage <= 50
                ? "trending-up"
                : spendPercentage <= 100
                ? "minus"
                : "alert-circle"
            }
            size={18}
            color={healthStatus.color}
          />
        </View>
      </View>

      {/* Budget summary stats */}
      {budgets.length > 0 && (
        <View
          style={{
            backgroundColor: THEME.surface,
            borderRadius: 20,
            padding: 20,
            borderColor: THEME.border,
            borderWidth: 1,
          }}
        >
          <Text
            style={{
              color: THEME.textPrimary,
              fontWeight: "700",
              fontSize: 14,
              marginBottom: 16,
            }}
          >
            Budget Overview
          </Text>

          <View style={{ flexDirection: "row", justifyContent: "space-around" }}>
            {/* On Track */}
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  backgroundColor: `${THEME.success}20`,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: THEME.success,
                    fontSize: 24,
                    fontWeight: "700",
                  }}
                >
                  {budgetStats.onTrack}
                </Text>
              </View>
              <Text style={{ color: THEME.textSecondary, fontSize: 12, fontWeight: "500" }}>
                On Track
              </Text>
            </View>

            {/* Warning */}
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  backgroundColor: `${THEME.warning}20`,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: THEME.warning,
                    fontSize: 24,
                    fontWeight: "700",
                  }}
                >
                  {budgetStats.warning}
                </Text>
              </View>
              <Text style={{ color: THEME.textSecondary, fontSize: 12, fontWeight: "500" }}>
                Warning
              </Text>
            </View>

            {/* Danger */}
            <View style={{ alignItems: "center" }}>
              <View
                style={{
                  width: 60,
                  height: 60,
                  borderRadius: 12,
                  backgroundColor: `${THEME.danger}20`,
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    color: THEME.danger,
                    fontSize: 24,
                    fontWeight: "700",
                  }}
                >
                  {budgetStats.danger}
                </Text>
              </View>
              <Text style={{ color: THEME.textSecondary, fontSize: 12, fontWeight: "500" }}>
                Over Budget
              </Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}
