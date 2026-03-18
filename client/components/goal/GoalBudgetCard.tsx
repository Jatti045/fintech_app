import React from "react";
import { Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { Text, TouchableOpacity, View } from "react-native";
import type { IGoal } from "@/types/goal/types";
import { formatCurrency } from "@/utils/helper";
import { hapticHeavy, hapticLight } from "@/utils/haptics";
import SwipeableRow from "@/components/global/SwipeableRow";

export interface GoalBudgetCardProps {
  goal: IGoal;
  currency: string;
  onEdit: (goal: IGoal) => void;
  onDelete: (goal: IGoal) => void;
  onAllocate: (goal: IGoal) => void;
  surface: string;
  border: string;
  background: string;
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
  danger: string;
}

const GoalBudgetCard = React.memo(function GoalBudgetCard({
  goal,
  currency,
  onEdit,
  onDelete,
  onAllocate,
  surface,
  border,
  background,
  primary,
  secondary,
  textPrimary,
  textSecondary,
  danger,
}: GoalBudgetCardProps) {
  const target = Number(goal.target || 0);
  const progress = Number(goal.progress || 0);
  const remaining = Number(goal.remaining || 0);

  const ratio = target > 0 ? Math.max(0, Math.min(1, progress / target)) : 0;
  const percent = Math.round(ratio * 100);
  const achieved = goal.achieved || remaining <= 0;
  const safeIconName = (goal.icon || "flag") as keyof typeof Feather.glyphMap;

  return (
    <SwipeableRow
      onDelete={() => onDelete(goal)}
      dangerColor={danger}
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
          onDelete(goal);
        }}
      >
        <View
          style={{
            backgroundColor: surface,
            borderColor: border,
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
              <Text style={{ color: textSecondary }} className="text-sm">
                Goal target
              </Text>
              <Text
                style={{ color: textPrimary }}
                className="text-2xl font-extrabold mt-1"
              >
                {formatCurrency(target, currency)}
              </Text>

              <Text style={{ color: textSecondary }} className="mt-2 text-sm">
                {goal.name}
              </Text>

              <View className="flex-row items-center mt-2">
                <Text style={{ color: textSecondary }} className="text-sm">
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
              <Feather name={safeIconName} size={52} color={secondary} />
              <View
                className="mt-2 px-2 py-1 rounded-md"
                style={{ backgroundColor: background }}
              >
                <Text style={{ color: textSecondary }} className="font-bold">
                  {percent}%
                </Text>
              </View>
            </View>
          </View>

          <View
            className="mt-4 rounded-full overflow-hidden"
            style={{ backgroundColor: border, height: 12 }}
          >
            <View style={{ flexDirection: "row", width: "100%", height: 12 }}>
              <LinearGradient
                colors={
                  achieved ? ["#22C55E", "#16A34A"] : [primary, secondary]
                }
                start={[0, 0]}
                end={[1, 0]}
                style={{ flex: ratio }}
              />
              <View style={{ flex: 1 - ratio }} />
            </View>
          </View>

          <View className="mt-3 flex-row items-center justify-between">
            <Text style={{ color: textSecondary }} className="text-sm">
              Remaining {formatCurrency(Math.max(remaining, 0), currency)}
            </Text>

            <TouchableOpacity
              onPress={() => onAllocate(goal)}
              activeOpacity={0.9}
              style={{
                backgroundColor: primary,
                paddingVertical: 8,
                paddingHorizontal: 14,
                borderRadius: 10,
              }}
            >
              <Text style={{ color: textPrimary, fontWeight: "700" }}>
                Allocate
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </TouchableOpacity>
    </SwipeableRow>
  );
});

export default GoalBudgetCard;
