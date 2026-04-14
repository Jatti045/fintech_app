import React from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { getModalHeight, MODAL_BORDER_RADIUS } from "@/constants/appConfig";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks/useRedux";
import ModalCloseButton from "@/components/global/modalCloseButton";
import IconSelectorModal from "@/components/budget/IconSelectorModal";
import type { IGoal } from "@/types/goal/types";

interface GoalModalProps {
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
  editingGoal: IGoal | null;
  goalName: string;
  setGoalName: (val: string) => void;
  goalTarget: string;
  setGoalTarget: (val: string) => void;
  goalIcon: string;
  setGoalIcon: (val: string) => void;
  onSubmit: () => void;
  saving: boolean;
}

function GoalModal({
  openSheet,
  setOpenSheet,
  editingGoal,
  goalName,
  setGoalName,
  goalTarget,
  setGoalTarget,
  goalIcon,
  setGoalIcon,
  onSubmit,
  saving,
}: GoalModalProps) {
  const { THEME } = useTheme();
  const [openIconSelector, setOpenIconSelector] = React.useState(false);
  const modalHeight = getModalHeight();

  return (
    <Modal
      visible={openSheet}
      animationType="slide"
      presentationStyle="pageSheet"
      transparent
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.5)",
        }}
      >
        <SafeAreaView
          style={{
            height: modalHeight,
            backgroundColor: THEME.background,
            padding: 18,
            position: "relative",
            borderTopLeftRadius: MODAL_BORDER_RADIUS,
            borderTopRightRadius: MODAL_BORDER_RADIUS,
            overflow: "hidden",
          }}
        >
          <View className="relative mb-4">
            <ModalCloseButton setOpenSheet={setOpenSheet} />
          </View>

          <View className="items-center justify-center relative mb-4">
            <Text
              style={{ color: THEME.textPrimary }}
              className="text-lg text-center font-bold"
            >
              {editingGoal ? "Update Goal" : "Create Goal"}
            </Text>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <View className="mt-4">
              <Text style={{ color: THEME.textSecondary }} className="mb-2">
                Goal Name
              </Text>
              <TextInput
                value={goalName}
                onChangeText={setGoalName}
                placeholder="e.g., Emergency Fund"
                placeholderTextColor={THEME.placeholderText}
                accessibilityLabel="Goal name"
                className="py-3 px-3 rounded-md"
                style={{
                  backgroundColor: THEME.inputBackground,
                  color: THEME.textPrimary,
                }}
              />
              <Text
                style={{ color: THEME.placeholderText }}
                className="mt-1 text-sm"
              >
                Tip: Keep it short and specific (e.g., "Emergency Fund").
              </Text>
            </View>

            <View className="mt-4">
              <Text style={{ color: THEME.textSecondary }} className="mb-2">
                Goal Icon
              </Text>
              <TouchableOpacity
                onPress={() => setOpenIconSelector(true)}
                className="py-3 px-3 rounded-md"
                style={{
                  backgroundColor: THEME.inputBackground,
                }}
              >
                <Text
                  style={{
                    color:
                      goalIcon === "" ? THEME.textSecondary : THEME.textPrimary,
                  }}
                >
                  {goalIcon === "" ? "Choose an icon" : goalIcon}
                </Text>
              </TouchableOpacity>
              <Text
                style={{ color: THEME.placeholderText }}
                className="mt-1 text-sm"
              >
                Tip: Pick an icon so you can spot this goal faster.
              </Text>
            </View>

            {openIconSelector && (
              <IconSelectorModal
                openIconSelector={openIconSelector}
                setOpenIconSelector={setOpenIconSelector}
                editingBudget={editingGoal ? true : null}
                setIcon={setGoalIcon}
              />
            )}

            <View className="mt-4">
              <Text style={{ color: THEME.textSecondary }} className="mb-2">
                Target
              </Text>
              <View
                style={{
                  backgroundColor: THEME.inputBackground,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: THEME.border,
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <Text style={{ color: THEME.textSecondary, fontWeight: "600" }}>
                  $
                </Text>
                <TextInput
                  value={goalTarget}
                  onChangeText={(v) => setGoalTarget(v.replace(/[^0-9.]/g, ""))}
                  keyboardType="numeric"
                  placeholder="Amount"
                  placeholderTextColor={THEME.placeholderText}
                  style={{
                    color: THEME.textPrimary,
                    flex: 1,
                    paddingVertical: 8,
                  }}
                />
              </View>
              <Text
                style={{ color: THEME.placeholderText }}
                className="mt-1 text-sm"
              >
                Tip: Set a realistic target amount you can reach over time.
              </Text>
            </View>

            <View className="mt-6">
              <TouchableOpacity activeOpacity={0.9} onPress={onSubmit}>
                <LinearGradient
                  colors={[THEME.primary, THEME.secondary]}
                  start={[0, 0]}
                  end={[1, 1]}
                  style={{
                    paddingVertical: 14,
                    borderRadius: 10,
                    alignItems: "center",
                  }}
                >
                  <Text style={{ color: THEME.textPrimary, fontWeight: "700" }}>
                    {editingGoal
                      ? saving
                        ? "Updating..."
                        : "Update Goal"
                      : saving
                        ? "Saving..."
                        : "Save Goal"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </SafeAreaView>
      </View>
    </Modal>
  );
}

export default GoalModal;
