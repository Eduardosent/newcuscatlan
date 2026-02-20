import { APP_URL } from '@/config/env';
import { supabase } from '@/config/supabase-client';
import { UserAttributes } from '@supabase/supabase-js';
import { QueryClient } from '@tanstack/react-query';
import { ProfileRepository } from './profile';

export const AuthRepository = {

    async signUpUser({ email, password }: { email: string, password: string }) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
        });
        
        if (error) {
            throw new Error(error.message);
        }
        return data;
    },
    
    async signInUser({ email, password }: { email: string, password: string }) {
        const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });
        
        if (error) {
            throw new Error(error.message);
        }
        return data;
    },

    async signInWithGoogle() {
        const { data, error } = await supabase.auth.signInWithOAuth({
            provider: 'google',
            options: {
                redirectTo: `${APP_URL}/callback`, 
            },
        });

        if (error) {
            throw new Error(error.message);
        }
        return { data };
    },

    async resetPassword(email: string){
        const { data, error } = await supabase.auth.resetPasswordForEmail(email,{
          redirectTo: `${APP_URL}/reset-password`,
        })

        if (error) {
            throw new Error(error.message);
        }
        return data;
    },

    async updateUser(attributes: UserAttributes) {
        const { data, error } = await supabase.auth.updateUser(attributes);

        if (error) throw new Error(error.message);
        return data;
    },
    
    async signOut() {
        const { error } = await supabase.auth.signOut();
        if (error) {
            throw new Error(error.message);
        }
    }
};