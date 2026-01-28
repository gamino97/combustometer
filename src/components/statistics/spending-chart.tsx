import React from "react";
import { StyleSheet, View } from "react-native";

import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { MonthlyData } from "@/hooks/use-insights-data";

interface SpendingChartProps {
  data: MonthlyData[];
  totalSpent: number;
}

export function SpendingChart({
  data,
  totalSpent,
}: SpendingChartProps): React.ReactElement {
  const primaryColor = useThemeColor({}, "primary");
  const surfaceBorder = useThemeColor({}, "surfaceBorder");
  const barInactive = useThemeColor(
    { light: "#e2e8f0", dark: "rgba(255,255,255,0.1)" },
    "background",
  );

  const maxValue = Math.max(...data.map((d) => d.value), 1);

  return (
    <ThemedView
      style={[styles.container, { borderColor: surfaceBorder }]}
      lightColor="#fff"
    >
      <View style={styles.header}>
        <ThemedText style={styles.title} type="defaultSemiBold">
          MONTHLY SPENDING
        </ThemedText>
        <ThemedText style={styles.total} lightColor={primaryColor}>
          ${totalSpent.toFixed(2)} Total
        </ThemedText>
      </View>
      <View style={styles.chartArea}>
        {data.map((item, index) => (
          <View key={index} style={styles.barGroup}>
            <View style={styles.barContainer}>
              <View
                style={[
                  styles.bar,
                  {
                    height: `${(item.value / maxValue) * 100}%`,
                    backgroundColor: item.active ? primaryColor : barInactive,
                  },
                ]}
              />
            </View>
            <ThemedText
              style={[
                styles.monthText,
                item.active && { color: primaryColor, fontWeight: "bold" },
              ]}
            >
              {item.month}
            </ThemedText>
          </View>
        ))}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  bar: {
    borderRadius: 8,
    width: "100%",
  },
  barContainer: {
    height: "100%",
    justifyContent: "flex-end",
    width: "70%",
  },
  barGroup: {
    alignItems: "center",
    flex: 1,
    maxWidth: 60,
  },
  chartArea: {
    alignItems: "flex-end",
    flexDirection: "row",
    height: 120,
    justifyContent: "space-between",
    paddingHorizontal: 8,
  },
  container: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  monthText: {
    fontSize: 10,
    marginTop: 12,
    opacity: 0.6,
  },
  title: {
    fontSize: 10,
    letterSpacing: 1,
    opacity: 0.6,
  },
  total: {
    fontSize: 14,
    fontWeight: "bold",
  },
});
