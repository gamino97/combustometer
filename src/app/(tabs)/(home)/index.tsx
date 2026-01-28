import { FloatingButton } from "@/components/floating-button";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { db } from "@/db";
import { logs } from "@/db/schema";
import { useAppTheme } from "@/hooks/use-app-theme";
import { useVehicles } from "@/hooks/use-vehicles";
import { MaterialIcons } from "@expo/vector-icons";
import { formatRelative } from "date-fns";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { router, useRouter } from "expo-router";
import React, { useMemo } from "react";
import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

const numberFormat = new Intl.NumberFormat("en-US", {
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

type StatCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  accentColor?: string;
  variant?: "primary" | "secondary";
};

function StatCard({
  label,
  value,
  unit,
  accentColor,
  variant = "secondary",
}: StatCardProps): React.ReactElement {
  const { theme, isDark } = useAppTheme();
  const cardStyle = [
    styles.statCard,
    variant === "primary"
      ? styles.statCardPrimary
      : isDark
        ? styles.statCardSecondaryDark
        : styles.statCardSecondaryLight,
  ];
  return (
    <View style={cardStyle}>
      <ThemedText
        style={[
          styles.statLabel,
          accentColor ? { color: accentColor } : undefined,
        ]}
      >
        {label}
      </ThemedText>
      <View style={[styles.rowCenter, { alignItems: "baseline" }]}>
        <ThemedText
          style={[
            styles.statValue,
            variant === "secondary" ? { color: theme.accentOrange } : undefined,
          ]}
        >
          {value}
        </ThemedText>
        {unit && <ThemedText style={styles.statUnit}> {unit}</ThemedText>}
      </View>
    </View>
  );
}

type VehicleCardProps = {
  item: ReturnType<typeof useVehicles>["vehicles"][number];
  isDark: boolean;
  primaryColor: string;
  textColor: string;
};

function VehicleCard({
  item,
  isDark,
  primaryColor,
  textColor,
}: VehicleCardProps): React.ReactElement {
  const router = useRouter();
  const logIcon = item.type === "electric" ? "ev-station" : "local-gas-station";
  const logLabel = item.type === "electric" ? "Log Charge" : "Log Fuel";
  const logTime = formatRelative(new Date(item.lastUpdated), new Date());

  return (
    <View style={[styles.card, isDark ? styles.cardDark : styles.cardLight]}>
      <View style={styles.cardHeader}>
        <View style={styles.cardInfo}>
          <View style={styles.statusRow}>
            <View
              style={[
                styles.statusBadge,
                { backgroundColor: item.statusColor },
              ]}
            >
              <ThemedText
                style={[styles.statusText, { color: item.statusTextColor }]}
              >
                {item.status}
              </ThemedText>
            </View>
            <ThemedText style={styles.lastUpdatedText}>
              Last refueled {logTime}
            </ThemedText>
          </View>
          <ThemedText style={styles.vehicleName}>{item.name}</ThemedText>
          <ThemedText style={styles.odometerText}>
            {numberFormat.format(item.distance)} km • Odometer
          </ThemedText>
        </View>
        <View style={styles.efficiencyContainer}>
          <ThemedText
            style={[styles.efficiencyValue, { color: item.efficiencyColor }]}
          >
            {numberFormat.format(item.efficiency ?? 0)}
          </ThemedText>
          <ThemedText style={styles.efficiencyUnit}>
            {item.efficiencyUnit}
          </ThemedText>
        </View>
      </View>
      <View style={styles.actionsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.logButton,
            { backgroundColor: primaryColor, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={() =>
            router.push({
              pathname: "/add-fuel-entry/[vehicleId]",
              params: { vehicleId: item.id },
            })
          }
        >
          <MaterialIcons name={logIcon} size={18} color="#FFF" />
          <ThemedText style={styles.logButtonText}>{logLabel}</ThemedText>
        </Pressable>
        <Pressable
          style={({ pressed }) => [
            styles.arrowButton,
            isDark ? styles.arrowButtonDark : styles.arrowButtonLight,
            { opacity: pressed ? 0.7 : 1 },
          ]}
          onPress={() => router.push("/(tabs)/history")}
        >
          <MaterialIcons name="arrow-forward" size={20} color={textColor} />
        </Pressable>
      </View>
    </View>
  );
}

export default function HomeScreen(): React.ReactElement {
  const { theme, isDark } = useAppTheme();
  const { vehicles: vehiclesData } = useVehicles();
  const { data: logsData } = useLiveQuery(db.select().from(logs));
  const processedVehicles = useMemo(() => {
    if (!vehiclesData) return [];
    return vehiclesData.map((v) => ({
      id: v.id,
      name: v.name,
      status: v.status,
      statusColor: v.statusColor,
      statusTextColor: v.statusTextColor,
      lastUpdated: v.lastUpdated,
      distance: v.distance,
      efficiency: v.efficiency,
      efficiencyUnit: v.efficiencyUnit,
      efficiencyColor: v.efficiencyColor,
      type: v.type as "gas" | "electric",
    }));
  }, [vehiclesData]);

  const avgEfficiency = useMemo(() => {
    if (processedVehicles.length === 0) return "0.0";
    const total = processedVehicles.reduce((acc, v) => acc + v.efficiency, 0);
    return (total / processedVehicles.length).toFixed(1);
  }, [processedVehicles]);

  const renderHeader = (): React.ReactElement => (
    <View style={styles.contentContainer}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.statsScrollContent}
        style={styles.statsScroll}
      >
        <StatCard
          label="TOTAL FLEET"
          value={`${processedVehicles.length} Vehicles`}
          accentColor={theme.primary}
          variant="primary"
        />
        <StatCard
          label="AVG. EFFICIENCY"
          value={avgEfficiency}
          unit="km/L"
          accentColor="#8dc9ce"
        />
        <StatCard
          label="TOTAL LOGS"
          value={logsData?.length || 0}
          accentColor="#8dc9ce"
        />
      </ScrollView>
    </View>
  );

  /* New implementations */
  const renderHeaderRight = (): React.ReactElement => (
    <View style={styles.headerIcons}>
      <TouchableOpacity
        style={[
          styles.iconButton,
          isDark ? styles.iconButtonDark : styles.iconButtonLight,
        ]}
      >
        <MaterialIcons name="search" size={20} color={theme.text} />
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.iconButton,
          isDark ? styles.iconButtonDark : styles.iconButtonLight,
        ]}
      >
        <MaterialIcons name="settings" size={20} color={theme.text} />
      </TouchableOpacity>
    </View>
  );

  return (
    <ScreenLayout
      title="My Garage"
      rightAction={renderHeaderRight()}
      style={styles.container}
    >
      <FlatList
        data={processedVehicles}
        renderItem={({ item }) => (
          <VehicleCard
            item={item}
            isDark={isDark}
            primaryColor={theme.primary}
            textColor={theme.text}
          />
        )}
        keyExtractor={(item) => item.id.toString()}
        ListHeaderComponent={renderHeader}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
      />
      <FloatingButton onPress={() => router.push("/add-vehicle")} />
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  actionsRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 16,
    marginTop: 24,
    zIndex: 10,
  },
  arrowButton: {
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    height: 44,
    justifyContent: "center",
    width: 44,
  },
  arrowButtonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  arrowButtonLight: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  card: {
    borderRadius: 16,
    borderWidth: 1,
    elevation: 2,
    marginBottom: 20,
    marginHorizontal: 24,
    overflow: "hidden",
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  cardDark: {
    backgroundColor: "#232E2F",
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  cardInfo: {
    flex: 1,
  },
  cardLight: {
    backgroundColor: "#FFFFFF",
    borderColor: "#e2e8f0",
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingVertical: 24,
  },
  efficiencyContainer: {
    alignItems: "flex-end",
  },
  efficiencyUnit: {
    color: "#8dc9ce",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  efficiencyValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },

  iconButton: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    width: 40,
  },
  iconButtonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  iconButtonLight: {
    backgroundColor: "#f1f5f9",
  },
  lastUpdatedText: {
    color: "#8dc9ce",
    fontSize: 12,
    fontWeight: "500",
  },
  listContent: {
    gap: 20,
    paddingBottom: 100, // Space for FAB
  },
  logButton: {
    alignItems: "center",
    borderRadius: 8,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    justifyContent: "center",
    paddingVertical: 12,
  },
  logButtonText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "700",
  },
  odometerText: {
    color: "#8dc9ce",
    fontSize: 14,
    fontWeight: "500",
  },
  rowCenter: {
    alignItems: "flex-start",
    flexDirection: "row",
  },
  statCard: {
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 140,
    padding: 12,
  },
  statCardPrimary: {
    backgroundColor: "rgba(0, 108, 117, 0.1)",
    borderColor: "rgba(0, 108, 117, 0.2)",
  },
  statCardSecondaryDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  statCardSecondaryLight: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
  statLabel: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.5,
    marginBottom: 4,
    textTransform: "uppercase",
  },
  statUnit: {
    fontSize: 12,
    fontWeight: "400",
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  statsScroll: {
    paddingLeft: 24,
  },
  statsScrollContent: {
    gap: 16,
    paddingRight: 24,
  },
  statusBadge: {
    borderRadius: 4,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  statusRow: {
    alignItems: "center",
    flexDirection: "row",
    gap: 8,
    marginBottom: 8,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
});
