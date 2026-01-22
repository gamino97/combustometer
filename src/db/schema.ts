import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const vehicles = sqliteTable("vehicles", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  type: text("type", { enum: ["gas", "electric"] })
    .notNull()
    .default("gas"),
  status: text("status").notNull().default("ACTIVE"),
  statusColor: text("status_color").notNull().default("#006c75"),
  statusTextColor: text("status_text_color").notNull().default("#FFFFFF"),
  distance: integer("distance").notNull().default(0),
  efficiency: real("efficiency").notNull().default(0),
  efficiencyUnit: text("efficiency_unit").notNull(),
  efficiencyColor: text("efficiency_color").notNull().default("#FF7F11"),
  lastUpdated: text("last_updated").notNull(),
});

export const logs = sqliteTable("logs", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  vehicleId: integer("vehicle_id").references(() => vehicles.id),
  odometer: integer("odometer").notNull(),
  liters: real("liters").notNull(),
  pricePerLiter: real("price_per_liter").notNull(),
  isFullTank: integer("is_full_tank", { mode: "boolean" })
    .notNull()
    .default(true),
  date: text("date").notNull(),
});
