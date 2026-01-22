import { z } from "zod";

export const fuelEntrySchema = z.object({
  odometer: z.coerce
    .number("Must be a number")
    .int("Must be a whole number")
    .positive("Must be greater than 0"),
  liters: z.coerce
    .number("Must be a number")
    .positive("Must be greater than 0"),
  pricePerLiter: z.coerce
    .number("Must be a number")
    .positive("Must be greater than 0"),
  isFullTank: z.boolean(),
  date: z.date(),
});

export type FuelEntryData = z.infer<typeof fuelEntrySchema>;
