import React, { useMemo } from "react";
import { View, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Feather } from "@expo/vector-icons";
import { formatCurrency } from "@/utils/helper";
import { useGoals, useTheme, useAuth } from "@/hooks/useRedux";

/**
 * Beautiful goals overview header featuring:
 * - Total goal targets
 * - Total allocated amount
 * - Progress towards goals
 * - Goal statistics breakdown
 */
export default function GoalOverviewHeader() {
  const { THEME } = useTheme();
  const goals = useGoals();
  const { user } = useAuth();
  const currency = user?.currency || "USD";

  // Calculate totals
  const stats = useMemo(() => {
    let totalTarget = 0;
    let totalAllocated = 0;
    let completedCount = 0;
    let inProgressCount = 0;
    let notStartedCount = 0;

    goals.forEach((goal: any) => {
      const target = Number(goal.target ?? 0);
      const allocated = Number(goal.allocated ?? 0);
      totalTarget += target;
      totalAllocated += allocated;

      if (allocated >= target) {
        completedCount++;
      } else if (allocated > 0) {
        inProgressCount++;
      } else {
        notStartedCount++;
      }
    });

    const remainingToSave = Math.max(0, totalTarget - totalAllocated);
    const overallProgressPct =
      totalTarget > 0 ? Math.min(100, (totalAllocated / totalTarget) * 100) : 0;

    return {
      totalTarget,
      totalAllocated,
      remainingToSave,
      overallProgressPct,
      completedCount,
      inProgressCount,
      notStartedCount,
      goalCount: goals.length,
    };
  }, [goals]);

  const getProgressStatus = () => {
    if (stats.overallProgressPct >= 100)
      return { label: "All Goals Met", color: THEME.success, icon: "award" };
    if (stats.overallProgressPct >= 75)
      return {
        label: "Almost There",
        color: THEME.primary,
        icon: "trending-up",
      };
    if (stats.overallProgressPct >= 50)
      return { label: "In Progress", color: THEME.warning, icon: "target" };
    return { label: "Just Started", color: THEME.secondary, icon: "flag" };
  };

  const status = getProgressStatus();

  if (stats.goalCount === 0) return null;

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
            Goals Progress
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
                Total Target
              </Text>
              <Text
                style={{
                  color: "white",
                  fontSize: 32,
                  fontWeight: "900",
                  letterSpacing: -1,
                }}
              >
                ${formatCurrency(stats.totalTarget, currency).replace("$", "")}
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
                Still Need
              </Text>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.95)",
                  fontSize: 28,
                  fontWeight: "700",
                }}
              >
                $
                {formatCurrency(stats.remainingToSave, currency).replace(
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

        {/* Allocated amount */}
        <View style={{ zIndex: 1 }}>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.7)",
              fontSize: 12,
              fontWeight: "500",
              marginBottom: 4,
            }}
          >
            Total Allocated
          </Text>
          <Text
            style={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: 24,
              fontWeight: "700",
            }}
          >
            ${formatCurrency(stats.totalAllocated, currency).replace("$", "")}
          </Text>
        </View>
      </LinearGradient>

      {/* Progress and status section */}
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
      {/*        Overall Progress*/}
      {/*      </Text>*/}
      {/*      <Text*/}
      {/*        style={{*/}
      {/*          color: THEME.textSecondary,*/}
      {/*          fontWeight: "600",*/}
      {/*          fontSize: 13,*/}
      {/*        }}*/}
      {/*      >*/}
      {/*        {Math.round(stats.overallProgressPct)}%*/}
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
      {/*          stats.overallProgressPct >= 100*/}
      {/*            ? [THEME.success, THEME.success]*/}
      {/*            : stats.overallProgressPct >= 75*/}
      {/*              ? [THEME.primary, THEME.secondary]*/}
      {/*              : stats.overallProgressPct >= 50*/}
      {/*                ? [THEME.warning, THEME.primary]*/}
      {/*                : [THEME.secondary, THEME.primary]*/}
      {/*        }*/}
      {/*        start={{ x: 0, y: 0 }}*/}
      {/*        end={{ x: 1, y: 0 }}*/}
      {/*        style={{*/}
      {/*          width: `${Math.min(stats.overallProgressPct, 100)}%`,*/}
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
      {/*        {status.label}*/}
      {/*      </Text>*/}
      {/*    </View>*/}
      {/*    <Feather name={status.icon as any} size={18} color={status.color} />*/}
      {/*  </View>*/}
      {/*</View>*/}

      {/*/!* Goal status breakdown *!/*/}
      {/*{stats.goalCount > 0 && (*/}
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
      {/*      Goal Status ({stats.goalCount})*/}
      {/*    </Text>*/}

      {/*    <View*/}
      {/*      style={{ flexDirection: "row", justifyContent: "space-around" }}*/}
      {/*    >*/}
      {/*      /!* Completed *!/*/}
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
      {/*            {stats.completedCount}*/}
      {/*          </Text>*/}
      {/*        </View>*/}
      {/*        <Text*/}
      {/*          style={{*/}
      {/*            color: THEME.textSecondary,*/}
      {/*            fontSize: 12,*/}
      {/*            fontWeight: "500",*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          Completed*/}
      {/*        </Text>*/}
      {/*      </View>*/}

      {/*      /!* In Progress *!/*/}
      {/*      <View style={{ alignItems: "center" }}>*/}
      {/*        <View*/}
      {/*          style={{*/}
      {/*            width: 60,*/}
      {/*            height: 60,*/}
      {/*            borderRadius: 12,*/}
      {/*            backgroundColor: `${THEME.primary}20`,*/}
      {/*            justifyContent: "center",*/}
      {/*            alignItems: "center",*/}
      {/*            marginBottom: 8,*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <Text*/}
      {/*            style={{*/}
      {/*              color: THEME.primary,*/}
      {/*              fontSize: 24,*/}
      {/*              fontWeight: "700",*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            {stats.inProgressCount}*/}
      {/*          </Text>*/}
      {/*        </View>*/}
      {/*        <Text*/}
      {/*          style={{*/}
      {/*            color: THEME.textSecondary,*/}
      {/*            fontSize: 12,*/}
      {/*            fontWeight: "500",*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          In Progress*/}
      {/*        </Text>*/}
      {/*      </View>*/}

      {/*      /!* Not Started *!/*/}
      {/*      <View style={{ alignItems: "center" }}>*/}
      {/*        <View*/}
      {/*          style={{*/}
      {/*            width: 60,*/}
      {/*            height: 60,*/}
      {/*            borderRadius: 12,*/}
      {/*            backgroundColor: `${THEME.textSecondary}20`,*/}
      {/*            justifyContent: "center",*/}
      {/*            alignItems: "center",*/}
      {/*            marginBottom: 8,*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          <Text*/}
      {/*            style={{*/}
      {/*              color: THEME.textSecondary,*/}
      {/*              fontSize: 24,*/}
      {/*              fontWeight: "700",*/}
      {/*            }}*/}
      {/*          >*/}
      {/*            {stats.notStartedCount}*/}
      {/*          </Text>*/}
      {/*        </View>*/}
      {/*        <Text*/}
      {/*          style={{*/}
      {/*            color: THEME.textSecondary,*/}
      {/*            fontSize: 12,*/}
      {/*            fontWeight: "500",*/}
      {/*          }}*/}
      {/*        >*/}
      {/*          Not Started*/}
      {/*        </Text>*/}
      {/*      </View>
          </View>
        </View>
      )} */}
    </View>
  );
}
