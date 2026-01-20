import { MaterialIcons } from "@expo/vector-icons";
import { StatusBar } from "expo-status-bar";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import React, { useMemo } from "react";
import {
  FlatList,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { db } from "@/db";
import { vehicles, logs } from "@/db/schema";
import { useColorScheme } from "@/hooks/use-color-scheme";

interface Vehicle {
  id: number;
  name: string;
  status: string;
  statusColor: string;
  statusTextColor: string;
  lastUpdated: string;
  distance: string;
  efficiency: string;
  efficiencyUnit: string;
  efficiencyColor: string;
  type: "gas" | "electric";
}

type StatCardProps = {
  label: string;
  value: string | number;
  unit?: string;
  isDark: boolean;
  accentColor?: string;
  variant?: "primary" | "secondary";
};

function StatCard({
  label,
  value,
  unit,
  isDark,
  accentColor,
  variant = "secondary",
}: StatCardProps): React.ReactElement {
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
            variant === "secondary" ? { color: "#FF7F11" } : undefined,
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
  item: Vehicle;
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
  const logIcon = item.type === "electric" ? "ev-station" : "local-gas-station";
  const logLabel = item.type === "electric" ? "Log Charge" : "Log Fuel";

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
              {item.lastUpdated}
            </ThemedText>
          </View>
          <ThemedText style={styles.vehicleName}>{item.name}</ThemedText>
          <ThemedText style={styles.odometerText}>
            {item.distance} km • Odometer
          </ThemedText>
        </View>
        <View style={styles.efficiencyContainer}>
          <ThemedText
            style={[styles.efficiencyValue, { color: item.efficiencyColor }]}
          >
            {item.efficiency}
          </ThemedText>
          <ThemedText style={styles.efficiencyUnit}>
            {item.efficiencyUnit}
          </ThemedText>
        </View>
      </View>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.logButton, { backgroundColor: primaryColor }]}
          activeOpacity={0.9}
        >
          <MaterialIcons name={logIcon} size={18} color="#FFF" />
          <ThemedText style={styles.logButtonText}>{logLabel}</ThemedText>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.arrowButton,
            isDark ? styles.arrowButtonDark : styles.arrowButtonLight,
          ]}
          activeOpacity={0.7}
        >
          <MaterialIcons name="arrow-forward" size={20} color={textColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

export default function HomeScreen(): React.ReactElement {
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";

  const { data: vehiclesData } = useLiveQuery(db.select().from(vehicles));

  const { data: logsData } = useLiveQuery(db.select().from(logs));

  const processedVehicles = useMemo(() => {
    if (!vehiclesData) return [];

    return vehiclesData.map((v) => {
      const vehicleLogs = logsData?.filter((l) => l.vehicleId === v.id) || [];
      let efficiencyValue = "0.0";

      if (vehicleLogs.length > 0) {
        const totalDistance = vehicleLogs.reduce(
          (acc, l) => acc + (l.distance || 0),
          0,
        );
        const totalAmount = vehicleLogs.reduce(
          (acc, l) => acc + (l.amount || 0),
          0,
        );
        if (totalAmount > 0) {
          efficiencyValue = (totalDistance / totalAmount).toFixed(1);
        }
      }

      return {
        id: v.id,
        name: v.name,
        status: v.status,
        statusColor: v.statusColor,
        statusTextColor: v.statusTextColor,
        lastUpdated: v.lastUpdated,
        distance: v.distance.toLocaleString(),
        efficiency: efficiencyValue,
        efficiencyUnit: v.efficiencyUnit,
        efficiencyColor: v.efficiencyColor,
        type: v.type as "gas" | "electric",
      };
    });
  }, [vehiclesData, logsData]);

  const avgEfficiency = useMemo(() => {
    if (processedVehicles.length === 0) return "0.0";
    const total = processedVehicles.reduce(
      (acc, v) => acc + parseFloat(v.efficiency),
      0,
    );
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
          isDark={isDark}
          accentColor={theme.primary}
          variant="primary"
        />

        <StatCard
          label="AVG. EFFICIENCY"
          value={avgEfficiency}
          unit="km/L"
          isDark={isDark}
          accentColor="#8dc9ce"
        />

        <StatCard
          label="TOTAL LOGS"
          value={logsData?.length || 0}
          isDark={isDark}
          accentColor="#8dc9ce"
        />
      </ScrollView>
    </View>
  );

  return (
    <SafeAreaView
      style={[styles.container, { backgroundColor: theme.background }]}
      edges={["top", "left", "right"]}
    >
      <StatusBar style={isDark ? "light" : "dark"} />

      <View
        style={[styles.header, isDark ? styles.headerDark : styles.headerLight]}
      >
        <ThemedText style={styles.headerTitle}>My Garage</ThemedText>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            style={[
              styles.iconButton,
              isDark ? styles.iconButtonDark : styles.iconButtonLight,
            ]}
          >
            <MaterialIcons
              name="search"
              size={20}
              color={isDark ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.iconButton,
              isDark ? styles.iconButtonDark : styles.iconButtonLight,
            ]}
          >
            <MaterialIcons
              name="settings"
              size={20}
              color={isDark ? "#FFF" : "#000"}
            />
          </TouchableOpacity>
        </View>
      </View>

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

      <View style={styles.fabContainer}>
        <TouchableOpacity
          style={[
            styles.fab,
            {
              backgroundColor: theme.primary,
              shadowColor: theme.primary,
            },
          ]}
          onPress={async () => {
            // Quick test to seed data if empty
            if (processedVehicles.length === 0) {
              await db.insert(vehicles).values({
                name: "Mazda 3",
                type: "gas",
                efficiencyUnit: "KM/L AVG",
                lastUpdated: "Just now",
              });
            }
          }}
        >
          <MaterialIcons name="add" size={32} color="#FFF" />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  headerDark: {
    backgroundColor: "rgba(21, 30, 31, 0.95)",
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerLight: {
    backgroundColor: "rgba(249, 250, 250, 0.95)",
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerIcons: {
    flexDirection: "row",
    gap: 16,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  iconButtonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  iconButtonLight: {
    backgroundColor: "#f1f5f9",
  },
  contentContainer: {
    paddingVertical: 24,
  },
  statsScroll: {
    paddingLeft: 24,
  },
  statsScrollContent: {
    gap: 16,
    paddingRight: 24,
  },
  statCard: {
    minWidth: 140,
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
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
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 20,
    fontWeight: "800",
  },
  statUnit: {
    fontSize: 12,
    fontWeight: "400",
  },
  rowCenter: {
    flexDirection: "row",
    alignItems: "flex-start",
  },
  listContent: {
    paddingBottom: 100, // Space for FAB
    gap: 20,
  },
  card: {
    marginHorizontal: 24,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  cardDark: {
    backgroundColor: "#232E2F",
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardLight: {
    backgroundColor: "#FFFFFF",
    borderColor: "#e2e8f0",
  },
  cardHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    zIndex: 10,
  },
  cardInfo: {
    flex: 1,
  },
  statusRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 8,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "700",
  },
  lastUpdatedText: {
    fontSize: 12,
    color: "#8dc9ce",
    fontWeight: "500",
  },
  vehicleName: {
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  odometerText: {
    fontSize: 14,
    color: "#8dc9ce",
    fontWeight: "500",
  },
  efficiencyContainer: {
    alignItems: "flex-end",
  },
  efficiencyValue: {
    fontSize: 24,
    fontWeight: "800",
  },
  efficiencyUnit: {
    fontSize: 10,
    fontWeight: "700",
    color: "#8dc9ce",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  actionsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    marginTop: 24,
    zIndex: 10,
  },
  logButton: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logButtonText: {
    color: "#FFF",
    fontWeight: "700",
    fontSize: 14,
  },
  arrowButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 8,
    borderWidth: 1,
  },
  arrowButtonDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.1)",
  },
  arrowButtonLight: {
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    borderColor: "rgba(0, 0, 0, 0.1)",
  },
  fabContainer: {
    position: "absolute",
    bottom: 24,
    right: 24,
    zIndex: 50,
  },
  fab: {
    width: 64,
    height: 64,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 8,
  },
});
