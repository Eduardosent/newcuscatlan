import { createClient } from '@supabase/supabase-js';

// Este cliente NUNCA debe llegar al frontend. 
// La Service Role Key salta CUALQUIER regla de RLS.
export const supabaseServer = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! ?? "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InlhZGVqaXlyaXd3d2FhcW5lbnBjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2NDI2MDM1MiwiZXhwIjoyMDc5ODM2MzUyfQ.-CALi_01z6pcvD9PgZjdH9WV_-Wsnrn_dX8S_NXh5mI" // Asegúrate de que esta NO tenga NEXT_PUBLIC_
);