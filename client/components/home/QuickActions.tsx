import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons, Feather } from "@expo/vector-icons";
import { useTheme } from "@/hooks/useRedux";

type Props = {
  /** Called after the guard check passes (budget exists for this month). */
  onNewTransaction: () => void;
  onNewBudget: () => void;
};

/**
 * Quick actions component providing shortcuts for the most common actions:
 * add transaction / add budget.
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
          style={{
            flex: 1,
            backgroundColor: THEME.surface,
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            borderColor: THEME.border,
            borderWidth: 1,
          }}
          onPress={onNewTransaction}
          activeOpacity={0.7}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: `${THEME.primary}20`,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <MaterialIcons name="payment" size={22} color={THEME.primary} />
          </View>
          <Text
            style={{
              color: THEME.textPrimary,
              fontSize: 13,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            New Transaction
          </Text>
          <Text
            style={{
              color: THEME.textSecondary,
              fontSize: 11,
              marginTop: 4,
              textAlign: "center",
            }}
          >
            Log spending
          </Text>
        </TouchableOpacity>

        {/* New Budget Button */}
        <TouchableOpacity
          style={{
            flex: 1,
            backgroundColor: THEME.surface,
            borderRadius: 16,
            padding: 16,
            alignItems: "center",
            borderColor: THEME.border,
            borderWidth: 1,
          }}
          onPress={onNewBudget}
          activeOpacity={0.7}
        >
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              backgroundColor: `${THEME.secondary}20`,
              justifyContent: "center",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <MaterialIcons
              name="account-balance-wallet"
              size={22}
              color={THEME.secondary}
            />
          </View>
          <Text
            style={{
              color: THEME.textPrimary,
              fontSize: 13,
              fontWeight: "700",
              textAlign: "center",
            }}
          >
            New Budget
          </Text>
          <Text
            style={{
              color: THEME.textSecondary,
              fontSize: 11,
              marginTop: 4,
              textAlign: "center",
            }}
          >
            Set limit
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}
