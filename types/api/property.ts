import { Category, Country, CountryState, DevelopmentLevel } from "./api";

export interface Property {
  id: string; // UUID
  title: string;
  description: string | null;
  price: number;
  size: number;
  
  // Foreign Keys (Raw IDs)
  user_id: string;
  category_id: number | null;
  development_level_id: number | null;
  country_id: number | null;
  country_state_id: number | null;

  // Contact info
  phone: string | null;
  email: string | null;
  
  // Metadata
  image_urls: string[];
  created_at: string; // ISO Date String

  // --- Relaciones Expandidas (Joined Data) ---
  // Estos campos se usan cuando haces un .select('*, categories(*)') en Supabase
  category: Category;
  development_level: DevelopmentLevel;
  country: Country;
  country_state: CountryState;
}

export interface PropertyFilters {
  title: string;
  category_id: number | null;
  minPrice: number | null;
  maxPrice: number | null;
  minSize: number | null;
  maxSize: number | null;
}