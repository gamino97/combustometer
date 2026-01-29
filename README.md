# Combustometer ⛽�

Combustometer is a modern, cross-platform mobile application built with Expo and React Native, designed to help vehicle owners track fuel consumption, calculate efficiency, and monitor performance insights over time.

## ✨ Features

- **Garage Management**: Add and manage multiple vehicles with details like name, fuel type, and initial odometer readings.
- **Fuel Logging**: Easily record fuel entries including liters, price, odometer reading, and whether it was a full tank.
- **Efficiency Tracking**: Automatically calculates vehicle efficiency (km/L) and tracks performance trends.
- **Insights & Analytics**: Visual charts and statistics to monitor fuel consumption and spending habits.
- **Historical Data**: Comprehensive history of all fuel entries organized by vehicle.
- **Local Persistence**: Fast and reliable data storage using SQLite and Drizzle ORM.

## 🚀 Tech Stack

- **Framework**: [Expo](https://expo.dev/) (Managed Workflow)
- **Routing**: [Expo Router](https://docs.expo.dev/router/introduction/) (File-based routing)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database**: [SQLite](https://docs.expo.dev/versions/latest/sdk/sqlite/) with [Drizzle ORM](https://orm.drizzle.team/)
- **Forms & Validation**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)
- **UI Components**: Native-optimized components with [Expo Symbols](https://docs.expo.dev/versions/latest/sdk/symbols/) and [Linear Gradient](https://docs.expo.dev/versions/latest/sdk/linear-gradient/)
- **Charts**: [react-native-gifted-charts](https://github.com/Abhinav-Karkare/react-native-gifted-charts)

## 🛠️ Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (LTS)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)
- [Expo Go](https://expo.dev/go) app on your mobile device or an emulator/simulator

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/gamino97/combustometer.git
    cd combustometer
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the development server**:
    ```bash
    npx expo start
    ```

### Running the App

- Scan the QR code with **Expo Go** (Android) or the **Camera app** (iOS).
- Press `a` for Android Emulator.
- Press `i` for iOS Simulator.

## 📂 Project Structure

```text
├── src
│   ├── app             # Expo Router pages and layouts
│   ├── components      # Reusable UI components
│   ├── db              # Drizzle & SQLite configuration
│   │   ├── schema      # Database table definitions
│   ├── hooks           # Custom React hooks (business logic & data fetching)
│   ├── services        # Core business logic and calculations
│   ├── utils           # Helper functions and formatting
│   └── schemas         # Zod validation schemas
├── drizzle             # Generated migrations
└── assets              # Static assets (images, fonts)
```

## 📜 License

Created by **gamino**. Distributed under the MIT License.

