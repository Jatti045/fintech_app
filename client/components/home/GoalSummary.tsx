import React from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { formatCurrency } from "@/utils/helper";
import { useAuth, useGoals, useTheme } from "@/hooks/useRedux";

/**
 * Modern, professional goal summary component featuring:
 * - Visual status indicators (In Progress, Almost There, Achieved)
 * - Color-coded progress bars with gradient fills
 * - Clear saved and remaining amount display
 * - Smart sorting by progress status
 */
export default function GoalSummary() {
  const { THEME } = useTheme();
  const goals = useGoals();
  const { user } = useAuth();
  const currency = user?.currency || "USD";

  // Calculate status and sort by priority (Achieved → Almost There → In Progress)
  const goalsWithStatus = goals.map((g) => {
    const saved = Number(g.progress || 0);
    const target = Number(g.target || 0);
    const ratio = target > 0 ? Math.max(0, Math.min(1, saved / target)) : 0;
    const remaining = Math.max(0, target - saved);
    const pct = Math.round(ratio * 100);
    const achieved = g.achieved || Number(g.remaining || 0) <= 0;

    let status: "achieved" | "almostThere" | "inProgress" = "inProgress";
    let statusLabel = "In Progress";
    let statusColor = THEME.primary;
    let statusIcon = "target";

    if (achieved) {
      status = "achieved";
      statusLabel = "Achieved";
      statusColor = THEME.success;
      statusIcon = "check-circle";
    } else if (pct >= 80) {
      status = "almostThere";
      statusLabel = "Almost There";
      statusColor = THEME.warning;
      statusIcon = "zap";
    }

    return {
      ...g,
      saved,
      target,
      ratio,
      remaining,
      pct,
      status,
      statusLabel,
      statusColor,
      statusIcon,
    };
  });

  // Sort by status priority (achieved first)
  const sortedGoals = goalsWithStatus.sort((a, b) => {
    const priority: Record<string, number> = {
      achieved: 0,
      almostThere: 1,
      inProgress: 2,
    };
    return priority[a.status] - priority[b.status];
  });

  if (goals.length === 0) {
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
          Goal Summary
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
            name="target"
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
            No active goals
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
        Goal Summary
      </Text>

      {sortedGoals.slice(0, 3).map((g: any) => (
        <View
          key={g.id}
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
          {/* Header with goal name and status */}
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
              {g.name}
            </Text>

            {/* Status badge */}
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                backgroundColor: `${g.statusColor}20`,
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 20,
                marginLeft: 12,
              }}
            >
              <Feather name={g.statusIcon} size={12} color={g.statusColor} />
              <Text
                style={{
                  color: g.statusColor,
                  fontSize: 11,
                  fontWeight: "600",
                  marginLeft: 4,
                }}
              >
                {g.statusLabel}
              </Text>
            </View>
          </View>

          {/* Saved vs Target row */}
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
                Saved
              </Text>
              <Text
                style={{
                  color: THEME.textPrimary,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {formatCurrency(g.saved, currency)}
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
                Target
              </Text>
              <Text
                style={{
                  color: THEME.textPrimary,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {formatCurrency(g.target, currency)}
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
                    g.remaining <= 0
                      ? THEME.success
                      : g.pct >= 80
                        ? THEME.warning
                        : THEME.primary,
                  fontSize: 16,
                  fontWeight: "700",
                }}
              >
                {formatCurrency(g.remaining, currency)}
              </Text>
            </View>
          </View>

          {/* Progress bar with gradient */}
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
                style={{ width: `${Math.min(g.pct, 100)}%`, height: "100%" }}
              >
                <LinearGradient
                  colors={
                    g.remaining <= 0
                      ? [THEME.success, `${THEME.success}80`]
                      : g.pct >= 80
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
            {g.pct}% of target reached
          </Text>
        </View>
      ))}
    </View>
  );
}
