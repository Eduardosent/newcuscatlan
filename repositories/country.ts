import { supabase } from '@/config/supabase-client';
import { Country } from '@/types/api/api';

export const CountryRepository = {

    async getCountries(): Promise<Country[]> {
        const { data, error } = await supabase
        .from('countries')
        .select("*");
        if (error) throw new Error(error.message);
        return data;
    }
};