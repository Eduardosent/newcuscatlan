import { supabase } from '@/config/supabase-client';
import { DevelopmentLevel } from '@/types/api/api';

export const DevelopmentLevelRepository = {

    async getDevelopmentLevels(): Promise<DevelopmentLevel[]> {
        const { data, error } = await supabase
        .from('development_levels')
        .select("*");
        if (error) throw new Error(error.message);
        return data;
    }
};