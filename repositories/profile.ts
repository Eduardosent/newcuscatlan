import { supabase } from '@/config/supabase-client';
import { Profile } from '@/types/api/api';

export const ProfileRepository = {

    async getProfiles(): Promise<Profile[]> {
    const { data, error } = await supabase.rpc('get_profiles_with_emails');

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },

  async getProfile(userId: string): Promise<Profile> {
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

  async updateProfileRole(userId: string): Promise<Profile> {
    const { data, error } = await supabase.rpc('toggle_user_role', { 
      target_id: userId 
    });

    if (error) {
      throw new Error(error.message);
    }
    return data;
  },
};