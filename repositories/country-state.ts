import { supabase } from '@/config/supabase-client';
import { CountryState } from '@/types/api/api';

export const CountryStateRepository = {

    async getCountryStates(): Promise<CountryState[]> {
        const { data, error } = await supabase
        .from('country_states')
        .select("*");
        if (error) throw new Error(error.message);
        return data;
    }
};