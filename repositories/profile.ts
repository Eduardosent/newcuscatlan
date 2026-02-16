import { supabase } from '@/config/supabase-client';

export const ProfileRepository = {

  async getProfile(userId: string) {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle(); 

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};