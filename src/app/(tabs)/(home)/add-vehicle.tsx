import { ControlledInput } from "@/components/controlled-input";
import { ScreenLayout } from "@/components/screen-layout";
import { ThemedText } from "@/components/themed-text";
import { useAddVehicle } from "@/hooks/use-add-vehicle";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialIcons } from "@expo/vector-icons";
import { Controller } from "react-hook-form";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function AddVehicleScreen() {
  const { theme } = useAppTheme();
  const insets = useSafeAreaInsets();
  const { form, submit } = useAddVehicle();

  return (
    <ScreenLayout
      title="Add New Vehicle"
      showBackButton
      scrollable
      contentContainerStyle={styles.scrollContent}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
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
              backgroundColor: theme.surface,
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
                              : theme.unselectButton,
                          borderColor:
                            value === type ? theme.primary : "transparent",
                        },
                      ]}
                    >
                      <MaterialIcons
                        name={
                          type === "gas" ? "local-gas-station" : "electric-car"
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
            <MaterialIcons name="arrow-forward" size={24} color={theme.text} />
          )}
        </Pressable>
      </View>
    </ScreenLayout>
  );
}

const styles = StyleSheet.create({
  bottomBar: {
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
    justifyContent: "center",
    paddingBlock: 20,
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
