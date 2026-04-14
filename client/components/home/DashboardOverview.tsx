import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatNumber } from "@/utils/helper";
import { useTheme, useUser } from "@/hooks/useRedux";

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
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.7)",
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
                color: "rgba(255, 255, 255, 0.8)",
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
                  color: "white",
                  fontSize: 42,
                  fontWeight: "900",
                  letterSpacing: -1,
                }}
              >
                {formatNumber(monthlyIncome)}
              </Text>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.8)",
                  fontSize: 16,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                {currency}
              </Text>
            </View>
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
                Spent This Month
              </Text>
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.95)",
                    fontSize: 24,
                    fontWeight: "700",
                  }}
                >
                  {formatNumber(totalSpent)}
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
              <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <Text
                  style={{
                    color: "rgba(255, 255, 255, 0.95)",
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
      </LinearGradient>
    </View>
  );
}
