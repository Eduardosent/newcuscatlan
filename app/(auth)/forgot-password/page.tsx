'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useAuth } from '@/hooks';
import { Input } from '@/components/forms';
import { Loader2, AlertCircle, CheckCircle2, ArrowLeft } from 'lucide-react';
import { useTranslations } from 'next-intl';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: "Invalid email address" }),
});

type ForgotPasswordForm = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordPage() {
  const t = useTranslations('Auth.ForgotPassword');
  const { resetPassword } = useAuth();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<ForgotPasswordForm>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordForm) => {
    setServerError(null);
    try {
      await resetPassword(data.email);
      setIsSubmitted(true);
    } catch (err: any) {
      setServerError(err.message || t('errorMessage'));
    }
  };

  if (isSubmitted) {
    return (
      <div className="bg-white rounded-[32px] shadow-2xl p-8 md:p-10 border border-white max-w-md mx-auto text-center">
        <div className="flex justify-center mb-6">
          <div className="p-4 bg-green-50 rounded-full">
            <CheckCircle2 className="w-12 h-12 text-green-500" />
          </div>
        </div>
        <h1 className="text-2xl font-black text-gray-900 uppercase tracking-tighter mb-2">
          {t('successTitle')}
        </h1>
        <p className="text-gray-400 text-sm font-medium mb-8">
          {t('successMessage')} <span className="text-gray-900 font-bold">{getValues('email')}</span>
        </p>
        <Link 
          href="/login" 
          className="inline-flex items-center gap-2 text-[#1D4ED8] font-bold hover:underline"
        >
          <ArrowLeft className="w-4 h-4" />
          {t('backToLogin')}
        </Link>
      </div>
    );
  }

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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Input 
          label={t('emailLabel')}
          type="email"
          placeholder={t('emailPlaceholder')}
          {...register('email')}
          error={errors.email?.message}
        />

        <button
          type="submit"
          disabled={isSubmitting}
          className="cursor-pointer w-full bg-[#1D4ED8] text-white py-4 rounded-2xl font-black text-lg hover:bg-blue-700 transition-all shadow-lg shadow-blue-500/20 active:scale-[0.98] disabled:opacity-70 flex justify-center items-center gap-2"
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

      <div className="mt-8 text-center pt-4 border-t border-gray-50">
        <Link href="/login" className="text-gray-400 text-sm font-bold hover:text-gray-600 inline-flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" />
          {t('backToLogin')}
        </Link>
      </div>
    </div>
  );
}