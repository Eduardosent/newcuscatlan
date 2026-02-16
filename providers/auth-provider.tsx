'use client'

import React, { createContext, useEffect, useState } from 'react';
import { User, UserAttributes } from '@supabase/supabase-js';
import { supabase } from '@/config/supabase-client';
import { AuthRepository } from '@/repositories/auth';
import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';

interface AuthContextType {
  user: User | null;
  signUp: (email: string, password: string) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateUser: (attributes: UserAttributes) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const queryClient = useQueryClient()
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
 
    const setData = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
      setAuthLoading(false);
    };

    setData();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
      setAuthLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signUp = async (email: string, password: string) => {
    await AuthRepository.signUpUser({ email, password });
  };

  const signIn = async (email: string, password: string) => {
    const result = await AuthRepository.signInUser({ email, password });
    if (result.user) {
      router.replace(await AuthRepository.handleRedirect(result.user.id, queryClient))
    };
  }

  const signInWithGoogle = async () => {
    await AuthRepository.signInWithGoogle();
  };

  const resetPassword = async (email: string) => {
    await AuthRepository.resetPassword(email);
  };

  const updateUser = async (attributes: UserAttributes) => {
    await AuthRepository.updateUser(attributes);
  };

  const signOut = async () => {
    await AuthRepository.signOut();
    setUser(null);
    queryClient.clear()
    router.replace('/login');
  };

  // Si no ha montado en el cliente, devolvemos null para que el servidor 
  // no mande HTML que luego React va a querer cambiar.
  if (!mounted) return null;

  const value = {
    user,
    signUp,
    signIn,
    signInWithGoogle,
    resetPassword,
    updateUser,
    signOut,
    loading: authLoading
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};