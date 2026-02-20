'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation'; 
import { supabase } from '@/config/supabase-client'; 
import { useQueryClient } from '@tanstack/react-query';

export default function AuthCallbackPage() {
    const router = useRouter();
    const queryClient = useQueryClient();

    useEffect(() => {
        const exchangeCode = async () => {
            const searchParams = new URLSearchParams(window.location.search);
            const code = searchParams.get('code');

            if (code) {
                const { data, error } = await supabase.auth.exchangeCodeForSession(code);               
                if (error || !data.user) {
                    return router.replace('/login?error=auth_failed');
                }
                try {
                    router.replace('/properties');
                } catch (err) {
                    router.replace('/properties');
                }
            } else {
                router.replace('/login');
            }
        };

        exchangeCode();
    }, [router, queryClient]);

    return (
        <div className="flex justify-center items-center h-screen bg-white font-black uppercase">
            Finalizing secure login...
        </div>
    );
}