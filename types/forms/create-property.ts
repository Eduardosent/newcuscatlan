import { z } from "zod";

const CategorySchema = z.object({ id: z.number(), name: z.string() });
const DevelopmentLevelSchema = z.object({ id: z.number(), name: z.string() });
const CountrySchema = z.object({ id: z.number(), name: z.string() });
const StateSchema = z.object({ id: z.number(), name: z.string(), country_id: z.number() });

export const propertySchema = z.object({
  title: z.string().min(3, "Required"),
  description: z.string().min(10, "Required"),
  price: z.coerce.number().positive("Must be greater than 0"),
  size: z.coerce.number().positive("Must be greater than 0"),
  category: CategorySchema,
  development_level: DevelopmentLevelSchema,
  country: CountrySchema,
  country_state: StateSchema,
  images: z.array(z.instanceof(File)).min(1, "At least one image is required"),
  phone: z.string().optional().or(z.literal("")),
  email: z.string().email("Invalid email").optional().or(z.literal("")),
});