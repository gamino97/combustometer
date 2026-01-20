# Agent Guide: Combustometer

This document provides essential information for autonomous agents working on the Combustometer repository. It integrates core project structure, local configuration, and the "Antigravity" rules found in `.agent/rules`.

## 🛠 Build, Lint, and Test Commands

### Development Commands

- **Start Development Server:** `npx expo start`
- **Start Android:** `npx expo start --android`
- **Start iOS:** `npx expo start --ios`
- **Start Web:** `npx expo start --web`

### Quality Control

- **Linting:** `npm run lint` (uses `expo lint` / `eslint-config-expo`)
- **Type Checking:** `npx tsc`
- **Formatting:** The project uses `ts-standard`. `standard.autoFixOnSave` is enabled.

### Testing

_Note: No test suite is currently configured. Verify with the user before adding Jest or Vitest._

---

## 🎨 Code Style & Conventions (Antigravity Rules)

### 1. General Formatting & Syntax

- **Standard JS/TS:** The project follows `ts-standard` / StandardJS style.
- **Indentation:** 2 spaces.
- **Semicolons:** semicolons unless required for syntax disambiguation.
- **Line Length:** Max length of 80 characters.
- **Blank Lines:** Do not leave blank lines within a function or component.
- **Clean Code:** Remove all `console.log` statements. Avoid magic numbers; define constants in `CONSTANT_CASE`.
- **Quotes:** Single quotes (`'`) for strings.
- **Trailing Commas:** Avoid trailing commas where possible (StandardJS default).

### 2. Naming Conventions

- **Files:** kebab-case (e.g., `use-color-scheme.ts`, `themed-text.tsx`).
- **Components:** PascalCase (e.g., `RootLayout`, `ThemedText`).
- **Hooks:** camelCase starting with `use` (e.g., `useColorScheme`).
- **Constants:** camelCase or UPPER_SNAKE_CASE for global constants.

### 3. TypeScript Best Practices

- **Strict Mode:** `strict: true` is enabled in `tsconfig.json`.
- **Typing:** Always use TypeScript. Prefer `interfaces` over `types` for objects. Avoid `any` and `enums`.
- **Returns:** Explicitly define return types for functions (e.g., `React.ReactElement`).
- **Path Aliases:** Always use `@/*` aliases. Avoid relative imports.

### 4. React & React Native

- **Functional Components:** Use the `function` keyword for components. Avoid arrow functions for top-level components.
- **Hooks:** Use custom hooks for reusable logic (stored in `hooks/`). Avoid anonymous functions in render/props.
- **Imports:** Do **not** write `import React from 'react'`.
- **JSX:** Use declarative JSX. Avoid unnecessary curly braces in conditionals.
- **Performance:** Use `FlatList` instead of `map + ScrollView`. Use `react-native-reanimated` for animations.
- **Components:** Follow the `Themed` pattern (e.g., `ThemedView`) to support light/dark modes.

### 5. File Structure

1. Imports (External first, then `@/*`).
2. Exported Component.
3. Subcomponents (if local).
4. Helpers & Static Content.
5. Types/Interfaces.

---

## 📂 Project Structure

- `app/`: Expo Router directory (file-based navigation).
- `components/`: Reusable UI components.
- `constants/`: Theme and configuration constants.
- `hooks/`: Custom React hooks.
- `assets/`: Images and fonts.

## 🤖 Special Instructions for Agents

- **Security:** Sanitize user inputs. Use `expo-constants` for environment variables.
- **Styling:** Use `StyleSheet.create`. **Do not use Tailwind or Nativewind.**
- **Persistence:** Use `expo-sqlite` for persistent storage.
- **Accessibility:** Ensure high a11y standards using native accessibility props.
- **Platform:** Support iOS and Android. Web deployment is not priority.
- **Managed Workflow:** Rely on Expo's managed workflow and prioritize Mobile Web Vitals.
- **Environment:** Always check `app.json` before making changes to app configuration.
- **New Files:** Ensure all new components follow the `Themed` pattern to maintain dark mode compatibility.
- **Dependencies:** Verify if a package is already in `package.json` before suggesting or installing new ones.
