import { ControlledInput } from "@/components/controlled-input";
import { ThemedText } from "@/components/themed-text";
import { Colors } from "@/constants/theme";
import { useAddVehicle } from "@/hooks/use-add-vehicle";
import { useColorScheme } from "@/hooks/use-color-scheme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { Controller } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddVehicleScreen() {
  const router = useRouter();
  const colorScheme = useColorScheme() ?? "light";
  const theme = Colors[colorScheme];
  const isDark = colorScheme === "dark";
  const insets = useSafeAreaInsets();
  const { form, submit } = useAddVehicle();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar style={isDark ? "light" : "dark"} />

      {/* Header */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top },
          isDark ? styles.headerDark : styles.headerLight,
        ]}
      >
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <MaterialIcons name="chevron-left" size={28} color={theme.primary} />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Add New Vehicle</ThemedText>
        <View style={{ width: 40 }} />
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Hero Section */}
          <View style={styles.heroContainer}>
            <View
              style={[
                styles.heroIconContainer,
                { backgroundColor: "rgba(37, 106, 244, 0.1)" },
              ]}
            >
              <MaterialIcons
                name="directions-car"
                size={56}
                color={theme.primary}
              />
            </View>
            <ThemedText style={styles.heroLabel}>VEHICLE PROFILE</ThemedText>
          </View>

          {/* Form Card */}
          <View
            style={[
              styles.card,
              {
                backgroundColor: isDark ? theme.surface : "#FFFFFF",
                borderColor: theme.surfaceBorder,
              },
            ]}
          >
            {/* Vehicle Name */}
            <ControlledInput
              control={form.control}
              name="name"
              label="Vehicle Name"
              placeholder="e.g., Mazda 3"
              returnKeyType="next"
            />

            {/* Initial Odometer */}
            <ControlledInput
              control={form.control}
              name="initialOdometer"
              label="Initial Odometer Reading"
              placeholder="0"
              keyboardType="numeric"
              returnKeyType="done"
              unit="KM"
            />

            {/* Fuel Type Selection */}
            <View style={styles.inputContainer}>
              <ThemedText style={styles.inputLabel}>Fuel Type</ThemedText>
              <Controller
                control={form.control}
                name="type"
                render={({ field: { onChange, value } }) => (
                  <View style={styles.fuelTypeContainer}>
                    {(["gas", "electric"] as const).map((type) => (
                      <Pressable
                        key={type}
                        onPress={() => onChange(type)}
                        style={[
                          styles.fuelTypeButton,
                          {
                            backgroundColor:
                              value === type
                                ? theme.primary
                                : isDark
                                  ? "#27282C"
                                  : "#fafafa",
                            borderColor:
                              value === type ? theme.primary : "transparent",
                          },
                        ]}
                      >
                        <MaterialIcons
                          name={
                            type === "gas"
                              ? "local-gas-station"
                              : "electric-car"
                          }
                          size={24}
                          color={theme.text}
                        />
                        <ThemedText
                          style={[
                            styles.fuelTypeText,
                            {
                              color: theme.text,
                              fontWeight: value === type ? "700" : "500",
                            },
                          ]}
                        >
                          {type === "gas" ? "Gasoline" : "Electric"}
                        </ThemedText>
                      </Pressable>
                    ))}
                  </View>
                )}
              />
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      {/* Bottom Action */}
      <View
        style={[
          styles.bottomBar,
          {
            paddingBottom: insets.bottom + 20,
            backgroundColor: theme.background,
          },
        ]}
      >
        <Pressable
          style={({ pressed }) => [
            styles.submitButton,
            { backgroundColor: theme.primary, opacity: pressed ? 0.9 : 1 },
          ]}
          onPress={submit}
          disabled={form.formState.isSubmitting}
        >
          <ThemedText style={styles.submitButtonText}>
            {form.formState.isSubmitting
              ? "Registering..."
              : "Register Vehicle"}
          </ThemedText>
          {!form.formState.isSubmitting && (
            <MaterialIcons name="arrow-forward" size={24} color="#FFFFFF" />
          )}
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    marginLeft: -8,
    padding: 8,
  },
  bottomBar: {
    paddingHorizontal: 24,
    paddingTop: 16,
  },
  card: {
    borderRadius: 24,
    borderWidth: 1,
    elevation: 2,
    gap: 24,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  container: {
    flex: 1,
  },
  fuelTypeButton: {
    alignItems: "center",
    borderRadius: 16,
    borderWidth: 1,
    flex: 1,
    flexDirection: "row",
    gap: 8,
    height: 56,
    justifyContent: "center",
  },
  fuelTypeContainer: {
    flexDirection: "row",
    gap: 12,
  },
  fuelTypeText: {
    fontSize: 16,
  },
  header: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerDark: {
    backgroundColor: "rgba(17, 17, 19, 0.8)",
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerLight: {
    backgroundColor: "rgba(250, 250, 250, 0.8)",
    borderBottomColor: "#e2e8f0",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  heroContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  heroIconContainer: {
    alignItems: "center",
    borderRadius: 24,
    height: 96,
    justifyContent: "center",
    marginBottom: 16,
    width: 96,
  },
  heroLabel: {
    color: "#94a3b8",
    fontSize: 14,
    fontWeight: "600",
    letterSpacing: 1,
    textTransform: "uppercase",
  },
  inputContainer: {
    gap: 8,
  },
  inputLabel: {
    color: "#64748b",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 4,
  },
  scrollContent: {
    padding: 24,
  },
  submitButton: {
    alignItems: "center",
    borderRadius: 16,
    elevation: 4,
    flexDirection: "row",
    gap: 8,
    height: 64,
    justifyContent: "center",
    shadowColor: "#256af4",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
});
