import { supabase } from '@/config/supabase-client';
import { Category } from '@/types/api/api';

export const CategoryRepository = {

    async getCategories(): Promise<Category[]> {
        const { data, error } = await supabase
        .from('categories')
        .select("*");
        if (error) throw new Error(error.message);
        return data;
    }
};