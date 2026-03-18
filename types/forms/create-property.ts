import { z } from "zod";

const CategorySchema = z.object({ id: z.number(), name: z.string() });
const DevelopmentLevelSchema = z.object({ id: z.number(), name: z.string() });
const CountrySchema = z.object({ id: z.number(), name: z.string() });
const StateSchema = z.object({ id: z.number(), name: z.string(), country_id: z.number() });
const LocationCoordsSchema = z.object({
  latitude: z.number().min(-90, "Latitud inválida").max(90, "Latitud inválida"),
  longitude: z.number().min(-180, "Longitud inválida").max(180, "Longitud inválida")
});

export const propertySchema = z.object({
  title: z.string().min(3, "Required"),
  description: z.string().min(10, "Required"),
  price: z.coerce.number().positive("Must be greater than 0"),
  size: z.coerce.number().positive("Must be greater than 0").nullable().optional().or(z.literal("")),
  
  // nullable() permite el estado inicial vacío que necesitas
  category: CategorySchema.nullable().refine(val => val !== null, "Select a category"),
  development_level: DevelopmentLevelSchema.nullable().refine(val => val !== null, "Select a level"),
  country: CountrySchema.nullable().refine(val => val !== null, "Select a country"),
  country_state: StateSchema.nullable().refine(val => val !== null, "Select a state"),
  location_coords: LocationCoordsSchema.nullable().optional(),
  
  images: z.array(z.union([z.instanceof(File), z.string()]))
    .min(1, "At least one image is required"),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});

export type PropertyForm = z.infer<typeof propertySchema>;