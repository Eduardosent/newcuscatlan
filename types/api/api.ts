export interface Profile {
  id: string;
  role: 'admin' | 'publisher' | 'client';
  full_name: string | null;
  avatar_url: string | null;
  email: string;
}

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