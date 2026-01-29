import { FloatingButton } from "@/components/floating-button";
import { ScreenLayout } from "@/components/screen-layout";
import { EfficiencyHero } from "@/components/statistics/efficiency-hero";
import { SpendingChart } from "@/components/statistics/spending-chart";
import { StatGridItem } from "@/components/statistics/stat-grid-item";
import { TrendChart } from "@/components/statistics/trend-chart";
import { VehicleSelector } from "@/components/vehicle-selector";
import { useInsightsData } from "@/hooks/use-insights-data";
import { useVehicles } from "@/hooks/use-vehicles";
import { formatNumber } from "@/utils/format";
import { useRouter } from "expo-router";
import { ReactElement, useMemo, useState } from "react";
import { StyleSheet, View } from "react-native";

export default function InsightsScreen(): ReactElement {
  const { vehicles } = useVehicles();
  const [selectedVehicleId, setSelectedVehicleId] = useState<
    number | undefined
  >(undefined);
  const router = useRouter();

  const selectedVehicle = useMemo(
    () =>
      vehicles.find((v) => v.id === (selectedVehicleId ?? vehicles[0]?.id)) ||
      vehicles[0],
    [vehicles, selectedVehicleId],
  );

  const effectiveId = selectedVehicle?.id;

  const {
    efficiency,
    trend,
    totalDistance,
    totalVolume,
    spendingData,
    trendData,
    totalSpent,
    isLoading,
  } = useInsightsData(effectiveId);

  return (
    <ScreenLayout
      title="Statistics & Insights"
      scrollable
      contentContainerStyle={styles.content}
      style={styles.layout}
    >
      <VehicleSelector
        vehicles={vehicles}
        selectedVehicleId={selectedVehicleId}
        onSelect={setSelectedVehicleId}
      />

      {!isLoading && (
        <>
          <EfficiencyHero avgEfficiency={efficiency} trend={trend} />

          <TrendChart data={trendData} />

          <SpendingChart data={spendingData} totalSpent={totalSpent} />

          <View style={styles.statsGrid}>
            <StatGridItem
              label="Distance"
              value={formatNumber(totalDistance)}
              unit="km"
              icon="route"
            />
            <StatGridItem
              label="Volume"
              value={formatNumber(totalVolume)}
              unit="L"
              icon="oil.barrel"
            />
          </View>

          <FloatingButton
            onPress={() =>
              router.push({
                pathname: "/add-fuel-entry/[vehicleId]",
                params: { vehicleId: selectedVehicle?.id },
              })
            }
          />
        </>
      )}
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    gap: 12,
    padding: 16,
  },
  layout: {},
  statsGrid: {
    flexDirection: "row",
    gap: 16,
  },
});
