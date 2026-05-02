import React, {useEffect, useState} from "react";
import { View, Text } from "react-native";
import { useTheme, useUser } from "@/hooks/useRedux";
import AnimatedNumber from "react-native-animated-numbers";

type Props = {
  monthlyIncome: number;
  totalSpent: number;
  monthLabel: string;
};

export default function DashboardOverview({
  monthlyIncome,
  totalSpent,
  monthLabel,
}: Props) {
  const { THEME } = useTheme();
  const user = useUser();
  const currency = user?.currency || "USD";

  const remaining = monthlyIncome - totalSpent;


  const [animatedIncome, setAnimatedIncome] = useState(0);
  const [animatedSpend, setAnimatedSpend] = useState(0);
  const [animatedRemaining, setAnimatedRemaining] = useState(0);
    useEffect(() => {
        setAnimatedIncome(monthlyIncome);
        setAnimatedSpend(totalSpent);
        setAnimatedRemaining(remaining);
    }, [monthlyIncome, totalSpent, remaining]);


  // Calculate remaining budget

  return (

      <View>
        <View style={{ marginBottom: 24 }}>
        {/* Month label */}
        <Text
          style={{
            color: THEME.textSecondary,
            fontSize: 13,
            fontWeight: "600",
            marginBottom: 8,
          }}
        >
          {monthLabel.toUpperCase()}
        </Text>

        {/* Main content */}
        <View style={{ zIndex: 1 }}>
          {/* Income section */}
          <View style={{ marginBottom: 24 }}>
            <Text
              style={{
                color: THEME.textPrimary,
                fontSize: 13,
                fontWeight: "500",
                marginBottom: 6,
              }}
            >
              Monthly Income
            </Text>
            <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                <AnimatedNumber includeComma animationDuration={800} animateToNumber={animatedIncome} fontStyle={{                    color: THEME.textPrimary,
                    fontSize: 42,
                    fontWeight: "900",
                    letterSpacing: -1,}} />
              <Text
                style={{
                  color: THEME.textPrimary,
                  fontSize: 16,
                  fontWeight: "600",
                  marginLeft: 8,
                }}
              >
                {currency}
              </Text>
            </View>
          </View>
        </View>
    </View>
    <View style={{ marginBottom: 24 }}>

                {/* Spent vs Remaining */}
                <View
                    style={{ flexDirection: "row", justifyContent: "space-between" }}
                >
                    <View>
                        <Text
                            style={{
                                color: THEME.textSecondary,
                                fontSize: 12,
                                fontWeight: "500",
                                marginBottom: 4,
                            }}
                        >
                            Spent This Month
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "baseline" }}>

                                <AnimatedNumber includeComma animationDuration={800} animateToNumber={animatedSpend} fontStyle={{                    color: THEME.textPrimary,
                                    fontSize: 24,
                                    fontWeight: "700",
                                    letterSpacing: -1,}} />

                            <Text
                                style={{
                                    color: THEME.textPrimary,
                                    fontSize: 12,
                                    fontWeight: "600",
                                    marginLeft: 6,
                                }}
                            >
                                {currency}
                            </Text>
                        </View>
                    </View>
                    <View style={{ alignItems: "flex-end" }}>
                        <Text
                            style={{
                                color: THEME.textSecondary,
                                fontSize: 12,
                                fontWeight: "500",
                                marginBottom: 4,
                            }}
                        >
                            Remaining
                        </Text>
                        <View style={{ flexDirection: "row", alignItems: "baseline" }}>
                            <AnimatedNumber includeComma animationDuration={800} animateToNumber={animatedRemaining} fontStyle={{                    color: THEME.textPrimary,
                                fontSize: 24,
                                fontWeight: "700",
                                letterSpacing: -1,}} />
                            <Text
                                style={{
                                    color: "rgba(255, 255, 255, 0.7)",
                                    fontSize: 12,
                                    fontWeight: "600",
                                    marginLeft: 6,
                                }}
                            >
                                {currency}
                            </Text>
                        </View>
                    </View>
                </View>
        </View>
      </View>
  );
}
