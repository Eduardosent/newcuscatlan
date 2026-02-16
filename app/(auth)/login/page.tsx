'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, type LoginForm } from '@/types/forms/login';
import { useAuth } from '@/hooks';
import { Input } from '@/components/forms';
import { GoogleButton } from '@/components/auth/google-button';
import { Loader2, AlertCircle } from 'lucide-react';
import { useTranslations } from 'next-intl';

export default function LoginPage() {
  const t = useTranslations('Auth.Login');
  const { signIn } = useAuth();
  const [serverError, setServerError] = useState<string | null>(null);
  
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginForm>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginForm) => {
    setServerError(null);
    try {
      await signIn(data.email, data.password);
    } catch (err: any) {
      setServerError(err.message || t('errorMessage'));
    }
  };

  return (
    <div className="bg-white rounded-[32px] shadow-2xl p-8 md:p-10 border border-white max-w-md mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-black text-gray-900 uppercase tracking-tighter">
          {t('title')}
        </h1>
        <p className="text-gray-400 text-sm font-medium mt-1">
          {t('subtitle')}
        </p>
      </div>

      {serverError && (
        <div className="mb-4 flex items-center gap-3 bg-red-50 border border-red-100 text-red-600 p-3 rounded-2xl text-sm font-medium">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p>{serverError}</p>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input 
          label={t('emailLabel')}
          type="email"
          placeholder={t('emailPlaceholder')}
          {...register('email')}
          error={errors.email?.message}
        />

        <div className="space-y-1">
          <Input 
            label={t('passwordLabel')}
            type="password"
            placeholder="••••••••"
            {...register('password')}
            error={errors.password?.message}
          />
          <div className="flex justify-end">
            <Link 
              href="/forgot-password" 
              className="text-xs font-bold text-[#1D4ED8] hover:underline"
            >
              {t('forgotPassword')}
            </Link>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer w-full bg-[#1D4ED8] text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 mt-2 flex justify-center items-center gap-2"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              <span>{t('loadingButton')}</span>
            </>
          ) : (
            t('submitButton')
          )}
        </button>
      </form>

      <div className="mt-6">
        <GoogleButton />
      </div>

      <div className="mt-6 text-center pt-4 border-t border-gray-50">
        <p className="text-gray-400 text-sm font-medium">
          {t('noAccount')}{' '}
          <Link href="/sign-up" className="text-[#1D4ED8] font-bold hover:underline">
            {t('signUp')}
          </Link>
        </p>
      </div>
    </div>
  );
}