export interface Category {
  id: number;
  name: string;
}

export interface DevelopmentLevel {
  id: number;
  name: string;
}

export interface Country {
  id: number;
  name: string;
}

export interface CountryState {
  id: number;
  name: string;
  country_id: number;
  country?: Country; // Opcional por si haces join desde el estado al país
}

// --- Main Property Interface ---

export interface Property {
  id: string; // UUID
  title: string;
  description: string | null;
  price: number;
  size: number;
  
  // Foreign Keys (Raw IDs)
  category_id: number | null;
  development_level_id: number | null;
  country_id: number | null;
  country_state_id: number | null;

  // Contact info
  phone: string | null;
  email: string | null;
  
  // Metadata
  created_at: string; // ISO Date String

  // --- Relaciones Expandidas (Joined Data) ---
  // Estos campos se usan cuando haces un .select('*, categories(*)') en Supabase
  category?: Category;
  development_level?: DevelopmentLevel;
  country?: Country;
  country_state?: CountryState;
}