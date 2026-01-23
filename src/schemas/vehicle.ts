import { z } from "zod";

export const VehicleSchema = z.object({
  name: z.string().min(1, "Name is required"),
  initialOdometer: z.coerce
    .number("Must be a number")
    .nonnegative("Must be greater than or equal to 0"),
  type: z.enum(["gas", "electric"]),
});

export type VehicleData = z.infer<typeof VehicleSchema>;
