import { Card } from "@/components/card";
import { ThemedText } from "@/components/themed-text";
import { MonthlyData } from "@/hooks/use-insights-data";
import { useThemeColor } from "@/hooks/use-theme-color";
import { formatCurrency } from "@/utils/format";
import React from "react";
import { StyleSheet, View } from "react-native";
import { BarChart } from "react-native-gifted-charts";
interface SpendingChartProps {
  data: MonthlyData[];
  totalSpent: number;
}

export function SpendingChart({
  data,
  totalSpent,
}: SpendingChartProps): React.ReactElement {
  const primaryColor = useThemeColor({}, "primary");
  const textColor = useThemeColor({}, "text");
  const barData = data.map((item) => ({
    value: item.value,
    label: item.month,
    frontColor: primaryColor,
  }));
  return (
    <Card>
      <View style={styles.header}>
        <ThemedText style={styles.title} type="defaultSemiBold">
          MONTHLY SPENDING
        </ThemedText>
        <ThemedText style={styles.total} lightColor={primaryColor}>
          {formatCurrency(totalSpent)} Total
        </ThemedText>
      </View>
      <View style={styles.chartWrapper}>
        <BarChart
          data={barData}
          barWidth={32}
          spacing={24}
          initialSpacing={12}
          height={120}
          hideRules
          yAxisThickness={0}
          xAxisThickness={0}
          barBorderRadius={6}
          hideYAxisText
          xAxisLabelTextStyle={{
            color: textColor,
            fontSize: 10,
            opacity: 0.6,
            marginTop: 4,
          }}
          disablePress
        />
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  chartWrapper: {
    alignItems: "center",
    justifyContent: "center",
  },
  header: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
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
