import React from "react";
import { Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import MaskedView from "@react-native-masked-view/masked-view";

export interface EmptyGoalStateProps {
  primary: string;
  secondary: string;
  textPrimary: string;
  textSecondary: string;
}

const EmptyGoalState = React.memo(function EmptyGoalState({
  primary,
  secondary,
  textPrimary,
  textSecondary,
}: EmptyGoalStateProps) {
  return (
    <View className="flex-1 justify-center items-center px-6 pt-12">
      <MaskedView
        maskElement={
          <Text
            className="text-3xl font-extrabold text-center"
            style={{ color: textPrimary }}
          >
            No goals yet
          </Text>
        }
      >
        <LinearGradient
          colors={[primary, secondary]}
          start={[0, 0]}
          end={[1, 1]}
        >
          <Text
            className="text-3xl font-extrabold text-center"
            style={{ opacity: 0 }}
          >
            No goals yet
          </Text>
        </LinearGradient>
      </MaskedView>

      <Text
        className="text-center mt-4 text-base"
        style={{ color: textSecondary }}
      >
        Create goals to save for milestones and track your progress over time.
        Tap "New Goal" to get started.
      </Text>
    </View>
  );
});

export default EmptyGoalState;
