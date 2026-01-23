---
trigger: always_on
---

Always use this general rules:

# General Code Style & Formatting

- Use English for all code and documentation.
- Use functional and declarative programming patterns; avoid classes.
- Prefer iteration and modularization over code duplication.
- Use descriptive variable names with auxiliary verbs (e.g., isLoading, hasError).
- Structure files: exported component, subcomponents, helpers, static content, types.
- Avoid using any.
- Don't leave blank lines within a function or component.

# Naming Conventions
- Favor named exports for components.
- Use camelCase for variables, functions, and methods (e.g., isUser).
- Use UPPERCASE for environment variables.
- Avoid magic numbers and define constants.
- Use CONSTANT_CASE for constants.
- Files: kebab-case (e.g., `use-color-scheme.ts`, `themed-text.tsx`).
- Components: PascalCase (e.g., `RootLayout`, `ThemedText`).
- Hooks: camelCase starting with `use` (e.g., `useColorScheme`).
- Constants: camelCase or UPPER_SNAKE_CASE for global constants.

# Project Structure & Architecture
- Follow Expo patterns and use the Expo Router.
├── /src
│   ├── /db             # Drizzle & SQLite Configuration
│   │   ├── /schema     # Database table definitions
│   │   └── index.ts   # Database connection setup
│   ├── /components     # Reusable UI (buttons, cards)
│   ├── /hooks          # Custom hooks (e.g., useFuelEntries)
│   ├── /services       # Business logic (Calculations, Sync)
│   └── /utils          # Helpers (Metric conversions, Formatting)

# TypeScript Best Practices
- Use TypeScript for all code; prefer interfaces over types.
- Avoid any and enums; use explicit types and maps instead.
- Use functional components with TypeScript interfaces.
- Enable strict mode in TypeScript for better type safety.
- Use top level src directory.
- Use path aliases for imports.
- Avoid relative imports
- Use 2 spaces for identing.
- Remove all console.log sentences.

# Syntax & Formatting

- Use the function keyword for pure functions.
- Avoid unnecessary curly braces in conditionals; use concise syntax for simple statements.
- Use semicolons at EOL.
- Use Eslint and Prettier from .eslint.config.js

# Functions & Logic

- Avoid deeply nested blocks by:
  - Using early returns.
  - Extracting logic into utility functions.
- Use higher-order functions (map, filter, reduce) to simplify logic.
- Use arrow functions for simple cases (<3 instructions), named functions otherwise.
- Use default parameter values instead of null/undefined checks.
- Use RO-RO (Receive Object, Return Object) for passing and returning multiple parameters.

#Implementation Standards

## Data Validation (Zod)
Define schemas in `src/schemas/` to be used for both Drizzle table definitions and React Hook Form validation.

## Form Handling
Use `react-hook-form` with the Zod resolver. 
- Avoid local state for form inputs.
- Ensure all numeric inputs (liters, price) are cast correctly from strings.

## Database Access
- Use the **Repository Pattern** or custom hooks for database operations.
- Do not call `db.insert()` or `db.select()` directly inside UI components.

# Security
- Sanitize user inputs to prevent XSS attacks.
- Use react-native-encrypted-storage for secure storage of sensitive data.
- Ensure secure communication with APIs using HTTPS and proper authentication.
- Use Expo's Security guidelines to protect your app: https://docs.expo.dev/guides/security/


# Key Conventions

1. Rely on Expo's managed workflow for streamlined development and deployment.
2. Prioritize Mobile Web Vitals (Load Time, Jank, and Responsiveness).
3. Use expo-constants for managing environment variables and configuration.
4. Use expo-permissions to handle device permissions gracefully.
5. Implement expo-updates for over-the-air (OTA) updates.
6. Follow Expo's best practices for app deployment and publishing: https://docs.expo.dev/distribution/introduction/
7. Ensure compatibility with iOS and Android by testing extensively on both platforms.
8. The deployment to the web will not be done in this project.
