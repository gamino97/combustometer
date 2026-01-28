import { useAppTheme } from "@/hooks/use-app-theme";
import React from "react";
import { StyleSheet, View, type ViewProps } from "react-native";

export type CardProps = ViewProps & {
  variant?: "primary" | "secondary";
  accentColor?: string;
};

export function Card({
  style,
  children,
  variant = "secondary",
  accentColor,
  ...props
}: CardProps): React.ReactElement {
  const { theme, isDark } = useAppTheme();

  const cardStyle = [
    styles.card,
    variant === "primary"
      ? {
          backgroundColor: `${theme.primary}1A`, // 0.1 opacity
          borderColor: `${theme.primary}33`, // 0.2 opacity
        }
      : isDark
        ? styles.cardSecondaryDark
        : styles.cardSecondaryLight,
    // Allow overriding background/border if accentColor is provided and it's primary
    variant === "primary" && accentColor
      ? {
          backgroundColor: `${accentColor}1A`,
          borderColor: `${accentColor}33`,
        }
      : undefined,
    style,
  ];

  return (
    <View style={cardStyle} {...props}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 140,
    padding: 20,
  },
  cardSecondaryDark: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
    borderColor: "rgba(255, 255, 255, 0.05)",
  },
  cardSecondaryLight: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderColor: "rgba(0, 0, 0, 0.05)",
  },
});
