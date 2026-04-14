import React from "react";
import { View, Text, TouchableOpacity, Platform } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useTheme } from "@/hooks/useRedux";

type Props = {
  /** Called after the guard check passes (budget exists for this month). */
  onNewTransaction: () => void;
  onNewBudget: () => void;
};

/**
 * Modern quick actions component with gradient buttons and enhanced visual design.
 * Provides shortcuts for the most common actions: add transaction / add budget.
 */
export default function QuickActions({ onNewTransaction, onNewBudget }: Props) {
  const { THEME } = useTheme();

  return (
    <View style={{ marginBottom: 24 }}>
      {/* Section header */}
      <View
        style={{ flexDirection: "row", alignItems: "center", marginBottom: 16 }}
      >
        <Text
          style={{
            color: THEME.textPrimary,
            fontSize: 16,
            fontWeight: "800",
            flex: 1,
          }}
        >
          Quick Actions
        </Text>
        <Feather name="zap" size={18} color={THEME.primary} />
      </View>

      {/* Actions grid */}
      <View style={{ flexDirection: "row", gap: 12 }}>
        {/* New Transaction Button */}
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={onNewTransaction}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[THEME.primary, THEME.secondary]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Background decorative element */}
            <View
              style={{
                position: "absolute",
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                top: -30,
                right: -30,
              }}
            />

            {/* Content */}
            <View style={{ zIndex: 1, alignItems: "center" }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <MaterialIcons name="payment" size={26} color="white" />
              </View>

              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "700",
                  textAlign: "center",
                  letterSpacing: 0.3,
                }}
              >
                New Transaction
              </Text>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: 12,
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                Log your spending
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>

        {/* New Budget Button */}
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={onNewBudget}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={[THEME.secondary, THEME.primary]}
            start={{ x: 1, y: 0 }}
            end={{ x: 0, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 20,
              alignItems: "center",
              overflow: "hidden",
            }}
          >
            {/* Background decorative element */}
            <View
              style={{
                position: "absolute",
                width: 100,
                height: 100,
                borderRadius: 50,
                backgroundColor: "rgba(255, 255, 255, 0.1)",
                bottom: -30,
                left: -30,
              }}
            />

            {/* Content */}
            <View style={{ zIndex: 1, alignItems: "center" }}>
              <View
                style={{
                  width: 50,
                  height: 50,
                  borderRadius: 12,
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginBottom: 12,
                }}
              >
                <MaterialIcons
                  name="account-balance-wallet"
                  size={26}
                  color="white"
                />
              </View>

              <Text
                style={{
                  color: "white",
                  fontSize: 14,
                  fontWeight: "700",
                  textAlign: "center",
                  letterSpacing: 0.3,
                }}
              >
                New Budget
              </Text>
              <Text
                style={{
                  color: "rgba(255, 255, 255, 0.7)",
                  fontSize: 12,
                  marginTop: 4,
                  textAlign: "center",
                }}
              >
                Set spending limit
              </Text>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );
}
