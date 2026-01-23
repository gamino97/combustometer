import { VehicleData, VehicleSchema } from "@/schemas/vehicle";
import { addVehicle } from "@/services/vehicle";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "expo-router";
import { Resolver, useForm } from "react-hook-form";

export const useAddVehicle = () => {
  const router = useRouter();
  const form = useForm<VehicleData>({
    resolver: zodResolver(VehicleSchema) as Resolver<VehicleData>,
    defaultValues: {
      name: "",
      initialOdometer: 0,
      type: "gas",
    },
  });

  const submit = form.handleSubmit(async (data) => {
    try {
      await addVehicle({
        name: data.name,
        distance: Number(data.initialOdometer),
        type: data.type,
        efficiencyUnit: data.type === "gas" ? "L/km" : "Wh/km",
        lastUpdated: new Date().toISOString(),
      });
      router.back();
    } catch (error) {
      console.error(error);
    }
  });

  return { form, submit };
};
