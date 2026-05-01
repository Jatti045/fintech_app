import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatNumber } from "@/utils/helper";
import { useTheme, useUser } from "@/hooks/useRedux";
import {BlurView} from "expo-blur";

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
  const currency = user?.currency || "USD";

  // Calculate remaining budget
  const remaining = monthlyIncome - totalSpent;

  return (

      <View>
        <View style={{ marginBottom: 24 }}>
        {/* Month label */}
        <Text
          style={{
            color: THEME.textSecondary,
            fontSize: 13,
            fontWeight: "600",
            marginBottom: 8,
          }}
        >
          {monthLabel.toUpperCase()}
        </Text>

        {/* Main content */}
        <View style={{ zIndex: 1 }}>
          {/* Income section */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: THEME.textPrimary,
                fontSize: 13,
                fontWeight: "500",
                marginBottom: 6,
              }}
            >
              Monthly Income
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
              <Text
                style={{
                  color: THEME.textPrimary,
                  fontSize: 42,
                  fontWeight: "900",
                  letterSpacing: -1,
                }}
              >
                {formatNumber(monthlyIncome)}
              </Text>
              <Text
                style={{
                  color: THEME.textPrimary,
                  fontSize: 16,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                {currency}
              </Text>
            </View>
          </View>
        </View>
    </View>
    <View style={{ marginBottom: 24 }}>

                {/* Spent vs Remaining */}
                <View
                    style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                    <View>
                        <Text
                            style={{
                                color: THEME.textSecondary,
                                fontSize: 12,
                                fontWeight: "500",
                                marginBottom: 4,
                            }}
                        >
                            Spent This Month
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                            <Text
                                style={{
                                    color: THEME.textPrimary,
                                    fontSize: 24,
                                    fontWeight: "700",
                                }}
                            >
                                {formatNumber(totalSpent)}
                            </Text>
                            <Text
                                style={{
                                    color: THEME.textPrimary,
                                    fontSize: 12,
                                    fontWeight: "600",
                                    marginLeft: 6,
                                }}
                            >
                                {currency}
                            </Text>
                        </View>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text
                            style={{
                                color: THEME.textSecondary,
                                fontSize: 12,
                                fontWeight: "500",
                                marginBottom: 4,
                            }}
                        >
                            Remaining
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                            <Text
                                style={{
                                    color: THEME.textPrimary,
                                    fontSize: 24,
                                    fontWeight: "700",
                                }}
                            >
                                {formatNumber(Math.max(0, remaining))}
                            </Text>
                            <Text
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    fontSize: 12,
                                    fontWeight: "600",
                                    marginLeft: 6,
                                }}
                            >
                                {currency}
                            </Text>
                        </View>
                    </View>
                </View>
        </View>
      </View>
  );
}
