import { api, supabase } from "@/config";
import { Property, PropertyFilters } from "@/types/api";

export const PropertyRepository = {
async getProperties(filters?: PropertyFilters): Promise<Property[]> {
  // 1. Empezamos con la base (Traer todo)
  let query = supabase
    .from('properties')
    .select(`
      *,
      category:categories(id, name),
      development_level:development_levels(id, name),
      country:countries(id, name),
      country_state:country_states(id, name),
      is_favorite:favorites!left(id, user_id)
    `);

  // 2. Solo agregamos filtros si el valor existe y es válido
  if(filters?.title){
    query = query.ilike('title', `%${filters.title}%`);
  }
  if (filters?.category_id) {
    query = query.eq('category_id', filters.category_id);
  }
  if(filters?.minPrice){
    query = query.gte('price', filters.minPrice);
  }
  if(filters?.maxPrice){
    query = query.lte('price', filters.maxPrice);
  }
  if(filters?.minSize){
    query = query.gte('size', filters.minSize);
  }
  if(filters?.maxSize){
    query = query.lte('size', filters.maxSize);
  }

  // 3. Ordenar y ejecutar
  const { data, error } = await query.order('created_at', { ascending: false });

  if (error) throw new Error(error.message);
  return data || [];
},
  async createProperty(request: any) {
    try {
      const formData = new FormData();

      // 1. Mapeo manual para asegurar que los nombres coincidan con formData.get("...") de tu API
      formData.append('title', request.title);
      formData.append('description', request.description);
      formData.append('price', String(request.price));
      formData.append('size', String(request.size));
      formData.append('phone', request.phone);
      formData.append('email', request.email || '');

      // IDs (Tu API usa Number(formData.get(...)), así que enviamos strings)
      formData.append('category_id', String(request.category_id));
      formData.append('development_level_id', String(request.development_level_id));
      formData.append('country_id', String(request.country_id));
      formData.append('country_state_id', String(request.country_state_id));

      // 2. Procesamiento de Imágenes
      // Es vital que el nombre sea "images" para que formData.getAll("images") funcione
      if (request.images && request.images.length > 0) {
        request.images.forEach((file: File) => {
          formData.append('images', file); 
        });
      }

      // 3. Envío
      const { data } = await api.post('/api/properties/create', formData, {
        headers: {
          // Opcional: Axios suele ponerlo solo, pero esto asegura el formato
          'Content-Type': 'multipart/form-data',
        },
      });

      return data;
    } catch (error: any) {
      const message = error.response?.data?.error || error.message || 'Error al crear propiedad';
      throw new Error(message);
    }
  },
};