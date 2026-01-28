import { ThemedText } from "@/components/themed-text";
import { ThemedView } from "@/components/themed-view";
import { useThemeColor } from "@/hooks/use-theme-color";
import { ReactElement } from "react";
import { FlatList, Pressable, StyleSheet } from "react-native";

interface Vehicle {
  id: number;
  name: string;
}

interface VehicleSelectorProps {
  vehicles: Vehicle[];
  selectedVehicleId: number | undefined;
  onSelect: (vehicleId: number) => void;
}

export function VehicleSelector({
  vehicles,
  selectedVehicleId,
  onSelect,
}: VehicleSelectorProps): ReactElement {
  const surfaceBorder = useThemeColor({}, "surfaceBorder");
  const currentId = selectedVehicleId ?? vehicles[0]?.id;

  return (
    <ThemedView style={styles.selectorContainer}>
      <ThemedText style={styles.selectorLabel} type="defaultSemiBold">
        SELECTED VEHICLE
      </ThemedText>
      <FlatList
        horizontal
        data={vehicles}
        showsHorizontalScrollIndicator={false}
        style={styles.vehicleScroll}
        keyExtractor={(v) => v.id.toString()}
        renderItem={({ item: v }) => (
          <Pressable
            onPress={() => onSelect(v.id)}
            style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
          >
            <ThemedView
              style={[
                styles.selector,
                { borderColor: surfaceBorder },
                currentId === v.id && styles.selectedSelector,
              ]}
              lightColor={currentId === v.id ? "#e2e8f0" : "#fff"}
            >
              <ThemedText
                style={[
                  styles.selectorText,
                  currentId === v.id && styles.selectedSelectorText,
                ]}
                type="defaultSemiBold"
              >
                {v.name}
              </ThemedText>
            </ThemedView>
          </Pressable>
        )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  selectedSelector: {
    backgroundColor: "#006c75",
    borderColor: "#006c75",
  },
  selectedSelectorText: {
    color: "#fff",
  },
  selector: {
    borderRadius: 16,
    borderWidth: 1,
    marginRight: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  selectorContainer: {
    gap: 8,
  },
  selectorLabel: {
    fontSize: 10,
    letterSpacing: 1,
    marginLeft: 4,
    opacity: 0.6,
  },
  selectorText: {
    fontSize: 14,
  },
  vehicleScroll: {
    flexDirection: "row",
  },
});
