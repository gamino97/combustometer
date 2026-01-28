import React from "react";
import { StyleSheet } from "react-native";
import { LineChart } from "react-native-gifted-charts";

import { Card } from "@/components/card";
import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/use-app-theme";

interface TrendChartProps {
  data: { month: string; value: number }[];
}

export function TrendChart({ data }: TrendChartProps): React.ReactElement {
  const { theme } = useAppTheme();

  const chartData = data.map((item) => ({
    value: item.value,
    label: item.month,
  }));

  return (
    <Card>
      <ThemedText style={styles.title} type="defaultSemiBold">
        6-MONTH EFFICIENCY TREND
      </ThemedText>

      <LineChart
        xAxisLength={100}
        data={chartData}
        color={theme.primary}
        thickness={3}
        dataPointsColor={theme.primary}
        dataPointsRadius={4}
        curved
        noOfSections={3}
        xAxisLabelTextStyle={{
          color: theme.text,
          fontSize: 10,
          opacity: 0.4,
          fontWeight: "bold",
        }}
        hideYAxisText
        hideAxesAndRules
        height={120}
        initialSpacing={20}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 10,
    letterSpacing: 1,
    marginBottom: 20,
    opacity: 0.6,
  },
});
