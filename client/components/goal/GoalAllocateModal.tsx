import React from "react";
import {
  Modal,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks/useRedux";
import ModalCloseButton from "@/components/global/modalCloseButton";

interface GoalAllocateModalProps {
  openSheet: boolean;
  setOpenSheet: (open: boolean) => void;
  allocateAmount: string;
  setAllocateAmount: (val: string) => void;
  onSubmit: () => void;
  saving: boolean;
}

function GoalAllocateModal({
  openSheet,
  setOpenSheet,
  allocateAmount,
  setAllocateAmount,
  onSubmit,
  saving,
}: GoalAllocateModalProps) {
  const { THEME } = useTheme();

  return (
    <Modal
      visible={openSheet}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView
        style={{
          flex: 1,
          backgroundColor: THEME.background,
          padding: 18,
          position: "relative",
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
            Allocate to Goal
          </Text>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="mt-4">
            <Text style={{ color: THEME.textSecondary }} className="mb-2">
              Amount
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
                value={allocateAmount}
                onChangeText={(v) =>
                  setAllocateAmount(v.replace(/[^0-9.]/g, ""))
                }
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
                  {saving ? "Allocating..." : "Allocate"}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}

export default GoalAllocateModal;
