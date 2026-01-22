import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Resolver, useForm } from "react-hook-form";
import { Alert } from "react-native";

import { FuelEntryData, fuelEntrySchema } from "@/schemas/fuel-entry";
import { addFuelEntry } from "@/services/fuel-entry";
import { useVehicle } from "./use-vehicle";

export const useAddFuelEntry = (vehicleId: number) => {
  const router = useRouter();

  const { vehicle } = useVehicle(vehicleId);

  const form = useForm<FuelEntryData>({
    resolver: zodResolver(fuelEntrySchema) as Resolver<FuelEntryData>,
    values: {
      isFullTank: true,
      pricePerLiter: 0,
      odometer: vehicle?.distance || 0,
      liters: 0,
      date: new Date(),
    },
  });

  const onSubmit = async (data: FuelEntryData) => {
    if (!vehicle) return;
    if (data.odometer <= vehicle.distance) {
      form.setError("odometer", {
        type: "manual",
        message: "Odometer reading must be greater than current odometer",
      });
      return;
    }

    try {
      await addFuelEntry(vehicleId, data);
      Alert.alert("Success", "Entry added successfully");
      router.back();
    } catch (e) {
      console.error(e);
      if (e instanceof Error) {
        Alert.alert("Error", e.message);
      } else {
        Alert.alert("Error", "Failed to save entry");
      }
    }
  };

  return {
    form,
    vehicle,
    submit: form.handleSubmit(onSubmit),
    isSubmitting: form.formState.isSubmitting,
    errors: form.formState.errors,
  };
};
