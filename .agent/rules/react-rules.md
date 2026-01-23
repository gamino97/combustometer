---
trigger: glob
globs: **/*.jsx,**/*.tsx
---

Apply this rules when editing a React Native File

# React Native & Expo rules

- Use functional components with hooks.
- Follow a consistent folder structure (components, screens, navigation, services, hooks, utils).
- Use Expo Router for screen navigation
- Use FlatList for rendering lists instead of map + ScrollView
- Use custom hooks for reusable logic, inside hooks folder.
- Implement proper error boundaries and loading states
- Use declarative JSX.
- Avoid anonymous functions in render and prop handlers.
- Do not write "import React from 'react'"

# Naming Conventions

- Use CamelCase for React Components

# Syntax & Formatting

- Use max-len of 80.
- Use standard-ts to format the code.

# Styling & UI

- Use Expo's built-in components for common UI patterns and layouts.
- Ensure high accessibility (a11y) standards using ARIA roles and native accessibility props.
- Use react-native-reanimated and react-native-gesture-handler for performant animations and gestures.
- Extract shared UI into reusable components in components/.
- Follow this order when reusing UI components: first, use Expo's built-in components; then custom components.
- Do not use Tailwind or Nativewind

# Data Fetching & Forms

- Use expo-sqlite to save things in persistent storage.

Component Typing:

- Use React.FC or function components with typed props
- Define prop interfaces for all components
- Use ViewProps, TextProps for extending native components
- Type StyleSheet.create() properly
- Use Animated.Value types for animations

# State Management & Logic

- Use React Context for state management.

# Preformance & UI Responsiveness

- Use React Native’s useWindowDimensions for responsiveness.
- Leverage FlatList, SectionList with optimized props (keyExtractor, getItemLayout, initialNumToRender).

# Internationalization (i18n)

- Use react-i18next or expo-localization for internationalization and localization.
- Support english and spanish languages and RTL layouts.
- Ensure text scaling and font adjustments for accessibility.

# Project Setup:

- Use Expo CLI
- Configure tsconfig.json for React Native
- Use path aliases for cleaner imports
- Use @types/react-native for type definitions
- Use ESLint for React Native
