import React from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";
import type { IGoal } from "@/types/goal/types";
import { formatCurrency } from "@/utils/helper";
import { hapticHeavy, hapticLight } from "@/utils/haptics";
import SwipeableRow from "@/components/global/SwipeableRow";
import useGoalOperation from "@/hooks/goal/useGoalOperation";
import {useTheme} from "@/hooks/useRedux";

export interface GoalBudgetCardProps {
  goal: IGoal;
  currency: string;
  onEdit: (goal: IGoal) => void;
  onAllocate: (goal: IGoal) => void;
  onDeallocate: (goal: IGoal) => void;
}

const GoalBudgetCard = React.memo(function GoalBudgetCard({
  goal,
  currency,
  onEdit,
  onAllocate,
  onDeallocate,
}: GoalBudgetCardProps) {
  const {THEME} = useTheme();
  const target = Number(goal.target || 0);
  const progress = Number(goal.progress || 0);
  const remaining = Number(goal.remaining || 0);
  const ratio = target > 0 ? Math.max(0, Math.min(1, progress / target)) : 0;
  const percent = Math.round(ratio * 100);
  const achieved = goal.achieved || remaining <= 0;
  const safeIconName = (goal.icon || "flag") as keyof typeof Feather.glyphMap;

  const {handleDeleteGoal} = useGoalOperation();


  return (
    <SwipeableRow
      onDelete={() => handleDeleteGoal(goal)}
      dangerColor={THEME.danger}
      actionStyle={{ marginBottom: 16, borderRadius: 16 }}
    >
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => {
          hapticLight();
          onEdit(goal);
        }}
        onLongPress={() => {
          hapticHeavy();
          handleDeleteGoal(goal);
        }}
      >
        <View
          style={{
            backgroundColor: THEME.surface,
            borderColor: THEME.border,
            borderWidth: 1,
            shadowOffset: { width: 0, height: 6 },
            shadowOpacity: 0.06,
            shadowRadius: 12,
            elevation: 6,
          }}
          className="p-4 mb-4 rounded-2xl"
        >
          <View className="flex-row justify-between items-start">
            <View style={{ flex: 1 }}>
              <Text style={{ color: THEME.textSecondary }} className="text-sm">
                Goal target
              </Text>
              <Text
                style={{ color: THEME.textPrimary }}
                className="text-2xl font-extrabold mt-1"
              >
                {formatCurrency(target, currency)}
              </Text>

              <Text style={{ color: THEME.textSecondary }} className="mt-2 text-sm">
                {goal.name}
              </Text>

              <View className="flex-row items-center mt-2">
                <Text style={{ color: THEME.textSecondary }} className="text-sm">
                  Saved {formatCurrency(progress, currency)}
                </Text>
                {achieved && (
                  <View
                    className="ml-3 px-2 py-1 rounded-full"
                    style={{ backgroundColor: "#DCFCE7" }}
                  >
                    <Text
                      style={{ color: "#16A34A" }}
                      className="text-xs font-bold"
                    >
                      Done
                    </Text>
                  </View>
                )}
              </View>
            </View>

            <View className="items-center ml-4">
              <Feather name={safeIconName} size={52} color={THEME.secondary} />
              <View
                className="mt-2 px-2 py-1 rounded-md"
                style={{ backgroundColor: THEME.background }}
              >
                <Text style={{ color: THEME.textSecondary }} className="font-bold">
                  {percent}%
                </Text>
              </View>
            </View>
          </View>

          <View
            className="mt-4 rounded-full overflow-hidden"
            style={{ backgroundColor: THEME.border, height: 12 }}
          >
            <View style={{ flexDirection: "row", width: "100%", height: 12 }}>
              <LinearGradient
                colors={
                  achieved ? ["#22C55E", "#16A34A"] : [THEME.primary, THEME.secondary]
                }
                start={[0, 0]}
                end={[1, 0]}
                style={{ flex: ratio }}
              />
              <View style={{ flex: 1 - ratio }} />
            </View>
          </View>

          <View className="mt-3 flex-row items-center justify-between">
            <Text style={{ color: THEME.textSecondary }} className="text-sm">
              Remaining {formatCurrency(Math.max(remaining, 0), currency)}
            </Text>

            <View
              style={{ flexDirection: "row", alignItems: "center", gap: 8 }}
            >
              <TouchableOpacity
                onPress={() => onDeallocate(goal)}
                activeOpacity={0.9}
                style={{
                  borderColor: THEME.primary,
                  borderWidth: 1,
                  paddingVertical: 8,
                  paddingHorizontal: 12,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: THEME.primary, fontWeight: "700" }}>
                  Withdraw
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => onAllocate(goal)}
                activeOpacity={0.9}
                style={{
                  backgroundColor: THEME.primary,
                  paddingVertical: 8,
                  paddingHorizontal: 14,
                  borderRadius: 10,
                }}
              >
                <Text style={{ color: THEME.textPrimary, fontWeight: "700" }}>
                  Allocate
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    </SwipeableRow>
  );
});

export default GoalBudgetCard;
