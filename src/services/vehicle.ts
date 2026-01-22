import { db } from "@/db";
import { vehicles } from "@/db/schema";
import { eq } from "drizzle-orm";

export type NewVehicle = typeof vehicles.$inferInsert;
export type Vehicle = typeof vehicles.$inferSelect;

export const getVehiclesQuery = db
  .select()
  .from(vehicles)
  .orderBy(vehicles.name);

export const getVehicleQuery = (id: number) =>
  db.select().from(vehicles).where(eq(vehicles.id, id));

export const addVehicle = async (vehicle: NewVehicle) => {
  const result = await db.insert(vehicles).values(vehicle);
  return result;
};

export const updateVehicle = async (id: number, vehicle: Partial<NewVehicle>) =>
  db
    .update(vehicles)
    .set({ ...vehicle, lastUpdated: new Date().toISOString() })
    .where(eq(vehicles.id, id))
    .returning();

export const deleteVehicle = async (id: number) =>
  db.delete(vehicles).where(eq(vehicles.id, id)).returning();
