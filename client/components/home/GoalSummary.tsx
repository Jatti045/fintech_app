import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { formatCurrency } from "@/utils/helper";
import { useAuth, useGoals, useTheme } from "@/hooks/useRedux";

/**
 * Compact list of up to 3 goals with saved/target progress.
 */
export default function GoalSummary() {
  const { THEME } = useTheme();
  const goals = useGoals();
  const { user } = useAuth();
  const currency = user?.currency || "USD";

  return (
    <View style={{ marginBottom: 16 }}>
      <Text
        style={{
          color: THEME.textPrimary,
          fontSize: 16,
          fontWeight: "800",
          marginBottom: 8,
        }}
      >
        Goal Summary
      </Text>

      {goals.length === 0 ? (
        <Text style={{ color: THEME.textSecondary }}>No active goals.</Text>
      ) : (
        goals.slice(0, 3).map((g) => {
          const saved = Number(g.progress || 0);
          const target = Number(g.target || 0);
          const ratio =
            target > 0 ? Math.max(0, Math.min(1, saved / target)) : 0;
          const pct = Math.round(ratio * 100);
          const achieved = g.achieved || Number(g.remaining || 0) <= 0;

          return (
            <View
              key={g.id}
              style={{
                backgroundColor: THEME.surface,
                padding: 12,
                borderRadius: 12,
                marginBottom: 10,
                borderColor: THEME.border,
                borderWidth: 1,
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={{ color: THEME.textPrimary, fontWeight: "700" }}>
                  {g.name}
                </Text>
                <Text style={{ color: THEME.textSecondary }}>
                  {formatCurrency(saved, currency)} /{" "}
                  {formatCurrency(target, currency)}
                </Text>
              </View>

              <View
                style={{
                  height: 8,
                  backgroundColor: THEME.border,
                  borderRadius: 999,
                  overflow: "hidden",
                  marginTop: 8,
                }}
              >
                <View style={{ width: `${pct}%`, height: "100%" }}>
                  <LinearGradient
                    colors={
                      achieved
                        ? ["#22C55E", "#16A34A"]
                        : [THEME.primary, THEME.secondary]
                    }
                    start={[0, 0]}
                    end={[1, 0]}
                    style={{ flex: 1 }}
                  />
                </View>
              </View>
            </View>
          );
        })
      )}
    </View>
  );
}
