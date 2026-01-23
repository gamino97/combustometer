import { ThemedText } from "@/components/themed-text";
import { useAppTheme } from "@/hooks/use-app-theme";
import { MaterialIcons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { StatusBar } from "expo-status-bar";
import React from "react";
import {
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenLayoutProps = ViewProps & {
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  showBackButton?: boolean;
  rightAction?: React.ReactNode;
  scrollable?: boolean;
  contentContainerStyle?: ViewStyle;
};

export function ScreenLayout({
  title,
  subtitle,
  children,
  showBackButton = false,
  rightAction,
  scrollable = false,
  contentContainerStyle,
  style,
  ...props
}: ScreenLayoutProps): React.ReactElement {
  const router = useRouter();
  const { theme, isDark } = useAppTheme();
  const insets = useSafeAreaInsets();

  const Container = scrollable ? ScrollView : View;
  const containerProps = scrollable
    ? { contentContainerStyle: [styles.scrollContent, contentContainerStyle] }
    : { style: [styles.flex1, contentContainerStyle] };

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
        <View style={styles.leftContainer}>
          {showBackButton ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.backButton}
            >
              <MaterialIcons
                name="chevron-left"
                size={28}
                color={theme.primary}
              />
              <ThemedText style={[styles.backText, { color: theme.primary }]}>
                Back
              </ThemedText>
            </TouchableOpacity>
          ) : (
            <ThemedText style={styles.headerTitle}>{title}</ThemedText>
          )}
        </View>

        {showBackButton ? (
          <View style={styles.centerContainer}>
            {subtitle && (
              <ThemedText style={styles.headerSubtitle}>{subtitle}</ThemedText>
            )}
            <ThemedText style={styles.headerTitleCenter}>{title}</ThemedText>
          </View>
        ) : null}

        <View style={styles.rightContainer}>{rightAction}</View>
      </View>

      {/* Content */}
      <Container {...containerProps} {...props} style={style}>
        {children}
      </Container>
    </View>
  );
}

const styles = StyleSheet.create({
  backButton: {
    alignItems: "center",
    flexDirection: "row",
    paddingVertical: 8,
  },
  backText: {
    fontSize: 16,
    fontWeight: "500",
    marginLeft: -4,
  },
  centerContainer: {
    alignItems: "center",
  },
  container: {
    flex: 1,
  },
  flex1: {
    flex: 1,
  },
  header: {
    alignItems: "center",
    borderBottomWidth: 1,
    flexDirection: "row",
    height: 100, // Fixed height for consistency including safe area
    justifyContent: "space-between",
    paddingBottom: 12,
    paddingHorizontal: 16,
  },
  headerDark: {
    backgroundColor: "rgba(21, 30, 31, 0.95)",
    borderBottomColor: "rgba(255, 255, 255, 0.05)",
  },
  headerLight: {
    backgroundColor: "rgba(249, 250, 250, 0.95)",
    borderBottomColor: "#e2e8f0",
  },
  headerSubtitle: {
    color: "#94a3b8",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  headerTitleCenter: {
    fontSize: 16,
    fontWeight: "800",
  },
  leftContainer: {
    alignItems: "flex-start",
    flex: 1,
    justifyContent: "center",
  },
  rightContainer: {
    alignItems: "flex-end",
    flex: 1,
    justifyContent: "center",
  },
  scrollContent: {
    flexGrow: 1,
  },
});
